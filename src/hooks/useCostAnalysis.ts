
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

  const createOptimizedPrompt = (): string => {
    return `Eres un experto consultor en licitaciones públicas de electromedicina en España. Analiza los documentos PDF: PCAP y PPT.

**CRÍTICO**: Responde ÚNICAMENTE con JSON válido y bien formateado. No añadas texto antes ni después del JSON. Los documentos pueden estar en cualquier idioma de España, pero tu respuesta debe estar en español.

Extrae solo información verificable de los textos para completar esta estructura JSON exacta:

{
  "presupuestoGeneral": "string con el presupuesto base sin IVA o 'No especificado'",
  "esPorLotes": true/false,
  "lotes": [
    {
      "nombre": "string",
      "centroAsociado": "string", 
      "descripcion": "string",
      "presupuesto": "string",
      "requisitosClave": ["string1", "string2"]
    }
  ],
  "variablesDinamicas": [
    {
      "nombre": "string",
      "descripcion": "string",
      "mapeo": "price|tenderBudget|maxScore|lowestPrice|averagePrice"
    }
  ],
  "formulaEconomica": "fórmula principal encontrada o 'No especificada'",
  "formulasDetectadas": [
    {
      "formulaOriginal": "string",
      "representacionLatex": "string", 
      "descripcionVariables": "string"
    }
  ],
  "umbralBajaTemeraria": "porcentaje o criterio encontrado o 'No especificado'",
  "criteriosAutomaticos": [
    {
      "nombre": "string",
      "descripcion": "string",
      "puntuacionMaxima": 0
    }
  ],
  "criteriosSubjetivos": [
    {
      "nombre": "string", 
      "descripcion": "string",
      "puntuacionMaxima": 0
    }
  ],
  "otrosCriterios": [
    {
      "nombre": "string",
      "descripcion": "string", 
      "puntuacionMaxima": 0
    }
  ],
  "costesDetalladosRecomendados": [
    {
      "categoria": "string",
      "concepto": "string",
      "costeEstimado": 0,
      "justificacion": "string"
    }
  ]
}

IMPORTANTE: Si no encuentras información específica, usa "No especificado" para strings, false para booleanos, 0 para números y arrays vacíos [] para listas. Máximo 2 fórmulas en formulasDetectadas.`;
  };

  const cleanJsonResponse = (text: string): string => {
    // Remover texto antes y después del JSON
    let cleaned = text.trim();
    
    // Buscar el primer { y el último }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    // Limpiar caracteres problemáticos
    cleaned = cleaned
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Caracteres de control
      .replace(/\n/g, ' ') // Saltos de línea
      .replace(/\r/g, '') // Retornos de carro
      .replace(/\t/g, ' ') // Tabulaciones
      .replace(/\s+/g, ' ') // Espacios múltiples
      .trim();
    
    return cleaned;
  };

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<ReportData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

    console.log('🤖 Iniciando análisis con Gemini API optimizado...');

    try {
      console.log('📄 Convirtiendo archivos a base64...');
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);
      console.log('✅ Archivos convertidos');

      const requestBody = {
        contents: [{
          parts: [
            {
              text: createOptimizedPrompt()
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
          topK: 10,
          topP: 0.8,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      };

      console.log('🚀 Enviando solicitud a Gemini...');
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', response.status, errorText);
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 Respuesta recibida:', data);
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Respuesta inválida de Gemini API');
      }

      let responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 Texto bruto recibido:', responseText);
      
      // Limpiar y procesar el JSON
      responseText = cleanJsonResponse(responseText);
      console.log('🧹 Texto limpiado:', responseText);
      
      let parsedResult: ReportData;
      try {
        parsedResult = JSON.parse(responseText);
        console.log('✅ JSON parseado correctamente');
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        console.log('🔄 Intentando con OpenAI...');
        return await callOpenAIAPI(pcapFile, pptFile);
      }

      // Validar y limpiar datos
      parsedResult = validateAndCleanData(parsedResult);
      return parsedResult;
      
    } catch (error) {
      console.error('❌ Error en Gemini:', error);
      console.log('🔄 Fallback a OpenAI API...');
      return await callOpenAIAPI(pcapFile, pptFile);
    }
  };

  const callOpenAIAPI = async (pcapFile: File, pptFile: File): Promise<ReportData> => {
    const OPENAI_API_KEY = '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';
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    console.log('🔥 Usando OpenAI API...');

    try {
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: createOptimizedPrompt()
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${pcapBase64}`
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${pptBase64}`
                }
              }
            ]
          }],
          max_tokens: 4000,
          temperature: 0.1,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error OpenAI:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      let responseText = data.choices[0].message.content;
      
      // Limpiar y procesar el JSON
      responseText = cleanJsonResponse(responseText);
      console.log('🧹 OpenAI Texto limpiado:', responseText);
      
      const parsedResult = JSON.parse(responseText);
      return validateAndCleanData(parsedResult);
      
    } catch (error) {
      console.error('❌ Error en OpenAI:', error);
      throw new Error('Error en el análisis con IA. Por favor, inténtalo más tarde.');
    }
  };

  const validateAndCleanData = (data: any): ReportData => {
    // Validar y limpiar los datos recibidos
    const cleanedData: ReportData = {
      presupuestoGeneral: data.presupuestoGeneral || "No especificado",
      esPorLotes: Boolean(data.esPorLotes),
      lotes: Array.isArray(data.lotes) ? data.lotes : [],
      variablesDinamicas: Array.isArray(data.variablesDinamicas) ? data.variablesDinamicas : [],
      formulaEconomica: data.formulaEconomica || "No especificada",
      formulasDetectadas: Array.isArray(data.formulasDetectadas) ? data.formulasDetectadas.slice(0, 2) : [],
      umbralBajaTemeraria: data.umbralBajaTemeraria || "No especificado",
      criteriosAutomaticos: Array.isArray(data.criteriosAutomaticos) ? data.criteriosAutomaticos : [],
      criteriosSubjetivos: Array.isArray(data.criteriosSubjetivos) ? data.criteriosSubjetivos : [],
      otrosCriterios: Array.isArray(data.otrosCriterios) ? data.otrosCriterios : [],
      costesDetalladosRecomendados: Array.isArray(data.costesDetalladosRecomendados) ? data.costesDetalladosRecomendados : []
    };

    return cleanedData;
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('🔍 Iniciando análisis de costes optimizado...');
      console.log('📄 Archivos:', {
        pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
        ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
      });

      const result = await callGeminiAPI(pcapFile, pptFile);
      console.log('✅ Análisis completado exitosamente');

      setAnalysisResult(result);
    } catch (err) {
      console.error('❌ Error final en análisis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el análisis';
      setError(errorMessage);
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
