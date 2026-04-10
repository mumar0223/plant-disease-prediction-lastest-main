"use client";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

interface DailyData {
  date: string;
  total: number;
  plant: number;
  nonPlant: number;
  avgConfidence: number;
}

interface VolumeBarChartProps {
  data: DailyData[];
}

export function VolumeBarChart({ data }: VolumeBarChartProps) {

  // Format date labels: "Apr 5"
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Show only every Nth label to avoid crowding
  const labelInterval = data.length > 20 ? 3 : data.length > 10 ? 2 : 0;

  const totalScans = data.reduce((sum, d) => sum + d.total, 0);
  const avgConf =
    data.filter((d) => d.total > 0).length > 0
      ? data
          .filter((d) => d.total > 0)
          .reduce((sum, d) => sum + d.avgConfidence, 0) /
        data.filter((d) => d.total > 0).length
      : 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--ink)]">
            Daily Scan Volume
          </h3>
          <p className="text-[12px] text-[var(--ink3)] mt-1">
            Last 30 days · {totalScans} total scans · avg {avgConf.toFixed(1)}% confidence
          </p>
        </div>
      </div>

      {totalScans === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-[var(--ink3)] text-[14px]">
          No scan data yet — diagnose some plants!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="plantGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3A6B1E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#639922" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="nonPlantGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BA7517" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#D4A843" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={labelInterval}
              tick={{ fill: "var(--ink3)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "var(--ink3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: "var(--ink3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />

             <Tooltip
              content={({ active, payload, label }: any) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-[var(--ink)] text-white text-[12px] px-4 py-3 rounded-xl shadow-xl border-none outline-none">
                    <p className="font-semibold text-[13px] mb-1.5">{formatDate(label ?? "")}</p>
                    <div className="flex flex-col gap-1">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#3A6B1E]" />
                        Plants: {d?.plant ?? 0}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#BA7517]" />
                        Non-plants: {d?.nonPlant ?? 0}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0F6E56]" />
                        Avg confidence: {d?.avgConfidence?.toFixed(1) ?? 0}%
                      </p>
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-[11px] text-[var(--ink2)]">{value}</span>
              )}
            />

            <Bar
              yAxisId="left"
              dataKey="plant"
              name="Plant Scans"
              stackId="scans"
              fill="url(#plantGradient)"
              radius={[0, 0, 0, 0]}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              yAxisId="left"
              dataKey="nonPlant"
              name="Non-Plant Scans"
              stackId="scans"
              fill="url(#nonPlantGradient)"
              radius={[3, 3, 0, 0]}
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-out"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgConfidence"
              name="Avg Confidence"
              stroke="#0F6E56"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#0F6E56", stroke: "white", strokeWidth: 2 }}
              animationBegin={400}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
