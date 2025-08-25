
import OpenAI from 'openai';

// Configuración de OpenRouter con modelo que soporte visión
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  dangerouslyAllowBrowser: true, // Permitir uso en navegador
  defaultHeaders: {
    "HTTP-Referer": "https://geestor.lovable.app",
    "X-Title": "Geestor - Análisis de Licitaciones",
  },
});

// Función para convertir PDF a Base64
export const convertPDFToBase64 = async (file: File): Promise<string> => {
  try {
    console.log(`📄 Convirtiendo PDF a Base64: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    console.log(`✅ PDF convertido a Base64: ${base64.length} caracteres`);
    return base64;
  } catch (error) {
    console.error(`❌ Error convirtiendo PDF ${file.name} a Base64:`, error);
    throw new Error(`Error al procesar ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Función mejorada para analizar PDF con OpenRouter usando modelo con visión
export const analyzePDFWithQwen = async (
  file: File,
  analysisPrompt: string
): Promise<string> => {
  try {
    console.log(`🤖 Analizando PDF con modelo de visión: ${file.name}`);
    
    const base64Data = await convertPDFToBase64(file);
    
    // Usar un modelo que soporte análisis de documentos/imágenes
    const completion = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5", // Modelo que soporta documentos
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${analysisPrompt}

IMPORTANTE: Este es un documento PDF que contiene información de licitación pública española. Necesito que analices el contenido del documento y extraigas la información solicitada.

Por favor, responde ÚNICAMENTE con JSON válido, sin texto adicional antes o después. Si no encuentras información específica, usa "No especificado" o arrays vacíos []`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64Data}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    console.log(`✅ Respuesta recibida del modelo de visión para ${file.name}`);
    
    if (!completion.choices[0]?.message?.content) {
      console.error(`❌ Respuesta inválida del modelo para ${file.name}:`, completion);
      throw new Error(`Respuesta inválida del modelo para ${file.name}`);
    }

    const responseText = completion.choices[0].message.content;
    console.log(`📄 Análisis completado para ${file.name}:`, responseText.substring(0, 200) + '...');

    return responseText;
    
  } catch (error) {
    console.error(`❌ Error en análisis con modelo de visión para ${file.name}:`, error);
    
    // Si el modelo falla, intentar con análisis de texto puro
    try {
      console.log(`🔄 Intentando análisis alternativo para ${file.name}...`);
      return await fallbackTextAnalysis(analysisPrompt);
    } catch (fallbackError) {
      console.error(`❌ Error en análisis alternativo:`, fallbackError);
      throw error;
    }
  }
};

// Función de fallback para análisis cuando falla el modelo principal
const fallbackTextAnalysis = async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free", // Modelo de texto gratuito
      messages: [
        {
          role: "user",
          content: `${prompt}

NOTA: No se pudo procesar el documento PDF. Por favor, proporciona una estructura JSON válida con valores por defecto para los campos solicitados. Usa "No especificado" para strings y arrays vacíos [] donde corresponda.`
        }
      ],
      temperature: 0.1,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || '{}';
  } catch (error) {
    console.error('❌ Error en análisis de fallback:', error);
    return '{}';
  }
};

// Función para parsear JSON de forma segura
export const safeJsonParse = (jsonString: string, context: string = ''): any => {
  try {
    // Limpiar la respuesta por si tiene texto extra
    const cleanedString = jsonString.trim();
    let jsonStart = cleanedString.indexOf('{');
    let jsonEnd = cleanedString.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.warn(`⚠️ No se encontró JSON válido en: ${context}`);
      return {};
    }
    
    const jsonOnly = cleanedString.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonOnly);
    
    console.log(`✅ JSON parseado exitosamente: ${context}`);
    return parsed;
  } catch (error) {
    console.error(`❌ Error parseando JSON: ${context}`, error);
    console.error(`❌ String original:`, jsonString.substring(0, 500));
    return {};
  }
};
