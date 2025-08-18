
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export const translations = {
  es: {
    // Navegación y menús
    dashboard: 'Panel Principal',
    operations: 'Operaciones',
    technicalManagement: 'Gestión Técnica',
    talentManagement: 'Gestión de Talento',
    settings: 'Configuración',
    profile: 'Perfil',
    admin: 'ADMIN',
    logout: 'Cerrar Sesión',
    
    // Análisis de costes
    costAnalysis: 'Análisis de Costes',
    costAnalysisDescription: 'Realiza análisis completos de costes y puntuación de licitaciones',
    uploadDocuments: 'Subir Documentos',
    analyzeCosts: 'Analizar Costes',
    
    // Calendario de mantenimiento
    maintenanceCalendar: 'Calendario de Mantenimiento',
    maintenanceCalendarDescription: 'Gestiona y programa el mantenimiento de equipos médicos',
    
    // Valoración de prácticas
    practiceEvaluation: 'Valoración de Prácticas',
    practiceEvaluationDescription: 'Gestiona las valoraciones de prácticas realizadas por los tutores de GEE',
    generateEvaluationLink: 'Generar Enlace de Valoración',
    linkCopied: 'Enlace copiado al portapapeles',
    linkCopiedDescription: 'Comparte este enlace para que se complete la valoración de prácticas',
    linkGenerationError: 'Error al generar enlace',
    linkGenerationErrorDescription: 'No se pudo generar el enlace de valoración. Inténtalo de nuevo.',
    noPracticeEvaluations: 'No hay valoraciones de prácticas registradas',
    generateLinkToStart: 'Genera un enlace para comenzar a recibir valoraciones',
    
    // Hojas de cambio
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    changeSheetDetails: 'Detalles de la Hoja de Cambio',
    hojasCambio: 'Hojas de Cambio',
    employeeName: 'Nombre del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    originCenter: 'Centro de Origen',
    newPosition: 'Nuevo Puesto',
    startDate: 'Fecha de Inicio',
    status: 'Estado',
    
    // Acuerdos con empleados
    employeeAgreements: 'Acuerdos con Empleados',
    employeeAgreementDetails: 'Detalles del Acuerdo con Empleado',
    agreementType: 'Tipo de Acuerdo',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    
    // Inmuebles
    realEstate: 'Inmuebles',
    realEstateDetails: 'Detalles del Inmueble',
    
    // Formularios y acciones
    export: 'Exportar',
    import: 'Importar',
    refresh: 'Actualizar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    search: 'Buscar',
    filter: 'Filtrar',
    back: 'Volver',
    createNew: 'Crear Nuevo',
    actions: 'Acciones',
    view: 'Ver',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    exportPDF: 'Exportar PDF',
    
    // Campos de formulario
    student: 'Estudiante',
    tutor: 'Tutor',
    workCenter: 'Centro de Trabajo',
    formation: 'Formación',
    finalEvaluation: 'Evaluación Final',
    date: 'Fecha',
    rating: 'Valoración',
    position: 'Puesto',
    department: 'Departamento',
    salary: 'Salario',
    
    // Estados y mensajes
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    comingSoon: 'Próximamente',
    detailViewPlaceholder: 'Vista de detalle en desarrollo',
    
    // Configuración
    language: 'Idioma',
    theme: 'Tema',
    lightTheme: 'Tema Claro',
    darkTheme: 'Tema Oscuro',
    
    // Funciones
    exportFunction: 'Función de exportación',
    exportFunctionDescription: 'Esta función se implementará próximamente',
    importFunction: 'Función de importación',
    importFunctionDescription: 'Esta función se implementará próximamente',
    
    // Solicitudes de contratación
    contractRequests: 'Solicitudes de Contratación',
    applicantName: 'Nombre del Solicitante',
    applicantLastName: 'Apellidos del Solicitante',
    requestType: 'Tipo de Solicitud',
    requestDate: 'Fecha de Solicitud',
    
    // Entrevistas de salida
    exitInterviews: 'Entrevistas de Salida',
    
    // Permisos y roles
    permissions: 'Permisos',
    role: 'Rol',
    accessLevel: 'Nivel de Acceso',
    
    // Mensajes de error y éxito
    errorLoadingData: 'Error al cargar los datos',
    dataLoadedSuccessfully: 'Datos cargados correctamente',
    operationCompletedSuccessfully: 'Operación completada con éxito',
    
    // Paginación
    previous: 'Anterior',
    next: 'Siguiente',
    page: 'Página',
    of: 'de',
    showing: 'Mostrando',
    to: 'a',
    records: 'registros',
    
    // Calendario
    calendar: 'Calendario',
    event: 'Evento',
    events: 'Eventos',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    
    // Archivos y documentos
    file: 'Archivo',
    files: 'Archivos',
    document: 'Documento',
    documents: 'Documentos',
    upload: 'Subir',
    download: 'Descargar',
    
    // Filtros y búsqueda
    filterBy: 'Filtrar por',
    searchBy: 'Buscar por',
    noResults: 'No se encontraron resultados',
    allResults: 'Todos los resultados',
    
    // Estados de proceso
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    inProgress: 'En Proceso',
    completed: 'Completado',
    
    // Notificaciones
    notification: 'Notificación',
    notifications: 'Notificaciones',
    noNotifications: 'No hay notificaciones',
    
    // Configuración de usuario
    userSettings: 'Configuración de Usuario',
    accountSettings: 'Configuración de Cuenta',
    preferences: 'Preferencias',
    
    // Tiempo
    createdAt: 'Creado el',
    updatedAt: 'Actualizado el',
    lastModified: 'Última modificación',
    
    // Validación
    required: 'Requerido',
    optional: 'Opcional',
    invalid: 'Inválido',
    valid: 'Válido',
    
    // Confirmaciones
    confirmDelete: '¿Confirmar eliminación?',
    confirmSave: '¿Confirmar guardado?',
    confirmCancel: '¿Confirmar cancelación?',
    areYouSure: '¿Estás seguro?',
    
    // Menús contextuales
    contextMenu: 'Menú contextual',
    options: 'Opciones',
    moreOptions: 'Más opciones',
    
    // Datos personales
    personalData: 'Datos Personales',
    contactInfo: 'Información de Contacto',
    address: 'Dirección',
    phone: 'Teléfono',
    email: 'Correo Electrónico',
    
    // Administración
    administration: 'Administración',
    systemSettings: 'Configuración del Sistema',
    userManagement: 'Gestión de Usuarios',
    
    // Estados de conexión
    online: 'En línea',
    offline: 'Desconectado',
    connecting: 'Conectando',
    
    // Tipos de archivo
    pdf: 'PDF',
    excel: 'Excel',
    word: 'Word',
    image: 'Imagen',
    
    // Accesibilidad
    accessibility: 'Accesibilidad',
    altText: 'Texto alternativo',
    screenReader: 'Lector de pantalla',
  },
  en: {
    // Navigation and menus
    dashboard: 'Dashboard',
    operations: 'Operations',
    technicalManagement: 'Technical Management',
    talentManagement: 'Talent Management',
    settings: 'Settings',
    profile: 'Profile',
    admin: 'ADMIN',
    logout: 'Logout',
    
    // Cost analysis
    costAnalysis: 'Cost Analysis',
    costAnalysisDescription: 'Perform comprehensive cost and scoring analysis of tenders',
    uploadDocuments: 'Upload Documents',
    analyzeCosts: 'Analyze Costs',
    
    // Maintenance calendar
    maintenanceCalendar: 'Maintenance Calendar',
    maintenanceCalendarDescription: 'Manage and schedule medical equipment maintenance',
    
    // Practice evaluation
    practiceEvaluation: 'Practice Evaluation',
    practiceEvaluationDescription: 'Manage practice evaluations conducted by GEE tutors',
    generateEvaluationLink: 'Generate Evaluation Link',
    linkCopied: 'Link copied to clipboard',
    linkCopiedDescription: 'Share this link to complete the practice evaluation',
    linkGenerationError: 'Error generating link',
    linkGenerationErrorDescription: 'Could not generate evaluation link. Please try again.',
    noPracticeEvaluations: 'No practice evaluations recorded',
    generateLinkToStart: 'Generate a link to start receiving evaluations',
    
    // Change sheets
    changeSheetsManagement: 'Change Sheets Management',
    changeSheetDetails: 'Change Sheet Details',
    hojasCambio: 'Change Sheets',
    employeeName: 'Employee Name',
    employeeLastName: 'Employee Last Name',
    originCenter: 'Origin Center',
    newPosition: 'New Position',
    startDate: 'Start Date',
    status: 'Status',
    
    // Employee agreements
    employeeAgreements: 'Employee Agreements',
    employeeAgreementDetails: 'Employee Agreement Details',
    agreementType: 'Agreement Type',
    benefits: 'Benefits',
    conditions: 'Conditions',
    observations: 'Observations',
    
    // Real estate
    realEstate: 'Real Estate',
    realEstateDetails: 'Real Estate Details',
    
    // Forms and actions
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    back: 'Back',
    createNew: 'Create New',
    actions: 'Actions',
    view: 'View',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    exportPDF: 'Export PDF',
    
    // Form fields
    student: 'Student',
    tutor: 'Tutor',
    workCenter: 'Work Center',
    formation: 'Training',
    finalEvaluation: 'Final Evaluation',
    date: 'Date',
    rating: 'Rating',
    position: 'Position',
    department: 'Department',
    salary: 'Salary',
    
    // States and messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    comingSoon: 'Coming Soon',
    detailViewPlaceholder: 'Detail view under development',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    
    // Functions
    exportFunction: 'Export function',
    exportFunctionDescription: 'This function will be implemented soon',
    importFunction: 'Import function',
    importFunctionDescription: 'This function will be implemented soon',
    
    // Contract requests
    contractRequests: 'Contract Requests',
    applicantName: 'Applicant Name',
    applicantLastName: 'Applicant Last Name',
    requestType: 'Request Type',
    requestDate: 'Request Date',
    
    // Exit interviews
    exitInterviews: 'Exit Interviews',
    
    // Permissions and roles
    permissions: 'Permissions',
    role: 'Role',
    accessLevel: 'Access Level',
    
    // Error and success messages
    errorLoadingData: 'Error loading data',
    dataLoadedSuccessfully: 'Data loaded successfully',
    operationCompletedSuccessfully: 'Operation completed successfully',
    
    // Pagination
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    showing: 'Showing',
    to: 'to',
    records: 'records',
    
    // Calendar
    calendar: 'Calendar',
    event: 'Event',
    events: 'Events',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    
    // Files and documents
    file: 'File',
    files: 'Files',
    document: 'Document',
    documents: 'Documents',
    upload: 'Upload',
    download: 'Download',
    
    // Filters and search
    filterBy: 'Filter by',
    searchBy: 'Search by',
    noResults: 'No results found',
    allResults: 'All results',
    
    // Process states
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    inProgress: 'In Progress',
    completed: 'Completed',
    
    // Notifications
    notification: 'Notification',
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    
    // User settings
    userSettings: 'User Settings',
    accountSettings: 'Account Settings',
    preferences: 'Preferences',
    
    // Time
    createdAt: 'Created at',
    updatedAt: 'Updated at',
    lastModified: 'Last modified',
    
    // Validation
    required: 'Required',
    optional: 'Optional',
    invalid: 'Invalid',
    valid: 'Valid',
    
    // Confirmations
    confirmDelete: 'Confirm deletion?',
    confirmSave: 'Confirm save?',
    confirmCancel: 'Confirm cancellation?',
    areYouSure: 'Are you sure?',
    
    // Context menus
    contextMenu: 'Context menu',
    options: 'Options',
    moreOptions: 'More options',
    
    // Personal data
    personalData: 'Personal Data',
    contactInfo: 'Contact Information',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    
    // Administration
    administration: 'Administration',
    systemSettings: 'System Settings',
    userManagement: 'User Management',
    
    // Connection states
    online: 'Online',
    offline: 'Offline',
    connecting: 'Connecting',
    
    // File types
    pdf: 'PDF',
    excel: 'Excel',
    word: 'Word',
    image: 'Image',
    
    // Accessibility
    accessibility: 'Accessibility',
    altText: 'Alt text',
    screenReader: 'Screen reader',
  }
};
