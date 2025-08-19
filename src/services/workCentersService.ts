// src/services/workCentersService.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Asegúrate de que esta ruta a tu instancia de Firestore sea correcta

// Interfaz para un documento de centro de trabajo tal como viene de Firestore
// CAMBIO CRÍTICO AQUÍ: 'Nombre' con 'N' mayúscula
export interface RawWorkCenterDoc {
  Nombre: string; // El campo que contiene el nombre del centro es 'Nombre'
}

// Interfaz para el formato de los datos que WorkCenter (el hook) retornará y que tu Select espera
export interface WorkCenter {
  id: string; // Será el ID del documento de Firestore (ej. "01038")
  displayText: string; // Será la cadena "ID - Nombre" (ej. "01038 - AGS SUR DE SEVILLA")
}

/**
 * Obtiene los centros de trabajo de la subcolección 'CENTROS' en Firestore.
 * Concatena el ID del documento y el campo 'Nombre' para el displayText.
 * @returns {Promise<WorkCenter[]>} Una promesa que resuelve a un array de WorkCenter.
 */
export const getWorkCenters = async (): Promise<WorkCenter[]> => {
  try {
    // Ruta: Colección "Centros De Trabajo" -> Documento "Centros" -> Subcolección "CENTROS"
    const centersCollectionRef = collection(db, "Centros De Trabajo", "Centros", "CENTROS");
    
    console.log("Intentando cargar centros de trabajo desde Firestore..."); 
    const querySnapshot = await getDocs(centersCollectionRef);
    console.log(`Se encontraron ${querySnapshot.size} documentos de centros de trabajo.`);
    
    const centers: WorkCenter[] = [];
    querySnapshot.forEach((docSnap) => {
      // CAMBIO CRÍTICO AQUÍ: Castea los datos usando 'Nombre'
      const data = docSnap.data() as RawWorkCenterDoc; 
      
      // Verifica que el campo 'Nombre' exista en el documento de Firestore
      // CAMBIO CRÍTICO AQUÍ: Accede a 'data.Nombre'
      if (data.Nombre) { 
        centers.push({
          id: docSnap.id, 
          // CAMBIO CRÍTICO AQUÍ: Usa 'data.Nombre'
          displayText: `${docSnap.id} - ${data.Nombre}`, 
        });
      } else {
        // CAMBIO CRÍTICO AQUÍ: Mensaje de advertencia actualizado
        console.warn(`Documento de centro de trabajo con ID ${docSnap.id} no tiene el campo 'Nombre'. Se omitirá.`);
      }
    });
    
    return centers;
  } catch (error) {
    console.error('Error al cargar centros de trabajo desde Firestore:', error);
    throw new Error('No se pudieron cargar los centros de trabajo desde Firestore. Por favor, verifique la conexión y la ruta/nombres de campo en Firestore.');
  }
};