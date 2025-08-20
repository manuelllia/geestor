
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
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentProgress, setCurrentProgress] = useState('');

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

  const createPromptForStep = (stepNumber: number, totalSteps: number, previousData?: any): string => {
    const basePrompt = `Eres un experto consultor en licitaciones públicas de electromedicina en España. Analiza los documentos PDF: PCAP y PPT.

CRÍTICO: Responde ÚNICAMENTE con JSON válido y bien formateado. No añadas texto antes ni después del JSON. Los documentos pueden estar en cualquier idioma de España, pero tu respuesta debe estar en español.

ANÁLISIS POR TRAMOS - Paso ${stepNumber} de ${totalSteps}:`;

    switch (stepNumber) {
      case 1:
        return `${basePrompt}

PASO 1: Extrae únicamente la información básica:
- presupuestoGeneral: Busca el presupuesto base de licitación sin IVA
- esPorLotes: Determina si la licitación se divide en lotes
- formulaEconomica: Encuentra la fórmula principal para evaluación económica

Responde con este JSON:
{
  "presupuestoGeneral": "string con el presupuesto encontrado o 'No especificado'",
  "esPorLotes": true/false,
  "formulaEconomica": "fórmula principal encontrada o 'No especificada'"
}`;

      case 2:
        return `${basePrompt}

PASO 2: Extrae información de lotes y umbrales:
- lotes: Si esPorLotes es true, extrae todos los lotes con su información
- umbralBajaTemeraria: Busca criterios o porcentajes para determinar ofertas temerarias

Responde con este JSON:
{
  "lotes": [
    {
      "nombre": "string",
      "centroAsociado": "string",
      "descripcion": "string", 
      "presupuesto": "string",
      "requisitosClave": ["string1", "string2"]
    }
  ],
  "umbralBajaTemeraria": "criterio encontrado o 'No especificado'"
}`;

      case 3:
        return `${basePrompt}

PASO 3: Extrae variables dinámicas y fórmulas detalladas:
- variablesDinamicas: Variables que cambian según ofertas
- formulasDetectadas: Fórmulas matemáticas con representación LaTeX

Responde con este JSON:
{
  "variablesDinamicas": [
    {
      "nombre": "string",
      "descripcion": "string",
      "mapeo": "price|tenderBudget|maxScore|lowestPrice|averagePrice"
    }
  ],
  "formulasDetectadas": [
    {
      "formulaOriginal": "string",
      "representacionLatex": "string",
      "descripcionVariables": "string"
    }
  ]
}`;

      case 4:
        return `${basePrompt}

PASO 4: Extrae criterios de evaluación:
- criteriosAutomaticos: Criterios que se evalúan automáticamente
- criteriosSubjetivos: Criterios que requieren evaluación manual
- otrosCriterios: Cualquier otro criterio de evaluación

Responde con este JSON:
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

      case 5:
        return `${basePrompt}

PASO 5: Extrae costes detallados recomendados:
- costesDetalladosRecomendados: Análisis de costes por categorías

Responde con este JSON:
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

      default:
        return basePrompt;
    }
  };

  const cleanJsonResponse = (jsonString: string): string => {
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
    
    return cleaned;
  };

  const callGemini = async (pcapFile: File, pptFile: File, step: number): Promise<any> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    
    console.log(`🤖 Iniciando paso ${step} con Gemini...`);
    setCurrentProgress(`Analizando paso ${step} de ${totalSteps}...`);

    try {
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);

      const requestBody = {
        contents: [{
          parts: [
            {
              text: createPromptForStep(step, totalSteps)
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
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        }
      };

      console.log(`🚀 Enviando solicitud paso ${step} a Gemini...`);
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error HTTP paso ${step}:`, response.status, errorText);
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`📥 Respuesta paso ${step} recibida:`, data);
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error(`Respuesta inválida de Gemini API en paso ${step}`);
      }

      let responseText = data.candidates[0].content.parts[0].text;
      console.log(`📝 Texto bruto paso ${step}:`, responseText.substring(0, 300) + '...');
      
      // Limpiar y parsear JSON
      const cleanedJson = cleanJsonResponse(responseText);
      console.log(`🔧 JSON limpio paso ${step}:`, cleanedJson.substring(0, 300) + '...');
      
      const parsedResult = JSON.parse(cleanedJson);
      console.log(`✅ JSON paso ${step} parseado correctamente`);
      return parsedResult;
      
    } catch (error) {
      console.error(`❌ Error en paso ${step}:`, error);
      throw error;
    }
  };

  const mergeStepResults = (...stepResults: any[]): ReportData => {
    const merged: ReportData = {
      presupuestoGeneral: "No especificado",
      esPorLotes: false,
      lotes: [],
      variablesDinamicas: [],
      formulaEconomica: "No especificada",
      formulasDetectadas: [],
      umbralBajaTemeraria: "No especificado",
      criteriosAutomaticos: [],
      criteriosSubjetivos: [],
      otrosCriterios: [],
      costesDetalladosRecomendados: []
    };

    stepResults.forEach(stepData => {
      if (stepData) {
        Object.keys(stepData).forEach(key => {
          if (stepData[key] !== undefined && stepData[key] !== null) {
            const typedKey = key as keyof ReportData;
            if (Array.isArray(stepData[key])) {
              (merged[typedKey] as any[]) = stepData[key];
            } else {
              (merged[typedKey] as any) = stepData[key];
            }
          }
        });
      }
    });

    return merged;
  };

  const wait = (seconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setTotalSteps(5);
    setCurrentProgress('Iniciando análisis por tramos...');
    
    try {
      console.log('🔍 Iniciando análisis de costes por tramos...');
      console.log('📄 Archivos:', {
        pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
        ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
      });

      const stepResults: any[] = [];

      // Ejecutar análisis paso a paso
      for (let step = 1; step <= totalSteps; step++) {
        try {
          setCurrentStep(step);
          console.log(`🔄 Ejecutando paso ${step}/${totalSteps}...`);
          
          const stepResult = await callGemini(pcapFile, pptFile, step);
          stepResults.push(stepResult);
          
          console.log(`✅ Paso ${step} completado exitosamente`);
          
          // Esperar entre 5-10 segundos entre llamadas (excepto en el último paso)
          if (step < totalSteps) {
            const waitTime = Math.floor(Math.random() * 6) + 5; // Entre 5 y 10 segundos
            console.log(`⏳ Esperando ${waitTime} segundos antes del siguiente paso...`);
            setCurrentProgress(`Esperando ${waitTime}s antes del paso ${step + 1}...`);
            await wait(waitTime);
          }
          
        } catch (stepError) {
          console.error(`❌ Error en paso ${step}:`, stepError);
          // Continuar con el siguiente paso en caso de error
          stepResults.push(null);
        }
      }

      // Combinar todos los resultados
      console.log('🔧 Combinando resultados de todos los pasos...');
      setCurrentProgress('Generando informe final...');
      
      const finalResult = mergeStepResults(...stepResults);
      
      console.log('✅ Análisis por tramos completado exitosamente');
      console.log('📊 Resultado final:', finalResult);
      
      setAnalysisResult(finalResult);
      setCurrentProgress('Análisis completado');
      
    } catch (err) {
      console.error('❌ Error final en análisis por tramos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el análisis';
      setError(errorMessage);
      setCurrentProgress('Error en el análisis');
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  return {
    analyzeCosts,
    analysisResult,
    isLoading,
    error,
    currentStep,
    totalSteps,
    currentProgress
  };
};
