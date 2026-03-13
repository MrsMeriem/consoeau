
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, Measurement } from "../types";

export const analyzeWaterData = async (measurements: Measurement[], filter: string): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataSummary = measurements.map(m => ({
    eq: m.type_equipement,
    vol: m.volume_l,
    deb: m.debit_l_min,
    date: m.timestamp
  }));

  const prompt = `Analyse ces données de consommation d'eau pour le périmètre: ${filter}.
  Données: ${JSON.stringify(dataSummary)}
  
  Règles:
  - Détecte si la consommation est élevée par rapport aux standards (150L/j/personne).
  - Si un débit est faible (env 0.5) mais constant sur plusieurs mesures du même device, mentionne une fuite probable.
  - Donne un conseil d'économie concret et court.
  - Identifie le plus gros consommateur.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            message: { type: Type.STRING },
            sensibilisation: { type: Type.STRING },
            biggestConsumer: { type: Type.STRING },
            economyTip: { type: Type.STRING },
          },
          required: ["status", "message", "sensibilisation", "biggestConsumer", "economyTip"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis error:", error);
    throw error;
  }
};
