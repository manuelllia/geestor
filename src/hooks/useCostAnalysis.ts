
import { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Configure PDF.js worker with a more reliable CDN
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js`;

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
          descripcionVariables: { type: "string" },
          condicionesLogicas: { type: "string" }
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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log('📄 Iniciando extracción de texto del PDF:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('✅ ArrayBuffer obtenido, tamaño:', arrayBuffer.byteLength);
      
      const pdf = await getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise;
      
      console.log('✅ PDF cargado, páginas:', pdf.numPages);
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`📖 Procesando página ${pageNum}/${pdf.numPages}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log('✅ Extracción completada, caracteres totales:', fullText.length);
      return fullText;
    } catch (error) {
      console.error('❌ Error extracting text from PDF:', error);
      throw new Error(`Error al extraer texto del PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const createAnalysisPrompt = (pcapText: string, pptText: string): string => {
    return `Actúa como un prestigioso matemático y un experto consultor especializado en licitaciones públicas de electromedicina en España. Tu tarea es analizar el texto extraído de un Pliego de Cláusulas Administrativas Particulares (PCAP) y un Pliego de Prescripciones Técnicas (PPT).

**Instrucción de Idioma (CRÍTICA):** Los documentos de entrada (PCAP y PPT) pueden estar escritos en español, catalán, gallego, euskera (vasco), valenciano o inglés. Independientemente del idioma de origen, TU RESPUESTA Y TODOS LOS DATOS EXTRAÍDOS en el JSON final DEBEN ESTAR OBLIGATORIAMENTE EN ESPAÑOL. Realiza la traducción necesaria para todos los campos.

Extrae únicamente la información verificable presente en los textos proporcionados para rellenar la estructura JSON solicitada. No incluyas explicaciones, introducciones o conclusiones fuera del objeto JSON.

**Análisis de Lotes:**
1.  **Detecta si es por lotes:** Primero, determina si la licitación está explícitamente dividida en lotes. Establece el campo 'esPorLotes' en 'true' si es así, y en 'false' en caso contrario.
2.  **Si es por lotes:** Rellena el array 'lotes'. Para cada lote identificado, extrae: 'nombre', 'centroAsociado', 'descripcion', 'presupuesto' (string numérico sin IVA), y 'requisitosClave'.
3.  **Si NO es por lotes:** El array 'lotes' debe quedar vacío ([]).

---
**TAREA CRÍTICA 1: ANÁLISIS DE VARIABLES DINÁMICAS (NUEVO)**
Antes de analizar la fórmula económica principal, tu primera tarea es identificar las variables que se usan en ella.
1.  **Detecta Variables:** Identifica todas las variables utilizadas en la fórmula de puntuación económica (ej. "Plic", "Pmax", "Oferta_i", "B").
2.  **Define y Mapea:** Por cada variable detectada, crea un objeto en el array \`variablesDinamicas\`. Este objeto DEBE tener:
    *   \`nombre\`: El nombre exacto de la variable tal y como aparece en el pliego (ej: "Plic").
    *   \`descripcion\`: Una descripción clara de lo que representa la variable (ej: "Presupuesto base de licitación sin IVA").
    *   \`mapeo\`: Un mapeo ESTRICTO a uno de los siguientes conceptos del sistema: "price", "tenderBudget", "maxScore", "lowestPrice", "averagePrice".
    
    **Ejemplo de Salida para \`variablesDinamicas\`:**
    \`\`\`json
    "variablesDinamicas": [
      {
        "nombre": "P",
        "descripcion": "Precio de la oferta evaluada",
        "mapeo": "price"
      },
      {
        "nombre": "Plic",
        "descripcion": "Presupuesto de la licitación",
        "mapeo": "tenderBudget"
      }
    ]
    \`\`\`

**TAREA CRÍTICA 2: ANÁLISIS Y DESCOMPOSICIÓN DE FÓRMULAS (AST como String JSON)**
Una vez identificadas las variables, analiza la fórmula económica principal y descomponla en un Árbol de Sintaxis Abstracta (AST) serializado como una cadena JSON.
*   **Usa las Variables Detectadas:** En los nodos de tipo "variable" del AST, DEBES usar el \`nombre\` de la variable que has definido en \`variablesDinamicas\`. Por ejemplo, si detectaste "Plic", el nodo variable será \`{ "type": "variable", "name": "Plic" }\`.
*   **Serialización:** El objeto JSON completo del AST debe ser serializado como una única cadena de texto para el campo \`formulaEconomica\`.

**EJEMPLO COMPLETO:**
Si la fórmula es \`70 * (1 - (P - Pmin) / (Plic - Pmin))\`, y has detectado que 'P' es el precio de la oferta, 'Pmin' el precio más bajo y 'Plic' el presupuesto:
1.  \`variablesDinamicas\` contendrá las definiciones de 'P', 'Pmin', y 'Plic'.
2.  El AST usará estos nombres: \`{"type":"binary_operation","operator":"*","left":{...},"right":{"type":"binary_operation", "operator": "-", "left":{...}, "right":{"type":"binary_operation", "operator":"/", "left": {"type":"variable", "name":"P"},...}}}\`
3.  El campo \`formulaEconomica\` recibirá este AST como una cadena de texto JSON.

Si no hay fórmula económica principal, \`formulaEconomica\` será un string de objeto vacío ('{}') y \`variablesDinamicas\` un array vacío ([]).

---
**TAREA CRÍTICA 3: ANÁLISIS MATEMÁTICO DE TODAS LAS FÓRMULAS**
Como matemático, tu misión es identificar, interpretar y catalogar **todas** las fórmulas presentes en los documentos, no solo la fórmula de puntuación económica principal. Esto incluye fórmulas para criterios de mejora, fórmulas de penalización, umbrales calculados, etc.

Para cada fórmula matemática que encuentres, sin excepción:
1.  **Ajusta e Interpreta:** Analiza la fórmula para entender su propósito y componentes. Si la fórmula está escrita de manera ambigua o con texto descriptivo, "ajústala" para representarla en una notación matemática estándar y clara.
2.  **Cataloga en \`formulasDetectadas\`:** Crea un objeto en el array \`formulasDetectadas\` con los siguientes campos:
    *   \`formulaOriginal\`: La fórmula EXACTA como está en el texto. Si la has ajustado desde una descripción, pon aquí la versión ajustada y estándar.
    *   \`representacionLatex\`: Su traducción precisa a formato LaTeX. Presta especial atención a raíces, potencias, fracciones y símbolos. **Ej: \`P = 5 * (Ht – 100)/ 100)\` debe ser \`P = 5 \\times \\frac{(Ht - 100)}{100}\`**.
    *   \`descripcionVariables\`: Una descripción clara y concisa de CADA variable en la fórmula.
    *   \`condicionesLogicas\`: Explica cualquier condición lógica, tramo o regla asociada. Por ejemplo: "Esta fórmula solo se aplica si la oferta supera las 100 horas de formación."

Tu objetivo es que un usuario pueda entender perfectamente cómo funciona cada cálculo en la licitación. No omitas ninguna fórmula, por trivial que parezca.
---

**Análisis del Resto de Criterios:**
*   **'umbralBajaTemeraria':** Describe las condiciones para que una oferta sea considerada anormalmente baja o temeraria.
*   **'criteriosAutomaticos', 'criteriosSubjetivos', 'otrosCriterios':** Listas detalladas de todos los demás criterios con su descripción y puntuación máxima. La suma de todas las puntuaciones debe ser coherente con el total del pliego.

**Análisis Económico y de Costes:**
*   **Presupuesto General:** Busca el "Presupuesto Base de Licitación" (PBL) o "Valor Estimado del Contrato" (VEC) **TOTAL**. Extrae su valor numérico **sin IVA** como una cadena de texto.
*   **Recomendaciones de Costes ('costesDetalladosRecomendados'):** Actúa como un director de operaciones. Tu objetivo es generar un desglose de costes **realista, completo y rentable**.

Regla general: Si un dato no se encuentra, usa "No especificado en los documentos" para strings y arrays vacíos para listas. Para los costes recomendados, omite los campos que no puedas estimar.

--- TEXTO PCAP ---
${pcapText}
--- FIN TEXTO PCAP ---

--- TEXTO PPT ---
${pptText}
--- FIN TEXTO PPT ---`;
  };

  const callGeminiAPI = async (prompt: string): Promise<ReportData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

    console.log('🤖 Llamando a Gemini API...');

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
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
      parsedResult = JSON.parse(responseText);
      console.log('✅ JSON parseado correctamente:', parsedResult);
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
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

      // Extraer texto de ambos PDFs
      console.log('📝 Extrayendo texto del PCAP...');
      const pcapText = await extractTextFromPDF(pcapFile);
      console.log('✅ PCAP procesado, caracteres:', pcapText.length);

      console.log('📝 Extrayendo texto del PPT...');
      const pptText = await extractTextFromPDF(pptFile);
      console.log('✅ PPT procesado, caracteres:', pptText.length);

      // Solo procesar si se obtuvieron textos válidos
      if (!pcapText.trim() && !pptText.trim()) {
        throw new Error('No se pudo extraer texto de los archivos PDF');
      }

      // Crear prompt
      console.log('🔧 Creando prompt para análisis...');
      const prompt = createAnalysisPrompt(pcapText, pptText);
      console.log('✅ Prompt creado, longitud:', prompt.length);

      // Llamar a Gemini API
      console.log('🤖 Enviando a Gemini API...');
      const result = await callGeminiAPI(prompt);
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
