"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AccuracyGauge } from "@/components/dashboard/AccuracyGauge";
import { PlantSpeedometer } from "@/components/dashboard/PlantSpeedometer";
import { DiseasePieChart } from "@/components/dashboard/DiseasePieChart";
import { VolumeBarChart } from "@/components/dashboard/VolumeBarChart";
import { RefreshCw } from "lucide-react";

/** Shape returned by /api/dashboard/stats */
interface DashboardStats {
  summary: {
    totalPredictions: number;
    avgConfidence: number;
    plantRatio: number;
    topDisease: { name: string; count: number };
  };
  accuracy: number;
  plantRatio: { plant: number; nonPlant: number };
  diseases: { name: string; count: number }[];
  daily: {
    date: string;
    total: number;
    plant: number;
    nonPlant: number;
    avgConfidence: number;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data: DashboardStats = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load dashboard data. Make sure the database is connected.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* ── Loading state ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex-1 w-full bg-[var(--bg)] flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--leaf)] rounded-full animate-spin" />
          <p className="text-[14px] text-[var(--ink3)]">Loading analytics…</p>
        </div>
      </div>
    );
  }

  /* ── Error state ───────────────────────────────────────── */
  if (error || !stats) {
    return (
      <div className="flex-1 w-full bg-[var(--bg)] flex items-center justify-center min-h-[60vh]">
        <div className="bg-[var(--red-light)] text-[var(--red)] text-[14px] px-6 py-4 rounded-xl border border-[var(--red)] max-w-md text-center">
          <p className="font-semibold mb-1">Dashboard Error</p>
          <p className="text-[13px]">{error ?? "Unknown error"}</p>
          <button
            onClick={() => fetchStats()}
            className="mt-3 px-4 py-2 bg-[var(--red)] text-white rounded-lg text-[13px] border-none cursor-pointer hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, accuracy, plantRatio, diseases, daily } = stats;

  return (
    <div className="flex-1 w-full bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:px-8 md:py-10">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-[var(--font-serif)] text-[28px] md:text-[34px] font-bold text-[var(--ink)] leading-tight">
              Analytics Dashboard
            </h1>
            <p className="text-[14px] text-[var(--ink3)] mt-1.5">
              Real-time diagnostics performance · powered by AgroVision AI
            </p>
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[13px] font-medium text-[var(--ink2)] cursor-pointer hover:border-[var(--leaf)] hover:text-[var(--leaf)] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Summary cards ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon="📊"
            label="Total Scans"
            value={summary.totalPredictions.toLocaleString()}
            sub="All time predictions"
            color="var(--leaf)"
            delay={0}
          />
          <StatCard
            icon="🎯"
            label="Avg Confidence"
            value={`${summary.avgConfidence}%`}
            sub="Model prediction certainty"
            color="var(--teal)"
            delay={100}
          />
          <StatCard
            icon="🌿"
            label="Plant Ratio"
            value={`${summary.plantRatio}%`}
            sub={`${plantRatio.plant} of ${summary.totalPredictions} are plants`}
            color="var(--leaf-mid)"
            delay={200}
          />
          <StatCard
            icon="🔬"
            label="Top Disease"
            value={summary.topDisease.name}
            sub={`${summary.topDisease.count} detections`}
            color="var(--amber)"
            delay={300}
          />
        </div>

        {/* ── Gauges row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <AccuracyGauge value={accuracy} />
          <PlantSpeedometer
            plant={plantRatio.plant}
            nonPlant={plantRatio.nonPlant}
          />
        </div>

        {/* ── Charts row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <DiseasePieChart data={diseases} />
          <VolumeBarChart data={daily} />
        </div>

        {/* ── Footer note ────────────────────────────────── */}
        <div className="text-center text-[12px] text-[var(--ink3)] pb-4">
          Data updates in real-time as new diagnoses are performed ·{" "}
          <button
            onClick={() => fetchStats(true)}
            className="text-[var(--leaf)] font-medium bg-transparent border-none cursor-pointer underline underline-offset-2 hover:text-[var(--leaf-mid)] transition-colors"
          >
            refresh now
          </button>
        </div>
      </div>
    </div>
  );
}
