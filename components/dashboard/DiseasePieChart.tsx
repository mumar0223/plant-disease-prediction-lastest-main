"use client";

import { useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DiseaseData {
  name: string;
  count: number;
}

interface DiseasePieChartProps {
  data: DiseaseData[];
}

// Curated color palette — earthy, agricultural, harmonious
const COLORS = [
  "#3A6B1E", // leaf green
  "#639922", // leaf-mid
  "#BA7517", // amber
  "#0F6E56", // teal
  "#A32D2D", // red
  "#6B4F1A", // brown
  "#8B5CF6", // violet
  "#0891B2", // cyan
  "#D97706", // orange
  "#DC2626", // crimson
  "#059669", // emerald
  "#7C3AED", // purple
  "#2563EB", // blue
  "#CA8A04", // gold
  "#334155", // slate
  "#EC4899", // pink
  "#14B8A6", // teal-light
  "#F97316", // tangerine
  "#6366F1", // indigo
  "#84CC16", // lime
];

// Custom active shape for hover interaction
const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Center text */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill="var(--ink)" fontSize={14} fontWeight={700}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--ink2)" fontSize={12}>
        {value} scans
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill="var(--ink3)" fontSize={11}>
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

export function DiseasePieChart({ data }: DiseasePieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  // If a disease is selected, filter to show only that one highlighted
  const displayData = selectedDisease
    ? data.map((d) => ({
        ...d,
        count: d.name === selectedDisease ? d.count : d.count,
      }))
    : data;

  // Limit to top 12 diseases + "Other" bucket
  const sortedData = [...displayData].sort((a, b) => b.count - a.count);
  let chartData: DiseaseData[];
  if (sortedData.length > 12) {
    const top12 = sortedData.slice(0, 12);
    const otherCount = sortedData.slice(12).reduce((sum, d) => sum + d.count, 0);
    chartData = [...top12, { name: "Other", count: otherCount }];
  } else {
    chartData = sortedData;
  }

  const totalScans = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--ink)]">
            Disease Distribution
          </h3>
          <p className="text-[12px] text-[var(--ink3)] mt-1">
            {totalScans} plant scans · click to highlight
          </p>
        </div>
        {selectedDisease && (
          <button
            onClick={() => setSelectedDisease(null)}
            className="text-[12px] text-[var(--leaf)] font-medium bg-[var(--leaf-light)] px-3 py-1 rounded-full border-none cursor-pointer hover:bg-[var(--leaf)] hover:text-white transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-[var(--ink3)] text-[14px]">
          No plant diagnoses yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onClick={(_: unknown, index: number) => {
                setSelectedDisease(
                  selectedDisease === chartData[index].name
                    ? null
                    : chartData[index].name,
                );
              }}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
              style={{ cursor: "pointer", outline: "none" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  opacity={
                    selectedDisease && entry.name !== selectedDisease
                      ? 0.3
                      : 1
                  }
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }: { payload?: Array<{ payload: DiseaseData }> }) => {
                if (!payload || !payload.length) return null;
                const d = payload[0].payload as DiseaseData;
                const pct = totalScans > 0 ? ((d.count / totalScans) * 100).toFixed(1) : "0";
                return (
                  <div className="bg-[var(--ink)] text-white text-[12px] px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-semibold">{d.name}</p>
                    <p>{d.count} scans · {pct}%</p>
                  </div>
                );
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-[11px] text-[var(--ink2)]">{value}</span>
              )}
              wrapperStyle={{ paddingTop: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
