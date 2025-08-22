
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
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setTotalSteps(6);
    setCurrentProgress('Iniciando análisis con Gemini AI...');
    
    try {
      console.log('🔍 Iniciando análisis real de costes con Gemini AI...');
      console.log('📄 Archivos:', {
        pcap: `${pcapFile.name} (${(pcapFile.size / 1024 / 1024).toFixed(2)} MB)`,
        ppt: `${pptFile.name} (${(pptFile.size / 1024 / 1024).toFixed(2)} MB)`
      });

      // Extraer texto real de los archivos PDF
      setCurrentProgress('Extrayendo texto de los archivos PDF...');
      console.log('📄 Extrayendo texto real de los PDFs...');
      
      const pcapText = await extractTextFromPDF(pcapFile);
      const pptText = await extractTextFromPDF(pptFile);

      console.log('✅ Texto extraído:', {
        pcapLength: pcapText.length,
        pptLength: pptText.length,
        pcapPreview: pcapText.substring(0, 200) + '...',
        pptPreview: pptText.substring(0, 200) + '...'
      });

      if (!pcapText.trim() || !pptText.trim()) {
        throw new Error('No se pudo extraer texto de los archivos PDF. Verifica que los archivos no estén corruptos.');
      }

      const stepResults: any[] = [];

      // Ejecutar análisis paso a paso con la API real de Gemini
      for (let step = 1; step <= totalSteps; step++) {
        try {
          setCurrentStep(step);
          setCurrentProgress(`Analizando paso ${step}/${totalSteps} con Gemini AI...`);
          console.log(`🔄 Ejecutando paso real ${step}/${totalSteps} con Gemini AI...`);
          
          const stepResult = await analyzeDocumentsStep(pcapText, pptText, step, totalSteps);
          stepResults.push(stepResult);
          
          console.log(`✅ Paso ${step} completado con Gemini AI:`, stepResult);
          
          // Esperar entre pasos para evitar rate limiting
          if (step < totalSteps) {
            const waitTime = Math.floor(Math.random() * 3) + 3; // Entre 3 y 5 segundos
            console.log(`⏳ Esperando ${waitTime}s antes del siguiente paso...`);
            setCurrentProgress(`Esperando ${waitTime}s antes del paso ${step + 1}...`);
            await wait(waitTime);
          }
          
        } catch (stepError) {
          console.error(`❌ Error en paso ${step} con Gemini AI:`, stepError);
          // Continuar con estructura vacía en caso de error
          stepResults.push({});
        }
      }

      // Combinar todos los resultados
      console.log('🔧 Combinando resultados de Gemini AI...');
      setCurrentProgress('Generando informe final...');
      
      const finalResult = mergeStepResults(...stepResults);
      
      console.log('✅ Análisis con Gemini AI completado exitosamente');
      console.log('📊 Resultado final:', finalResult);
      
      setAnalysisResult(finalResult);
      setCurrentProgress('Análisis completado con éxito');
      
    } catch (err) {
      console.error('❌ Error final en análisis con Gemini AI:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el análisis con Gemini AI';
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
