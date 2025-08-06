export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

export const translations: Translations = {
  appName: {
    es: 'GEESTOR',
    en: 'GEESTOR'
  },
  login: {
    es: 'Iniciar Sesión',
    en: 'Sign In'
  },
  loginWithMicrosoft: {
    es: 'Continuar con Microsoft',
    en: 'Continue with Microsoft'
  },
  loginSubtitle: {
    es: 'Gestión Empresarial Electromedico',
    en: 'Electromedical Business Management'
  },
  welcomeMessage: {
    es: 'Bienvenido a GEESTOR',
    en: 'Welcome to GEESTOR'
  },
  welcomeSubtitle: {
    es: 'Tu plataforma de gestión empresarial integral',
    en: 'Your comprehensive business management platform'
  },
  selectSection: {
    es: 'Selecciona una sección del menú lateral para comenzar',
    en: 'Select a section from the sidebar menu to get started'
  },
  mainContent: {
    es: 'Contenido Principal',
    en: 'Main Content'
  },
  noContentSelected: {
    es: 'No hay contenido seleccionado',
    en: 'No content selected'
  },
  inicio: {
    es: 'Inicio',
    en: 'Home'
  },
  departamentos: {
    es: 'Departamentos',
    en: 'Departments'
  },
  operaciones: {
    es: 'Operaciones',
    en: 'Operations'
  },
  gestionTecnica: {
    es: 'Gestión Técnica',
    en: 'Technical Management'
  },
  gestionTalento: {
    es: 'Gestión del Talento',
    en: 'Talent Management'
  },
  analisisCoste: {
    es: 'Análisis de Coste',
    en: 'Cost Analysis'
  },
  calendarioMantenimiento: {
    es: 'Calendario de Mantenimiento',
    en: 'Maintenance Calendar'
  },
  comprobadores: {
    es: 'Comprobadores',
    en: 'Testers'
  },
  gestionInmuebles: {
    es: 'Gestión de Inmuebles',
    en: 'Property Management'
  },
  solicitudesContratacion: {
    es: 'Solicitudes de Contratación',
    en: 'Hiring Requests'
  },
  hojasCambio: {
    es: 'Hojas de Cambio',
    en: 'Change Sheets'
  },
  acuerdoEmpleado: {
    es: 'Acuerdo con Empleado',
    en: 'Employee Agreement'
  },
  practicas: {
    es: 'Prácticas',
    en: 'Internships'
  },
  practicasListado: {
    es: 'Listado',
    en: 'Listing'
  },
  practicasValoracion: {
    es: 'Valoración',
    en: 'Assessment'
  },
  entrevistaSalida: {
    es: 'Entrevista de Salida',
    en: 'Exit Interview'
  },
  language: {
    es: 'Idioma',
    en: 'Language'
  },
  theme: {
    es: 'Tema',
    en: 'Theme'
  },
  logout: {
    es: 'Cerrar Sesión',
    en: 'Sign Out'
  },
  settings: {
    es: 'Configuración',
    en: 'Settings'
  },
  // Nuevas traducciones para el perfil
  userProfile: {
    es: 'Perfil de Usuario',
    en: 'User Profile'
  },
  personalInformation: {
    es: 'Información Personal',
    en: 'Personal Information'
  },
  changePhoto: {
    es: 'Cambiar Foto',
    en: 'Change Photo'
  },
  name: {
    es: 'Nombre',
    en: 'Name'
  },
  email: {
    es: 'Correo Electrónico',
    en: 'Email'
  },
  departmentPermissions: {
    es: 'Permisos de Departamentos',
    en: 'Department Permissions'
  },
  departmentPermissionsDesc: {
    es: 'Selecciona a qué departamentos tienes acceso',
    en: 'Select which departments you have access to'
  },
  actionPermissions: {
    es: 'Permisos de Acciones',
    en: 'Action Permissions'
  },
  actionPermissionsDesc: {
    es: 'Define qué acciones puedes realizar',
    en: 'Define what actions you can perform'
  },
  create: {
    es: 'Crear',
    en: 'Create'
  },
  edit: {
    es: 'Editar',
    en: 'Edit'
  },
  delete: {
    es: 'Eliminar',
    en: 'Delete'
  },
  saveChanges: {
    es: 'Guardar Cambios',
    en: 'Save Changes'
  },
  accountVerification: {
    es: 'Verificación de Cuenta',
    en: 'Account Verification'
  },
  verificationMessage: {
    es: 'Tu cuenta está siendo verificada. Por favor, espera un momento.',
    en: 'Your account is being verified. Please wait a moment.'
  },
  verificationSubtitle: {
    es: 'Esto puede tomar unos segundos...',
    en: 'This may take a few seconds...'
  }
};
