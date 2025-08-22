
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
    setTotalSteps(6); // Aumentamos a 6 pasos para mayor granularidad
    setCurrentProgress('Iniciando análisis optimizado con Gemini 2.0 Flash...');
    
    try {
      console.log('🔍 Iniciando análisis de costes optimizado con Gemini 2.0 Flash...');
      console.log('📄 Archivos:', {
        pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
        ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
      });

      // Convertir archivos a texto
      setCurrentProgress('Procesando archivos PDF...');
      const pcapText = await convertFileToText(pcapFile);
      const pptText = await convertFileToText(pptFile);

      const stepResults: any[] = [];

      // Ejecutar análisis paso a paso optimizado
      for (let step = 1; step <= totalSteps; step++) {
        try {
          setCurrentStep(step);
          setCurrentProgress(`Analizando paso ${step}/${totalSteps} con IA optimizada...`);
          console.log(`🔄 Ejecutando paso optimizado ${step}/${totalSteps}...`);
          
          const stepResult = await analyzeDocumentsStep(pcapText, pptText, step, totalSteps);
          stepResults.push(stepResult);
          
          console.log(`✅ Paso ${step} completado:`, stepResult);
          
          // Esperar entre pasos para evitar rate limiting (tiempo reducido)
          if (step < totalSteps) {
            const waitTime = Math.floor(Math.random() * 2) + 2; // Entre 2 y 3 segundos
            console.log(`⏳ Esperando ${waitTime}s antes del siguiente paso...`);
            setCurrentProgress(`Esperando ${waitTime}s antes del paso ${step + 1}...`);
            await wait(waitTime);
          }
          
        } catch (stepError) {
          console.error(`❌ Error en paso ${step}:`, stepError);
          // Continuar con estructura vacía en caso de error
          stepResults.push({});
        }
      }

      // Combinar todos los resultados
      console.log('🔧 Combinando resultados optimizados...');
      setCurrentProgress('Generando informe final optimizado...');
      
      const finalResult = mergeStepResults(...stepResults);
      
      console.log('✅ Análisis optimizado completado exitosamente');
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
