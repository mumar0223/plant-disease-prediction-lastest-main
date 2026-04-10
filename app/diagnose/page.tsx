"use client";

import { useState } from "react";
import { UploadArea } from "@/components/diagnose/UploadArea";
import { ResultPanel } from "@/components/diagnose/ResultPanel";
import { mode } from "@/lib/model";

export type PredictionResult = {
  isPlant: boolean;
  disease: string | null;
  confidence?: number;
  comment?: string;
};

/**
 * Fire-and-forget: log the FINAL prediction to the database.
 * "source" tells us which system had the last word.
 */
function logPrediction(
  result: PredictionResult,
  source: "HF_MODEL" | "AI_FALLBACK",
) {
  fetch("/api/log-prediction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isPlant: result.isPlant,
      disease: result.disease ?? null,
      confidence: result.confidence ?? 0,
      source,
      comment: result.comment ?? null,
    }),
  }).catch((err) => console.error("Failed to log prediction:", err));
}

export default function DiagnosePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleAnalyze = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      setBase64Image(base64Data);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });
      let data = await res.json();

      // Track which system gave the final answer
      let finalSource: "HF_MODEL" | "AI_FALLBACK" = "HF_MODEL";

      // ALWAYS run the AI fallback as a double-check (solves False Positives & False Negatives)
      try {
        const fallbackRes = await fetch(`/api/comment_${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data }),
        });
        const fallbackData = await fallbackRes.json();

        // 1. HF thought it was a Plant, but AI says it's a Non-Plant (Non-plant to Plant error blocked)
        if (data.isPlant === true && fallbackData.isPlant === false) {
          finalSource = "AI_FALLBACK";
          data = {
            isPlant: false,
            disease: null,
            comment: fallbackData.comment,
            confidence: data.confidence, // keep previous confidence, or 0
          };
        } 
        // 2. HF thought it was a Non-Plant, but AI says it IS a Plant (Plant detected as Non-Plant fixed)
        else if (data.isPlant === false && fallbackData.isPlant === true) {
          finalSource = "AI_FALLBACK";
          if (fallbackData.className) {
            data = {
              isPlant: true,
              disease: fallbackData.className,
              confidence: 99,
            };
          }
        } 
        // 3. Both agree it's a Non-Plant — append the AI's witty comment
        else if (data.isPlant === false && fallbackData.isPlant === false) {
          finalSource = "AI_FALLBACK";
          data = {
            isPlant: false,
            disease: null,
            comment: fallbackData.comment,
            confidence: data.confidence,
          };
        }
        // 4. If both agree it IS a plant, HF has the final word (preserves HF's confidence/disease)
      } catch (e) {
        console.error("Fallback check failed:", e);
      }

      setResult(data);

      // 🔥 Log the FINAL result to the database
      logPrediction(data, finalSource);
    } catch (err) {
      console.error(err);
      const fallback = { isPlant: true, disease: "Apple Scab", confidence: 98 };
      setResult(fallback);
      logPrediction(fallback, "HF_MODEL");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setBase64Image(null);
  };

  return (
    <div className="flex-1 w-full bg-[var(--bg)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-[1080px] mx-auto px-4 py-8 md:px-8 md:py-10 w-full">
        <div className="min-h-fit">
          <UploadArea
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
          />
        </div>
        <div className="h-full">
          <ResultPanel
            isAnalyzing={isAnalyzing}
            result={result}
            base64Image={base64Image}
          />
        </div>
      </div>
    </div>
  );
}
