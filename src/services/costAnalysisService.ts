
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

// Dividir el contenido del documento en chunks más pequeños
const splitDocumentContent = (content: string, maxLength: number = 3000): string[] => {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (currentChunk.length + line.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

const generatePromptForStep = (stepNumber: number, totalSteps: number, documentChunk?: string): string => {
  const basePrompt = `Eres un experto consultor en licitaciones públicas de electromedicina en España. 

CRÍTICO: Responde ÚNICAMENTE con JSON válido y bien formateado. No añadas texto antes ni después del JSON.

ANÁLISIS PASO ${stepNumber} de ${totalSteps}:`;

  switch (stepNumber) {
    case 1:
      return `${basePrompt}

PASO 1: Extrae información básica del presupuesto y estructura:
- presupuestoGeneral: Busca el presupuesto base de licitación (números con €, sin IVA)
- esPorLotes: Determina si se divide en lotes (busca "lote", "lot", secciones numeradas)
- formulaEconomica: Encuentra fórmula principal de evaluación económica

${documentChunk ? `FRAGMENTO DOCUMENTO:\n${documentChunk}` : ''}

Responde con este JSON:
{
  "presupuestoGeneral": "string con el presupuesto encontrado o 'No especificado'",
  "esPorLotes": true/false,
  "formulaEconomica": "fórmula encontrada o 'No especificada'"
}`;

    case 2:
      return `${basePrompt}

PASO 2: Extrae información de lotes (si existen):
- lotes: Array con información de cada lote
- umbralBajaTemeraria: Criterios para ofertas temerarias (porcentajes, fórmulas)

${documentChunk ? `FRAGMENTO DOCUMENTO:\n${documentChunk}` : ''}

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

PASO 3: Extrae variables y fórmulas matemáticas:
- variablesDinamicas: Variables que cambian según ofertas
- formulasDetectadas: Fórmulas con notación matemática

${documentChunk ? `FRAGMENTO DOCUMENTO:\n${documentChunk}` : ''}

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

PASO 4: Extrae criterios automáticos de evaluación:
- criteriosAutomaticos: Criterios evaluados automáticamente (precio, económicos)

${documentChunk ? `FRAGMENTO DOCUMENTO:\n${documentChunk}` : ''}

Responde con este JSON:
{
  "criteriosAutomaticos": [
    {
      "nombre": "string",
      "descripcion": "string",
      "puntuacionMaxima": number
    }
  ]
}`;

    case 5:
      return `${basePrompt}

PASO 5: Extrae criterios subjetivos y otros:
- criteriosSubjetivos: Criterios evaluados manualmente
- otrosCriterios: Otros criterios de evaluación

${documentChunk ? `FRAGMENTO DOCUMENTO:\n${documentChunk}` : ''}

Responde con este JSON:
{
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

    case 6:
      return `${basePrompt}

PASO 6: Extrae costes detallados recomendados:
- costesDetalladosRecomendados: Análisis de costes por categorías

${documentChunk ? `FRAGMENTO DOCUMENTO:\n${documentChunk}` : ''}

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
  try {
    console.log(`🤖 Analizando paso ${step}/${totalSteps} con Gemini 2.5 Flash...`);
    
    // Combinar documentos y dividir en chunks más pequeños
    const fullContent = `DOCUMENTO PCAP:\n${pcapText}\n\nDOCUMENTO PPT:\n${pptText}`;
    const chunks = splitDocumentContent(fullContent, 2500);
    
    console.log(`📄 Documento dividido en ${chunks.length} fragmentos para análisis optimizado`);
    
    let bestResult = null;
    let attempts = 0;
    const maxAttempts = Math.min(chunks.length, 3); // Máximo 3 intentos por paso
    
    // Intentar con diferentes chunks hasta obtener un resultado válido
    for (let chunkIndex = 0; chunkIndex < maxAttempts; chunkIndex++) {
      try {
        const prompt = generatePromptForStep(step, totalSteps, chunks[chunkIndex]);
        
        console.log(`🔍 Intento ${chunkIndex + 1} con fragmento ${chunkIndex + 1} (${chunks[chunkIndex].length} caracteres)`);
        
        const response = await geminiAI.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        });

        const parsedData = safeJsonParse(
          response.text, 
          `Error al parsear la respuesta del paso ${step}, intento ${chunkIndex + 1}`
        );

        // Verificar si el resultado tiene datos útiles
        const hasUsefulData = Object.values(parsedData).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value !== 'No especificado' && value !== 'No especificada';
          if (typeof value === 'boolean') return true;
          return false;
        });

        if (hasUsefulData) {
          console.log(`✅ Paso ${step} completado exitosamente con fragmento ${chunkIndex + 1}`);
          bestResult = parsedData;
          break;
        } else {
          console.log(`⚠️ Fragmento ${chunkIndex + 1} no proporcionó datos útiles, intentando siguiente...`);
        }
        
        attempts++;
        
        // Esperar entre intentos para evitar rate limiting
        if (chunkIndex < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (chunkError) {
        console.error(`❌ Error en fragmento ${chunkIndex + 1}:`, chunkError);
        attempts++;
        continue;
      }
    }

    // Si no obtuvimos datos útiles, devolver estructura vacía válida
    if (!bestResult) {
      console.log(`⚠️ Paso ${step}: No se obtuvieron datos útiles, devolviendo estructura vacía`);
      bestResult = getEmptyStructureForStep(step);
    }

    return bestResult;

  } catch (error) {
    console.error(`❌ Error en paso ${step}:`, error);
    // Devolver estructura vacía en caso de error total
    return getEmptyStructureForStep(step);
  }
};

// Función para obtener estructura vacía según el paso
const getEmptyStructureForStep = (step: number): any => {
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
  console.log('🔧 Combinando resultados de todos los pasos...');
  
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
    if (stepData && typeof stepData === 'object') {
      console.log(`📊 Procesando datos del paso ${index + 1}:`, stepData);
      
      Object.keys(stepData).forEach(key => {
        if (stepData[key] !== undefined && stepData[key] !== null) {
          const typedKey = key as keyof ReportData;
          
          if (Array.isArray(stepData[key])) {
            // Para arrays, concatenar con los existentes
            if (Array.isArray(merged[typedKey])) {
              (merged[typedKey] as any) = [...(merged[typedKey] as any), ...stepData[key]];
            } else {
              (merged[typedKey] as any) = stepData[key];
            }
          } else {
            // Para valores primitivos, sobrescribir solo si no es valor por defecto
            const currentValue = stepData[key];
            if (currentValue !== 'No especificado' && currentValue !== 'No especificada' && currentValue !== false) {
              (merged[typedKey] as any) = currentValue;
            }
          }
        }
      });
    }
  });

  console.log('✅ Resultados combinados correctamente:', merged);
  return merged;
};
