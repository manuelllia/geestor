
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export interface Translations {
  theme: string;
  light: string;
  dark: string;
  operations: string;
  costAnalysisShort: string;
  costAnalysis: string;
  technicalManagement: string;
  technicalManagementShort: string;
  calendarManagement: string;
  calendarManagementShort: string;
  checkers: string;
  homeMenu: string;
  users: string;
  talentManagement: string;
  talentManagementShort: string;
  contractRequests: string;
  changeSheets: string;
  employeeAgreements: string;
  realEstateManagement: string;
  practiceEvaluation: string;
  exitInterviews: string;
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
  workCenter: string;
  profile: string;
  welcome: string;
  loginSubtitle: string;
  loginButton: string;
  featureTitleComprobadores: string;
  comingSoon: string;
  confirm: string;
  calendar: string;
  analysis: string;
  hospitalInventory: string;
  maintenanceSchedule: string;
  processFiles: string;
  uploadFiles: string;
  missingMaintenanceMessage: string;
  completeFirst: string;
  activeProperties: string;
  inactiveProperties: string;
  realEstateDashboard: string;
  viewTables: string;
  totalProperties: string;
  annualCost: string;
  exportPDF: string;
  realEstateDetails: string;
  detailViewPlaceholder: string;
  userProfile: string;
  personalInformation: string;
  changePhoto: string;
  email: string;
  permissions: string;
  permissionsDescription: string;
  departmentPermissions: string;
  actionPermissions: string;
  create: string;
  modify: string;
  delete: string;
  saveChanges: string;
  cancel: string;
  close: string;
  suggestionsReviewTitle: string;
  verifyingAccount: string;
  loading: string;
  name: string;
  settings: string;
  maintenanceCalendar: string;
  generateCalendar: string;
  inventory: string;
  missingMaintenanceTitle: string;
  generateAnyway: string;
  language: string;
  spanish: string;
  english: string;
  logout: string;
  upload: string;
  mensajeCsvInventario: string;
  mensajeCsvMantenimmiento: string;
  formatosCsv: string;
  arrastraArchivo: string;
  usersGestion: string;
  userGestSub: string;
  recargar: string;
  buscadorUsers: string;
  listaUsers: string;
  tituloAnalisis: string;
  subtiAnalisis: string;
  subirPdf: string;
  informepdf: string;
  costespdf: string;
  puntuacionPdf: string;
  asistChat: string;
  bienvenidaChat: string;
  entrevistaTit: string;
  generarEnla1: string;
  exportarEntre: string;
  importarEntre: string;
  typeOfLeave: string;

  // Cost Analysis specific translations
  errorAnalyzingCosts: string;
  chatbotContextUpdated: string;
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

  exitInterviewsLoaded: string;
  errorLoadingExitInterviews: string;
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
  viewDetails: string;
  duplicate: string;
  voluntary: string;
  leaveOfAbsence: string;
  invalidDate: string;
  showingRecords: string;
  previous: string;
  next: string;
  errorLoadingUsers: string;
  userPermissionsUpdatedSuccessfully: string;
  errorUpdatingUserPermissions: string;
  yes: string;
  no: string;
  usersCount: string;
  editPermissions: string;
  swipeToViewMore: string;
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
  thinking: string;
  typeYourMessage: string;
  send: string;

  valoPracTit: string;
  valoPracSub: string;
  generarEnlaceVal: string;

  valoPracTit: string; // Ya existe: "Valoración de Prácticas"
  valoPracSub: string; // Ya existe: "Gestiona las valoraciones de prácticas realizadas por los tutores de GEE"
  generarEnlaceVal: string; // Ya existe: "Generar Enlace de Valoración"
  student: string;
  tutor: string;
  formation: string;
  finalEvaluation: string;
  evaluationDate: string;
  performanceRating: string;
  institution: string;
  apto: string; // Valor del badge 'Apto'
  noApto: string; // Valor del badge 'No Apto'
  performanceRatingScore: string; // Para "X/10"
  deleteEvaluationConfirmationTitle: string;
  deleteEvaluationConfirmationDescription: string; // Con interpolación {{studentName}} {{studentLastName}}
  noEvaluationsRegistered: string;
  generateLinkToStartReceivingEvaluations: string;
  evaluationDeletedToastTitle: string;
  evaluationDeletedToastDescription: string;
  errorDeletingEvaluationToastTitle: string;
  errorDeletingEvaluationToastDescription: string;
  linkCopiedToClipboardToastTitle: string;
  linkCopiedToClipboardToastDescription: string;
  exportFunctionComingSoonTitle: string;
  exportFunctionComingSoonDescription: string;
  importFunctionComingSoonTitle: string;
  importFunctionComingSoonDescription: string;

  // N U E V A S   C L A V E S   P A R A   ActivePropertyForm y CreateWorkCenterModal
  addActivePropertyTitle: string;
  activePropertyInfoTitle: string;
  requiredFieldsError: string;
  addWorkerError: string;
  specifyCustomCompanyError: string;
  propertyAddedSuccess: string;
  errorAddingProperty: string;
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
  selectDate: string; // Reutilizada para ambos selectores de fecha
  contractStartDateLabel: string;
  meta4CodeLabel: string;
  meta4CodePlaceholder: string;
  projectContractLabel: string;
  projectContractPlaceholder: string;
  workCenterCodeLabel: string;
  selectWorkCenterPlaceholder: string;
  addWorkCenterButtonTitle: string;
  saving: string;
  saveProperty: string;
  // Para CreateWorkCenterModal
  createWorkCenterTitle: string;
  workCenterNameLabel: string;
  workCenterNamePlaceholder: string;
  workCenterCodeInputLabel: string; // No es el mismo que `workCenterCodeLabel`
  workCenterCodeInputPlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  errorLoadingWorkCenters: string;
  workCenterCreatedSuccess: string;
  errorCreatingWorkCenter: string;
  // Mensaje para onAddProperty no definido
  onAddPropertyNotDefined: string;
}

export const translations: { [key in Language]: Translations } = {
  es: {
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    operations: 'Operaciones',
    costAnalysisShort: 'Análisis de Costos',
    costAnalysis: 'Análisis de Costos',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'Gestión Técnica',
    calendarManagement: 'Gestión de Calendarios',
    calendarManagementShort: 'Calendarios',
    checkers: 'Comprobadores',
    homeMenu: 'Inicio',
    users: 'Usuarios',
    talentManagement: 'Gestión del Talento',
    talentManagementShort: 'Talento',
    contractRequests: 'Solicitudes de Contratos',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Convenios de Empleados',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Evaluación de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
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
    documentGenerated: 'Documento Generado',
    recordNotFound: 'Registro no encontrado',
    employeeInformation: 'Información del Empleado',
    employeeLastName: 'Apellidos',
    position: 'Cargo',
    department: 'Departamento',
    agreementDetails: 'Detalles del Convenio',
    agreementType: 'Tipo de Convenio',
    endDate: 'Fecha de Fin',
    salary: 'Salario',
    benefitsAndConditions: 'Beneficios y Condiciones',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    employeeAgreementDetails: 'Detalles del Convenio de Empleado',
    comingSoonTitle: 'Próximamente',
    comingSoonDescription: 'Esta funcionalidad estará disponible pronto.',
    comingSoonDescriptionComprobadores: 'Los comprobadores estarán disponibles próximamente.',
    workCenter: 'Centro de Trabajo',
    profile: 'Perfil',
    welcome: 'Bienvenido a GEESTOR',
    loginSubtitle: 'Disfruta de todos los procesos al alcance de tu mano.',
    loginButton: 'Iniciar Sesión',
    featureTitleComprobadores: 'Comprobadores',
    comingSoon: 'Próximamente',
    confirm: 'Confirmar',
    calendar: 'Calendario',
    analysis: 'Análisis',
    hospitalInventory: 'Inventario Hospitalario',
    maintenanceSchedule: 'Programa de Mantenimiento',
    processFiles: 'Procesar Archivos',
    uploadFiles: 'Subir Archivos',
    missingMaintenanceMessage: 'Hay denominaciones sin mantenimientos asignados',
    completeFirst: 'Completa primero',
    activeProperties: 'Propiedades Activas',
    inactiveProperties: 'Propiedades Inactivas',
    realEstateDashboard: 'Dashboard de Inmuebles',
    viewTables: 'Ver Tablas',
    totalProperties: 'Total de Propiedades',
    annualCost: 'Costo Anual',
    exportPDF: 'Exportar PDF',
    realEstateDetails: 'Detalles del Inmueble',
    detailViewPlaceholder: 'Vista de detalles del inmueble',
    userProfile: 'Perfil de Usuario',
    personalInformation: 'Información Personal',
    changePhoto: 'Cambiar Foto',
    email: 'Correo Electrónico',
    permissions: 'Permisos',
    permissionsDescription: 'Permisos del usuario en el sistema',
    departmentPermissions: 'Permisos por Departamento',
    actionPermissions: 'Permisos de Acción',
    create: 'Crear',
    modify: 'Modificar',
    delete: 'Eliminar',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    close: 'Cerrar',
    suggestionsReviewTitle: 'Revisar Sugerencias de IA',
    verifyingAccount: 'Verificando cuenta...',
    loading: 'Cargando...',
    name: 'Nombre',
    settings: 'Configuración',
    maintenanceCalendar: 'Calendario de Mantenimiento',
    generateCalendar: 'Generar Calendario',
    inventory: 'Inventario',
    missingMaintenanceTitle: 'Mantenimientos Faltantes',
    generateAnyway: 'Generar de todas formas',
    language: 'Idioma',
    spanish: 'Español',
    english: 'Inglés',
    logout: 'Cerrar Sesión',
    upload: 'Subir',
    arrastraArchivo: 'Arrastra tu archivo aquí',
    mensajeCsvInventario: 'Sube un archivo Excel o CSV con el inventario de equipos médicos',
    mensajeCsvMantenimmiento: 'Sube un archivo Excel o CSV con la programación de mantenimiento',
    formatosCsv: 'Formatos soportados: Excel(.xlsx, .xls) y CSV (.csv)',
    usersGestion: 'Gestión de Usuarios',
    userGestSub: 'Administra los usuarios y sus permisos en el sistema',
    recargar: 'Actualizar',
    buscadorUsers: 'Buscar usuarios por nombre o correo...',
    listaUsers: 'Lista de Usuarios',
    tituloAnalisis: 'Análisis de Costes Profesional',
    subtiAnalisis: 'Análisis exhaustivo de licitaciones de electromedicina con IA especializada',
    subirPdf: 'Subir Archivos',
    informepdf: 'Informe',
    costespdf: 'Costes',
    puntuacionPdf: 'Puntuación',
    asistChat: 'Asistente de Análisis',
    bienvenidaChat: '¡Hola! Soy Geenio, tu asistente para análisis de licitaciones. ¿En qué puedo ayudarte?',
    entrevistaTit: 'Entrevistas de Salida',
    generarEnla1: 'Generar Enlace',
    exportarEntre: 'Exportar',
    importarEntre: 'Importar',

    // Cost Analysis specific translations
    errorAnalyzingCosts: 'Error al analizar costos',
    chatbotContextUpdated: 'Contexto del chatbot actualizado',
    pcapFileLabel: 'Archivo PCAP',
    pcapFileTitle: 'Pliego de Condiciones Administrativas Particulares',
    pcapFileDescription: 'Sube el archivo PCAP de la licitación',
    pptFileLabel: 'Archivo PPT',
    pptFileTitle: 'Pliego de Prescripciones Técnicas',
    pptFileDescription: 'Sube el archivo PPT de la licitación',
    professionalCostAnalysisTitle: 'Análisis Profesional de Costos',
    filesReadyForAnalysis: 'Archivos listos para análisis',
    analysisDescription: 'El sistema analizará ambos documentos para generar un informe completo',
    analyzingWithAI: 'Analizando con IA...',
    startProfessionalCostAnalysis: 'Iniciar Análisis Profesional de Costos',
    analysisErrorTitle: 'Error en el análisis',

    exitInterviewsLoaded: 'Entrevistas de salida cargadas',
    errorLoadingExitInterviews: 'Error al cargar las entrevistas de salida',
    linkCopiedTitle: 'Enlace copiado',
    linkCopiedDescription: 'El enlace de la entrevista de salida ha sido copiado al portapapeles.',
    errorCopyingLinkTitle: 'Error al copiar enlace',
    errorCopyingLinkDescription: 'El enlace no pudo copiarse. Por favor, cópielo manualmente: ',
    interviewDuplicatedTitle: 'Entrevista duplicada',
    interviewDuplicatedDescription: 'La entrevista de salida ha sido duplicada exitosamente.',
    errorDuplicatingTitle: 'Error al duplicar',
    errorDuplicatingDescription: 'No se pudo duplicar la entrevista de salida.',
    confirmDeleteInterview: '¿Estás seguro de que deseas eliminar esta entrevista de salida?',
    interviewDeletedTitle: 'Entrevista eliminada',
    interviewDeletedDescription: 'La entrevista de salida ha sido eliminada exitosamente.',
    errorDeletingTitle: 'Error al eliminar',
    errorDeletingDescription: 'No se pudo eliminar la entrevista de salida.',
    functionNotImplementedTitle: 'Función no implementada',
    downloadPdfNotAvailable: 'La descarga de PDF para esta entrevista aún no está disponible.',
    noDataTitle: 'Sin datos',
    noDataToExportDescription: 'No hay entrevistas de salida para exportar.',
    exportCompletedTitle: 'Exportación completada',
    exportCompletedDescription: 'Las entrevistas de salida han sido exportadas exitosamente.',
    importNotAvailable: 'La importación de datos aún no está disponible.',
    errorLoadingData: 'Error al cargar datos',
    tryAgain: 'Intentar de nuevo',
    loadingExitInterviews: 'Cargando entrevistas de salida...',
    noExitInterviewsFound: 'No hay entrevistas de salida',
    generateLinkToStart: 'Genera un enlace para comenzar a recibir entrevistas de salida.',
    importData: 'Importar Datos',
    positionShort: 'Puesto',
    workCenterShort: 'Centro',
    exitType: 'Tipo de Baja',
    exitDate: 'Fecha de Baja',
    viewDetails: 'Ver detalles',
    duplicate: 'Duplicar',
    voluntary: 'Voluntaria',
    leaveOfAbsence: 'Excedencia',
    invalidDate: 'Fecha no válida',
    showingRecords: 'Mostrando {{start}} a {{end}} de {{total}} registros',
    previous: 'Anterior',
    next: 'Siguiente',
    typeOfLeave: 'Tipo de Baja',
    errorLoadingUsers: 'Error al cargar usuarios',
    userPermissionsUpdatedSuccessfully: 'Permisos de usuario actualizados correctamente',
    errorUpdatingUserPermissions: 'Error al actualizar permisos de usuario',
    yes: 'Sí',
    no: 'No',
    usersCount: '{{count}} usuarios',
    editPermissions: 'Editar Permisos',
    swipeToViewMore: 'Desliza para ver más',
    botErrorResponse: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
    greetingHello: 'Hola',
    greetingGoodMorning: 'Buenos días',
    greetingGoodAfternoon: 'Buenas tardes',
    greetingGoodEvening: 'Buenas noches',
    greetingHowAreYou: '¿Cómo estás?',
    greetingIAmFine: 'Estoy bien',
    greetingThanks: 'Gracias',
    greetingYouAreWelcome: 'De nada',
    helpMessage: '¿En qué puedo ayudarte?',
    aiSystemPrompt: 'Eres Geenio, el asistente especializado en análisis de licitaciones de electromedicina del Grupo Empresarial Electromédico (GEE).',
    processingErrorMessage: 'Error al procesar tu solicitud',
    openGeenioChatbot: 'Abrir chat de Geenio',
    thinking: 'Pensando...',
    typeYourMessage: 'Escribe tu mensaje...',
    send: 'Enviar',

    // N U E V A S   T R A D U C C I O N E S   P A R A   PracticeEvaluationsListView
    valoPracTit: 'Valoración de Prácticas',
    valoPracSub: 'Gestiona las valoraciones de prácticas realizadas por los tutores de GEE',
    generarEnlaceVal: 'Generar Enlace de Valoración',
    student: 'Estudiante',
    tutor: 'Tutor',
    formation: 'Formación',
    finalEvaluation: 'Evaluación Final',
    evaluationDate: 'Fecha',
    performanceRating: 'Valoración',
    institution: 'Institución',
    apto: 'Apto',
    noApto: 'No Apto',
    performanceRatingScore: '{{rating}}/10',
    deleteEvaluationConfirmationTitle: '¿Eliminar valoración?',
    deleteEvaluationConfirmationDescription: 'Esta acción no se puede deshacer. Se eliminará permanentemente la valoración de {{studentName}} {{studentLastName}}.',
    noEvaluationsRegistered: 'No hay valoraciones de prácticas registradas',
    generateLinkToStartReceivingEvaluations: 'Genera un enlace para comenzar a recibir valoraciones',
    evaluationDeletedToastTitle: 'Valoración eliminada',
    evaluationDeletedToastDescription: 'La valoración de prácticas ha sido eliminada correctamente',
    errorDeletingEvaluationToastTitle: 'Error al eliminar',
    errorDeletingEvaluationToastDescription: 'No se pudo eliminar la valoración de prácticas',
    linkCopiedToClipboardToastTitle: 'Enlace copiado al portapapeles',
    linkCopiedToClipboardToastDescription: 'Comparte este enlace para que se complete la valoración de prácticas',
    exportFunctionComingSoonTitle: 'Función de exportación',
    exportFunctionComingSoonDescription: 'Esta función se implementará próximamente',
    importFunctionComingSoonTitle: 'Función de importación',
    importFunctionComingSoonDescription: 'Esta función se implementará próximamente',

    // N U E V A S   T R A D U C C I O N E S   P A R A   ActivePropertyForm y CreateWorkCenterModal
    addActivePropertyTitle: 'Agregar Inmueble Activo',
    activePropertyInfoTitle: 'Información del Inmueble Activo',
    requiredFieldsError: 'Por favor, completa todos los campos obligatorios',
    addWorkerError: 'Debe agregar al menos un trabajador con nombre y DNI',
    specifyCustomCompanyError: 'Por favor, especifica la empresa personalizada',
    propertyAddedSuccess: 'Inmueble activo agregado correctamente',
    errorAddingProperty: 'Error al agregar el inmueble activo',
    idLabel: 'ID',
    numRoomsLabel: 'Nº Habitaciones',
    workersLabel: 'Trabajadores',
    addWorkerButton: 'Agregar',
    workerNamePlaceholder: 'Nombre del trabajador',
    dniPlaceholder: 'DNI',
    removeWorkerButton: 'Eliminar',
    geeCompanyLabel: 'Empresa GEE',
    selectCompanyPlaceholder: 'Seleccionar empresa',
    otherCompanyOption: 'OTRA', // El valor del SelectItem puede ser la clave de traducción
    specifyCompanyPlaceholder: 'Especificar empresa',
    propertyStatusLabel: 'Estado del Piso',
    occupiedStatus: 'Ocupado',
    emptyStatus: 'Vacío',
    addressLabel: 'Dirección',
    addressPlaceholder: 'Ej: C/ Isaac Peral, 37, 3ºB',
    cityLabel: 'Población',
    provinceLabel: 'Provincia',
    ccaaLabel: 'CCAA',
    originProvinceLabel: 'Provincia de Origen',
    annualCostLabel: 'Coste Anual (€)',
    occupancyDateLabel: 'Fecha de Ocupación',
    selectDate: 'Seleccionar fecha',
    contractStartDateLabel: 'Fecha Inicio de Contrato',
    meta4CodeLabel: 'Cod. Meta 4',
    meta4CodePlaceholder: 'Ej: 39-5',
    projectContractLabel: 'Contrato Proyecto',
    projectContractPlaceholder: 'Ej: 06005',
    workCenterCodeLabel: 'Código Centro Trabajo',
    selectWorkCenterPlaceholder: 'Seleccione un centro de trabajo',
    addWorkCenterButtonTitle: 'Añadir nuevo centro de trabajo',
    saving: 'Guardando...',
    saveProperty: 'Guardar Inmueble',
    // Para CreateWorkCenterModal
    createWorkCenterTitle: 'Crear Nuevo Centro de Trabajo',
    workCenterNameLabel: 'Nombre del Centro',
    workCenterNamePlaceholder: 'Ej: Hospital General',
    workCenterCodeInputLabel: 'Código del Centro',
    workCenterCodeInputPlaceholder: 'Ej: HOGE001',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Descripción opcional del centro de trabajo',
    errorLoadingWorkCenters: 'Error al cargar los centros de trabajo.',
    workCenterCreatedSuccess: 'Centro de trabajo creado correctamente.',
    errorCreatingWorkCenter: 'Error al crear el centro de trabajo.',
    onAddPropertyNotDefined: 'onAddProperty no está definido'
  },
  en: {
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    operations: 'Operations',
    costAnalysisShort: 'Cost Analysis',
    costAnalysis: 'Cost Analysis',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'Technical Mgmt',
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendars',
    checkers: 'Checkers',
    homeMenu: 'Home',
    users: 'Users',
    talentManagement: 'Talent Management',
    talentManagementShort: 'Talent',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
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
    documentGenerated: 'Document Generated',
    recordNotFound: 'Record not found',
    employeeInformation: 'Employee Information',
    employeeLastName: 'Last Name',
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
    comingSoonDescription: 'This feature will be available soon.',
    comingSoonDescriptionComprobadores: 'Checkers will be available soon.',
    workCenter: 'Work Center',
    profile: 'Profile',
    welcome: 'Welcome to GEESTOR',
    loginSubtitle: 'Enjoy all the processes at your fingertips.',
    loginButton: 'Sign In',
    featureTitleComprobadores: 'Checkers',
    comingSoon: 'Coming Soon',
    confirm: 'Confirm',
    calendar: 'Calendar',
    analysis: 'Analysis',
    hospitalInventory: 'Hospital Inventory',
    maintenanceSchedule: 'Maintenance Schedule',
    processFiles: 'Process Files',
    uploadFiles: 'Upload Files',
    missingMaintenanceMessage: 'There are denominations without assigned maintenances',
    completeFirst: 'Complete first',
    activeProperties: 'Active Properties',
    inactiveProperties: 'Inactive Properties',
    realEstateDashboard: 'Real Estate Dashboard',
    viewTables: 'View Tables',
    totalProperties: 'Total Properties',
    annualCost: 'Annual Cost',
    exportPDF: 'Export PDF',
    realEstateDetails: 'Real Estate Details',
    detailViewPlaceholder: 'Real estate detail view',
    userProfile: 'User Profile',
    personalInformation: 'Personal Information',
    changePhoto: 'Change Photo',
    email: 'Email',
    permissions: 'Permissions',
    permissionsDescription: 'User permissions in the system',
    departmentPermissions: 'Department Permissions',
    actionPermissions: 'Action Permissions',
    create: 'Create',
    modify: 'Modify',
    delete: 'Delete',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    suggestionsReviewTitle: 'Review AI Suggestions',
    verifyingAccount: 'Verifying account...',
    loading: 'Loading...',
    name: 'Name',
    settings: 'Settings',
    maintenanceCalendar: 'Maintenance Calendar',
    generateCalendar: 'Generate Calendar',
    inventory: 'Inventory',
    missingMaintenanceTitle: 'Missing Maintenances',
    generateAnyway: 'Generate Anyway',
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    logout: 'Logout',
    upload: 'Upload',
    arrastraArchivo: 'Drag your file here',
    mensajeCsvInventario: 'Upload an Excel or CSV file with your medical equipment inventory',
    mensajeCsvMantenimmiento: 'Upload an Excel or CSV file with the maintenance schedule',
    formatosCsv: 'Supported formats: Excel (.xlsx, .xls) and CSV (.csv)',
    usersGestion: 'User Management',
    userGestSub: 'Manage users and their permissions in the system',
    recargar: 'Update',
    buscadorUsers: 'Search for users by name or email...',
    listaUsers: 'User List',
    tituloAnalisis: 'Professional Cost Analysis',
    subtiAnalisis: 'Comprehensive analysis of electromedicine tenders with specialized AI',
    subirPdf: 'Upload Files',
    informepdf: 'Report',
    costespdf: 'Costs',
    puntuacionPdf: 'Score',
    asistChat: 'Analysis Assistant',
    bienvenidaChat: 'Hello! I\'m Geenio, your tender analysis assistant. How can I help you?',
    entrevistaTit: 'Exit Interviews',
    generarEnla1: 'Generate Link',
    exportarEntre: 'Export',
    importarEntre: 'Import',

    // Cost Analysis specific translations
    errorAnalyzingCosts: 'Error analyzing costs',
    chatbotContextUpdated: 'Chatbot context updated',
    pcapFileLabel: 'PCAP File',
    pcapFileTitle: 'Particular Administrative Conditions Document',
    pcapFileDescription: 'Upload the PCAP file from the tender',
    pptFileLabel: 'PPT File',
    pptFileTitle: 'Technical Prescriptions Document',
    pptFileDescription: 'Upload the PPT file from the tender',
    professionalCostAnalysisTitle: 'Professional Cost Analysis',
    filesReadyForAnalysis: 'Files ready for analysis',
    analysisDescription: 'The system will analyze both documents to generate a complete report',
    analyzingWithAI: 'Analyzing with AI...',
    startProfessionalCostAnalysis: 'Start Professional Cost Analysis',
    analysisErrorTitle: 'Analysis error',

    exitInterviewsLoaded: 'Exit interviews loaded',
    errorLoadingExitInterviews: 'Error loading exit interviews',
    linkCopiedTitle: 'Link Copied',
    linkCopiedDescription: 'The exit interview link has been copied to the clipboard.',
    errorCopyingLinkTitle: 'Error Copying Link',
    errorCopyingLinkDescription: 'The link could not be copied. Please copy it manually: ',
    interviewDuplicatedTitle: 'Interview Duplicated',
    interviewDuplicatedDescription: 'The exit interview has been successfully duplicated.',
    errorDuplicatingTitle: 'Error Duplicating',
    errorDuplicatingDescription: 'Could not duplicate the exit interview.',
    confirmDeleteInterview: 'Are you sure you want to delete this exit interview?',
    interviewDeletedTitle: 'Interview Deleted',
    interviewDeletedDescription: 'The exit interview has been successfully deleted.',
    errorDeletingTitle: 'Error Deleting',
    errorDeletingDescription: 'Could not delete the exit interview.',
    functionNotImplementedTitle: 'Function Not Implemented',
    downloadPdfNotAvailable: 'PDF download for this interview is not yet available.',
    noDataTitle: 'No Data',
    noDataToExportDescription: 'There are no exit interviews to export.',
    exportCompletedTitle: 'Export Completed',
    exportCompletedDescription: 'Exit interviews have been successfully exported.',
    importNotAvailable: 'Data import is not yet available.',
    errorLoadingData: 'Error loading data',
    tryAgain: 'Try again',
    loadingExitInterviews: 'Loading exit interviews...',
    noExitInterviewsFound: 'No exit interviews found',
    generateLinkToStart: 'Generate a link to start receiving exit interviews.',
    importData: 'Import Data',
    positionShort: 'Position',
    workCenterShort: 'Center',
    exitType: 'Exit Type',
    exitDate: 'Exit Date',
    viewDetails: 'View details',
    duplicate: 'Duplicate',
    voluntary: 'Voluntary',
    leaveOfAbsence: 'Leave of Absence',
    invalidDate: 'Invalid date',
    showingRecords: 'Showing {{start}} to {{end}} of {{total}} records',
    previous: 'Previous',
    next: 'Next',
    typeOfLeave: 'Type of Leave',
    errorLoadingUsers: 'Error loading users',
    userPermissionsUpdatedSuccessfully: 'User permissions updated successfully',
    errorUpdatingUserPermissions: 'Error updating user permissions',
    yes: 'Yes',
    no: 'No',
    usersCount: '{{count}} users',
    editPermissions: 'Edit Permissions',
    swipeToViewMore: 'Swipe to view more',
    botErrorResponse: 'Sorry, an error occurred. Please try again.',
    greetingHello: 'Hello',
    greetingGoodMorning: 'Good morning',
    greetingGoodAfternoon: 'Good afternoon',
    greetingGoodEvening: 'Good evening',
    greetingHowAreYou: 'How are you?',
    greetingIAmFine: 'I\'m fine',
    greetingThanks: 'Thanks',
    greetingYouAreWelcome: 'You\'re welcome',
    helpMessage: 'How can I help you?',
    aiSystemPrompt: 'You are Geenio, the specialized assistant for electromedicine tender analysis at Grupo Empresarial Electromédico (GEE).',
    processingErrorMessage: 'Error processing your request',
    openGeenioChatbot: 'Open Geenio chat',
    thinking: 'Thinking...',
    typeYourMessage: 'Type your message...',
    send: 'Send',

    valoPracTit: 'Internship Assessment',
    valoPracSub: 'Manages the evaluations of practices carried out by GEE tutors',
    generarEnlaceVal: 'Generate Assessment Link',
    student: 'Student',
    tutor: 'Tutor',
    formation: 'Formation',
    finalEvaluation: 'Final Assessment',
    evaluationDate: 'Date',
    performanceRating: 'Rating',
    institution: 'Institution',
    apto: 'Apt',
    noApto: 'Not Apt',
    performanceRatingScore: '{{rating}}/10',
    deleteEvaluationConfirmationTitle: 'Delete assessment?',
    deleteEvaluationConfirmationDescription: 'This action cannot be undone. The assessment for {{studentName}} {{studentLastName}} will be permanently deleted.',
    noEvaluationsRegistered: 'No internship assessments registered',
    generateLinkToStartReceivingEvaluations: 'Generate a link to start receiving assessments',
    evaluationDeletedToastTitle: 'Assessment deleted',
    evaluationDeletedToastDescription: 'The internship assessment has been successfully deleted',
    errorDeletingEvaluationToastTitle: 'Error deleting',
    errorDeletingEvaluationToastDescription: 'Could not delete the internship assessment',
    linkCopiedToClipboardToastTitle: 'Link copied to clipboard',
    linkCopiedToClipboardToastDescription: 'Share this link for internship assessment completion',
    exportFunctionComingSoonTitle: 'Export function',
    exportFunctionComingSoonDescription: 'This function will be implemented soon',
    importFunctionComingSoonTitle: 'Import function',
    importFunctionComingSoonDescription: 'This function will be implemented soon',

    // N E W   T R A N S L A T I O N S   P A R A   ActivePropertyForm y CreateWorkCenterModal
    addActivePropertyTitle: 'Add Active Property',
    activePropertyInfoTitle: 'Active Property Information',
    requiredFieldsError: 'Please complete all required fields',
    addWorkerError: 'You must add at least one worker with name and DNI',
    specifyCustomCompanyError: 'Please specify the custom company',
    propertyAddedSuccess: 'Active property added successfully',
    errorAddingProperty: 'Error adding active property',
    idLabel: 'ID',
    numRoomsLabel: 'Number of Rooms',
    workersLabel: 'Workers',
    addWorkerButton: 'Add',
    workerNamePlaceholder: 'Worker Name',
    dniPlaceholder: 'DNI',
    removeWorkerButton: 'Remove',
    geeCompanyLabel: 'GEE Company',
    selectCompanyPlaceholder: 'Select company',
    otherCompanyOption: 'OTHER',
    specifyCompanyPlaceholder: 'Specify company',
    propertyStatusLabel: 'Property Status',
    occupiedStatus: 'Occupied',
    emptyStatus: 'Empty',
    addressLabel: 'Address',
    addressPlaceholder: 'E.g.: 123 Main St, Apt 4B',
    cityLabel: 'City',
    provinceLabel: 'Province',
    ccaaLabel: 'Autonomous Community',
    originProvinceLabel: 'Origin Province',
    annualCostLabel: 'Annual Cost (€)',
    occupancyDateLabel: 'Occupancy Date',
    selectDate: 'Select date',
    contractStartDateLabel: 'Contract Start Date',
    meta4CodeLabel: 'Meta 4 Code',
    meta4CodePlaceholder: 'E.g.: 39-5',
    projectContractLabel: 'Project Contract',
    projectContractPlaceholder: 'E.g.: 06005',
    workCenterCodeLabel: 'Work Center Code',
    selectWorkCenterPlaceholder: 'Select a work center',
    addWorkCenterButtonTitle: 'Add new work center',
    saving: 'Saving...',
    saveProperty: 'Save Property',
    // Para CreateWorkCenterModal
    createWorkCenterTitle: 'Create New Work Center',
    workCenterNameLabel: 'Center Name',
    workCenterNamePlaceholder: 'E.g.: General Hospital',
    workCenterCodeInputLabel: 'Center Code',
    workCenterCodeInputPlaceholder: 'E.g.: HOGE001',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Optional description of the work center',
    errorLoadingWorkCenters: 'Error loading work centers.',
    workCenterCreatedSuccess: 'Work center created successfully.',
    errorCreatingWorkCenter: 'Error creating work center.',
    onAddPropertyNotDefined: 'onAddProperty is not defined'
  }
};
