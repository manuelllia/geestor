
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export const translations = {
  es: {
    // Navegación básica
    of: 'de',
    to: 'para',
    records: 'registros',
    
    // Temas
    light: 'claro',
    dark: 'oscuro',
    language: 'idioma',
    theme: 'tema',
    
    // Navegación principal
    dashboard: 'panel',
    operations: 'operaciones',
    technicalManagement: 'gestión técnica',
    talentManagement: 'gestión de talento',
    
    // Botones y acciones básicas
    settings: 'configuración',
    profile: 'perfil',
    admin: 'admin',
    logout: 'cerrar sesión',
    login: 'iniciar sesión',
    cancel: 'cancelar',
    save: 'guardar',
    edit: 'editar',
    delete: 'eliminar',
    create: 'crear',
    createNew: 'crear nuevo',
    update: 'actualizar',
    refresh: 'actualizar',
    search: 'buscar',
    filter: 'filtrar',
    export: 'exportar',
    exportPDF: 'exportar PDF',
    import: 'importar',
    back: 'volver',
    view: 'ver',
    actions: 'acciones',
    duplicateRecord: 'duplicar registro',
    downloadPDF: 'descargar PDF',
    
    // Estados
    active: 'activo',
    inactive: 'inactivo',
    pending: 'pendiente',
    completed: 'completado',
    loading: 'cargando',
    error: 'error',
    success: 'éxito',
    warning: 'advertencia',
    info: 'información',
    status: 'estado',
    
    // Formularios
    name: 'nombre',
    fullName: 'nombre completo',
    email: 'correo electrónico',
    phone: 'teléfono',
    address: 'dirección',
    city: 'ciudad',
    state: 'estado',
    country: 'país',
    zipCode: 'código postal',
    date: 'fecha',
    startDate: 'fecha de inicio',
    time: 'hora',
    description: 'descripción',
    notes: 'notas',
    comments: 'comentarios',
    employeeName: 'nombre del empleado',
    originCenter: 'centro de origen',
    
    // Mensajes del sistema
    welcomeBack: 'bienvenido de vuelta',
    loginWith: 'iniciar sesión con',
    microsoft: 'microsoft',
    verifyingCredentials: 'verificando credenciales',
    verifyingAccount: 'verificando cuenta',
    pleaseWait: 'por favor espera',
    
    // Login específico
    welcome: 'bienvenido',
    loginSubtitle: 'accede a tu cuenta para continuar',
    loginButton: 'iniciar sesión',
    
    // Navegación específica
    home: 'inicio',
    costAnalysis: 'análisis de coste',
    maintenanceCalendar: 'calendario de mantenimiento',
    contractRequests: 'solicitudes de contratación',
    changeSheets: 'hojas de cambio',
    employeeAgreements: 'acuerdo con empleados',
    realEstateManagement: 'gestión de inmuebles',
    practiceEvaluations: 'valoración de prácticas',
    exitInterviews: 'entrevista de salida',
    checkers: 'comprobadores',
    
    // Gestión específica
    changeSheetsManagement: 'gestión de hojas de cambio',
    hojasCambio: 'hojas de cambio',
    changeSheetDetails: 'detalles de hoja de cambio',
    employeeAgreementDetails: 'detalles de acuerdo de empleado',
    detailViewPlaceholder: 'Vista de detalles en desarrollo',
    comingSoon: 'próximamente',
    
    // Real Estate
    realEstateDashboard: 'panel de inmuebles',
    realEstateDetails: 'detalles de inmueble',
    activeProperties: 'propiedades activas',
    inactiveProperties: 'propiedades inactivas',
    totalProperties: 'total de propiedades',
    
    // Gestión de usuarios y permisos
    userProfile: 'perfil de usuario',
    personalInformation: 'información personal',
    userId: 'id de usuario',
    permissions: 'permisos',
    currentPermissions: 'permisos actuales',
    administrator: 'administrador',
    administratorAccess: 'acceso de administrador',
    adminFullAccess: 'acceso completo a todos los departamentos',
    accessToAllDepartments: 'acceso a todos los departamentos',
    allowed: 'permitido',
    denied: 'denegado',
    
    // Acciones de perfil
    editProfile: 'editar perfil',
    profileUpdated: 'perfil actualizado',
    profileUpdatedDescription: 'tu información ha sido actualizada correctamente',
    errorUpdatingProfile: 'error al actualizar el perfil',
    loggedOutSuccessfully: 'sesión cerrada correctamente',
    sessionClosedSecurely: 'la sesión se cerró de forma segura',
    errorLoggingOut: 'error al cerrar sesión',
    saving: 'guardando',
    loggingOut: 'cerrando sesión',
    
    // Valoración de prácticas
    managePracticeEvaluations: 'gestiona las valoraciones de prácticas realizadas por los tutores de GEE',
    generateEvaluationLink: 'generar enlace de valoración',
    noPracticeEvaluations: 'no hay valoraciones de prácticas registradas',
    generateLinkToStart: 'genera un enlace para comenzar a recibir valoraciones',
    student: 'estudiante',
    tutor: 'tutor',
    workCenter: 'centro de trabajo',
    formation: 'formación',
    finalEvaluation: 'evaluación final',
    rating: 'valoración',
    linkGenerated: 'enlace generado',
    linkGeneratedDescription: 'el enlace se ha copiado al portapapeles',
    errorGeneratingLink: 'error al generar enlace',
    
    // Estados específicos
    apt: 'apto',
    notApt: 'no apto',
    
    // Temas de configuración
    applicationSettings: 'configuración de la aplicación',
    languageSettings: 'configuración de idioma',
    themeSettings: 'configuración de tema',
    selectLanguage: 'seleccionar idioma',
    selectTheme: 'seleccionar tema',
    spanish: 'español',
    english: 'inglés',
    lightTheme: 'tema claro',
    darkTheme: 'tema oscuro',
    
    // Accessibility
    close: 'cerrar',
    open: 'abrir',
    menu: 'menú',
    navigation: 'navegación',
    screenReader: 'lector de pantalla',
    
    // Datos y tablas
    noData: 'no hay datos',
    noResults: 'no hay resultados',
    itemsPerPage: 'elementos por página',
    page: 'página',
    previous: 'anterior',
    next: 'siguiente',
    first: 'primero',
    last: 'último',
    
    // Fechas y tiempo
    today: 'hoy',
    yesterday: 'ayer',
    tomorrow: 'mañana',
    thisWeek: 'esta semana',
    thisMonth: 'este mes',
    thisYear: 'este año',
    
    // Acciones específicas de archivo
    uploadFile: 'subir archivo',
    downloadFile: 'descargar archivo',
    selectFile: 'seleccionar archivo',
    fileUploaded: 'archivo subido',
    fileNotFound: 'archivo no encontrado',
    
    // Mantenimiento específico
    maintenanceType: 'tipo de mantenimiento',
    preventive: 'preventivo',
    corrective: 'correctivo',
    predictive: 'predictivo',
    calibration: 'calibración',
    
    // Gestión Técnica específica
    gestionTecnica: 'gestión técnica',
    gestionTalento: 'gestión de talento',
    
    // Calendario de mantenimiento
    maintenanceCalendarGeneration: 'generación de calendario de mantenimiento',
    generateCalendar: 'generar calendario',
    calendarGenerated: 'calendario generado',
    monthlyHours: 'horas mensuales',
    annualHours: 'horas anuales',
    
    // Evaluación de prácticas - formulario
    practiceEvaluationForm: 'formulario de evaluación de prácticas',
    studentData: 'datos del estudiante',
    tutorData: 'datos del tutor',
    evaluationData: 'datos de evaluación',
    submitEvaluation: 'enviar evaluación',
    evaluationSubmitted: 'evaluación enviada',
    evaluationSubmittedDescription: 'la evaluación ha sido enviada correctamente',
    errorSubmittingEvaluation: 'error al enviar evaluación',
    invalidLink: 'enlace no válido',
    evaluationNotFound: 'no se encontró la evaluación solicitada',
    
    // Nuevas traducciones para formularios
    required: 'requerido',
    optional: 'opcional',
    selectOption: 'seleccionar opción',
    pleaseSelect: 'por favor selecciona'
  },
  en: {
    // Basic navigation
    of: 'of',
    to: 'to',
    records: 'records',
    
    // Themes
    light: 'light',
    dark: 'dark',
    language: 'language',
    theme: 'theme',
    
    // Main navigation
    dashboard: 'dashboard',
    operations: 'operations',
    technicalManagement: 'technical management',
    talentManagement: 'talent management',
    
    // Basic buttons and actions
    settings: 'settings',
    profile: 'profile',
    admin: 'admin',
    logout: 'logout',
    login: 'login',
    cancel: 'cancel',
    save: 'save',
    edit: 'edit',
    delete: 'delete',
    create: 'create',
    createNew: 'create new',
    update: 'update',
    refresh: 'refresh',
    search: 'search',
    filter: 'filter',
    export: 'export',
    exportPDF: 'export PDF',
    import: 'import',
    back: 'back',
    view: 'view',
    actions: 'actions',
    duplicateRecord: 'duplicate record',
    downloadPDF: 'download PDF',
    
    // States
    active: 'active',
    inactive: 'inactive',
    pending: 'pending',
    completed: 'completed',
    loading: 'loading',
    error: 'error',
    success: 'success',
    warning: 'warning',
    info: 'info',
    status: 'status',
    
    // Forms
    name: 'name',
    fullName: 'full name',
    email: 'email',
    phone: 'phone',
    address: 'address',
    city: 'city',
    state: 'state',
    country: 'country',
    zipCode: 'zip code',
    date: 'date',
    startDate: 'start date',
    time: 'time',
    description: 'description',
    notes: 'notes',
    comments: 'comments',
    employeeName: 'employee name',
    originCenter: 'origin center',
    
    // System messages
    welcomeBack: 'welcome back',
    loginWith: 'login with',
    microsoft: 'microsoft',
    verifyingCredentials: 'verifying credentials',
    verifyingAccount: 'verifying account',
    pleaseWait: 'please wait',
    
    // Login specific
    welcome: 'welcome',
    loginSubtitle: 'sign in to your account to continue',
    loginButton: 'sign in',
    
    // Specific navigation
    home: 'home',
    costAnalysis: 'cost analysis',
    maintenanceCalendar: 'maintenance calendar',
    contractRequests: 'contract requests',
    changeSheets: 'change sheets',
    employeeAgreements: 'employee agreements',
    realEstateManagement: 'real estate management',
    practiceEvaluations: 'practice evaluations',
    exitInterviews: 'exit interviews',
    checkers: 'checkers',
    
    // Specific management
    changeSheetsManagement: 'change sheets management',
    hojasCambio: 'change sheets',
    changeSheetDetails: 'change sheet details',
    employeeAgreementDetails: 'employee agreement details',
    detailViewPlaceholder: 'Detail view under development',
    comingSoon: 'coming soon',
    
    // Real Estate
    realEstateDashboard: 'real estate dashboard',
    realEstateDetails: 'real estate details',
    activeProperties: 'active properties',
    inactiveProperties: 'inactive properties',
    totalProperties: 'total properties',
    
    // User management and permissions
    userProfile: 'user profile',
    personalInformation: 'personal information',
    userId: 'user id',
    permissions: 'permissions',
    currentPermissions: 'current permissions',
    administrator: 'administrator',
    administratorAccess: 'administrator access',
    adminFullAccess: 'full access to all departments',
    accessToAllDepartments: 'access to all departments',
    allowed: 'allowed',
    denied: 'denied',
    
    // Profile actions
    editProfile: 'edit profile',
    profileUpdated: 'profile updated',
    profileUpdatedDescription: 'your information has been updated successfully',
    errorUpdatingProfile: 'error updating profile',
    loggedOutSuccessfully: 'logged out successfully',
    sessionClosedSecurely: 'session closed securely',
    errorLoggingOut: 'error logging out',
    saving: 'saving',
    loggingOut: 'logging out',
    
    // Practice evaluations
    managePracticeEvaluations: 'manage practice evaluations conducted by GEE tutors',
    generateEvaluationLink: 'generate evaluation link',
    noPracticeEvaluations: 'no practice evaluations recorded',
    generateLinkToStart: 'generate a link to start receiving evaluations',
    student: 'student',
    tutor: 'tutor',
    workCenter: 'work center',
    formation: 'training',
    finalEvaluation: 'final evaluation',
    rating: 'rating',
    linkGenerated: 'link generated',
    linkGeneratedDescription: 'the link has been copied to clipboard',
    errorGeneratingLink: 'error generating link',
    
    // Specific states
    apt: 'suitable',
    notApt: 'not suitable',
    
    // Configuration themes
    applicationSettings: 'application settings',
    languageSettings: 'language settings',
    themeSettings: 'theme settings',
    selectLanguage: 'select language',
    selectTheme: 'select theme',
    spanish: 'spanish',
    english: 'english',
    lightTheme: 'light theme',
    darkTheme: 'dark theme',
    
    // Accessibility
    close: 'close',
    open: 'open',
    menu: 'menu',
    navigation: 'navigation',
    screenReader: 'screen reader',
    
    // Data and tables
    noData: 'no data',
    noResults: 'no results',
    itemsPerPage: 'items per page',
    page: 'page',
    previous: 'previous',
    next: 'next',
    first: 'first',
    last: 'last',
    
    // Dates and time
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    thisWeek: 'this week',
    thisMonth: 'this month',
    thisYear: 'this year',
    
    // Specific file actions
    uploadFile: 'upload file',
    downloadFile: 'download file',
    selectFile: 'select file',
    fileUploaded: 'file uploaded',
    fileNotFound: 'file not found',
    
    // Specific maintenance
    maintenanceType: 'maintenance type',
    preventive: 'preventive',
    corrective: 'corrective',
    predictive: 'predictive',
    calibration: 'calibration',
    
    // Specific Technical Management
    gestionTecnica: 'technical management',
    gestionTalento: 'talent management',
    
    // Maintenance calendar
    maintenanceCalendarGeneration: 'maintenance calendar generation',
    generateCalendar: 'generate calendar',
    calendarGenerated: 'calendar generated',
    monthlyHours: 'monthly hours',
    annualHours: 'annual hours',
    
    // Practice evaluation - form
    practiceEvaluationForm: 'practice evaluation form',
    studentData: 'student data',
    tutorData: 'tutor data',
    evaluationData: 'evaluation data',
    submitEvaluation: 'submit evaluation',
    evaluationSubmitted: 'evaluation submitted',
    evaluationSubmittedDescription: 'the evaluation has been submitted successfully',
    errorSubmittingEvaluation: 'error submitting evaluation',
    invalidLink: 'invalid link',
    evaluationNotFound: 'evaluation not found',
    
    // New translations for forms
    required: 'required',
    optional: 'optional',
    selectOption: 'select option',
    pleaseSelect: 'please select'
  }
};
