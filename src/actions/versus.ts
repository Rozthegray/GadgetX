'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function runVersusBenchmark(deviceA: string, deviceB: string, priority: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
      You are an elite, highly technical mobile esports hardware analyst for "GadgetX".
      Compare these two devices: "${deviceA}" VS "${deviceB}".
      The user prioritizes: "${priority}".

      CRITICAL RULES FOR DEVICE RECOGNITION & ANTI-HALLUCINATION:
      - Users may make typos. Interpret "I phone" as "iPhone", "Lenovo Y700 2025" as "Lenovo Legion Y700 Gen 4", etc. 
      - ZERO HALLUCINATIONS ON CHIPSETS. You MUST state the EXACT, factually correct System-on-Chip (SoC). 
        * Do not guess. Verify the generation number (Gen 1 vs Gen 2 vs Gen 3).
        * Common mistakes to avoid: Poco X6 Pro uses MediaTek Dimensity 8300 Ultra. Poco F6 Pro uses Snapdragon 8 Gen 2. ROG Phone 8 Pro uses Snapdragon 8 Gen 3. iPhone 13 Pro Max uses A15 Bionic.

      YOUR ANALYSIS MUST INCLUDE EXACT ESPORTS DATA:
      1. Chipset: Force the exact SoC as the very first bullet point in the Pros list using the format "Chipset: [Exact Name]".
      2. CODM FPS: Explicitly state Multiplayer (MP) FPS vs Battle Royale (BR) FPS limits (e.g., 120fps MP / 90fps BR).
      3. PUBG, Free Fire, & Blood Strike FPS.
      4. Thermals & Heating: Vapor chambers, active fans, throttling.
      5. Bugs & Age Degradation: Global bugs, iOS dimming, aging batteries.

      Return the response in this EXACT JSON structure:
      {
        "winner": "Name of the winning device",
        "shortVerdict": "A punchy, 2-sentence verdict on why it won based on the priority.",
        "deviceA_Pros": ["Chipset: [Exact SoC Name]", "Pro 2 with exact FPS data", "Pro 3"],
        "deviceB_Pros": ["Chipset: [Exact SoC Name]", "Pro 2 with exact FPS data", "Pro 3"],
        "thermalPerformance": "Detailed breakdown of heating, vapor chambers, and frame drops after 30 mins. Mention age/battery degradation.",
        "gamingPerformance": "Detailed breakdown of FPS. Explicitly mention CODM MP vs BR limits, PUBG, Free Fire, and Blood Strike performance. Mention known bugs."
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Safely remove markdown formatting if Gemini included it
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(responseText);

  } catch (error: any) {
    console.error("Server Action AI Error:", error.message || error);
    throw new Error(error.message || "Failed to process AI response.");
  }
}
