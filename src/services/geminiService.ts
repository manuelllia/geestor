
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
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
    }) => Promise<{ text: string }>;
  };
}

// Cliente real para la API de Gemini
const createGeminiClient = (): GeminiAI => {
  return {
    models: {
      generateContent: async (config) => {
        const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`;
        
        const requestBody = {
          contents: [{
            parts: [{ text: config.contents }]
          }],
          generationConfig: {
            temperature: config.config.temperature,
            responseMimeType: config.config.responseMimeType,
            maxOutputTokens: 8192,
            topK: 40,
            topP: 0.95
          }
        };

        console.log('🚀 Llamando a Gemini API:', {
          model: config.model,
          url: GEMINI_API_URL,
          promptLength: config.contents.length,
          temperature: config.config.temperature
        });

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error en Gemini API:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
          throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }

        const data: GeminiResponse = await response.json();
        console.log('✅ Respuesta recibida de Gemini API');
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.error('❌ Respuesta inválida de Gemini:', data);
          throw new Error('Respuesta inválida de Gemini API - no se encontró texto en la respuesta');
        }

        const responseText = data.candidates[0].content.parts[0].text;
        console.log('📄 Texto de respuesta recibido:', responseText.substring(0, 200) + '...');

        return {
          text: responseText
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
    
    const parsed = JSON.parse(cleaned);
    console.log('✅ JSON parseado correctamente');
    return parsed;
  } catch (error) {
    console.error('❌ Error parsing JSON:', error);
    console.error('Original string:', jsonString);
    throw new Error(errorMessage);
  }
};
