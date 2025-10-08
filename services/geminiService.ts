import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CareTip, SoilAnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: any = {
  type: Type.OBJECT,
  properties: {
    plantName: {
      type: Type.STRING,
      description: "The common name of the plant identified in the image."
    },
    healthStatus: {
      type: Type.STRING,
      enum: ['Healthy', 'Unhealthy', 'Needs Care'],
      description: "A one-word assessment of the plant's overall health."
    },
    confidence: {
        type: Type.NUMBER,
        description: "A confidence score from 0.0 to 1.0 for the health assessment."
    },
    potentialIssues: {
      type: Type.ARRAY,
      description: "A list of potential diseases, pests, or other issues detected.",
      items: {
        type: Type.OBJECT,
        properties: {
          issue: {
            type: Type.STRING,
            description: "The name of the issue (e.g., 'Powdery Mildew', 'Aphid Infestation')."
          },
          description: {
            type: Type.STRING,
            description: "A brief, user-friendly description of the issue and its symptoms."
          },
          remedy: {
            type: Type.STRING,
            description: "A concise, actionable step-by-step remedy for the issue."
          }
        },
        required: ["issue", "description", "remedy"]
      }
    },
    careRecommendations: {
      type: Type.ARRAY,
      description: "A list of general, actionable care tips for this type of plant.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["plantName", "healthStatus", "confidence", "potentialIssues", "careRecommendations"]
};

const careTipsSchema: any = {
    type: Type.ARRAY,
    description: "A list of general plant care tips.",
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "The category of the care tip (e.g., 'Watering 101', 'Sunlight Secrets')."
            },
            content: {
                type: Type.STRING,
                description: "The detailed, user-friendly advice for this care category, explaining the 'why' behind the tip."
            },
            keyTakeaway: {
                type: Type.STRING,
                description: "A single, concise sentence summarizing the most critical point of the tip."
            }
        },
        required: ["title", "content", "keyTakeaway"]
    }
};

const soilAnalysisSchema: any = {
    type: Type.OBJECT,
    properties: {
        soilType: {
            type: Type.STRING,
            description: "The common name for the soil type identified (e.g., 'Sandy Loam', 'Clay', 'Silt')."
        },
        description: {
            type: Type.STRING,
            description: "A user-friendly description of the soil's key characteristics, such as texture, color, and structure."
        },
        recommendedPlants: {
            type: Type.ARRAY,
            description: "A list of plants or crops that are well-suited for this type of soil.",
            items: {
                type: Type.OBJECT,
                properties: {
                    plantName: {
                        type: Type.STRING,
                        description: "The common name of the recommended plant."
                    },
                    reasoning: {
                        type: Type.STRING,
                        description: "A brief, simple explanation of why this plant is suitable for the identified soil type."
                    }
                },
                required: ["plantName", "reasoning"]
            }
        }
    },
    required: ["soilType", "description", "recommendedPlants"]
};

export const analyzePlantHealth = async (base64ImageData: string): Promise<AnalysisResult> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData.split(',')[1],
        },
    };

    const textPart = {
        text: `You are Plant Doctor AI, an expert botanist. Analyze this image of a plant. 
        Identify the plant species, assess its health, and identify any diseases, pests, or deficiencies. 
        Provide clear, concise, and actionable advice for a non-expert home gardener. 
        If the plant looks healthy, identify it and provide standard care tips.
        If no plant is visible, state that clearly in the plantName field and leave other fields empty.
        Respond ONLY with the JSON object defined in the schema.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);
        
        return parsedResult as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze plant health. The AI model could not process the request.");
    }
};

export const fetchGeneralCareTips = async (): Promise<CareTip[]> => {
    const prompt = `You are a friendly and encouraging expert botanist. Provide 5 essential, general plant care tips for beginners. 
    Cover fundamental topics like watering, sunlight, soil, pests, and humidity. 
    For each tip, provide a creative title, detailed user-friendly advice explaining the 'why', and a concise 'keyTakeaway' that summarizes the most important point in one sentence.
    Adopt a warm and accessible tone.
    Respond ONLY with the JSON array defined in the schema.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: careTipsSchema,
                temperature: 0.3,
            }
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);

        return parsedResult as CareTip[];

    } catch (error) {
        console.error("Error fetching care tips from Gemini API:", error);
        throw new Error("Failed to fetch plant care tips. The AI model could not process the request.");
    }
};

export const analyzeSoil = async (base64ImageData: string): Promise<SoilAnalysisResult> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData.split(',')[1],
        },
    };

    const textPart = {
        text: `You are a soil science expert. Analyze this image of soil.
        Identify the soil type based on its texture, color, and visible properties.
        Provide a clear description of the soil.
        Recommend at least 3-5 plants or crops that would thrive in this soil. For each plant, briefly explain why it's a good match.
        If no soil is visible, state that clearly in the soilType field and leave other fields empty.
        Respond ONLY with the JSON object defined in the schema.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: soilAnalysisSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SoilAnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API for soil analysis:", error);
        throw new Error("Failed to analyze soil. The AI model could not process the request.");
    }
};

export const translateAnalysisResult = async (result: AnalysisResult, language: string): Promise<AnalysisResult> => {
    const prompt = `Translate all user-facing string values in the following JSON object to ${language}. 
    Maintain the exact original JSON structure, keys, and data types (like numbers and enums).
    Only translate the values of 'plantName', 'issue', 'description', 'remedy', and the items in 'careRecommendations'.
    Do not translate the 'healthStatus' enum value.
    Original JSON:
    ${JSON.stringify(result)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (error) {
        console.error(`Error translating analysis to ${language}:`, error);
        throw new Error(`Failed to translate analysis to ${language}.`);
    }
};

export const translateCareTips = async (tips: CareTip[], language: string): Promise<CareTip[]> => {
    const prompt = `Translate all user-facing string values in the following JSON array of objects to ${language}. 
    Maintain the exact original JSON structure and keys.
    Original JSON:
    ${JSON.stringify(tips)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: careTipsSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CareTip[];
    } catch (error) {
        console.error(`Error translating care tips to ${language}:`, error);
        throw new Error(`Failed to translate care tips to ${language}.`);
    }
};


export const translateSoilAnalysisResult = async (result: SoilAnalysisResult, language: string): Promise<SoilAnalysisResult> => {
    const prompt = `Translate all user-facing string values in the following JSON object to ${language}. 
    Maintain the exact original JSON structure and keys.
    Only translate the values of 'soilType', 'description', 'plantName', and 'reasoning'.
    Original JSON:
    ${JSON.stringify(result)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: soilAnalysisSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SoilAnalysisResult;
    } catch (error) {
        console.error(`Error translating soil analysis to ${language}:`, error);
        throw new Error(`Failed to translate soil analysis to ${language}.`);
    }
};
