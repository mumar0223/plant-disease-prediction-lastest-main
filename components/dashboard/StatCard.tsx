"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string; // CSS variable name like "var(--leaf)"
  delay?: number; // stagger entrance (ms)
}

export function StatCard({ icon, label, value, sub, color, delay = 0 }: StatCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-all duration-500 hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Decorative gradient blob */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-15 blur-2xl"
        style={{ background: color }}
      />

      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink3)] mb-1">
            {label}
          </p>
          <p
            className="text-[26px] font-bold leading-tight"
            style={{ color }}
          >
            {value}
          </p>
          {sub && (
            <p className="text-[12px] text-[var(--ink3)] mt-1 truncate">{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}
