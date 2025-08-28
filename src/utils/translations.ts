
export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

interface Translations {
  theme: string;
  light: string;
  dark: string;
  operations: string;
  costAnalysisShort: string;
  costAnalysis: string;
  technicalManagement: string;
  technicalManagementShort: string;
  calendarManagement: string;
  calendarManagementShort: string;
  checkers: string;
  homeMenu: string;
  users: string;
  talentManagement: string;
  talentManagementShort: string;
  contractRequests: string;
  changeSheets: string;
  employeeAgreements: string;
  realEstateManagement: string;
  practiceEvaluation: string;
  exitInterviews: string;
  changeSheetsManagement: string;
  createNew: string;
  export: string;
  import: string;
  hojasCambio: string;
  employeeName: string;
  originCenter: string;
  startDate: string;
  status: string;
  actions: string;
  view: string;
  duplicateRecord: string;
  downloadPDF: string;
  back: string;
  generatedOn: string;
  documentGenerated: string;
  recordNotFound: string;
  employeeInformation: string;
  employeeLastName: string;
  position: string;
  department: string;
  agreementDetails: string;
  agreementType: string;
  endDate: string;
  salary: string;
  benefitsAndConditions: string;
  benefits: string;
  conditions: string;
  observations: string;
  employeeAgreementDetails: string;
  comingSoonTitle: string;
  comingSoonDescription: string;
  comingSoonDescriptionComprobadores: string;
  workCenter: string;
  profile: string;
  welcome: string;
  loginSubtitle: string;
  loginButton: string;
  featureTitleComprobadores: string;
  comingSoon: string;
  confirm: string;
  calendar: string;
  analysis: string;
  hospitalInventory: string;
  maintenanceSchedule: string;
  processFiles: string;
  uploadFiles: string;
  missingMaintenanceMessage: string;
  completeFirst: string;
  activeProperties: string;
  inactiveProperties: string;
  realEstateDashboard: string;
  viewTables: string;
  totalProperties: string;
  annualCost: string;
  exportPDF: string;
  realEstateDetails: string;
  detailViewPlaceholder: string;
  userProfile: string;
  personalInformation: string;
  changePhoto: string;
  email: string;
  permissions: string;
  permissionsDescription: string;
  departmentPermissions: string;
  actionPermissions: string;
  create: string;
  modify: string;
  delete: string;
  saveChanges: string;
  cancel: string;
  close: string;
  suggestionsReviewTitle: string;
  verifyingAccount: string;
  loading: string;
  name: string;
  settings: string;
  maintenanceCalendar: string;
  generateCalendar: string;
  inventory: string;
  missingMaintenanceTitle: string;
  generateAnyway: string;
  language: string;
  spanish: string;
  english: string;
  logout: string;
  upload: string;
  mensajeCsvInventario: string;
  mensajeCsvMantenimmiento: string;
  formatosCsv: string;
  arrastraArchivo: string;
  usersGestion: string;
  userGestSub: string;
  recargar: string;
  buscadorUsers: string;
  listaUsers: string;
  tituloAnalisis: string;
  subtiAnalisis: string;
  subirPdf: string;
  informepdf: string;
  costespdf: string;
  puntuacionPdf: string;
  asistChat: string;
  bienvenidaChat: string;
}

export const translations: { [key in Language]: Translations } = {
  es: {
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    operations: 'Operaciones',
    costAnalysisShort: 'Análisis de Costos',
    costAnalysis: 'Análisis de Costos',
    technicalManagement: 'Gestión Técnica',
    technicalManagementShort: 'Gestión Técnica',
    calendarManagement: 'Gestión de Calendarios',
    calendarManagementShort: 'Calendarios',
    checkers: 'Comprobadores',
    homeMenu: 'Inicio',
    users: 'Usuarios',
    talentManagement: 'Gestión del Talento',
    talentManagementShort: 'Talento',
    contractRequests: 'Solicitudes de Contratos',
    changeSheets: 'Hojas de Cambio',
    employeeAgreements: 'Convenios de Empleados',
    realEstateManagement: 'Gestión de Inmuebles',
    practiceEvaluation: 'Evaluación de Prácticas',
    exitInterviews: 'Entrevistas de Salida',
    changeSheetsManagement: 'Gestión de Hojas de Cambio',
    createNew: 'Crear Nuevo',
    export: 'Exportar',
    import: 'Importar',
    hojasCambio: 'Hojas de Cambio',
    employeeName: 'Nombre del Empleado',
    originCenter: 'Centro de Origen',
    startDate: 'Fecha de Inicio',
    status: 'Estado',
    actions: 'Acciones',
    view: 'Ver',
    duplicateRecord: 'Duplicar Registro',
    downloadPDF: 'Descargar PDF',
    back: 'Volver',
    generatedOn: 'Generado el',
    documentGenerated: 'Documento Generado',
    recordNotFound: 'Registro no encontrado',
    employeeInformation: 'Información del Empleado',
    employeeLastName: 'Apellidos',
    position: 'Cargo',
    department: 'Departamento',
    agreementDetails: 'Detalles del Convenio',
    agreementType: 'Tipo de Convenio',
    endDate: 'Fecha de Fin',
    salary: 'Salario',
    benefitsAndConditions: 'Beneficios y Condiciones',
    benefits: 'Beneficios',
    conditions: 'Condiciones',
    observations: 'Observaciones',
    employeeAgreementDetails: 'Detalles del Convenio de Empleado',
    comingSoonTitle: 'Próximamente',
    comingSoonDescription: 'Esta funcionalidad estará disponible pronto.',
    comingSoonDescriptionComprobadores: 'Los comprobadores estarán disponibles próximamente.',
    workCenter: 'Centro de Trabajo',
    profile: 'Perfil',
    welcome: 'Bienvenido a GEESTOR',
    loginSubtitle: 'Disfruta de todos los procesos al alcance de tu mano.',
    loginButton: 'Iniciar Sesión',
    featureTitleComprobadores: 'Comprobadores',
    comingSoon: 'Próximamente',
    confirm: 'Confirmar',
    calendar: 'Calendario',
    analysis: 'Análisis',
    hospitalInventory: 'Inventario Hospitalario',
    maintenanceSchedule: 'Programa de Mantenimiento',
    processFiles: 'Procesar Archivos',
    uploadFiles: 'Subir Archivos',
    missingMaintenanceMessage: 'Hay denominaciones sin mantenimientos asignados',
    completeFirst: 'Completa primero',
    activeProperties: 'Propiedades Activas',
    inactiveProperties: 'Propiedades Inactivas',
    realEstateDashboard: 'Dashboard de Inmuebles',
    viewTables: 'Ver Tablas',
    totalProperties: 'Total de Propiedades',
    annualCost: 'Costo Anual',
    exportPDF: 'Exportar PDF',
    realEstateDetails: 'Detalles del Inmueble',
    detailViewPlaceholder: 'Vista de detalles del inmueble',
    userProfile: 'Perfil de Usuario',
    personalInformation: 'Información Personal',
    changePhoto: 'Cambiar Foto',
    email: 'Correo Electrónico',
    permissions: 'Permisos',
    permissionsDescription: 'Permisos del usuario en el sistema',
    departmentPermissions: 'Permisos por Departamento',
    actionPermissions: 'Permisos de Acción',
    create: 'Crear',
    modify: 'Modificar',
    delete: 'Eliminar',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    close: 'Cerrar',
    suggestionsReviewTitle: 'Revisar Sugerencias de IA',
    verifyingAccount: 'Verificando cuenta...',
    loading: 'Cargando...',
    name: 'Nombre',
    settings: 'Configuración',
    maintenanceCalendar: 'Calendario de Mantenimiento',
    generateCalendar: 'Generar Calendario',
    inventory: 'Inventario',
    missingMaintenanceTitle: 'Mantenimientos Faltantes',
    generateAnyway: 'Generar de todas formas',
    language: 'Idioma',
    spanish: 'Español',
    english: 'Inglés',
    logout: 'Cerrar Sesión',
    upload: 'Subir',
    arrastraArchivo: 'Arrastra tu archivo aquí',
    mensajeCsvInventario: 'Sube un archivo Excel o CSV con el inventario de equipos médicos',
    mensajeCsvMantenimmiento: 'Sube un archivo Excel o CSV con la programación de mantenimiento',
    formatosCsv: 'Formatos soportados: Excel(.xlsx, .xls) y CSV (.csv)',
    usersGestion: 'Gestión de Usuarios',
    userGestSub: 'Administra los usuarios y sus permisos en el sistema',
    recargar: 'Actualizar',
    buscadorUsers: 'Buscar usuarios por nombre o correo...',
    listaUsers: 'Lista de Usuarios',
    tituloAnalisis: 'Análisis de Costes Profesional',
    subtiAnalisis: 'Análisis exhaustivo de licitaciones de electromedicina con IA especializada',
    subirPdf: 'Subir Archivos',
    informepdf: 'Informe',
    costespdf: 'Costes',
    puntuacionPdf: 'Puntuación',
    asistChat: 'Asistente de Análisis',
    bienvenidaChat: '¡Hola! Soy Geenio, tu asistente para análisis de licitaciones. ¿En qué puedo ayudarte?'
  },
  en: {
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    operations: 'Operations',
    costAnalysisShort: 'Cost Analysis',
    costAnalysis: 'Cost Analysis',
    technicalManagement: 'Technical Management',
    technicalManagementShort: 'Technical Mgmt',
    calendarManagement: 'Calendar Management',
    calendarManagementShort: 'Calendars',
    checkers: 'Checkers',
    homeMenu: 'Home',
    users: 'Users',
    talentManagement: 'Talent Management',
    talentManagementShort: 'Talent',
    contractRequests: 'Contract Requests',
    changeSheets: 'Change Sheets',
    employeeAgreements: 'Employee Agreements',
    realEstateManagement: 'Real Estate Management',
    practiceEvaluation: 'Practice Evaluation',
    exitInterviews: 'Exit Interviews',
    changeSheetsManagement: 'Change Sheets Management',
    createNew: 'Create New',
    export: 'Export',
    import: 'Import',
    hojasCambio: 'Change Sheets',
    employeeName: 'Employee Name',
    originCenter: 'Origin Center',
    startDate: 'Start Date',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    duplicateRecord: 'Duplicate Record',
    downloadPDF: 'Download PDF',
    back: 'Back',
    generatedOn: 'Generated on',
    documentGenerated: 'Document Generated',
    recordNotFound: 'Record not found',
    employeeInformation: 'Employee Information',
    employeeLastName: 'Last Name',
    position: 'Position',
    department: 'Department',
    agreementDetails: 'Agreement Details',
    agreementType: 'Agreement Type',
    endDate: 'End Date',
    salary: 'Salary',
    benefitsAndConditions: 'Benefits and Conditions',
    benefits: 'Benefits',
    conditions: 'Conditions',
    observations: 'Observations',
    employeeAgreementDetails: 'Employee Agreement Details',
    comingSoonTitle: 'Coming Soon',
    comingSoonDescription: 'This feature will be available soon.',
    comingSoonDescriptionComprobadores: 'Checkers will be available soon.',
    workCenter: 'Work Center',
    profile: 'Profile',
    welcome: 'Welcome to GEESTOR',
    loginSubtitle: 'Enjoy all the processes at your fingertips..',
    loginButton: 'Sign In',
    featureTitleComprobadores: 'Checkers',
    comingSoon: 'Coming Soon',
    confirm: 'Confirm',
    calendar: 'Calendar',
    analysis: 'Analysis',
    hospitalInventory: 'Hospital Inventory',
    maintenanceSchedule: 'Maintenance Schedule',
    processFiles: 'Process Files',
    uploadFiles: 'Upload Files',
    missingMaintenanceMessage: 'There are denominations without assigned maintenances',
    completeFirst: 'Complete first',
    activeProperties: 'Active Properties',
    inactiveProperties: 'Inactive Properties',
    realEstateDashboard: 'Real Estate Dashboard',
    viewTables: 'View Tables',
    totalProperties: 'Total Properties',
    annualCost: 'Annual Cost',
    exportPDF: 'Export PDF',
    realEstateDetails: 'Real Estate Details',
    detailViewPlaceholder: 'Real estate detail view',
    userProfile: 'User Profile',
    personalInformation: 'Personal Information',
    changePhoto: 'Change Photo',
    email: 'Email',
    permissions: 'Permissions',
    permissionsDescription: 'User permissions in the system',
    departmentPermissions: 'Department Permissions',
    actionPermissions: 'Action Permissions',
    create: 'Create',
    modify: 'Modify',
    delete: 'Delete',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    suggestionsReviewTitle: 'Review AI Suggestions',
    verifyingAccount: 'Verifying account...',
    loading: 'Loading...',
    name: 'Name',
    settings: 'Settings',
    maintenanceCalendar: 'Maintenance Calendar',
    generateCalendar: 'Generate Calendar',
    inventory: 'Inventory',
    missingMaintenanceTitle: 'Missing Maintenances',
    generateAnyway: 'Generate Anyway',
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    logout: 'Logout',
    upload: 'Upload',
    arrastraArchivo: 'Drag your file here',
    mensajeCsvInventario: 'Upload an Excel or CSV file with your medical equipment inventory',
    mensajeCsvMantenimmiento: 'Upload an Excel or CSV file with the maintenance schedule',
    formatosCsv: 'Supported formats: Excel (.xlsx, .xls) and CSV (.csv)',
    usersGestion: 'User Management',
    userGestSub: 'Manage users and their permissions in the system',
    recargar: 'Update',
    buscadorUsers: 'Search for users by name or email...',
    listaUsers: 'User List',
    tituloAnalisis: 'Professional Cost Analysis',
    subtiAnalisis: 'Comprehensive analysis of electromedicine tenders with specialized AI',
    subirPdf: 'Upload Files',
    informepdf: 'Report',
    costespdf: 'Costs',
    puntuacionPdf: 'Score',
    asistChat: 'Analysis Assistant',
    bienvenidaChat: 'Hello! I'm Geenio, your tender analysis assistant. How can I help you?'
  }
};
