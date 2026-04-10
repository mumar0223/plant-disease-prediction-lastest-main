"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mode } from "@/lib/model";
import { Chatbot } from "./Chatbot";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface PlantResultProps {
  disease: string;
}

export function PlantResult({ disease }: PlantResultProps) {

  const [markdown, setMarkdown] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "details";

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setMarkdown("");
      setIsStreaming(true);
      try {
        const response = await fetch(`/api/detail_${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disease }),
        });

        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let loop = true;

        while (loop && active) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMarkdown((prev) => prev + chunk);
        }
      } catch (err) {
        console.error("Stream error", err);
      } finally {
        if (active) setIsStreaming(false);
      }
    };

    fetchDetail();
    return () => {
      active = false;
    };
  }, [disease, mode]);

  return (
    <div className="flex flex-col h-full bg-white rounded-[var(--radius)]">
      <div className="border-b border-[var(--border)] pb-5 pt-2 flex items-start gap-4">
        <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl shrink-0 bg-[var(--leaf-light)]">
          🌿
        </div>
        <div>
          <h3 className="font-[var(--font-serif)] text-[20px] font-semibold text-[var(--ink)] mb-1.5">
            {disease}
          </h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-[var(--leaf-light)] text-[var(--leaf)]">
            Plant Detected
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[var(--border)] pt-4 px-2 select-none">
        <button
          onClick={() => setTab("details")}
          className={`px-4 py-2 text-[14px] font-medium border-b-2 transition-colors ${activeTab === "details" ? "border-[var(--leaf)] text-[var(--leaf)]" : "border-transparent text-[var(--ink3)] hover:text-[var(--ink)]"}`}
        >
          Diagnosis Details
        </button>
        <button
          onClick={() => setTab("chat")}
          className={`px-4 py-2 text-[14px] font-medium border-b-2 transition-colors ${activeTab === "chat" ? "border-[var(--leaf)] text-[var(--leaf)]" : "border-transparent text-[var(--ink3)] hover:text-[var(--ink)]"}`}
        >
          Chat Assistant
        </button>
      </div>

      <div className="flex-1 mt-4 px-2 pb-4 overflow-hidden">
        <div className={`h-full ${activeTab === "details" ? "overflow-y-auto hide-scrollbar" : "hidden"}`}>
          <div className="prose prose-sm max-w-none text-[var(--ink2)] prose-headings:font-[var(--font-serif)] prose-headings:text-[var(--ink)] prose-a:text-[var(--leaf)]">
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[var(--ink3)] my-8">
                <span className="w-4 h-4 border-2 border-[var(--border)] border-t-[var(--leaf)] rounded-full animate-spin"></span>
                Generating details...
              </div>
            )}
          </div>
        </div>

        <div className={`h-full ${activeTab === "chat" ? "" : "hidden"}`}>
          <Chatbot disease={disease} />
        </div>
      </div>
    </div>
  );
}
