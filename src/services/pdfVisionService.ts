
// Servicio optimizado para análisis de PDFs usando Gemini Vision API
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

// Función para analizar PDF directamente con Gemini Vision
export const analyzePDFWithGeminiVision = async (
  file: File,
  analysisPrompt: string
): Promise<string> => {
  try {
    console.log(`🤖 Analizando PDF con Gemini Vision: ${file.name}`);
    
    const base64Data = await convertPDFToBase64(file);
    
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const requestBody = {
      contents: [{
        parts: [
          { text: analysisPrompt },
          {
            inline_data: {
              mime_type: 'application/pdf',
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        topK: 20,
        topP: 0.8
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

    console.log(`🚀 Enviando PDF a Gemini Vision API: ${file.name}`);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error en Gemini Vision API para ${file.name}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 429) {
        throw new Error('Límite de velocidad excedido. Reintentando en unos segundos...');
      } else if (response.status === 400) {
        throw new Error('Solicitud inválida. El PDF puede ser demasiado grande o corrupto.');
      } else {
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Respuesta recibida de Gemini Vision para ${file.name}`);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error(`❌ Respuesta inválida de Gemini Vision para ${file.name}:`, data);
      throw new Error(`Respuesta inválida de Gemini Vision API para ${file.name}`);
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log(`📄 Análisis completado para ${file.name}:`, responseText.substring(0, 200) + '...');

    return responseText;
    
  } catch (error) {
    console.error(`❌ Error en análisis con Gemini Vision para ${file.name}:`, error);
    throw error;
  }
};
