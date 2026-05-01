'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function runVersusBenchmark(deviceA: string, deviceB: string, priority: string) {
  // Check if API key exists in .env
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

      CRITICAL RULES FOR DEVICE RECOGNITION:
      - Users may make typos. Interpret "I phone" as "iPhone", "Lenovo Y700 2025" as "Lenovo Legion Y700 Gen 4", etc. Figure out the actual flagship device they mean.
      - If a user just types a generic name like "iPhone 13" vs an Android flagship, assume the Pro Max variant, but state the exact model you are analyzing.

      YOUR ANALYSIS MUST INCLUDE EXACT ESPORTS DATA:
      1. Chipset: State the exact SoC (e.g., Snapdragon 8 Gen 3, Apple A17 Pro).
      2. CODM FPS: You MUST explicitly state Multiplayer (MP) FPS vs Battle Royale (BR) FPS. Remind the user that many Androids do 120fps or 144fps in MP but are artificially locked to 90fps in BR due to developer whitelists (unless it is an iPad Pro or select tablet).
      3. PUBG, Free Fire, & Blood Strike FPS: State the sustained framerates for these games.
      4. Thermals & Heating: Does it have a vapor chamber? An active fan? Does it throttle after 30 minutes?
      5. Bugs & Age Degradation: Explicitly state if the device suffers from known global bugs (e.g., iOS screen dimming during heat, Android touch ghosting, ROG AirTrigger fails) or age-related battery drain/degradation if the phone is older than 2 years.

      Return the response in this EXACT JSON structure:
      {
        "winner": "Name of the winning device",
        "shortVerdict": "A punchy, 2-sentence verdict on why it won based on the priority.",
        "deviceA_Pros": ["Pro 1 with Chipset info", "Pro 2 with exact FPS data", "Pro 3"],
        "deviceB_Pros": ["Pro 1 with Chipset info", "Pro 2 with exact FPS data", "Pro 3"],
        "thermalPerformance": "Detailed breakdown of heating, vapor chambers, and frame drops after 30 mins. Mention age/battery degradation.",
        "gamingPerformance": "Detailed breakdown of FPS. Explicitly mention CODM MP vs BR limits, PUBG, Free Fire, and Blood Strike performance. Mention known bugs."
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Safely remove markdown formatting just in case Gemini includes it despite the mimeType
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(responseText);

  } catch (error: any) {
    console.error("Server Action AI Error:", error.message || error);
    // Pass the actual error string back to the UI so you can see it
    throw new Error(error.message || "Failed to process AI response.");
  }
}
