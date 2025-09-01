
export type Language = 'es' | 'en';

export interface Translations {
  // Navigation
  home: string;
  operations: string;
  technical_management: string;
  talent_management: string;
  contract_requests: string;
  change_sheets: string;
  employee_agreements: string;
  real_estate_management: string;
  practice_evaluations: string;
  exit_interviews: string;
  user_management: string;
  settings: string;
  
  // Common actions
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  create: string;
  export: string;
  import: string;
  refresh: string;
  duplicate: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  filter: string;
  clear: string;
  confirm: string;
  close: string;
  
  // CSV Export
  export_csv: string;
  exporting_data: string;
  export_successful: string;
  export_failed: string;
  no_data_to_export: string;
  
  // Status
  pending: string;
  approved: string;
  rejected: string;
  active: string;
  inactive: string;
  
  // Forms
  required_field: string;
  optional_field: string;
  select_option: string;
  
  // Messages
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Practice Evaluations
  practice_evaluations: string;
  tutor_name: string;
  student_name: string;
  formation: string;
  institution: string;
  evaluation_date: string;
  performance_rating: string;
  final_evaluation: string;
  
  // Employee Agreements
  employee_agreements: string;
  employee_name: string;
  agreement_type: string;
  start_date: string;
  end_date: string;
  
  // Change Sheets
  change_sheets: string;
  current_company: string;
  change_type: string;
  origin_center: string;
  destination_center: string;
  
  // Contract Requests
  contract_requests: string;
  requester_name: string;
  contract_type: string;
  salary: string;
  incorporation_date: string;
  job_position: string;
  work_center: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    home: 'Inicio',
    operations: 'Operaciones',
    technical_management: 'Gestión Técnica',
    talent_management: 'Gestión de Talento',
    contract_requests: 'Solicitudes de Contratación',
    change_sheets: 'Hojas de Cambio',
    employee_agreements: 'Acuerdos de Empleado',
    real_estate_management: 'Gestión de Inmuebles',
    practice_evaluations: 'Valoración de Prácticas',
    exit_interviews: 'Entrevistas de Salida',
    user_management: 'Gestión de Usuarios',
    settings: 'Configuración',
    
    // Common actions
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    create: 'Crear',
    export: 'Exportar',
    import: 'Importar',
    refresh: 'Actualizar',
    duplicate: 'Duplicar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpiar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    
    // CSV Export
    export_csv: 'Exportar CSV',
    exporting_data: 'Exportando datos...',
    export_successful: 'Exportación completada correctamente',
    export_failed: 'Error al exportar los datos',
    no_data_to_export: 'No hay datos para exportar',
    
    // Status
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    active: 'Activo',
    inactive: 'Inactivo',
    
    // Forms
    required_field: 'Campo requerido',
    optional_field: 'Campo opcional',
    select_option: 'Seleccionar opción',
    
    // Messages
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    
    // Practice Evaluations
    practice_evaluations: 'Valoración de Prácticas',
    tutor_name: 'Nombre del Tutor',
    student_name: 'Nombre del Estudiante',
    formation: 'Formación',
    institution: 'Institución',
    evaluation_date: 'Fecha de Evaluación',
    performance_rating: 'Calificación de Rendimiento',
    final_evaluation: 'Evaluación Final',
    
    // Employee Agreements
    employee_agreements: 'Acuerdos de Empleado',
    employee_name: 'Nombre del Empleado',
    agreement_type: 'Tipo de Acuerdo',
    start_date: 'Fecha de Inicio',
    end_date: 'Fecha de Fin',
    
    // Change Sheets
    change_sheets: 'Hojas de Cambio',
    current_company: 'Empresa Actual',
    change_type: 'Tipo de Cambio',
    origin_center: 'Centro Origen',
    destination_center: 'Centro Destino',
    
    // Contract Requests
    contract_requests: 'Solicitudes de Contratación',
    requester_name: 'Nombre del Solicitante',
    contract_type: 'Tipo de Contrato',
    salary: 'Salario',
    incorporation_date: 'Fecha de Incorporación',
    job_position: 'Puesto de Trabajo',
    work_center: 'Centro de Trabajo',
  },
  
  en: {
    // Navigation
    home: 'Home',
    operations: 'Operations',
    technical_management: 'Technical Management',
    talent_management: 'Talent Management',
    contract_requests: 'Contract Requests',
    change_sheets: 'Change Sheets',
    employee_agreements: 'Employee Agreements',
    real_estate_management: 'Real Estate Management',
    practice_evaluations: 'Practice Evaluations',
    exit_interviews: 'Exit Interviews',
    user_management: 'User Management',
    settings: 'Settings',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    create: 'Create',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    duplicate: 'Duplicate',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    confirm: 'Confirm',
    close: 'Close',
    
    // CSV Export
    export_csv: 'Export CSV',
    exporting_data: 'Exporting data...',
    export_successful: 'Export completed successfully',
    export_failed: 'Error exporting data',
    no_data_to_export: 'No data to export',
    
    // Status
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    inactive: 'Inactive',
    
    // Forms
    required_field: 'Required field',
    optional_field: 'Optional field',
    select_option: 'Select option',
    
    // Messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    
    // Practice Evaluations
    practice_evaluations: 'Practice Evaluations',
    tutor_name: 'Tutor Name',
    student_name: 'Student Name',
    formation: 'Formation',
    institution: 'Institution',
    evaluation_date: 'Evaluation Date',
    performance_rating: 'Performance Rating',
    final_evaluation: 'Final Evaluation',
    
    // Employee Agreements
    employee_agreements: 'Employee Agreements',
    employee_name: 'Employee Name',
    agreement_type: 'Agreement Type',
    start_date: 'Start Date',
    end_date: 'End Date',
    
    // Change Sheets
    change_sheets: 'Change Sheets',
    current_company: 'Current Company',
    change_type: 'Change Type',
    origin_center: 'Origin Center',
    destination_center: 'Destination Center',
    
    // Contract Requests
    contract_requests: 'Contract Requests',
    requester_name: 'Requester Name',
    contract_type: 'Contract Type',
    salary: 'Salary',
    incorporation_date: 'Incorporation Date',
    job_position: 'Job Position',
    work_center: 'Work Center',
  }
};
