"use client";

import { useEffect, useState, useRef } from "react";

interface AccuracyGaugeProps {
  value: number; // 0-100
  label?: string;
}

export function AccuracyGauge({
  value,
  label = "Model Accuracy",
}: AccuracyGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Animate from 0 to value over 1.5 seconds
  useEffect(() => {
    const duration = 1500;
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(eased * value);
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value]);

  const size = 240;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // half circle
  const center = size / 2;

  // Color zones
  const getColor = (v: number) => {
    if (v >= 95) return "#3A6B1E"; // leaf green
    if (v >= 85) return "#BA7517"; // amber
    return "#A32D2D"; // red
  };

  const color = getColor(animatedValue);
  const dashOffset = circumference - (animatedValue / 100) * circumference;

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div
      className="relative flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-md)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--ink)] mb-2">
        {label}
      </h3>
      <p className="text-[12px] text-[var(--ink3)] mb-4">
        Weighted average starting from 97.5% baseline
      </p>

      <div className="relative" style={{ width: size, height: size / 2 + 65 }}>
        <svg
          width={size}
          height={size / 2 + 10}
          viewBox={`0 0 ${size} ${size / 2 + 10}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
            fill="none"
            stroke="var(--bg2)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke 0.3s ease" }}
          />

          {/* Tick labels */}
          {ticks.map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const x = center + (radius + 20) * Math.cos(angle);
            const y = center - (radius + 20) * Math.sin(angle);
            return (
              <text
                key={tick}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] fill-[var(--ink3)]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {tick}
              </text>
            );
          })}

          {/* Needle */}
          {(() => {
            const needleAngle = Math.PI - (animatedValue / 100) * Math.PI;
            const needleLen = radius - 20;
            const nx = center + needleLen * Math.cos(needleAngle);
            const ny = center - needleLen * Math.sin(needleAngle);
            return (
              <>
                <line
                  x1={center}
                  y1={center}
                  x2={nx}
                  y2={ny}
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <circle cx={center} cy={center} r={6} fill={color} />
                <circle cx={center} cy={center} r={3} fill="white" />
              </>
            );
          })()}
        </svg>

        {/* Center value */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-[36px] font-bold" style={{ color }}>
            {animatedValue.toFixed(1)}
          </span>
          <span className="text-[16px] font-semibold text-[var(--ink3)]">
            %
          </span>
        </div>
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full bg-[var(--ink)] text-white text-[12px] px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
          Exact: {value.toFixed(2)}% · Baseline: 97.5%
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--ink)] rotate-45" />
        </div>
      )}

      {/* Color legend */}
      <div className="flex items-center gap-4 mt-4 text-[11px] text-[var(--ink3)]">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A32D2D]" /> &lt;85%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BA7517]" /> 85–95%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3A6B1E]" /> &gt;95%
        </span>
      </div>
    </div>
  );
}
