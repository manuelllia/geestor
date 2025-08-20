
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

**IMPORTANTE**: Responde ÚNICAMENTE con JSON válido sin texto adicional. Los documentos pueden estar en cualquier idioma de España, pero tu respuesta debe estar en español.

Extrae solo información verificable de los textos para completar esta estructura JSON:

{
  "presupuestoGeneral": "string - Presupuesto Base sin IVA",
  "esPorLotes": boolean,
  "lotes": [
    {
      "nombre": "string",
      "centroAsociado": "string", 
      "descripcion": "string",
      "presupuesto": "string",
      "requisitosClave": ["string"]
    }
  ],
  "variablesDinamicas": [
    {
      "nombre": "string",
      "descripcion": "string",
      "mapeo": "price|tenderBudget|maxScore|lowestPrice|averagePrice"
    }
  ],
  "formulaEconomica": "string - JSON AST de la fórmula principal",
  "formulasDetectadas": [
    {
      "formulaOriginal": "string",
      "representacionLatex": "string", 
      "descripcionVariables": "string"
    }
  ],
  "umbralBajaTemeraria": "string",
  "criteriosAutomaticos": [
    {
      "nombre": "string",
      "descripcion": "string",
      "puntuacionMaxima": number
    }
  ],
  "criteriosSubjetivos": [
    {
      "nombre": "string", 
      "descripcion": "string",
      "puntuacionMaxima": number
    }
  ],
  "otrosCriterios": [
    {
      "nombre": "string",
      "descripcion": "string", 
      "puntuacionMaxima": number
    }
  ],
  "costesDetalladosRecomendados": [
    {
      "categoria": "string",
      "concepto": "string",
      "costeEstimado": number,
      "justificacion": "string"
    }
  ]
}

Si no encuentras información, usa "No especificado" para strings y arrays vacíos para listas. Limita formulasDetectadas a máximo 2 fórmulas principales.`;
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
          temperature: 0.05,
          topK: 20,
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
        
        // Si es error de límite de tokens, intentar con Claude
        if (response.status === 400 && errorText.includes('token')) {
          console.log('🔄 Intentando con Claude debido a límite de tokens...');
          return await callClaudeAPI(pcapFile, pptFile);
        }
        
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 Respuesta recibida:', data);
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Respuesta inválida de Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 Procesando respuesta JSON...');
      
      let parsedResult: ReportData;
      try {
        parsedResult = JSON.parse(responseText);
        console.log('✅ JSON parseado correctamente');
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        console.log('🔄 Intentando con Claude...');
        return await callClaudeAPI(pcapFile, pptFile);
      }

      // Validar y limpiar datos
      parsedResult = validateAndCleanData(parsedResult);
      
      return parsedResult;
    } catch (error) {
      console.error('❌ Error en Gemini:', error);
      console.log('🔄 Fallback a Claude API...');
      return await callClaudeAPI(pcapFile, pptFile);
    }
  };

  const callClaudeAPI = async (pcapFile: File, pptFile: File): Promise<ReportData> => {
    const CLAUDE_API_KEY = 'sk-ant-api03-your-key-here'; // Necesitarás configurar esta key
    const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

    console.log('🧠 Usando Claude como fallback...');

    try {
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);

      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 8000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: createOptimizedPrompt()
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pcapBase64
                }
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pptBase64
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.content[0].text;
      
      const parsedResult = JSON.parse(responseText);
      return validateAndCleanData(parsedResult);
    } catch (error) {
      console.error('❌ Error en Claude:', error);
      // Como último recurso, usar GPT-4
      return await callOpenAIAPI(pcapFile, pptFile);
    }
  };

  const callOpenAIAPI = async (pcapFile: File, pptFile: File): Promise<ReportData> => {
    const OPENAI_API_KEY = 'sk-your-openai-key-here'; // Necesitarás configurar esta key
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    console.log('🔥 Usando OpenAI como último recurso...');

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
          model: 'gpt-4-vision-preview',
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
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      const parsedResult = JSON.parse(responseText);
      return validateAndCleanData(parsedResult);
    } catch (error) {
      console.error('❌ Error en OpenAI:', error);
      throw new Error('Todos los servicios de IA han fallado. Por favor, inténtalo más tarde.');
    }
  };

  const validateAndCleanData = (data: any): ReportData => {
    // Validar y limpiar los datos recibidos
    const cleanedData: ReportData = {
      presupuestoGeneral: data.presupuestoGeneral || "No especificado",
      esPorLotes: Boolean(data.esPorLotes),
      lotes: Array.isArray(data.lotes) ? data.lotes : [],
      variablesDinamicas: Array.isArray(data.variablesDinamicas) ? data.variablesDinamicas : [],
      formulaEconomica: data.formulaEconomica || "{}",
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
