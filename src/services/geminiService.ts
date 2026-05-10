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

export const transformText = async (text: string, action: 'simplify' | 'amplify' | 'tone_shift'): Promise<string> => {
  let instruction = "";
  if (action === 'simplify') {
    instruction = "Rewrite the following text to be simpler, clearer, and more concise without losing the core meaning.";
  } else if (action === 'amplify') {
    instruction = "Rewrite the following text to be more persuasive, impactful, and compelling for a grant proposal.";
  } else {
    instruction = "Rewrite the following text to have a modern, high-tech, and forward-looking tone (e.g., '2026 Tech').";
  }

  const prompt = `${instruction}\n\nText:\n"${text}"`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt
  });

  return response.text?.trim() || text;
};

export const getGlobalAdvice = async (mission: string, activeView: string): Promise<string> => {
  const prompt = `You are Grant Genie, an AI assistant for a non-profit organization.
Mission: "${mission}"
Current App View: "${activeView}"

Provide a short, punchy (2-3 sentences max) piece of strategic advice, encouragement, or an actionable next step for the user, based on their mission and the view they are currently looking at. Use an inspiring, high-tech tone.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    return response.text?.trim() || "Standing by to assist.";
  } catch (error) {
    console.error("Global advice failed:", error);
    return "I am currently syncing with the main network. Please try again in a moment.";
  }
};

export const searchGlobalGrants = async (query: string): Promise<any[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return [
      {
        id: 'ai-mock-1',
        title: `AI Synthesized Grant for: ${query}`,
        funder: 'Global Innovation Fund',
        amount: 250000,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: `This is a synthesized opportunity found via global search matching your query: ${query}.`,
        matchScore: 0,
        matchExplanation: '',
        tags: ['Global', 'Innovation'],
        sourceUrl: '#',
        active: true
      }
    ];
  }

  const prompt = `You are Grant Genie's Global Search Engine. The user is searching the world for grants matching the query: "${query}".
Return a JSON array of 3 real or highly realistic grant opportunities that match this query. 
Use the exact following JSON schema for each object in the array:
{
  "id": "unique-string-id",
  "title": "Grant Title",
  "funder": "Name of Foundation/Agency",
  "amount": 100000, // Number, realistic amount
  "deadline": "2026-12-31T00:00:00Z", // ISO string future date
  "description": "2-3 sentences describing what the grant funds.",
  "matchScore": 0,
  "matchExplanation": "",
  "tags": ["Tag1", "Tag2"],
  "sourceUrl": "https://example.com",
  "active": true
}
Return ONLY the raw JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Global search failed:", error);
    return [];
  }
};
