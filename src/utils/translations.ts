// src/utils/translations.ts
export type Language = 'es' | 'en';

export interface Translations {
  showingRecords: string;
  search: string;
  next: string;
  previous: string;
  noRecordsFound: string;
  name: string;
  email: string;
  actions: string;
  edit: string;
  delete: string;
  add: string;
  cancel: string;
  save: string;
  confirm: string;
  create: string;
  update: string;
  import: string;
  export: string;
  duplicate: string;
  success: string;
  error: string;
  validationError: string;
  requiredFieldsError: string;
  deleteConfirmationTitle: string;
  deleteConfirmationDescription: string;
  yes: string;
  no: string;
  close: string;
  home: string;
  settings: string;
  logout: string;
  maintenance: string;
  users: string;
  roles: string;
  permissions: string;
  workCenters: string;
  equipment: string;
  inventory: string;
  processFiles: string;
  uploadFiles: string;
  upload: string;
  arrastraArchivo: string;
  formatosCsv: string;
    // Missing maintenance translations
  missingMaintenanceTitle: string;
  missingMaintenanceMessage: string;
  generateAnyway: string;
  completeFirst: string;
    // Work center modal translations
  workCenterCreatedSuccess: string;
  errorCreatingWorkCenter: string;
  workCenterUpdatedSuccess: string;
  errorUpdatingWorkCenter: string;
  createWorkCenterTitle: string;
  workCenterNameLabel: string;
  workCenterNamePlaceholder: string;
  workCenterIdLabel: string;
  workCenterIdPlaceholder: string;
  clearButton: string;
  processing: string;
  uploadCenterButton: string;
  confirmCreationTitle: string;
  confirmCreationDescription: string;
  confirmButton: string;
  workCenterExistsTitle: string;
  workCenterExistsDescription: string;
  leaveAsIsButton: string;
  updateRecordButton: string;
    // Practice evaluation translations
  valoPracTit: string;
  tutor: string;
}

export const translations: { [key in Language]: Translations } = {
  es: {
    showingRecords: 'Mostrando {{start}} a {{end}} de {{total}} registros',
    search: 'Buscar',
    next: 'Siguiente',
    previous: 'Anterior',
    noRecordsFound: 'No se encontraron registros',
    name: 'Nombre',
    email: 'Correo electrónico',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    cancel: 'Cancelar',
    save: 'Guardar',
    confirm: 'Confirmar',
    create: 'Crear',
    update: 'Actualizar',
    import: 'Importar',
    export: 'Exportar',
    duplicate: 'Duplicar',
    success: 'Éxito',
    error: 'Error',
    validationError: 'Error de validación',
    requiredFieldsError: 'Todos los campos son obligatorios',
    deleteConfirmationTitle: '¿Estás seguro?',
    deleteConfirmationDescription: 'Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este registro?',
    yes: 'Sí',
    no: 'No',
    close: 'Cerrar',
    home: 'Inicio',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    
    // Sidebar translations
    maintenance: 'Mantenimiento',
    users: 'Usuarios',
    roles: 'Roles',
    permissions: 'Permisos',
    workCenters: 'Centros de Trabajo',
    equipment: 'Equipos',
    inventory: 'Inventario',
    processFiles: 'Procesar Archivos',
    uploadFiles: 'Subir Archivos',
    upload: 'Subir',
    arrastraArchivo: 'Arrastra aquí tu archivo o haz clic para seleccionar',
    formatosCsv: 'Formatos soportados: CSV, Excel',
    
    // Missing maintenance translations
    missingMaintenanceTitle: 'Mantenimientos Faltantes',
    missingMaintenanceMessage: 'Se han detectado equipos sin mantenimientos programados.',
    generateAnyway: 'Generar de todas formas',
    completeFirst: 'Completar primero',
    
    // Work center modal translations
    requiredFieldsError: 'Todos los campos son obligatorios',
    workCenterCreatedSuccess: 'Centro de trabajo creado exitosamente',
    errorCreatingWorkCenter: 'Error al crear el centro de trabajo',
    workCenterUpdatedSuccess: 'Centro de trabajo actualizado exitosamente',
    errorUpdatingWorkCenter: 'Error al actualizar el centro de trabajo',
    createWorkCenterTitle: 'Crear Centro de Trabajo',
    workCenterNameLabel: 'Nombre del Centro',
    workCenterNamePlaceholder: 'Ingresa el nombre del centro de trabajo',
    workCenterIdLabel: 'ID del Centro',
    workCenterIdPlaceholder: 'Ingresa el ID del centro de trabajo',
    clearButton: 'Limpiar',
    processing: 'Procesando...',
    uploadCenterButton: 'Crear Centro',
    confirmCreationTitle: 'Confirmar Creación',
    confirmCreationDescription: '¿Estás seguro de que deseas crear este centro de trabajo?',
    confirmButton: 'Confirmar',
    workCenterExistsTitle: 'Centro ya Existe',
    workCenterExistsDescription: 'Ya existe un centro de trabajo con este ID.',
    leaveAsIsButton: 'Dejar como está',
    updateRecordButton: 'Actualizar registro',
    
    // Practice evaluation translations
    valoPracTit: 'Evaluación de Prácticas',
    tutor: 'Tutor',
  },
  en: {
    showingRecords: 'Showing {{start}} to {{end}} of {{total}} records',
    search: 'Search',
    next: 'Next',
    previous: 'Previous',
    noRecordsFound: 'No records found',
    name: 'Name',
    email: 'Email',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    create: 'Create',
    update: 'Update',
    import: 'Import',
    export: 'Export',
    duplicate: 'Duplicate',
    success: 'Success',
    error: 'Error',
    validationError: 'Validation error',
    requiredFieldsError: 'All fields are required',
    deleteConfirmationTitle: 'Are you sure?',
    deleteConfirmationDescription: 'This action cannot be undone. Are you sure you want to delete this record?',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    home: 'Home',
    settings: 'Settings',
    logout: 'Logout',

    // Sidebar translations
    maintenance: 'Maintenance',
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    workCenters: 'Work Centers',
    equipment: 'Equipment',
    inventory: 'Inventory',
    processFiles: 'Process Files',
    uploadFiles: 'Upload Files',
    upload: 'Upload',
    arrastraArchivo: 'Drag your file here or click to select',
    formatosCsv: 'Supported formats: CSV, Excel',
    
    // Missing maintenance translations
    missingMaintenanceTitle: 'Missing Maintenance',
    missingMaintenanceMessage: 'Equipment without scheduled maintenance has been detected.',
    generateAnyway: 'Generate anyway',
    completeFirst: 'Complete first',
    
    // Work center modal translations
    requiredFieldsError: 'All fields are required',
    workCenterCreatedSuccess: 'Work center created successfully',
    errorCreatingWorkCenter: 'Error creating work center',
    workCenterUpdatedSuccess: 'Work center updated successfully',
    errorUpdatingWorkCenter: 'Error updating work center',
    createWorkCenterTitle: 'Create Work Center',
    workCenterNameLabel: 'Center Name',
    workCenterNamePlaceholder: 'Enter work center name',
    workCenterIdLabel: 'Center ID',
    workCenterIdPlaceholder: 'Enter work center ID',
    clearButton: 'Clear',
    processing: 'Processing...',
    uploadCenterButton: 'Create Center',
    confirmCreationTitle: 'Confirm Creation',
    confirmCreationDescription: 'Are you sure you want to create this work center?',
    confirmButton: 'Confirm',
    workCenterExistsTitle: 'Center Already Exists',
    workCenterExistsDescription: 'A work center with this ID already exists.',
    leaveAsIsButton: 'Leave as is',
    updateRecordButton: 'Update record',
    
    // Practice evaluation translations
    valoPracTit: 'Practice Evaluation',
    tutor: 'Tutor',
  }
};

export type TranslationsKeys = keyof Translations;
