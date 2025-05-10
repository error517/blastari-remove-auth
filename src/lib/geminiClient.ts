import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set in your environment variables.');
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

export async function generateTextContent(prompt: string, systemPrompt?: string): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  try {
    let result;
    
    if (systemPrompt) {
      // Use startChat when we have a system prompt
      const chat = model.startChat({
        systemInstruction: systemPrompt,
      });
      
      const response = await chat.sendMessage(prompt);
      result = await response.text();
    } else {
      // Simple generation without system prompt
      const response = await model.generateContent(prompt);
      result = await response.response.text();
    }
    
    return result;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

export async function parseJsonResponse<T>(result: string): Promise<T> {
  try {
    // Attempt to parse the JSON from the result
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || 
                      result.match(/\{[\s\S]*\}/) ||
                      result.match(/\[[\s\S]*\]/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]) as T;
    }
    
    // If no specific JSON formatting was found, try to parse the entire string
    return JSON.parse(result) as T;
  } catch (error) {
    console.error('Error parsing JSON from Gemini response:', error);
    console.error('Raw response:', result);
    throw new Error('Failed to parse JSON from Gemini response');
  }
}