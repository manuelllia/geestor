
import { v4 as uuidv4 } from 'uuid';

export interface ContractRequestRecord {
  id: string;
  position: string;
  department: string;
  urgency: 'Alta' | 'Media' | 'Baja';
  requesterName: string;
  requesterLastName: string;
  requestDate: Date;
  status: string;
  contractType?: string;
  salary?: string;
  observations?: string;
  incorporationDate?: Date;
  company?: string;
  jobPosition?: string;
  professionalCategory?: string;
  city?: string;
  province?: string;
  autonomousCommunity?: string;
  workCenter?: string;
  companyFlat?: string;
  language1?: string;
  level1?: string;
  language2?: string;
  level2?: string;
  experienceElectromedicine?: string;
  experienceInstallations?: string;
  hiringReason?: string;
  notesAndCommitments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock data storage
let mockContractRequests: ContractRequestRecord[] = [];

export const getContractRequests = async (): Promise<ContractRequestRecord[]> => {
  try {
    return mockContractRequests.map(request => ({
      ...request,
      requestDate: request.requestDate ? new Date(request.requestDate) : new Date(),
      incorporationDate: request.incorporationDate ? new Date(request.incorporationDate) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching contract requests:', error);
    return [];
  }
};

export const getContractRequestById = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const request = mockContractRequests.find(r => r.id === id);
    if (!request) return null;
    
    return {
      ...request,
      requestDate: request.requestDate ? new Date(request.requestDate) : new Date(),
      incorporationDate: request.incorporationDate ? new Date(request.incorporationDate) : undefined,
    };
  } catch (error) {
    console.error('Error fetching contract request by ID:', error);
    return null;
  }
};

export const createContractRequest = async (values: Omit<ContractRequestRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractRequestRecord | null> => {
  try {
    const newRequest: ContractRequestRecord = {
      ...values,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      requestDate: values.requestDate ? new Date(values.requestDate) : new Date(),
      incorporationDate: values.incorporationDate ? new Date(values.incorporationDate) : undefined,
    };
    
    mockContractRequests.push(newRequest);
    return newRequest;
  } catch (error) {
    console.error('Error creating contract request:', error);
    return null;
  }
};

export const updateContractRequest = async (id: string, values: Omit<ContractRequestRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractRequestRecord | null> => {
  try {
    const index = mockContractRequests.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    mockContractRequests[index] = {
      ...mockContractRequests[index],
      ...values,
      updatedAt: new Date(),
      requestDate: values.requestDate ? new Date(values.requestDate) : new Date(),
      incorporationDate: values.incorporationDate ? new Date(values.incorporationDate) : undefined,
    };
    
    return mockContractRequests[index];
  } catch (error) {
    console.error('Error updating contract request:', error);
    return null;
  }
};

export const deleteContractRequest = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const index = mockContractRequests.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    const deletedRequest = mockContractRequests[index];
    mockContractRequests.splice(index, 1);
    return deletedRequest;
  } catch (error) {
    console.error('Error deleting contract request:', error);
    return null;
  }
};

export const duplicateContractRequest = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const originalRequest = mockContractRequests.find(r => r.id === id);
    if (!originalRequest) return null;
    
    const { id: originalId, ...dataToCopy } = originalRequest;
    const duplicatedRequest: ContractRequestRecord = {
      ...dataToCopy,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockContractRequests.push(duplicatedRequest);
    return duplicatedRequest;
  } catch (error) {
    console.error('Error duplicating contract request:', error);
    return null;
  }
};

export const importContractRequests = async (requests: Partial<ContractRequestRecord>[]): Promise<{ success: number; errors: string[] }> => {
  let successCount = 0;
  const errors: string[] = [];

  for (const request of requests) {
    try {
      if (!request.position || !request.department || !request.urgency || !request.requesterName || !request.requesterLastName || !request.status) {
        errors.push(`Faltan campos obligatorios en la solicitud: ${request.position}`);
        continue;
      }

      const newRequest: ContractRequestRecord = {
        id: uuidv4(),
        position: request.position,
        department: request.department,
        urgency: request.urgency,
        requesterName: request.requesterName,
        requesterLastName: request.requesterLastName,
        requestDate: request.requestDate ? new Date(request.requestDate) : new Date(),
        status: request.status,
        contractType: request.contractType,
        salary: request.salary,
        observations: request.observations,
        incorporationDate: request.incorporationDate ? new Date(request.incorporationDate) : undefined,
        company: request.company,
        jobPosition: request.jobPosition,
        professionalCategory: request.professionalCategory,
        city: request.city,
        province: request.province,
        autonomousCommunity: request.autonomousCommunity,
        workCenter: request.workCenter,
        companyFlat: request.companyFlat,
        language1: request.language1,
        level1: request.level1,
        language2: request.language2,
        level2: request.level2,
        experienceElectromedicine: request.experienceElectromedicine,
        experienceInstallations: request.experienceInstallations,
        hiringReason: request.hiringReason,
        notesAndCommitments: request.notesAndCommitments,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockContractRequests.push(newRequest);
      successCount++;
    } catch (error: any) {
      errors.push(`Error al importar solicitud para ${request.position}: ${error.message}`);
    }
  }

  return { success: successCount, errors: errors };
};
