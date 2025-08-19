// src/services/workCentersService.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Asegúrate de que esta ruta a tu instancia de Firestore sea correcta

// Interfaz para un documento de centro de trabajo tal como viene de Firestore
// Asumo que cada documento en la subcolección 'CENTROS' tiene un campo 'nombre'.
export interface RawWorkCenterDoc {
  nombre: string;
  // Añade aquí cualquier otra propiedad que tus documentos de centro de trabajo tengan en Firestore
}

// Interfaz para el formato de los datos que WorkCenterOption (el hook) retornará y que tu Select espera
export interface WorkCenter {
  id: string; // Será el ID del documento de Firestore
  displayText: string; // Será la cadena "ID - Nombre"
}

/**
 * Obtiene los centros de trabajo de la subcolección 'CENTROS' en Firestore.
 * Concatena el ID del documento y el campo 'nombre' para el displayText.
 * @returns {Promise<WorkCenter[]>} Una promesa que resuelve a un array de WorkCenter.
 */
export const getWorkCenters = async (): Promise<WorkCenter[]> => {
  try {
    // Construye la referencia a la subcolección específica
    // 'Gestión de Talento' (colección) -> 'Centros de Trabajo' (documento) -> 'CENTROS' (subcolección)
    const centersCollectionRef = collection(db, "Gestión de Talento", "Centros de Trabajo", "CENTROS");
    
    const querySnapshot = await getDocs(centersCollectionRef);
    
    const centers: WorkCenter[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as RawWorkCenterDoc; // Castea los datos a tu interfaz FirestoreWorkCenter
      
      // Verifica que el campo 'nombre' exista en el documento de Firestore
      if (data.nombre) {
        centers.push({
          id: docSnap.id, // El ID real del documento de Firestore
          displayText: `${docSnap.id} - ${data.nombre}`, // Formato "ID - Nombre"
        });
      } else {
        console.warn(`Documento de centro de trabajo ${docSnap.id} no tiene el campo 'nombre'.`);
      }
    });
    
    return centers;
  } catch (error) {
    console.error('Error al cargar centros de trabajo desde Firestore:', error);
    // Vuelve a lanzar el error para que el hook pueda capturarlo y actualizar su estado de error
    throw new Error('No se pudieron cargar los centros de trabajo desde Firestore.');
  }
};