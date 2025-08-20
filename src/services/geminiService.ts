
interface GeminiResponse {
  text: string;
}

interface GeminiAI {
  models: {
    generateContent: (config: {
      model: string;
      contents: string;
      config: {
        responseMimeType: string;
        responseSchema?: any;
        temperature: number;
      };
    }) => Promise<GeminiResponse>;
  };
}

// Simulación de la integración directa con Gemini (similar a tu ejemplo)
const createGeminiClient = (): GeminiAI => {
  return {
    models: {
      generateContent: async (config) => {
        // Aquí usarías tu integración directa con Gemini
        // Por ahora, mantengo la funcionalidad existente pero con la nueva estructura
        const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-experimental:generateContent';
        
        const requestBody = {
          contents: [{
            parts: [{ text: config.contents }]
          }],
          generationConfig: {
            temperature: config.config.temperature,
            responseMimeType: config.config.responseMimeType,
            maxOutputTokens: 2048,
          }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('Respuesta inválida de Gemini API');
        }

        return {
          text: data.candidates[0].content.parts[0].text
        };
      }
    }
  };
};

export const geminiAI = createGeminiClient();

export const safeJsonParse = (jsonString: string, errorMessage: string): any => {
  try {
    let cleaned = jsonString.trim();
    
    // Remover markdown si existe
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Buscar el primer { y el último }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.error('Original string:', jsonString);
    throw new Error(errorMessage);
  }
};
