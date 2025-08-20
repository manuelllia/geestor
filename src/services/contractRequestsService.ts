
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  experience: string;
  qualifications: string[];
  status: string;
  observations: string;
  // Nuevos campos para mapear desde la importación
  entryId?: string;
  selectedCandidate?: string;
  contractType?: string;
  incorporationDate?: Date;
  company?: string;
  specificPosition?: string;
  professionalCategory?: string;
  specificCategory?: string;
  city?: string;
  province?: string;
  autonomousCommunity?: string;
  workCenter?: string;
  specificCenter?: string;
  directResponsible?: string;
  directSupervisorName?: string;
  directSupervisorLastName?: string; // Added missing property
  companyFloor?: string;
  language?: string;
  languageLevel?: string;
  language2?: string;
  languageLevel2?: string;
  electromedicalExperience?: string;
  installationExperience?: string;
  hiringReason?: string;
  commitmentsObservations?: string;
  createdByUserId?: string;
  pdfSolicitation?: string;
  newCompany?: string;
  approved?: boolean;
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
        incorporationDate: data.incorporationDate?.toDate() || undefined,
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

export const updateContractRequest = async (id: string, request: Partial<ContractRequestData>): Promise<void> => {
  try {
    const requestData = {
      ...request,
      updatedAt: new Date(),
    };
    
    await updateDoc(doc(db, COLLECTION_PATH, id), requestData);
    console.log('Contract request updated successfully');
  } catch (error) {
    console.error('Error updating contract request:', error);
    throw error;
  }
};

export const deleteContractRequest = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_PATH, id));
    console.log('Contract request deleted successfully');
  } catch (error) {
    console.error('Error deleting contract request:', error);
    throw error;
  }
};

export const importContractRequests = async (requests: any[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  for (let i = 0; i < requests.length; i++) {
    try {
      const request = requests[i];
      
      // Mapeo mejorado de campos desde la importación
      const requestData: ContractRequestData = {
        // Campos básicos
        applicantName: request['Candidato Seleccionado']?.split(' ')[0] || '',
        applicantLastName: request['Candidato Seleccionado']?.split(' ').slice(1).join(' ') || '',
        position: request['Puesto de Trabajo'] || request['Especificar Puesto de Trabajo'] || '',
        department: request['Centro de Trabajo'] || request['Especificar Centro'] || '',
        requestType: request['Tipo de Contrato'] || '',
        requestDate: request['Fecha entrada'] ? new Date(request['Fecha entrada']) : new Date(),
        expectedStartDate: request['Fecha de Incorporación'] ? new Date(request['Fecha de Incorporación']) : undefined,
        salary: request['Salario']?.toString() || '',
        experience: request['Experiencia Previa en Electromedicina'] || request['Experiencia Previa en Instalaciones'] || '',
        qualifications: [],
        status: request['Approved? (Admin-only)'] ? 'Aprobado' : 'Pendiente',
        observations: request['Observaciones'] || '',
        
        // Campos adicionales mapeados
        entryId: request['ID Entrada']?.toString() || '',
        selectedCandidate: request['Candidato Seleccionado'] || '',
        contractType: request['Tipo de Contrato'] || '',
        incorporationDate: request['Fecha de Incorporación'] ? new Date(request['Fecha de Incorporación']) : undefined,
        company: request['Empresa'] || '',
        specificPosition: request['Especificar Puesto de Trabajo'] || '',
        professionalCategory: request['Categoría Profesional'] || '',
        specificCategory: request['Especificar Categoría Profesional'] || '',
        city: request['Población'] || '',
        province: request['Provincia'] || '',
        autonomousCommunity: request['Comunidad Autónoma'] || '',
        workCenter: request['Centro de Trabajo'] || '',
        specificCenter: request['Especificar Centro'] || '',
        directResponsible: request['Responsable Directo'] || '',
        companyFloor: request['Piso de Empresa'] || '',
        language: request['Idioma'] || '',
        languageLevel: request['Nivel'] || '',
        language2: request['Idioma 2'] || '',
        languageLevel2: request['Nivel 2'] || '',
        electromedicalExperience: request['Experiencia Previa en Electromedicina'] || '',
        installationExperience: request['Experiencia Previa en Instalaciones'] || '',
        hiringReason: request['Motivo de la Contratación'] || '',
        commitmentsObservations: request['Observaciones y/o Compromisos'] || '',
        createdByUserId: request['Creada por (ID de usuario)'] || '',
        pdfSolicitation: request['PDF: Solicitud de Contratación'] || '',
        newCompany: request['NUEVA EMPRESA'] || '',
        approved: request['Approved? (Admin-only)'] === 'TRUE' || request['Approved? (Admin-only)'] === true,
        
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
