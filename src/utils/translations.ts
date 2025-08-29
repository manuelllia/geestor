

export type Language = 'es' | 'en';

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
  
  // Dashboard
  totalPortfolio: string;
  notImplemented: string;
  
  // Exit Interviews
  voluntary: string;
  leaveOfAbsence: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Common
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
    
    // Navigation and Menu
    homeMenu: 'Inicio',
    users: 'Usuarios',
    operations: 'Operaciones',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'G. Técnica',
    talentManagement: 'Gestión de Talento',
    talentManagementShort: 'G. Talento',
    
    // Operations
    costAnalysis: 'Análisis de Costes',
    costAnalysisShort: 'A. Costes',
    
    // Technical Management
    calendarManagement: 'Gestión de Calendario',
    calendarManagementShort: 'G. Calendario',
    checkers: 'Comprobadores',
    
    // Talent Management
    contractRequests: 'Solicitudes de Contratación',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdos de Empleado',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Valoración de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    
    // Chatbot
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
    
    // Error messages
    requiredFieldsError: 'Por favor complete todos los campos requeridos',
    errorLoadingData: 'Error al cargar los datos',
    errorSavingData: 'Error al guardar los datos',
    errorDeletingData: 'Error al eliminar los datos',
    errorLoadingWorkCenters: 'Error al cargar los centros de trabajo',
    errorCreatingWorkCenter: 'Error al crear el centro de trabajo',
    errorUpdatingWorkCenter: 'Error al actualizar el centro de trabajo',
    errorAddingProperty: 'Error al agregar la propiedad',
    
    // Success messages
    dataSavedSuccess: 'Datos guardados correctamente',
    dataDeletedSuccess: 'Datos eliminados correctamente',
    workCenterCreatedSuccess: 'Centro de trabajo creado correctamente',
    workCenterUpdatedSuccess: 'Centro de trabajo actualizado correctamente',
    propertyAddedSuccess: 'Propiedad agregada correctamente',
    
    // Work Centers
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
    
    // Real Estate
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
    
    // Dashboard
    totalPortfolio: 'Cartera Total',
    notImplemented: 'Funcionalidad no implementada',
    
    // Exit Interviews
    voluntary: 'Voluntaria',
    leaveOfAbsence: 'Excedencia',
  },
  
  en: {
    // Common
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
    
    // Navigation and Menu
    homeMenu: 'Home',
    users: 'Users',
    operations: 'Operations',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'Tech Mgmt',
    talentManagement: 'Talent Management',
    talentManagementShort: 'Talent Mgmt',
    
    // Operations
    costAnalysis: 'Cost Analysis',
    costAnalysisShort: 'Cost Analysis',
    
    // Technical Management
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendar',
    checkers: 'Checkers',
    
    // Talent Management
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    
    // Chatbot
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
    
    // Error messages
    requiredFieldsError: 'Please fill in all required fields',
    errorLoadingData: 'Error loading data',
    errorSavingData: 'Error saving data',
    errorDeletingData: 'Error deleting data',
    errorLoadingWorkCenters: 'Error loading work centers',
    errorCreatingWorkCenter: 'Error creating work center',
    errorUpdatingWorkCenter: 'Error updating work center',
    errorAddingProperty: 'Error adding property',
    
    // Success messages
    dataSavedSuccess: 'Data saved successfully',
    dataDeletedSuccess: 'Data deleted successfully',
    workCenterCreatedSuccess: 'Work center created successfully',
    workCenterUpdatedSuccess: 'Work center updated successfully',
    propertyAddedSuccess: 'Property added successfully',
    
    // Work Centers
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
    
    // Real Estate
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
    
    // Dashboard
    totalPortfolio: 'Total Portfolio',
    notImplemented: 'Feature not implemented',
    
    // Exit Interviews
    voluntary: 'Voluntary',
    leaveOfAbsence: 'Leave of Absence',
  }
};

