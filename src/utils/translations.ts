// src/utils/translations.ts
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export interface Translations {
  showingRecords: string;
  search: string;
  next: string;
  previous: string;
  noRecordsFound: string;
  name: string;
  email: string;
  actions: string;
  edit: string;
  delete: string;
  add: string;
  cancel: string;
  save: string;
  confirm: string;
  create: string;
  update: string;
  import: string;
  export: string;
  duplicate: string;
  success: string;
  error: string;
  validationError: string;
  requiredFieldsError: string;
  deleteConfirmationTitle: string;
  deleteConfirmationDescription: string;
  yes: string;
  no: string;
  close: string;
  home: string;
  settings: string;
  logout: string;
  maintenance: string;
  users: string;
  roles: string;
  permissions: string;
  workCenters: string;
  equipment: string;
  inventory: string;
  processFiles: string;
  uploadFiles: string;
  upload: string;
  arrastraArchivo: string;
  formatosCsv: string;
  
  // Missing maintenance translations
  missingMaintenanceTitle: string;
  missingMaintenanceMessage: string;
  generateAnyway: string;
  completeFirst: string;
  
  // Work center modal translations
  workCenterCreatedSuccess: string;
  errorCreatingWorkCenter: string;
  workCenterUpdatedSuccess: string;
  errorUpdatingWorkCenter: string;
  createWorkCenterTitle: string;
  workCenterNameLabel: string;
  workCenterNamePlaceholder: string;
  workCenterIdLabel: string;
  workCenterIdPlaceholder: string;
  clearButton: string;
  processing: string;
  uploadCenterButton: string;
  confirmCreationTitle: string;
  confirmCreationDescription: string;
  confirmButton: string;
  workCenterExistsTitle: string;
  workCenterExistsDescription: string;
  leaveAsIsButton: string;
  updateRecordButton: string;
  
  // Practice evaluation translations
  valoPracTit: string;
  tutor: string;
  
  // Sidebar translations
  operations: string;
  costAnalysis: string;
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
  
  // Employee Agreements
  employeeName: string;
  employeeLastName: string;
  agreementType: string;
  startDate: string;
  endDate: string;
  workCenter: string;
  position: string;
  department: string;
  salary: string;
  benefits: string;
  conditions: string;
  observations: string;
  employeeInformation: string;
  agreementDetails: string;
  benefitsAndConditions: string;
  employeeAgreementDetails: string;
  
  // Exit Interviews
  exitInterviewsLoaded: string;
  errorLoadingExitInterviews: string;
  voluntary: string;
  leaveOfAbsence: string;
  linkCopiedTitle: string;
  linkCopiedDescription: string;
  errorCopyingLinkTitle: string;
  errorCopyingLinkDescription: string;
  interviewDuplicatedTitle: string;
  interviewDuplicatedDescription: string;
  errorDuplicatingTitle: string;
  errorDuplicatingDescription: string;
  confirmDeleteInterview: string;
  interviewDeletedTitle: string;
  interviewDeletedDescription: string;
  errorDeletingTitle: string;
  errorDeletingDescription: string;
  functionNotImplementedTitle: string;
  downloadPdfNotAvailable: string;
  noDataTitle: string;
  noDataToExportDescription: string;
  exportCompletedTitle: string;
  exportCompletedDescription: string;
  importNotAvailable: string;
  entrevistaTit: string;
  recargar: string;
  generarEnla1: string;
  exportarEntre: string;
  importarEntre: string;
  errorLoadingData: string;
  tryAgain: string;
  loadingExitInterviews: string;
  noExitInterviewsFound: string;
  generateLinkToStart: string;
  importData: string;
  positionShort: string;
  workCenterShort: string;
  exitType: string;
  exitDate: string;
  invalidDate: string;
  viewDetails: string;
  
  // Header
  profile: string;
  
  // Login
  welcome: string;
  loginSubtitle: string;
  loginButton: string;
  
  // Main Content
  maintenanceCalendar: string;
  featureTitleComprobadores: string;
  comingSoonDescriptionComprobadores: string;
  comingSoon: string;
  
  // Maintenance Calendar
  generateCalendar: string;
  calendar: string;
  analysis: string;
  hospitalInventory: string;
  maintenanceSchedule: string;
  
  // Chatbot
  dragDropFiles: string;
  supportedFormats: string;
  fileUploaded: string;
  botErrorResponse: string;
  greetingHello: string;
  greetingGoodMorning: string;
  greetingGoodAfternoon: string;
  greetingGoodEvening: string;
  greetingHowAreYou: string;
  greetingIAmFine: string;
  greetingThanks: string;
  greetingYouAreWelcome: string;
  helpMessage: string;
  aiSystemPrompt: string;
  processingErrorMessage: string;
  openGeenioChatbot: string;
  asistChat: string;
  bienvenidaChat: string;
  thinking: string;
  typeYourMessage: string;
  send: string;
  
  // Cost Analysis Report
  analysisReport: string;
  contractingEntity: string;
  baseBudget: string;
  contractType: string;
  contractDuration: string;
  generalInformation: string;
  economicAnalysis: string;
  awardCriteria: string;
  scopeConditions: string;
  scheduleDeadlines: string;
  cpvCode: string;
  contractObject: string;
  personnelAnalysis: string;
  purchaseAnalysis: string;
  consumables: string;
  spareParts: string;
  subcontractingAnalysis: string;
  otherExpenses: string;
  insurance: string;
  generalExpenses: string;
  indirectCosts: string;
  formulasDetected: string;
  
  // Change Sheets
  exporting_data: string;
  export_successful: string;
  export_failed: string;
  export_csv: string;
  
  // Common
  back: string;
  duplicateRecord: string;
  downloadPDF: string;
  generatedOn: string;
  documentGenerated: string;
  loading: string;
  recordNotFound: string;
  
  // Cost Analysis
  errorAnalyzingCosts: string;
  chatbotContextUpdated: string;
  tituloAnalisis: string;
  subtiAnalisis: string;
  subirPdf: string;
  informepdf: string;
  costespdf: string;
  puntuacionPdf: string;
  pcapFileLabel: string;
  pcapFileTitle: string;
  pcapFileDescription: string;
  pptFileLabel: string;
  pptFileTitle: string;
  pptFileDescription: string;
  professionalCostAnalysisTitle: string;
  filesReadyForAnalysis: string;
  analysisDescription: string;
  analyzingWithAI: string;
  startProfessionalCostAnalysis: string;
  analysisErrorTitle: string;
  
  // Settings Modal
  languageSettings: string;
  themeSettings: string;
  spanish: string;
  english: string;
  lightTheme: string;
  darkTheme: string;
  
  // Practice Evaluations
  institution: string;
  formation: string;
  finalEvaluation: string;
  evaluationDate: string;
  performanceRating: string;
  practice_evaluations: string;
  refresh: string;
  
  // Real Estate - All missing translations
  errorLoadingWorkCenters: string;
  addWorkerError: string;
  specifyCustomCompanyError: string;
  propertyAddedSuccess: string;
  errorAddingProperty: string;
  addActivePropertyTitle: string;
  activePropertyInfoTitle: string;
  idLabel: string;
  numRoomsLabel: string;
  workersLabel: string;
  addWorkerButton: string;
  workerNamePlaceholder: string;
  dniPlaceholder: string;
  removeWorkerButton: string;
  geeCompanyLabel: string;
  selectCompanyPlaceholder: string;
  otherCompanyOption: string;
  specifyCompanyPlaceholder: string;
  propertyStatusLabel: string;
  occupiedStatus: string;
  emptyStatus: string;
  addressLabel: string;
  addressPlaceholder: string;
  cityLabel: string;
  provinceLabel: string;
  ccaaLabel: string;
  originProvinceLabel: string;
  annualCostLabel: string;
  occupancyDateLabel: string;
  contractStartDateLabel: string;
  selectDate: string;
  meta4CodeLabel: string;
  meta4CodePlaceholder: string;
  projectContractLabel: string;
  projectContractPlaceholder: string;
  workCenterCodeLabel: string;
  workCenterCodePlaceholder: string;
  observationsLabel: string;
  observationsPlaceholder: string;
  addPropertyButton: string;
  selectWorkCenterPlaceholder: string;
  addWorkCenterButtonTitle: string;
  saving: string;
  saveProperty: string;
  inactiveProperty: string;
  reason: string;
  date: string;
  selectPropertyType: string;
  propertyTypeLabel: string;
  selectTypePlaceholder: string;
  activeProperty: string;
  accept: string;
  errorLoadingDashboardData: string;
  activeProperties: string;
  inactiveProperties: string;
  realEstateDashboard: string;
  realEstateManagementDescription: string;
  addProperty: string;
  notImplemented: string;
  importDataButton: string;
  viewTables: string;
  propertiesOperational: string;
  totalPropertiesCount: string;
  averageAnnualCost: string;
  topProvinces: string;
  costDistribution: string;
  occupancyRate: string;
  realEstateOverview: string;
  realEstateOverviewDescription: string;
  uploadRealEstateData: string;
  uploadRealEstateDataDescription: string;
  viewTablesDescription: string;
  activesCount: string;
  inactivesCount: string;
  provinceDistribution: string;
  clickToViewDetails: string;
}

export const translations: { [key in Language]: Translations } = {
  es: {
    showingRecords: 'Mostrando {{start}} a {{end}} de {{total}} registros',
    search: 'Buscar',
    next: 'Siguiente',
    previous: 'Anterior',
    noRecordsFound: 'No se encontraron registros',
    name: 'Nombre',
    email: 'Correo electrónico',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    cancel: 'Cancelar',
    save: 'Guardar',
    confirm: 'Confirmar',
    create: 'Crear',
    update: 'Actualizar',
    import: 'Importar',
    export: 'Exportar',
    duplicate: 'Duplicar',
    success: 'Éxito',
    error: 'Error',
    validationError: 'Error de validación',
    requiredFieldsError: 'Todos los campos son obligatorios',
    deleteConfirmationTitle: '¿Estás seguro?',
    deleteConfirmationDescription: 'Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este registro?',
    yes: 'Sí',
    no: 'No',
    close: 'Cerrar',
    home: 'Inicio',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    
    // Sidebar translations
    maintenance: 'Mantenimiento',
    users: 'Usuarios',
    roles: 'Roles',
    permissions: 'Permisos',
    workCenters: 'Centros de Trabajo',
    equipment: 'Equipos',
    inventory: 'Inventario',
    processFiles: 'Procesar Archivos',
    uploadFiles: 'Subir Archivos',
    upload: 'Subir',
    arrastraArchivo: 'Arrastra aquí tu archivo o haz clic para seleccionar',
    formatosCsv: 'Formatos soportados: CSV, Excel',
    
    // Missing maintenance translations
    missingMaintenanceTitle: 'Mantenimientos Faltantes',
    missingMaintenanceMessage: 'Se han detectado equipos sin mantenimientos programados.',
    generateAnyway: 'Generar de todas formas',
    completeFirst: 'Completar primero',
    
    // Work center modal translations
    workCenterCreatedSuccess: 'Centro de trabajo creado exitosamente',
    errorCreatingWorkCenter: 'Error al crear el centro de trabajo',
    workCenterUpdatedSuccess: 'Centro de trabajo actualizado exitosamente',
    errorUpdatingWorkCenter: 'Error al actualizar el centro de trabajo',
    createWorkCenterTitle: 'Crear Centro de Trabajo',
    workCenterNameLabel: 'Nombre del Centro',
    workCenterNamePlaceholder: 'Ingresa el nombre del centro de trabajo',
    workCenterIdLabel: 'ID del Centro',
    workCenterIdPlaceholder: 'Ingresa el ID del centro de trabajo',
    clearButton: 'Limpiar',
    processing: 'Procesando...',
    uploadCenterButton: 'Crear Centro',
    confirmCreationTitle: 'Confirmar Creación',
    confirmCreationDescription: '¿Estás seguro de que deseas crear este centro de trabajo?',
    confirmButton: 'Confirmar',
    workCenterExistsTitle: 'Centro ya Existe',
    workCenterExistsDescription: 'Ya existe un centro de trabajo con este ID.',
    leaveAsIsButton: 'Dejar como está',
    updateRecordButton: 'Actualizar registro',
    
    // Practice evaluation translations
    valoPracTit: 'Evaluación de Prácticas',
    tutor: 'Tutor',
    
    // Sidebar menu translations
    operations: 'Operaciones',
    costAnalysis: 'Análisis de Costes',
    costAnalysisShort: 'Análisis',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'G. Técnica',
    calendarManagement: 'Gestión de Calendario',
    calendarManagementShort: 'Calendario',
    checkers: 'Comprobadores',
    talentManagement: 'Gestión del Talento',
    talentManagementShort: 'G. Talento',
    contractRequests: 'Solicitudes de Contratación',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdos de Empleado',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Evaluación de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    homeMenu: 'Inicio',
    
    // Employee Agreements
    employeeName: 'Nombre del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    agreementType: 'Tipo de Acuerdo',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    workCenter: 'Centro de Trabajo',
    position: 'Puesto',
    department: 'Departamento',
    salary: 'Salario',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    employeeInformation: 'Información del Empleado',
    agreementDetails: 'Detalles del Acuerdo',
    benefitsAndConditions: 'Beneficios y Condiciones',
    employeeAgreementDetails: 'Detalles del Acuerdo de Empleado',
    
    // Exit Interviews
    exitInterviewsLoaded: 'Entrevistas de salida cargadas',
    errorLoadingExitInterviews: 'Error al cargar entrevistas de salida',
    voluntary: 'Voluntaria',
    leaveOfAbsence: 'Baja laboral',
    linkCopiedTitle: 'Enlace copiado',
    linkCopiedDescription: 'El enlace ha sido copiado al portapapeles',
    errorCopyingLinkTitle: 'Error al copiar enlace',
    errorCopyingLinkDescription: 'No se pudo copiar el enlace',
    interviewDuplicatedTitle: 'Entrevista duplicada',
    interviewDuplicatedDescription: 'La entrevista ha sido duplicada correctamente',
    errorDuplicatingTitle: 'Error al duplicar',
    errorDuplicatingDescription: 'No se pudo duplicar la entrevista',
    confirmDeleteInterview: '¿Confirmas eliminar esta entrevista?',
    interviewDeletedTitle: 'Entrevista eliminada',
    interviewDeletedDescription: 'La entrevista ha sido eliminada correctamente',
    errorDeletingTitle: 'Error al eliminar',
    errorDeletingDescription: 'No se pudo eliminar la entrevista',
    functionNotImplementedTitle: 'Función no implementada',
    downloadPdfNotAvailable: 'La descarga de PDF no está disponible aún',
    noDataTitle: 'Sin datos',
    noDataToExportDescription: 'No hay datos para exportar',
    exportCompletedTitle: 'Exportación completada',
    exportCompletedDescription: 'Los datos han sido exportados correctamente',
    importNotAvailable: 'La importación no está disponible aún',
    entrevistaTit: 'Entrevistas de Salida',
    recargar: 'Recargar',
    generarEnla1: 'Generar Enlace',
    exportarEntre: 'Exportar Entrevistas',
    importarEntre: 'Importar Entrevistas',
    errorLoadingData: 'Error al cargar los datos',
    tryAgain: 'Intentar de nuevo',
    loadingExitInterviews: 'Cargando entrevistas de salida...',
    noExitInterviewsFound: 'No se encontraron entrevistas de salida',
    generateLinkToStart: 'Generar enlace para comenzar',
    importData: 'Importar datos',
    positionShort: 'Puesto',
    workCenterShort: 'Centro',
    exitType: 'Tipo de Salida',
    exitDate: 'Fecha de Salida',
    invalidDate: 'Fecha inválida',
    viewDetails: 'Ver detalles',
    
    // Header
    profile: 'Perfil',
    
    // Login
    welcome: 'Bienvenido',
    loginSubtitle: 'Inicia sesión para continuar',
    loginButton: 'Iniciar Sesión',
    
    // Main Content
    maintenanceCalendar: 'Calendario de Mantenimiento',
    featureTitleComprobadores: 'Comprobadores',
    comingSoonDescriptionComprobadores: 'Funcionalidad próximamente disponible',
    comingSoon: 'Próximamente',
    
    // Maintenance Calendar
    generateCalendar: 'Generar Calendario',
    calendar: 'Calendario',
    analysis: 'Análisis',
    hospitalInventory: 'Inventario Hospitalario',
    maintenanceSchedule: 'Programa de Mantenimiento',
    
    // Chatbot
    dragDropFiles: 'Arrastra archivos aquí o haz clic para seleccionar',
    supportedFormats: 'Formatos soportados: PDF, Excel, CSV, Word, Imágenes',
    fileUploaded: 'Archivo subido',
    botErrorResponse: 'Lo siento, ha ocurrido un error. Por favor intenta de nuevo.',
    greetingHello: '¡Hola! Soy Geenio, tu asistente inteligente. ¿En qué puedo ayudarte hoy?',
    greetingGoodMorning: '¡Buenos días! ¿Cómo puedo asistirte?',
    greetingGoodAfternoon: '¡Buenas tardes! ¿En qué puedo colaborar?',
    greetingGoodEvening: '¡Buenas noches! ¿Necesitas ayuda con algo?',
    greetingHowAreYou: '¡Muy bien, gracias! ¿Cómo puedo ayudarte?',
    greetingIAmFine: 'Perfecto, ¿en qué puedo asistirte?',
    greetingThanks: '¡De nada! Estoy aquí para ayudarte.',
    greetingYouAreWelcome: '¡Es un placer ayudarte!',
    helpMessage: 'Puedo ayudarte con análisis de documentos, cálculos, consultas sobre el sistema y mucho más. ¿Qué necesitas?',
    aiSystemPrompt: 'Eres Geenio, un asistente inteligente especializado en análisis de licitaciones y gestión empresarial. Respondes de manera profesional y útil.',
    processingErrorMessage: 'Ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.',
    openGeenioChatbot: 'Abrir chatbot Geenio',
    asistChat: 'Asistente IA',
    bienvenidaChat: '¡Hola! Soy Geenio, tu asistente inteligente. Puedes preguntarme sobre análisis de costes, documentos o cualquier consulta.',
    thinking: 'Pensando',
    typeYourMessage: 'Escribe tu mensaje...',
    send: 'Enviar',
    
    // Cost Analysis Report
    analysisReport: 'Informe de Análisis',
    contractingEntity: 'Entidad Contratante',
    baseBudget: 'Presupuesto Base',
    contractType: 'Tipo de Contrato',
    contractDuration: 'Duración del Contrato',
    generalInformation: 'Información General',
    economicAnalysis: 'Análisis Económico',
    awardCriteria: 'Criterios de Adjudicación',
    scopeConditions: 'Alcance y Condiciones',
    scheduleDeadlines: 'Cronograma y Plazos',
    cpvCode: 'Código CPV',
    contractObject: 'Objeto del Contrato',
    personnelAnalysis: 'Análisis de Personal',
    purchaseAnalysis: 'Análisis de Compras',
    consumables: 'Consumibles',
    spareParts: 'Repuestos',
    subcontractingAnalysis: 'Análisis de Subcontratación',
    otherExpenses: 'Otros Gastos',
    insurance: 'Seguros',
    generalExpenses: 'Gastos Generales',
    indirectCosts: 'Costes Indirectos',
    formulasDetected: 'Fórmulas Detectadas',
    
    // Change Sheets
    exporting_data: 'Exportando datos',
    export_successful: 'Exportación exitosa',
    export_failed: 'Error en la exportación',
    export_csv: 'Exportar CSV',
    
    // Common
    back: 'Volver',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    generatedOn: 'Generado el',
    documentGenerated: 'Documento generado',
    loading: 'Cargando',
    recordNotFound: 'Registro no encontrado',
    
    // Cost Analysis
    errorAnalyzingCosts: 'Error al analizar costes',
    chatbotContextUpdated: 'Contexto del chatbot actualizado',
    tituloAnalisis: 'Análisis de Costes',
    subtiAnalisis: 'Sube tu pliego de condiciones para obtener un análisis detallado',
    subirPdf: 'Subir PDF',
    informepdf: 'Informe de Análisis',
    costespdf: 'Análisis de Costes',
    puntuacionPdf: 'Calculadora de Puntuación',
    pcapFileLabel: 'Pliego de Condiciones (PCAP)',
    pcapFileTitle: 'Archivo PCAP requerido',
    pcapFileDescription: 'Por favor, sube el pliego de condiciones administrativas particulares',
    pptFileLabel: 'Pliego de Prescripciones Técnicas (PPT)',
    pptFileTitle: 'Archivo PPT requerido',
    pptFileDescription: 'Por favor, sube el pliego de prescripciones técnicas',
    professionalCostAnalysisTitle: 'Análisis Profesional de Costes',
    filesReadyForAnalysis: 'Archivos listos para análisis',
    analysisDescription: 'Se realizará un análisis completo de los documentos subidos',
    analyzingWithAI: 'Analizando con AI...',
    startProfessionalCostAnalysis: 'Iniciar Análisis Profesional',
    analysisErrorTitle: 'Error en el Análisis',
    
    // Settings Modal
    languageSettings: 'Configuración de Idioma',
    themeSettings: 'Configuración de Tema',
    spanish: 'Español',
    english: 'Inglés',
    lightTheme: 'Tema Claro',
    darkTheme: 'Tema Oscuro',
    
    // Practice Evaluations
    institution: 'Institución',
    formation: 'Formación',
    finalEvaluation: 'Evaluación Final',
    evaluationDate: 'Fecha de Evaluación',
    performanceRating: 'Calificación de Rendimiento',
    practice_evaluations: 'Evaluaciones de Prácticas',
    refresh: 'Actualizar',
    
    // Real Estate - All translations
    errorLoadingWorkCenters: 'Error al cargar centros de trabajo',
    addWorkerError: 'Error al agregar trabajador',
    specifyCustomCompanyError: 'Especifica el nombre de la empresa personalizada',
    propertyAddedSuccess: 'Propiedad agregada exitosamente',
    errorAddingProperty: 'Error al agregar la propiedad',
    addActivePropertyTitle: 'Agregar Propiedad Activa',
    activePropertyInfoTitle: 'Información de la Propiedad Activa',
    idLabel: 'ID',
    numRoomsLabel: 'Número de Habitaciones',
    workersLabel: 'Trabajadores',
    addWorkerButton: 'Agregar Trabajador',
    workerNamePlaceholder: 'Nombre del trabajador',
    dniPlaceholder: 'DNI',
    removeWorkerButton: 'Eliminar Trabajador',
    geeCompanyLabel: 'Empresa GEE',
    selectCompanyPlaceholder: 'Seleccionar empresa',
    otherCompanyOption: 'Otra empresa',
    specifyCompanyPlaceholder: 'Especificar empresa',
    propertyStatusLabel: 'Estado de la Propiedad',
    occupiedStatus: 'Ocupada',
    emptyStatus: 'Vacía',
    addressLabel: 'Dirección',
    addressPlaceholder: 'Ingrese la dirección',
    cityLabel: 'Ciudad',
    provinceLabel: 'Provincia',
    ccaaLabel: 'CCAA',
    originProvinceLabel: 'Provincia de Origen',
    annualCostLabel: 'Coste Anual',
    occupancyDateLabel: 'Fecha de Ocupación',
    contractStartDateLabel: 'Fecha Inicio Contrato',
    selectDate: 'Seleccionar fecha',
    meta4CodeLabel: 'Código Meta4',
    meta4CodePlaceholder: 'Ingrese código Meta4',
    projectContractLabel: 'Proyecto/Contrato',
    projectContractPlaceholder: 'Ingrese proyecto o contrato',
    workCenterCodeLabel: 'Código Centro de Trabajo',
    workCenterCodePlaceholder: 'Ingrese código del centro',
    observationsLabel: 'Observaciones',
    observationsPlaceholder: 'Ingrese observaciones',
    addPropertyButton: 'Agregar Propiedad',
    selectWorkCenterPlaceholder: 'Seleccionar centro de trabajo',
    addWorkCenterButtonTitle: 'Agregar Centro de Trabajo',
    saving: 'Guardando',
    saveProperty: 'Guardar Propiedad',
    inactiveProperty: 'Propiedad Inactiva',
    reason: 'Motivo',
    date: 'Fecha',
    selectPropertyType: 'Seleccionar Tipo de Propiedad',
    propertyTypeLabel: 'Tipo de Propiedad',
    selectTypePlaceholder: 'Seleccionar tipo',
    activeProperty: 'Propiedad Activa',
    accept: 'Aceptar',
    errorLoadingDashboardData: 'Error al cargar datos del dashboard',
    activeProperties: 'Propiedades Activas',
    inactiveProperties: 'Propiedades Inactivas',
    realEstateDashboard: 'Dashboard de Inmuebles',
    realEstateManagementDescription: 'Gestión integral de propiedades inmobiliarias',
    addProperty: 'Agregar Propiedad',
    notImplemented: 'No implementado',
    importDataButton: 'Importar Datos',
    viewTables: 'Ver Tablas',
    propertiesOperational: 'propiedades operativas',
    totalPropertiesCount: 'Total de Propiedades',
    averageAnnualCost: 'Coste Anual Promedio',
    topProvinces: 'Principales Provincias',
    costDistribution: 'Distribución de Costes',
    occupancyRate: 'Tasa de Ocupación',
    realEstateOverview: 'Resumen de Inmuebles',
    realEstateOverviewDescription: 'Visualiza estadísticas y métricas clave',
    uploadRealEstateData: 'Subir Datos de Inmuebles',
    uploadRealEstateDataDescription: 'Importa información de propiedades desde archivos',
    viewTablesDescription: 'Consulta y gestiona propiedades existentes',
    activesCount: 'Activas',
    inactivesCount: 'Inactivas',
    provinceDistribution: 'Distribución por Provincia',
    clickToViewDetails: 'Haz clic para ver detalles',
  },
  en: {
    showingRecords: 'Showing {{start}} to {{end}} of {{total}} records',
    search: 'Search',
    next: 'Next',
    previous: 'Previous',
    noRecordsFound: 'No records found',
    name: 'Name',
    email: 'Email',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    create: 'Create',
    update: 'Update',
    import: 'Import',
    export: 'Export',
    duplicate: 'Duplicate',
    success: 'Success',
    error: 'Error',
    validationError: 'Validation error',
    requiredFieldsError: 'All fields are required',
    deleteConfirmationTitle: 'Are you sure?',
    deleteConfirmationDescription: 'This action cannot be undone. Are you sure you want to delete this record?',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    home: 'Home',
    settings: 'Settings',
    logout: 'Logout',

    // Sidebar translations
    maintenance: 'Maintenance',
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    workCenters: 'Work Centers',
    equipment: 'Equipment',
    inventory: 'Inventory',
    processFiles: 'Process Files',
    uploadFiles: 'Upload Files',
    upload: 'Upload',
    arrastraArchivo: 'Drag your file here or click to select',
    formatosCsv: 'Supported formats: CSV, Excel',
    
    // Missing maintenance translations
    missingMaintenanceTitle: 'Missing Maintenance',
    missingMaintenanceMessage: 'Equipment without scheduled maintenance has been detected.',
    generateAnyway: 'Generate anyway',
    completeFirst: 'Complete first',
    
    // Work center modal translations
    workCenterCreatedSuccess: 'Work center created successfully',
    errorCreatingWorkCenter: 'Error creating work center',
    workCenterUpdatedSuccess: 'Work center updated successfully',
    errorUpdatingWorkCenter: 'Error updating work center',
    createWorkCenterTitle: 'Create Work Center',
    workCenterNameLabel: 'Center Name',
    workCenterNamePlaceholder: 'Enter work center name',
    workCenterIdLabel: 'Center ID',
    workCenterIdPlaceholder: 'Enter work center ID',
    clearButton: 'Clear',
    processing: 'Processing...',
    uploadCenterButton: 'Create Center',
    confirmCreationTitle: 'Confirm Creation',
    confirmCreationDescription: 'Are you sure you want to create this work center?',
    confirmButton: 'Confirm',
    workCenterExistsTitle: 'Center Already Exists',
    workCenterExistsDescription: 'A work center with this ID already exists.',
    leaveAsIsButton: 'Leave as is',
    updateRecordButton: 'Update record',
    
    // Practice evaluation translations
    valoPracTit: 'Practice Evaluation',
    tutor: 'Tutor',
    
    // Sidebar menu translations
    operations: 'Operations',
    costAnalysis: 'Cost Analysis',
    costAnalysisShort: 'Analysis',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'Technical',
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendar',
    checkers: 'Checkers',
    talentManagement: 'Talent Management',
    talentManagementShort: 'Talent',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    homeMenu: 'Home',
    
    // Employee Agreements
    employeeName: 'Employee Name',
    employeeLastName: 'Employee Last Name',
    agreementType: 'Agreement Type',
    startDate: 'Start Date',
    endDate: 'End Date',
    workCenter: 'Work Center',
    position: 'Position',
    department: 'Department',
    salary: 'Salary',
    benefits: 'Benefits',
    conditions: 'Conditions',
    observations: 'Observations',
    employeeInformation: 'Employee Information',
    agreementDetails: 'Agreement Details',
    benefitsAndConditions: 'Benefits and Conditions',
    employeeAgreementDetails: 'Employee Agreement Details',
    
    // Exit Interviews
    exitInterviewsLoaded: 'Exit interviews loaded',
    errorLoadingExitInterviews: 'Error loading exit interviews',
    voluntary: 'Voluntary',
    leaveOfAbsence: 'Leave of absence',
    linkCopiedTitle: 'Link copied',
    linkCopiedDescription: 'The link has been copied to clipboard',
    errorCopyingLinkTitle: 'Error copying link',
    errorCopyingLinkDescription: 'Could not copy the link',
    interviewDuplicatedTitle: 'Interview duplicated',
    interviewDuplicatedDescription: 'The interview has been duplicated successfully',
    errorDuplicatingTitle: 'Error duplicating',
    errorDuplicatingDescription: 'Could not duplicate the interview',
    confirmDeleteInterview: 'Do you confirm deleting this interview?',
    interviewDeletedTitle: 'Interview deleted',
    interviewDeletedDescription: 'The interview has been deleted successfully',
    errorDeletingTitle: 'Error deleting',
    errorDeletingDescription: 'Could not delete the interview',
    functionNotImplementedTitle: 'Function not implemented',
    downloadPdfNotAvailable: 'PDF download is not available yet',
    noDataTitle: 'No data',
    noDataToExportDescription: 'No data to export',
    exportCompletedTitle: 'Export completed',
    exportCompletedDescription: 'Data has been exported successfully',
    importNotAvailable: 'Import is not available yet',
    entrevistaTit: 'Exit Interviews',
    recargar: 'Reload',
    generarEnla1: 'Generate Link',
    exportarEntre: 'Export Interviews',
    importarEntre: 'Import Interviews',
    errorLoadingData: 'Error loading data',
    tryAgain: 'Try again',
    loadingExitInterviews: 'Loading exit interviews...',
    noExitInterviewsFound: 'No exit interviews found',
    generateLinkToStart: 'Generate link to start',
    importData: 'Import data',
    positionShort: 'Position',
    workCenterShort: 'Center',
    exitType: 'Exit Type',
    exitDate: 'Exit Date',
    invalidDate: 'Invalid date',
    viewDetails: 'View details',
    
    // Header
    profile: 'Profile',
    
    // Login
    welcome: 'Welcome',
    loginSubtitle: 'Sign in to continue',
    loginButton: 'Sign In',
    
    // Main Content
    maintenanceCalendar: 'Maintenance Calendar',
    featureTitleComprobadores: 'Checkers',
    comingSoonDescriptionComprobadores: 'Feature coming soon',
    comingSoon: 'Coming Soon',
    
    // Maintenance Calendar
    generateCalendar: 'Generate Calendar',
    calendar: 'Calendar',
    analysis: 'Analysis',
    hospitalInventory: 'Hospital Inventory',
    maintenanceSchedule: 'Maintenance Schedule',
    
    // Chatbot
    dragDropFiles: 'Drag files here or click to select',
    supportedFormats: 'Supported formats: PDF, Excel, CSV, Word, Images',
    fileUploaded: 'File uploaded',
    botErrorResponse: 'Sorry, an error occurred. Please try again.',
    greetingHello: 'Hello! I am Geenio, your intelligent assistant. How can I help you today?',
    greetingGoodMorning: 'Good morning! How can I assist you?',
    greetingGoodAfternoon: 'Good afternoon! How can I help?',
    greetingGoodEvening: 'Good evening! Do you need help with something?',
    greetingHowAreYou: 'Very well, thank you! How can I help you?',
    greetingIAmFine: 'Perfect, how can I assist you?',
    greetingThanks: 'You are welcome! I am here to help you.',
    greetingYouAreWelcome: 'It is a pleasure to help you!',
    helpMessage: 'I can help you with document analysis, calculations, system queries and much more. What do you need?',
    aiSystemPrompt: 'You are Geenio, an intelligent assistant specialized in bid analysis and business management. You respond professionally and helpfully.',
    processingErrorMessage: 'An error occurred while processing your request. Please try again.',
    openGeenioChatbot: 'Open Geenio chatbot',
    asistChat: 'AI Assistant',
    bienvenidaChat: 'Hello! I am Geenio, your intelligent assistant. You can ask me about cost analysis, documents or any query.',
    thinking: 'Thinking',
    typeYourMessage: 'Type your message...',
    send: 'Send',
    
    // Cost Analysis Report
    analysisReport: 'Analysis Report',
    contractingEntity: 'Contracting Entity',
    baseBudget: 'Base Budget',
    contractType: 'Contract Type',
    contractDuration: 'Contract Duration',
    generalInformation: 'General Information',
    economicAnalysis: 'Economic Analysis',
    awardCriteria: 'Award Criteria',
    scopeConditions: 'Scope and Conditions',
    scheduleDeadlines: 'Schedule and Deadlines',
    cpvCode: 'CPV Code',
    contractObject: 'Contract Object',
    personnelAnalysis: 'Personnel Analysis',
    purchaseAnalysis: 'Purchase Analysis',
    consumables: 'Consumables',
    spareParts: 'Spare Parts',
    subcontractingAnalysis: 'Subcontracting Analysis',
    otherExpenses: 'Other Expenses',
    insurance: 'Insurance',
    generalExpenses: 'General Expenses',
    indirectCosts: 'Indirect Costs',
    formulasDetected: 'Formulas Detected',
    
    // Change Sheets
    exporting_data: 'Exporting data',
    export_successful: 'Export successful',
    export_failed: 'Export failed',
    export_csv: 'Export CSV',
    
    // Common
    back: 'Back',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    generatedOn: 'Generated on',
    documentGenerated: 'Document generated',
    loading: 'Loading',
    recordNotFound: 'Record not found',
    
    // Cost Analysis
    errorAnalyzingCosts: 'Error analyzing costs',
    chatbotContextUpdated: 'Chatbot context updated',
    tituloAnalisis: 'Cost Analysis',
    subtiAnalisis: 'Upload your specifications for detailed analysis',
    subirPdf: 'Upload PDF',
    informepdf: 'Analysis Report',
    costespdf: 'Cost Analysis',
    puntuacionPdf: 'Score Calculator',
    pcapFileLabel: 'Administrative Conditions (PCAP)',
    pcapFileTitle: 'PCAP file required',
    pcapFileDescription: 'Please upload the particular administrative conditions document',
    pptFileLabel: 'Technical Specifications (PPT)',
    pptFileTitle: 'PPT file required',
    pptFileDescription: 'Please upload the technical specifications document',
    professionalCostAnalysisTitle: 'Professional Cost Analysis',
    filesReadyForAnalysis: 'Files ready for analysis',
    analysisDescription: 'A complete analysis of the uploaded documents will be performed',
    analyzingWithAI: 'Analyzing with AI...',
    startProfessionalCostAnalysis: 'Start Professional Analysis',
    analysisErrorTitle: 'Analysis Error',
    
    // Settings Modal
    languageSettings: 'Language Settings',
    themeSettings: 'Theme Settings',
    spanish: 'Spanish',
    english: 'English',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    
    // Practice Evaluations
    institution: 'Institution',
    formation: 'Formation',
    finalEvaluation: 'Final Evaluation',
    evaluationDate: 'Evaluation Date',
    performanceRating: 'Performance Rating',
    practice_evaluations: 'Practice Evaluations',
    refresh: 'Refresh',
    
    // Real Estate - All translations
    errorLoadingWorkCenters: 'Error loading work centers',
    addWorkerError: 'Error adding worker',
    specifyCustomCompanyError: 'Specify the custom company name',
    propertyAddedSuccess: 'Property added successfully',
    errorAddingProperty: 'Error adding property',
    addActivePropertyTitle: 'Add Active Property',
    activePropertyInfoTitle: 'Active Property Information',
    idLabel: 'ID',
    numRoomsLabel: 'Number of Rooms',
    workersLabel: 'Workers',
    addWorkerButton: 'Add Worker',
    workerNamePlaceholder: 'Worker name',
    dniPlaceholder: 'DNI',
    removeWorkerButton: 'Remove Worker',
    geeCompanyLabel: 'GEE Company',
    selectCompanyPlaceholder: 'Select company',
    otherCompanyOption: 'Other company',
    specifyCompanyPlaceholder: 'Specify company',
    propertyStatusLabel: 'Property Status',
    occupiedStatus: 'Occupied',
    emptyStatus: 'Empty',
    addressLabel: 'Address',
    addressPlaceholder: 'Enter address',
    cityLabel: 'City',
    provinceLabel: 'Province',
    ccaaLabel: 'CCAA',
    originProvinceLabel: 'Origin Province',
    annualCostLabel: 'Annual Cost',
    occupancyDateLabel: 'Occupancy Date',
    contractStartDateLabel: 'Contract Start Date',
    selectDate: 'Select date',
    meta4CodeLabel: 'Meta4 Code',
    meta4CodePlaceholder: 'Enter Meta4 code',
    projectContractLabel: 'Project/Contract',
    projectContractPlaceholder: 'Enter project or contract',
    workCenterCodeLabel: 'Work Center Code',
    workCenterCodePlaceholder: 'Enter center code',
    observationsLabel: 'Observations',
    observationsPlaceholder: 'Enter observations',
    addPropertyButton: 'Add Property',
    selectWorkCenterPlaceholder: 'Select work center',
    addWorkCenterButtonTitle: 'Add Work Center',
    saving: 'Saving',
    saveProperty: 'Save Property',
    inactiveProperty: 'Inactive Property',
    reason: 'Reason',
    date: 'Date',
    selectPropertyType: 'Select Property Type',
    propertyTypeLabel: 'Property Type',
    selectTypePlaceholder: 'Select type',
    activeProperty: 'Active Property',
    accept: 'Accept',
    errorLoadingDashboardData: 'Error loading dashboard data',
    activeProperties: 'Active Properties',
    inactiveProperties: 'Inactive Properties',
    realEstateDashboard: 'Real Estate Dashboard',
    realEstateManagementDescription: 'Comprehensive real estate property management',
    addProperty: 'Add Property',
    notImplemented: 'Not implemented',
    importDataButton: 'Import Data',
    viewTables: 'View Tables',
    propertiesOperational: 'operational properties',
    totalPropertiesCount: 'Total Properties',
    averageAnnualCost: 'Average Annual Cost',
    topProvinces: 'Top Provinces',
    costDistribution: 'Cost Distribution',
    occupancyRate: 'Occupancy Rate',
    realEstateOverview: 'Real Estate Overview',
    realEstateOverviewDescription: 'View key statistics and metrics',
    uploadRealEstateData: 'Upload Real Estate Data',
    uploadRealEstateDataDescription: 'Import property information from files',
    viewTablesDescription: 'View and manage existing properties',
    activesCount: 'Active',
    inactivesCount: 'Inactive',
    provinceDistribution: 'Province Distribution',
    clickToViewDetails: 'Click to view details',
  }
};

export type TranslationsKeys = keyof Translations;
