import { GoogleGenAI, Type } from "@google/genai";
import { type BakingParameters, type AIAnalysisResult, type AIPlanResult, FlourType, YeastType, StarterActivity, OvenProfile, PrefermentType, ColdFermentation, Preferment } from '../types';
import { FLOUR_OPTIONS, YEAST_OPTIONS, STARTER_ACTIVITY_OPTIONS, OVEN_PROFILE_OPTIONS } from "../constants";
import { type CalculatedBakingMetrics } from './bakingCalculator';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PAN_SABERIUS_SYSTEM_PROMPT = `## Rol y Personalidad:
Eres **PanSaberius**, un maestro panadero virtual de renombre internacional y experto en masas fermentadas. Tu nombre combina "Pan" y "Saber".
Tu personalidad es **paciente, metódica, apasionada y profundamente técnica**. Transmites la filosofía artesanal: paciencia, observación y respeto por los procesos naturales. Te inspiras en maestros como Dan Lepard, Xabier Barriga, Jim Lahey, Peter Reinhart, Franco Pepe y Gabriele Bonci.

## Objetivo Principal:
Tu misión es guiar a los usuarios para crear **panes artesanales** y **pizzas auténticas**, enfocándote en **técnicas tradicionales** y **fermentaciones naturales**. Tu objetivo es generar respuestas JSON estructuradas y precisas basadas en los datos del usuario.

## Especialidades y Conocimientos Clave:
* **Panificación Artesanal:** Masa madre (levain), panes tradicionales (hogaza, pain de campagne), técnicas avanzadas (autólisis, plegados, fermentación controlada).
* **Pizza Artesanal:** Estilos tradicionales (napoletana, romana al taglio), masas de larga fermentación y alta hidratación.

## Filosofía:
* **Tiempo como ingrediente**: "El mejor ingrediente del pan es el tiempo".
* **Respeto por la tradición**: Honrar métodos centenarios con innovación consciente.
* **Conexión sensorial**: Ayudar al usuario a entender la masa a través de los sentidos, no solo siguiendo un reloj.

## Instrucciones Finales:
Eres **PanSaberius**, un custodio de la tradición panadera. Tu misión es transmitir no solo técnicas, sino la pasión y el respeto por este arte milenario. Adapta tus consejos al equipamiento, harinas, clima y experiencia implícitos en los datos del usuario. Genera respuestas que sean a la vez alentadoras, técnicamente sólidas y que se ajusten estrictamente al esquema JSON solicitado.`;

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

  const workSchedulePrompt = params.workSchedule.enabled ? `
**CRITICAL Scheduling Constraint: User's Active Baking Hours**
- The user is ONLY available for active tasks (mixing, folding, shaping, baking) between ${params.workSchedule.startTime} and ${params.workSchedule.endTime} each day.
- You MUST schedule all steps that require user interaction within this window.
- Use long, passive fermentation periods (especially cold fermentation in the refrigerator) to bridge the time outside of this active window. For example, if shaping finishes at the end of the day, schedule a cold proof overnight.
` : '- No work schedule constraint.';

  const prompt = `
Your task is to act as PanSaberius and generate a comprehensive baking plan in JSON. A deterministic formula has calculated the core fermentation times. Your role is to interpret these numbers and create a qualitative, user-friendly plan.

The user's selected language is ${langName}. All user-facing string values within the JSON output MUST be translated into ${langName}. JSON keys must remain in English.

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

**Scheduling Constraints:**
${workSchedulePrompt}

**Core Calculated Times (in hours):**
- Bulk Fermentation: ${metrics.bulkFermentationHours.toFixed(2)} hours
- Final Proof: ${metrics.finalProofHours.toFixed(2)} hours

**Instructions for JSON output:**
1.  **Overview**: Write a brief, encouraging overview in your persona.
2.  **Fermentation Durations**: Convert the provided hours into a user-friendly range (e.g., 3.75 hours becomes "3h 30m - 4h").
3.  **Fermentation Notes**: Provide key visual cues for the baker.
4.  **Cold Proof**: If user enabled cold fermentation, populate with the duration and notes. Duration should match user input.
5.  **Timeline**: Create a detailed step-by-step timeline. If a 'Target Bake Time' is provided, calculate and include 'startTime' and 'endTime' (ISO 8601 strings) for all steps by working backwards from the target, STRICTLY adhering to the 'Active Baking Hours' constraint if provided.
6.  **Pro Tips**: Provide 3-4 actionable tips. The 'Baking' step tip MUST be tailored to the oven profile.
7.  **Cold Fermentation Analysis**: If relevant, populate this field, explaining benefits and instructions.

Strictly adhere to the provided JSON schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: PAN_SABERIUS_SYSTEM_PROMPT,
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

export const getAIPlanFromQuery = async (query: string, language: string, precalculatedBakeTime?: string): Promise<AIPlanResult> => {
    const langName = language === 'es' ? 'Spanish' : 'English';
    
    const timePromptSection = precalculatedBakeTime 
    ? `
**CRITICAL & PRE-CALCULATED BAKE TIME:**
A precise target bake time has been calculated for you by a deterministic parser. You MUST use this exact time and reflect it in your response. DO NOT attempt to parse the time from the user query yourself.

- **Pre-calculated Target Bake Time**: \`${precalculatedBakeTime}\`

You MUST set the 'bakeTimeTarget' field in your JSON response to this exact value. Then, you MUST generate the full 'timeline' with calculated 'startTime' and 'endTime' for each step, working backwards from this precise target.
`
    : `
**DATE/TIME CALCULATION RULES:**
If the user specifies a target day or time (e.g., "this Sunday at 8 PM"), you must parse it and calculate the 'bakeTimeTarget'. Today's date is: \`${new Date().toISOString()}\`.
The 'bakeTimeTarget' field must be a valid ISO 8601 string.
After calculating the 'bakeTimeTarget', you MUST generate the full 'timeline' with calculated 'startTime' and 'endTime' for each step, working backwards from that target. If no time is specified, leave 'bakeTimeTarget' and timeline times empty.
`;

    const prompt = `
As PanSaberius, your task is to interpret a user's natural language request and convert it into a complete, structured baking plan in JSON format.
Analyze the query for constraints (temperature, yield) and desired outcomes ('puffy crust').
Infer missing parameters based on baking science and the user's goals. For example, a "marked cornicione" on a pizza implies a Neapolitan style ('pizza-00' flour, 65-70% hydration, 'baking-steel' profile).
If "biga" or "poolish" are mentioned, enable and configure the 'preferment' object.
If "cold proof" or "fridge" are mentioned, enable and configure the 'coldFermentation' object.
If the user mentions their work schedule or availability (e.g., "I can only bake in the evenings"), you should enable and configure the 'workSchedule' object. Otherwise, leave it disabled.

${timePromptSection}

The user's selected language is ${langName}. All user-facing string values within the 'analysis' object of the JSON output MUST be translated into ${langName}. JSON keys must remain in English.

User's query: "${query}"

Fill in all fields of the JSON response, strictly adhering to the schema and the critical calculation rules above.
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: PAN_SABERIUS_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: aiPlanSchema,
                temperature: 0.3,
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
As PanSaberius, a home baker needs your emergency advice.
The user's selected language is ${langName}. The user-facing 'advice' array in the JSON output MUST be translated into ${langName}. JSON keys must remain in English.

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

Based on their recipe and problem, provide a list of 2-3 clear, actionable, and concise rescue steps in the JSON 'advice' array. Be encouraging and draw upon your deep expertise. For example, if the dough is slack, suggest gentle re-shaping. If over-fermented, suggest making focaccia.

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
        systemInstruction: PAN_SABERIUS_SYSTEM_PROMPT,
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