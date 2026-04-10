import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL } from "@/lib/model";

export async function POST(req: Request) {
  try {
    const { disease } = await req.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Give a concise markdown report (max 100 words overall) explaining the plant disease: ${disease}. IMPORTANT: ONLY generate exactly these three topics in order:
### Cause of the problem
(Write a short paragraph about the cause)

### Symptoms
(Write a short paragraph about the symptoms)

### Cure/Treatments (chemical and organic)
- (Use bullet points for treatments)

Do not add introductions, conclusions, or any other topics. Search the internet for latest info.`;

    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
        } catch (err) {
          console.error("Stream generation error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain" } });
  } catch (error) {
    console.error("Detail Gemini Error:", error);
    return new Response("Failed to fetch detail.", { status: 500 });
  }
}
