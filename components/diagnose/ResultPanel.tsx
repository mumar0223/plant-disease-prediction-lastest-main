"use client";

import { PredictionResult } from "@/app/diagnose/page";
import { PlantResult } from "./PlantResult";
import { NonPlantResult } from "./NonPlantResult";
import { Sparkles } from "lucide-react";

interface ResultPanelProps {
  isAnalyzing: boolean;
  result: PredictionResult | null;
  base64Image?: string | null;
}

export function ResultPanel({
  isAnalyzing,
  result,
  base64Image,
}: ResultPanelProps) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 md:p-8 shadow-[var(--shadow)] flex flex-col h-full overflow-hidden">
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center min-h-[380px] gap-5">
          <div className="w-[52px] h-[52px] border-[3px] border-[var(--border)] border-t-[var(--leaf)] rounded-full animate-[spin_0.9s_linear_infinite]" />
          <div className="text-center">
            <p className="text-[15px] text-[var(--ink2)] font-normal mb-1">
              Analyzing leaf patterns…
            </p>
            <p className="text-[13px] text-[var(--ink3)] font-light">
              Running inference on 38 disease classes
            </p>
          </div>
        </div>
      )}

      {!isAnalyzing && !result && (
        <div className="flex flex-col items-center justify-center min-h-[380px] text-center text-[var(--ink3)] gap-4">
          <Sparkles size={48} className="opacity-30" />
          <div>
            <h3 className="text-[16px] font-medium mb-1.5 text-[var(--ink2)]">
              Awaiting Image
            </h3>
            <p className="text-[13px] font-light">
              Upload a leaf photo to begin diagnosis
            </p>
          </div>
        </div>
      )}

      {!isAnalyzing && result && (
        <>
          {result.isPlant ? (
            <PlantResult disease={result.disease || "Unknown"} />
          ) : (
            <NonPlantResult
              base64Image={base64Image}
              comment={result.comment}
            />
          )}
        </>
      )}
    </div>
  );
}
