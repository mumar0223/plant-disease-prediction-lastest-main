import { z } from "zod";

export const CLASS_NAMES = [
  "Apple Scab", "Apple Black Rot", "Cedar Apple Rust", "Apple Healthy",
  "Blueberry Healthy",
  "Cherry Healthy", "Cherry Powdery Mildew",
  "Corn Cercospora Leaf Spot", "Corn Common Rust", "Corn Healthy", "Corn Northern Leaf Blight",
  "Grape Black Rot", "Grape Esca", "Grape Healthy", "Grape Leaf Blight",
  "Orange Huanglongbing (Citrus Greening)",
  "Peach Bacterial Spot", "Peach Healthy",
  "Pepper Bacterial Spot", "Pepper Healthy",
  "Potato Early Blight", "Potato Healthy", "Potato Late Blight",
  "Raspberry Healthy",
  "Soybean Healthy",
  "Squash Powdery Mildew",
  "Strawberry Healthy", "Strawberry Leaf Scorch",
  "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Healthy",
  "Tomato Late Blight", "Tomato Leaf Mold", "Tomato Septoria Leaf Spot",
  "Tomato Spider Mites", "Tomato Target Spot", "Tomato Mosaic Virus",
  "Tomato Yellow Leaf Curl Virus",
  "Brownspot", "Hispa", "Leaf Blast", "Rust", "Powdery",
  "Healthy Leaf"
] as const;

export const FallbackResponseSchema = z.object({
  isPlant: z.boolean().describe("Whether the image contains a plant or part of a plant."),
  className: z.enum(CLASS_NAMES).nullable().describe("If it is a plant, strictly classify it into one of these exact classes."),
  comment: z.string().nullable().describe("If it is NOT a plant, provide a short witty comment about what the object actually is. If it is a plant, set this to null.")
});

export type FallbackResponse = z.infer<typeof FallbackResponseSchema>;
