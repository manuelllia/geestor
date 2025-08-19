
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
    
    // Bid Analyzer
    bidAnalyzer: 'Analizador de Licitaciones',
    uploadDocuments: 'Subir Documentos',
    analyzeScores: 'Analizar Puntuaciones',
    calculateEconomicScore: 'Calcular Puntuación Económica',
    
    // Real Estate
    realEstateData: 'Datos Inmobiliarios',
    uploadRealEstateData: 'Subir Datos Inmobiliarios',
    
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
    
    // Contract Requests
    contractRequests: 'Solicitudes de Contrato',
    
    // Employee Agreements
    employeeAgreements: 'Acuerdos de Empleados',
    
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
    
    // Bid Analyzer
    bidAnalyzer: 'Bid Analyzer',
    uploadDocuments: 'Upload Documents',
    analyzeScores: 'Analyze Scores',
    calculateEconomicScore: 'Calculate Economic Score',
    
    // Real Estate
    realEstateData: 'Real Estate Data',
    uploadRealEstateData: 'Upload Real Estate Data',
    
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
    
    // Contract Requests
    contractRequests: 'Contract Requests',
    
    // Employee Agreements
    employeeAgreements: 'Employee Agreements',
    
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
