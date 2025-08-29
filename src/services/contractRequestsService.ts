import { db } from '../../lib/db';
import { ContractRequest } from '@prisma/client';

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

export const getContractRequests = async (): Promise<ContractRequestRecord[]> => {
  try {
    const contractRequests = await db.contractRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contractRequests.map(request => ({
      ...request,
      requestDate: request.requestDate ? new Date(request.requestDate) : null,
      incorporationDate: request.incorporationDate ? new Date(request.incorporationDate) : null,
    })) as ContractRequestRecord[];
  } catch (error) {
    console.error('Error fetching contract requests:', error);
    return [];
  }
};

export const getContractRequestById = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const contractRequest = await db.contractRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!contractRequest) {
      return null;
    }

    return {
      ...contractRequest,
      requestDate: contractRequest.requestDate ? new Date(contractRequest.requestDate) : null,
      incorporationDate: contractRequest.incorporationDate ? new Date(contractRequest.incorporationDate) : null,
    } as ContractRequestRecord;
  } catch (error) {
    console.error('Error fetching contract request by ID:', error);
    return null;
  }
};

export const createContractRequest = async (values: Omit<ContractRequestRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractRequestRecord | null> => {
  try {
    const contractRequest = await db.contractRequest.create({
      data: {
        ...values,
        requestDate: values.requestDate ? new Date(values.requestDate) : null,
        incorporationDate: values.incorporationDate ? new Date(values.incorporationDate) : null,
      },
    });

    return {
      ...contractRequest,
      requestDate: contractRequest.requestDate ? new Date(contractRequest.requestDate) : null,
      incorporationDate: contractRequest.incorporationDate ? new Date(contractRequest.incorporationDate) : null,
    } as ContractRequestRecord;
  } catch (error) {
    console.error('Error creating contract request:', error);
    return null;
  }
};

export const updateContractRequest = async (id: string, values: Omit<ContractRequestRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractRequestRecord | null> => {
  try {
    const contractRequest = await db.contractRequest.update({
      where: {
        id: id,
      },
      data: {
        ...values,
        requestDate: values.requestDate ? new Date(values.requestDate) : null,
        incorporationDate: values.incorporationDate ? new Date(values.incorporationDate) : null,
      },
    });

    return {
      ...contractRequest,
      requestDate: contractRequest.requestDate ? new Date(contractRequest.requestDate) : null,
      incorporationDate: contractRequest.incorporationDate ? new Date(contractRequest.incorporationDate) : null,
    } as ContractRequestRecord;
  } catch (error) {
    console.error('Error updating contract request:', error);
    return null;
  }
};

export const deleteContractRequest = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const contractRequest = await db.contractRequest.delete({
      where: {
        id: id,
      },
    });

    return {
      ...contractRequest,
      requestDate: contractRequest.requestDate ? new Date(contractRequest.requestDate) : null,
      incorporationDate: contractRequest.incorporationDate ? new Date(contractRequest.incorporationDate) : null,
    } as ContractRequestRecord;
  } catch (error) {
    console.error('Error deleting contract request:', error);
    return null;
  }
};

export const duplicateContractRequest = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const originalRequest = await db.contractRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!originalRequest) {
      console.log(`Contract request with id ${id} not found`);
      return null;
    }

    const { id: originalId, ...dataToCopy } = originalRequest;

    const duplicatedRequest = await db.contractRequest.create({
      data: {
        ...dataToCopy,
        requestDate: dataToCopy.requestDate ? new Date(dataToCopy.requestDate) : null,
        incorporationDate: dataToCopy.incorporationDate ? new Date(dataToCopy.incorporationDate) : null,
      },
    });

    return {
      ...duplicatedRequest,
      requestDate: duplicatedRequest.requestDate ? new Date(duplicatedRequest.requestDate) : null,
      incorporationDate: duplicatedRequest.incorporationDate ? new Date(duplicatedRequest.incorporationDate) : null,
    } as ContractRequestRecord;
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
      // Validate required fields
      if (!request.position || !request.department || !request.urgency || !request.requesterName || !request.requesterLastName || !request.requestDate || !request.status) {
        errors.push(`Faltan campos obligatorios en la solicitud: ${request.position}`);
        continue;
      }

      await db.contractRequest.create({
        data: {
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
          incorporationDate: request.incorporationDate ? new Date(request.incorporationDate) : null,
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
        },
      });
      successCount++;
    } catch (error: any) {
      errors.push(`Error al importar solicitud para ${request.position}: ${error.message}`);
    }
  }

  return { success: successCount, errors: errors };
};
