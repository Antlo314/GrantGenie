import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateGrantIntel = async (mission: string, grantDescription: string) => {
  const prompt = `
    As Grant Genie, analyze this grant opportunity for a non-profit with this mission: "${mission}".
    
    Grant Description: "${grantDescription}"
    
    Provide a "Deep intelligence Breakdown" in JSON format with:
    1. matchScore (number 0-100)
    2. strategicIntelligence (why it fits)
    3. tags (array of focus areas)
    4. alignmentSummary (brief pitch)
  `;
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const getOracleAdvice = async (draft: string, guidelines: string) => {
  const prompt = `
    Analyze this non-profit grant application draft against the funder's guidelines.
    
    Guidelines: "${guidelines}"
    Draft: "${draft}"
    
    Return a JSON object with:
    1. narrativeShifts (array of 3 suggestions to improve story)
    2. strategicSignal (one core advice for success)
    3. score (0-10)
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};
