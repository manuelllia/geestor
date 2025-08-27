export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

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
  theme: string;
  light: string;
  dark: string;
  operations: string;
  costAnalysisShort: string;
  technicalManagement: string;
  technicalManagementShort: string;
  calendarManagement: string;
  calendarManagementShort: string;
  checkers: string;
  talentManagement: string;
  talentManagementShort: string;
  contractRequests: string;
  changeSheets: string;
  employeeAgreements: string;
  realEstateManagement: string;
  practiceEvaluation: string;
  exitInterviews: string;
  homeMenu: string;
  users: string;
  changeSheetsManagement: string;
  createNew: string;
  export: string;
  import: string;
  hojasCambio: string;
  employeeName: string;
  originCenter: string;
  startDate: string;
  status: string;
  actions: string;
  view: string;
  duplicateRecord: string;
  downloadPDF: string;
  back: string;
  generatedOn: string;
  documentGenerated: string;
  recordNotFound: string;
  employeeInformation: string;
  employeeLastName: string;
  position: string;
  department: string;
  agreementDetails: string;
  agreementType: string;
  endDate: string;
  salary: string;
  benefitsAndConditions: string;
  benefits: string;
  conditions: string;
  observations: string;
  employeeAgreementDetails: string;
  comingSoonTitle: string;
  comingSoonDescription: string;
  comingSoonDescriptionComprobadores: string;
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
    analyzing: 'Analizando...',

    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    
    operations: 'Operaciones',
    costAnalysisShort: 'Análisis Costes',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'Gestión Técnica',
    calendarManagement: 'Gestión de Calendario',
    calendarManagementShort: 'Calendario',
    checkers: 'Comprobadores',
    talentManagement: 'Gestión de Talento',
    talentManagementShort: 'Gestión Talento',
    contractRequests: 'Solicitudes de Contratación',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdos de Empleados',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Valoración de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    homeMenu: 'Inicio',
    users: 'Usuarios',
    
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    createNew: 'Crear Nuevo',
    export: 'Exportar',
    import: 'Importar',
    hojasCambio: 'Hojas de Cambio',
    employeeName: 'Nombre del Empleado',
    originCenter: 'Centro de Origen',
    startDate: 'Fecha de Inicio',
    status: 'Estado',
    actions: 'Acciones',
    view: 'Ver',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    
    back: 'Volver',
    generatedOn: 'Generado el',
    documentGenerated: 'Documento generado por GEESTOR',
    recordNotFound: 'Registro no encontrado',
    
    employeeInformation: 'Información del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    position: 'Puesto',
    department: 'Departamento',
    agreementDetails: 'Detalles del Acuerdo',
    agreementType: 'Tipo de Acuerdo',
    endDate: 'Fecha de Fin',
    salary: 'Salario',
    benefitsAndConditions: 'Beneficios y Condiciones',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    employeeAgreementDetails: 'Detalles del Acuerdo de Empleado',
    
    comingSoonTitle: 'Próximamente',
    comingSoonDescription: 'Esta sección estará disponible próximamente.',
    comingSoonDescriptionComprobadores: 'El módulo de Comprobadores estará disponible próximamente.'
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
    analyzing: 'Analyzing...',

    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    
    operations: 'Operations',
    costAnalysisShort: 'Cost Analysis',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'Technical Mgmt',
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendar',
    checkers: 'Checkers',
    talentManagement: 'Talent Management',
    talentManagementShort: 'Talent Mgmt',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    homeMenu: 'Home',
    users: 'Users',
    
    changeSheetsManagement: 'Change Sheets Management',
    createNew: 'Create New',
    export: 'Export',
    import: 'Import',
    hojasCambio: 'Change Sheets',
    employeeName: 'Employee Name',
    originCenter: 'Origin Center',
    startDate: 'Start Date',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    
    back: 'Back',
    generatedOn: 'Generated on',
    documentGenerated: 'Document generated by GEESTOR',
    recordNotFound: 'Record not found',
    
    employeeInformation: 'Employee Information',
    employeeLastName: 'Employee Last Name',
    position: 'Position',
    department: 'Department',
    agreementDetails: 'Agreement Details',
    agreementType: 'Agreement Type',
    endDate: 'End Date',
    salary: 'Salary',
    benefitsAndConditions: 'Benefits and Conditions',
    benefits: 'Benefits',
    conditions: 'Conditions',
    observations: 'Observations',
    employeeAgreementDetails: 'Employee Agreement Details',
    
    comingSoonTitle: 'Coming Soon',
    comingSoonDescription: 'This section will be available soon.',
    comingSoonDescriptionComprobadores: 'The Checkers module will be available soon.'
  }
};
