
import { collection, doc, getDoc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface PropertyData {
  [key: string]: any;
}

export interface SheetSelection {
  sheetName: string;
  selected: boolean;
}

export const checkPisosDocument = async (): Promise<boolean> => {
  try {
    const pisosDocRef = doc(db, "Gestión del Talento", "pisos");
    const pisosDoc = await getDoc(pisosDocRef);
    return pisosDoc.exists();
  } catch (error) {
    console.error('Error al verificar documento pisos:', error);
    return false;
  }
};

export const createPisosDocument = async (): Promise<void> => {
  try {
    const pisosDocRef = doc(db, "Gestión del Talento", "pisos");
    await setDoc(pisosDocRef, {
      createdAt: Timestamp.now(),
      description: "Documento principal para gestión de inmuebles"
    });
    console.log('Documento pisos creado exitosamente');
  } catch (error) {
    console.error('Error al crear documento pisos:', error);
    throw error;
  }
};

export const insertPropertyData = async (
  data: PropertyData[], 
  subcollection: 'pisos' | 'PISOS ACTIVOS' | 'BAJA PISOS' | 'TABLA DINÁMICA'
): Promise<void> => {
  try {
    const subcollectionRef = collection(db, "Gestión del Talento", "pisos", subcollection);
    
    const insertPromises = data.map(async (row) => {
      const docData = {
        ...row,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      return addDoc(subcollectionRef, docData);
    });

    await Promise.all(insertPromises);
    console.log(`${data.length} registros insertados en ${subcollection}`);
  } catch (error) {
    console.error(`Error al insertar datos en ${subcollection}:`, error);
    throw error;
  }
};
