
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export const translations = {
  es: {
    // Configuración general
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    spanish: 'Español',
    english: 'Inglés',
    light: 'Claro',
    dark: 'Oscuro',
    
    // Navegación y menú
    technicalManagement: 'Gestión Técnica',
    talentManagement: 'Gestión de Talento',
    maintenanceCalendar: 'Calendario de Mantenimiento',
    contractRequests: 'Solicitudes de Contrato',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Acuerdos con Empleados',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Valoración Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    users: 'Usuarios',
    bidAnalyzer: 'Analizador de Licitaciones',
    costAnalysis: 'Análisis de Costos',
    
    // Botones generales
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    create: 'Crear',
    createNew: 'Crear Nuevo',
    update: 'Actualizar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    download: 'Descargar',
    upload: 'Subir',
    view: 'Ver',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    confirm: 'Confirmar',
    close: 'Cerrar',
    actions: 'Acciones',
    
    // Calendario de Mantenimiento
    hospitalInventory: 'Inventario Hospitalario',
    maintenanceSchedule: 'Calendario de Mantenimiento',
    uploadFiles: 'Subir Archivos',
    processFiles: 'Procesar Archivos',
    generateCalendar: 'Generar Calendario',
    analysis: 'Análisis',
    inventory: 'Inventario',
    calendar: 'Calendario',
    equipmentTypes: 'Tipos de Equipos',
    maintenanceType: 'Tipo de Mantenimiento',
    frequency: 'Frecuencia',
    estimatedTime: 'Tiempo Estimado',
    equipmentCount: 'Cantidad de Equipos',
    missingMaintenanceTitle: 'Denominaciones Pendientes',
    missingMaintenanceMessage: 'Faltan denominaciones por establecer mantenimiento. ¿Estás seguro de que quieres continuar?',
    generateAnyway: 'Generar de Todas Formas',
    completeFirst: 'Completar Primero',
    addMaintenance: 'Agregar Mantenimiento',
    
    // Solicitudes de Contrato
    contractRequestsTitle: 'Solicitudes de Contrato',
    newContractRequest: 'Nueva Solicitud',
    requestNumber: 'Número de Solicitud',
    requestDate: 'Fecha de Solicitud',
    department: 'Departamento',
    priority: 'Prioridad',
    status: 'Estado',
    description: 'Descripción',
    requestor: 'Solicitante',
    
    // Hojas de Cambio
    changeSheetsTitle: 'Hojas de Cambio',
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    hojasCambio: 'Hojas de Cambio',
    newChangeSheet: 'Nueva Hoja de Cambio',
    changeNumber: 'Número de Cambio',
    changeDate: 'Fecha de Cambio',
    changeType: 'Tipo de Cambio',
    affected: 'Afectados',
    originCenter: 'Centro de Origen',
    destinationCenter: 'Centro de Destino',
    
    // Acuerdos con Empleados
    employeeAgreementsTitle: 'Acuerdos con Empleados',
    newEmployeeAgreement: 'Nuevo Acuerdo',
    employeeName: 'Nombre del Empleado',
    employeeLastName: 'Apellidos del Empleado',
    agreementType: 'Tipo de Acuerdo',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    employeeInformation: 'Información del Empleado',
    agreementDetails: 'Detalles del Acuerdo',
    benefitsAndConditions: 'Beneficios y Condiciones',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    position: 'Puesto',
    salary: 'Salario',
    
    // Gestión de Inmuebles
    realEstateTitle: 'Gestión de Inmuebles',
    dashboard: 'Dashboard',
    viewTables: 'Ver Tablas',
    propertyCode: 'Código de Propiedad',
    address: 'Dirección',
    province: 'Provincia',
    region: 'CCAA',
    occupancyStatus: 'Estado de Ocupación',
    workerName: 'Nombre del Trabajador',
    annualCost: 'Coste Anual',
    workCenter: 'Centro de Trabajo',
    
    // Valoración de Prácticas
    practiceEvaluationTitle: 'Valoración de Prácticas',
    studentName: 'Nombre del Estudiante',
    evaluationDate: 'Fecha de Evaluación',
    score: 'Puntuación',
    supervisor: 'Supervisor',
    
    // Entrevistas de Salida
    exitInterviewsTitle: 'Entrevistas de Salida',
    interviewDate: 'Fecha de Entrevista',
    exitReason: 'Motivo de Salida',
    overallRating: 'Valoración General',
    
    // Gestión de Usuarios
    usersManagement: 'Gestión de Usuarios',
    searchUsers: 'Buscar usuarios...',
    userName: 'Nombre de Usuario',
    userEmail: 'Correo Electrónico',
    userRole: 'Rol',
    createdDate: 'Fecha de Creación',
    name: 'Nombre',
    
    // Estados y valores comunes
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    completed: 'Completado',
    inProgress: 'En Progreso',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    
    // Mensajes
    loading: 'Cargando...',
    noData: 'No hay datos disponibles',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    recordNotFound: 'Registro no encontrado',
    
    // Formularios
    required: 'Campo requerido',
    invalidEmail: 'Correo electrónico inválido',
    passwordTooShort: 'La contraseña es muy corta',
    
    // Analizador de Licitaciones
    technicalScore: 'Puntuación Técnica',
    economicScore: 'Puntuación Económica',
    totalScore: 'Puntuación Total',
    
    // Análisis de Costos
    costAnalysisTitle: 'Análisis de Costos',
    costBreakdown: 'Desglose de Costos',
    scoreAnalysis: 'Análisis de Puntuación',
    
    // Funciones adicionales
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    generatedOn: 'Generado el',
    documentGenerated: 'Documento generado por',
    
    // Detalles específicos
    employeeAgreementDetails: 'Detalles del Acuerdo de Empleado',
    contractRequestDetails: 'Detalles de la Solicitud de Contrato',
    exitInterviewDetails: 'Detalles de la Entrevista de Salida'
  },
  en: {
    // General configuration  
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    spanish: 'Spanish',
    english: 'English',
    light: 'Light',
    dark: 'Dark',
    
    // Navigation and menu
    technicalManagement: 'Technical Management',
    talentManagement: 'Talent Management',
    maintenanceCalendar: 'Maintenance Calendar',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    users: 'Users',
    bidAnalyzer: 'Bid Analyzer',
    costAnalysis: 'Cost Analysis',
    
    // General buttons
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    create: 'Create',
    createNew: 'Create New',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    close: 'Close',
    actions: 'Actions',
    
    // Maintenance Calendar
    hospitalInventory: 'Hospital Inventory',
    maintenanceSchedule: 'Maintenance Schedule',
    uploadFiles: 'Upload Files',
    processFiles: 'Process Files',
    generateCalendar: 'Generate Calendar',
    analysis: 'Analysis',
    inventory: 'Inventory',
    calendar: 'Calendar',
    equipmentTypes: 'Equipment Types',
    maintenanceType: 'Maintenance Type',
    frequency: 'Frequency',
    estimatedTime: 'Estimated Time',
    equipmentCount: 'Equipment Count',
    missingMaintenanceTitle: 'Pending Denominations',
    missingMaintenanceMessage: 'There are denominations missing maintenance setup. Are you sure you want to continue?',
    generateAnyway: 'Generate Anyway',
    completeFirst: 'Complete First',
    addMaintenance: 'Add Maintenance',
    
    // Contract Requests
    contractRequestsTitle: 'Contract Requests',
    newContractRequest: 'New Request',
    requestNumber: 'Request Number',
    requestDate: 'Request Date',
    department: 'Department',
    priority: 'Priority',
    status: 'Status',
    description: 'Description',
    requestor: 'Requestor',
    
    // Change Sheets
    changeSheetsTitle: 'Change Sheets',
    changeSheetsManagement: 'Change Sheets Management',
    hojasCambio: 'Change Sheets',
    newChangeSheet: 'New Change Sheet',
    changeNumber: 'Change Number',
    changeDate: 'Change Date',
    changeType: 'Change Type',
    affected: 'Affected',
    originCenter: 'Origin Center',
    destinationCenter: 'Destination Center',
    
    // Employee Agreements
    employeeAgreementsTitle: 'Employee Agreements',
    newEmployeeAgreement: 'New Agreement',
    employeeName: 'Employee Name',
    employeeLastName: 'Employee Last Name',
    agreementType: 'Agreement Type',
    startDate: 'Start Date',
    endDate: 'End Date',
    employeeInformation: 'Employee Information',
    agreementDetails: 'Agreement Details',
    benefitsAndConditions: 'Benefits and Conditions',
    benefits: 'Benefits',
    conditions: 'Conditions',
    observations: 'Observations',
    position: 'Position',
    salary: 'Salary',
    
    // Real Estate Management
    realEstateTitle: 'Real Estate Management',
    dashboard: 'Dashboard',
    viewTables: 'View Tables',
    propertyCode: 'Property Code',
    address: 'Address',
    province: 'Province',
    region: 'Region',
    occupancyStatus: 'Occupancy Status',
    workerName: 'Worker Name',
    annualCost: 'Annual Cost',
    workCenter: 'Work Center',
    
    // Practice Evaluation
    practiceEvaluationTitle: 'Practice Evaluation',
    studentName: 'Student Name',
    evaluationDate: 'Evaluation Date',
    score: 'Score',
    supervisor: 'Supervisor',
    
    // Exit Interviews
    exitInterviewsTitle: 'Exit Interviews',
    interviewDate: 'Interview Date',
    exitReason: 'Exit Reason',
    overallRating: 'Overall Rating',
    
    // User Management
    usersManagement: 'User Management',
    searchUsers: 'Search users...',
    userName: 'User Name',
    userEmail: 'Email Address',
    userRole: 'Role',
    createdDate: 'Creation Date',
    name: 'Name',
    
    // Common states and values
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    inProgress: 'In Progress',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Messages
    loading: 'Loading...',
    noData: 'No data available',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    recordNotFound: 'Record not found',
    
    // Forms
    required: 'Required field',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password too short',
    
    // Bid Analyzer
    technicalScore: 'Technical Score',
    economicScore: 'Economic Score',
    totalScore: 'Total Score',
    
    // Cost Analysis
    costAnalysisTitle: 'Cost Analysis',
    costBreakdown: 'Cost Breakdown',
    scoreAnalysis: 'Score Analysis',
    
    // Additional functions
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    generatedOn: 'Generated on',
    documentGenerated: 'Document generated by',
    
    // Specific details
    employeeAgreementDetails: 'Employee Agreement Details',
    contractRequestDetails: 'Contract Request Details',
    exitInterviewDetails: 'Exit Interview Details'
  }
};
