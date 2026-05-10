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

export const getOracleAdvice = async (mission: string, draft: string, guidelines: string) => {
  const prompt = `
    You are the Grant Genie Oracle, a master grant writer. 
    Analyze this non-profit grant application draft against the funder's guidelines, specifically for an organization with this mission: "${mission}".
    
    Funder Guidelines: "${guidelines}"
    Current Draft: "${draft}"
    
    Return a JSON object with:
    1. narrativeShifts (array of 3 highly specific, tactical suggestions to improve the story or align better with the mission)
    2. strategicSignal (one core, high-level piece of advice for success)
    3. score (an integer 0-10 based on how ready this draft is)
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
