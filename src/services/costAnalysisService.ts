
import { analyzePDFWithQwen, safeJsonParse } from './openRouterService';

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

// Nueva función de análisis usando Qwen 3 a través de OpenRouter
export const analyzeDocumentsWithQwen = async (
  pcapFile: File, 
  pptFile: File, 
  step: number, 
  totalSteps: number
): Promise<any> => {
  try {
    console.log(`🤖 PASO ${step}/${totalSteps}: Analizando documentos con Qwen 3...`);
    
    // Obtener el prompt específico para este paso
    const prompt = generateQwenPromptForStep(step, totalSteps);
    
    console.log(`📝 Generando análisis para paso ${step} con Qwen 3...`);
    
    // Analizar ambos documentos con Qwen 3
    let pcapResponse: string;
    let pptResponse: string;
    
    try {
      console.log(`📄 Analizando PCAP con Qwen 3...`);
      pcapResponse = await analyzePDFWithQwen(pcapFile, `${prompt}\n\nEste es el documento PCAP (Pliego de Cláusulas Administrativas Particulares). Analiza específicamente este documento:`);
      console.log(`✅ PCAP analizado exitosamente`);
    } catch (error) {
      console.warn(`⚠️ Error analizando PCAP, usando estructura vacía:`, error);
      pcapResponse = '{}';
    }
    
    // Pequeña pausa entre análisis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      console.log(`📄 Analizando PPT con Qwen 3...`);
      pptResponse = await analyzePDFWithQwen(pptFile, `${prompt}\n\nEste es el documento PPT (Pliego de Prescripciones Técnicas). Analiza específicamente este documento:`);
      console.log(`✅ PPT analizado exitosamente`);
    } catch (error) {
      console.warn(`⚠️ Error analizando PPT, usando estructura vacía:`, error);
      pptResponse = '{}';
    }

    // Combinar respuestas
    const pcapData = safeJsonParse(pcapResponse, `Error parseando respuesta PCAP - paso ${step}`);
    const pptData = safeJsonParse(pptResponse, `Error parseando respuesta PPT - paso ${step}`);
    
    // Fusionar los datos de ambos documentos
    const mergedData = mergeDocumentData(pcapData, pptData, step);
    
    console.log(`✅ PASO ${step} completado exitosamente con Qwen 3`);
    console.log(`📊 PASO ${step} - Resultado fusionado:`, mergedData);
    
    return mergedData;

  } catch (error) {
    console.error(`❌ ERROR en paso ${step} con Qwen 3:`, error);
    
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      console.error(`❌ Stack trace:`, error.stack);
    }
    
    console.log(`🔄 Devolviendo estructura vacía para paso ${step} debido a error`);
    return getEmptyStructureForStep(step);
  }
};

// Función para fusionar datos de ambos documentos
const mergeDocumentData = (pcapData: any, pptData: any, step: number): any => {
  const merged = { ...pcapData };
  
  // Fusionar arrays
  Object.keys(pptData).forEach(key => {
    if (Array.isArray(pptData[key]) && Array.isArray(merged[key])) {
      merged[key] = [...merged[key], ...pptData[key]];
    } else if (pptData[key] && (!merged[key] || merged[key] === 'No especificado' || merged[key] === 'No especificada')) {
      merged[key] = pptData[key];
    }
  });
  
  console.log(`🔧 Datos fusionados para paso ${step}:`, merged);
  return merged;
};

// Generar prompts optimizados para Qwen 3
const generateQwenPromptForStep = (stepNumber: number, totalSteps: number): string => {
  const basePrompt = `Eres un experto consultor especializado en análisis de licitaciones públicas españolas de equipamiento electromédico.

INSTRUCCIONES CRÍTICAS:
- Analiza ÚNICAMENTE el contenido del documento PDF proporcionado
- Responde SOLO con JSON válido, sin texto adicional antes o después
- Si no encuentras información específica, usa "No especificado" o arrays vacíos
- NO inventes datos que no estén explícitamente en el documento
- Lee cuidadosamente todo el contenido del PDF
- Extrae información exacta tal como aparece en el documento

ANÁLISIS PASO ${stepNumber} de ${totalSteps}:
`;

  switch (stepNumber) {
    case 1:
      return `${basePrompt}

PASO 1 - INFORMACIÓN BÁSICA DEL PRESUPUESTO:
Busca y extrae la siguiente información específica del documento PDF:

1. PRESUPUESTO GENERAL: Busca el presupuesto base de licitación (cantidades con €, "euros", "presupuesto base", "valor estimado del contrato")
2. ESTRUCTURA POR LOTES: Determina si la licitación se divide en lotes (busca palabras como "lote", "lot", divisiones numeradas)
3. FÓRMULA ECONÓMICA: Encuentra la fórmula de evaluación económica o criterios de puntuación

FORMATO DE RESPUESTA (JSON únicamente):
{
  "presupuestoGeneral": "cantidad exacta encontrada con unidades o 'No especificado'",
  "esPorLotes": true/false,
  "formulaEconomica": "fórmula exacta encontrada o 'No especificada'"
}`;

    case 2:
      return `${basePrompt}

PASO 2 - LOTES Y CRITERIOS DE BAJA TEMERARIA:
Busca información detallada sobre:

1. LOTES: Si existen lotes, extrae información de cada uno
2. UMBRAL BAJA TEMERARIA: Criterios para identificar ofertas anormalmente bajas

FORMATO DE RESPUESTA (JSON únicamente):
{
  "lotes": [
    {
      "nombre": "nombre completo del lote",
      "centroAsociado": "centro médico o ubicación",
      "descripcion": "descripción detallada",
      "presupuesto": "presupuesto específico del lote",
      "requisitosClave": ["requisito1", "requisito2"]
    }
  ],
  "umbralBajaTemeraria": "criterio exacto encontrado o porcentaje o 'No especificado'"
}`;

    case 3:
      return `${basePrompt}

PASO 3 - VARIABLES DINÁMICAS Y FÓRMULAS MATEMÁTICAS:
Identifica:

1. VARIABLES DINÁMICAS: Variables que cambian según las ofertas presentadas
2. FÓRMULAS DETECTADAS: Fórmulas matemáticas completas de evaluación

FORMATO DE RESPUESTA (JSON únicamente):
{
  "variablesDinamicas": [
    {
      "nombre": "nombre exacto de la variable",
      "descripcion": "descripción completa de cómo se usa",
      "mapeo": "price" 
    }
  ],
  "formulasDetectadas": [
    {
      "formulaOriginal": "fórmula exacta como aparece en el documento",
      "representacionLatex": "representación matemática LaTeX",
      "descripcionVariables": "explicación de cada variable"
    }
  ]
}`;

    case 4:
      return `${basePrompt}

PASO 4 - CRITERIOS AUTOMÁTICOS:
Extrae criterios que se evalúan automáticamente:

1. CRITERIOS ECONÓMICOS: Precio, aspectos económicos automáticos
2. CRITERIOS OBJETIVOS: Otros criterios evaluados automáticamente

FORMATO DE RESPUESTA (JSON únicamente):
{
  "criteriosAutomaticos": [
    {
      "nombre": "nombre exacto del criterio",
      "descripcion": "descripción completa del criterio",
      "puntuacionMaxima": número_entero
    }
  ]
}`;

    case 5:
      return `${basePrompt}

PASO 5 - CRITERIOS SUBJETIVOS Y OTROS:
Identifica criterios evaluados manualmente:

1. CRITERIOS SUBJETIVOS: Evaluados por comisión técnica
2. OTROS CRITERIOS: Criterios adicionales de evaluación

FORMATO DE RESPUESTA (JSON únicamente):
{
  "criteriosSubjetivos": [
    {
      "nombre": "nombre exacto del criterio",
      "descripcion": "descripción completa",
      "puntuacionMaxima": número_entero
    }
  ],
  "otrosCriterios": [
    {
      "nombre": "nombre exacto del criterio",
      "descripcion": "descripción completa", 
      "puntuacionMaxima": número_entero
    }
  ]
}`;

    case 6:
      return `${basePrompt}

PASO 6 - ANÁLISIS DETALLADO DE COSTES:
Extrae información sobre costes por categorías:

1. COSTES DETALLADOS: Desglose de costes por conceptos
2. CATEGORÍAS DE GASTO: Diferentes tipos de costes identificados

FORMATO DE RESPUESTA (JSON únicamente):
{
  "costesDetalladosRecomendados": [
    {
      "categoria": "categoría específica del coste",
      "concepto": "concepto detallado",
      "costeEstimado": número_decimal,
      "justificacion": "justificación completa del coste"
    }
  ]
}`;

    default:
      return basePrompt + '\n\nRespuesta requerida: JSON vacío {}';
  }
};

// Función para obtener estructura vacía según el paso
const getEmptyStructureForStep = (step: number): any => {
  console.log(`📝 Generando estructura vacía para paso ${step}`);
  
  switch (step) {
    case 1:
      return {
        presupuestoGeneral: "No especificado",
        esPorLotes: false,
        formulaEconomica: "No especificada"
      };
    case 2:
      return {
        lotes: [],
        umbralBajaTemeraria: "No especificado"
      };
    case 3:
      return {
        variablesDinamicas: [],
        formulasDetectadas: []
      };
    case 4:
      return {
        criteriosAutomaticos: []
      };
    case 5:
      return {
        criteriosSubjetivos: [],
        otrosCriterios: []
      };
    case 6:
      return {
        costesDetalladosRecomendados: []
      };
    default:
      return {};
  }
};

export const mergeStepResults = (...stepResults: any[]): ReportData => {
  console.log('🔧 MERGE: Iniciando combinación de resultados de Qwen 3...');
  console.log('🔧 MERGE: Número de pasos a combinar:', stepResults.length);
  
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

  stepResults.forEach((stepData, index) => {
    console.log(`🔧 MERGE: Procesando paso ${index + 1}:`, stepData);
    
    if (stepData && typeof stepData === 'object') {
      Object.keys(stepData).forEach(key => {
        if (stepData[key] !== undefined && stepData[key] !== null) {
          const typedKey = key as keyof ReportData;
          
          if (Array.isArray(stepData[key])) {
            if (Array.isArray(merged[typedKey])) {
              const currentArray = merged[typedKey] as any[];
              const newArray = stepData[key] as any[];
              (merged[typedKey] as any) = [...currentArray, ...newArray];
              console.log(`🔧 MERGE: Array ${key} combinado - elementos totales:`, (merged[typedKey] as any[]).length);
            } else {
              (merged[typedKey] as any) = stepData[key];
              console.log(`🔧 MERGE: Array ${key} asignado -`, stepData[key].length, 'elementos');
            }
          } else {
            const currentValue = stepData[key];
            if (currentValue !== 'No especificado' && currentValue !== 'No especificada' && currentValue !== false) {
              (merged[typedKey] as any) = currentValue;
              console.log(`🔧 MERGE: Valor ${key} actualizado:`, currentValue);
            }
          }
        }
      });
    } else {
      console.warn(`⚠️ MERGE: Paso ${index + 1} no contiene datos válidos:`, stepData);
    }
  });

  console.log('✅ MERGE: Resultados combinados exitosamente');
  console.log('📊 MERGE: Resumen final:', {
    presupuesto: merged.presupuestoGeneral,
    lotes: merged.lotes.length,
    variables: merged.variablesDinamicas.length,
    formulas: merged.formulasDetectadas.length,
    criteriosAuto: merged.criteriosAutomaticos.length,
    criteriosSubj: merged.criteriosSubjetivos.length,
    otrosCriterios: merged.otrosCriterios.length,
    costes: merged.costesDetalladosRecomendados.length
  });
  
  return merged;
};
