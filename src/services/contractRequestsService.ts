
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ContractRequestData {
  applicantName: string;
  applicantLastName: string;
  position: string;
  department: string;
  requestType: string;
  requestDate: Date | undefined;
  expectedStartDate: Date | undefined;
  salary: string;
  experience: string;
  qualifications: string[];
  status: string;
  observations: string;
}

export const saveContractRequest = async (data: ContractRequestData): Promise<string> => {
  try {
    console.log('Guardando solicitud de contrato:', data);
    
    // Referencia a la colección anidada: Gestión de Talento > Solicitudes de Contratación
    const contractRef = collection(db, "Gestión de Talento", "solicitudes-contratacion", "Solicitudes de Contratación");
    
    // Preparar los datos para guardar
    const docData = {
      ...data,
      requestDate: data.requestDate ? Timestamp.fromDate(data.requestDate) : null,
      expectedStartDate: data.expectedStartDate ? Timestamp.fromDate(data.expectedStartDate) : null,
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
