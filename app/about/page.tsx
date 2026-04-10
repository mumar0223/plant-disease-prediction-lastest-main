"use client";

import { useState } from "react";

export default function About() {
  const [showAll, setShowAll] = useState(false);

  const CLASS_NAMES = [
    "Apple Scab",
    "Apple Black Rot",
    "Cedar Apple Rust",
    "Apple Healthy",
    "Blueberry Healthy",
    "Cherry Healthy",
    "Cherry Powdery Mildew",
    "Corn Cercospora Leaf Spot",
    "Corn Common Rust",
    "Corn Healthy",
    "Corn Northern Leaf Blight",
    "Grape Black Rot",
    "Grape Esca",
    "Grape Healthy",
    "Grape Leaf Blight",
    "Orange Huanglongbing (Citrus Greening)",
    "Peach Bacterial Spot",
    "Peach Healthy",
    "Pepper Bacterial Spot",
    "Pepper Healthy",
    "Potato Early Blight",
    "Potato Healthy",
    "Potato Late Blight",
    "Raspberry Healthy",
    "Soybean Healthy",
    "Squash Powdery Mildew",
    "Strawberry Healthy",
    "Strawberry Leaf Scorch",
    "Tomato Bacterial Spot",
    "Tomato Early Blight",
    "Tomato Healthy",
    "Tomato Late Blight",
    "Tomato Leaf Mold",
    "Tomato Septoria Leaf Spot",
    "Tomato Spider Mites",
    "Tomato Target Spot",
    "Tomato Mosaic Virus",
    "Tomato Yellow Leaf Curl Virus",
    "Brownspot",
    "Hispa",
    "Leaf Blast",
    "Rust",
    "Powdery",
    "Healthy Leaf",
  ];

  // show only first 10 initially
  const visibleData = showAll ? CLASS_NAMES : CLASS_NAMES.slice(0, 10);

  // Helper to map crop types to the specific tag colors in your CSS
  const getCropStyles = (cropName: string) => {
    switch (cropName) {
      case "Apple":
        return "bg-[#FCE8E8] text-[#9B2020]";
      case "Corn":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "Tomato":
        return "bg-[#FDE8D8] text-[#9A3412]";
      case "Potato":
        return "bg-[#EEE8FE] text-[#5B21B6]";
      case "Pepper":
        return "bg-[#ECFDF5] text-[#065F46]";
      default:
        return "bg-gray-100 text-[#5A5548]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1C1A14] font-sans pb-16">
      <div className="py-[64px] px-[2rem] max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-[52px]">
          <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-bold text-[#1C1A14] mb-3 tracking-tight">
            About AgroVision
          </h1>
          <p className="text-[17px] text-[#5A5548] font-light leading-[1.7] max-w-[600px]">
            A deep learning system built to make expert-level plant disease
            diagnosis accessible to every farmer — from smallholders to large
            agricultural operations.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-[52px]">
          {/* Card 1 */}
          <div className="bg-white border border-[#3C321E]/10 rounded-[14px] p-7">
            <div className="w-[44px] h-[44px] bg-[#EAF3DE] rounded-[10px] flex items-center justify-center text-[22px] mb-4">
              🌿
            </div>
            <h3 className="text-[16px] font-semibold text-[#1C1A14] mb-2">
              Our Mission
            </h3>
            <p className="text-[14px] text-[#5A5548] leading-[1.65] font-light">
              Reduce crop loss worldwide by making early disease detection fast,
              free, and available on any smartphone — no agronomist needed.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#3C321E]/10 rounded-[14px] p-7">
            <div className="w-[44px] h-[44px] bg-[#E1F5EE] rounded-[10px] flex items-center justify-center text-[22px] mb-4">
              🧠
            </div>
            <h3 className="text-[16px] font-semibold text-[#1C1A14] mb-2">
              The Technology
            </h3>
            <p className="text-[14px] text-[#5A5548] leading-[1.65] font-light">
              A convolutional neural network trained on 87,000+ high-quality
              leaf images, achieving over 95% accuracy across 38 disease
              categories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#3C321E]/10 rounded-[14px] p-7">
            <div className="w-[44px] h-[44px] bg-[#FAEEDA] rounded-[10px] flex items-center justify-center text-[22px] mb-4">
              🌾
            </div>
            <h3 className="text-[16px] font-semibold text-[#1C1A14] mb-2">
              Real-World Impact
            </h3>
            <p className="text-[14px] text-[#5A5548] leading-[1.65] font-light">
              Designed for field use — works offline-friendly, handles common
              smartphone photo conditions, and provides actionable treatment
              guidance.
            </p>
          </div>
        </div>

        {/* Dataset Section */}
        <div className="bg-white border border-[#3C321E]/10 rounded-[14px] p-9 mb-9">
          <h2 className="font-serif text-[24px] font-semibold text-[#1C1A14] mb-5">
            Dataset Overview
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#F7F4EE] rounded-[10px] p-5 text-center">
              <span className="font-serif text-[30px] font-bold text-[#3A6B1E] block">
                87,000+
              </span>
              <span className="text-[12px] text-[#9A9186] uppercase tracking-[0.5px] mt-1 font-normal">
                Total Images
              </span>
            </div>
            <div className="bg-[#F7F4EE] rounded-[10px] p-5 text-center">
              <span className="font-serif text-[30px] font-bold text-[#3A6B1E] block">
                38
              </span>
              <span className="text-[12px] text-[#9A9186] uppercase tracking-[0.5px] mt-1 font-normal">
                Disease Classes
              </span>
            </div>
            <div className="bg-[#F7F4EE] rounded-[10px] p-5 text-center col-span-2 sm:col-span-1">
              <span className="font-serif text-[30px] font-bold text-[#3A6B1E] block">
                14
              </span>
              <span className="text-[12px] text-[#9A9186] uppercase tracking-[0.5px] mt-1 font-normal">
                Crop Types
              </span>
            </div>
          </div>

          <p className="text-[14px] text-[#5A5548] font-light leading-[1.65] mb-6">
            The training dataset includes high-resolution images of infected and
            healthy plant leaves, carefully standardized and balanced across all
            categories to prevent model bias toward more common diseases.
          </p>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr>
                  <th className="p-[10px_14px] bg-[#F7F4EE] text-[#5A5548] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#3C321E]/10">
                    Disease / Condition
                  </th>
                  <th className="p-[10px_14px] bg-[#F7F4EE] text-[#5A5548] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#3C321E]/10">
                    Crop
                  </th>
                  <th className="p-[10px_14px] bg-[#F7F4EE] text-[#5A5548] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#3C321E]/10">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleData.map((item, i) => {
                  const words = item.split(" ");
                  const crop = words[0]; // Naive parsing for simplicity

                  // Clean up disease name (remove crop name)
                  let conditionName = item.replace(crop, "").trim() || item;

                  // Parse Type
                  const isHealthy = item.toLowerCase().includes("healthy");
                  const type = isHealthy
                    ? "Healthy"
                    : item.toLowerCase().includes("bacterial")
                      ? "Bacterial"
                      : item.toLowerCase().includes("virus")
                        ? "Viral"
                        : item.toLowerCase().includes("mite")
                          ? "Pest"
                          : "Fungal"; // Defaulting to fungal for the rest as per original HTML structure

                  return (
                    <tr
                      key={i}
                      className="border-b border-[#3C321E]/10 hover:bg-[#F7F4EE] last:border-b-0 transition-colors"
                    >
                      <td className="p-[10px_14px] text-[#1C1A14]">
                        {conditionName}
                      </td>
                      <td className="p-[10px_14px]">
                        <span
                          className={`inline-block px-[9px] py-[2px] rounded-[20px] text-[11px] font-semibold ${getCropStyles(crop)}`}
                        >
                          {crop}
                        </span>
                      </td>
                      <td className="p-[10px_14px] text-[#1C1A14]">
                        {type === "Healthy" ? (
                          <span className="inline-block px-[9px] py-[2px] rounded-[20px] text-[11px] font-semibold bg-[#EAF3DE] text-[#3A6B1E]">
                            Healthy
                          </span>
                        ) : (
                          type
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-7 py-[13px] bg-transparent border-[1.5px] border-[#3C321E]/20 text-[#1C1A14] rounded-[8px] text-[15px] font-medium hover:bg-[#F7F4EE] hover:border-[#9A9186] transition-all"
            >
              {showAll ? "Show Less" : "Load All Categories"}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#EAF3DE] rounded-[14px] p-[28px_32px] border-l-[4px] border-[#3A6B1E]">
          <h3 className="text-[17px] font-semibold text-[#3A6B1E] mb-[10px]">
            Disclaimer
          </h3>
          <p className="text-[14px] text-[#2d4a18] leading-[1.7] font-light">
            AgroVision is an AI-assisted tool intended to support — not replace
            — professional agronomic advice. Always consult a certified plant
            pathologist or agricultural extension officer before applying
            treatments, especially for large-scale interventions.
          </p>
        </div>
      </div>
    </div>
  );
}
