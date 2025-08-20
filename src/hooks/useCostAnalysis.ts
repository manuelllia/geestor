
import { useState } from 'react';
import { analyzeDocumentsStep, mergeStepResults } from '../services/costAnalysisService';

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

  const convertFileToText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Para simplificar, retornamos el nombre del archivo como placeholder
        // En una implementación real, usarías una librería como pdf-parse
        resolve(`Contenido del archivo: ${file.name} (${file.size} bytes)`);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const wait = (seconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  };

  const analyzeCosts = async (pcapFile: File, pptFile: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setTotalSteps(5);
    setCurrentProgress('Iniciando análisis con Gemini 2.5 Flash...');
    
    try {
      console.log('🔍 Iniciando análisis de costes con Gemini 2.5 Flash...');
      console.log('📄 Archivos:', {
        pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
        ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
      });

      // Convertir archivos a texto (placeholder - en producción usarías pdf-parse)
      setCurrentProgress('Procesando archivos PDF...');
      const pcapText = await convertFileToText(pcapFile);
      const pptText = await convertFileToText(pptFile);

      const stepResults: any[] = [];

      // Ejecutar análisis paso a paso
      for (let step = 1; step <= totalSteps; step++) {
        try {
          setCurrentStep(step);
          setCurrentProgress(`Analizando paso ${step}/${totalSteps} con Gemini...`);
          console.log(`🔄 Ejecutando paso ${step}/${totalSteps} con Gemini 2.5 Flash...`);
          
          const stepResult = await analyzeDocumentsStep(pcapText, pptText, step, totalSteps);
          stepResults.push(stepResult);
          
          console.log(`✅ Paso ${step} completado exitosamente:`, stepResult);
          
          // Esperar entre 3-5 segundos entre llamadas (excepto en el último paso)
          if (step < totalSteps) {
            const waitTime = Math.floor(Math.random() * 3) + 3; // Entre 3 y 5 segundos
            console.log(`⏳ Esperando ${waitTime} segundos antes del siguiente paso...`);
            setCurrentProgress(`Esperando ${waitTime}s antes del paso ${step + 1}...`);
            await wait(waitTime);
          }
          
        } catch (stepError) {
          console.error(`❌ Error en paso ${step}:`, stepError);
          // Continuar con el siguiente paso en caso de error
          stepResults.push(null);
        }
      }

      // Combinar todos los resultados
      console.log('🔧 Combinando resultados de todos los pasos...');
      setCurrentProgress('Generando informe final...');
      
      const finalResult = mergeStepResults(...stepResults);
      
      console.log('✅ Análisis completado exitosamente');
      console.log('📊 Resultado final:', finalResult);
      
      setAnalysisResult(finalResult);
      setCurrentProgress('Análisis completado con éxito');
      
    } catch (err) {
      console.error('❌ Error final en análisis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el análisis';
      setError(errorMessage);
      setCurrentProgress('Error en el análisis');
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
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
