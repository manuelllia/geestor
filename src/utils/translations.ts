

export type Language = 'es' | 'en';

export interface Translations {
  // Navigation
  home: string;
  operations: string;
  technical_management: string;
  talent_management: string;
  contract_requests: string;
  change_sheets: string;
  employee_agreements: string;
  real_estate_management: string;
  practice_evaluations: string;
  exit_interviews: string;
  user_management: string;
  settings: string;
  
  // Navigation - Additional keys
  homeMenu: string;
  users: string;
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
  
  // Common actions
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  create: string;
  export: string;
  import: string;
  refresh: string;
  duplicate: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  filter: string;
  clear: string;
  confirm: string;
  close: string;
  send: string;
  
  // CSV Export
  export_csv: string;
  exporting_data: string;
  export_successful: string;
  export_failed: string;
  no_data_to_export: string;
  
  // Status
  pending: string;
  approved: string;
  rejected: string;
  active: string;
  inactive: string;
  
  // Forms
  required_field: string;
  optional_field: string;
  select_option: string;
  
  // Messages
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Practice Evaluations
  practice_evaluations: string;
  tutor_name: string;
  student_name: string;
  formation: string;
  institution: string;
  evaluation_date: string;
  performance_rating: string;
  final_evaluation: string;
  
  // Employee Agreements
  employee_agreements: string;
  employee_name: string;
  agreement_type: string;
  start_date: string;
  end_date: string;
  
  // Change Sheets
  change_sheets: string;
  current_company: string;
  change_type: string;
  origin_center: string;
  destination_center: string;
  
  // Contract Requests
  contract_requests: string;
  requester_name: string;
  contract_type: string;
  salary: string;
  incorporation_date: string;
  job_position: string;
  work_center: string;
  
  // Chatbot and AI
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
  dragDropFiles: string;
  supportedFormats: string;
  
  // Analysis and Reports
  analysisReport: string;
  contractingEntity: string;
  baseBudget: string;
  contractDuration: string;
  bidCount: string;
  averageScore: string;
  highestScore: string;
  lowestScore: string;
  economicCriteria: string;
  technicalCriteria: string;
  totalScore: string;
  rank: string;
  companyName: string;
  bidAmount: string;
  economicScore: string;
  technicalScore: string;
  finalScore: string;
  recommendations: string;
  executiveSummary: string;
  detailedAnalysis: string;
  riskAssessment: string;
  conclusions: string;
  
  // Cost Analysis
  costAnalysisTitle: string;
  totalCost: string;
  breakdown: string;
  categories: string;
  
  // General UI
  loading: string;
  noData: string;
  selectAll: string;
  deselectAll: string;
  items: string;
  total: string;
  percentage: string;
  date: string;
  time: string;
  name: string;
  description: string;
  status: string;
  actions: string;
  details: string;
  summary: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    home: 'Inicio',
    operations: 'Operaciones',
    technical_management: 'Gestión Técnica',
    talent_management: 'Gestión de Talento',
    contract_requests: 'Solicitudes de Contratación',
    change_sheets: 'Hojas de Cambio',
    employee_agreements: 'Acuerdos de Empleado',
    real_estate_management: 'Gestión de Inmuebles',
    practice_evaluations: 'Valoración de Prácticas',
    exit_interviews: 'Entrevistas de Salida',
    user_management: 'Gestión de Usuarios',
    settings: 'Configuración',
    
    // Navigation - Additional keys
    homeMenu: 'Inicio',
    users: 'Usuarios',
    costAnalysis: 'Análisis de Costes',
    costAnalysisShort: 'Análisis',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'G. Técnica',
    calendarManagement: 'Gestión de Calendario',
    calendarManagementShort: 'Calendario',
    checkers: 'Comprobadores',
    talentManagement: 'Gestión de Talento',
    talentManagementShort: 'G. Talento',
    contractRequests: 'Solicitudes de Contratación',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdos de Empleado',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Valoración de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    
    // Common actions
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    create: 'Crear',
    export: 'Exportar',
    import: 'Importar',
    refresh: 'Actualizar',
    duplicate: 'Duplicar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpiar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    send: 'Enviar',
    
    // CSV Export
    export_csv: 'Exportar CSV',
    exporting_data: 'Exportando datos...',
    export_successful: 'Exportación completada correctamente',
    export_failed: 'Error al exportar los datos',
    no_data_to_export: 'No hay datos para exportar',
    
    // Status
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    active: 'Activo',
    inactive: 'Inactivo',
    
    // Forms
    required_field: 'Campo requerido',
    optional_field: 'Campo opcional',
    select_option: 'Seleccionar opción',
    
    // Messages
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    
    // Practice Evaluations
    practice_evaluations: 'Valoración de Prácticas',
    tutor_name: 'Nombre del Tutor',
    student_name: 'Nombre del Estudiante',
    formation: 'Formación',
    institution: 'Institución',
    evaluation_date: 'Fecha de Evaluación',
    performance_rating: 'Calificación de Rendimiento',
    final_evaluation: 'Evaluación Final',
    
    // Employee Agreements
    employee_agreements: 'Acuerdos de Empleado',
    employee_name: 'Nombre del Empleado',
    agreement_type: 'Tipo de Acuerdo',
    start_date: 'Fecha de Inicio',
    end_date: 'Fecha de Fin',
    
    // Change Sheets
    change_sheets: 'Hojas de Cambio',
    current_company: 'Empresa Actual',
    change_type: 'Tipo de Cambio',
    origin_center: 'Centro Origen',
    destination_center: 'Centro Destino',
    
    // Contract Requests
    contract_requests: 'Solicitudes de Contratación',
    requester_name: 'Nombre del Solicitante',
    contract_type: 'Tipo de Contrato',
    salary: 'Salario',
    incorporation_date: 'Fecha de Incorporación',
    job_position: 'Puesto de Trabajo',
    work_center: 'Centro de Trabajo',
    
    // Chatbot and AI
    fileUploaded: 'Archivo subido',
    botErrorResponse: 'Lo siento, hubo un error procesando tu solicitud.',
    greetingHello: '¡Hola! Soy Geenio, tu asistente inteligente. ¿En qué puedo ayudarte?',
    greetingGoodMorning: '¡Buenos días! ¿Cómo puedo asistirte hoy?',
    greetingGoodAfternoon: '¡Buenas tardes! ¿En qué puedo ayudarte?',
    greetingGoodEvening: '¡Buenas noches! ¿Necesitas alguna ayuda?',
    greetingHowAreYou: '¡Hola! Estoy aquí para ayudarte. ¿Qué necesitas?',
    greetingIAmFine: 'Me alegra saberlo. ¿En qué puedo asistirte?',
    greetingThanks: '¡De nada! Estoy aquí para ayudarte en lo que necesites.',
    greetingYouAreWelcome: '¡No hay de qué! ¿Hay algo más en lo que pueda ayudarte?',
    helpMessage: 'Puedo ayudarte con análisis de documentos, responder preguntas sobre licitaciones y mucho más. ¡Pregúntame!',
    aiSystemPrompt: 'Eres Geenio, un asistente especializado en análisis de licitaciones y gestión empresarial.',
    processingErrorMessage: 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.',
    openGeenioChatbot: 'Abrir chat con Geenio',
    asistChat: 'Asistente inteligente',
    bienvenidaChat: '¡Hola! Soy Geenio, tu asistente para análisis de licitaciones. Puedes preguntarme cualquier cosa o subir documentos para analizar.',
    thinking: 'Pensando',
    typeYourMessage: 'Escribe tu mensaje...',
    dragDropFiles: 'Arrastra archivos aquí o haz clic para seleccionar',
    supportedFormats: 'PDF, Excel, Word, Imágenes (máx. 10MB)',
    
    // Analysis and Reports
    analysisReport: 'Informe de Análisis',
    contractingEntity: 'Entidad Contratante',
    baseBudget: 'Presupuesto Base',
    contractDuration: 'Duración del Contrato',
    bidCount: 'Número de Ofertas',
    averageScore: 'Puntuación Media',
    highestScore: 'Puntuación Más Alta',
    lowestScore: 'Puntuación Más Baja',
    economicCriteria: 'Criterios Económicos',
    technicalCriteria: 'Criterios Técnicos',
    totalScore: 'Puntuación Total',
    rank: 'Posición',
    companyName: 'Nombre de la Empresa',
    bidAmount: 'Importe de la Oferta',
    economicScore: 'Puntuación Económica',
    technicalScore: 'Puntuación Técnica',
    finalScore: 'Puntuación Final',
    recommendations: 'Recomendaciones',
    executiveSummary: 'Resumen Ejecutivo',
    detailedAnalysis: 'Análisis Detallado',
    riskAssessment: 'Evaluación de Riesgos',
    conclusions: 'Conclusiones',
    
    // Cost Analysis
    costAnalysisTitle: 'Análisis de Costes',
    totalCost: 'Coste Total',
    breakdown: 'Desglose',
    categories: 'Categorías',
    
    // General UI
    loading: 'Cargando...',
    noData: 'No hay datos disponibles',
    selectAll: 'Seleccionar todo',
    deselectAll: 'Deseleccionar todo',
    items: 'elementos',
    total: 'Total',
    percentage: 'Porcentaje',
    date: 'Fecha',
    time: 'Hora',
    name: 'Nombre',
    description: 'Descripción',
    status: 'Estado',
    actions: 'Acciones',
    details: 'Detalles',
    summary: 'Resumen',
  },
  
  en: {
    // Navigation
    home: 'Home',
    operations: 'Operations',
    technical_management: 'Technical Management',
    talent_management: 'Talent Management',
    contract_requests: 'Contract Requests',
    change_sheets: 'Change Sheets',
    employee_agreements: 'Employee Agreements',
    real_estate_management: 'Real Estate Management',
    practice_evaluations: 'Practice Evaluations',
    exit_interviews: 'Exit Interviews',
    user_management: 'User Management',
    settings: 'Settings',
    
    // Navigation - Additional keys
    homeMenu: 'Home',
    users: 'Users',
    costAnalysis: 'Cost Analysis',
    costAnalysisShort: 'Analysis',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'T. Management',
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendar',
    checkers: 'Checkers',
    talentManagement: 'Talent Management',
    talentManagementShort: 'T. Management',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    create: 'Create',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    duplicate: 'Duplicate',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    confirm: 'Confirm',
    close: 'Close',
    send: 'Send',
    
    // CSV Export
    export_csv: 'Export CSV',
    exporting_data: 'Exporting data...',
    export_successful: 'Export completed successfully',
    export_failed: 'Error exporting data',
    no_data_to_export: 'No data to export',
    
    // Status
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    inactive: 'Inactive',
    
    // Forms
    required_field: 'Required field',
    optional_field: 'Optional field',
    select_option: 'Select option',
    
    // Messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    
    // Practice Evaluations
    practice_evaluations: 'Practice Evaluations',
    tutor_name: 'Tutor Name',
    student_name: 'Student Name',
    formation: 'Formation',
    institution: 'Institution',
    evaluation_date: 'Evaluation Date',
    performance_rating: 'Performance Rating',
    final_evaluation: 'Final Evaluation',
    
    // Employee Agreements
    employee_agreements: 'Employee Agreements',
    employee_name: 'Employee Name',
    agreement_type: 'Agreement Type',
    start_date: 'Start Date',
    end_date: 'End Date',
    
    // Change Sheets
    change_sheets: 'Change Sheets',
    current_company: 'Current Company',
    change_type: 'Change Type',
    origin_center: 'Origin Center',
    destination_center: 'Destination Center',
    
    // Contract Requests
    contract_requests: 'Contract Requests',
    requester_name: 'Requester Name',
    contract_type: 'Contract Type',
    salary: 'Salary',
    incorporation_date: 'Incorporation Date',
    job_position: 'Job Position',
    work_center: 'Work Center',
    
    // Chatbot and AI
    fileUploaded: 'File uploaded',
    botErrorResponse: 'Sorry, there was an error processing your request.',
    greetingHello: 'Hello! I\'m Geenio, your intelligent assistant. How can I help you?',
    greetingGoodMorning: 'Good morning! How can I assist you today?',
    greetingGoodAfternoon: 'Good afternoon! How can I help you?',
    greetingGoodEvening: 'Good evening! Do you need any help?',
    greetingHowAreYou: 'Hello! I\'m here to help you. What do you need?',
    greetingIAmFine: 'I\'m glad to hear that. How can I assist you?',
    greetingThanks: 'You\'re welcome! I\'m here to help you with whatever you need.',
    greetingYouAreWelcome: 'You\'re welcome! Is there anything else I can help you with?',
    helpMessage: 'I can help you with document analysis, answer questions about tenders and much more. Ask me!',
    aiSystemPrompt: 'You are Geenio, an assistant specialized in tender analysis and business management.',
    processingErrorMessage: 'Error processing the request. Please try again.',
    openGeenioChatbot: 'Open chat with Geenio',
    asistChat: 'Intelligent assistant',
    bienvenidaChat: 'Hello! I\'m Geenio, your assistant for tender analysis. You can ask me anything or upload documents to analyze.',
    thinking: 'Thinking',
    typeYourMessage: 'Type your message...',
    dragDropFiles: 'Drag files here or click to select',
    supportedFormats: 'PDF, Excel, Word, Images (max. 10MB)',
    
    // Analysis and Reports
    analysisReport: 'Analysis Report',
    contractingEntity: 'Contracting Entity',
    baseBudget: 'Base Budget',
    contractDuration: 'Contract Duration',
    bidCount: 'Number of Bids',
    averageScore: 'Average Score',
    highestScore: 'Highest Score',
    lowestScore: 'Lowest Score',
    economicCriteria: 'Economic Criteria',
    technicalCriteria: 'Technical Criteria',
    totalScore: 'Total Score',
    rank: 'Rank',
    companyName: 'Company Name',
    bidAmount: 'Bid Amount',
    economicScore: 'Economic Score',
    technicalScore: 'Technical Score',
    finalScore: 'Final Score',
    recommendations: 'Recommendations',
    executiveSummary: 'Executive Summary',
    detailedAnalysis: 'Detailed Analysis',
    riskAssessment: 'Risk Assessment',
    conclusions: 'Conclusions',
    
    // Cost Analysis
    costAnalysisTitle: 'Cost Analysis',
    totalCost: 'Total Cost',
    breakdown: 'Breakdown',
    categories: 'Categories',
    
    // General UI
    loading: 'Loading...',
    noData: 'No data available',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    items: 'items',
    total: 'Total',
    percentage: 'Percentage',
    date: 'Date',
    time: 'Time',
    name: 'Name',
    description: 'Description',
    status: 'Status',
    actions: 'Actions',
    details: 'Details',
    summary: 'Summary',
  }
};

