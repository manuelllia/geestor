export type Language = 'es' | 'en';

interface Translations {
  language: string;
  of: string;
  welcome: string;
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
  welcomeMessage: string;
  welcomeSubtitle: string;
  selectSection: string;
  mainContent: string;
  noContentSelected: string;
  home: string;
  bidAnalyzer: string;
  hojasCambio: string;
  employeeAgreements: string;
  realEstateManagement: string;
  businessManagement: string;
  settings: string;
  profile: string;
  logout: string;
  darkMode: string;
  lightMode: string;
  spanish: string;
  english: string;
  saveChanges: string;
  cancel: string;
  // Change Sheets translations
  changeSheets: string;
  createChangeSheet: string;
  changeSheetsList: string;
  noChangeSheetsFound: string;
  searchChangeSheets: string;
  filterByStatus: string;
  allStatuses: string;
  pending: string;
  inProgress: string;
  approved: string;
  rejected: string;
  viewDetails: string;
  edit: string;
  delete: string;
  // Change Sheet Form translations
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
  status: string;
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
  save: string;
  saveAndClose: string;
  draft: string;
  submit: string;
  back: string;
  // Employee Agreements translations
  employeeAgreementsList: string;
  createEmployeeAgreement: string;
  noEmployeeAgreementsFound: string;
  searchEmployeeAgreements: string;
  // Real Estate translations
  realEstateList: string;
  createRealEstate: string;
  noRealEstateFound: string;
  searchRealEstate: string;
  // Bid Analyzer translations
  bidAnalyzerTitle: string;
  uploadPCAP: string;
  uploadPTT: string;
  dragDropPDF: string;
  selectPDF: string;
  analyzeDocuments: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    language: 'Idioma',
    of: 'de',
    welcome: 'Bienvenido',
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
    welcomeMessage: 'Bienvenido a GEESTOR',
    welcomeSubtitle: 'Sistema de gestión empresarial del Grupo Empresarial Electromédico',
    selectSection: 'Selecciona una sección del menú para comenzar',
    mainContent: 'Contenido Principal',
    noContentSelected: 'No hay contenido seleccionado',
    home: 'Inicio',
    bidAnalyzer: 'Análisis de Costes',
    hojasCambio: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdo Empleado',
    realEstateManagement: 'Gestión de Inmuebles',
    businessManagement: 'Gestión Empresarial',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    spanish: 'Español',
    english: 'Inglés',
    saveChanges: 'Guardar cambios',
    cancel: 'Cancelar',
    // Change Sheets translations
    changeSheets: 'Hojas de Cambio',
    createChangeSheet: 'Crear Hoja de Cambio',
    changeSheetsList: 'Lista de Hojas de Cambio',
    noChangeSheetsFound: 'No se encontraron hojas de cambio',
    searchChangeSheets: 'Buscar hojas de cambio...',
    filterByStatus: 'Filtrar por estado',
    allStatuses: 'Todos los estados',
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    viewDetails: 'Ver detalles',
    edit: 'Editar',
    delete: 'Eliminar',
    // Change Sheet Form translations
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
    status: 'Estado',
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
    save: 'Guardar',
    saveAndClose: 'Guardar y Cerrar',
    draft: 'Borrador',
    submit: 'Enviar',
    back: 'Atrás',
    // Employee Agreements translations
    employeeAgreementsList: 'Lista de Acuerdos de Empleados',
    createEmployeeAgreement: 'Crear Acuerdo de Empleado',
    noEmployeeAgreementsFound: 'No se encontraron acuerdos de empleados',
    searchEmployeeAgreements: 'Buscar acuerdos de empleados...',
    // Real Estate translations
    realEstateList: 'Lista de Inmuebles',
    createRealEstate: 'Crear Inmueble',
    noRealEstateFound: 'No se encontraron inmuebles',
    searchRealEstate: 'Buscar inmuebles...',
    // Bid Analyzer translations
    bidAnalyzerTitle: 'Analizador de Licitaciones',
    uploadPCAP: 'Subir PCAP',
    uploadPTT: 'Subir PTT',
    dragDropPDF: 'Arrastra y suelta tu archivo PDF aquí',
    selectPDF: 'Seleccionar PDF',
    analyzeDocuments: 'Analizar Documentos',
  },
  en: {
    language: 'Language',
    of: 'of',
    welcome: 'Welcome',
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
    welcomeMessage: 'Welcome to GEESTOR',
    welcomeSubtitle: 'Business management system of the Electromedical Business Group',
    selectSection: 'Select a section from the menu to get started',
    mainContent: 'Main Content',
    noContentSelected: 'No content selected',
    home: 'Home',
    bidAnalyzer: 'Cost Analysis',
    hojasCambio: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    businessManagement: 'Business Management',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    spanish: 'Spanish',
    english: 'English',
    saveChanges: 'Save changes',
    cancel: 'Cancel',
    // Change Sheets translations
    changeSheets: 'Change Sheets',
    createChangeSheet: 'Create Change Sheet',
    changeSheetsList: 'Change Sheets List',
    noChangeSheetsFound: 'No change sheets found',
    searchChangeSheets: 'Search change sheets...',
    filterByStatus: 'Filter by status',
    allStatuses: 'All statuses',
    pending: 'Pending',
    inProgress: 'In Progress',
    approved: 'Approved',
    rejected: 'Rejected',
    viewDetails: 'View details',
    edit: 'Edit',
    delete: 'Delete',
    // Change Sheet Form translations
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
    status: 'Status',
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
    save: 'Save',
    saveAndClose: 'Save and Close',
    draft: 'Draft',
    submit: 'Submit',
    back: 'Back',
    // Employee Agreements translations
    employeeAgreementsList: 'Employee Agreements List',
    createEmployeeAgreement: 'Create Employee Agreement',
    noEmployeeAgreementsFound: 'No employee agreements found',
    searchEmployeeAgreements: 'Search employee agreements...',
    // Real Estate translations
    realEstateList: 'Real Estate List',
    createRealEstate: 'Create Real Estate',
    noRealEstateFound: 'No real estate found',
    searchRealEstate: 'Search real estate...',
    // Bid Analyzer translations
    bidAnalyzerTitle: 'Bid Analyzer',
    uploadPCAP: 'Upload PCAP',
    uploadPTT: 'Upload PTT',
    dragDropPDF: 'Drag and drop your PDF file here',
    selectPDF: 'Select PDF',
    analyzeDocuments: 'Analyze Documents',
  },
};
