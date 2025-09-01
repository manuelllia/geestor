import { v4 as uuidv4 } from 'uuid';

// Mock data (replace with actual API calls later)
let mockEmployeeAgreements: EmployeeAgreementRecord[] = [
  {
    id: 'ea_1',
    employeeName: 'John',
    employeeLastName: 'Doe',
    workCenter: 'New York',
    city: 'New York',
    province: 'NY',
    autonomousCommunity: 'N/A',
    responsibleName: 'Jane',
    responsibleLastName: 'Smith',
    agreementConcepts: 'Salary, Bonus',
    economicAgreement1: 50000,
    concept1: 'Salary',
    economicAgreement2: 5000,
    concept2: 'Bonus',
    economicAgreement3: 0,
    concept3: '',
    activationDate: new Date('2023-01-01'),
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    status: 'Activo',
    observations: 'Good performance',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'Sample description',
    terms: 'Sample terms',
    supervisor: 'Sample supervisor',
    benefits: 'Sample benefits',
  },
  {
    id: 'ea_2',
    employeeName: 'Alice',
    employeeLastName: 'Johnson',
    workCenter: 'Los Angeles',
    city: 'Los Angeles',
    province: 'CA',
    autonomousCommunity: 'N/A',
    responsibleName: 'Bob',
    responsibleLastName: 'Williams',
    agreementConcepts: 'Salary, Health Insurance',
    economicAgreement1: 60000,
    concept1: 'Salary',
    economicAgreement2: 10000,
    concept2: 'Health Insurance',
    economicAgreement3: 0,
    concept3: '',
    activationDate: new Date('2023-02-01'),
    startDate: new Date('2023-02-01'),
    endDate: new Date('2024-01-31'),
    status: 'Activo',
    observations: 'Excellent performance',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'Another sample description',
    terms: 'Another sample terms',
    supervisor: 'Another sample supervisor',
    benefits: 'Another sample benefits',
  },
];

export interface EmployeeAgreementRecord {
  id: string;
  employeeName: string;
  employeeLastName: string;
  workCenter: string;
  city: string;
  province: string;
  autonomousCommunity: string;
  responsibleName: string;
  responsibleLastName: string;
  agreementConcepts: string;
  economicAgreement1: number;
  concept1: string;
  economicAgreement2: number;
  concept2: string;
  economicAgreement3: number;
  concept3: string;
  activationDate: Date;
  startDate: Date;
  endDate: Date;
  status: 'Activo' | 'Finalizado' | 'Suspendido';
  observations: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Required fields that were missing
  description: string;
  terms: string;
  supervisor: string;
  benefits: string;
}

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  await delay(500); // Simulate API delay
  return mockEmployeeAgreements;
};

export const getEmployeeAgreementById = async (id: string): Promise<EmployeeAgreementRecord | undefined> => {
  await delay(500); // Simulate API delay
  return mockEmployeeAgreements.find(record => record.id === id);
};

export const createEmployeeAgreement = async (
  data: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'activationDate'> & {
    startDate?: string;
    endDate?: string;
    activationDate?: string;
  }
): Promise<EmployeeAgreementRecord> => {
  const newRecord: EmployeeAgreementRecord = {
    ...data,
    id: `ea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startDate: data.startDate ? new Date(data.startDate) : new Date(),
    endDate: data.endDate ? new Date(data.endDate) : new Date(),
    activationDate: data.activationDate ? new Date(data.activationDate) : new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    // Add default values for required fields
    description: data.description || '',
    terms: data.terms || '',
    supervisor: data.supervisor || '',
    benefits: data.benefits || '',
  };

  mockEmployeeAgreements.push(newRecord);
  return newRecord;
};

export const updateEmployeeAgreement = async (
  id: string,
  data: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'activationDate'>> & {
    startDate?: string;
    endDate?: string;
    activationDate?: string;
  }
): Promise<EmployeeAgreementRecord> => {
  const index = mockEmployeeAgreements.findIndex(record => record.id === id);
  if (index === -1) {
    throw new Error('Employee agreement not found');
  }

  const updatedRecord: EmployeeAgreementRecord = {
    ...mockEmployeeAgreements[index],
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : mockEmployeeAgreements[index].startDate,
    endDate: data.endDate ? new Date(data.endDate) : mockEmployeeAgreements[index].endDate,
    activationDate: data.activationDate ? new Date(data.activationDate) : mockEmployeeAgreements[index].activationDate,
    updatedAt: new Date(),
  };

  mockEmployeeAgreements[index] = updatedRecord;
  return updatedRecord;
};

export const deleteEmployeeAgreement = async (id: string): Promise<void> => {
  await delay(500); // Simulate API delay
  mockEmployeeAgreements = mockEmployeeAgreements.filter(record => record.id !== id);
};

export const duplicateEmployeeAgreement = async (id: string): Promise<EmployeeAgreementRecord> => {
  const original = await getEmployeeAgreementById(id);
  if (!original) {
    throw new Error('Employee agreement not found');
  }

  const duplicated = await createEmployeeAgreement({
    ...original,
    employeeName: `${original.employeeName} (Copia)`,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    activationDate: new Date().toISOString().split('T')[0],
  });

  return duplicated;
};

export const importEmployeeAgreements = async (agreements: any[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  for (let i = 0; i < agreements.length; i++) {
    try {
      await createEmployeeAgreement(agreements[i]);
      results.success++;
    } catch (error) {
      results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return results;
};

export const exportEmployeeAgreementsToCSV = (data: EmployeeAgreementRecord[]): string => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => Object.values(item).join(','));
  return `${headers}\n${rows.join('\n')}`;
};
