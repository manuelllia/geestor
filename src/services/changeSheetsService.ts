
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ChangeSheetData } from "./changeSheetService";

export interface ChangeSheetRecord extends ChangeSheetData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export const getChangeSheets = async (): Promise<ChangeSheetRecord[]> => {
  try {
    console.log('Obteniendo hojas de cambio desde Firebase...');
    
    // Referencia a la colección anidada
    const changeSheetsRef = collection(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio");
    const q = query(changeSheetsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const changeSheets: ChangeSheetRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      changeSheets.push({
        id: doc.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        originCenter: data.originCenter || '',
        currentPosition: data.currentPosition || '',
        currentSupervisorName: data.currentSupervisorName || '',
        currentSupervisorLastName: data.currentSupervisorLastName || '',
        newPosition: data.newPosition || '',
        newSupervisorName: data.newSupervisorName || '',
        newSupervisorLastName: data.newSupervisorLastName || '',
        startDate: data.startDate ? data.startDate.toDate() : undefined,
        changeType: data.changeType || '',
        needs: data.needs || [],
        currentCompany: data.currentCompany || '',
        companyChange: data.companyChange || '',
        observations: data.observations || '',
        status: data.status || 'Pendiente',
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date()
      });
    });
    
    console.log('Hojas de cambio obtenidas:', changeSheets.length);
    return changeSheets;
  } catch (error) {
    console.error('Error al obtener hojas de cambio:', error);
    throw error;
  }
};

export const updateChangeSheetStatus = async (id: string, status: 'Pendiente' | 'Aprobado' | 'Rechazado'): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
    console.log('Estado de hoja de cambio actualizado:', id, status);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error;
  }
};

export const deleteChangeSheet = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "Gestión de Talento", "hojas-cambio", "Hojas de Cambio", id);
    await deleteDoc(docRef);
    console.log('Hoja de cambio eliminada:', id);
  } catch (error) {
    console.error('Error al eliminar hoja de cambio:', error);
    throw error;
  }
};
