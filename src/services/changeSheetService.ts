
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ChangeSheetData {
  employeeName: string;
  employeeLastName: string;
  originCenter: string;
  currentPosition: string;
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  newPosition: string;
  newSupervisorName: string;
  newSupervisorLastName: string;
  startDate: Date | undefined;
  changeType: 'permanent' | 'temporary' | '';
  needs: string[];
  currentCompany: string;
  companyChange: 'yes' | 'no' | '';
  observations: string;
}

export const saveChangeSheet = async (data: ChangeSheetData): Promise<string> => {
  try {
    console.log('Guardando hoja de cambio:', data);
    
    // Referencia a la colección anidada: Gestión de Talento > Hojas de Cambio
    const changeSheetRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    
    // Preparar los datos para guardar
    const docData = {
      ...data,
      startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Agregar el documento a Firestore
    const docRef = await addDoc(changeSheetRef, docData);
    
    console.log('Hoja de cambio guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la hoja de cambio:', error);
    throw error;
  }
};
