
export type Language = "es" | "en";
export type Theme = "light" | "dark";

export const languages = [
  {
    key: "es",
    label: "Español",
  },
  {
    key: "en",
    label: "English",
  },
];

type TranslationKeys =
  | "error"
  | "language"
  | "loading"
  | "success"
  | "selectLanguage"
  | "selectTheme"
  | "emailPlaceholder"
  | "passwordPlaceholder"
  | "detailViewPlaceholder"
  | "comingSoon"
  | "submit"
  | "login"
  | "logout"
  | "register"
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "termsAndConditions"
  | "iAgree"
  | "alreadyHaveAnAccount"
  | "forgotPassword"
  | "resetPassword"
  | "rememberMe"
  | "orContinueWith"
  | "google"
  | "facebook"
  | "github"
  | "profile"
  | "settings"
  | "dashboard"
  | "users"
  | "roles"
  | "permissions"
  | "editProfile"
  | "changePassword"
  | "saveChanges"
  | "currentPassword"
  | "newPassword"
  | "confirmNewPassword"
  | "cancel"
  | "deleteAccount"
  | "deleteAccountConfirmation"
  | "close"
  | "search"
  | "noResultsFound"
  | "name"
  | "description"
  | "createdAt"
  | "updatedAt"
  | "actions"
  | "edit"
  | "delete"
  | "view"
  | "create"
  | "import"
  | "export"
  | "id"
  | "general"
  | "security"
  | "appearance"
  | "system"
  | "light"
  | "dark"
  | "auto"
  | "confirmPassword"
  | "goBack"
  | "home"
  | "unauthorized"
  | "pageNotFound"
  | "somethingWentWrong"
  | "maintenance"
  | "builtBy"
  | "version"
  | "documentation"
  | "examplePage"
  | "welcome"
  | "exampleCard"
  | "exampleTitle"
  | "exampleDescription"
  | "exampleButton"
  | "realEstateDashboard"
  | "activeProperties"
  | "inactiveProperties"
  | "totalProperties"
  | "totalRooms"
  | "back"
  | "exportPDF"
  | "changeSheetDetails"
  | "changeSheetsManagement"
  | "createNew"
  | "hojasCambio"
  | "employeeName"
  | "originCenter"
  | "startDate"
  | "status"
  | "duplicateRecord"
  | "downloadPDF"
  | "employeeAgreementDetails"
  | "loginSubtitle"
  | "loginButton"
  | "welcomeMessage"
  | "welcomeSubtitle"
  | "selectSection"
  | "mainContent"
  | "noContentSelected"
  | "realEstateDetails"
  | "spanish"
  | "english"
  | "theme"
  | "userProfile"
  | "personalInformation"
  | "changePhoto"
  | "departmentPermissions"
  | "departmentPermissionsDesc"
  | "operaciones"
  | "gestionTecnica"
  | "gestionTalento"
  | "actionPermissions"
  | "actionPermissionsDesc"
  | "verifyingAccount";

type Translations = {
  [key in Language]: {
    [key in TranslationKeys]: string;
  };
};

export const translations: Translations = {
  es: {
    error: "Error",
    language: "Idioma",
    loading: "Cargando...",
    success: "Éxito",
    selectLanguage: "Seleccionar idioma",
    selectTheme: "Seleccionar tema",
    emailPlaceholder: "correo@ejemplo.com",
    passwordPlaceholder: "Contraseña",
    detailViewPlaceholder: "Vista detallada",
    comingSoon: "Próximamente",
    submit: "Enviar",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    register: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    firstName: "Nombre",
    lastName: "Apellido",
    termsAndConditions: "Términos y condiciones",
    iAgree: "Estoy de acuerdo",
    alreadyHaveAnAccount: "¿Ya tienes una cuenta?",
    forgotPassword: "¿Olvidaste tu contraseña?",
    resetPassword: "Restablecer contraseña",
    rememberMe: "Recuérdame",
    orContinueWith: "O continúa con",
    google: "Google",
    facebook: "Facebook",
    github: "GitHub",
    profile: "Perfil",
    settings: "Configuración",
    dashboard: "Panel de control",
    users: "Usuarios",
    roles: "Roles",
    permissions: "Permisos",
    editProfile: "Editar perfil",
    changePassword: "Cambiar contraseña",
    saveChanges: "Guardar cambios",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    confirmNewPassword: "Confirmar nueva contraseña",
    cancel: "Cancelar",
    deleteAccount: "Eliminar cuenta",
    deleteAccountConfirmation: "¿Estás seguro de que quieres eliminar tu cuenta?",
    close: "Cerrar",
    search: "Buscar",
    noResultsFound: "No se encontraron resultados",
    name: "Nombre",
    description: "Descripción",
    createdAt: "Creado el",
    updatedAt: "Actualizado el",
    actions: "Acciones",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    create: "Crear",
    import: "Importar",
    export: "Exportar",
    id: "ID",
    general: "General",
    security: "Seguridad",
    appearance: "Apariencia",
    system: "Sistema",
    light: "Claro",
    dark: "Oscuro",
    auto: "Automático",
    confirmPassword: "Confirmar contraseña",
    goBack: "Volver",
    home: "Inicio",
    unauthorized: "No autorizado",
    pageNotFound: "Página no encontrada",
    somethingWentWrong: "Algo salió mal",
    maintenance: "Mantenimiento",
    builtBy: "Construido por",
    version: "Versión",
    documentation: "Documentación",
    examplePage: "Página de ejemplo",
    welcome: "Bienvenido",
    exampleCard: "Tarjeta de ejemplo",
    exampleTitle: "Título de ejemplo",
    exampleDescription: "Descripción de ejemplo",
    exampleButton: "Botón de ejemplo",
    realEstateDashboard: "Dashboard Inmobiliario",
    activeProperties: "Propiedades Activas",
    inactiveProperties: "Propiedades Inactivas",
    totalProperties: "Total Propiedades",
    totalRooms: "Total Habitaciones",
    back: "Volver",
    exportPDF: "Exportar PDF",
    changeSheetDetails: "Detalles de Hoja de Cambio",
    changeSheetsManagement: "Gestión de Hojas de Cambio",
    createNew: "Crear Nuevo",
    hojasCambio: "Hojas de Cambio",
    employeeName: "Nombre del Empleado",
    originCenter: "Centro de Origen",
    startDate: "Fecha de Inicio",
    status: "Estado",
    duplicateRecord: "Duplicar Registro",
    downloadPDF: "Descargar PDF",
    employeeAgreementDetails: "Detalles del Acuerdo de Empleado",
    loginSubtitle: "Accede a tu cuenta para continuar",
    loginButton: "Iniciar Sesión",
    welcomeMessage: "Bienvenido a GEEstor",
    welcomeSubtitle: "Sistema de gestión empresarial integral",
    selectSection: "Selecciona una sección del menú lateral para comenzar",
    mainContent: "Contenido Principal",
    noContentSelected: "No se ha seleccionado contenido",
    realEstateDetails: "Detalles del Inmueble",
    spanish: "Español",
    english: "Inglés",
    theme: "Tema",
    userProfile: "Perfil de Usuario",
    personalInformation: "Información Personal",
    changePhoto: "Cambiar Foto",
    departmentPermissions: "Permisos de Departamento",
    departmentPermissionsDesc: "Controla el acceso a cada departamento",
    operaciones: "Operaciones",
    gestionTecnica: "Gestión Técnica",
    gestionTalento: "Gestión de Talento",
    actionPermissions: "Permisos de Acciones",
    actionPermissionsDesc: "Controla las acciones que puede realizar",
    verifyingAccount: "Verificando cuenta"
  },
  en: {
    error: "Error",
    language: "Language",
    loading: "Loading...",
    success: "Success",
    selectLanguage: "Select language",
    selectTheme: "Select theme",
    emailPlaceholder: "email@example.com",
    passwordPlaceholder: "Password",
    detailViewPlaceholder: "Detail view",
    comingSoon: "Coming soon",
    submit: "Submit",
    login: "Login",
    logout: "Logout",
    register: "Register",
    email: "Email",
    password: "Password",
    firstName: "First Name",
    lastName: "Last Name",
    termsAndConditions: "Terms and conditions",
    iAgree: "I agree",
    alreadyHaveAnAccount: "Already have an account?",
    forgotPassword: "Forgot your password?",
    resetPassword: "Reset password",
    rememberMe: "Remember me",
    orContinueWith: "Or continue with",
    google: "Google",
    facebook: "Facebook",
    github: "GitHub",
    profile: "Profile",
    settings: "Settings",
    dashboard: "Dashboard",
    users: "Users",
    roles: "Roles",
    permissions: "Permissions",
    editProfile: "Edit profile",
    changePassword: "Change password",
    saveChanges: "Save changes",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    cancel: "Cancel",
    deleteAccount: "Delete account",
    deleteAccountConfirmation: "Are you sure you want to delete your account?",
    close: "Close",
    search: "Search",
    noResultsFound: "No results found",
    name: "Name",
    description: "Description",
    createdAt: "Created at",
    updatedAt: "Updated at",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    create: "Create",
    import: "Import",
    export: "Export",
    id: "ID",
    general: "General",
    security: "Security",
    appearance: "Appearance",
    system: "System",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    confirmPassword: "Confirm password",
    goBack: "Go back",
    home: "Home",
    unauthorized: "Unauthorized",
    pageNotFound: "Page not found",
    somethingWentWrong: "Something went wrong",
    maintenance: "Maintenance",
    builtBy: "Built by",
    version: "Version",
    documentation: "Documentation",
    examplePage: "Example page",
    welcome: "Welcome",
    exampleCard: "Example card",
    exampleTitle: "Example title",
    exampleDescription: "Example description",
    exampleButton: "Example button",
    realEstateDashboard: "Real Estate Dashboard",
    activeProperties: "Active Properties",
    inactiveProperties: "Inactive Properties",
    totalProperties: "Total Properties",
    totalRooms: "Total Rooms",
    back: "Back",
    exportPDF: "Export PDF",
    changeSheetDetails: "Change Sheet Details",
    changeSheetsManagement: "Change Sheets Management",
    createNew: "Create New",
    hojasCambio: "Change Sheets",
    employeeName: "Employee Name",
    originCenter: "Origin Center",
    startDate: "Start Date",
    status: "Status",
    duplicateRecord: "Duplicate Record",
    downloadPDF: "Download PDF",
    employeeAgreementDetails: "Employee Agreement Details",
    loginSubtitle: "Access your account to continue",
    loginButton: "Login",
    welcomeMessage: "Welcome to GEEstor",
    welcomeSubtitle: "Comprehensive business management system",
    selectSection: "Select a section from the side menu to get started",
    mainContent: "Main Content",
    noContentSelected: "No content selected",
    realEstateDetails: "Real Estate Details",
    spanish: "Spanish",
    english: "English",
    theme: "Theme",
    userProfile: "User Profile",
    personalInformation: "Personal Information",
    changePhoto: "Change Photo",
    departmentPermissions: "Department Permissions",
    departmentPermissionsDesc: "Control access to each department",
    operaciones: "Operations",
    gestionTecnica: "Technical Management",
    gestionTalento: "Talent Management",
    actionPermissions: "Action Permissions",
    actionPermissionsDesc: "Control the actions that can be performed",
    verifyingAccount: "Verifying account"
  },
};
