/**
 * prisma/seed.ts
 *
 * Run with:  npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
 * Or add "prisma": { "seed": "npx ts-node prisma/seed.ts" } to package.json
 *
 * Seeds ~120 realistic predictions spanning the last 30 days.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DISEASE_NAMES = [
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
  "Healthy Leaf",
];

function randomDate(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 14) + 7); // 7 AM – 9 PM
  d.setMinutes(Math.floor(Math.random() * 60));
  d.setSeconds(Math.floor(Math.random() * 60));
  return d;
}

function randomConfidence(): number {
  // Skewed high: 85–99.8
  return Math.round((85 + Math.random() * 14.8) * 100) / 100;
}

async function main() {
  console.log("🧹 Clearing existing predictions...");
  await prisma.prediction.deleteMany({});

  console.log("🌱 Seeding exactly 27 predictions...");

  const records = [];
  const targetTotal = 27;
  const targetAvg = 96.0;

  // 18 Plant predictions (high confidence)
  for (let i = 0; i < 18; i++) {
    const disease = DISEASE_NAMES[Math.floor(Math.random() * DISEASE_NAMES.length)];
    records.push({
      createdAt: randomDate(30),
      isPlant: true,
      disease,
      // Mostly between 95 and 99
      confidence: Math.round((95 + Math.random() * 4.8) * 100) / 100,
      source: "HF_MODEL",
      comment: null,
    });
  }

  // 9 Non-plant predictions (also high confidence for detection accuracy)
  const nonPlantComments = [
    "That's a very nice shoe! 👟",
    "I diagnose plants, not kittens! 🐱",
    "A coffee mug of high quality. ☕",
    "Interesting rock! 🪨",
    "A laptop with no bugs! 💻",
    "Your dog is adorable! 🐕",
  ];

  for (let i = 0; i < 9; i++) {
    records.push({
      createdAt: randomDate(30),
      isPlant: false,
      disease: null,
      // We want these high too to reach the 96% average
      confidence: Math.round((94 + Math.random() * 5) * 100) / 100,
      source: "AI_FALLBACK",
      comment: nonPlantComments[i % nonPlantComments.length],
    });
  }

  // Adjust last record to force exact 96.0 average if needed
  // Current sum
  const currentSum = records.reduce((acc, r) => acc + r.confidence, 0);
  const requiredSum = targetTotal * targetAvg; // 2592
  const diff = requiredSum - currentSum;
  
  // Adjust the last one
  records[targetTotal - 1].confidence = Math.round((records[targetTotal - 1].confidence + diff) * 100) / 100;

  await prisma.prediction.createMany({ data: records });

  console.log(`✅ Seeded ${records.length} predictions`);
  const finalAvg = records.reduce((acc, r) => acc + r.confidence, 0) / 27;
  console.log(`📊 Average Confidence: ${finalAvg.toFixed(2)}%`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
