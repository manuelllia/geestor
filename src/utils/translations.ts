
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
    update: 'actualizar',
    refresh: 'actualizar',
    search: 'buscar',
    filter: 'filtrar',
    export: 'exportar',
    import: 'importar',
    
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
    time: 'hora',
    description: 'descripción',
    notes: 'notas',
    comments: 'comentarios',
    
    // Mensajes del sistema
    welcomeBack: 'bienvenido de vuelta',
    loginWith: 'iniciar sesión con',
    microsoft: 'microsoft',
    verifyingCredentials: 'verificando credenciales',
    pleaseWait: 'por favor espera',
    
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
    gestionTalento: 'gestión de talento'
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
    update: 'update',
    refresh: 'refresh',
    search: 'search',
    filter: 'filter',
    export: 'export',
    import: 'import',
    
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
    time: 'time',
    description: 'description',
    notes: 'notes',
    comments: 'comments',
    
    // System messages
    welcomeBack: 'welcome back',
    loginWith: 'login with',
    microsoft: 'microsoft',
    verifyingCredentials: 'verifying credentials',
    pleaseWait: 'please wait',
    
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
    gestionTalento: 'talent management'
  }
};
