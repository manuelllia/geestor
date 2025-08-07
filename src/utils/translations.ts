
export type Language = 'es' | 'en';

export interface Translations {
  // Navigation and Basic UI
  language: string;
  of: string;
  welcome: string;
  home: string;
  back: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  actions: string;
  status: string;
  name: string;
  select: string;
  createNew: string;
  export: string;
  import: string;
  noDataAvailable: string;
  showingRecords: string;
  comingSoon: string;
  
  // Authentication
  loginSubtitle: string;
  email: string;
  password: string;
  rememberMe: string;
  forgotPassword: string;
  signIn: string;
  orSignInWith: string;
  loginButton: string;
  verificationTitle: string;
  verificationSubtitle: string;
  verificationCode: string;
  verify: string;
  resendCode: string;
  backToLogin: string;
  verifyingAccount: string;

  // Main App
  welcomeMessage: string;
  welcomeSubtitle: string;
  selectSection: string;
  mainContent: string;
  noContentSelected: string;
  
  // Sidebar sections
  bidAnalyzer: string;
  hojasCambio: string;
  employeeAgreements: string;
  realEstateManagement: string;
  businessManagement: string;
  
  // Settings
  settings: string;
  profile: string;
  userProfile: string;
  logout: string;
  darkMode: string;
  lightMode: string;
  spanish: string;
  english: string;
  saveChanges: string;

  // Change Sheets
  changeSheets: string;
  createChangeSheet: string;
  changeSheetsList: string;
  changeSheetsManagement: string;
  noChangeSheetsFound: string;
  searchChangeSheets: string;
  filterByStatus: string;
  allStatuses: string;
  pending: string;
  inProgress: string;
  approved: string;
  rejected: string;
  viewDetails: string;
  
  // Change Sheet Form
  changeSheetForm: string;
  changeSheetDetails: string;
  basicInformation: string;
  changeSheetNumber: string;
  title: string;
  description: string;
  requestedBy: string;
  assignedTo: string;
  department: string;
  priority: string;
  requestDate: string;
  dueDate: string;
  completionDate: string;
  estimatedHours: string;
  actualHours: string;
  category: string;
  tags: string;
  attachments: string;
  comments: string;
  approvalSection: string;
  requiresApproval: string;
  approvedBy: string;
  approvalDate: string;
  approvalComments: string;
  technicalDetails: string;
  impactAnalysis: string;
  riskAssessment: string;
  testingRequirements: string;
  rollbackPlan: string;
  saveAndClose: string;
  draft: string;
  submit: string;
  
  // Change Sheet specific
  employeeName: string;
  employeeLastName: string;
  originCenter: string;
  destinationCenter: string;
  startDate: string;
  duplicateRecord: string;
  downloadPDF: string;
  exportPDF: string;
  detailViewPlaceholder: string;
  
  // Employee Agreements
  employeeAgreementsList: string;
  employeeAgreementsManagement: string;
  createEmployeeAgreement: string;
  noEmployeeAgreementsFound: string;
  searchEmployeeAgreements: string;
  employeeAgreementDetails: string;
  employee: string;
  workCenter: string;
  agreementConcept: string;
  agreementDetail: string;
  
  // Real Estate
  realEstateList: string;
  createRealEstate: string;
  noRealEstateFound: string;
  searchRealEstate: string;
  
  // Bid Analyzer
  bidAnalyzerTitle: string;
  uploadPCAP: string;
  uploadPTT: string;
  dragDropPDF: string;
  selectPDF: string;
  analyzeDocuments: string;
  
  // Chatbot
  chatbot: string;
  askGEEorge: string;
  typeMessage: string;
  thinking: string;
  writing: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Navigation and Basic UI
    language: 'Idioma',
    of: 'de',
    welcome: 'Bienvenido',
    home: 'Inicio',
    back: 'Atrás',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    actions: 'Acciones',
    status: 'Estado',
    name: 'Nombre',
    select: 'Seleccionar',
    createNew: 'Crear Nuevo',
    export: 'Exportar',
    import: 'Importar',
    noDataAvailable: 'No hay datos disponibles',
    showingRecords: 'Mostrando {start} a {end} de {total} registros',
    comingSoon: 'Próximamente',
    
    // Authentication
    loginSubtitle: 'Ingresa a tu cuenta para continuar',
    email: 'Correo electrónico',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signIn: 'Iniciar sesión',
    orSignInWith: 'O inicia sesión con',
    loginButton: 'Iniciar sesión con Microsoft',
    verificationTitle: 'Verificación de cuenta',
    verificationSubtitle: 'Tu cuenta está siendo verificada. Por favor espera...',
    verificationCode: 'Código de verificación',
    verify: 'Verificar',
    resendCode: 'Reenviar código',
    backToLogin: 'Volver al inicio de sesión',
    verifyingAccount: 'Verificando cuenta',

    // Main App
    welcomeMessage: 'Bienvenido a GEESTOR',
    welcomeSubtitle: 'Sistema de gestión empresarial del Grupo Empresarial Electromédico',
    selectSection: 'Selecciona una sección del menú para comenzar',
    mainContent: 'Contenido Principal',
    noContentSelected: 'No hay contenido seleccionado',
    
    // Sidebar sections
    bidAnalyzer: 'Análisis de Costes',
    hojasCambio: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdo Empleado',
    realEstateManagement: 'Gestión de Inmuebles',
    businessManagement: 'Gestión Empresarial',
    
    // Settings
    settings: 'Configuración',
    profile: 'Perfil',
    userProfile: 'Perfil de Usuario',
    logout: 'Cerrar sesión',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    spanish: 'Español',
    english: 'Inglés',
    saveChanges: 'Guardar cambios',

    // Change Sheets
    changeSheets: 'Hojas de Cambio',
    createChangeSheet: 'Crear Hoja de Cambio',
    changeSheetsList: 'Lista de Hojas de Cambio',
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    noChangeSheetsFound: 'No se encontraron hojas de cambio',
    searchChangeSheets: 'Buscar hojas de cambio...',
    filterByStatus: 'Filtrar por estado',
    allStatuses: 'Todos los estados',
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    viewDetails: 'Ver detalles',
    
    // Change Sheet Form
    changeSheetForm: 'Formulario de Hoja de Cambio',
    changeSheetDetails: 'Detalles de la Hoja de Cambio',
    basicInformation: 'Información Básica',
    changeSheetNumber: 'Número de Hoja de Cambio',
    title: 'Título',
    description: 'Descripción',
    requestedBy: 'Solicitado por',
    assignedTo: 'Asignado a',
    department: 'Departamento',
    priority: 'Prioridad',
    requestDate: 'Fecha de Solicitud',
    dueDate: 'Fecha de Vencimiento',
    completionDate: 'Fecha de Finalización',
    estimatedHours: 'Horas Estimadas',
    actualHours: 'Horas Reales',
    category: 'Categoría',
    tags: 'Etiquetas',
    attachments: 'Adjuntos',
    comments: 'Comentarios',
    approvalSection: 'Sección de Aprobación',
    requiresApproval: 'Requiere Aprobación',
    approvedBy: 'Aprobado por',
    approvalDate: 'Fecha de Aprobación',
    approvalComments: 'Comentarios de Aprobación',
    technicalDetails: 'Detalles Técnicos',
    impactAnalysis: 'Análisis de Impacto',
    riskAssessment: 'Evaluación de Riesgos',
    testingRequirements: 'Requisitos de Pruebas',
    rollbackPlan: 'Plan de Rollback',
    saveAndClose: 'Guardar y Cerrar',
    draft: 'Borrador',
    submit: 'Enviar',
    
    // Change Sheet specific
    employeeName: 'Nombre del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    originCenter: 'Centro de Origen',
    destinationCenter: 'Centro de Destino',
    startDate: 'Fecha de Inicio',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    exportPDF: 'Exportar PDF',
    detailViewPlaceholder: 'Vista de detalles en desarrollo',
    
    // Employee Agreements
    employeeAgreementsList: 'Lista de Acuerdos de Empleados',
    employeeAgreementsManagement: 'Gestión de Acuerdos de Empleados',
    createEmployeeAgreement: 'Crear Acuerdo de Empleado',
    noEmployeeAgreementsFound: 'No se encontraron acuerdos de empleados',
    searchEmployeeAgreements: 'Buscar acuerdos de empleados...',
    employeeAgreementDetails: 'Detalles del Acuerdo de Empleado',
    employee: 'Empleado',
    workCenter: 'Centro de Trabajo',
    agreementConcept: 'Concepto del Acuerdo',
    agreementDetail: 'Detalle del Acuerdo',
    
    // Real Estate
    realEstateList: 'Lista de Inmuebles',
    createRealEstate: 'Crear Inmueble',
    noRealEstateFound: 'No se encontraron inmuebles',
    searchRealEstate: 'Buscar inmuebles...',
    
    // Bid Analyzer
    bidAnalyzerTitle: 'Analizador de Licitaciones',
    uploadPCAP: 'Subir PCAP',
    uploadPTT: 'Subir PTT',
    dragDropPDF: 'Arrastra y suelta tu archivo PDF aquí',
    selectPDF: 'Seleccionar PDF',
    analyzeDocuments: 'Analizar Documentos',
    
    // Chatbot
    chatbot: 'Chatbot',
    askGEEorge: 'Pregunta a GEEorge',
    typeMessage: 'Escribe tu mensaje...',
    thinking: 'Pensando',
    writing: 'Escribiendo',
  },
  en: {
    // Navigation and Basic UI
    language: 'Language',
    of: 'of',
    welcome: 'Welcome',
    home: 'Home',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    actions: 'Actions',
    status: 'Status',
    name: 'Name',
    select: 'Select',
    createNew: 'Create New',
    export: 'Export',
    import: 'Import',
    noDataAvailable: 'No data available',
    showingRecords: 'Showing {start} to {end} of {total} records',
    comingSoon: 'Coming Soon',
    
    // Authentication
    loginSubtitle: 'Enter your account to continue',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot your password?',
    signIn: 'Sign in',
    orSignInWith: 'Or sign in with',
    loginButton: 'Sign in with Microsoft',
    verificationTitle: 'Account Verification',
    verificationSubtitle: 'Your account is being verified. Please wait...',
    verificationCode: 'Verification code',
    verify: 'Verify',
    resendCode: 'Resend code',
    backToLogin: 'Back to login',
    verifyingAccount: 'Verifying account',

    // Main App
    welcomeMessage: 'Welcome to GEESTOR',
    welcomeSubtitle: 'Business management system of the Electromedical Business Group',
    selectSection: 'Select a section from the menu to get started',
    mainContent: 'Main Content',
    noContentSelected: 'No content selected',
    
    // Sidebar sections
    bidAnalyzer: 'Cost Analysis',
    hojasCambio: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    businessManagement: 'Business Management',
    
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    userProfile: 'User Profile',
    logout: 'Logout',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    spanish: 'Spanish',
    english: 'English',
    saveChanges: 'Save changes',

    // Change Sheets
    changeSheets: 'Change Sheets',
    createChangeSheet: 'Create Change Sheet',
    changeSheetsList: 'Change Sheets List',
    changeSheetsManagement: 'Change Sheets Management',
    noChangeSheetsFound: 'No change sheets found',
    searchChangeSheets: 'Search change sheets...',
    filterByStatus: 'Filter by status',
    allStatuses: 'All statuses',
    pending: 'Pending',
    inProgress: 'In Progress',
    approved: 'Approved',
    rejected: 'Rejected',
    viewDetails: 'View details',
    
    // Change Sheet Form
    changeSheetForm: 'Change Sheet Form',
    changeSheetDetails: 'Change Sheet Details',
    basicInformation: 'Basic Information',
    changeSheetNumber: 'Change Sheet Number',
    title: 'Title',
    description: 'Description',
    requestedBy: 'Requested by',
    assignedTo: 'Assigned to',
    department: 'Department',
    priority: 'Priority',
    requestDate: 'Request Date',
    dueDate: 'Due Date',
    completionDate: 'Completion Date',
    estimatedHours: 'Estimated Hours',
    actualHours: 'Actual Hours',
    category: 'Category',
    tags: 'Tags',
    attachments: 'Attachments',
    comments: 'Comments',
    approvalSection: 'Approval Section',
    requiresApproval: 'Requires Approval',
    approvedBy: 'Approved by',
    approvalDate: 'Approval Date',
    approvalComments: 'Approval Comments',
    technicalDetails: 'Technical Details',
    impactAnalysis: 'Impact Analysis',
    riskAssessment: 'Risk Assessment',
    testingRequirements: 'Testing Requirements',
    rollbackPlan: 'Rollback Plan',
    saveAndClose: 'Save and Close',
    draft: 'Draft',
    submit: 'Submit',
    
    // Change Sheet specific
    employeeName: 'Employee Name',
    employeeLastName: 'Employee Last Name',
    originCenter: 'Origin Center',
    destinationCenter: 'Destination Center',
    startDate: 'Start Date',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    exportPDF: 'Export PDF',
    detailViewPlaceholder: 'Detail view under development',
    
    // Employee Agreements
    employeeAgreementsList: 'Employee Agreements List',
    employeeAgreementsManagement: 'Employee Agreements Management',
    createEmployeeAgreement: 'Create Employee Agreement',
    noEmployeeAgreementsFound: 'No employee agreements found',
    searchEmployeeAgreements: 'Search employee agreements...',
    employeeAgreementDetails: 'Employee Agreement Details',
    employee: 'Employee',
    workCenter: 'Work Center',
    agreementConcept: 'Agreement Concept',
    agreementDetail: 'Agreement Detail',
    
    // Real Estate
    realEstateList: 'Real Estate List',
    createRealEstate: 'Create Real Estate',
    noRealEstateFound: 'No real estate found',
    searchRealEstate: 'Search real estate...',
    
    // Bid Analyzer
    bidAnalyzerTitle: 'Bid Analyzer',
    uploadPCAP: 'Upload PCAP',
    uploadPTT: 'Upload PTT',
    dragDropPDF: 'Drag and drop your PDF file here',
    selectPDF: 'Select PDF',
    analyzeDocuments: 'Analyze Documents',
    
    // Chatbot
    chatbot: 'Chatbot',
    askGEEorge: 'Ask GEEorge',
    typeMessage: 'Type your message...',
    thinking: 'Thinking',
    writing: 'Writing',
  },
};
