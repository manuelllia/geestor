
import { collection, doc, getDoc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface PropertyData {
  [key: string]: any;
}

export interface SheetSelection {
  sheetName: string;
  selected: boolean;
}

export const checkRealEstateDocument = async (): Promise<boolean> => {
  try {
    const realEstateDocRef = doc(db, "Gestión de Talento", "Gestión Inmuebles");
    const realEstateDoc = await getDoc(realEstateDocRef);
    return realEstateDoc.exists();
  } catch (error) {
    console.error('Error al verificar documento de Gestión Inmuebles:', error);
    return false;
  }
};

export const createRealEstateDocument = async (): Promise<void> => {
  try {
    const realEstateDocRef = doc(db, "Gestión de Talento", "Gestión Inmuebles");
    await setDoc(realEstateDocRef, {
      createdAt: Timestamp.now(),
      description: "Documento principal para gestión de inmuebles",
      lastUpdated: Timestamp.now()
    });
    console.log('Documento de Gestión Inmuebles creado exitosamente');
  } catch (error) {
    console.error('Error al crear documento de Gestión Inmuebles:', error);
    throw error;
  }
};

export const insertPropertyData = async (
  data: PropertyData[], 
  sheetName: string
): Promise<void> => {
  try {
    // Crear subcolección basada en el nombre de la hoja
    const subcollectionRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", sheetName);
    
    const insertPromises = data.map(async (row) => {
      // Limpiar datos nulos o undefined
      const cleanedRow = Object.fromEntries(
        Object.entries(row).filter(([key, value]) => value != null && value !== '')
      );
      
      const docData = {
        ...cleanedRow,
        originalSheet: sheetName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      return addDoc(subcollectionRef, docData);
    });

    await Promise.all(insertPromises);
    console.log(`${data.length} registros insertados en la hoja: ${sheetName}`);
  } catch (error) {
    console.error(`Error al insertar datos de la hoja ${sheetName}:`, error);
    throw error;
  }
};

export const getPropertyCounts = async (): Promise<{ active: number; inactive: number }> => {
  try {
    // Esta función se implementará cuando tengamos datos reales
    // Por ahora devolvemos 0 para mostrar "DATA NOT FOUND"
    return { active: 0, inactive: 0 };
  } catch (error) {
    console.error('Error al obtener conteos de propiedades:', error);
    return { active: 0, inactive: 0 };
  }
};
