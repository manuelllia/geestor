
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface EmployeeAgreementData {
  employeeName: string;
  employeeLastName: string;
  position: string;
  department: string;
  agreementType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  salary: string;
  benefits: string[];
  conditions: string;
  observations: string;
}

export const saveEmployeeAgreement = async (data: EmployeeAgreementData): Promise<string> => {
  try {
    console.log('Guardando acuerdo con empleado:', data);
    
    // Referencia a la colección anidada: Gestión de Talento > Acuerdos con empleados
    const agreementRef = collection(db, "Gestión de Talento", "acuerdos-empleados", "Acuerdos con empleados");
    
    // Preparar los datos para guardar
    const docData = {
      ...data,
      startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
      endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Agregar el documento a Firestore
    const docRef = await addDoc(agreementRef, docData);
    
    console.log('Acuerdo con empleado guardado con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar el acuerdo con empleado:', error);
    throw error;
  }
};
