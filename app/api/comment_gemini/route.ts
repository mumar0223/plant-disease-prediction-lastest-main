import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { GEMINI_MODEL } from "@/lib/model";
import { FallbackResponseSchema, CLASS_NAMES } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { image } = body;
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are a fallback validator for a plant disease detection app. 
The primary model suspected this image does NOT contain a plant.
Analyze the image carefully:
1. Is it a plant or part of a plant?
2. If it IS a plant, classify its disease EXACTLY matching one of the allowed classes: ${CLASS_NAMES.join(", ")}.
3. If it is NOT a plant, write a brief, witty, and creative comment (no markdown) identifying what the object actually is, saying something like "Hey that looks great but it's not a plant buddy."

You MUST return your response as a valid JSON object matching this exact schema:
{
  "isPlant": boolean,
  "className": string | null, // Must EXACTLY match one of the allowed classes if isPlant is true, else null.
  "comment": string | null // Provide witty comment if isPlant is false, else null.
}

Return ONLY raw JSON. No markdown code blocks.`;
    
    let contents: any[] = [prompt];
    
    if (image && typeof image === 'string') {
      const mimeMatch = image.match(/^data:([^;]+);base64,/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1];
        const base64Data = image.replace(/^data:[^;]+;base64,/, '');
        contents.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    // Clean and parse
    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = FallbackResponseSchema.parse(JSON.parse(rawText));
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Gemini Comment Error:", error);
    return NextResponse.json({ 
      isPlant: false, 
      className: null, 
      comment: "That item looks great, but it's not a plant! Please upload a valid leaf image." 
    });
  }
}
