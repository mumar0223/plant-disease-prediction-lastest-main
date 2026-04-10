"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Play } from "lucide-react";

interface UploadAreaProps {
  onAnalyze: (file: File) => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function UploadArea({
  onAnalyze,
  onClear,
  isAnalyzing,
}: UploadAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear();
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-8 shadow-[var(--shadow)] flex flex-col h-full overflow-y-auto hide-scrollbar">
      <h2 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--ink)] mb-1.5">
        Diagnose Your Plant
      </h2>
      <p className="text-[14px] text-[var(--ink2)] font-light">
        Upload a clear image of an affected leaf for instant AI analysis.
      </p>

      {!preview ? (
        <div
          className={`mt-4 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 relative ${isDragging ? "border-[var(--leaf)] bg-[var(--leaf-light)]" : "border-[var(--border-strong)] bg-[var(--bg)] hover:border-[var(--leaf)] hover:bg-[var(--leaf-light)]"}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-14 h-14 bg-[var(--leaf-light)] rounded-xl flex items-center justify-center mx-auto mb-4 text-[var(--leaf)]">
            <UploadCloud size={28} />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--ink)] mb-1.5">
            Drop your leaf photo here
          </h3>
          <p className="text-[13px] text-[var(--ink3)] font-light">
            or{" "}
            <strong className="text-[var(--leaf)] font-semibold">
              click to browse
            </strong>{" "}
            · PNG, JPG up to 10MB
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl overflow-hidden relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full block max-h-[280px] object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute top-2.5 right-2.5 bg-black/60 text-white border-none rounded-md px-2.5 py-1.5 text-[12px] cursor-pointer flex items-center gap-1 hover:bg-black/80 transition-colors"
          >
            <X size={14} /> Remove
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0])
            handleFile(e.target.files[0]);
        }}
        accept="image/*"
        className="hidden"
      />

      <div className="mt-6 bg-[var(--amber-light)] rounded-xl py-4 px-5 border-l-[3px] border-[var(--amber)]">
        <h4 className="text-[13px] font-semibold text-[var(--amber)] mb-2.5 uppercase tracking-wide">
          Tips for Best Results
        </h4>
        <ul className="flex flex-col gap-1.5 list-none m-0 p-0">
          <li className="text-[13px] text-[#6B4F1A] font-normal flex items-start gap-2 before:content-['✓'] before:text-[var(--amber)] before:font-bold">
            Photograph a single leaf on a plain background
          </li>
          <li className="text-[13px] text-[#6B4F1A] font-normal flex items-start gap-2 before:content-['✓'] before:text-[var(--amber)] before:font-bold">
            Ensure good natural lighting — avoid harsh shadows
          </li>
          <li className="text-[13px] text-[#6B4F1A] font-normal flex items-start gap-2 before:content-['✓'] before:text-[var(--amber)] before:font-bold">
            Capture the disease spot clearly and in focus
          </li>
        </ul>
      </div>

      <button
        disabled={!file || isAnalyzing}
        onClick={() => file && onAnalyze(file)}
        className="w-full mt-5 bg-[var(--leaf)] text-white border-none p-4 rounded-xl text-[16px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-2.5 hover:bg-[#2d5518] disabled:opacity-45 disabled:cursor-not-allowed"
      >
        <Play size={18} />
        Analyze Leaf
      </button>
    </div>
  );
}
