
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export const translations = {
  es: {
    // Navigation
    language: 'Idioma',
    home: 'Inicio',
    talentManagement: 'Gestión de Talento',
    realEstateManagement: 'Gestión Inmobiliaria',
    
    // User Profile
    userProfile: 'Perfil de Usuario',
    logout: 'Cerrar Sesión',
    changePhoto: 'Cambiar Foto',
    personalInformation: 'Información Personal',
    name: 'Nombre',
    email: 'Correo Electrónico',
    
    // Permissions - Adding missing keys
    permissions: 'Permisos',
    permissionsDescription: 'Permisos asignados a tu cuenta',
    departmentPermissions: 'Permisos de Departamento',
    operations: 'Operaciones',
    technicalManagement: 'Gestión Técnica',
    actionPermissions: 'Permisos de Acciones',
    create: 'Crear',
    modify: 'Modificar',
    delete: 'Eliminar',
    view: 'Ver',
    
    // Settings
    settings: 'Configuración',
    profile: 'Perfil',
    saveChanges: 'Guardar Cambios',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    spanish: 'Español',
    english: 'Inglés',
    
    // Bid Analyzer
    bidAnalyzer: 'Analizador de Licitaciones',
    uploadDocuments: 'Subir Documentos',
    analyzeScores: 'Analizar Puntuaciones',
    calculateEconomicScore: 'Calcular Puntuación Económica',
    
    // Real Estate
    realEstateData: 'Datos Inmobiliarios',
    uploadRealEstateData: 'Subir Datos Inmobiliarios',
    realEstateDashboard: 'Panel Inmobiliario',
    activeProperties: 'Propiedades Activas',
    inactiveProperties: 'Propiedades Inactivas',
    totalProperties: 'Total de Propiedades',
    exportPDF: 'Exportar PDF',
    realEstateDetails: 'Detalles Inmobiliarios',
    detailViewPlaceholder: 'Vista de detalles del inmueble',
    comingSoon: 'Próximamente',
    
    // Maintenance Calendar
    maintenanceCalendar: 'Calendario de Mantenimiento',
    
    // Practice Evaluations
    practiceEvaluations: 'Evaluaciones de Prácticas',
    createEvaluation: 'Crear Evaluación',
    
    // Exit Interviews
    exitInterviews: 'Entrevistas de Salida',
    
    // Change Sheets - Adding all missing keys
    changeSheets: 'Hojas de Cambio',
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    hojasCambio: 'Hojas de Cambio',
    employeeName: 'Nombre del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    newPosition: 'Nueva Posición',
    newSupervisorName: 'Nombre del Nuevo Supervisor',
    newSupervisorLastName: 'Apellidos del Nuevo Supervisor',
    originCenter: 'Centro de Origen',
    startDate: 'Fecha de Inicio',
    status: 'Estado',
    actions: 'Acciones',
    createNew: 'Crear Nuevo',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    
    // Contract Requests - Adding new fields
    contractRequests: 'Solicitudes de Contrato',
    contractRequestTitle: 'SOLICITUD DE CONTRATACIÓN',
    selectedCandidate: 'Candidato Seleccionado',
    selectedCandidateName: 'Nombre Candidato Seleccionado',
    selectedCandidateLastName: 'Apellidos Candidato Seleccionado',
    contractType: 'Tipo de Contrato',
    salary: 'Salario',
    observations: 'Observaciones',
    incorporationDate: 'Fecha de Incorporación',
    company: 'Empresa',
    position: 'Puesto de Trabajo',
    professionalCategory: 'Categoría Profesional',
    city: 'Población',
    province: 'Provincia',
    autonomousCommunity: 'Comunidad Autónoma',
    workCenter: 'Centro de Trabajo',
    directSupervisorName: 'Nombre Responsable Directo',
    directSupervisorLastName: 'Apellidos Responsable Directo',
    companyFloor: 'Piso de Empresa',
    otherDataTitle: 'Otros Datos de Interés',
    language1: 'Idioma',
    level1: 'Nivel',
    language2: 'Idioma 2',
    level2: 'Nivel 2',
    electromedicalExperience: 'Experiencia Previa en Electromedicina',
    installationExperience: 'Experiencia Previa en Instalaciones',
    hiringReason: 'Motivo de la Contratación',
    commitmentsObservations: 'Observaciones y/o Compromisos',
    department: 'Departamento',
    back: 'Volver',
    yes: 'Sí',
    no: 'No',
    
    // Employee Agreements
    employeeAgreements: 'Acuerdos de Empleados',
    recordNotFound: 'Registro no encontrado',
    employeeInformation: 'Información del Empleado',
    agreementDetails: 'Detalles del Acuerdo',
    agreementType: 'Tipo de Acuerdo',
    endDate: 'Fecha de Fin',
    benefitsAndConditions: 'Beneficios y Condiciones',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    employeeAgreementDetails: 'Detalles del Acuerdo de Empleado',
    
    // Cost Analysis
    costAnalysis: 'Análisis de Costos',
    
    // Authentication
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
    emailAddress: 'Dirección de Correo',
    password: 'Contraseña',
    signInWithEmail: 'Iniciar Sesión con Email',
    signInWithGoogle: 'Iniciar Sesión con Google',
    forgotPassword: 'Olvidé mi Contraseña',
    createNewAccount: 'Crear Nueva Cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    loading: 'Cargando...',
    verifyingAccount: 'Verificando Cuenta...',
    welcome: 'Bienvenido',
    loginSubtitle: 'Accede a tu cuenta para continuar',
    loginButton: 'Iniciar Sesión',
    
    // PDF Generation
    generatedOn: 'Generado el',
    documentGenerated: 'Documento Generado',
    
    // Common
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    add: 'Agregar',
    remove: 'Eliminar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    download: 'Descargar',
    upload: 'Subir',
    submit: 'Enviar',
    reset: 'Restablecer',
    clear: 'Limpiar',
    close: 'Cerrar',
    open: 'Abrir',
    expand: 'Expandir',
    collapse: 'Contraer',
    
    // Status
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    completed: 'Completado',
    draft: 'Borrador',
    published: 'Publicado',
    
    // Errors
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    
    // Time
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    thisYear: 'Este Año',
    
    // File types
    pdf: 'PDF',
    excel: 'Excel',
    word: 'Word',
    image: 'Imagen',
    document: 'Documento'
  },
  en: {
    // Navigation
    language: 'Language',
    home: 'Home',
    talentManagement: 'Talent Management',
    realEstateManagement: 'Real Estate Management',
    
    // User Profile
    userProfile: 'User Profile',
    logout: 'Logout',
    changePhoto: 'Change Photo',
    personalInformation: 'Personal Information',
    name: 'Name',
    email: 'Email',
    
    // Permissions - Adding missing keys
    permissions: 'Permissions',
    permissionsDescription: 'Permissions assigned to your account',
    departmentPermissions: 'Department Permissions',
    operations: 'Operations',
    technicalManagement: 'Technical Management',
    actionPermissions: 'Action Permissions',
    create: 'Create',
    modify: 'Modify',
    delete: 'Delete',
    view: 'View',
    
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    saveChanges: 'Save Changes',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    spanish: 'Spanish',
    english: 'English',
    
    // Bid Analyzer
    bidAnalyzer: 'Bid Analyzer',
    uploadDocuments: 'Upload Documents',
    analyzeScores: 'Analyze Scores',
    calculateEconomicScore: 'Calculate Economic Score',
    
    // Real Estate
    realEstateData: 'Real Estate Data',
    uploadRealEstateData: 'Upload Real Estate Data',
    realEstateDashboard: 'Real Estate Dashboard',
    activeProperties: 'Active Properties',
    inactiveProperties: 'Inactive Properties',
    totalProperties: 'Total Properties',
    exportPDF: 'Export PDF',
    realEstateDetails: 'Real Estate Details',
    detailViewPlaceholder: 'Property detail view',
    comingSoon: 'Coming Soon',
    
    // Maintenance Calendar
    maintenanceCalendar: 'Maintenance Calendar',
    
    // Practice Evaluations
    practiceEvaluations: 'Practice Evaluations',
    createEvaluation: 'Create Evaluation',
    
    // Exit Interviews
    exitInterviews: 'Exit Interviews',
    
    // Change Sheets - Adding all missing keys
    changeSheets: 'Change Sheets',
    changeSheetsManagement: 'Change Sheets Management',
    hojasCambio: 'Change Sheets',
    employeeName: 'Employee Name',
    employeeLastName: 'Employee Last Name',
    newPosition: 'New Position',
    newSupervisorName: 'New Supervisor Name',
    newSupervisorLastName: 'New Supervisor Last Name',
    originCenter: 'Origin Center',
    startDate: 'Start Date',
    status: 'Status',
    actions: 'Actions',
    createNew: 'Create New',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    
    // Contract Requests - Adding new fields
    contractRequests: 'Contract Requests',
    contractRequestTitle: 'CONTRACT REQUEST',
    selectedCandidate: 'Selected Candidate',
    selectedCandidateName: 'Selected Candidate Name',
    selectedCandidateLastName: 'Selected Candidate Last Name',
    contractType: 'Contract Type',
    salary: 'Salary',
    observations: 'Observations',
    incorporationDate: 'Incorporation Date',
    company: 'Company',
    position: 'Position',
    professionalCategory: 'Professional Category',
    city: 'City',
    province: 'Province',
    autonomousCommunity: 'Autonomous Community',
    workCenter: 'Work Center',
    directSupervisorName: 'Direct Supervisor Name',
    directSupervisorLastName: 'Direct Supervisor Last Name',
    companyFloor: 'Company Floor',
    otherDataTitle: 'Other Data of Interest',
    language1: 'Language',
    level1: 'Level',
    language2: 'Language 2',
    level2: 'Level 2',
    electromedicalExperience: 'Previous Electromedical Experience',
    installationExperience: 'Previous Installation Experience',
    hiringReason: 'Hiring Reason',
    commitmentsObservations: 'Observations and/or Commitments',
    department: 'Department',
    back: 'Back',
    yes: 'Yes',
    no: 'No',
    
    // Employee Agreements
    employeeAgreements: 'Employee Agreements',
    recordNotFound: 'Record not found',
    employeeInformation: 'Employee Information',
    agreementDetails: 'Agreement Details',
    agreementType: 'Agreement Type',
    endDate: 'End Date',
    benefitsAndConditions: 'Benefits and Conditions',
    benefits: 'Benefits',
    conditions: 'Conditions',
    employeeAgreementDetails: 'Employee Agreement Details',
    
    // Cost Analysis
    costAnalysis: 'Cost Analysis',
    
    // Authentication
    signIn: 'Sign In',
    signOut: 'Sign Out',
    emailAddress: 'Email Address',
    password: 'Password',
    signInWithEmail: 'Sign In with Email',
    signInWithGoogle: 'Sign In with Google',
    forgotPassword: 'Forgot Password',
    createNewAccount: 'Create New Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    loading: 'Loading...',
    verifyingAccount: 'Verifying Account...',
    welcome: 'Welcome',
    loginSubtitle: 'Access your account to continue',
    loginButton: 'Sign In',
    
    // PDF Generation
    generatedOn: 'Generated on',
    documentGenerated: 'Document Generated',
    
    // Common
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    submit: 'Submit',
    reset: 'Reset',
    clear: 'Clear',
    close: 'Close',
    open: 'Open',
    expand: 'Expand',
    collapse: 'Collapse',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    draft: 'Draft',
    published: 'Published',
    
    // Errors
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    
    // File types
    pdf: 'PDF',
    excel: 'Excel',
    word: 'Word',
    image: 'Image',
    document: 'Document'
  }
};
