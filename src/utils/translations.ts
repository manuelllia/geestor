export type Language = 'es' | 'en';

export interface Translations {
  home: string;
  maintenanceCalendar: string;
  costAnalysis: string;
  settings: string;
  language: string;
  selectLanguage: string;
  spanish: string;
  english: string;
  uploadInventory: string;
  uploadPlanning: string;
  selectFile: string;
  upload: string;
  analyzeSheets: string;
  sheetName: string;
  sheetType: string;
  rowCount: string;
  columns: string;
  preview: string;
  selected: string;
  inventory: string;
  planning: string;
  other: string;
  processSelectedSheets: string;
  generatingCalendar: string;
  equipmentTypes: string;
  equipmentCount: string;
  edit: string;
  maintenanceType: string;
  frequency: string;
  estimatedTime: string;
  addMaintenance: string;
  save: string;
  cancel: string;
  generateCalendar: string;
  loading: string;
  missingMaintenanceTitle: string;
  missingMaintenanceDescription: string;
  generateAnyway: string;
  close: string;
  noFileSelected: string;
  errorProcessingFile: string;
  success: string;
  error: string;
  successMessage: string;
  errorMessage: string;
  uploadPCAP: string;
  uploadPPT: string;
  analyzeCosts: string;
  analysisResults: string;
  isByLots: string;
  lots: string;
  name: string;
  associatedCenter: string;
  description: string;
  budget: string;
  keyRequirements: string;
  dynamicVariables: string;
  variableName: string;
  variableDescription: string;
  mapping: string;
  economicFormula: string;
  formulasDetected: string;
  originalFormula: string;
  latexRepresentation: string;
  variableDescriptions: string;
  logicalConditions: string;
  abnormallyLowThreshold: string;
  automaticCriteria: string;
  subjectiveCriteria: string;
  otherCriteria: string;
  maximumScore: string;
  generalBudget: string;
  recommendedDetailedCosts: string;
  suggestMaintenances: string;
  suggestionsFound: string;
  applyingSuggestions: string;
  suggestionsApplied: string;
  alreadyExists: string;
  selectAll: string;
  deselectAll: string;
  applySuggestions: string;
  suggestionsReviewTitle: string;
  suggestionsReviewDescription: string;
  analyzing: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    home: 'Inicio',
    maintenanceCalendar: 'Calendario de Mantenimiento',
    costAnalysis: 'Análisis de Costes',
    settings: 'Configuración',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma',
    spanish: 'Español',
    english: 'Inglés',
    uploadInventory: 'Cargar Inventario',
    uploadPlanning: 'Cargar Planificación',
    selectFile: 'Seleccionar Archivo',
    upload: 'Cargar',
    analyzeSheets: 'Analizar Hojas',
    sheetName: 'Nombre de la Hoja',
    sheetType: 'Tipo de Hoja',
    rowCount: 'Número de Filas',
    columns: 'Columnas',
    preview: 'Vista Previa',
    selected: 'Seleccionado',
    inventory: 'Inventario',
    planning: 'Planificación',
    other: 'Otro',
    processSelectedSheets: 'Procesar Hojas Seleccionadas',
    generatingCalendar: 'Generando Calendario',
    equipmentTypes: 'Tipos de Equipos',
    equipmentCount: 'Cantidad de Equipos',
    edit: 'Editar',
    maintenanceType: 'Tipo de Mantenimiento',
    frequency: 'Frecuencia',
    estimatedTime: 'Tiempo Estimado',
    addMaintenance: 'Añadir Mantenimiento',
    save: 'Guardar',
    cancel: 'Cancelar',
    generateCalendar: 'Generar Calendario',
    loading: 'Cargando...',
    missingMaintenanceTitle: 'Mantenimientos Incompletos',
    missingMaintenanceDescription: 'Algunos equipos no tienen todos los mantenimientos definidos. ¿Desea generar el calendario de todas formas?',
    generateAnyway: 'Generar De Todas Formas',
    close: 'Cerrar',
    noFileSelected: 'No se ha seleccionado ningún archivo',
    errorProcessingFile: 'Error al procesar el archivo',
    success: 'Éxito',
    error: 'Error',
    successMessage: 'Archivo procesado correctamente',
    errorMessage: 'Hubo un error al procesar el archivo',
    uploadPCAP: 'Cargar PCAP',
    uploadPPT: 'Cargar PPT',
    analyzeCosts: 'Analizar Costes',
    analysisResults: 'Resultados del Análisis',
    isByLots: 'Es por Lotes',
    lots: 'Lotes',
    name: 'Nombre',
    associatedCenter: 'Centro Asociado',
    description: 'Descripción',
    budget: 'Presupuesto',
    keyRequirements: 'Requisitos Clave',
    dynamicVariables: 'Variables Dinámicas',
    variableName: 'Nombre de la Variable',
    variableDescription: 'Descripción de la Variable',
    mapping: 'Mapeo',
    economicFormula: 'Fórmula Económica',
    formulasDetected: 'Fórmulas Detectadas',
    originalFormula: 'Fórmula Original',
    latexRepresentation: 'Representación LaTeX',
    variableDescriptions: 'Descripciones de Variables',
    logicalConditions: 'Condiciones Lógicas',
    abnormallyLowThreshold: 'Umbral de Baja Temeraria',
    automaticCriteria: 'Criterios Automáticos',
    subjectiveCriteria: 'Criterios Subjetivos',
    otherCriteria: 'Otros Criterios',
    maximumScore: 'Puntuación Máxima',
    generalBudget: 'Presupuesto General',
    recommendedDetailedCosts: 'Costes Detallados Recomendados',
    suggestMaintenances: 'Sugerir Mantenimientos',
    suggestionsFound: 'Sugerencias Encontradas',
    applyingSuggestions: 'Aplicando sugerencias...',
    suggestionsApplied: 'Sugerencias aplicadas exitosamente',
    alreadyExists: 'Ya existe este mantenimiento',
    selectAll: 'Seleccionar Todo',
    deselectAll: 'Deseleccionar Todo',
    applySuggestions: 'Aplicar Sugerencias',
    suggestionsReviewTitle: 'Revisar Sugerencias de IA',
    suggestionsReviewDescription: 'Se encontraron sugerencias de mantenimiento. Revisa y selecciona las que desees aplicar.',
    analyzing: 'Analizando...'
  },
  en: {
    home: 'Home',
    maintenanceCalendar: 'Maintenance Calendar',
    costAnalysis: 'Cost Analysis',
    settings: 'Settings',
    language: 'Language',
    selectLanguage: 'Select Language',
    spanish: 'Spanish',
    english: 'English',
    uploadInventory: 'Upload Inventory',
    uploadPlanning: 'Upload Planning',
    selectFile: 'Select File',
    upload: 'Upload',
    analyzeSheets: 'Analyze Sheets',
    sheetName: 'Sheet Name',
    sheetType: 'Sheet Type',
    rowCount: 'Row Count',
    columns: 'Columns',
    preview: 'Preview',
    selected: 'Selected',
    inventory: 'Inventory',
    planning: 'Planning',
    other: 'Other',
    processSelectedSheets: 'Process Selected Sheets',
    generatingCalendar: 'Generating Calendar',
    equipmentTypes: 'Equipment Types',
    equipmentCount: 'Equipment Count',
    edit: 'Edit',
    maintenanceType: 'Maintenance Type',
    frequency: 'Frequency',
    estimatedTime: 'Estimated Time',
    addMaintenance: 'Add Maintenance',
    save: 'Save',
    cancel: 'Cancel',
    generateCalendar: 'Generate Calendar',
    loading: 'Loading...',
    missingMaintenanceTitle: 'Missing Maintenance',
    missingMaintenanceDescription: 'Some equipments do not have all maintenances defined. Do you want to generate the calendar anyway?',
    generateAnyway: 'Generate Anyway',
    close: 'Close',
    noFileSelected: 'No file has been selected',
    errorProcessingFile: 'Error processing file',
    success: 'Success',
    error: 'Error',
    successMessage: 'File processed successfully',
    errorMessage: 'There was an error processing the file',
    uploadPCAP: 'Upload PCAP',
    uploadPPT: 'Upload PPT',
    analyzeCosts: 'Analyze Costs',
    analysisResults: 'Analysis Results',
    isByLots: 'Is By Lots',
    lots: 'Lots',
    name: 'Name',
    associatedCenter: 'Associated Center',
    description: 'Description',
    budget: 'Budget',
    keyRequirements: 'Key Requirements',
    dynamicVariables: 'Dynamic Variables',
    variableName: 'Variable Name',
    variableDescription: 'Variable Description',
    mapping: 'Mapping',
    economicFormula: 'Economic Formula',
    formulasDetected: 'Detected Formulas',
    originalFormula: 'Original Formula',
    latexRepresentation: 'LaTeX Representation',
    variableDescriptions: 'Variable Descriptions',
    logicalConditions: 'Logical Conditions',
    abnormallyLowThreshold: 'Abnormally Low Threshold',
    automaticCriteria: 'Automatic Criteria',
    subjectiveCriteria: 'Subjective Criteria',
    otherCriteria: 'Other Criteria',
    maximumScore: 'Maximum Score',
    generalBudget: 'General Budget',
    recommendedDetailedCosts: 'Recommended Detailed Costs',
    suggestMaintenances: 'Suggest Maintenances',
    suggestionsFound: 'Suggestions Found',
    applyingSuggestions: 'Applying suggestions...',
    suggestionsApplied: 'Suggestions applied successfully',
    alreadyExists: 'This maintenance already exists',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    applySuggestions: 'Apply Suggestions',
    suggestionsReviewTitle: 'Review AI Suggestions',
    suggestionsReviewDescription: 'Maintenance suggestions found. Review and select the ones you want to apply.',
    analyzing: 'Analyzing...'
  }
};
