
import { useState } from 'react';

interface ReportData {
  presupuestoGeneral: string;
  esPorLotes: boolean;
  lotes: any[];
  variablesDinamicas: any[];
  formulaEconomica: string;
  formulasDetectadas: any[];
  umbralBajaTemeraria: string;
  criteriosAutomaticos: any[];
  criteriosSubjetivos: any[];
  otrosCriterios: any[];
  costesDetalladosRecomendados: any[];
}

const responseSchema = {
  type: "object",
  properties: {
    presupuestoGeneral: { type: "string" },
    esPorLotes: { type: "boolean" },
    lotes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          centroAsociado: { type: "string" },
          descripcion: { type: "string" },
          presupuesto: { type: "string" },
          requisitosClave: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["nombre", "centroAsociado", "descripcion", "presupuesto"]
      }
    },
    variablesDinamicas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          mapeo: { 
            type: "string",
            enum: ["price", "tenderBudget", "maxScore", "lowestPrice", "averagePrice"] 
          }
        },
        required: ["nombre", "descripcion", "mapeo"]
      }
    },
    formulaEconomica: { type: "string" },
    formulasDetectadas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          formulaOriginal: { type: "string" },
          representacionLatex: { type: "string" },
          descripcionVariables: { type: "string" }
        },
        required: ["formulaOriginal", "representacionLatex", "descripcionVariables"]
      }
    },
    umbralBajaTemeraria: { type: "string" },
    criteriosAutomaticos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          puntuacionMaxima: { type: "number" }
        },
        required: ["nombre", "descripcion", "puntuacionMaxima"]
      }
    },
    criteriosSubjetivos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          puntuacionMaxima: { type: "number" }
        },
        required: ["nombre", "descripcion", "puntuacionMaxima"]
      }
    },
    otrosCriterios: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          puntuacionMaxima: { type: "number" }
        },
        required: ["nombre", "descripcion", "puntuacionMaxima"]
      }
    },
    costesDetalladosRecomendados: {
      type: "array",
      items: {
        type: "object",
        properties: {
          categoria: { type: "string" },
          concepto: { type: "string" },
          costeEstimado: { type: "number" },
          justificacion: { type: "string" }
        },
        required: ["categoria", "concepto", "costeEstimado", "justificacion"]
      }
    }
  },
  required: [
    "presupuestoGeneral",
    "esPorLotes", 
    "lotes",
    "variablesDinamicas",
    "formulaEconomica",
    "formulasDetectadas",
    "umbralBajaTemeraria",
    "criteriosAutomaticos",
    "criteriosSubjetivos",
    "otrosCriterios",
    "costesDetalladosRecomendados"
  ]
};

export const useCostAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createAnalysisPrompt = (): string => {
    return `Actúa como un experto consultor especializado en licitaciones públicas de electromedicina en España. Tu tarea es analizar los documentos PDF proporcionados: un Pliego de Cláusulas Administrativas Particulares (PCAP) y un Pliego de Prescripciones Técnicas (PPT).

**Instrucción de Idioma:** Los documentos pueden estar en español, catalán, gallego, euskera, valenciano o inglés. Tu respuesta DEBE estar SIEMPRE en español.

Extrae únicamente la información verificable presente en los textos para rellenar la estructura JSON solicitada. 

**Análisis de Lotes:**
1. Detecta si la licitación está dividida en lotes (esPorLotes: true/false)
2. Si hay lotes, extrae para cada uno: nombre, centroAsociado, descripcion, presupuesto (sin IVA), requisitosClave

**Variables Dinámicas:**
Identifica las variables de la fórmula económica principal y mapéalas a:
- "price": precio de la oferta
- "tenderBudget": presupuesto de licitación  
- "maxScore": puntuación máxima
- "lowestPrice": precio más bajo
- "averagePrice": precio promedio

**Fórmula Económica:**
Si existe fórmula económica, conviértela a AST JSON como string. Si no existe, usar "{}"

**Fórmulas Detectadas:**
Para cada fórmula matemática encontrada:
- formulaOriginal: fórmula exacta del texto
- representacionLatex: conversión a LaTeX
- descripcionVariables: explicación de cada variable

**Análisis de Criterios:**
- umbralBajaTemeraria: condiciones para ofertas anormalmente bajas
- criteriosAutomaticos: criterios objetivos con puntuación
- criteriosSubjetivos: criterios subjetivos con puntuación  
- otrosCriterios: otros criterios adicionales

**Análisis Económico:**
- presupuestoGeneral: Presupuesto Base de Licitación total sin IVA
- costesDetalladosRecomendados: desglose de costes recomendado por categorías

Si un dato no se encuentra, usar "No especificado en los documentos" para strings y arrays vacíos para listas.

IMPORTANTE: Mantén las respuestas concisas para evitar truncamiento. Limita formulasDetectadas a máximo 3 fórmulas principales.`;
  };

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<ReportData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

    console.log('🤖 Llamando a Gemini API...');

    try {
      // Convertir archivos a base64
      console.log('📄 Convirtiendo archivos a base64...');
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);
      console.log('✅ Archivos convertidos a base64');

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: createAnalysisPrompt()
              },
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: pcapBase64
                }
              },
              {
                inline_data: {
                  mime_type: "application/pdf", 
                  data: pptBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 6144, // Reducido para evitar truncamiento
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error de Gemini API:', response.status, errorText);
        throw new Error(`Error de Gemini API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta de Gemini recibida:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Respuesta inválida de Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 Texto de respuesta:', responseText);
      
      let parsedResult: ReportData;
      try {
        // Verificar si el JSON está completo antes de parsear
        if (!responseText.trim().endsWith('}')) {
          console.warn('⚠️ JSON truncado detectado, intentando reparar...');
          // Intentar reparar JSON truncado añadiendo llaves de cierre
          const repairedJson = responseText.trim() + (responseText.includes('"condicionesLogicas') ? '"}]}' : '"}]}');
          parsedResult = JSON.parse(repairedJson);
        } else {
          parsedResult = JSON.parse(responseText);
        }
        console.log('✅ JSON parseado correctamente:', parsedResult);
      } catch (parseError) {
        console.error('❌ Error al parsear JSON:', parseError);
        console.error('📝 Texto problemático:', responseText);
        throw new Error('Error al parsear la respuesta de la IA');
      }

      // Post-procesamiento: parsear formulaEconomica si existe y no está vacía
      if (parsedResult.formulaEconomica && parsedResult.formulaEconomica !== '{}') {
        try {
          const formulaObject = JSON.parse(parsedResult.formulaEconomica);
          console.log('✅ Fórmula económica parseada:', formulaObject);
          parsedResult.formulaEconomica = JSON.stringify(formulaObject);
        } catch (formulaError) {
          console.warn('⚠️ Error al parsear formulaEconomica, manteniendo como string:', formulaError);
        }
      }

      return parsedResult;
    } catch (error) {
      console.error('❌ Error en llamada a Gemini API:', error);
      throw error;
    }
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('🔍 Iniciando análisis de costes...');
      console.log('📄 Archivos recibidos:', {
        pcap: pcapFile.name,
        ppt: pptFile.name
      });

      // Llamar directamente a Gemini API con los archivos
      console.log('🤖 Enviando archivos a Gemini API...');
      const result = await callGeminiAPI(pcapFile, pptFile);
      console.log('✅ Análisis completado:', result);

      setAnalysisResult(result);
    } catch (err) {
      console.error('❌ Error en análisis de costes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error en el análisis: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeCosts,
    analysisResult,
    isLoading,
    error
  };
};
