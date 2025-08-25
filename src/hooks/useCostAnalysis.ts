
import { useState } from 'react';
import { analyzeDocumentsStep, mergeStepResults, extractTextFromPDF } from '../services/costAnalysisService';

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

export const useCostAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentProgress, setCurrentProgress] = useState('');

  const wait = (seconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File): Promise<void> => {
    console.log('🚀 INICIO: Análisis completo de costes con Gemini AI');
    console.log('📁 Archivos recibidos:', {
      pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
      ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
    });

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setTotalSteps(6);
    setCurrentProgress('Iniciando análisis con Gemini AI...');
    
    try {
      // PASO 1: Extraer texto real de los archivos PDF
      setCurrentProgress('📄 Extrayendo texto de los archivos PDF...');
      console.log('📄 EXTRACCIÓN: Iniciando extracción de texto de PDFs...');
      
      const pcapText = await extractTextFromPDF(pcapFile);
      const pptText = await extractTextFromPDF(pptFile);

      console.log('✅ EXTRACCIÓN: Texto extraído exitosamente:', {
        pcapLength: pcapText.length,
        pptLength: pptText.length,
        pcapPreview: pcapText.substring(0, 150) + '...',
        pptPreview: pptText.substring(0, 150) + '...'
      });

      if (!pcapText.trim() || !pptText.trim()) {
        throw new Error('❌ No se pudo extraer texto de los archivos PDF. Verifica que los archivos no estén corruptos o protegidos.');
      }

      console.log('🤖 ANÁLISIS: Iniciando análisis paso a paso con Gemini AI');
      const stepResults: any[] = [];

      // EJECUTAR ANÁLISIS PASO A PASO CON GEMINI AI
      for (let step = 1; step <= totalSteps; step++) {
        try {
          setCurrentStep(step);
          setCurrentProgress(`🤖 Analizando paso ${step}/${totalSteps} con Gemini AI...`);
          console.log(`\n🔄 PASO ${step}/${totalSteps}: Iniciando análisis con Gemini AI...`);
          
          const stepResult = await analyzeDocumentsStep(pcapText, pptText, step, totalSteps);
          stepResults.push(stepResult);
          
          console.log(`✅ PASO ${step}/${totalSteps}: Completado exitosamente`);
          console.log(`📊 PASO ${step} - Resultado:`, stepResult);
          
          // Pausa entre pasos para evitar rate limiting de la API
          if (step < totalSteps) {
            const waitTime = Math.floor(Math.random() * 2) + 2; // Entre 2 y 3 segundos
            console.log(`⏳ PAUSA: Esperando ${waitTime}s antes del siguiente paso...`);
            setCurrentProgress(`⏳ Esperando ${waitTime}s antes del paso ${step + 1}...`);
            await wait(waitTime);
          }
          
        } catch (stepError) {
          console.error(`❌ ERROR PASO ${step}:`, stepError);
          // Continuar con estructura vacía para este paso
          stepResults.push({});
          
          // Mostrar error específico en el progreso
          setCurrentProgress(`⚠️ Error en paso ${step}, continuando...`);
          await wait(1); // Breve pausa antes de continuar
        }
      }

      console.log('🔧 MERGE: Iniciando combinación de todos los resultados...');
      setCurrentProgress('🔧 Generando informe final...');
      
      const finalResult = mergeStepResults(...stepResults);
      
      console.log('✅ ANÁLISIS COMPLETADO: Resultado final generado');
      console.log('📊 RESULTADO FINAL:', finalResult);
      
      setAnalysisResult(finalResult);
      setCurrentProgress('✅ Análisis completado con éxito');
      
    } catch (err) {
      console.error('❌ ERROR CRÍTICO en análisis:', err);
      
      let errorMessage = 'Error desconocido en el análisis';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('❌ Detalles del error:', {
          message: err.message,
          stack: err.stack
        });
      }
      
      setError(errorMessage);
      setCurrentProgress('❌ Error en el análisis');
      
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
      console.log('🏁 FINALIZADO: Proceso de análisis terminado');
    }
  };

  return {
    analyzeCosts,
    analysisResult,
    isLoading,
    error,
    currentStep,
    totalSteps,
    currentProgress
  };
};
