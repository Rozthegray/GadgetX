'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEVICES, DeviceSpec } from '@/data/device';

// Fuzzy Matcher to catch typos (e.g. "Iphone 17" -> "iPhone 17 Pro Max")
function findExactDevice(input: string): DeviceSpec | null {
  const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const device of DEVICES) {
    const cleanName = device.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName.includes(cleaned) || cleaned.includes(cleanName)) return device;
    
    for (const alias of device.aliases) {
      const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanAlias.includes(cleaned) || cleaned.includes(cleanAlias)) return device;
    }
  }
  return null;
}

export async function runVersusBenchmark(deviceAInput: string, deviceBInput: string, priority: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing.");

  const deviceA = findExactDevice(deviceAInput);
  const deviceB = findExactDevice(deviceBInput);

  // 🔥 THE FIX: We removed the "throw Error" crash block. 
  // Instead, we dynamically build the context based on what we found.
  const deviceAContext = deviceA 
    ? `[VERIFIED DATABASE: ${deviceA.name}]\n${JSON.stringify(deviceA, null, 2)}` 
    : `[NO LOCAL DATA FOR: "${deviceAInput}"]. Rely on your internal knowledge base to extract its exact Chipset, AnTuTu score, Cooling mechanism, and standard Gaming FPS limits.`;

  const deviceBContext = deviceB 
    ? `[VERIFIED DATABASE: ${deviceB.name}]\n${JSON.stringify(deviceB, null, 2)}` 
    : `[NO LOCAL DATA FOR: "${deviceBInput}"]. Rely on your internal knowledge base to extract its exact Chipset, AnTuTu score, Cooling mechanism, and standard Gaming FPS limits.`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    generationConfig: { 
      responseMimeType: "application/json",
      // Bumped slightly to 0.1 so the AI is allowed to "remember" specs for unlisted phones
      temperature: 0.1 
    } 
  });

  const prompt = `
    You are an esports hardware analyst. Your job is to compare two devices.
    If a VERIFIED DATABASE ENTRY is provided, you MUST use that data exactly. DO NOT deviate.
    If NO LOCAL DATA is provided for a device, use your expert knowledge to accurately estimate its specifications.

    ${deviceAContext}

    ${deviceBContext}

    The user's priority is: "${priority}".

    Return exactly this JSON structure:
    {
      "winner": "Name of the winning device",
      "shortVerdict": "A 2-sentence verdict based on the data provided.",
      "deviceA_Pros": ["Chipset: [Data]", "AnTuTu: [Data]", "Cooling: [Data]"],
      "deviceB_Pros": ["Chipset: [Data]", "AnTuTu: [Data]", "Cooling: [Data]"],
      "thermalPerformance": "Compare 'cooling' and thermal throttling. Mention if either has an active fan.",
      "gamingPerformance": "State EXACT FPS for CODM, PUBG, Free Fire, and BloodStrike. List known 'bugs'."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(responseText);
  } catch (error: any) {
    console.error("Server Action AI Error:", error);
    throw new Error("Failed to process device comparison.");
  }
}