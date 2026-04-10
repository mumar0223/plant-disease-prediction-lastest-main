import { Client } from "@gradio/client";

// ✅ Define correct response type from your Python model
type PredictionResponse = [Record<string, number>, string];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return Response.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Convert file → Blob
    const imageBlob = new Blob([await file.arrayBuffer()], {
      type: file.type,
    });

    // ✅ Load env variables
    const SPACE = process.env.HF_SPACE;
    const TOKEN = process.env.HF_TOKEN;

    if (!SPACE) {
      return Response.json(
        { error: "Missing HF_SPACE in .env" },
        { status: 500 },
      );
    }

    // ✅ Connect to Hugging Face Space
    const client = await Client.connect(SPACE, {
      token: TOKEN as `hf_${string}` | undefined,
    });

    // ✅ Call your Gradio predict()
    const result = await client.predict("/predict", {
      image: imageBlob,
    });

    // ✅ Validate + parse response safely
    if (!result.data || !Array.isArray(result.data)) {
      throw new Error("Invalid response from Hugging Face");
    }

    const [scores, label] = result.data as PredictionResponse;

    // 🧠 Handle "Not a Plant"
    if (label === "Not a Plant") {
      return Response.json({
        isPlant: false,
        disease: null,
        confidence: scores?.["Plant"] ?? 0,
        topPredictions: scores ?? {},
      });
    }

    // 🌿 Normal plant disease response
    return Response.json({
      isPlant: true,
      disease: label,
      confidence: scores?.[label] ?? 0,
      topPredictions: scores ?? {},
    });
  } catch (error) {
    console.error("HF API Error:", error);

    return Response.json({ error: "Prediction failed" }, { status: 500 });
  }
}
