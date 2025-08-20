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
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [partialData, setPartialData] = useState<any>(null);

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

  const createOptimizedPrompt = (attempt: number = 0, existingData: any = null): string => {
    const basePrompt = `Eres un experto consultor en licitaciones públicas de electromedicina en España. Analiza los documentos PDF: PCAP y PPT.

CRÍTICO: Responde ÚNICAMENTE con JSON válido y bien formateado. No añadas texto antes ni después del JSON. Los documentos pueden estar en cualquier idioma de España, pero tu respuesta debe estar en español.`;

    if (attempt === 0 || !existingData) {
      return `${basePrompt}

PRIMERA CONSULTA - Extrae la información básica en este orden de prioridad:
1. presupuestoGeneral
2. esPorLotes
3. formulaEconomica
4. umbralBajaTemeraria
5. Solo los primeros 2-3 lotes si existen

Estructura JSON requerida:
{
  "presupuestoGeneral": "string con el presupuesto base sin IVA o 'No especificado'",
  "esPorLotes": true/false,
  "formulaEconomica": "fórmula principal encontrada o 'No especificada'",
  "umbralBajaTemeraria": "porcentaje o criterio encontrado o 'No especificado'",
  "lotes": [
    {
      "nombre": "string",
      "centroAsociado": "string", 
      "descripcion": "string",
      "presupuesto": "string",
      "requisitosClave": ["string1", "string2"]
    }
  ],
  "variablesDinamicas": [],
  "formulasDetectadas": [],
  "criteriosAutomaticos": [],
  "criteriosSubjetivos": [],
  "otrosCriterios": [],
  "costesDetalladosRecomendados": []
}`;
    } else if (attempt === 1) {
      return `${basePrompt}

SEGUNDA CONSULTA - Completa solo las fórmulas y variables dinámicas:

Completa ÚNICAMENTE estos campos del JSON existente:
{
  "formulasDetectadas": [
    {
      "formulaOriginal": "string",
      "representacionLatex": "string",
      "descripcionVariables": "string"
    }
  ],
  "variablesDinamicas": [
    {
      "nombre": "string",
      "descripcion": "string",
      "mapeo": "price|tenderBudget|maxScore|lowestPrice|averagePrice"
    }
  ]
}`;
    } else if (attempt === 2) {
      return `${basePrompt}

TERCERA CONSULTA - Completa solo los criterios:

Responde ÚNICAMENTE con este JSON:
{
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
  ]
}`;
    } else {
      return `${basePrompt}

CUARTA CONSULTA - Completa solo los costes detallados:

Responde ÚNICAMENTE con este JSON:
{
  "costesDetalladosRecomendados": [
    {
      "categoria": "string",
      "concepto": "string",
      "costeEstimado": number,
      "justificacion": "string"
    }
  ]
}`;
    }
  };

  const fixIncompleteJson = (jsonString: string): string => {
    let fixed = jsonString.trim();
    
    // Si termina abruptamente, intentar cerrar correctamente
    if (!fixed.endsWith('}')) {
      // Encontrar la última coma o corchete de apertura
      const lastComma = fixed.lastIndexOf(',');
      const lastOpenBracket = fixed.lastIndexOf('[');
      const lastOpenBrace = fixed.lastIndexOf('{');
      
      if (lastOpenBracket > lastComma && lastOpenBrace < lastOpenBracket) {
        // Estamos en un array incompleto
        fixed = fixed.substring(0, lastOpenBracket) + '[]';
      } else if (lastOpenBrace > lastComma) {
        // Estamos en un objeto incompleto
        fixed = fixed.substring(0, lastComma);
      }
      
      // Cerrar todos los brackets/braces abiertos
      let openBraces = 0;
      let openBrackets = 0;
      
      for (let i = 0; i < fixed.length; i++) {
        if (fixed[i] === '{') openBraces++;
        else if (fixed[i] === '}') openBraces--;
        else if (fixed[i] === '[') openBrackets++;
        else if (fixed[i] === ']') openBrackets--;
      }
      
      // Cerrar brackets abiertos
      fixed += ']'.repeat(openBrackets);
      // Cerrar braces abiertos
      fixed += '}'.repeat(openBraces);
    }
    
    return fixed;
  };

  const callGeminiAPI = async (pcapFile: File, pptFile: File, attempt: number = 0, existingData: any = null): Promise<any> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';
    
    console.log(`🤖 Iniciando consulta ${attempt + 1} a Gemini...`);

    try {
      console.log('📄 Convirtiendo archivos a base64...');
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);
      console.log('✅ Archivos convertidos');

      const requestBody = {
        contents: [{
          parts: [
            {
              text: createOptimizedPrompt(attempt, existingData)
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
          maxOutputTokens: attempt === 0 ? 4096 : 2048, // Menos tokens para consultas específicas
          responseMimeType: "application/json",
          responseSchema: attempt === 0 ? responseSchema : undefined
        }
      };

      console.log(`🚀 Enviando consulta ${attempt + 1} a Gemini...`);
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
      console.log(`📥 Respuesta ${attempt + 1} recibida:`, data);
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Respuesta inválida de Gemini API');
      }

      let responseText = data.candidates[0].content.parts[0].text;
      console.log(`📝 Texto bruto consulta ${attempt + 1}:`, responseText.substring(0, 500) + '...');
      
      try {
        // Intentar parsear directamente
        const parsedResult = JSON.parse(responseText);
        console.log(`✅ JSON consulta ${attempt + 1} parseado correctamente`);
        return parsedResult;
      } catch (parseError) {
        console.log(`❌ Error parseando JSON consulta ${attempt + 1}:`, parseError);
        
        // Intentar arreglar JSON incompleto
        const fixedJson = fixIncompleteJson(responseText);
        console.log(`🔧 JSON arreglado consulta ${attempt + 1}:`, fixedJson.substring(0, 500) + '...');
        
        try {
          const parsedFixed = JSON.parse(fixedJson);
          console.log(`✅ JSON arreglado consulta ${attempt + 1} parseado correctamente`);
          return parsedFixed;
        } catch (fixedError) {
          console.error(`❌ Error persistente en JSON consulta ${attempt + 1}:`, fixedError);
          throw new Error(`Error parseando respuesta JSON de consulta ${attempt + 1}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error en consulta ${attempt + 1}:`, error);
      throw error;
    }
  };

  const mergeResults = (baseData: any, ...additionalData: any[]): ReportData => {
    let merged = { ...baseData };
    
    additionalData.forEach(data => {
      if (data) {
        Object.keys(data).forEach(key => {
          if (data[key] && (!merged[key] || (Array.isArray(merged[key]) && merged[key].length === 0))) {
            merged[key] = data[key];
          }
        });
      }
    });
    
    return validateAndCleanData(merged);
  };

  const validateAndCleanData = (data: any): ReportData => {
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
    setCurrentAttempt(0);
    setPartialData(null);
    
    try {
      console.log('🔍 Iniciando análisis de costes por partes...');
      console.log('📄 Archivos:', {
        pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
        ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
      });

      let baseData: any = {};
      let formulasData: any = {};
      let criteriosData: any = {};
      let costesData: any = {};

      // Consulta 1: Datos básicos y lotes
      try {
        console.log('🔄 Consulta 1: Datos básicos y lotes...');
        setCurrentAttempt(1);
        baseData = await callGeminiAPI(pcapFile, pptFile, 0);
        setPartialData(baseData);
        console.log('✅ Consulta 1 completada');
        
        // Esperar un poco entre consultas para evitar límites
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('❌ Error en consulta 1:', error);
        throw new Error('Error obteniendo datos básicos');
      }

      // Consulta 2: Fórmulas y variables dinámicas
      try {
        console.log('🔄 Consulta 2: Fórmulas y variables...');
        setCurrentAttempt(2);
        formulasData = await callGeminiAPI(pcapFile, pptFile, 1, baseData);
        console.log('✅ Consulta 2 completada');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn('⚠️ Error en consulta 2, continuando...', error);
      }

      // Consulta 3: Criterios
      try {
        console.log('🔄 Consulta 3: Criterios...');
        setCurrentAttempt(3);
        criteriosData = await callGeminiAPI(pcapFile, pptFile, 2, baseData);
        console.log('✅ Consulta 3 completada');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn('⚠️ Error en consulta 3, continuando...', error);
      }

      // Consulta 4: Costes detallados
      try {
        console.log('🔄 Consulta 4: Costes detallados...');
        setCurrentAttempt(4);
        costesData = await callGeminiAPI(pcapFile, pptFile, 3, baseData);
        console.log('✅ Consulta 4 completada');
      } catch (error) {
        console.warn('⚠️ Error en consulta 4, continuando...', error);
      }

      // Combinar todos los resultados
      console.log('🔧 Combinando resultados...');
      const finalResult = mergeResults(baseData, formulasData, criteriosData, costesData);
      
      console.log('✅ Análisis completado exitosamente');
      setAnalysisResult(finalResult);
      
    } catch (err) {
      console.error('❌ Error final en análisis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el análisis';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setCurrentAttempt(0);
      setPartialData(null);
    }
  };

  return {
    analyzeCosts,
    analysisResult,
    isLoading,
    error,
    currentAttempt,
    partialData
  };
};