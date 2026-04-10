import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

/**
 * POST /api/log-prediction
 *
 * Called by the client AFTER the final classification result is determined.
 * This ensures we only store the definitive answer — whether it came from
 * the HF model directly or from the AI fallback that overrode it.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { isPlant, disease, confidence, source, comment } = body as {
      isPlant: boolean;
      disease: string | null;
      confidence: number;
      source: "HF_MODEL" | "AI_FALLBACK";
      comment?: string | null;
    };

    // Validate required fields
    if (typeof isPlant !== "boolean") {
      return Response.json(
        { error: "isPlant (boolean) is required" },
        { status: 400 },
      );
    }

    await prisma.prediction.create({
      data: {
        isPlant,
        disease: disease ?? null,
        confidence: confidence ?? 0,
        source: source ?? "HF_MODEL",
        comment: comment ?? null,
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Log-prediction error:", error);
    return Response.json({ error: "Failed to log prediction" }, { status: 500 });
  }
}
