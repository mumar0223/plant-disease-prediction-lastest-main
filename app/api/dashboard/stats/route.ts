import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard/stats
 *
 * Returns all the aggregated data the dashboard needs in a single request:
 *   - summary   : total scans, avg confidence, plant ratio, top disease
 *   - accuracy   : weighted avg confidence (97.5% baseline)
 *   - plantRatio : { plant, nonPlant } counts for speedometer
 *   - diseases   : [{ name, count }] for pie chart
 *   - daily      : [{ date, total, plant, nonPlant, avgConfidence }] for bar chart
 */
export async function GET() {
  try {
    /* ── Total counts ───────────────────────────────────────── */
    const totalPredictions = await prisma.prediction.count();
    const plantCount = await prisma.prediction.count({
      where: { isPlant: true },
    });
    const nonPlantCount = await prisma.prediction.count({
      where: { isPlant: false },
    });

    /* ── Average confidence ─────────────────────────────────── */
    const avgResult = await prisma.prediction.aggregate({
      _avg: { confidence: true },
    });
    const rawAvg = avgResult._avg.confidence ?? 0;

    // Weighted accuracy: blend 97.5% baseline with real data
    // As real samples grow, the baseline's influence shrinks
    const BASELINE = 97.5;
    const BASELINE_WEIGHT = 10; // acts like 10 virtual samples at 97.5%
    const weightedAccuracy =
      totalPredictions === 0
        ? BASELINE
        : (BASELINE * BASELINE_WEIGHT + rawAvg * totalPredictions) /
          (BASELINE_WEIGHT + totalPredictions);

    /* ── Top disease ────────────────────────────────────────── */
    const diseaseGroups = await prisma.prediction.groupBy({
      by: ["disease"],
      where: { isPlant: true, disease: { not: null } },
      _count: { disease: true },
      orderBy: { _count: { disease: "desc" } },
    });

    const topDisease =
      diseaseGroups.length > 0
        ? {
            name: diseaseGroups[0].disease!,
            count: diseaseGroups[0]._count.disease,
          }
        : { name: "N/A", count: 0 };

    /* ── Disease distribution (pie chart) ───────────────────── */
    const diseases = diseaseGroups.map((g: any) => ({
      name: g.disease ?? "Unknown",
      count: g._count.disease,
    }));

    /* ── Daily volume (bar chart) — last 30 days ────────────── */
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPredictions = await prisma.prediction.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, isPlant: true, confidence: true },
      orderBy: { createdAt: "asc" },
    });

    // Bucket by date string (YYYY-MM-DD)
    const dailyMap = new Map<
      string,
      { total: number; plant: number; nonPlant: number; sumConf: number }
    >();

    for (const p of recentPredictions) {
      const dateKey = p.createdAt.toISOString().slice(0, 10);
      const bucket = dailyMap.get(dateKey) ?? {
        total: 0,
        plant: 0,
        nonPlant: 0,
        sumConf: 0,
      };
      bucket.total += 1;
      if (p.isPlant) bucket.plant += 1;
      else bucket.nonPlant += 1;
      bucket.sumConf += p.confidence;
      dailyMap.set(dateKey, bucket);
    }

    // Fill in missing days with zeros
    const daily: {
      date: string;
      total: number;
      plant: number;
      nonPlant: number;
      avgConfidence: number;
    }[] = [];
    const cursor = new Date(thirtyDaysAgo);
    const today = new Date();
    while (cursor <= today) {
      const key = cursor.toISOString().slice(0, 10);
      const bucket = dailyMap.get(key);
      daily.push({
        date: key,
        total: bucket?.total ?? 0,
        plant: bucket?.plant ?? 0,
        nonPlant: bucket?.nonPlant ?? 0,
        avgConfidence:
          bucket && bucket.total > 0
            ? Math.round((bucket.sumConf / bucket.total) * 100) / 100
            : 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return Response.json({
      summary: {
        totalPredictions,
        avgConfidence: Math.round(rawAvg * 100) / 100,
        plantRatio:
          totalPredictions > 0
            ? Math.round((plantCount / totalPredictions) * 10000) / 100
            : 0,
        topDisease,
      },
      accuracy: Math.round(weightedAccuracy * 100) / 100,
      plantRatio: { plant: plantCount, nonPlant: nonPlantCount },
      diseases,
      daily,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return Response.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
