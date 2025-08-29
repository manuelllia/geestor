
import { useState } from 'react';
import { fileToBase64, getMimeType } from '../utils/file-helpers';

interface LoteInfo {
  nombre: string;
  centroAsociado: string;
  descripcion: string;
  presupuesto: string;
  requisitosClaves: string[];
}

interface AlcanceCondiciones {
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
}

interface CronogramaPlazos {
  fechaLimiteOfertas: string;
  fechaAperturaSobres: string;
  plazoAdjudicacion: string;
  fechaInicioEjecucion: string;
}

interface AnalisisPersonal {
  numeroTrabajadores: number;
  desglosePorPuesto: Array<{
    puesto: string;
    numero: number;
    perfilRequerido: string;
    dedicacion: string;
    costeSalarialEstimado: number;
  }>;
}

interface AnalisisCompras {
  equipamiento: {
    descripcion: string;
    costeEstimado: number;
  };
  consumibles: {
    descripcion: string;
    costeEstimado: number;
  };
  repuestos: {
    descripcion: string;
    costeEstimado: number;
  };
}

interface AnalisisSubcontrataciones {
  serviciosExternalizables: string[];
  limites: string;
  costeEstimado: number;
}

interface AnalisisOtrosGastos {
  seguros: number;
  gastosGenerales: number;
  costesIndirectos: number;
}

interface AnalisisEconomico {
  presupuestoBaseLicitacion: string;
  personal: AnalisisPersonal;
  compras: AnalisisCompras;
  subcontrataciones: AnalisisSubcontrataciones;
  otrosGastos: AnalisisOtrosGastos;
}

interface FormulaMatematica {
  nombre: string;
  tipo: 'economica' | 'tecnica' | 'mejora' | 'penalizacion' | 'umbral';
  formulaOriginal: string;
  representacionLatex: string;
  descripcionVariables: string;
  condicionesLogicas: string;
  ejemploAplicacion: string;
}

interface VariableFormula {
  nombre: string;
  descripcion: string;
  mapeo: string;
  valorEjemplo: string;
}

interface BajaTemeraria {
  descripcion: string;
  umbralPorcentaje: string;
  formulaCalculo: string;
  procedimientoVerificacion: string[];
}

interface CriterioEvaluacion {
  nombre: string;
  descripcion: string;
  puntuacionMaxima: number;
  verificacion?: string;
  documentacionRequerida?: string[];
  aspectosEvaluar?: string[];
  criteriosCalificacion?: string[];
  valoracionEconomica?: string;
  requisitos?: string[];
}

interface CriteriosAdjudicacion {
  puntuacionMaximaEconomica: number;
  puntuacionMaximaTecnica: number;
  formulasMatematicas: FormulaMatematica[];
  variablesFormula: VariableFormula[];
  formulaPrincipalAST: string;
  bajaTemeraria: BajaTemeraria;
  criteriosAutomaticos: CriterioEvaluacion[];
  criteriosSubjetivos: CriterioEvaluacion[];
  otrosCriterios: CriterioEvaluacion[];
}

export interface CostAnalysisData {
  // Información General de la Licitación
  informacionGeneral: {
    tipoLicitacion: string;
    objetoContrato: string;
    entidadContratante: string;
    codigoCPV: string;
    lotes: LoteInfo[];
  };
  
  // Alcance y Condiciones del Contrato
  alcanceCondiciones: AlcanceCondiciones;
  
  // Cronograma y Plazos
  cronogramaPlazos: CronogramaPlazos;
  
  // Análisis Económico Detallado
  analisisEconomico: AnalisisEconomico;
  
  // Criterios de Adjudicación
  criteriosAdjudicacion: CriteriosAdjudicacion;
}

export const useCostAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<CostAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMasterPrompt = (): string => `
Actúa como el más prestigioso analista especializado en licitaciones públicas de electromedicina en España, con más de 20 años de experiencia en análisis de contratos públicos sanitarios y gestión de costes hospitalarios. Tu misión es realizar un análisis EXHAUSTIVO y COMPLETO de los documentos de licitación proporcionados.

**INSTRUCCIONES CRÍTICAS DE ANÁLISIS:**

1. **ANALIZA AMBOS DOCUMENTOS COMPLETAMENTE**: Debes extraer información tanto del PCAP (Pliego de Cláusulas Administrativas Particulares) como del PPT (Pliego de Prescripciones Técnicas). No te limites a uno solo.

2. **IDIOMA DE RESPUESTA**: Los documentos pueden estar en cualquier idioma oficial de España. TODA tu respuesta DEBE estar en ESPAÑOL PROFESIONAL.

3. **NIVEL DE DETALLE REQUERIDO**: Necesito TODA la información disponible. Es preferible que incluyas datos completos a que los omitas.

**ESTRUCTURA COMPLETA DEL ANÁLISIS:**

## 1. INFORMACIÓN GENERAL DE LA LICITACIÓN
- **Tipo de Licitación**: Especifica si es licitación única o dividida en lotes
- **Objeto del Contrato**: Descripción completa del servicio/suministro
- **Entidad Contratante**: Organismo que convoca
- **Código CPV**: Código de clasificación
- **Detalle de Lotes** (si aplica): Para cada lote incluir:
  - Nombre del lote
  - Centro/hospital asociado
  - Descripción específica
  - Presupuesto del lote
  - Requisitos clave específicos

## 2. ALCANCE Y CONDICIONES DEL CONTRATO
- **Ámbito Geográfico**: Ubicaciones específicas
- **Servicios Incluidos**: Lista detallada de servicios
- **Productos Incluidos**: Equipos, consumibles, etc.
- **Requisitos Técnicos**: Especificaciones técnicas principales
- **Exclusiones**: Qué NO está incluido
- **Duración**: Plazo base del contrato
- **Fechas**: Inicio y fin previsto
- **Prórrogas**: Número máximo, duración, condiciones
- **Modificaciones**: Porcentaje máximo, casos permitidos

## 3. CRONOGRAMA Y PLAZOS
Extrae TODAS las fechas importantes:
- Fecha límite para presentar ofertas
- Fecha de apertura de sobres
- Plazo de adjudicación
- Fecha de inicio de ejecución

## 4. ANÁLISIS ECONÓMICO DETALLADO
- **Presupuesto Base de Licitación** (sin IVA)
- **Análisis de Personal**:
  - Número total de trabajadores necesarios
  - Desglose por puesto (técnicos, ingenieros, etc.)
  - Perfil requerido para cada puesto
  - Dedicación (completa/parcial)
  - Coste salarial estimado por puesto
- **Análisis de Compras**:
  - Equipamiento inicial necesario
  - Consumibles anuales
  - Repuestos y mantenimiento
- **Subcontrataciones**:
  - Servicios que se pueden externalizar
  - Límites de subcontratación
  - Coste estimado
- **Otros Gastos**:
  - Seguros obligatorios
  - Gastos generales
  - Costes indirectos

## 5. CRITERIOS DE ADJUDICACIÓN (SECCIÓN CRÍTICA)
- **Puntuación Económica**: Puntos máximos para oferta económica
- **Puntuación Técnica**: Puntos máximos para aspectos técnicos
- **Fórmulas Matemáticas** - Para CADA fórmula encontrada:
  - Nombre descriptivo de la fórmula
  - Tipo (económica/técnica/mejora/penalización/umbral)
  - Fórmula original exacta del documento
  - Representación en LaTeX
  - Descripción de cada variable
  - Condiciones lógicas de aplicación
  - Ejemplo práctico de aplicación
- **Variables de Fórmula**: Para la fórmula económica principal:
  - Identificar cada variable (ej: "Plic", "Oferta_i")
  - Descripción de qué representa
  - Mapeo a conceptos estándar
  - Valores de ejemplo
- **AST de Fórmula Principal**: Convertir a formato evaluable
- **Baja Temeraria**:
  - Descripción del umbral
  - Porcentaje específico
  - Fórmula de cálculo
  - Procedimiento de verificación
- **Criterios Automáticos**: Criterios verificables objetivamente
- **Criterios Subjetivos**: Criterios que requieren valoración
- **Otros Criterios**: Mejoras, bonificaciones, etc.

**FORMATO DE RESPUESTA:**
Proporciona ÚNICAMENTE un objeto JSON válido con la estructura CostAnalysisData. Incluye TODOS los campos, aunque algunos estén vacíos usa arrays vacíos [] o strings "No especificado".

**CALIDAD PROFESIONAL:**
- Estimaciones realistas basadas en el mercado español de electromedicina
- Terminología técnica apropiada del sector sanitario
- Enfoque orientado a toma de decisiones empresariales
- Consideración de normativa española de contratación pública

IMPORTANTE: Si encuentras información en uno de los documentos pero no en el otro, inclúyela igualmente. Analiza AMBOS documentos completamente.
`;

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<CostAnalysisData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    
    try {
      console.log('🤖 === INICIANDO ANÁLISIS PROFESIONAL DE COSTES CON GEMINI FLASH 2.5 ===');
      console.log('📄 Preparando archivos para análisis...');
      
      const pcapBase64 = await fileToBase64(pcapFile);
      const pptBase64 = await fileToBase64(pptFile);
      
      console.log('📊 ARCHIVOS PROCESADOS:');
      console.log(`  📋 PCAP: ${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`  📋 PPT: ${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log('  ✅ Archivos convertidos a Base64 exitosamente');

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
      };

      console.log('🚀 ENVIANDO SOLICITUD A GEMINI FLASH 2.5 API...');
      console.log('  📡 URL:', GEMINI_API_URL);
      console.log('  ⚙️ Configuración: temperature=0.1, maxTokens=8192');

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 RESPUESTA RECIBIDA DE GEMINI FLASH 2.5:');
      console.log(`  📊 Status: ${response.status} ${response.statusText}`);
      console.log(`  📏 Tamaño de respuesta: ${response.headers.get('content-length') || 'desconocido'} bytes`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ ERROR DE GEMINI FLASH 2.5 API:', errorData);
        throw new Error(`Error de Gemini Flash 2.5 API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ RESPUESTA JSON RECIBIDA Y PARSEADA');

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ ESTRUCTURA DE RESPUESTA INVÁLIDA:', JSON.stringify(data, null, 2));
        throw new Error('Respuesta inválida de Gemini Flash 2.5 API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 CONTENIDO DE RESPUESTA EXTRAÍDO:');
      console.log(`  📏 Longitud del texto: ${responseText.length} caracteres`);
      console.log(`  🔤 Primeros 200 caracteres: ${responseText.substring(0, 200)}...`);
      
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
        
        console.log('🔧 PROCESANDO RESPUESTA JSON:');
        console.log(`  ✂️ JSON limpiado, longitud: ${cleanedResponse.length} caracteres`);
        
        const parsedResult: CostAnalysisData = JSON.parse(cleanedResponse);
        
        console.log('🎉 === ANÁLISIS COMPLETADO EXITOSAMENTE CON GEMINI FLASH 2.5 ===');
        console.log('📊 RESUMEN DEL ANÁLISIS RECIBIDO:');
        console.log(`  🏢 Entidad: ${parsedResult.informacionGeneral?.entidadContratante || 'No especificada'}`);
        console.log(`  📋 Tipo: ${parsedResult.informacionGeneral?.tipoLicitacion || 'No especificado'}`);
        console.log(`  💰 Presupuesto: ${parsedResult.analisisEconomico?.presupuestoBaseLicitacion || 'No especificado'}`);
        console.log(`  📦 Lotes: ${parsedResult.informacionGeneral?.lotes?.length || 0}`);
        console.log(`  🎯 Criterios automáticos: ${parsedResult.criteriosAdjudicacion?.criteriosAutomaticos?.length || 0}`);
        console.log(`  🔍 Criterios subjetivos: ${parsedResult.criteriosAdjudicacion?.criteriosSubjetivos?.length || 0}`);
        console.log(`  🧮 Fórmulas detectadas: ${parsedResult.criteriosAdjudicacion?.formulasMatematicas?.length || 0}`);
        
        // Log del JSON completo para debug (solo en desarrollo)
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 JSON COMPLETO RECIBIDO:', JSON.stringify(parsedResult, null, 2));
        }
        
        return parsedResult;
      } catch (parseError) {
        console.error('❌ ERROR PARSEANDO ANÁLISIS PROFESIONAL:', parseError);
        console.error('📄 Texto de respuesta completo:', responseText);
        throw new Error(`Error en análisis: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`);
      }

    } catch (error) {
      console.error('❌ === ERROR CRÍTICO EN ANÁLISIS ===');
      console.error('🚨 Detalles del error:', error);
      throw error;
    }
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      console.log('🚀 === INICIANDO ANÁLISIS PROFESIONAL DE COSTES ===');
      console.log('🔍 Validando archivos de entrada...');
      
      if (!pcapFile || !pptFile) {
        throw new Error('Ambos archivos (PCAP y PPT) son requeridos para el análisis');
      }
      
      if (pcapFile.type !== 'application/pdf' || pptFile.type !== 'application/pdf') {
        throw new Error('Los archivos deben ser PDFs válidos');
      }
      
      console.log('✅ Archivos validados correctamente');
      console.log(`📋 PCAP: ${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`📋 PPT: ${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`);
      
      const analysis = await callGeminiAPI(pcapFile, pptFile);
      setAnalysisResult(analysis);
      
      console.log('🎉 === ANÁLISIS COMPLETADO Y GUARDADO ===');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el análisis';
      setError(errorMessage);
      console.error('❌ === ERROR EN ANÁLISIS PROFESIONAL ===');
      console.error('🚨 Mensaje de error:', errorMessage);
      console.error('🔍 Detalles completos:', err);
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
