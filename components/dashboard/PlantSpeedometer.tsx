"use client";

import { useEffect, useState, useRef } from "react";

interface PlantSpeedometerProps {
  plant: number;
  nonPlant: number;
}

export function PlantSpeedometer({ plant, nonPlant }: PlantSpeedometerProps) {
  const total = plant + nonPlant;
  const plantPct = total > 0 ? (plant / total) * 100 : 50;

  const [animatedPct, setAnimatedPct] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1400;
    startTimeRef.current = null;
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(eased * plantPct);
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [plantPct]);

  const size = 240;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Arc path for half circle (left to right)
  const arcPath = `M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`;
  const circumference = Math.PI * radius;

  // Plant portion (green, from left)
  const plantDash = (animatedPct / 100) * circumference;
  // Non-plant portion (amber, from right)
  const nonPlantDash = ((100 - animatedPct) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-md)]">
      <h3 className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--ink)] mb-2">
        Plant vs Non-Plant
      </h3>
      <p className="text-[12px] text-[var(--ink3)] mb-4">
        Image classification distribution
      </p>

      <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
        <svg
          width={size}
          height={size / 2 + 10}
          viewBox={`0 0 ${size} ${size / 2 + 10}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--bg2)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Green (plant) arc — from left */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--leaf)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${plantDash} ${circumference}`}
          />

          {/* Amber (non-plant) arc — from right, reverse direction */}
          <path
            d={`M ${size - strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 0 ${strokeWidth / 2} ${center}`}
            fill="none"
            stroke="var(--amber)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${nonPlantDash} ${circumference}`}
          />

          {/* Separator needle at the split point */}
          {(() => {
            const angle = Math.PI - (animatedPct / 100) * Math.PI;
            const innerR = radius - strokeWidth / 2 - 4;
            const outerR = radius + strokeWidth / 2 + 4;
            const ix = center + innerR * Math.cos(angle);
            const iy = center - innerR * Math.sin(angle);
            const ox = center + outerR * Math.cos(angle);
            const oy = center - outerR * Math.sin(angle);
            return (
              <line
                x1={ix} y1={iy} x2={ox} y2={oy}
                stroke="var(--card)" strokeWidth={3} strokeLinecap="round"
              />
            );
          })()}

          {/* Labels at edges */}
          <text x={strokeWidth / 2} y={center + 24} textAnchor="middle"
            className="text-[11px] fill-[var(--ink3)]" style={{ fontFamily: "var(--font-sans)" }}>
            0%
          </text>
          <text x={size - strokeWidth / 2} y={center + 24} textAnchor="middle"
            className="text-[11px] fill-[var(--ink3)]" style={{ fontFamily: "var(--font-sans)" }}>
            100%
          </text>
          <text x={center} y={16} textAnchor="middle"
            className="text-[11px] fill-[var(--ink3)]" style={{ fontFamily: "var(--font-sans)" }}>
            50%
          </text>
        </svg>

        {/* Center display */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <button
            onClick={() => setShowCount(!showCount)}
            className="text-[13px] text-[var(--leaf)] font-medium underline underline-offset-2 decoration-dotted cursor-pointer bg-transparent border-none hover:text-[var(--leaf-mid)] transition-colors"
          >
            {showCount ? "Show %" : "Show counts"}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--leaf)]" />
          <span className="text-[13px] font-semibold text-[var(--ink2)]">
            {showCount ? `${plant} plants` : `${animatedPct.toFixed(1)}%`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--amber)]" />
          <span className="text-[13px] font-semibold text-[var(--ink2)]">
            {showCount ? `${nonPlant} non-plants` : `${(100 - animatedPct).toFixed(1)}%`}
          </span>
        </div>
      </div>

      {total === 0 && (
        <p className="text-[12px] text-[var(--ink3)] mt-2 italic">No data yet — run some diagnoses!</p>
      )}
    </div>
  );
}
