
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

// Cliente optimizado para la API de Gemini
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
            maxOutputTokens: 4096, // Reducido para mejor rendimiento
            topK: 20, // Optimizado para precisión
            topP: 0.8, // Ajustado para mayor consistencia
            candidateCount: 1
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        };

        console.log('🚀 Llamando a Gemini API optimizada:', {
          model: config.model,
          url: GEMINI_API_URL,
          promptLength: config.contents.length,
          temperature: config.config.temperature,
          maxTokens: 4096
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
          
          // Manejo específico de errores comunes
          if (response.status === 429) {
            throw new Error('Límite de velocidad excedido. Reintentando en unos segundos...');
          } else if (response.status === 400) {
            throw new Error('Solicitud inválida. El contenido puede ser demasiado largo.');
          } else {
            throw new Error(`Error HTTP ${response.status}: ${errorText}`);
          }
        }

        const data: GeminiResponse = await response.json();
        console.log('✅ Respuesta recibida de Gemini API optimizada');
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.error('❌ Respuesta inválida de Gemini:', data);
          throw new Error('Respuesta inválida de Gemini API - estructura de respuesta incompleta');
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
    
    // Remover texto antes del JSON
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }
    
    // Limpiar caracteres problemáticos
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    
    const parsed = JSON.parse(cleaned);
    console.log('✅ JSON parseado correctamente');
    return parsed;
  } catch (error) {
    console.error('❌ Error parsing JSON:', error);
    console.error('String original:', jsonString.substring(0, 500) + '...');
    
    // Intentar extraer JSON de forma más agresiva
    try {
      const matches = jsonString.match(/\{[\s\S]*\}/);
      if (matches && matches[0]) {
        const extractedJson = matches[0];
        const parsed = JSON.parse(extractedJson);
        console.log('✅ JSON extraído y parseado correctamente en segundo intento');
        return parsed;
      }
    } catch (secondError) {
      console.error('❌ Segundo intento de parsing también falló:', secondError);
    }
    
    throw new Error(errorMessage);
  }
};
