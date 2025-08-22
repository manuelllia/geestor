import { geminiAI, safeJsonParse } from './geminiService';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

// Función real para extraer texto de archivos PDF
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log(`📄 Extrayendo texto real del PDF: ${file.name}`);
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    console.log(`📖 PDF tiene ${numPages} páginas`);
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        
        if (pageNum % 10 === 0) {
          console.log(`📄 Procesadas ${pageNum}/${numPages} páginas`);
        }
      } catch (pageError) {
        console.error(`❌ Error procesando página ${pageNum}:`, pageError);
        continue;
      }
    }
    
    console.log(`✅ Texto extraído: ${fullText.length} caracteres del archivo ${file.name}`);
    return fullText.trim();
    
  } catch (error) {
    console.error('❌ Error extrayendo texto del PDF:', error);
    throw new Error(`Error al procesar el archivo PDF ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Dividir el contenido del documento en chunks más pequeños
const splitDocumentContent = (content: string, maxLength: number = 4000): string[] => {
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

const generatePromptForStep = (stepNumber: number, totalSteps: number, documentChunk: string): string => {
  const basePrompt = `Eres un experto consultor en licitaciones públicas de electromedicina en España.

INSTRUCCIONES CRÍTICAS:
- Analiza ÚNICAMENTE el contenido del documento proporcionado
- Responde ÚNICAMENTE con JSON válido, sin texto adicional
- Si no encuentras información específica, usa valores por defecto como "No especificado" o arrays vacíos
- NO inventes datos que no estén en el documento

ANÁLISIS PASO ${stepNumber} de ${totalSteps}:`;

  switch (stepNumber) {
    case 1:
      return `${basePrompt}

PASO 1: Extrae información básica del presupuesto y estructura del siguiente documento:

${documentChunk}

Busca específicamente:
- presupuestoGeneral: Presupuesto base de licitación (busca cantidades con € o "euros")
- esPorLotes: Si se menciona "lotes", "lot", divisiones numeradas
- formulaEconomica: Fórmula de evaluación económica o criterios de puntuación

Responde ÚNICAMENTE con este JSON:
{
  "presupuestoGeneral": "cantidad encontrada o 'No especificado'",
  "esPorLotes": true/false,
  "formulaEconomica": "fórmula encontrada o 'No especificada'"
}`;

    case 2:
      return `${basePrompt}

PASO 2: Extrae información de lotes del siguiente documento:

${documentChunk}

Busca específicamente:
- lotes: Información detallada de cada lote si existen
- umbralBajaTemeraria: Criterios para ofertas anormalmente bajas

Responde ÚNICAMENTE con este JSON:
{
  "lotes": [
    {
      "nombre": "nombre del lote",
      "centroAsociado": "centro o ubicación",
      "descripcion": "descripción del lote",
      "presupuesto": "presupuesto del lote",
      "requisitosClave": ["requisito1", "requisito2"]
    }
  ],
  "umbralBajaTemeraria": "criterio encontrado o 'No especificado'"
}`;

    case 3:
      return `${basePrompt}

PASO 3: Extrae variables y fórmulas matemáticas del siguiente documento:

${documentChunk}

Busca específicamente:
- variablesDinamicas: Variables que cambian según las ofertas
- formulasDetectadas: Fórmulas matemáticas de evaluación

Responde ÚNICAMENTE con este JSON:
{
  "variablesDinamicas": [
    {
      "nombre": "nombre de la variable",
      "descripcion": "descripción de la variable",
      "mapeo": "price"
    }
  ],
  "formulasDetectadas": [
    {
      "formulaOriginal": "fórmula tal como aparece en el documento",
      "representacionLatex": "representación matemática",
      "descripcionVariables": "explicación de las variables"
    }
  ]
}`;

    case 4:
      return `${basePrompt}

PASO 4: Extrae criterios automáticos del siguiente documento:

${documentChunk}

Busca específicamente:
- criteriosAutomaticos: Criterios evaluados automáticamente (precio, aspectos económicos)

Responde ÚNICAMENTE con este JSON:
{
  "criteriosAutomaticos": [
    {
      "nombre": "nombre del criterio",
      "descripcion": "descripción del criterio",
      "puntuacionMaxima": número
    }
  ]
}`;

    case 5:
      return `${basePrompt}

PASO 5: Extrae criterios subjetivos del siguiente documento:

${documentChunk}

Busca específicamente:
- criteriosSubjetivos: Criterios evaluados manualmente
- otrosCriterios: Otros criterios de evaluación

Responde ÚNICAMENTE con este JSON:
{
  "criteriosSubjetivos": [
    {
      "nombre": "nombre del criterio",
      "descripcion": "descripción del criterio",
      "puntuacionMaxima": número
    }
  ],
  "otrosCriterios": [
    {
      "nombre": "nombre del criterio",
      "descripcion": "descripción del criterio", 
      "puntuacionMaxima": número
    }
  ]
}`;

    case 6:
      return `${basePrompt}

PASO 6: Extrae costes detallados del siguiente documento:

${documentChunk}

Busca específicamente:
- costesDetalladosRecomendados: Análisis de costes por categorías o conceptos

Responde ÚNICAMENTE con este JSON:
{
  "costesDetalladosRecomendados": [
    {
      "categoria": "categoría del coste",
      "concepto": "concepto específico",
      "costeEstimado": número,
      "justificacion": "justificación del coste"
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
    console.log(`🤖 Llamando realmente a Gemini AI para paso ${step}/${totalSteps}...`);
    
    // Combinar documentos
    const fullContent = `DOCUMENTO PCAP:\n${pcapText}\n\nDOCUMENTO PPT:\n${pptText}`;
    const chunks = splitDocumentContent(fullContent, 4000);
    
    console.log(`📄 Documento real dividido en ${chunks.length} fragmentos`);
    
    let bestResult = null;
    const maxAttempts = Math.min(chunks.length, 2);
    
    for (let chunkIndex = 0; chunkIndex < maxAttempts; chunkIndex++) {
      try {
        const prompt = generatePromptForStep(step, totalSteps, chunks[chunkIndex]);
        
        console.log(`🔍 Llamada real a Gemini AI - Paso ${step}, Fragmento ${chunkIndex + 1}`);
        console.log(`📝 Prompt length: ${prompt.length} caracteres`);
        
        // LLAMADA REAL A LA API DE GEMINI
        const response = await geminiAI.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        });

        console.log(`✅ Respuesta recibida de Gemini AI para paso ${step}, fragmento ${chunkIndex + 1}`);
        console.log(`📄 Respuesta raw:`, response.text.substring(0, 500) + '...');

        const parsedData = safeJsonParse(
          response.text, 
          `Error al parsear respuesta de Gemini AI - paso ${step}, fragmento ${chunkIndex + 1}`
        );

        console.log(`🔍 Datos parseados paso ${step}:`, parsedData);

        // Verificar si el resultado tiene datos útiles
        const hasUsefulData = Object.values(parsedData).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value !== 'No especificado' && value !== 'No especificada' && value.trim() !== '';
          if (typeof value === 'boolean') return true;
          return false;
        });

        if (hasUsefulData) {
          console.log(`✅ Paso ${step} completado exitosamente con datos útiles de Gemini AI`);
          bestResult = parsedData;
          break;
        } else {
          console.log(`⚠️ Fragmento ${chunkIndex + 1} no proporcionó datos útiles, intentando siguiente...`);
        }
        
        // Esperar entre intentos
        if (chunkIndex < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (chunkError) {
        console.error(`❌ Error en llamada a Gemini AI - fragmento ${chunkIndex + 1}:`, chunkError);
        continue;
      }
    }

    // Si no obtuvimos datos útiles, devolver estructura vacía
    if (!bestResult) {
      console.log(`⚠️ Paso ${step}: No se obtuvieron datos útiles de Gemini AI, devolviendo estructura vacía`);
      bestResult = getEmptyStructureForStep(step);
    }

    return bestResult;

  } catch (error) {
    console.error(`❌ Error en paso ${step} con Gemini AI:`, error);
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
  console.log('🔧 Combinando resultados reales de Gemini AI...');
  
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
      console.log(`📊 Procesando datos reales del paso ${index + 1}:`, stepData);
      
      Object.keys(stepData).forEach(key => {
        if (stepData[key] !== undefined && stepData[key] !== null) {
          const typedKey = key as keyof ReportData;
          
          if (Array.isArray(stepData[key])) {
            if (Array.isArray(merged[typedKey])) {
              (merged[typedKey] as any) = [...(merged[typedKey] as any), ...stepData[key]];
            } else {
              (merged[typedKey] as any) = stepData[key];
            }
          } else {
            const currentValue = stepData[key];
            if (currentValue !== 'No especificado' && currentValue !== 'No especificada' && currentValue !== false) {
              (merged[typedKey] as any) = currentValue;
            }
          }
        }
      });
    }
  });

  console.log('✅ Resultados reales de Gemini AI combinados correctamente:', merged);
  return merged;
};
