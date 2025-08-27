
// Este archivo mantiene la funcionalidad existente para compatibilidad
// pero la lógica principal se ha movido al hook useCostAnalysis

export interface ReportData {
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

// Función de compatibilidad que redirige al hook principal
export const analyzeDocumentsWithQwen = async (
  pcapFile: File, 
  pptFile: File, 
  step: number, 
  totalSteps: number
): Promise<any> => {
  console.log(`🔄 Redirigiendo análisis al nuevo sistema con Gemini (paso ${step}/${totalSteps})`);
  
  // Esta función ahora es solo para compatibilidad
  // La lógica real está en useCostAnalysis hook
  return {
    presupuestoGeneral: "No especificado",
    esPorLotes: false,
    lotes: [],
    variablesDinamicas: [],
    formulaEconomica: "No especificada",
    formulasDetectadas: [],
    umbralBajaTemeraria: "No especificado",
    criteriosAutomaticos: [],
    criteriosSubjetivos: [],
    otrosCriterios: [],
    costesDetalladosRecomendados: []
  };
};

export const mergeStepResults = (...stepResults: any[]): ReportData => {
  console.log('🔄 Función de merge legacy - usando nuevo sistema');
  
  return {
    presupuestoGeneral: "No especificado",
    esPorLotes: false,
    lotes: [],
    variablesDinamicas: [],
    formulaEconomica: "No especificada",
    formulasDetectadas: [],
    umbralBajaTemeraria: "No especificado",
    criteriosAutomaticos: [],
    criteriosSubjetivos: [],
    otrosCriterios: [],
    costesDetalladosRecomendados: []
  };
};
