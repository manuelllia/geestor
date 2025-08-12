
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ContractRequestData {
  id?: string;
  applicantName: string;
  applicantLastName: string;
  position: string;
  department: string;
  requestType: string;
  requestDate: Date;
  expectedStartDate?: Date;
  salary: string;
  experience: string; // Agregada la propiedad experience
  qualifications: string[];
  status: string;
  observations: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContractRequestInput {
  applicantName: string;
  applicantLastName: string;
  position: string;
  department: string;
  requestType: string;
  requestDate: Date;
  expectedStartDate?: Date;
  salary: string;
  status: string;
  observations: string;
}

const COLLECTION_PATH = 'Gestión de Talento/solicitudes-contratacion/Solicitudes de Contratación';

export const getContractRequests = async (): Promise<ContractRequestData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_PATH));
    const requests: ContractRequestData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        ...data,
        requestDate: data.requestDate?.toDate() || new Date(),
        expectedStartDate: data.expectedStartDate?.toDate() || undefined,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ContractRequestData);
    });
    
    return requests;
  } catch (error) {
    console.error('Error getting contract requests:', error);
    throw error;
  }
};

// Función para guardar una solicitud de contrato individual
export const saveContractRequest = async (request: ContractRequestData): Promise<void> => {
  try {
    const requestData = {
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await addDoc(collection(db, COLLECTION_PATH), requestData);
    console.log('Contract request saved successfully');
  } catch (error) {
    console.error('Error saving contract request:', error);
    throw error;
  }
};

export const importContractRequests = async (requests: ContractRequestInput[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  for (let i = 0; i < requests.length; i++) {
    try {
      const request = requests[i];
      
      // Validar campos requeridos
      if (!request.applicantName || !request.applicantLastName || !request.position) {
        results.errors.push(`Fila ${i + 2}: Faltan campos requeridos (nombre, apellidos o puesto)`);
        continue;
      }
      
      const requestData: ContractRequestData = {
        applicantName: request.applicantName,
        applicantLastName: request.applicantLastName,
        position: request.position,
        department: request.department,
        requestType: request.requestType,
        requestDate: request.requestDate,
        expectedStartDate: request.expectedStartDate,
        salary: request.salary,
        experience: '', // Valor por defecto para experience
        qualifications: [], // Valor por defecto para qualifications
        status: request.status,
        observations: request.observations,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await addDoc(collection(db, COLLECTION_PATH), requestData);
      results.success++;
      
    } catch (error) {
      console.error(`Error importing request ${i + 1}:`, error);
      results.errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  return results;
};
