
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface WorkCenter {
  id: string;
  numero?: string;
  nombre: string;
  displayText: string; // "00949 - AJUSTES CONTABLES" o solo "AJUSTES CONTABLES"
}

export const getWorkCenters = async (): Promise<WorkCenter[]> => {
  try {
    console.log('Obteniendo centros de trabajo desde Firestore...');
    
    // Referencia a la subcolección: Centros de Trabajo > CENTROS > CENTROS
    const workCentersRef = collection(db, "Centros de Trabajo", "CENTROS", "CENTROS");
    
    const querySnapshot = await getDocs(workCentersRef);
    
    const workCenters: WorkCenter[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const numero = data.numero || '';
      const nombre = data.nombre || '';
      
      // Crear el texto a mostrar
      let displayText = nombre;
      if (numero && numero.trim() !== '') {
        displayText = `${numero} - ${nombre}`;
      }
      
      workCenters.push({
        id: doc.id,
        numero,
        nombre,
        displayText,
      });
    });
    
    // Ordenar por número si existe, luego por nombre
    workCenters.sort((a, b) => {
      if (a.numero && b.numero) {
        return a.numero.localeCompare(b.numero);
      }
      if (a.numero && !b.numero) return -1;
      if (!a.numero && b.numero) return 1;
      return a.nombre.localeCompare(b.nombre);
    });
    
    console.log('Centros de trabajo obtenidos:', workCenters.length);
    return workCenters;
  } catch (error) {
    console.error('Error al obtener centros de trabajo:', error);
    throw error;
  }
};
