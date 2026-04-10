import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL } from "@/lib/model";

export async function POST(req: Request) {
  try {
    const { disease, messages } = await req.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `You are a specialized AgroVision AI assistant. You must ONLY answer questions related to the plant disease: ${disease}. If the user asks about other topics, politely decline and instruct them to ask about ${disease} or plant care in general. Keep answers concise.`;

    // Map messages to Gemini format
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
      },
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
          console.error("Chat Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain" } });
  } catch (error) {
    console.error("Chat Gemini Error:", error);
    return new Response("Failed to fetch chat.", { status: 500 });
  }
}
