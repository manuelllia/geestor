
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ContractRequestData {
  // Candidato Seleccionado
  applicantName: string;
  applicantLastName: string;
  
  // Información del contrato
  contractType: string;
  salary: string;
  incorporationDate: Date | undefined;
  company: string;
  position: string;
  professionalCategory: string;
  
  // Ubicación
  population: string;
  province: string;
  autonomousCommunity: string;
  workCenter: string;
  
  // Responsable Directo
  directManagerName: string;
  directManagerLastName: string;
  
  // Validador de Gastos y Vacaciones
  expenseValidatorName: string;
  expenseValidatorLastName: string;
  
  // Piso de Empresa
  companyFloor: string;
  
  // Otros datos de interés
  language1: string;
  language1Level: string;
  language2: string;
  language2Level: string;
  electromedicalExperience: string;
  electromedicalExperienceDuration: string;
  installationsExperience: string;
  installationsExperienceDuration: string;
  contractingReason: string;
  observationsCommitments: string;
  
  // Campos adicionales para el sistema
  status: string;
  observations: string;
}

export interface ContractRequestRecord extends ContractRequestData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const saveContractRequest = async (data: ContractRequestData): Promise<string> => {
  try {
    console.log('Guardando solicitud de contrato:', data);
    
    // Referencia a la colección anidada: Gestión de Talento > Solicitudes de Contratación
    const contractRef = collection(db, "Gestión de Talento", "solicitudes-contratacion", "Solicitudes de Contratación");
    
    // Preparar los datos para guardar
    const docData = {
      ...data,
      incorporationDate: data.incorporationDate ? Timestamp.fromDate(data.incorporationDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Agregar el documento a Firestore
    const docRef = await addDoc(contractRef, docData);
    
    console.log('Solicitud de contrato guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la solicitud de contrato:', error);
    throw error;
  }
};

export const getContractRequests = async (): Promise<ContractRequestRecord[]> => {
  try {
    console.log('Obteniendo solicitudes de contrato desde Firebase...');
    
    // Referencia a la colección anidada
    const contractsRef = collection(db, "Gestión de Talento", "solicitudes-contratacion", "Solicitudes de Contratación");
    const q = query(contractsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const contractRequests: ContractRequestRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      contractRequests.push({
        id: doc.id,
        applicantName: data.applicantName || '',
        applicantLastName: data.applicantLastName || '',
        contractType: data.contractType || '',
        salary: data.salary || '',
        incorporationDate: data.incorporationDate ? data.incorporationDate.toDate() : undefined,
        company: data.company || '',
        position: data.position || '',
        professionalCategory: data.professionalCategory || '',
        population: data.population || '',
        province: data.province || '',
        autonomousCommunity: data.autonomousCommunity || '',
        workCenter: data.workCenter || '',
        directManagerName: data.directManagerName || '',
        directManagerLastName: data.directManagerLastName || '',
        expenseValidatorName: data.expenseValidatorName || '',
        expenseValidatorLastName: data.expenseValidatorLastName || '',
        companyFloor: data.companyFloor || '',
        language1: data.language1 || '',
        language1Level: data.language1Level || '',
        language2: data.language2 || '',
        language2Level: data.language2Level || '',
        electromedicalExperience: data.electromedicalExperience || '',
        electromedicalExperienceDuration: data.electromedicalExperienceDuration || '',
        installationsExperience: data.installationsExperience || '',
        installationsExperienceDuration: data.installationsExperienceDuration || '',
        contractingReason: data.contractingReason || '',
        observationsCommitments: data.observationsCommitments || '',
        status: data.status || 'Pendiente',
        observations: data.observations || '',
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date()
      });
    });
    
    console.log('Solicitudes de contrato obtenidas:', contractRequests.length);
    return contractRequests;
  } catch (error) {
    console.error('Error al obtener solicitudes de contrato:', error);
    throw error;
  }
};
