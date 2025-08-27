
import { useState } from 'react';
import { fileToBase64, getMimeType } from '../utils/file-helpers';

interface CostAnalysisData {
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

export const useCostAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<CostAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMasterPrompt = (): string => `
Actúa como un prestigioso matemático y un experto consultor especializado en licitaciones públicas de electromedicina en España. Tu tarea es analizar los documentos PDF proporcionados: un Pliego de Cláusulas Administrativas Particulares (PCAP) y un Pliego de Prescripciones Técnicas (PPT).

**Instrucción de Idioma (CRÍTICA):** Los documentos de entrada (PCAP y PPT) pueden estar escritos en español, catalán, gallego, euskera (vasco), valenciano o inglés. Independientemente del idioma de origen, TU RESPUESTA Y TODOS LOS DATOS EXTRAÍDOS en el JSON final DEBEN ESTAR OBLIGATORIAMENTE EN ESPAÑOL. Realiza la traducción necesaria para todos los campos.

Extrae únicamente la información verificable presente en los documentos proporcionados para rellenar la estructura JSON solicitada. No incluyas explicaciones, introducciones o conclusiones fuera del objeto JSON.

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

**TAREA CRÍTICA 2: ANÁLISIS Y DESCOMPOSICIÓN DE FÓRMULAS (AST como String JSON)**
Una vez identificadas las variables, analiza la fórmula económica principal y descomponla en un Árbol de Sintaxis Abstracta (AST) serializado como una cadena JSON.
*   **Usa las Variables Detectadas:** En los nodos de tipo "variable" del AST, DEBES usar el \`nombre\` de la variable que has definido en \`variablesDinamicas\`. Por ejemplo, si detectaste "Plic", el nodo variable será \`{ "type": "variable", "name": "Plic" }\`.
*   **Serialización:** El objeto JSON completo del AST debe ser serializado como una única cadena de texto para el campo \`formulaEconomica\`.

**EJEMPLO COMPLETO:**
Si la fórmula es \`70 * (1 - (P - Pmin) / (Plic - Pmin))\`, y has detectado que 'P' es el precio de la oferta, 'Pmin' el precio más bajo y 'Plic' el presupuesto:
1.  \`variablesDinamicas\` contendrá las definiciones de 'P', 'Pmin', y 'Plic'.
2.  El AST usará estos nombres: \`{"type":"binary_operation","operator":"*","left":{...},"right":{"type":"binary_operation", "operator": "-", "left":{...}, "right":{"type":"binary_operation", "operator":"/", "left": {"type":"variable", "name":"P"},...}}}\`
3.  El campo \`formulaEconomica\` recibirá este AST como una cadena de texto JSON.

Si no hay fórmula económica principal, \`formulaEconomica\` será un string vacío ('') y \`variablesDinamicas\` un array vacío ([]).

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

RESPUESTA REQUERIDA: Proporciona ÚNICAMENTE un objeto JSON válido con la estructura CostAnalysisData solicitada. No agregues explicaciones, texto adicional o bloques de código markdown.
`;

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<CostAnalysisData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    
    try {
      console.log('🤖 Enviando análisis de costes a Gemini API con archivos PDF...');
      
      // Convertir archivos a base64
      const pcapBase64 = await fileToBase64(pcapFile);
      const pptBase64 = await fileToBase64(pptFile);
      
      console.log('📄 Archivos convertidos a base64');
      console.log(`PCAP: ${pcapFile.name} (${pcapFile.size} bytes)`);
      console.log(`PPT: ${pptFile.name} (${pptFile.size} bytes)`);

      const requestBody = {
        contents: [{
          parts: [
            {
              text: generateMasterPrompt()
            },
            {
              inlineData: {
                mimeType: getMimeType(pcapFile.name),
                data: pcapBase64
              }
            },
            {
              inlineData: {
                mimeType: getMimeType(pptFile.name),
                data: pptBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 20,
          topP: 0.8,
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
      };

      console.log('📤 Enviando request a Gemini con archivos PDF...');

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error de Gemini API:', errorData);
        throw new Error(`Error de Gemini API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta completa de Gemini recibida');

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Estructura de respuesta inválida:', data);
        throw new Error('Respuesta inválida de Gemini API - estructura incorrecta');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 Texto de respuesta recibido');

      // Función para parsear JSON de forma segura
      const safeJsonParse = (jsonString: string): CostAnalysisData => {
        try {
          // Limpiar la respuesta si tiene bloques de código markdown
          let cleanedResponse = jsonString
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          
          // Buscar el inicio y fin del JSON
          const jsonStart = cleanedResponse.indexOf('{');
          const jsonEnd = cleanedResponse.lastIndexOf('}');
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
          }
          
          const parsedResult: CostAnalysisData = JSON.parse(cleanedResponse);
          console.log('✅ JSON parseado exitosamente');
          
          // Validar y limpiar la estructura para evitar objetos complejos en React
          const cleanedResult: CostAnalysisData = {
            esPorLotes: Boolean(parsedResult.esPorLotes),
            lotes: Array.isArray(parsedResult.lotes) ? parsedResult.lotes.map(lote => ({
              nombre: String(lote.nombre || ''),
              centroAsociado: String(lote.centroAsociado || ''),
              descripcion: String(lote.descripcion || ''),
              presupuesto: String(lote.presupuesto || ''),
              requisitosClave: Array.isArray(lote.requisitosClave) ? lote.requisitosClave.map(req => String(req)) : []
            })) : [],
            variablesDinamicas: Array.isArray(parsedResult.variablesDinamicas) ? parsedResult.variablesDinamicas.map(variable => ({
              nombre: String(variable.nombre || ''),
              descripcion: String(variable.descripcion || ''),
              mapeo: ['price', 'tenderBudget', 'maxScore', 'lowestPrice', 'averagePrice'].includes(variable.mapeo) 
                ? variable.mapeo as 'price' | 'tenderBudget' | 'maxScore' | 'lowestPrice' | 'averagePrice'
                : 'price'
            })) : [],
            formulaEconomica: String(parsedResult.formulaEconomica || ''),
            formulasDetectadas: Array.isArray(parsedResult.formulasDetectadas) ? parsedResult.formulasDetectadas.map(formula => ({
              formulaOriginal: String(formula.formulaOriginal || ''),
              representacionLatex: String(formula.representacionLatex || ''),
              descripcionVariables: String(formula.descripcionVariables || ''),
              condicionesLogicas: String(formula.condicionesLogicas || '')
            })) : [],
            umbralBajaTemeraria: String(parsedResult.umbralBajaTemeraria || 'No especificado'),
            criteriosAutomaticos: Array.isArray(parsedResult.criteriosAutomaticos) ? parsedResult.criteriosAutomaticos.map(criterio => ({
              nombre: String(criterio.nombre || ''),
              descripcion: String(criterio.descripcion || ''),
              puntuacionMaxima: Number(criterio.puntuacionMaxima) || 0
            })) : [],
            criteriosSubjetivos: Array.isArray(parsedResult.criteriosSubjetivos) ? parsedResult.criteriosSubjetivos.map(criterio => ({
              nombre: String(criterio.nombre || ''),
              descripcion: String(criterio.descripcion || ''),
              puntuacionMaxima: Number(criterio.puntuacionMaxima) || 0
            })) : [],
            otrosCriterios: Array.isArray(parsedResult.otrosCriterios) ? parsedResult.otrosCriterios.map(criterio => ({
              nombre: String(criterio.nombre || ''),
              descripcion: String(criterio.descripcion || ''),
              puntuacionMaxima: Number(criterio.puntuacionMaxima) || 0
            })) : [],
            presupuestoGeneral: String(parsedResult.presupuestoGeneral || '0'),
            costesDetalladosRecomendados: typeof parsedResult.costesDetalladosRecomendados === 'object' 
              ? parsedResult.costesDetalladosRecomendados || {} 
              : {}
          };
          
          return cleanedResult;
        } catch (parseError) {
          console.error('❌ Error parseando JSON:', parseError);
          console.error('📝 Respuesta recibida:', jsonString.substring(0, 500) + '...');
          throw new Error(`La respuesta de Gemini no es un JSON válido: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`);
        }
      };

      return safeJsonParse(responseText);

    } catch (error) {
      console.error('❌ Error en llamada a Gemini API:', error);
      if (error instanceof Error) {
        throw new Error(`Error en análisis de costes con Gemini: ${error.message}`);
      }
      throw new Error('Error desconocido en análisis de costes con Gemini');
    }
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      console.log('🚀 Iniciando análisis de costes con Gemini y archivos PDF...');
      
      // Verificar archivos
      if (!pcapFile || !pptFile) {
        throw new Error('Ambos archivos (PCAP y PPT) son requeridos para el análisis');
      }
      
      if (pcapFile.type !== 'application/pdf' || pptFile.type !== 'application/pdf') {
        throw new Error('Los archivos deben ser PDFs válidos');
      }
      
      console.log(`📊 Procesando archivos:`);
      console.log(`  - PCAP: ${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`  - PPT: ${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`);
      
      // Llamar a la API de Gemini con los archivos PDF
      console.log('🤖 Enviando análisis completo a Gemini API...');
      const analysis = await callGeminiAPI(pcapFile, pptFile);
      
      setAnalysisResult(analysis);
      console.log('✅ Análisis de costes completado exitosamente con Gemini');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el análisis';
      setError(errorMessage);
      console.error('❌ Error en análisis de costes:', err);
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
