"use client";



interface NonPlantResultProps {
  base64Image?: string | null;
  comment?: string;
}

export function NonPlantResult({ base64Image, comment }: NonPlantResultProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] text-center gap-6">
      <div className="w-[80px] h-[80px] bg-[var(--amber-light)] text-[var(--amber)] rounded-full flex items-center justify-center text-4xl">
        🤔
      </div>
      <div>
        <h3 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--ink)] mb-3">
          Not a Plant
        </h3>
        <p className="text-[16px] text-red-600 font-medium max-w-sm leading-relaxed px-4 py-3 bg-red-50 rounded-lg border border-red-100">
          {comment || "That item looks great, but it's not a plant! Please upload a valid leaf image."}
        </p>
      </div>
    </div>
  );
}
