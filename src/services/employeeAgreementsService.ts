
import { v4 as uuidv4 } from 'uuid';

export interface EmployeeAgreementRecord {
  id: string;
  employeeName: string;
  employeeLastName: string;
  agreementType: string;
  priority: 'Alta' | 'Media' | 'Baja';
  status: string;
  agreementDate: Date | null;
  description?: string;
  terms?: string;
  department?: string;
  position?: string;
  supervisor?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  observations?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock data storage
let mockEmployeeAgreements: EmployeeAgreementRecord[] = [];

export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    return mockEmployeeAgreements.map(agreement => ({
      ...agreement,
      agreementDate: agreement.agreementDate ? new Date(agreement.agreementDate) : null,
      effectiveDate: agreement.effectiveDate ? new Date(agreement.effectiveDate) : undefined,
      expirationDate: agreement.expirationDate ? new Date(agreement.expirationDate) : undefined,
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
      agreementDate: agreement.agreementDate ? new Date(agreement.agreementDate) : null,
      effectiveDate: agreement.effectiveDate ? new Date(agreement.effectiveDate) : undefined,
      expirationDate: agreement.expirationDate ? new Date(agreement.expirationDate) : undefined,
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
      createdAt: new Date(),
      updatedAt: new Date(),
      agreementDate: values.agreementDate ? new Date(values.agreementDate) : null,
      effectiveDate: values.effectiveDate ? new Date(values.effectiveDate) : undefined,
      expirationDate: values.expirationDate ? new Date(values.expirationDate) : undefined,
    };
    
    mockEmployeeAgreements.push(newAgreement);
    return newAgreement;
  } catch (error) {
    console.error('Error creating employee agreement:', error);
    return null;
  }
};

export const updateEmployeeAgreement = async (id: string, values: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EmployeeAgreementRecord | null> => {
  try {
    const index = mockEmployeeAgreements.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    mockEmployeeAgreements[index] = {
      ...mockEmployeeAgreements[index],
      ...values,
      updatedAt: new Date(),
      agreementDate: values.agreementDate ? new Date(values.agreementDate) : mockEmployeeAgreements[index].agreementDate,
      effectiveDate: values.effectiveDate ? new Date(values.effectiveDate) : mockEmployeeAgreements[index].effectiveDate,
      expirationDate: values.expirationDate ? new Date(values.expirationDate) : mockEmployeeAgreements[index].expirationDate,
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
      if (!agreement.employeeName || !agreement.employeeLastName || !agreement.agreementType || !agreement.priority || !agreement.status) {
        errors.push(`Faltan campos obligatorios en el acuerdo: ${agreement.employeeName}`);
        continue;
      }

      const newAgreement: EmployeeAgreementRecord = {
        id: uuidv4(),
        employeeName: agreement.employeeName,
        employeeLastName: agreement.employeeLastName,
        agreementType: agreement.agreementType,
        priority: agreement.priority,
        status: agreement.status,
        agreementDate: agreement.agreementDate ? new Date(agreement.agreementDate) : null,
        description: agreement.description,
        terms: agreement.terms,
        department: agreement.department,
        position: agreement.position,
        supervisor: agreement.supervisor,
        effectiveDate: agreement.effectiveDate ? new Date(agreement.effectiveDate) : undefined,
        expirationDate: agreement.expirationDate ? new Date(agreement.expirationDate) : undefined,
        observations: agreement.observations,
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
