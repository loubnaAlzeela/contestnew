
import { GoogleGenAI, Type } from "@google/genai";
import type { Contest, Question } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const contestSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy and engaging title for the contest. Max 50 characters."
    },
    description: {
      type: Type.STRING,
      description: "A brief, exciting description of the contest to attract participants. Max 200 characters."
    },
    questions: {
      type: Type.ARRAY,
      description: "An array of 3 to 5 questions for the contest.",
      items: {
        type: Type.OBJECT,
        properties: {
          prompt: {
            type: Type.STRING,
            description: "The text of the question being asked."
          },
          type: {
            type: Type.STRING,
            enum: ['text', 'single_choice', 'multi_choice'],
            description: "The type of question. Can be 'text', 'single_choice', or 'multi_choice'."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 string options for 'single_choice' or 'multi_choice' questions. Should be null for 'text' questions.",
            items: { type: Type.STRING }
          }
        },
        required: ["prompt", "type"]
      }
    }
  },
  required: ["title", "description", "questions"]
};


export const generateContestIdea = async (topic: string): Promise<Partial<Contest>> => {
  try {
    const prompt = `You are a creative marketing expert. Generate a fun and engaging contest idea based on the topic: "${topic}". 
    The contest should have a title, a short description, and 3-5 diverse questions (text, single_choice, multi_choice). For choice questions, provide 4 options.
    Provide your response in the specified JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: contestSchema,
      },
    });

    const jsonText = response.text;
    const generatedData = JSON.parse(jsonText);

    // Shape the data to match our Contest and Question types
    const partialContest: Partial<Contest> = {
      title: generatedData.title,
      description: generatedData.description,
      questions: (generatedData.questions || []).map((q: any, index: number) => ({
        id: Date.now() + index, // temporary ID
        contest_id: 0, // temporary
        prompt: q.prompt,
        type: q.type,
        options: q.options || undefined,
        order_index: index + 1,
      } as Question)),
    };
    
    return partialContest;

  } catch (error) {
    console.error("Error generating contest idea with Gemini:", error);
    throw new Error("Failed to generate contest idea. Please check your API key and try again.");
  }
};
