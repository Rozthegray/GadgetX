'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function runVersusBenchmark(deviceA: string, deviceB: string, priority: string) {
  // Check if API key exists in .env
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
   // ... inside runVersusBenchmark

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Updated to the current stable endpoint
      generationConfig: { responseMimeType: "application/json" } 
    });

// ... rest of the file
    const prompt = `
      You are an elite, highly technical mobile gaming hardware reviewer. 
      Compare the following two devices: "${deviceA}" vs "${deviceB}".
      The user's primary priority is: "${priority}".
      
      Talk strictly about thermal throttling, touch sampling rates, vapor chambers, sustained FPS, and real-world gaming performance in games like CODM, PUBG, and Blood Strike.

      Return the response in this EXACT JSON structure:
      {
        "winner": "Name of the winning device",
        "shortVerdict": "A punchy, 2-sentence verdict on why it won based on the priority.",
        "deviceA_Pros": ["Pro 1", "Pro 2"],
        "deviceB_Pros": ["Pro 1", "Pro 2"],
        "thermalPerformance": "Detailed breakdown of heating and cooling for both.",
        "gamingPerformance": "Detailed breakdown of FPS stability and processor power."
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Safely remove markdown formatting if Gemini included it
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(responseText);

  } catch (error: any) {
    console.error("Server Action AI Error:", error.message || error);
    // Pass the actual error string back to the UI so you can see it
    throw new Error(error.message || "Failed to process AI response.");
  }
}