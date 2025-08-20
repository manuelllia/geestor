
import { geminiAI, safeJsonParse } from './geminiService';

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

const generatePromptForStep = (stepNumber: number, totalSteps: number): string => {
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

export const analyzeDocumentsStep = async (
  pcapText: string, 
  pptText: string, 
  step: number, 
  totalSteps: number
): Promise<any> => {
  const prompt = `${generatePromptForStep(step, totalSteps)}

DOCUMENTO PCAP:
${pcapText}

DOCUMENTO PPT:
${pptText}`;

  try {
    console.log(`🤖 Analizando paso ${step} con Gemini...`);
    
    const response = await geminiAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1
      }
    });

    const parsedData = safeJsonParse(
      response.text, 
      `Error al parsear la respuesta del paso ${step}. La IA devolvió una respuesta inválida.`
    );

    console.log(`✅ Paso ${step} completado:`, parsedData);
    return parsedData;

  } catch (error) {
    console.error(`❌ Error en paso ${step}:`, error);
    if (error instanceof Error) {
      throw new Error(`Error al analizar documentos en paso ${step}: ${error.message}`);
    }
    throw new Error(`Error desconocido en paso ${step}`);
  }
};

export const mergeStepResults = (...stepResults: any[]): ReportData => {
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
            (merged[typedKey] as any) = stepData[key];
          } else {
            (merged[typedKey] as any) = stepData[key];
          }
        }
      });
    }
  });

  return merged;
};
