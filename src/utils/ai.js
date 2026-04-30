/**
 * AI Utility for Grant Genie
 * Handles hybrid key logic (Local Storage -> Environment Variables)
 * and direct calls to Google Gemini API.
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Gets the active Gemini API key based on priority:
 * 1. User key in localStorage (BYOK)
 * 2. System default in environment variables
 */
export const getActiveGeminiKey = () => {
  const userKey = localStorage.getItem('gg_gemini_key');
  if (userKey && userKey.trim() !== "") return userKey;
  
  const systemKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (systemKey && systemKey.trim() !== "") return systemKey;
  
  return null;
};

/**
 * Calls Gemini 1.5 Flash to generate content.
 * @param {string} prompt - The text prompt to send
 * @returns {Promise<string>} - The generated response text
 */
export const askGemini = async (prompt) => {
  const apiKey = getActiveGeminiKey();
  
  if (!apiKey) {
    throw new Error("No API key configured. Please add one in Settings or contact the administrator.");
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to communicate with Gemini API");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Analyzes a grant document (mocking document processing since we're using text only for now)
 */
export const analyzeGrantDocument = async (fileName, textContent) => {
  const prompt = `
    You are the Grant Genie Oracle. Analyze the following grant document:
    File Name: ${fileName}
    Content: ${textContent}
    
    Please provide:
    1. A summary of the grant opportunity.
    2. Key requirements (Eligibility, Deadlines).
    3. Match Score (1-100) for a typical non-profit.
    4. 3 Action items for the organization.
    
    Format the response in clean Markdown.
  `;
  
  return await askGemini(prompt);
};
