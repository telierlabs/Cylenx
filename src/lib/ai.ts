import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
} catch (e) {
  console.error('AI init failed', e);
}

export default ai;
