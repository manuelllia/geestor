import { useState } from 'react';

// Interfaz ReportData: Asegurarse de que coincida con el esquema y el prompt
interface ReportData {
  presupuestoGeneral: string;
  esPorLotes: boolean;
  lotes: Array<{ // Tipado más específico
    nombre: string;
    centroAsociado: string;
    descripcion: string;
    presupuesto: string; // Numérico sin IVA, como string para mantener flexibilidad
    requisitosClave: string[];
  }>;
  variablesDinamicas: Array<{ // Tipado más específico
    nombre: string;
    descripcion: string;
    mapeo: 'price' | 'tenderBudget' | 'maxScore' | 'lowestPrice' | 'averagePrice';
  }>;
  formulaEconomica: string; // AST JSON como string
  formulasDetectadas: Array<{ // Tipado más específico
    formulaOriginal: string;
    representacionLatex: string;
    descripcionVariables: string;
    condicionesLogicas: string; // Añadido para coincidir con el prompt y el esquema
  }>;
  umbralBajaTemeraria: string;
  criteriosAutomaticos: Array<{ // Tipado más específico
    nombre: string;
    descripcion: string;
    puntuacionMaxima: number;
  }>;
  criteriosSubjetivos: Array<{ // Tipado más específico
    nombre: string;
    descripcion: string;
    puntuacionMaxima: number;
  }>;
  otrosCriterios: Array<{ // Tipado más específico
    nombre: string;
    descripcion: string;
    puntuacionMaxima: number;
  }>;
  costesDetalladosRecomendados: Array<{ // Tipado más específico y estructurado
    categoria: string;
    concepto: string;
    costeEstimado: number;
    justificacion: string;
  }>;
}

// Esquema de Respuesta (responseSchema): Debe ser preciso y completo
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
        // Añado 'requisitosClave' a required para que Gemini lo incluya
        required: ["nombre", "centroAsociado", "descripcion", "presupuesto", "requisitosClave"]
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
          condicionesLogicas: { type: "string" } // Asegurar que está aquí
        },
        // Añadir 'condicionesLogicas' a required
        required: ["formulaOriginal", "representacionLatex", "descripcionVariables", "condicionesLogicas"]
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

  // Prompt de Análisis: Más detallado y consistente con el esquema
  const createAnalysisPrompt = (): string => {
    return `Actúa como un prestigioso matemático y un experto consultor especializado en licitaciones públicas de electromedicina en España. Tu tarea es analizar los documentos PDF proporcionados: un Pliego de Cláusulas Administrativas Particulares (PCAP) y un Pliego de Prescripciones Técnicas (PPT).

**Instrucción de Idioma (CRÍTICA):** Los documentos de entrada (PCAP y PPT) pueden estar escritos en español, catalán, gallego, euskera (vasco), valenciano o inglés. Independientemente del idioma de origen, TU RESPUESTA Y TODOS LOS DATOS EXTRAÍDOS en el JSON final DEBEN ESTAR OBLIGATORIAMENTE EN ESPAÑOL. Realiza la traducción necesaria para todos los campos.

Extrae únicamente la información verificable presente en los textos proporcionados para rellenar la estructura JSON solicitada. NO incluyas explicaciones, introducciones o conclusiones fuera del objeto JSON.

**Análisis de Lotes:**
1.  **Detecta si es por lotes:** Primero, determina si la licitación está explícitamente dividida en lotes. Establece el campo 'esPorLotes' en 'true' si es así, y en 'false' en caso contrario.
2.  **Si es por lotes:** Rellena el array 'lotes'. Para cada lote identificado, extrae: 'nombre', 'centroAsociado', 'descripcion', 'presupuesto' (string numérico sin IVA, usa '.' como separador decimal), y 'requisitosClave' (una lista de los requisitos clave como strings).
3.  **Si NO es por lotes:** El array 'lotes' debe quedar vacío ([]).

**TAREA CRÍTICA 1: ANÁLISIS DE VARIABLES DINÁMICAS**
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
*   **Serialización:** El objeto JSON completo del AST DEBE ser serializado como una única cadena de texto para el campo \`formulaEconomica\`. Por ejemplo, si el AST es \`{"type":"binary_operation", ...}\`, entonces \`formulaEconomica\` contendrá la cadena \`"{\\"type\\":\\"binary_operation\\", ...}"\`.
Si no hay fórmula económica principal, \`formulaEconomica\` será un string de objeto vacío ('{}') y \`variablesDinamicas\` un array vacío ([]).

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

**Análisis del Resto de Criterios:**
*   **'umbralBajaTemeraria':** Describe las condiciones para que una oferta sea considerada anormalmente baja o temeraria.
*   **'criteriosAutomaticos', 'criteriosSubjetivos', 'otrosCriterios':** Listas detalladas de todos los demás criterios con su descripción y puntuación máxima. La suma de todas las puntuaciones debe ser coherente con el total del pliego.

**Análisis Económico y de Costes:**
*   **Presupuesto General:** Busca el "Presupuesto Base de Licitación" (PBL) o "Valor Estimado del Contrato" (VEC) **TOTAL**. Extrae su valor numérico **sin IVA** como una cadena de texto (usa '.' como separador decimal). Si es posible, exprésalo como un número sin símbolos de moneda.
*   **Recomendaciones de Costes ('costesDetalladosRecomendados'):** Actúa como un director de operaciones. Tu objetivo es generar un desglose de costes **realista, completo y rentable** para la oferta. Proporciona al menos 5-10 categorías de costes (ej: Personal, Materiales, Servicios externos, Infraestructura, Formación, Mantenimiento, Garantías, Software, Transporte, Otros), incluyendo un \`costeEstimado\` numérico (tipo number) y una \`justificacion\` breve para cada uno. Si no puedes obtener un coste estimado exacto de los documentos, haz una estimación razonada basada en el contexto de electromedicina.

**Regla general:** Si un dato no se encuentra, usa "No especificado en los documentos" para strings y arrays vacíos para listas. Para los costes recomendados, omite los campos que no puedas estimar si no tienen sentido (aunque intenta dar estimaciones coherentes).

**Formato de Salida:**
La respuesta debe ser UNICAMENTE un objeto JSON válido que se ajuste *estrictamente* al esquema JSON proporcionado. No añadas texto adicional, ni bloques de código Markdown, ni comentarios. El JSON es la respuesta completa.
`;

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<ReportData> => {
    // ⚠️ ADVERTENCIA DE SEGURIDAD: La clave API está expuesta directamente en el código del frontend.
    // Esto es INSEGURO y NO RECOMENDADO para aplicaciones en producción.
    // Cualquiera puede ver y usar esta clave.
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg'; 
    // Por favor, considera usar variables de entorno o un backend para proteger tu clave.

    // Modelo solicitado por el usuario. Es un modelo de preview y puede ser menos estable.
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

    console.log('🤖 Llamando a Gemini API con modelo gemini-2.5-flash-preview-05-20...');

    try {
      // Convertir archivos a base64 para input multimodal
      console.log('📄 Convirtiendo archivos a base64...');
      const pcapBase64 = await convertFileToBase64(pcapFile);
      const pptBase64 = await convertFileToBase64(pptFile);
      console.log('✅ Archivos convertidos a base64');

      const requestBody = {
        contents: [{
          parts: [
            { text: createAnalysisPrompt() }, // El prompt textual
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
          temperature: 0.1, // Baja temperatura para respuestas más deterministas
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192, // Aumentado para dar más espacio, pero el modelo preview puede truncar igual
          responseMimeType: "application/json",
          responseSchema: responseSchema // Usar el esquema definido para forzar la estructura
        },
        safetySettings: [
          // Mantener configuración de seguridad permisiva si es necesario para el contenido
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      };

      console.log('📤 Enviando request a Gemini (cuerpo truncado para log):', JSON.stringify(requestBody, null, 2).substring(0, 500) + '...');

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error de Gemini API:', errorData);
        throw new Error(`Error de Gemini API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta completa de Gemini recibida (truncada para log):', JSON.stringify(data, null, 2).substring(0, 1000) + '...');

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Estructura de respuesta inválida:', data);
        throw new Error('Respuesta inválida de Gemini API - estructura incorrecta o vacía.');
      }

      // IMPORTANTE: Cuando se usa responseSchema, `data.candidates[0].content` YA ES EL OBJETO JSON PARSEADO.
      // No necesitas acceder a `.parts[0].text` ni hacer `JSON.parse()` manual.
      // Esto resuelve el error "Unterminated string in JSON".
      const parsedResult: ReportData = data.candidates[0].content;

      console.log('✅ JSON parseado correctamente:', parsedResult);
      
      return parsedResult;
    } catch (error) {
      console.error('❌ Error en llamada a Gemini API:', error);
      if (error instanceof Error) {
        throw new Error(`Error en análisis con Gemini: ${error.message}`);
      }
      throw new Error('Error desconocido en análisis con Gemini');
    }
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

      // Llamar directamente a Gemini API con los archivos
      console.log('🤖 Enviando archivos a Gemini API...');
      const result = await callGeminiAPI(pcapFile, pptFile);
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