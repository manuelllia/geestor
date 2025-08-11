
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface BidAnalysisData {
  esPorLotes: boolean;
  lotes: Array<{
    nombre: string;
    centroAsociado: string;
    descripcion: string;
    presupuesto: string;
    requisitosClave: string[];
  }>;
  variablesDinamicas: Array<{
    nombre: string;
    descripcion: string;
    mapeo: 'price' | 'tenderBudget' | 'maxScore' | 'lowestPrice' | 'averagePrice';
  }>;
  formulaEconomica: string;
  formulasDetectadas: Array<{
    formulaOriginal: string;
    representacionLatex: string;
    descripcionVariables: string;
    condicionesLogicas: string;
  }>;
  umbralBajaTemeraria: string;
  criteriosAutomaticos: Array<{
    nombre: string;
    descripcion: string;
    puntuacionMaxima: number;
  }>;
  criteriosSubjetivos: Array<{
    nombre: string;
    descripcion: string;
    puntuacionMaxima: number;
  }>;
  otrosCriterios: Array<{
    nombre: string;
    descripcion: string;
    puntuacionMaxima: number;
  }>;
  presupuestoGeneral: string;
  costesDetalladosRecomendados: {
    [key: string]: any;
  };
}

export const useBidAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<BidAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log(`Extrayendo texto del archivo: ${file.name}`);
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Procesando página ${pageNum}/${pdf.numPages} de ${file.name}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += `\n--- PÁGINA ${pageNum} ---\n${pageText}\n`;
      }
      
      console.log(`Texto extraído del ${file.name}: ${fullText.length} caracteres, ${pdf.numPages} páginas`);
      return fullText;
      
    } catch (error) {
      console.error(`Error extrayendo texto del archivo ${file.name}:`, error);
      throw new Error(`No se pudo extraer el texto del archivo ${file.name}. Verifica que el PDF no esté protegido o corrupto.`);
    }
  };

  const generatePrompt = (pcapText: string, pptText: string): string => `
Actúa como un prestigioso matemático y un experto consultor especializado en licitaciones públicas de electromedicina en España. Tu tarea es analizar el texto extraído de un Pliego de Cláusulas Administrativas Particulares (PCAP) y un Pliego de Prescripciones Técnicas (PPT).

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
--- FIN TEXTO PPT ---

RESPUESTA REQUERIDA: Proporciona ÚNICAMENTE un objeto JSON válido con la estructura BidAnalysisData solicitada. No agregues explicaciones, texto adicional o bloques de código markdown.
`;

  const callGeminiAPI = async (prompt: string): Promise<BidAnalysisData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    try {
      console.log('Enviando análisis completo a Gemini 2.0 Flash...');
      console.log(`Tamaño del prompt: ${prompt.length} caracteres`);
      
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
            responseMimeType: "application/json"
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error de Gemini API:', errorData);
        throw new Error(`Error de Gemini API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Respuesta completa de Gemini recibida:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Estructura de respuesta inválida:', data);
        throw new Error('Respuesta inválida de Gemini API - estructura incorrecta');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Texto de respuesta:', responseText.substring(0, 500) + '...');

      // Intentar parsear la respuesta JSON
      try {
        // Limpiar la respuesta si tiene bloques de código markdown
        let cleanedResponse = responseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        // Si la respuesta empieza y termina con comillas, quitarlas
        if (cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) {
          cleanedResponse = cleanedResponse.slice(1, -1);
          // Escapar comillas internas
          cleanedResponse = cleanedResponse.replace(/\\"/g, '"');
        }
        
        const analysisResult: BidAnalysisData = JSON.parse(cleanedResponse);
        console.log('Análisis parseado exitosamente:', analysisResult);
        
        // Validar que el resultado tenga la estructura esperada
        if (typeof analysisResult !== 'object' || analysisResult === null) {
          throw new Error('El resultado no es un objeto válido');
        }
        
        return analysisResult;
      } catch (parseError) {
        console.error('Error parseando JSON de Gemini:', parseError);
        console.error('Respuesta recibida:', responseText);
        throw new Error(`La respuesta de Gemini no es un JSON válido: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`);
      }

    } catch (error) {
      console.error('Error en llamada a Gemini API:', error);
      if (error instanceof Error) {
        throw new Error(`Error en análisis con Gemini: ${error.message}`);
      }
      throw new Error('Error desconocido en análisis con Gemini');
    }
  };

  const analyzeBid = async (pcapFile: File, pptFile: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando análisis completo de licitación con Gemini 2.0 Flash...');
      
      // Extraer texto real de los PDFs
      console.log('Extrayendo texto de archivos PDF...');
      const pcapText = await extractTextFromPDF(pcapFile);
      const pptText = await extractTextFromPDF(pptFile);
      
      // Verificar que se extrajo contenido
      if (!pcapText.trim() && !pptText.trim()) {
        throw new Error('No se pudo extraer texto de los archivos PDF. Verifica que los archivos no estén corruptos o protegidos.');
      }
      
      if (!pcapText.trim()) {
        console.warn('No se extrajo texto del archivo PCAP');
      }
      
      if (!pptText.trim()) {
        console.warn('No se extrajo texto del archivo PPT');
      }
      
      console.log(`PCAP extraído: ${pcapText.length} caracteres`);
      console.log(`PPT extraído: ${pptText.length} caracteres`);
      console.log(`Total de texto para análisis: ${pcapText.length + pptText.length} caracteres`);
      
      // Generar el prompt para Gemini
      const prompt = generatePrompt(pcapText, pptText);
      console.log(`Prompt generado: ${prompt.length} caracteres`);
      
      // Llamar a la API de Gemini con el modelo optimizado
      console.log('Enviando análisis completo a Gemini API...');
      const analysis = await callGeminiAPI(prompt);
      
      setAnalysisResult(analysis);
      console.log('Análisis completado exitosamente con Gemini 2.0 Flash');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el análisis';
      setError(errorMessage);
      console.error('Error en análisis de licitación:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeBid,
    analysisResult,
    isLoading,
    error
  };
};
