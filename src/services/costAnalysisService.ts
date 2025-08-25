
import { geminiAI, safeJsonParse } from './geminiService';
import { extractPDFText } from '../utils/pdfUtils';

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

// Usar la función optimizada de utilidades
export const extractTextFromPDF = extractPDFText;

// Función principal de análisis - dividida en pasos más manejables
export const analyzeDocumentsStep = async (
  pcapText: string, 
  pptText: string, 
  step: number, 
  totalSteps: number
): Promise<any> => {
  try {
    console.log(`🤖 PASO ${step}/${totalSteps}: Iniciando análisis real con Gemini AI...`);
    
    // Combinar y preparar el contenido
    const fullContent = `DOCUMENTO PCAP (Pliego de Cláusulas Administrativas Particulares):\n${pcapText}\n\nDOCUMENTO PPT (Pliego de Prescripciones Técnicas):\n${pptText}`;
    
    console.log(`📄 Contenido preparado - Total caracteres: ${fullContent.length}`);
    
    // Obtener el prompt específico para este paso
    const prompt = generateDetailedPromptForStep(step, totalSteps, fullContent);
    
    console.log(`📝 Generando respuesta para paso ${step} con Gemini...`);
    console.log(`📏 Longitud del prompt: ${prompt.length} caracteres`);
    
    // LLAMADA REAL A GEMINI AI
    const response = await geminiAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    console.log(`✅ Respuesta recibida de Gemini AI para paso ${step}`);
    console.log(`📄 Longitud de respuesta: ${response.text.length} caracteres`);
    console.log(`🔍 Preview respuesta:`, response.text.substring(0, 300) + '...');

    // Parsear la respuesta JSON
    const parsedData = safeJsonParse(
      response.text, 
      `Error al parsear respuesta de Gemini AI - paso ${step}`
    );

    console.log(`🎯 Datos parseados exitosamente para paso ${step}:`, parsedData);
    
    // Verificar que tenemos datos útiles
    const hasUsefulData = Object.values(parsedData).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value !== 'No especificado' && value !== 'No especificada' && value.trim() !== '';
      if (typeof value === 'boolean') return true;
      return false;
    });

    if (!hasUsefulData) {
      console.warn(`⚠️ PASO ${step}: La respuesta no contiene datos útiles, usando estructura por defecto`);
      return getEmptyStructureForStep(step);
    }

    console.log(`✅ PASO ${step} completado exitosamente con datos reales de Gemini AI`);
    return parsedData;

  } catch (error) {
    console.error(`❌ ERROR en paso ${step} con Gemini AI:`, error);
    
    // Log detallado del error
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      console.error(`❌ Stack trace:`, error.stack);
    }
    
    // Devolver estructura vacía en caso de error
    console.log(`🔄 Devolviendo estructura vacía para paso ${step} debido a error`);
    return getEmptyStructureForStep(step);
  }
};

// Generar prompts más detallados y específicos para cada paso
const generateDetailedPromptForStep = (stepNumber: number, totalSteps: number, documentContent: string): string => {
  // Limitar el contenido para evitar problemas de longitud
  const maxContentLength = 8000;
  const truncatedContent = documentContent.length > maxContentLength 
    ? documentContent.substring(0, maxContentLength) + '\n... [CONTENIDO TRUNCADO]'
    : documentContent;

  const basePrompt = `Eres un experto consultor especializado en análisis de licitaciones públicas españolas de equipamiento electromédico.

INSTRUCCIONES CRÍTICAS:
- Analiza ÚNICAMENTE el contenido real de los documentos proporcionados
- Responde SOLO con JSON válido, sin texto adicional antes o después
- Si no encuentras información específica, usa "No especificado" o arrays vacíos
- NO inventes datos que no estén explícitamente en los documentos
- Busca información específica relacionada con el paso actual

ANÁLISIS PASO ${stepNumber} de ${totalSteps}:

CONTENIDO DE LOS DOCUMENTOS A ANALIZAR:
${truncatedContent}

`;

  switch (stepNumber) {
    case 1:
      return `${basePrompt}

PASO 1 - INFORMACIÓN BÁSICA DEL PRESUPUESTO:
Extrae la siguiente información específica de los documentos:

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
Extrae información detallada sobre:

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
  console.log('🔧 MERGE: Iniciando combinación de resultados de Gemini AI...');
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
            // Para arrays, concatenar los elementos
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
            // Para valores simples, solo reemplazar si no es valor por defecto
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
