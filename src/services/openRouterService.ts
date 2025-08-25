import OpenAI from 'openai';

// Configuración de OpenRouter con modelo que soporte visión
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  dangerouslyAllowBrowser: true, // Permitir uso en navegador. ¡CUIDADO! Tu clave API es visible en el frontend!
                              // Para producción, se recomienda una arquitectura backend para manejar las llamadas a la API.
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

// Función para analizar PDF con OpenRouter usando un modelo multimodal
export const analyzePDFWithQwen = async ( 
  file: File,
  analysisPrompt: string
): Promise<string> => {
  try {
    // Para analizar PDFs, necesitamos un modelo multimodal.
    // "google/gemini-pro-vision" es fiable y a menudo el más económico/gratuito en OpenRouter para esta tarea.
    // No hay modelos Qwen multimodales gratuitos en OpenRouter.
    const primaryModel = "qwen/qwen3-235b-a22b"; // Modelo verificado para PDF en OpenRouter

    console.log(`🤖 Analizando PDF con modelo multimodal (${primaryModel}): ${file.name}`);
    
    const base64Data = await convertPDFToBase64(file);
    
    const completion = await openai.chat.completions.create({
      model: primaryModel, 
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${analysisPrompt}

IMPORTANTE: Este es un documento PDF que contiene información de licitación pública española. Analiza el contenido del documento, prestando especial atención a la sección de electromedicina, y extrae la información solicitada con la mayor precisión posible.

Por favor, responde ÚNICAMENTE con JSON válido, sin texto adicional antes o después. Si no encuentras información específica, usa "No especificado" o arrays vacíos [] para las listas.`
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

    console.log(`✅ Respuesta recibida del modelo ${primaryModel} para ${file.name}`);
    
    if (!completion.choices[0]?.message?.content) {
      console.error(`❌ Respuesta inválida del modelo ${primaryModel} para ${file.name}:`, completion);
      throw new Error(`Respuesta inválida del modelo ${primaryModel} para ${file.name}`);
    }

    const responseText = completion.choices[0].message.content;
    console.log(`📄 Análisis completado para ${file.name}:`, responseText.substring(0, 200) + '...');

    return responseText;
    
  } catch (error) {
    console.error(`❌ Error en análisis con modelo principal (${(error as any).message || 'desconocido'}) para ${file.name}. Intentando análisis alternativo (solo texto)...`, error);
    
    // Si el modelo principal (multimodal) falla, intentar con análisis de texto puro
    try {
      return await fallbackTextAnalysis(analysisPrompt);
    } catch (fallbackError) {
      console.error(`❌ Error en análisis alternativo (fallback):`, fallbackError);
      throw new Error(`Falló el análisis del documento ${file.name}. Error principal: ${error instanceof Error ? error.message : String(error)}. Error de fallback: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
    }
  }
};

// Función de fallback para análisis cuando falla el modelo principal (solo texto)
const fallbackTextAnalysis = async (prompt: string): Promise<string> => {
  try {
    // Este modelo es de solo texto y es gratis y robusto para generar JSON.
    // No puede leer el PDF, solo responderá al prompt general.
    const fallbackModel = "mistralai/mixtral-8x7b-instruct"; 
    // Otra opción gratuita de texto robusta es "01-ai/qwen-2-72b-instruct:free"
    // Pero para evitar más confusiones con IDs de Qwen, usaremos Mixtral.

    console.log(`🌐 Usando modelo de fallback (${fallbackModel}) para proporcionar JSON por defecto.`);
    const completion = await openai.chat.completions.create({
      model: fallbackModel, 
      messages: [
        {
          role: "user",
          content: `${prompt}

NOTA IMPORTANTE: El documento PDF no pudo ser procesado por el modelo multimodal. Esta respuesta de fallback contiene una estructura JSON con valores por defecto para los campos solicitados, asumiendo una licitación de electromedicina genérica. **No se ha extraído información real del documento.** Usa "No especificado" para strings, "0" para números, "false" para booleanos y arrays vacíos [] donde corresponda. No incluyas un "resumen_ejecutivo" con contenido si no hay datos del documento.`
        }
      ],
      temperature: 0.1,
      max_tokens: 2048,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error("Respuesta vacía del modelo de fallback.");
    }
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('❌ Error en análisis de fallback:', error);
    throw new Error(`El análisis de fallback falló: ${error instanceof Error ? error.message : String(error)}. Asegúrate de que el modelo "mistralai/mixtral-8x7b-instruct" esté disponible en tu cuenta de OpenRouter y que el prompt no sea demasiado largo.`);
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
      console.warn(`⚠️ No se encontró JSON válido en la respuesta del modelo para: ${context}`);
      return {};
    }
    
    const jsonOnly = cleanedString.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonOnly);
    
    console.log(`✅ JSON parseado exitosamente para: ${context}`);
    return parsed;
  } catch (error) {
    console.error(`❌ Error parseando JSON para: ${context}`, error);
    console.error(`❌ String original (primeros 500 chars):`, jsonString.substring(0, 500));
    return {};
  }
};

// --- Ejemplo de uso con el prompt de licitación de electromedicina ---

// Define el prompt para el análisis de licitaciones de electromedicina
const electromedicinaAnalysisPrompt = `
Eres un asistente experto en licitaciones públicas de electromedicina en España. Tu tarea es analizar un documento PDF de licitación y extraer la información más relevante para decidir si una empresa del sector de electromedicina debería presentar una oferta y, si es así, qué aspectos clave debe considerar.

Necesito la siguiente información estructurada en formato JSON. Para cada campo, si la información no se encuentra, usa "No especificado", "0" para números, "false" para booleanos o un array vacío [] para listas.

\`\`\`json
{
  "resumen_ejecutivo": "Un resumen conciso de los puntos clave de la licitación y su idoneidad para una empresa de electromedicina, incluyendo si hay algún requisito o riesgo importante.",
  "datos_generales_licitacion": {
    "nombre_licitacion": "string",
    "id_expediente": "string",
    "organismo_contratante": "string",
    "objeto_contrato": "string",
    "tipo_contrato": "string",
    "valor_estimado_contrato_eur": "number",
    "presupuesto_base_licitacion_sin_impuestos_eur": "number",
    "impuestos_aplicables_porcentaje": "number",
    "duracion_contrato": "string"
  },
  "requisitos_tecnicos_electromedicina": {
    "descripcion_especifica_material_servicio": "string",
    "productos_solicitados": [
      {
        "nombre_producto": "string",
        "cantidad": "string", // Puede ser número o texto como "varias unidades"
        "referencia_o_modelo_deseado": "string",
        "especificaciones_tecnicas_clave": "string"
      }
    ],
    "servicios_asociados_solicitados": [
      {
        "nombre_servicio": "string",
        "descripcion": "string",
        "duracion_o_frecuencia": "string"
      }
    ],
    "certificaciones_normativas_exigidas": ["string"],
    "compatibilidad_integracion_sistemas_existentes": "string"
  },
  "criterios_valoracion_ofertas": [
    {
      "criterio": "string",
      "ponderacion_porcentaje": "number",
      "detalles": "string" // Ejemplo: "Mejoras técnicas, plazo de entrega, precio, calidad"
    }
  ],
  "plazos_fechas_clave": {
    "fecha_publicacion": "string",
    "fecha_limite_presentacion_ofertas": "string",
    "fecha_apertura_ofertas_tecnicas": "string",
    "fecha_apertura_ofertas_economicas": "string",
    "fecha_prevista_adjudicacion": "string"
  },
  "requisitos_administrativos_garantias": {
    "garantia_provisional_exigida_eur": "number",
    "garantia_definitiva_exigida_porcentaje": "number",
    "solvencia_economica_financiera_requerida": "string",
    "solvencia_tecnica_profesional_requerida": "string",
    "documentacion_administrativa_clave": ["string"]
  },
  "informacion_contacto": {
    "departamento": "string",
    "persona_contacto": "string",
    "email_contacto": "string",
    "telefono_contacto": "string"
  },
  "observaciones_riesgos": "Cualquier otra observación relevante, como posibles riesgos, cláusulas especiales o aspectos que puedan influir significativamente en la decisión de presentar una oferta."
}
\`\`\`
`;

// Función de ejemplo para procesar un documento (simula un archivo cargado)
async function processTenderDocument(tenderFile: File) {
  try {
    console.log("Iniciando procesamiento con prompt:", electromedicinaAnalysisPrompt.substring(0, 100) + "...");

    const jsonResponse = await analyzePDFWithQwen(tenderFile, electromedicinaAnalysisPrompt);
    const parsedData = safeJsonParse(jsonResponse, `Análisis de ${tenderFile.name}`);
    
    if (Object.keys(parsedData).length > 0) {
      console.log('✨ Resumen de la licitación de electromedicina:');
      console.log(JSON.stringify(parsedData, null, 2));
      // Aquí puedes usar parsedData para mostrar la información en tu UI
    } else {
      console.log('❌ No se pudo obtener un análisis válido de la licitación.');
    }
  } catch (error) {
    console.error('🚫 Error general al procesar la licitación:', error);
  }
}

// Para probarlo en un entorno de navegador (ej. React, Vue, HTML con JS):
/*
// Asegúrate de tener un input de tipo file en tu HTML: <input type="file" id="tenderFileInput" accept=".pdf" />
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('tenderFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log(`Archivo seleccionado: ${file.name}`);
        await processTenderDocument(file);
      } else {
        console.log('Ningún archivo seleccionado.');
      }
    });
  } else {
    console.error('Elemento #tenderFileInput no encontrado en el DOM.');
  }
});
*/