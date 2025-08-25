import { useState } from 'react';
import { analyzeDocumentsWithQwen, mergeStepResults } from '../services/costAnalysisService';

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
    console.log('🚀 INICIO: Análisis completo de costes con Qwen 3');
    console.log('📁 Archivos recibidos:', {
      pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
      ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
    });

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setTotalSteps(6);
    setCurrentProgress('Iniciando análisis con Qwen 3...');
    
    try {
      console.log('🤖 ANÁLISIS: Iniciando análisis paso a paso con Qwen 3');
      const stepResults: any[] = [];

      // EJECUTAR ANÁLISIS PASO A PASO CON QWEN 3
      for (let step = 1; step <= totalSteps; step++) {
        try {
          setCurrentStep(step);
          setCurrentProgress(`🤖 Analizando paso ${step}/${totalSteps} con Qwen 3...`);
          console.log(`\n🔄 PASO ${step}/${totalSteps}: Iniciando análisis con Qwen 3...`);
          
          const stepResult = await analyzeDocumentsWithQwen(pcapFile, pptFile, step, totalSteps);
          stepResults.push(stepResult);
          
          console.log(`✅ PASO ${step}/${totalSteps}: Completado exitosamente`);
          console.log(`📊 PASO ${step} - Resultado:`, stepResult);
          
          // Pausa entre pasos para evitar rate limiting de la API
          if (step < totalSteps) {
            const waitTime = Math.floor(Math.random() * 2) + 3; // Entre 3 y 4 segundos
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
          await wait(2); // Pausa antes de continuar
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
