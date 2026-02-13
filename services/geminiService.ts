
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  // Generate a job description using the Gemini 3 Flash model
  async generateJobDescription(jobTitle: string, requirements: string): Promise<string> {
    try {
      // Create a fresh instance for the request
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a professional job description in both Arabic and French for a "${jobTitle}" position in Algeria. Key requirements: ${requirements}. Make it appealing and clear.`,
      });
      // Access the .text property directly
      return response.text || "Failed to generate description.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating description. Please try again.";
    }
  }

  // Analyze profile for improvements using the Gemini 3 Flash model
  async analyzeProfile(skills: string[], bio: string): Promise<string> {
      try {
          // Create a fresh instance for the request
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `As an Algerian recruitment expert, analyze this profile: Skills: ${skills.join(', ')}. Bio: ${bio}. Give 3 short tips in Arabic to make it more professional for the Algerian market.`,
          });
          // Access the .text property directly
          return response.text || "No tips available.";
      } catch (error) {
          console.error("Gemini Error:", error);
          return "Keep improving your profile!";
      }
  }
}
