
import { useState } from 'react';
import { fileToBase64, getMimeType } from '../utils/file-helpers';

interface CostAnalysisData {
  // Información General de la Licitación
  licitacionInfo: {
    tipoLicitacion: string;
    objetoContrato: string;
    entidadContratante: string;
    codigoCPV: string;
    fechaInscripcion: string;
    plazoLimite: string;
    fechaAperturaSobres: string;
    plazoAdjudicacion: string;
    fechaInicioEjecucion: string;
    numeroLotes: number;
    valorEstimado: string;
    criteriosSeleccion: string[];
  };
  
  // Alcance y Condiciones
  alcanceCondiciones: {
    ambitoGeografico: string;
    serviciosIncluidos: string[];
    productosIncluidos: string[];
    requisitosTecnicos: string[];
    exclusiones: string[];
    duracionBase: string;
    fechaInicio: string;
    fechaFin: string;
    numeroMaximoProrrogas: number;
    duracionCadaProrroga: string;
    condicionesProrroga: string[];
    porcentajeMaximoModificacion: string;
    casosModificacion: string[];
  };

  // Personal Requerido (análisis detallado)
  personalRequerido: {
    totalPersonas: number;
    personalPorLote: { lote: string; personas: number; centro: string }[];
    desglosePorPuesto: Array<{
      puesto: string;
      numero: number;
      perfil: string;
      dedicacion: string;
      costeSalarialEstimado: number;
    }>;
    estudiosRequeridos: string[];
    experienciaMinima: string;
    estimacionCostePorPersona: number;
    costoTotalEstimado: number;
  };

  // Análisis Económico Detallado
  analisisEconomico: {
    presupuestoBaseLicitacion: string;
    desgloseCostes: {
      personal: {
        totalCostePersonal: number;
        desglosePorPuesto: Array<{
          puesto: string;
          numero: number;
          costeMensual: number;
          costeAnual: number;
        }>;
      };
      compras: {
        equipamiento: number;
        consumibles: number;
        repuestos: number;
        totalCompras: number;
      };
      subcontrataciones: {
        serviciosExternalizables: string[];
        limiteSubcontratacion: string;
        costeEstimadoSubcontratacion: number;
      };
      otrosGastos: {
        seguros: number;
        gastosGenerales: number;
        costesIndirectos: number;
        totalOtrosGastos: number;
      };
    };
    costoTotalProyecto: number;
    rentabilidadEstimada: number;
  };

  // Criterios de Adjudicación (sección más detallada)
  criteriosAdjudicacion: {
    puntuacionMaximaEconomica: number;
    puntuacionMaximaTecnica: number;
    puntuacionTotal: number;
    
    // Fórmulas matemáticas detalladas
    formulasDetectadas: Array<{
      nombre: string;
      tipo: 'economica' | 'tecnica' | 'mejora' | 'penalizacion' | 'umbral';
      formulaOriginal: string;
      representacionLatex: string;
      descripcionVariables: string;
      condicionesLogicas: string;
      ejemploAplicacion: string;
    }>;
    
    // Variables de las fórmulas
    variablesDinamicas: Array<{
      nombre: string;
      descripcion: string;
      mapeo: 'price' | 'tenderBudget' | 'maxScore' | 'lowestPrice' | 'averagePrice';
      valorEjemplo: string;
    }>;
    
    // Fórmula principal económica en formato AST
    formulaEconomicaAST: string;
    
    // Análisis de baja temeraria
    bajaTemeraria: {
      descripcion: string;
      umbralPorcentaje: string;
      formulaCalculo: string;
      procedimientoVerificacion: string[];
    };
    
    // Desglose detallado de criterios
    criteriosAutomaticos: Array<{
      nombre: string;
      descripcion: string;
      puntuacionMaxima: number;
      verificacion: string;
      documentacionRequerida: string[];
    }>;
    
    criteriosSubjetivos: Array<{
      nombre: string;
      descripcion: string;
      puntuacionMaxima: number;
      aspectosEvaluar: string[];
      criteriosCalificacion: string[];
    }>;
    
    mejoras: Array<{
      nombre: string;
      descripcion: string;
      puntuacionMaxima: number;
      valoracionEconomica: string;
      requisitos: string[];
    }>;
  };

  // Información adicional relevante
  detallesAdicionales: {
    ubicacion: string;
    duracionContrato: string;
    condicionesEspeciales: string[];
    garantias: Array<{
      tipo: string;
      porcentaje: string;
      duracion: string;
    }>;
    penalizaciones: Array<{
      concepto: string;
      importe: string;
      condiciones: string;
    }>;
    documentacionRequerida: string[];
  };
}

export const useCostAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<CostAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMasterPrompt = (): string => `
Actúa como un prestigioso analista especializado en licitaciones públicas de electromedicina en España, con más de 15 años de experiencia en análisis de contratos públicos y gestión de costes. Tu misión es realizar un análisis exhaustivo y profesional de los documentos de licitación proporcionados.

**INSTRUCCIÓN DE IDIOMA CRÍTICA:** Los documentos pueden estar en cualquier idioma oficial de España (español, catalán, gallego, euskera, valenciano) o inglés. TODA tu respuesta y TODOS los datos extraídos en el JSON final DEBEN ESTAR OBLIGATORIAMENTE EN ESPAÑOL PROFESIONAL. Realiza todas las traducciones necesarias.

**CONTEXTO PROFESIONAL:**
Eres un consultor senior que debe proporcionar un análisis completo para que una empresa de electromedicina pueda tomar decisiones estratégicas sobre su participación en esta licitación. Tu análisis debe ser preciso, detallado y orientado a la rentabilidad empresarial.

**ESTRUCTURA DEL ANÁLISIS REQUERIDO:**

## 1. INFORMACIÓN GENERAL DE LA LICITACIÓN
Extrae y analiza:
- **Tipo de Licitación**: Determina si es licitación única o por lotes
- **Objeto del Contrato**: Descripción completa de lo que se licita
- **Entidad Contratante**: Organismo público que convoca la licitación
- **Código CPV**: Código de clasificación del contrato
- **Cronograma Completo**: Todas las fechas relevantes (inscripción, presentación ofertas, apertura sobres, adjudicación, inicio ejecución)
- **Valor Estimado**: Presupuesto base de licitación sin IVA

## 2. ALCANCE Y CONDICIONES DEL CONTRATO
Analiza detalladamente:
- **Ámbito Geográfico**: Ubicaciones donde se prestará el servicio
- **Servicios y Productos**: Lista específica de lo incluido y excluido
- **Requisitos Técnicos**: Especificaciones técnicas principales
- **Duración y Prórrogas**: Plazo base, número máximo de prórrogas, condiciones
- **Modificaciones**: Porcentaje máximo permitido, casos y procedimientos

## 3. ANÁLISIS ECONÓMICO PROFESIONAL
Realiza un análisis de costes empresarial detallado:

### A) COSTES DE PERSONAL:
- Identifica el número total de trabajadores necesarios
- Desglose por puesto de trabajo (técnicos, ingenieros, administrativos, etc.)
- Perfil profesional requerido para cada puesto
- Dedicación (jornada completa, parcial, específica)
- **Estimación realista de costes salariales** considerando:
  - Salario bruto anual por puesto
  - Seguridad Social (30% aproximadamente)
  - Pagas extraordinarias
  - Otros beneficios sociales
  - Coste total por empleado/año

### B) COSTES DE COMPRAS Y SUMINISTROS:
- Equipamiento necesario (inversión inicial)
- Consumibles y fungibles (coste anual)
- Repuestos y mantenimiento
- Estimación económica de cada partida

### C) SUBCONTRATACIONES:
- Servicios que se pueden externalizar
- Límites legales de subcontratación
- Coste estimado de servicios subcontratados

### D) OTROS GASTOS:
- Seguros obligatorios
- Gastos generales de la empresa
- Costes indirectos (administración, comercial, etc.)

### E) ANÁLISIS DE RENTABILIDAD:
- Coste total del proyecto
- Margen de beneficio recomendado
- Análisis de riesgos económicos

## 4. CRITERIOS DE ADJUDICACIÓN (ANÁLISIS CRÍTICO)

### A) SISTEMA DE PUNTUACIÓN:
- Puntuación máxima económica
- Puntuación máxima técnica
- Distribución porcentual

### B) ANÁLISIS MATEMÁTICO COMPLETO:
Para CADA fórmula matemática encontrada en los documentos:
1. **Identifica y clasifica** todas las fórmulas (no solo la económica):
   - Fórmulas de puntuación económica
   - Fórmulas de criterios técnicos
   - Fórmulas de mejoras
   - Fórmulas de penalizaciones
   - Umbrales calculados

2. **Para cada fórmula proporciona**:
   - Nombre descriptivo de la fórmula
   - Tipo (económica/técnica/mejora/penalización/umbral)
   - Fórmula original exacta del documento
   - Representación en LaTeX profesional
   - Descripción detallada de cada variable
   - Condiciones lógicas de aplicación
   - Ejemplo práctico de aplicación

3. **Variables de la Fórmula Económica Principal**:
   - Identifica cada variable (ej: "Plic", "Oferta_i", "Pmin")
   - Descripción de qué representa cada variable
   - Mapeo a conceptos estándar del sistema
   - Valores de ejemplo realistas

4. **Fórmula AST**: Convierte la fórmula económica principal a formato AST JSON

### C) BAJA TEMERARIA:
- Descripción del umbral
- Porcentaje específico
- Fórmula de cálculo
- Procedimiento de verificación

### D) DESGLOSE DETALLADO DE CRITERIOS:

**Criterios Automáticos** (verificables objetivamente):
- Lista completa con puntuación
- Método de verificación
- Documentación requerida

**Criterios Subjetivos** (requieren valoración):
- Lista completa con puntuación
- Aspectos a evaluar
- Criterios de calificación

**Mejoras** (si las hay):
- Descripción de cada mejora
- Puntuación asignada
- Valoración económica
- Requisitos específicos

## 5. INFORMACIÓN ADICIONAL EMPRESARIAL
- Garantías requeridas (tipos, porcentajes, duración)
- Penalizaciones previstas
- Documentación administrativa necesaria
- Condiciones especiales de ejecución

**FORMATO DE RESPUESTA:**
Proporciona ÚNICAMENTE un objeto JSON válido con la estructura CostAnalysisData completa. No agregues explicaciones adicionales fuera del JSON.

**CALIDAD PROFESIONAL:**
- Usa terminología técnica apropiada
- Proporciona estimaciones realistas y fundamentadas
- Considera la normativa española de contratación pública
- Enfoque orientado a la toma de decisiones empresariales

**INSTRUCCIONES FINALES:**
- Si un dato no se encuentra, usa "No especificado en los documentos"
- Para arrays vacíos, usa []
- Para números, usa valores realistas del mercado español
- Mantén coherencia en todas las estimaciones económicas
`;

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<CostAnalysisData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    try {
      console.log('🤖 Enviando análisis profesional de costes a Gemini API...');
      
      const pcapBase64 = await fileToBase64(pcapFile);
      const pptBase64 = await fileToBase64(pptFile);
      
      console.log('📄 Archivos procesados para análisis profesional');
      console.log(`PCAP: ${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`PPT: ${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`);

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

      console.log('📤 Enviando análisis profesional a Gemini...');

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error de Gemini API:', errorData);
        throw new Error(`Error de Gemini API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Análisis profesional completado por Gemini');

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Estructura de respuesta inválida:', data);
        throw new Error('Respuesta inválida de Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      
      try {
        let cleanedResponse = responseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        const parsedResult: CostAnalysisData = JSON.parse(cleanedResponse);
        console.log('✅ Análisis profesional parseado exitosamente');
        
        return parsedResult;
      } catch (parseError) {
        console.error('❌ Error parseando análisis profesional:', parseError);
        throw new Error(`Error en análisis: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`);
      }

    } catch (error) {
      console.error('❌ Error en análisis profesional:', error);
      throw error;
    }
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      console.log('🚀 Iniciando análisis profesional de costes...');
      
      if (!pcapFile || !pptFile) {
        throw new Error('Ambos archivos (PCAP y PPT) son requeridos para el análisis');
      }
      
      if (pcapFile.type !== 'application/pdf' || pptFile.type !== 'application/pdf') {
        throw new Error('Los archivos deben ser PDFs válidos');
      }
      
      const analysis = await callGeminiAPI(pcapFile, pptFile);
      setAnalysisResult(analysis);
      console.log('✅ Análisis profesional completado exitosamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el análisis';
      setError(errorMessage);
      console.error('❌ Error en análisis profesional:', err);
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
