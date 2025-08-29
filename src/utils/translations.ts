export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export interface Translations {
  // Common
  back: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  confirm: string;
  confirmButton: string;
  yes: string;
  no: string;
  loading: string;
  error: string;
  success: string;
  processing: string;
  saving: string;
  close: string;
  open: string;
  clear: string;
  clearButton: string;
  add: string;
  remove: string;
  search: string;
  filter: string;
  export: string;
  import: string;
  upload: string;
  download: string;
  view: string;
  details: string;
  actions: string;
  status: string;
  date: string;
  name: string;
  description: string;
  selectDate: string;
  selectAll: string;
  deselectAll: string;
  required: string;
  optional: string;
  send: string;
  
  // Navigation and Menu
  homeMenu: string;
  users: string;
  operations: string;
  technicalManagement: string;
  technicalManagementShort: string;
  talentManagement: string;
  talentManagementShort: string;
  
  // Operations
  costAnalysis: string;
  costAnalysisShort: string;
  
  // Technical Management
  calendarManagement: string;
  calendarManagementShort: string;
  checkers: string;
  
  // Talent Management
  contractRequests: string;
  changeSheets: string;
  employeeAgreements: string;
  realEstateManagement: string;
  practiceEvaluation: string;
  exitInterviews: string;
  
  // Chatbot
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
  
  // Error messages
  requiredFieldsError: string;
  errorLoadingData: string;
  errorSavingData: string;
  errorDeletingData: string;
  errorLoadingWorkCenters: string;
  errorCreatingWorkCenter: string;
  errorUpdatingWorkCenter: string;
  errorAddingProperty: string;
  
  // Success messages
  dataSavedSuccess: string;
  dataDeletedSuccess: string;
  workCenterCreatedSuccess: string;
  workCenterUpdatedSuccess: string;
  propertyAddedSuccess: string;
  
  // Work Centers
  createWorkCenterTitle: string;
  workCenterNameLabel: string;
  workCenterNamePlaceholder: string;
  workCenterIdLabel: string;
  workCenterIdPlaceholder: string;
  workCenterCodeLabel: string;
  selectWorkCenterPlaceholder: string;
  addWorkCenterButtonTitle: string;
  uploadCenterButton: string;
  confirmCreationTitle: string;
  confirmCreationDescription: string;
  workCenterExistsTitle: string;
  workCenterExistsDescription: string;
  leaveAsIsButton: string;
  updateRecordButton: string;
  
  // Real Estate
  addActivePropertyTitle: string;
  activePropertyInfoTitle: string;
  idLabel: string;
  numRoomsLabel: string;
  workersLabel: string;
  addWorkerButton: string;
  workerNamePlaceholder: string;
  dniPlaceholder: string;
  removeWorkerButton: string;
  addWorkerError: string;
  geeCompanyLabel: string;
  selectCompanyPlaceholder: string;
  otherCompanyOption: string;
  specifyCompanyPlaceholder: string;
  specifyCustomCompanyError: string;
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
  meta4CodeLabel: string;
  meta4CodePlaceholder: string;
  projectContractLabel: string;
  projectContractPlaceholder: string;
  saveProperty: string;
  activeProperties: string;
  inactiveProperties: string;
  
  // Dashboard
  totalPortfolio: string;
  notImplemented: string;
  
  // Exit Interviews
  voluntary: string;
  leaveOfAbsence: string;
  
  // Additional missing keys
  changeSheetsManagement: string;
  createNew: string;
  hojasCambio: string;
  employeeName: string;
  employeeLastName: string;
  originCenter: string;
  startDate: string;
  endDate: string;
  duplicateRecord: string;
  downloadPDF: string;
  generatedOn: string;
  documentGenerated: string;
  recordNotFound: string;
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
  employeeInformation: string;
  position: string;
  department: string;
  agreementDetails: string;
  agreementType: string;
  salary: string;
  benefitsAndConditions: string;
  benefits: string;
  conditions: string;
  observations: string;
  employeeAgreementDetails: string;
  workCenter: string;
  exitInterviewDetails: string;
  personalInformation: string;
  lastName: string;
  company: string;
  leaveDetails: string;
  leaveType: string;
  leaveDate: string;
  reason: string;
  feedback: string;
  satisfaction: string;
  workEnvironment: string;
  professionalDevelopment: string;
  compensation: string;
  managementSupport: string;
  wouldRecommend: string;
  wouldReturn: string;
  recommendations: string;
  additionalComments: string;
  practiceEvaluationDetails: string;
  studentInformation: string;
  studentName: string;
  studentId: string;
  practiceDetails: string;
  practiceType: string;
  practiceCenter: string;
  supervisor: string;
  evaluationCriteria: string;
  technicalSkills: string;
  communicationSkills: string;
  teamwork: string;
  initiative: string;
  punctuality: string;
  overallPerformance: string;
  evaluationComments: string;
  finalGrade: string;
  contractRequestDetails: string;
  requestInformation: string;
  requestId: string;
  requestDate: string;
  requestedPosition: string;
  contractType: string;
  requestStatus: string;
  candidateInformation: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateExperience: string;
  positionDetails: string;
  proposedSalary: string;
  expectedStartDate: string;
  justification: string;
  approvalInformation: string;
  approvedBy: string;
  approvalDate: string;
  approvalComments: string;
  changeSheetsDetails: string;
  currentPosition: string;
  newPosition: string;
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  newSupervisorName: string;
  newSupervisorLastName: string;
  changeType: string;
  currentCompany: string;
  companyChange: string;
  needs: string;

  // Exit Interviews specific keys
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
  entrevistaTit: string;
  recargar: string;
  generarEnla1: string;
  exportarEntre: string;
  importarEntre: string;
  tryAgain: string;
  loadingExitInterviews: string;
  noExitInterviewsFound: string;
  generateLinkToStart: string;
  importData: string;
  positionShort: string;
  workCenterShort: string;
  exitType: string;
  exitDate: string;
  duplicate: string;
  invalidDate: string;
  showingRecords: string;
  previous: string;
  next: string;
  viewDetails: string;
  profile: string;
  settings: string;
  welcome: string;
  loginSubtitle: string;
  loginButton: string;
  maintenanceCalendar: string;
  featureTitleComprobadores: string;
  comingSoonDescriptionComprobadores: string;
  comingSoon: string;
  generateCalendar: string;
  calendar: string;
  analysis: string;
  hospitalInventory: string;
  maintenanceSchedule: string;
  inventory: string;
  processFiles: string;
  uploadFiles: string;
  arrastraArchivo: string;
  formatosCsv: string;
  missingMaintenanceTitle: string;
  missingMaintenanceMessage: string;
  generateAnyway: string;
  completeFirst: string;
  valoPracTit: string;
  institution: string;
  formation: string;
  tutor: string;
  tutorName: string;
  tutorLastName: string;
  tutorPhone: string;
  tutorEmail: string;
  evaluation: string;
  siNo: string;
  totalScore: string;
  practiceEvaluationTitle: string;
  noEvaluationsFound: string;
  metodologia: string;
  areaImpacto: string;
  porcentageDescount: string;
  userNotFoundTitle: string;
  userNotFoundDescription: string;
  passwordResetSent: string;
  actionCodeExpired: string;
  passwordResetComplete: string;
  enterNewPasswordTitle: string;
  newPassword: string;
  confirmPassword: string;
  resetPassword: string;
  passwordsDoNotMatch: string;
  passwordTooWeak: string;
  invalidEmail: string;
  emailAlreadyInUse: string;
  userDisabled: string;
  tooManyRequests: string;
  networkRequestFailed: string;
  internalError: string;
  forgotPasswordTitle: string;
  forgotPasswordInstructions: string;
  emailAddress: string;
  sendResetLink: string;
  backToLogin: string;
  accountVerificationTitle: string;
  verificationEmailSent: string;
  checkYourEmail: string;
  resendVerificationEmail: string;
  verificationEmailResent: string;
  documentStatus: string;
  configuration: string;
  language: string;
  spanish: string;
  english: string;
  appearance: string;
  lightMode: string;
  darkMode: string;

  // Practice Evaluations missing keys
  finalEvaluation: string;
  evaluationDate: string;
  performanceRating: string;
  linkCopiedToClipboardToastTitle: string;
  linkCopiedToClipboardToastDescription: string;
  evaluationDeletedToastTitle: string;
  evaluationDeletedToastDescription: string;
  errorDeletingEvaluationToastTitle: string;
  errorDeletingEvaluationToastDescription: string;
  exportFunctionComingSoonTitle: string;
  exportFunctionComingSoonDescription: string;
  importFunctionComingSoonTitle: string;
  importFunctionComingSoonDescription: string;
  valoPracSub: string;
  generarEnlaceVal: string;
  noEvaluationsRegistered: string;
  generateLinkToStartReceivingEvaluations: string;
  student: string;
  performanceRatingScore: string;
  deleteEvaluationConfirmationTitle: string;
  deleteEvaluationConfirmationDescription: string;

  // Real Estate missing keys
  selectPropertyType: string;
  propertyTypeLabel: string;
  selectTypePlaceholder: string;
  activeProperty: string;
  inactiveProperty: string;
  accept: string;
  errorLoadingDashboardData: string;
  realEstateDashboard: string;
  realEstateManagementDescription: string;
  addProperty: string;
  importDataButton: string;
  viewTables: string;
  propertiesOperational: string;
  propertiesPaused: string;
  totalProperties: string;

  // Additional Real Estate KPI keys
  totalRoomsKPI: string;
  availableRooms: string;
  annualTotalCostKPI: string;
  operatingExpenses: string;
  averageCostKPI: string;
  perProperty: string;
  annualCostByProvince: string;
  annualCost: string;
  propertyStatus: string;
  properties: string;
  exportPDF: string;
  realEstateDetails: string;
  detailViewPlaceholder: string;

  // Settings and Profile keys
  theme: string;
  light: string;
  dark: string;
  userProfile: string;
  changePhoto: string;
  email: string;
  permissions: string;
  permissionsDescription: string;
  departmentPermissions: string;
  actionPermissions: string;
  create: string;
  modify: string;
  logout: string;
  saveChanges: string;

  // Users Management keys
  errorLoadingUsers: string;
  userPermissionsUpdatedSuccessfully: string;
  errorUpdatingUserPermissions: string;
  usersGestion: string;
  userGestSub: string;
  buscadorUsers: string;
  listaUsers: string;
  usersCount: string;
  editPermissions: string;
  swipeToViewMore: string;
  verifyingAccount: string;

  // Translation values for evaluation statuses
  Apto: string;
  'No Apto': string;
  Apt: string;
  'Not Apt': string;
}

export const translations: Record<Language, Translations> = {
  es: {
    back: 'Atrás',
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    confirmButton: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    processing: 'Procesando...',
    saving: 'Guardando...',
    close: 'Cerrar',
    open: 'Abrir',
    clear: 'Limpiar',
    clearButton: 'Limpiar',
    add: 'Agregar',
    remove: 'Eliminar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    upload: 'Subir',
    download: 'Descargar',
    view: 'Ver',
    details: 'Detalles',
    actions: 'Acciones',
    status: 'Estado',
    date: 'Fecha',
    name: 'Nombre',
    description: 'Descripción',
    selectDate: 'Seleccionar fecha',
    selectAll: 'Seleccionar todo',
    deselectAll: 'Deseleccionar todo',
    required: 'Requerido',
    optional: 'Opcional',
    send: 'Enviar',
    homeMenu: 'Inicio',
    users: 'Usuarios',
    operations: 'Operaciones',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'G. Técnica',
    talentManagement: 'Gestión de Talento',
    talentManagementShort: 'G. Talento',
    costAnalysis: 'Análisis de Costes',
    costAnalysisShort: 'A. Costes',
    calendarManagement: 'Gestión de Calendario',
    calendarManagementShort: 'G. Calendario',
    checkers: 'Comprobadores',
    contractRequests: 'Solicitudes de Contratación',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdos de Empleado',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Valoración de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    botErrorResponse: 'Lo siento, hubo un error procesando tu solicitud.',
    greetingHello: '¡Hola! Soy Geenio, tu asistente de IA. ¿En qué puedo ayudarte hoy?',
    greetingGoodMorning: '¡Buenos días! ¿Cómo puedo asistirte hoy?',
    greetingGoodAfternoon: '¡Buenas tardes! ¿En qué puedo ayudarte?',
    greetingGoodEvening: '¡Buenas noches! ¿Necesitas ayuda con algo?',
    greetingHowAreYou: '¡Muy bien, gracias! ¿Cómo puedo ayudarte hoy?',
    greetingIAmFine: 'Me alegra saber que estás bien. ¿En qué puedo asistirte?',
    greetingThanks: '¡De nada! Estoy aquí para ayudarte siempre que lo necesites.',
    greetingYouAreWelcome: '¡Es un placer ayudarte! ¿Hay algo más en lo que pueda asistirte?',
    helpMessage: 'Puedo ayudarte con análisis de licitaciones, preguntas sobre la aplicación y más. ¿Qué necesitas?',
    aiSystemPrompt: 'Eres Geenio, un asistente de IA especializado en análisis de licitaciones y gestión empresarial del Grupo Empresarial Electromédico (GEE). Eres profesional, útil y tienes conocimientos profundos sobre análisis de costes, gestión de proyectos y procesos de licitación. Responde de manera clara y concisa.',
    processingErrorMessage: 'Lo siento, hubo un error procesando tu mensaje. Por favor, inténtalo de nuevo.',
    openGeenioChatbot: 'Abrir chatbot Geenio',
    asistChat: 'Asistente de Chat',
    bienvenidaChat: '¡Hola! Soy Geenio, tu asistente de IA. Pregúntame sobre análisis de licitaciones o cualquier otra cosa.',
    thinking: 'Pensando',
    typeYourMessage: 'Escribe tu mensaje...',
    requiredFieldsError: 'Por favor complete todos los campos requeridos',
    errorLoadingData: 'Error al cargar los datos',
    errorSavingData: 'Error al guardar los datos',
    errorDeletingData: 'Error al eliminar los datos',
    errorLoadingWorkCenters: 'Error al cargar los centros de trabajo',
    errorCreatingWorkCenter: 'Error al crear el centro de trabajo',
    errorUpdatingWorkCenter: 'Error al actualizar el centro de trabajo',
    errorAddingProperty: 'Error al agregar la propiedad',
    dataSavedSuccess: 'Datos guardados correctamente',
    dataDeletedSuccess: 'Datos eliminados correctamente',
    workCenterCreatedSuccess: 'Centro de trabajo creado correctamente',
    workCenterUpdatedSuccess: 'Centro de trabajo actualizado correctamente',
    propertyAddedSuccess: 'Propiedad agregada correctamente',
    createWorkCenterTitle: 'Crear Centro de Trabajo',
    workCenterNameLabel: 'Nombre del Centro',
    workCenterNamePlaceholder: 'Ingrese el nombre del centro',
    workCenterIdLabel: 'ID del Centro',
    workCenterIdPlaceholder: 'Ingrese el ID del centro',
    workCenterCodeLabel: 'Código Centro de Trabajo',
    selectWorkCenterPlaceholder: 'Seleccionar centro de trabajo',
    addWorkCenterButtonTitle: 'Agregar nuevo centro de trabajo',
    uploadCenterButton: 'Subir Centro',
    confirmCreationTitle: 'Confirmar Creación',
    confirmCreationDescription: 'Se creará un nuevo centro de trabajo con el nombre {{name}} y el ID {{id}}',
    workCenterExistsTitle: 'Centro de Trabajo Existe',
    workCenterExistsDescription: 'Ya existe un centro de trabajo con el ID {{id}}',
    leaveAsIsButton: 'Dejar como está',
    updateRecordButton: 'Actualizar registro',
    addActivePropertyTitle: 'Agregar Propiedad Activa',
    activePropertyInfoTitle: 'Información de la Propiedad',
    idLabel: 'ID',
    numRoomsLabel: 'Número de Habitaciones',
    workersLabel: 'Trabajadores',
    addWorkerButton: 'Agregar Trabajador',
    workerNamePlaceholder: 'Nombre del trabajador',
    dniPlaceholder: 'DNI del trabajador',
    removeWorkerButton: 'Eliminar',
    addWorkerError: 'Debe agregar al menos un trabajador válido',
    geeCompanyLabel: 'Empresa GEE',
    selectCompanyPlaceholder: 'Seleccionar empresa',
    otherCompanyOption: 'Otra',
    specifyCompanyPlaceholder: 'Especificar empresa',
    specifyCustomCompanyError: 'Debe especificar el nombre de la empresa',
    propertyStatusLabel: 'Estado del Piso',
    occupiedStatus: 'Ocupado',
    emptyStatus: 'Vacío',
    addressLabel: 'Dirección',
    addressPlaceholder: 'Dirección completa',
    cityLabel: 'Población',
    provinceLabel: 'Provincia',
    ccaaLabel: 'CCAA Destino',
    originProvinceLabel: 'Provincia de Origen',
    annualCostLabel: 'Coste Anual',
    occupancyDateLabel: 'Fecha de Ocupación',
    contractStartDateLabel: 'Fecha Inicio Contrato',
    meta4CodeLabel: 'Código Meta 4',
    meta4CodePlaceholder: 'Código Meta 4',
    projectContractLabel: 'Contrato Proyecto',
    projectContractPlaceholder: 'Contrato Proyecto',
    saveProperty: 'Guardar Propiedad',
    activeProperties: 'Propiedades Activas',
    inactiveProperties: 'Propiedades Inactivas',
    totalPortfolio: 'Cartera Total',
    notImplemented: 'Funcionalidad no implementada',
    voluntary: 'Voluntaria',
    leaveOfAbsence: 'Excedencia',
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    createNew: 'Crear Nuevo',
    hojasCambio: 'Hojas de Cambio',
    employeeName: 'Nombre del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    originCenter: 'Centro de Origen',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    generatedOn: 'Generado el',
    documentGenerated: 'Documento generado',
    recordNotFound: 'Registro no encontrado',
    errorAnalyzingCosts: 'Error analizando costes',
    chatbotContextUpdated: 'Contexto del chatbot actualizado',
    tituloAnalisis: 'Análisis Profesional de Costes',
    subtiAnalisis: 'Sube los documentos de licitación para obtener un análisis detallado',
    subirPdf: 'Subir PDF',
    informepdf: 'Informe PDF',
    costespdf: 'Costes PDF',
    puntuacionPdf: 'Puntuación PDF',
    pcapFileLabel: 'Archivo PCAP',
    pcapFileTitle: 'Pliego de Condiciones',
    pcapFileDescription: 'Documento con las condiciones de la licitación',
    pptFileLabel: 'Archivo PPT',
    pptFileTitle: 'Pliego de Prescripciones Técnicas',
    pptFileDescription: 'Especificaciones técnicas del proyecto',
    professionalCostAnalysisTitle: 'Análisis Profesional de Costes',
    filesReadyForAnalysis: 'Archivos listos para análisis',
    analysisDescription: 'Los documentos han sido cargados y están listos para el análisis profesional.',
    analyzingWithAI: 'Analizando con IA...',
    startProfessionalCostAnalysis: 'Iniciar Análisis Profesional de Costes',
    analysisErrorTitle: 'Error en el Análisis',
    employeeInformation: 'Información del Empleado',
    position: 'Posición',
    department: 'Departamento',
    agreementDetails: 'Detalles del Acuerdo',
    agreementType: 'Tipo de Acuerdo',
    salary: 'Salario',
    benefitsAndConditions: 'Beneficios y Condiciones',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    employeeAgreementDetails: 'Detalles del Acuerdo de Empleado',
    workCenter: 'Centro de Trabajo',
    exitInterviewDetails: 'Detalles de la Entrevista de Salida',
    personalInformation: 'Información Personal',
    lastName: 'Apellidos',
    company: 'Empresa',
    leaveDetails: 'Detalles de la Salida',
    leaveType: 'Tipo de Salida',
    leaveDate: 'Fecha de Salida',
    reason: 'Motivo',
    feedback: 'Retroalimentación',
    satisfaction: 'Satisfacción',
    workEnvironment: 'Ambiente de Trabajo',
    professionalDevelopment: 'Desarrollo Profesional',
    compensation: 'Compensación',
    managementSupport: 'Apoyo de la Gerencia',
    wouldRecommend: 'Recomendaría',
    wouldReturn: 'Volvería',
    recommendations: 'Recomendaciones',
    additionalComments: 'Comentarios Adicionales',
    practiceEvaluationDetails: 'Detalles de la Evaluación de Prácticas',
    studentInformation: 'Información del Estudiante',
    studentName: 'Nombre del Estudiante',
    studentId: 'ID del Estudiante',
    practiceDetails: 'Detalles de las Prácticas',
    practiceType: 'Tipo de Prácticas',
    practiceCenter: 'Centro de Prácticas',
    supervisor: 'Supervisor',
    evaluationCriteria: 'Criterios de Evaluación',
    technicalSkills: 'Habilidades Técnicas',
    communicationSkills: 'Habilidades de Comunicación',
    teamwork: 'Trabajo en Equipo',
    initiative: 'Iniciativa',
    punctuality: 'Puntualidad',
    overallPerformance: 'Rendimiento General',
    evaluationComments: 'Comentarios de Evaluación',
    finalGrade: 'Calificación Final',
    contractRequestDetails: 'Detalles de la Solicitud de Contrato',
    requestInformation: 'Información de la Solicitud',
    requestId: 'ID de la Solicitud',
    requestDate: 'Fecha de Solicitud',
    requestedPosition: 'Posición Solicitada',
    contractType: 'Tipo de Contrato',
    requestStatus: 'Estado de la Solicitud',
    candidateInformation: 'Información del Candidato',
    candidateName: 'Nombre del Candidato',
    candidateEmail: 'Email del Candidato',
    candidatePhone: 'Teléfono del Candidato',
    candidateExperience: 'Experiencia del Candidato',
    positionDetails: 'Detalles de la Posición',
    proposedSalary: 'Salario Propuesto',
    expectedStartDate: 'Fecha de Inicio Esperada',
    justification: 'Justificación',
    approvalInformation: 'Información de Aprobación',
    approvedBy: 'Aprobado por',
    approvalDate: 'Fecha de Aprobación',
    approvalComments: 'Comentarios de Aprobación',
    changeSheetsDetails: 'Detalles de las Hojas de Cambio',
    currentPosition: 'Posición Actual',
    newPosition: 'Nueva Posición',
    currentSupervisorName: 'Nombre del Supervisor Actual',
    currentSupervisorLastName: 'Apellidos del Supervisor Actual',
    newSupervisorName: 'Nombre del Nuevo Supervisor',
    newSupervisorLastName: 'Apellidos del Nuevo Supervisor',
    changeType: 'Tipo de Cambio',
    currentCompany: 'Empresa Actual',
    companyChange: 'Cambio de Empresa',
    needs: 'Necesidades',
    exitInterviewsLoaded: 'Entrevistas de salida cargadas',
    errorLoadingExitInterviews: 'Error al cargar las entrevistas de salida',
    linkCopiedTitle: 'Enlace copiado',
    linkCopiedDescription: 'El enlace ha sido copiado al portapapeles',
    errorCopyingLinkTitle: 'Error al copiar enlace',
    errorCopyingLinkDescription: 'No se pudo copiar el enlace. Enlace:',
    interviewDuplicatedTitle: 'Entrevista duplicada',
    interviewDuplicatedDescription: 'La entrevista ha sido duplicada correctamente',
    errorDuplicatingTitle: 'Error al duplicar',
    errorDuplicatingDescription: 'No se pudo duplicar la entrevista',
    confirmDeleteInterview: '¿Está seguro de que desea eliminar esta entrevista?',
    interviewDeletedTitle: 'Entrevista eliminada',
    interviewDeletedDescription: 'La entrevista ha sido eliminada correctamente',
    errorDeletingTitle: 'Error al eliminar',
    errorDeletingDescription: 'No se pudo eliminar la entrevista',
    functionNotImplementedTitle: 'Función no implementada',
    downloadPdfNotAvailable: 'La descarga de PDF no está disponible',
    noDataTitle: 'Sin datos',
    noDataToExportDescription: 'No hay datos para exportar',
    exportCompletedTitle: 'Exportación completada',
    exportCompletedDescription: 'Los datos han sido exportados correctamente',
    importNotAvailable: 'La importación no está disponible',
    entrevistaTit: 'Entrevistas de Salida',
    recargar: 'Recargar',
    generarEnla1: 'Generar Enlace',
    exportarEntre: 'Exportar',
    importarEntre: 'Importar',
    tryAgain: 'Intentar de nuevo',
    loadingExitInterviews: 'Cargando entrevistas de salida...',
    noExitInterviewsFound: 'No se encontraron entrevistas de salida',
    generateLinkToStart: 'Genere un enlace para comenzar',
    importData: 'Importar datos',
    positionShort: 'Posición',
    workCenterShort: 'Centro',
    exitType: 'Tipo de Salida',
    exitDate: 'Fecha de Salida',
    duplicate: 'Duplicar',
    invalidDate: 'Fecha inválida',
    showingRecords: 'Mostrando {{start}} a {{end}} de {{total}} registros',
    previous: 'Anterior',
    next: 'Siguiente',
    viewDetails: 'Ver Detalles',
    profile: 'Perfil',
    settings: 'Configuración',
    welcome: 'Bienvenido',
    loginSubtitle: 'Ingrese sus credenciales para acceder',
    loginButton: 'Iniciar Sesión',
    maintenanceCalendar: 'Calendario de Mantenimiento',
    featureTitleComprobadores: 'Comprobadores',
    comingSoonDescriptionComprobadores: 'Funcionalidad de comprobadores próximamente disponible',
    comingSoon: 'Próximamente',
    generateCalendar: 'Generar Calendario',
    calendar: 'Calendario',
    analysis: 'Análisis',
    hospitalInventory: 'Inventario Hospitalario',
    maintenanceSchedule: 'Cronograma de Mantenimiento',
    inventory: 'Inventario',
    processFiles: 'Procesar Archivos',
    uploadFiles: 'Subir Archivos',
    arrastraArchivo: 'Arrastra un archivo aquí o haz clic para seleccionar',
    formatosCsv: 'Formatos soportados: CSV, Excel (.xlsx, .xls)',
    missingMaintenanceTitle: 'Mantenimientos Pendientes',
    missingMaintenanceMessage: 'Hay denominaciones sin mantenimientos asignados. ¿Desea continuar?',
    generateAnyway: 'Generar de todos modos',
    completeFirst: 'Completar primero',
    valoPracTit: 'Valoración de Prácticas',
    institution: 'Institución',
    formation: 'Formación',
    tutor: 'Tutor',
    tutorName: 'Nombre del Tutor',
    tutorLastName: 'Apellidos del Tutor',
    tutorPhone: 'Teléfono del Tutor',
    tutorEmail: 'Email del Tutor',
    evaluation: 'Evaluación',
    siNo: 'Sí/No',
    totalScore: 'Puntuación Total',
    practiceEvaluationTitle: 'Evaluación de Prácticas',
    noEvaluationsFound: 'No se encontraron evaluaciones',
    metodologia: 'Metodología',
    areaImpacto: 'Área de Impacto',
    porcentageDescount: 'Porcentaje de Descuento',
    userNotFoundTitle: 'Usuario no encontrado',
    userNotFoundDescription: 'No existe un usuario con ese email',
    passwordResetSent: 'Enlace de restablecimiento enviado',
    actionCodeExpired: 'El código de acción ha expirado',
    passwordResetComplete: 'Contraseña restablecida correctamente',
    enterNewPasswordTitle: 'Ingrese su nueva contraseña',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    resetPassword: 'Restablecer Contraseña',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    passwordTooWeak: 'La contraseña es muy débil',
    invalidEmail: 'Email inválido',
    emailAlreadyInUse: 'Este email ya está en uso',
    userDisabled: 'Usuario deshabilitado',
    tooManyRequests: 'Demasiados intentos. Intente más tarde',
    networkRequestFailed: 'Error de conexión',
    internalError: 'Error interno del servidor',
    forgotPasswordTitle: '¿Olvidó su contraseña?',
    forgotPasswordInstructions: 'Ingrese su email para recibir un enlace de restablecimiento',
    emailAddress: 'Dirección de Email',
    sendResetLink: 'Enviar Enlace',
    backToLogin: 'Volver al Login',
    accountVerificationTitle: 'Verificación de Cuenta',
    verificationEmailSent: 'Email de verificación enviado',
    checkYourEmail: 'Revise su email',
    resendVerificationEmail: 'Reenviar email de verificación',
    verificationEmailResent: 'Email de verificación reenviado',
    documentStatus: 'Estado del Documento',
    configuration: 'Configuración',
    language: 'Idioma',
    spanish: 'Español',
    english: 'Inglés',
    appearance: 'Apariencia',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',

    // Practice Evaluations missing keys
    finalEvaluation: 'Evaluación Final',
    evaluationDate: 'Fecha de Evaluación',
    performanceRating: 'Valoración de Rendimiento',
    linkCopiedToClipboardToastTitle: 'Enlace copiado',
    linkCopiedToClipboardToastDescription: 'El enlace ha sido copiado al portapapeles',
    evaluationDeletedToastTitle: 'Evaluación eliminada',
    evaluationDeletedToastDescription: 'La evaluación ha sido eliminada correctamente',
    errorDeletingEvaluationToastTitle: 'Error al eliminar',
    errorDeletingEvaluationToastDescription: 'No se pudo eliminar la evaluación',
    exportFunctionComingSoonTitle: 'Función de exportación próximamente',
    exportFunctionComingSoonDescription: 'La función de exportación estará disponible pronto',
    importFunctionComingSoonTitle: 'Función de importación próximamente',
    importFunctionComingSoonDescription: 'La función de importación estará disponible pronto',
    valoPracSub: 'Gestione y revise las evaluaciones de prácticas de estudiantes',
    generarEnlaceVal: 'Generar Enlace de Evaluación',
    noEvaluationsRegistered: 'No hay evaluaciones registradas',
    generateLinkToStartReceivingEvaluations: 'Genere un enlace para comenzar a recibir evaluaciones',
    student: 'Estudiante',
    performanceRatingScore: '{{rating}}/10',
    deleteEvaluationConfirmationTitle: 'Confirmar eliminación',
    deleteEvaluationConfirmationDescription: '¿Está seguro de que desea eliminar la evaluación de {{studentName}} {{studentLastName}}?',

    // Real Estate missing keys
    selectPropertyType: 'Seleccionar Tipo de Propiedad',
    propertyTypeLabel: 'Tipo de Propiedad',
    selectTypePlaceholder: 'Seleccione un tipo',
    activeProperty: 'Propiedad Activa',
    inactiveProperty: 'Propiedad Inactiva',
    accept: 'Aceptar',
    errorLoadingDashboardData: 'Error al cargar datos del dashboard',
    realEstateDashboard: 'Dashboard de Inmuebles',
    realEstateManagementDescription: 'Gestione propiedades activas e inactivas de la organización',
    addProperty: 'Agregar Propiedad',
    importDataButton: 'Importar Datos',
    viewTables: 'Ver Tablas',
    propertiesOperational: 'Propiedades Operativas',
    propertiesPaused: 'Propiedades Pausadas',
    totalProperties: 'Total de Propiedades',

    // Additional Real Estate KPI keys
    totalRoomsKPI: 'Total Habitaciones',
    availableRooms: 'Habitaciones Disponibles',
    annualTotalCostKPI: 'Coste Total Anual',
    operatingExpenses: 'Gastos Operativos',
    averageCostKPI: 'Coste Promedio',
    perProperty: 'Por Propiedad',
    annualCostByProvince: 'Coste Anual por Provincia',
    annualCost: 'Coste Anual',
    propertyStatus: 'Estado de Propiedades',
    properties: 'Propiedades',
    exportPDF: 'Exportar PDF',
    realEstateDetails: 'Detalles del Inmueble',
    detailViewPlaceholder: 'Vista detallada del inmueble',

    // Settings and Profile keys
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    userProfile: 'Perfil de Usuario',
    changePhoto: 'Cambiar Foto',
    email: 'Email',
    permissions: 'Permisos',
    permissionsDescription: 'Permisos de usuario asignados',
    departmentPermissions: 'Permisos por Departamento',
    actionPermissions: 'Permisos de Acción',
    create: 'Crear',
    modify: 'Modificar',
    logout: 'Cerrar Sesión',
    saveChanges: 'Guardar Cambios',

    // Users Management keys
    errorLoadingUsers: 'Error al cargar usuarios',
    userPermissionsUpdatedSuccessfully: 'Permisos de usuario actualizados correctamente',
    errorUpdatingUserPermissions: 'Error al actualizar permisos de usuario',
    usersGestion: 'Gestión de Usuarios',
    userGestSub: 'Administre usuarios y sus permisos',
    buscadorUsers: 'Buscar usuarios...',
    listaUsers: 'Lista de Usuarios',
    usersCount: '{{count}} usuarios registrados',
    editPermissions: 'Editar Permisos',
    swipeToViewMore: 'Desliza para ver más',
    verifyingAccount: 'Verificando cuenta...',

    // Translation values for evaluation statuses
    Apto: 'Apto',
    'No Apto': 'No Apto',
    Apt: 'Apto',
    'Not Apt': 'No Apto',
  },
  
  en: {
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    confirmButton: 'Confirm',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    processing: 'Processing...',
    saving: 'Saving...',
    close: 'Close',
    open: 'Open',
    clear: 'Clear',
    clearButton: 'Clear',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    upload: 'Upload',
    download: 'Download',
    view: 'View',
    details: 'Details',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    name: 'Name',
    description: 'Description',
    selectDate: 'Select date',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    required: 'Required',
    optional: 'Optional',
    send: 'Send',
    homeMenu: 'Home',
    users: 'Users',
    operations: 'Operations',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'Tech Mgmt',
    talentManagement: 'Talent Management',
    talentManagementShort: 'Talent Mgmt',
    costAnalysis: 'Cost Analysis',
    costAnalysisShort: 'Cost Analysis',
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendar',
    checkers: 'Checkers',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    botErrorResponse: 'Sorry, there was an error processing your request.',
    greetingHello: 'Hello! I\'m Geenio, your AI assistant. How can I help you today?',
    greetingGoodMorning: 'Good morning! How can I assist you today?',
    greetingGoodAfternoon: 'Good afternoon! How can I help you?',
    greetingGoodEvening: 'Good evening! Do you need help with something?',
    greetingHowAreYou: 'I\'m doing great, thank you! How can I help you today?',
    greetingIAmFine: 'I\'m glad to hear you\'re doing well. How can I assist you?',
    greetingThanks: 'You\'re welcome! I\'m here to help you whenever you need it.',
    greetingYouAreWelcome: 'It\'s my pleasure to help you! Is there anything else I can assist you with?',
    helpMessage: 'I can help you with bid analysis, application questions, and more. What do you need?',
    aiSystemPrompt: 'You are Geenio, an AI assistant specialized in bid analysis and business management for Grupo Empresarial Electromédico (GEE). You are professional, helpful, and have deep knowledge about cost analysis, project management, and bidding processes. Respond clearly and concisely.',
    processingErrorMessage: 'Sorry, there was an error processing your message. Please try again.',
    openGeenioChatbot: 'Open Geenio chatbot',
    asistChat: 'Chat Assistant',
    bienvenidaChat: 'Hello! I\'m Geenio, your AI assistant. Ask me about bid analysis or anything else.',
    thinking: 'Thinking',
    typeYourMessage: 'Type your message...',
    requiredFieldsError: 'Please fill in all required fields',
    errorLoadingData: 'Error loading data',
    errorSavingData: 'Error saving data',
    errorDeletingData: 'Error deleting data',
    errorLoadingWorkCenters: 'Error loading work centers',
    errorCreatingWorkCenter: 'Error creating work center',
    errorUpdatingWorkCenter: 'Error updating work center',
    errorAddingProperty: 'Error adding property',
    dataSavedSuccess: 'Data saved successfully',
    dataDeletedSuccess: 'Data deleted successfully',
    workCenterCreatedSuccess: 'Work center created successfully',
    workCenterUpdatedSuccess: 'Work center updated successfully',
    propertyAddedSuccess: 'Property added successfully',
    createWorkCenterTitle: 'Create Work Center',
    workCenterNameLabel: 'Center Name',
    workCenterNamePlaceholder: 'Enter center name',
    workCenterIdLabel: 'Center ID',
    workCenterIdPlaceholder: 'Enter center ID',
    workCenterCodeLabel: 'Work Center Code',
    selectWorkCenterPlaceholder: 'Select work center',
    addWorkCenterButtonTitle: 'Add new work center',
    uploadCenterButton: 'Upload Center',
    confirmCreationTitle: 'Confirm Creation',
    confirmCreationDescription: 'A new work center will be created with name {{name}} and ID {{id}}',
    workCenterExistsTitle: 'Work Center Exists',
    workCenterExistsDescription: 'A work center with ID {{id}} already exists',
    leaveAsIsButton: 'Leave as is',
    updateRecordButton: 'Update record',
    addActivePropertyTitle: 'Add Active Property',
    activePropertyInfoTitle: 'Property Information',
    idLabel: 'ID',
    numRoomsLabel: 'Number of Rooms',
    workersLabel: 'Workers',
    addWorkerButton: 'Add Worker',
    workerNamePlaceholder: 'Worker name',
    dniPlaceholder: 'Worker ID',
    removeWorkerButton: 'Remove',
    addWorkerError: 'Must add at least one valid worker',
    geeCompanyLabel: 'GEE Company',
    selectCompanyPlaceholder: 'Select company',
    otherCompanyOption: 'Other',
    specifyCompanyPlaceholder: 'Specify company',
    specifyCustomCompanyError: 'Must specify company name',
    propertyStatusLabel: 'Property Status',
    occupiedStatus: 'Occupied',
    emptyStatus: 'Empty',
    addressLabel: 'Address',
    addressPlaceholder: 'Full address',
    cityLabel: 'City',
    provinceLabel: 'Province',
    ccaaLabel: 'Destination Region',
    originProvinceLabel: 'Origin Province',
    annualCostLabel: 'Annual Cost',
    occupancyDateLabel: 'Occupancy Date',
    contractStartDateLabel: 'Contract Start Date',
    meta4CodeLabel: 'Meta 4 Code',
    meta4CodePlaceholder: 'Meta 4 Code',
    projectContractLabel: 'Project Contract',
    projectContractPlaceholder: 'Project Contract',
    saveProperty: 'Save Property',
    activeProperties: 'Active Properties',
    inactiveProperties: 'Inactive Properties',
    totalPortfolio: 'Total Portfolio',
    notImplemented: 'Feature not implemented',
    voluntary: 'Voluntary',
    leaveOfAbsence: 'Leave of Absence',
    changeSheetsManagement: 'Change Sheets Management',
    createNew: 'Create New',
    hojasCambio: 'Change Sheets',
    employeeName: 'Employee Name',
    employeeLastName: 'Employee Last Name',
    originCenter: 'Origin Center',
    startDate: 'Start Date',
    endDate: 'End Date',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    generatedOn: 'Generated on',
    documentGenerated: 'Document generated',
    recordNotFound: 'Record not found',
    errorAnalyzingCosts: 'Error analyzing costs',
    chatbotContextUpdated: 'Chatbot context updated',
    tituloAnalisis: 'Professional Cost Analysis',
    subtiAnalisis: 'Upload tender documents for detailed analysis',
    subirPdf: 'Upload PDF',
    informepdf: 'Report PDF',
    costespdf: 'Costs PDF',
    puntuacionPdf: 'Score PDF',
    pcapFileLabel: 'PCAP File',
    pcapFileTitle: 'Terms and Conditions',
    pcapFileDescription: 'Document with tender conditions',
    pptFileLabel: 'PPT File',
    pptFileTitle: 'Technical Specifications',
    pptFileDescription: 'Technical specifications of the project',
    professionalCostAnalysisTitle: 'Professional Cost Analysis',
    filesReadyForAnalysis: 'Files ready for analysis',
    analysisDescription: 'Documents have been uploaded and are ready for professional analysis.',
    analyzingWithAI: 'Analyzing with AI...',
    startProfessionalCostAnalysis: 'Start Professional Cost Analysis',
    analysisErrorTitle: 'Analysis Error',
    employeeInformation: 'Employee Information',
    position: 'Position',
    department: 'Department',
    agreementDetails: 'Agreement Details',
    agreementType: 'Agreement Type',
    salary: 'Salary',
    benefitsAndConditions: 'Benefits and Conditions',
    benefits: 'Benefits',
    conditions: 'Conditions',
    observations: 'Observations',
    employeeAgreementDetails: 'Employee Agreement Details',
    workCenter: 'Work Center',
    exitInterviewDetails: 'Exit Interview Details',
    personalInformation: 'Personal Information',
    lastName: 'Last Name',
    company: 'Company',
    leaveDetails: 'Leave Details',
    leaveType: 'Leave Type',
    leaveDate: 'Leave Date',
    reason: 'Reason',
    feedback: 'Feedback',
    satisfaction: 'Satisfaction',
    workEnvironment: 'Work Environment',
    professionalDevelopment: 'Professional Development',
    compensation: 'Compensation',
    managementSupport: 'Management Support',
    wouldRecommend: 'Would Recommend',
    wouldReturn: 'Would Return',
    recommendations: 'Recommendations',
    additionalComments: 'Additional Comments',
    practiceEvaluationDetails: 'Practice Evaluation Details',
    studentInformation: 'Student Information',
    studentName: 'Student Name',
    studentId: 'Student ID',
    practiceDetails: 'Practice Details',
    practiceType: 'Practice Type',
    practiceCenter: 'Practice Center',
    supervisor: 'Supervisor',
    evaluationCriteria: 'Evaluation Criteria',
    technicalSkills: 'Technical Skills',
    communicationSkills: 'Communication Skills',
    teamwork: 'Teamwork',
    initiative: 'Initiative',
    punctuality: 'Punctuality',
    overallPerformance: 'Overall Performance',
    evaluationComments: 'Evaluation Comments',
    finalGrade: 'Final Grade',
    contractRequestDetails: 'Contract Request Details',
    requestInformation: 'Request Information',
    requestId: 'Request ID',
    requestDate: 'Request Date',
    requestedPosition: 'Requested Position',
    contractType: 'Contract Type',
    requestStatus: 'Request Status',
    candidateInformation: 'Candidate Information',
    candidateName: 'Candidate Name',
    candidateEmail: 'Candidate Email',
    candidatePhone: 'Candidate Phone',
    candidateExperience: 'Candidate Experience',
    positionDetails: 'Position Details',
    proposedSalary: 'Proposed Salary',
    expectedStartDate: 'Expected Start Date',
    justification: 'Justification',
    approvalInformation: 'Approval Information',
    approvedBy: 'Approved By',
    approvalDate: 'Approval Date',
    approvalComments: 'Approval Comments',
    changeSheetsDetails: 'Change Sheets Details',
    currentPosition: 'Current Position',
    newPosition: 'New Position',
    currentSupervisorName: 'Current Supervisor Name',
    currentSupervisorLastName: 'Current Supervisor Last Name',
    newSupervisorName: 'New Supervisor Name',
    newSupervisorLastName: 'New Supervisor Last Name',
    changeType: 'Change Type',
    currentCompany: 'Current Company',
    companyChange: 'Company Change',
    needs: 'Needs',
    exitInterviewsLoaded: 'Exit interviews loaded',
    errorLoadingExitInterviews: 'Error loading exit interviews',
    linkCopiedTitle: 'Link copied',
    linkCopiedDescription: 'The link has been copied to clipboard',
    errorCopyingLinkTitle: 'Error copying link',
    errorCopyingLinkDescription: 'Could not copy the link. Link:',
    interviewDuplicatedTitle: 'Interview duplicated',
    interviewDuplicatedDescription: 'The interview has been duplicated successfully',
    errorDuplicatingTitle: 'Error duplicating',
    errorDuplicatingDescription: 'Could not duplicate the interview',
    confirmDeleteInterview: 'Are you sure you want to delete this interview?',
    interviewDeletedTitle: 'Interview deleted',
    interviewDeletedDescription: 'The interview has been deleted successfully',
    errorDeletingTitle: 'Error deleting',
    errorDeletingDescription: 'Could not delete the interview',
    functionNotImplementedTitle: 'Function not implemented',
    downloadPdfNotAvailable: 'PDF download is not available',
    noDataTitle: 'No data',
    noDataToExportDescription: 'No data to export',
    exportCompletedTitle: 'Export completed',
    exportCompletedDescription: 'Data has been exported successfully',
    importNotAvailable: 'Import is not available',
    entrevistaTit: 'Exit Interviews',
    recargar: 'Reload',
    generarEnla1: 'Generate Link',
    exportarEntre: 'Export',
    importarEntre: 'Import',
    tryAgain: 'Try again',
    loadingExitInterviews: 'Loading exit interviews...',
    noExitInterviewsFound: 'No exit interviews found',
    generateLinkToStart: 'Generate a link to start',
    importData: 'Import data',
    positionShort: 'Position',
    workCenterShort: 'Center',
    exitType: 'Exit Type',
    exitDate: 'Exit Date',
    duplicate: 'Duplicate',
    invalidDate: 'Invalid date',
    showingRecords: 'Showing {{start}} to {{end}} of {{total}} records',
    previous: 'Previous',
    next: 'Next',
    viewDetails: 'View Details',
    profile: 'Profile',
    settings: 'Settings',
    welcome: 'Welcome',
    loginSubtitle: 'Enter your credentials to access',
    loginButton: 'Sign In',
    maintenanceCalendar: 'Maintenance Calendar',
    featureTitleComprobadores: 'Checkers',
    comingSoonDescriptionComprobadores: 'Checkers functionality coming soon',
    comingSoon: 'Coming Soon',
    generateCalendar: 'Generate Calendar',
    calendar: 'Calendar',
    analysis: 'Analysis',
    hospitalInventory: 'Hospital Inventory',
    maintenanceSchedule: 'Maintenance Schedule',
    inventory: 'Inventory',
    processFiles: 'Process Files',
    uploadFiles: 'Upload Files',
    arrastraArchivo: 'Drag a file here or click to select',
    formatosCsv: 'Supported formats: CSV, Excel (.xlsx, .xls)',
    missingMaintenanceTitle: 'Missing Maintenance',
    missingMaintenanceMessage: 'There are denominations without assigned maintenance. Do you want to continue?',
    generateAnyway: 'Generate anyway',
    completeFirst: 'Complete first',
    valoPracTit: 'Practice Evaluation',
    institution: 'Institution',
    formation: 'Formation',
    tutor: 'Tutor',
    tutorName: 'Tutor Name',
    tutorLastName: 'Tutor Last Name',
    tutorPhone: 'Tutor Phone',
    tutorEmail: 'Tutor Email',
    evaluation: 'Evaluation',
    siNo: 'Yes/No',
    totalScore: 'Total Score',
    practiceEvaluationTitle: 'Practice Evaluation',
    noEvaluationsFound: 'No evaluations found',
    metodologia: 'Methodology',
    areaImpacto: 'Impact Area',
    porcentageDescount: 'Discount Percentage',
    userNotFoundTitle: 'User not found',
    userNotFoundDescription: 'No user exists with that email',
    passwordResetSent: 'Reset link sent',
    actionCodeExpired: 'Action code has expired',
    passwordResetComplete: 'Password reset successfully',
    enterNewPasswordTitle: 'Enter your new password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    resetPassword: 'Reset Password',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordTooWeak: 'Password is too weak',
    invalidEmail: 'Invalid email',
    emailAlreadyInUse: 'This email is already in use',
    userDisabled: 'User disabled',
    tooManyRequests: 'Too many attempts. Try again later',
    networkRequestFailed: 'Connection error',
    internalError: 'Internal server error',
    forgotPasswordTitle: 'Forgot your password?',
    forgotPasswordInstructions: 'Enter your email to receive a reset link',
    emailAddress: 'Email Address',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    accountVerificationTitle: 'Account Verification',
    verificationEmailSent: 'Verification email sent',
    checkYourEmail: 'Check your email',
    resendVerificationEmail: 'Resend verification email',
    verificationEmailResent: 'Verification email resent',
    documentStatus: 'Document Status',
    configuration: 'Configuration',
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    appearance: 'Appearance',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',

    // Practice Evaluations missing keys
    finalEvaluation: 'Final Evaluation',
    evaluationDate: 'Evaluation Date',
    performanceRating: 'Performance Rating',
    linkCopiedToClipboardToastTitle: 'Link copied',
    linkCopiedToClipboardToastDescription: 'The link has been copied to clipboard',
    evaluationDeletedToastTitle: 'Evaluation deleted',
    evaluationDeletedToastDescription: 'The evaluation has been deleted successfully',
    errorDeletingEvaluationToastTitle: 'Error deleting',
    errorDeletingEvaluationToastDescription: 'Could not delete the evaluation',
    exportFunctionComingSoonTitle: 'Export function coming soon',
    exportFunctionComingSoonDescription: 'The export function will be available soon',
    importFunctionComingSoonTitle: 'Import function coming soon',
    importFunctionComingSoonDescription: 'The import function will be available soon',
    valoPracSub: 'Manage and review student practice evaluations',
    generarEnlaceVal: 'Generate Evaluation Link',
    noEvaluationsRegistered: 'No evaluations registered',
    generateLinkToStartReceivingEvaluations: 'Generate a link to start receiving evaluations',
    student: 'Student',
    performanceRatingScore: '{{rating}}/10',
    deleteEvaluationConfirmationTitle: 'Confirm deletion',
    deleteEvaluationConfirmationDescription: 'Are you sure you want to delete the evaluation for {{studentName}} {{studentLastName}}?',

    // Real Estate missing keys
    selectPropertyType: 'Select Property Type',
    propertyTypeLabel: 'Property Type',
    selectTypePlaceholder: 'Select a type',
    activeProperty: 'Active Property',
    inactiveProperty: 'Inactive Property',
    accept: 'Accept',
    errorLoadingDashboardData: 'Error loading dashboard data',
    realEstateDashboard: 'Real Estate Dashboard',
    realEstateManagementDescription: 'Manage active and inactive properties of the organization',
    addProperty: 'Add Property',
    importDataButton: 'Import Data',
    viewTables: 'View Tables',
    propertiesOperational: 'Operational Properties',
    propertiesPaused: 'Paused Properties',
    totalProperties: 'Total Properties',

    // Additional Real Estate KPI keys
    totalRoomsKPI: 'Total Rooms',
    availableRooms: 'Available Rooms',
    annualTotalCostKPI: 'Annual Total Cost',
    operatingExpenses: 'Operating Expenses',
    averageCostKPI: 'Average Cost',
    perProperty: 'Per Property',
    annualCostByProvince: 'Annual Cost by Province',
    annualCost: 'Annual Cost',
    propertyStatus: 'Property Status',
    properties: 'Properties',
    exportPDF: 'Export PDF',
    realEstateDetails: 'Real Estate Details',
    detailViewPlaceholder: 'Detailed property view',

    // Settings and Profile keys
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    userProfile: 'User Profile',
    changePhoto: 'Change Photo',
    email: 'Email',
    permissions: 'Permissions',
    permissionsDescription: 'Assigned user permissions',
    departmentPermissions: 'Department Permissions',
    actionPermissions: 'Action Permissions',
    create: 'Create',
    modify: 'Modify',
    logout: 'Logout',
    saveChanges: 'Save Changes',

    // Users Management keys
    errorLoadingUsers: 'Error loading users',
    userPermissionsUpdatedSuccessfully: 'User permissions updated successfully',
    errorUpdatingUserPermissions: 'Error updating user permissions',
    usersGestion: 'User Management',
    userGestSub: 'Manage users and their permissions',
    buscadorUsers: 'Search users...',
    listaUsers: 'User List',
    usersCount: '{{count}} registered users',
    editPermissions: 'Edit Permissions',
    swipeToViewMore: 'Swipe to view more',
    verifyingAccount: 'Verifying account...',

    // Translation values for evaluation statuses
    Apto: 'Apt',
    'No Apto': 'Not Apt',
    Apt: 'Apt',
    'Not Apt': 'Not Apt',
  }
};
