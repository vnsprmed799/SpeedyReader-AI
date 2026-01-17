import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizeText = async (text: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following text to be concise and optimized for speed reading. Remove filler words while keeping the core meaning. 
      
      Text:
      ${text}`,
    });
    
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
};

export const generatePracticeText = async (topic: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 300-word engaging article about "${topic}". The text should be suitable for practicing speed reading.`,
    });
    
    return response.text || "Could not generate text.";
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

export const optimizeForSpeedReading = async (text: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Text-to-RSVP (Rapid Serial Visual Presentation) pre-processor.
      
      Your goal is to convert the input text into a format that reduces cognitive load during high-speed serial reading, WITHOUT removing any information.
      
      SCIENTIFIC RULES FOR RSVP OPTIMIZATION:
      1. **NO INFORMATION LOSS**: Do not summarize. Do not remove filler words. Keep every single detail and nuance of the original text.
      2. **NUMBERS TO TEXT**: The brain processes words faster than digits in RSVP. Convert ALL numbers, dates, and currency to their spoken text equivalent.
         - Example (PT): "25/12/2021" -> "vinte e cinco de dezembro de dois mil e vinte e um"
         - Example (EN): "$50" -> "fifty dollars"
      3. **SYMBOLS TO TEXT**: Expand "%", "&", "@", "°" to full words (e.g., "degrees", "percent", "at").
      4. **ABBREVIATIONS**: Expand abbreviations that require pause to decode (e.g., "approx." -> "approximately", "etc." -> "et cetera").
      5. **LANGUAGE DETECTION**: Output in the EXACT same language as the input.
      
      Input Text:
      ${text}`,
    });
    
    return response.text || "Could not optimize text.";
  } catch (error) {
    console.error("Error optimizing text:", error);
    throw error;
  }
};