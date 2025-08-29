import { v4 as uuidv4 } from 'uuid';

export interface EmployeeAgreementRecord {
  id: string;
  title: string;
  type: string;
  priority: 'Alta' | 'Media' | 'Baja';
  requesterName: string;
  requesterLastName: string;
  requestDate: Date;
  status: 'Activo' | 'Finalizado' | 'Suspendido';
  employeeName: string;
  employeeLastName: string;
  position: string;
  department: string; // Added missing property
  agreementType: string;
  workCenter: string;
  city: string;
  province: string;
  autonomousCommunity: string;
  responsibleName: string;
  responsibleLastName: string;
  agreementConcepts: string;
  economicAgreement1: string;
  concept1: string;
  economicAgreement2: string;
  concept2: string;
  economicAgreement3: string;
  concept3: string;
  activationDate: Date;
  endDate?: Date;
  observations: string; // Added missing property
  jobPosition: string;
  startDate: Date;
  salary: string;
  agreementDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock data storage
let mockEmployeeAgreements: EmployeeAgreementRecord[] = [];

export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    return mockEmployeeAgreements.map(agreement => ({
      ...agreement,
      requestDate: agreement.requestDate ? new Date(agreement.requestDate) : new Date(),
      activationDate: agreement.activationDate ? new Date(agreement.activationDate) : new Date(),
      endDate: agreement.endDate ? new Date(agreement.endDate) : undefined,
      startDate: agreement.startDate ? new Date(agreement.startDate) : new Date(),
      agreementDate: agreement.agreementDate ? new Date(agreement.agreementDate) : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching employee agreements:', error);
    return [];
  }
};

export const getEmployeeAgreementById = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const agreement = mockEmployeeAgreements.find(a => a.id === id);
    if (!agreement) return null;
    
    return {
      ...agreement,
      requestDate: agreement.requestDate ? new Date(agreement.requestDate) : new Date(),
      activationDate: agreement.activationDate ? new Date(agreement.activationDate) : new Date(),
      endDate: agreement.endDate ? new Date(agreement.endDate) : undefined,
      startDate: agreement.startDate ? new Date(agreement.startDate) : new Date(),
      agreementDate: agreement.agreementDate ? new Date(agreement.agreementDate) : new Date(),
    };
  } catch (error) {
    console.error('Error fetching employee agreement by ID:', error);
    return null;
  }
};

export const createEmployeeAgreement = async (values: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeAgreementRecord | null> => {
  try {
    const newAgreement: EmployeeAgreementRecord = {
      ...values,
      id: uuidv4(),
      department: values.department || '', // Ensure department is included
      observations: values.observations || '', // Ensure observations is included
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockEmployeeAgreements.push(newAgreement);
    return newAgreement;
  } catch (error) {
    console.error('Error creating employee agreement:', error);
    return null;
  }
};

// Add the missing saveEmployeeAgreement function
export const saveEmployeeAgreement = async (values: any): Promise<EmployeeAgreementRecord | null> => {
  try {
    const newAgreement: EmployeeAgreementRecord = {
      id: uuidv4(),
      title: values.title || `Acuerdo de ${values.employeeName} ${values.employeeLastName}`,
      type: values.type || 'Acuerdo de Empleado',
      priority: values.priority || 'Media',
      requesterName: values.requesterName || values.employeeName,
      requesterLastName: values.requesterLastName || values.employeeLastName,
      requestDate: new Date(),
      status: 'Activo',
      employeeName: values.employeeName,
      employeeLastName: values.employeeLastName,
      position: values.position || values.jobPosition,
      department: values.department || '',
      agreementType: values.agreementType,
      workCenter: values.workCenter,
      city: values.city,
      province: values.province,
      autonomousCommunity: values.autonomousCommunity,
      responsibleName: values.responsibleName,
      responsibleLastName: values.responsibleLastName,
      agreementConcepts: values.agreementConcepts,
      economicAgreement1: values.economicAgreement1,
      concept1: values.concept1,
      economicAgreement2: values.economicAgreement2,
      concept2: values.concept2,
      economicAgreement3: values.economicAgreement3,
      concept3: values.concept3,
      activationDate: values.activationDate ? new Date(values.activationDate) : new Date(),
      endDate: values.endDate ? new Date(values.endDate) : undefined,
      observations: values.observations || '',
      jobPosition: values.jobPosition,
      startDate: values.startDate ? new Date(values.startDate) : new Date(),
      salary: values.salary,
      agreementDate: values.agreementDate ? new Date(values.agreementDate) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockEmployeeAgreements.push(newAgreement);
    return newAgreement;
  } catch (error) {
    console.error('Error saving employee agreement:', error);
    return null;
  }
};

export const updateEmployeeAgreement = async (id: string, values: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeAgreementRecord | null> => {
  try {
    const index = mockEmployeeAgreements.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    mockEmployeeAgreements[index] = {
      ...mockEmployeeAgreements[index],
      ...values,
      department: values.department || mockEmployeeAgreements[index].department || '',
      observations: values.observations || mockEmployeeAgreements[index].observations || '',
      updatedAt: new Date(),
    };
    
    return mockEmployeeAgreements[index];
  } catch (error) {
    console.error('Error updating employee agreement:', error);
    return null;
  }
};

export const deleteEmployeeAgreement = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const index = mockEmployeeAgreements.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    const deletedAgreement = mockEmployeeAgreements[index];
    mockEmployeeAgreements.splice(index, 1);
    return deletedAgreement;
  } catch (error) {
    console.error('Error deleting employee agreement:', error);
    return null;
  }
};

export const duplicateEmployeeAgreement = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const originalAgreement = mockEmployeeAgreements.find(a => a.id === id);
    if (!originalAgreement) return null;
    
    const { id: originalId, ...dataToCopy } = originalAgreement;
    const duplicatedAgreement: EmployeeAgreementRecord = {
      ...dataToCopy,
      id: uuidv4(),
      department: dataToCopy.department || '',
      observations: dataToCopy.observations || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockEmployeeAgreements.push(duplicatedAgreement);
    return duplicatedAgreement;
  } catch (error) {
    console.error('Error duplicating employee agreement:', error);
    return null;
  }
};

export const importEmployeeAgreements = async (agreements: Partial<EmployeeAgreementRecord>[]): Promise<{ success: number; errors: string[] }> => {
  let successCount = 0;
  const errors: string[] = [];

  for (const agreement of agreements) {
    try {
      if (!agreement.employeeName || !agreement.employeeLastName || !agreement.position) {
        errors.push(`Faltan campos obligatorios en el acuerdo: ${agreement.employeeName}`);
        continue;
      }

      const newAgreement: EmployeeAgreementRecord = {
        id: uuidv4(),
        title: agreement.title || '',
        type: agreement.type || '',
        priority: agreement.priority || 'Media',
        requesterName: agreement.requesterName || '',
        requesterLastName: agreement.requesterLastName || '',
        requestDate: agreement.requestDate ? new Date(agreement.requestDate) : new Date(),
        status: agreement.status || 'Activo',
        employeeName: agreement.employeeName,
        employeeLastName: agreement.employeeLastName,
        position: agreement.position,
        department: agreement.department || '', // Add department with default
        agreementType: agreement.agreementType || '',
        workCenter: agreement.workCenter || '',
        city: agreement.city || '',
        province: agreement.province || '',
        autonomousCommunity: agreement.autonomousCommunity || '',
        responsibleName: agreement.responsibleName || '',
        responsibleLastName: agreement.responsibleLastName || '',
        agreementConcepts: agreement.agreementConcepts || '',
        economicAgreement1: agreement.economicAgreement1 || '',
        concept1: agreement.concept1 || '',
        economicAgreement2: agreement.economicAgreement2 || '',
        concept2: agreement.concept2 || '',
        economicAgreement3: agreement.economicAgreement3 || '',
        concept3: agreement.concept3 || '',
        activationDate: agreement.activationDate ? new Date(agreement.activationDate) : new Date(),
        endDate: agreement.endDate ? new Date(agreement.endDate) : undefined,
        observations: agreement.observations || '', // Add observations with default
        jobPosition: agreement.jobPosition || agreement.position || '',
        startDate: agreement.startDate ? new Date(agreement.startDate) : new Date(),
        salary: agreement.salary || '',
        agreementDate: agreement.agreementDate ? new Date(agreement.agreementDate) : new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockEmployeeAgreements.push(newAgreement);
      successCount++;
    } catch (error: any) {
      errors.push(`Error al importar acuerdo para ${agreement.employeeName}: ${error.message}`);
    }
  }

  return { success: successCount, errors: errors };
};
