import { GoogleGenAI, Type } from "@google/genai";
import { type BakingParameters, type AIAnalysisResult, type AIPlanResult, FlourType, YeastType, StarterActivity, OvenProfile, PrefermentType, ColdFermentation, Preferment } from '../types';
import { FLOUR_OPTIONS, YEAST_OPTIONS, STARTER_ACTIVITY_OPTIONS, OVEN_PROFILE_OPTIONS } from "../constants";
import { type CalculatedBakingMetrics } from './bakingCalculator';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.STRING,
        description: "A brief, encouraging overview of the dough and the expected outcome. Max 2-3 sentences."
      },
      bulkFermentation: {
        type: Type.OBJECT,
        properties: {
          duration: { type: Type.STRING, description: "Estimated time for bulk fermentation (e.g., '3-4 hours')." },
          notes: { type: Type.STRING, description: "Key visual cues for the baker to look for (e.g., 'doubled in size, domed top')." },
        },
        required: ["duration", "notes"],
      },
      coldProof: {
        type: Type.OBJECT,
        description: "Estimated time for cold fermentation in the refrigerator. Only provide this if the user has enabled cold fermentation.",
        properties: {
            duration: { type: Type.STRING, description: "Estimated time for cold fermentation (e.g., '24-48 hours in the fridge')." },
            notes: { type: Type.STRING, description: "Key visual cues (e.g., 'Dough will be firm and have risen slowly')." },
        },
        required: ["duration", "notes"],
      },
      finalProof: {
        type: Type.OBJECT,
        properties: {
          duration: { type: Type.STRING, description: "Estimated time for final proofing at room temperature. If cold fermentation is used, this is the time needed for the dough to warm up before baking." },
          notes: { type: Type.STRING, description: "Key visual cues for the baker (e.g., 'puffy, springs back slowly when poked')." },
        },
        required: ["duration", "notes"],
      },
      coldFermentation: {
          type: Type.OBJECT,
          description: "Analysis of the dough's suitability for cold fermentation (retarding), and guidance on how to do it. Provide this if the recipe is suitable (e.g., sourdough, lean doughs).",
          properties: {
              suitability: { type: Type.BOOLEAN, description: "Whether this dough is a good candidate for cold fermentation." },
              description: { type: Type.STRING, description: "A brief explanation of why it's suitable or not, and the benefits (e.g., flavor development, schedule flexibility)." },
              timelineAdjustments: { type: Type.STRING, description: "Specific instructions on how to adapt the timeline for cold fermentation. e.g., 'After shaping, place in the fridge for 12-24 hours. Bake directly from cold.'" },
          },
          required: ["suitability", "description", "timelineAdjustments"]
      },
      timeline: {
          type: Type.ARRAY,
          description: "A detailed, step-by-step timeline from mixing to baking. Be concise but clear.",
          items: {
              type: Type.OBJECT,
              properties: {
                  step: { type: Type.STRING, description: "The name of the step (e.g., 'Mixing', 'Bulk fermentation', 'Shaping', 'Final proof', 'Baking'). The step name must be in sentence case (only the first word capitalized)." },
                  details: { type: Type.STRING, description: "Specific instructions for this step." },
                  startTime: { type: Type.STRING, description: "The calculated start time for this step in ISO 8601 format, if a target bake time was provided. Optional." },
                  endTime: { type: Type.STRING, description: "The calculated end time for this step in ISO 8601 format, if a target bake time was provided. Optional." },
              },
              required: ["step", "details"],
          }
      },
      proTips: {
        type: Type.ARRAY,
        description: "A list of 3-4 actionable, expert tips relevant to the user's specific parameters. The tips for the 'Baking' step MUST be tailored to the user's oven profile, mentioning pre-heating, steam, and recovery time/cadence if applicable.",
        items: { type: Type.STRING },
      },
    },
    required: ["overview", "bulkFermentation", "finalProof", "timeline", "proTips"],
};

const prefermentSchema = {
    type: Type.OBJECT,
    description: "Details of the preferment used.",
    properties: {
        enabled: { type: Type.BOOLEAN },
        type: { type: Type.STRING, enum: Object.values(PrefermentType) },
        flourPct: { type: Type.NUMBER },
        hydration: { type: Type.NUMBER },
        yeastPct: { type: Type.NUMBER },
        fermentationHours: { type: Type.NUMBER },
        fermentationTemp: { type: Type.NUMBER },
    },
    required: ["enabled", "type", "flourPct", "hydration", "yeastPct", "fermentationHours", "fermentationTemp"]
};

const coldFermentationSchema = {
    type: Type.OBJECT,
    description: "Details of the cold fermentation used.",
    properties: {
        enabled: { type: Type.BOOLEAN },
        durationHours: { type: Type.NUMBER },
        temperature: { type: Type.NUMBER },
    },
    required: ["enabled", "durationHours", "temperature"]
};

const aiPlanSchema = {
    type: Type.OBJECT,
    properties: {
        bakingParameters: {
            type: Type.OBJECT,
            description: "The core recipe parameters derived from the user's query.",
            properties: {
                flourType: { type: Type.STRING, enum: Object.values(FlourType), description: "Inferred flour type." },
                hydration: { type: Type.NUMBER, description: "Inferred hydration percentage." },
                yeastType: { type: Type.STRING, enum: Object.values(YeastType), description: "Inferred yeast type." },
                yeastAmount: { type: Type.NUMBER, description: "Inferred yeast percentage for final dough. Can be 0 if all leavening is from preferment." },
                sourdoughStarterActivity: { type: Type.STRING, enum: Object.values(StarterActivity), description: "Inferred starter activity if sourdough is used." },
                salt: { type: Type.NUMBER, description: "Inferred salt percentage, typically around 2-2.5%." },
                sugar: { type: Type.NUMBER, description: "Inferred sugar percentage." },
                fat: { type: Type.NUMBER, description: "Inferred fat percentage." },
                temperature: { type: Type.NUMBER, description: "The ambient temperature provided by the user." },
                ovenProfile: { type: Type.STRING, enum: Object.values(OvenProfile), description: "The best oven profile for the desired result. e.g., 'baking-steel' for crispy pizza." },
                preferment: prefermentSchema,
                coldFermentation: coldFermentationSchema,
                bakeTimeTarget: { type: Type.STRING, description: "The user's desired bake time in ISO 8601 format, if mentioned." },
            },
            required: ["flourType", "hydration", "yeastType", "yeastAmount", "salt", "sugar", "fat", "temperature", "ovenProfile", "preferment", "coldFermentation"]
        },
        yieldParameters: {
            type: Type.OBJECT,
            description: "The yield parameters derived from the user's query.",
            properties: {
                numPieces: { type: Type.NUMBER, description: "Number of dough pieces." },
                pieceWeight: { type: Type.NUMBER, description: "Weight of each dough piece in grams." },
            },
            required: ["numPieces", "pieceWeight"]
        },
        analysis: analysisSchema
    },
    required: ["bakingParameters", "yieldParameters", "analysis"]
};


export const getBakingAnalysis = async (params: BakingParameters, metrics: CalculatedBakingMetrics, language: string): Promise<AIAnalysisResult> => {

  const flourDetails = FLOUR_OPTIONS[params.flourType];
  const yeastDetails = YEAST_OPTIONS[params.yeastType];
  const starterDetails = params.sourdoughStarterActivity ? STARTER_ACTIVITY_OPTIONS[params.sourdoughStarterActivity] : null;
  const ovenDetails = OVEN_PROFILE_OPTIONS[params.ovenProfile];
  const langName = language === 'es' ? 'Spanish' : 'English';

  const prompt = `
You are a world-class baking expert AI. Your goal is to provide a clear, reliable, and encouraging baking plan based on pre-calculated scientific data.
The user's selected language is ${langName}. The JSON schema keys must remain in English. However, all user-facing string values within the JSON output (like in 'overview', 'notes', 'details', 'proTips', and 'coldFermentation.description', 'coldFermentation.timelineAdjustments') MUST be translated into ${langName}.

A deterministic formula has calculated the core fermentation times. Your task is to interpret these numbers and create a qualitative, user-friendly plan.

**Recipe Parameters:**
- Flour Amount: ${params.flourAmount}g
- Flour Type: ${flourDetails.name} (${flourDetails.description})
- Hydration: ${params.hydration}%
- Final Dough Yeast Type: ${yeastDetails.name}
- Final Dough Yeast Amount (relative to total flour): ${params.yeastAmount}%
${params.yeastType === 'sourdough' && starterDetails ? `- Sourdough Starter Activity: ${starterDetails.name}` : ''}
- Salt: ${params.salt}%
- Sugar: ${params.sugar}%
- Fat (e.g., oil, butter): ${params.fat}%
- Ambient Temperature: ${params.temperature}°C
- Oven Profile: ${ovenDetails.name} (${ovenDetails.description})
${params.preferment.enabled ? `- Preferment: Using a ${params.preferment.type} with ${params.preferment.flourPct}% of total flour, at ${params.preferment.hydration}% hydration, with ${params.preferment.yeastPct}% yeast (on preferment flour), fermented for ${params.preferment.fermentationHours}h at ${params.preferment.fermentationTemp}°C.` : '- No preferment is being used.'}
${params.coldFermentation.enabled ? `- Cold Fermentation: The dough will be cold fermented for ${params.coldFermentation.durationHours}h at ${params.coldFermentation.temperature}°C.` : '- No cold fermentation is being used.'}
${params.bakeTimeTarget ? `- Target Bake Time: ${new Date(params.bakeTimeTarget).toLocaleString(language)}` : '- No target bake time.'}

**Core Calculated Times (in hours):**
- Bulk Fermentation: ${metrics.bulkFermentationHours.toFixed(2)} hours
- Final Proof: ${metrics.finalProofHours.toFixed(2)} hours

**Your Task:**
Generate a comprehensive baking plan in JSON format adhering to the provided schema.
1.  **Overview**: Write a brief, encouraging overview.
2.  **Fermentation Durations**: For 'bulkFermentation.duration' and 'finalProof.duration', convert the provided hours into a user-friendly range (e.g., 3.75 hours becomes "3h 30m - 4h").
3.  **Fermentation Notes**: For 'bulkFermentation.notes' and 'finalProof.notes', provide key visual cues for the baker.
4.  **Cold Proof**: If the user enabled cold fermentation, populate the 'coldProof' field with the duration and notes. The duration should match user input.
5.  **Timeline**: Create a detailed step-by-step timeline. If 'Target Bake Time' is provided, calculate and include 'startTime' and 'endTime' (ISO 8601 strings) for all steps by working backwards from the target. Base step durations on the provided core times.
6.  **Pro Tips**: Provide 3-4 actionable tips tailored to the recipe, especially for the 'Baking' step based on the oven profile.
7.  **Cold Fermentation Analysis**: If relevant, populate the 'coldFermentation' analysis field. Explain benefits and instructions.

Your output must be JSON that strictly follows the schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.5,
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIAnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get baking analysis from AI. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};

export const getAIPlanFromQuery = async (query: string, language: string): Promise<AIPlanResult> => {
    const langName = language === 'es' ? 'Spanish' : 'English';
    const prompt = `
You are a master baker AI. Your task is to interpret a user's natural language request and convert it into a complete, structured baking plan in JSON format.
Analyze the user's query for constraints (like time, temperature, yield) and desired outcomes (like 'puffy crust', 'open crumb', 'sourdough tang').
Infer any missing parameters based on baking science and the user's goals. For example, a "marked cornicione" on a pizza implies a Neapolitan style, which requires 'pizza-00' flour, high hydration (65-70%), minimal yeast, and a very hot 'baking-steel' or 'wood-fired' oven profile.
If the user mentions "biga", "poolish", or "preferment", you must fill out the 'preferment' object and set 'enabled' to true.
If they mention "cold proof" or "fridge for 2 days", you must fill out the 'coldFermentation' object and set 'enabled' to true.
If the user mentions a desired baking day/time (e.g., "ready for Saturday dinner"), calculate the 'bakeTimeTarget' as an ISO string and generate a 'timeline' in the 'analysis' object with calculated 'startTime' and 'endTime' for each step.
Fill in all fields of the JSON response. Your response must strictly adhere to the provided JSON schema.
The user's selected language is ${langName}. The JSON schema keys must remain in English. However, all user-facing string values within the 'analysis' object of the JSON output MUST be translated into ${langName}.

User's query: "${query}"

Today's date is ${new Date().toISOString()}.
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: aiPlanSchema,
                temperature: 0.6,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIPlanResult;

    } catch (error) {
        console.error("Error calling Gemini API for natural language plan:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate AI plan. Reason: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI planner.");
    }
};


export const getRescueAdvice = async (params: BakingParameters, problem: string, language: string): Promise<{advice: string[]}> => {
  const flourDetails = FLOUR_OPTIONS[params.flourType];
  const yeastDetails = YEAST_OPTIONS[params.yeastType];
  const starterDetails = params.sourdoughStarterActivity ? STARTER_ACTIVITY_OPTIONS[params.sourdoughStarterActivity] : null;
  const ovenDetails = OVEN_PROFILE_OPTIONS[params.ovenProfile];
  const langName = language === 'es' ? 'Spanish' : 'English';

  const prompt = `
You are an expert baker providing emergency advice. A home baker is having a problem with their dough.
The user's selected language is ${langName}. The JSON schema keys must remain in English. However, all user-facing string values within the JSON output (the 'advice' array) MUST be translated into ${langName}.

Their recipe parameters are:
- Flour: ${params.flourAmount}g of ${flourDetails.name}
- Hydration: ${params.hydration}%
- Leavening: ${params.yeastAmount}% ${yeastDetails.name} ${params.yeastType === 'sourdough' && starterDetails ? `(${starterDetails.name} activity)` : ''}
- Salt: ${params.salt}%
- Temperature: ${params.temperature}°C
- Oven Profile: ${ovenDetails.name}
${params.preferment.enabled ? `- Using a ${params.preferment.type} preferment.` : ''}
${params.coldFermentation.enabled ? `- During a ${params.coldFermentation.durationHours}h cold ferment.` : ''}

The baker's problem: "${problem}"

Based on their recipe and problem, provide a list of 2-3 clear, actionable, and concise rescue steps. Be encouraging. For example, if the dough is too slack, suggest a gentle re-shaping. If it's over-fermented, suggest making focaccia or flatbread. If it's under-fermented, suggest finding a warmer spot.

Your response MUST be in JSON format and strictly adhere to the provided schema.
`;

  const rescueSchema = {
    type: Type.OBJECT,
    properties: {
      advice: {
        type: Type.ARRAY,
        description: "A list of 2-3 concise rescue steps for the baker.",
        items: { type: Type.STRING },
      },
    },
    required: ["advice"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: rescueSchema,
        temperature: 0.7, // A bit more creative for problem solving
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as {advice: string[]};

  } catch (error) {
    console.error("Error calling Gemini API for rescue advice:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get rescue advice from AI. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI for rescue advice.");
  }
};