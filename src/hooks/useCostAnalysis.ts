
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
Actúas como el más prestigioso analista especializado en licitaciones públicas de electromedicina en España, con más de 25 años de experiencia analizando contratos del Sistema Nacional de Salud. Tu reputación se basa en la exhaustividad y precisión de tus análisis.

**INSTRUCCIONES CRÍTICAS PARA EL ANÁLISIS COMPLETO:**

1. **ANÁLISIS DOCUMENTAL COMPLETO**: Debes extraer TODA la información disponible tanto del PCAP como del PPT. No omitas ningún dato relevante.

2. **IDIOMA Y FORMATO**: Responde ÚNICAMENTE en ESPAÑOL. La salida debe ser EXCLUSIVAMENTE un JSON válido con la estructura CostAnalysisData.

3. **NIVEL DE EXHAUSTIVIDAD**: Es preferible incluir información incompleta o aproximada que omitirla. Si un dato no está explícito, haz una estimación profesional basada en tu experiencia.

**ESTRUCTURA DE ANÁLISIS DETALLADA:**

## 1. INFORMACIÓN GENERAL DE LA LICITACIÓN
- **Tipo de Licitación**: Determina si es licitación única o dividida en lotes (examina índices y estructura)
- **Objeto del Contrato**: Descripción completa y detallada del servicio/suministro
- **Entidad Contratante**: Organismo completo (incluye comunidad autónoma, servicio de salud, etc.)
- **Código CPV**: Busca códigos de clasificación completos
- **Lotes Detallados**: Para CADA lote extrae:
  - Nombre completo del lote
  - Centros/hospitales asociados (lista completa)
  - Descripción técnica específica
  - Presupuesto exacto del lote
  - Requisitos técnicos clave específicos

## 2. ALCANCE Y CONDICIONES DEL CONTRATO
- **Ámbito Geográfico**: Localización exacta, provincias, comunidades autónomas
- **Servicios Incluidos**: Lista COMPLETA de todos los servicios (mantenimiento preventivo, correctivo, etc.)
- **Productos Incluidos**: TODOS los equipos, consumibles, repuestos especificados
- **Requisitos Técnicos**: TODAS las especificaciones técnicas fundamentales
- **Exclusiones**: TODO lo que NO está incluido en el contrato
- **Duración**: Plazo base exacto en meses/años
- **Fechas**: Inicio y fin previsto con fechas específicas
- **Prórrogas**: Número máximo, duración de cada una, condiciones exactas
- **Modificaciones**: Porcentaje máximo permitido, casos específicos de modificación

## 3. CRONOGRAMA Y PLAZOS CRÍTICOS
Extrae TODAS las fechas mencionadas:
- Fecha límite para presentar ofertas (busca en convocatoria)
- Fecha de apertura de sobres (administrativa y económica)
- Plazo máximo de adjudicación
- Fecha prevista de inicio de ejecución
- Cualquier otra fecha relevante del proceso

## 4. ANÁLISIS ECONÓMICO EXHAUSTIVO
- **Presupuesto Base**: Valor exacto sin IVA (busca en resumen económico)
- **Desglose de Personal COMPLETO**:
  - Número TOTAL de trabajadores requeridos
  - Desglose DETALLADO por cada puesto especificado
  - Perfiles profesionales exactos requeridos
  - Dedicación (jornada completa/parcial, porcentajes)
  - Estimación de costes salariales por puesto y totales
- **Análisis de Compras DETALLADO**:
  - Equipamiento inicial necesario (descripción y coste)
  - Consumibles anuales estimados
  - Repuestos y piezas de recambio
- **Subcontrataciones COMPLETAS**:
  - TODOS los servicios externalizables permitidos
  - Límites exactos de subcontratación (%)
  - Coste estimado de subcontrataciones
- **Otros Gastos ESPECÍFICOS**:
  - Seguros obligatorios (tipos y importes)
  - Gastos generales (porcentajes y importes)
  - Costes indirectos estimados

## 5. CRITERIOS DE ADJUDICACIÓN (SECCIÓN CRÍTICA - MÁXIMO DETALLE)
- **Puntuación Económica**: Puntos máximos EXACTOS para oferta económica
- **Puntuación Técnica**: Puntos máximos EXACTOS para aspectos técnicos
- **TODAS las Fórmulas Matemáticas**: Busca y extrae CADA fórmula:
  - Fórmula económica principal
  - Fórmulas de penalización
  - Fórmulas de bonificación
  - Fórmulas de mejoras
  - Cualquier otra fórmula matemática
  
  Para CADA fórmula proporciona:
  - Nombre descriptivo preciso
  - Tipo exacto (económica/técnica/mejora/penalización/umbral)
  - Fórmula original EXACTA tal como aparece
  - Representación en LaTeX clara
  - Descripción DETALLADA de cada variable
  - Condiciones lógicas exactas de aplicación
  - Ejemplo numérico de aplicación

- **Variables de Fórmula Principal**: Para la fórmula económica:
  - Identifica CADA variable (Plic, Oferta_i, etc.)
  - Descripción exacta de qué representa
  - Mapeo a conceptos estándar
  - Valores ejemplo realistas

- **AST de Fórmula**: Convierte la fórmula principal a formato evaluable

- **Baja Temeraria COMPLETA**:
  - Descripción exacta del concepto
  - Umbral porcentual específico
  - Fórmula de cálculo exacta
  - Procedimiento completo de verificación

- **Criterios Automáticos EXHAUSTIVOS**: TODOS los criterios objetivos:
  - Nombre exacto de cada criterio
  - Descripción completa
  - Puntuación máxima asignada
  - Método de verificación
  - Documentación requerida

- **Criterios Subjetivos COMPLETOS**: TODOS los criterios de valoración:
  - Nombre exacto de cada criterio
  - Descripción detallada de evaluación
  - Puntuación máxima
  - Aspectos específicos a evaluar
  - Criterios de calificación

- **Otros Criterios**: Mejoras, bonificaciones, penalizaciones adicionales

**DIRECTRICES DE CALIDAD PROFESIONAL:**
- Utiliza terminología técnica precisa del sector sanitario español
- Proporciona estimaciones económicas realistas basadas en mercado actual
- Considera normativa española de contratación pública vigente
- Si encuentras información en un documento pero no en otro, inclúyela
- Todos los importes en euros, sin decimales innecesarios
- Fechas en formato español (dd/mm/yyyy o "dd de mes de yyyy")

**FORMATO DE RESPUESTA OBLIGATORIO:**
Responde ÚNICAMENTE con un objeto JSON válido que siga exactamente la estructura CostAnalysisData. NO incluyas texto adicional, explicaciones o comentarios fuera del JSON. Si un campo no tiene información disponible, usa "No especificado" para strings o arrays vacíos [] según corresponda.

RECUERDA: Tu reputación profesional depende de la exhaustividad y precisión de este análisis. No omitas información disponible en los documentos.
`;

  const callGeminiAPI = async (pcapFile: File, pptFile: File): Promise<CostAnalysisData> => {
    const GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    try {
      console.log('🤖 === INICIANDO ANÁLISIS PROFESIONAL EXHAUSTIVO ===');
      console.log('📄 Preparando documentos para análisis completo...');
      
      const pcapBase64 = await fileToBase64(pcapFile);
      const pptBase64 = await fileToBase64(pptFile);
      
      console.log('📊 ARCHIVOS PROCESADOS PARA ANÁLISIS:');
      console.log(`  📋 PCAP: ${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`  📋 PPT: ${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log('  ✅ Conversión a Base64 completada exitosamente');

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
          temperature: 0.05,
          topK: 10,
          topP: 0.7,
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

      console.log('🚀 ENVIANDO SOLICITUD OPTIMIZADA A GEMINI API...');
      console.log('  📡 Endpoint:', GEMINI_API_URL);
      console.log('  ⚙️ Configuración optimizada: temp=0.05, maxTokens=8192, JSON estricto');
      console.log('  📦 Tamaño de payload:', Math.round(JSON.stringify(requestBody).length / 1024), 'KB');

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 RESPUESTA RECIBIDA DE GEMINI API:');
      console.log(`  📊 Status HTTP: ${response.status} ${response.statusText}`);
      console.log(`  📏 Content-Length: ${response.headers.get('content-length') || 'desconocido'} bytes`);
      console.log(`  ⏱️ Tiempo de respuesta: ${new Date().toISOString()}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ ERROR CRÍTICO DE GEMINI API:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          timestamp: new Date().toISOString()
        });
        throw new Error(`Error crítico de Gemini API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ RESPUESTA JSON PARSEADA CORRECTAMENTE');
      console.log('🔍 ESTRUCTURA DE RESPUESTA:', {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates?.length || 0,
        hasContent: !!data.candidates?.[0]?.content,
        partsLength: data.candidates?.[0]?.content?.parts?.length || 0
      });

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ ESTRUCTURA DE RESPUESTA INVÁLIDA:', JSON.stringify(data, null, 2));
        throw new Error('Estructura de respuesta inválida de Gemini API - faltan candidates o content');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 CONTENIDO DE ANÁLISIS EXTRAÍDO:');
      console.log(`  📏 Longitud del texto: ${responseText.length} caracteres`);
      console.log(`  🔤 Primeros 200 caracteres: ${responseText.substring(0, 200)}...`);
      console.log(`  🔤 Últimos 100 caracteres: ...${responseText.substring(responseText.length - 100)}`);
      
      try {
        // Limpieza más agresiva del JSON
        let cleanedResponse = responseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/^\s*[\n\r]/, '')
          .trim();
        
        // Buscar el JSON válido
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
          console.error('❌ NO SE ENCONTRÓ JSON VÁLIDO EN LA RESPUESTA');
          throw new Error('No se pudo encontrar JSON válido en la respuesta de Gemini');
        }
        
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        
        console.log('🔧 PROCESANDO RESPUESTA JSON:');
        console.log(`  ✂️ JSON extraído y limpiado, longitud: ${cleanedResponse.length} caracteres`);
        console.log(`  🧪 Validando estructura JSON...`);
        
        const parsedResult: CostAnalysisData = JSON.parse(cleanedResponse);
        
        console.log('🎉 === ANÁLISIS COMPLETADO CON ÉXITO ===');
        console.log('📊 RESUMEN EJECUTIVO DEL ANÁLISIS:');
        console.log(`  🏢 Entidad Contratante: ${parsedResult.informacionGeneral?.entidadContratante || 'No especificada'}`);
        console.log(`  📋 Tipo de Licitación: ${parsedResult.informacionGeneral?.tipoLicitacion || 'No especificado'}`);
        console.log(`  💰 Presupuesto Base: ${parsedResult.analisisEconomico?.presupuestoBaseLicitacion || 'No especificado'}`);
        console.log(`  📦 Número de Lotes: ${parsedResult.informacionGeneral?.lotes?.length || 0}`);
        console.log(`  👥 Personal Requerido: ${parsedResult.analisisEconomico?.personal?.numeroTrabajadores || 0} trabajadores`);
        console.log(`  🎯 Criterios Automáticos: ${parsedResult.criteriosAdjudicacion?.criteriosAutomaticos?.length || 0}`);
        console.log(`  🔍 Criterios Subjetivos: ${parsedResult.criteriosAdjudicacion?.criteriosSubjetivos?.length || 0}`);
        console.log(`  🧮 Fórmulas Matemáticas: ${parsedResult.criteriosAdjudicacion?.formulasMatematicas?.length || 0}`);
        console.log(`  💡 Puntuación Económica: ${parsedResult.criteriosAdjudicacion?.puntuacionMaximaEconomica || 0} puntos`);
        console.log(`  🔬 Puntuación Técnica: ${parsedResult.criteriosAdjudicacion?.puntuacionMaximaTecnica || 0} puntos`);
        
        // Log detallado para debug en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 === ANÁLISIS JSON COMPLETO ===');
          console.log(JSON.stringify(parsedResult, null, 2));
          console.log('🔍 === FIN ANÁLISIS COMPLETO ===');
        }
        
        // Validaciones adicionales
        if (parsedResult.informacionGeneral?.lotes && parsedResult.informacionGeneral.lotes.length > 0) {
          console.log('📦 DETALLES DE LOTES DETECTADOS:');
          parsedResult.informacionGeneral.lotes.forEach((lote, index) => {
            console.log(`  Lote ${index + 1}: ${lote.nombre} - ${lote.presupuesto}`);
          });
        }
        
        if (parsedResult.criteriosAdjudicacion?.formulasMatematicas && parsedResult.criteriosAdjudicacion.formulasMatematicas.length > 0) {
          console.log('🧮 FÓRMULAS MATEMÁTICAS DETECTADAS:');
          parsedResult.criteriosAdjudicacion.formulasMatematicas.forEach((formula, index) => {
            console.log(`  Fórmula ${index + 1}: ${formula.nombre} (${formula.tipo})`);
          });
        }
        
        return parsedResult;
      } catch (parseError) {
        console.error('❌ === ERROR CRÍTICO EN PARSEO DEL ANÁLISIS ===');
        console.error('🚨 Detalles del error de parseo:', parseError);
        console.error('📄 Respuesta completa que causó el error:');
        console.error(responseText);
        console.error('💡 Sugerencia: Verificar formato de salida de Gemini API');
        throw new Error(`Error crítico en análisis JSON: ${parseError instanceof Error ? parseError.message : 'Error de parseo desconocido'}`);
      }

    } catch (error) {
      console.error('❌ === ERROR CRÍTICO EN PROCESO DE ANÁLISIS ===');
      console.error('🚨 Tipo de error:', error instanceof Error ? error.constructor.name : 'Unknown');
      console.error('📝 Mensaje de error:', error instanceof Error ? error.message : 'Error desconocido');
      console.error('🔍 Stack trace completo:', error);
      console.error('⏱️ Timestamp del error:', new Date().toISOString());
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
