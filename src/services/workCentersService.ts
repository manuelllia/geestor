// src/services/workCentersService.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // Asegúrate de que esta ruta a tu instancia de Firestore sea correcta

// Interfaz para un documento de centro de trabajo tal como viene de Firestore
export interface RawWorkCenterDoc {
  nombre: string; // El campo que contiene el nombre del centro
  // Si tienes un campo 'Id' en el documento, puedes incluirlo aquí también,
  // aunque ya usamos docSnap.id para el ID del documento.
  // id?: string; // Por ejemplo, si también guardas el ID dentro del documento
}

// Interfaz para el formato de los datos que WorkCenterOption (el hook) retornará y que tu Select espera
export interface WorkCenter {
  id: string; // Será el ID del documento de Firestore (ej. "01038")
  displayText: string; // Será la cadena "ID - Nombre" (ej. "01038 - AGS SUR DE SEVILLA")
}

/**
 * Obtiene los centros de trabajo de la subcolección 'CENTROS' en Firestore.
 * Concatena el ID del documento y el campo 'nombre' para el displayText.
 * @returns {Promise<WorkCenter[]>} Una promesa que resuelve a un array de WorkCenter.
 */
export const getWorkCenters = async (): Promise<WorkCenter[]> => {
  try {
    // CAMBIO CRÍTICO AQUÍ: Ajuste de la ruta de Firestore
    // Ruta: Colección "Centros De Trabajo" -> Documento "Centros" -> Subcolección "CENTROS"
    const centersCollectionRef = collection(db, "Centros De Trabajo", "Centros", "CENTROS");
    
    console.log("Intentando cargar centros de trabajo desde Firestore..."); // Log para depuración
    const querySnapshot = await getDocs(centersCollectionRef);
    console.log(`Se encontraron ${querySnapshot.size} documentos de centros de trabajo.`); // Log para depuración
    
    const centers: WorkCenter[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as RawWorkCenterDoc; 
      
      if (data.nombre) {
        centers.push({
          id: docSnap.id, 
          displayText: `${docSnap.id} - ${data.nombre}`, 
        });
      } else {
        console.warn(`Documento de centro de trabajo con ID ${docSnap.id} no tiene el campo 'nombre'. Se omitirá.`);
      }
    });
    
    return centers;
  } catch (error) {
    console.error('Error al cargar centros de trabajo desde Firestore:', error);
    // Vuelve a lanzar el error para que el hook pueda capturarlo y actualizar su estado de error
    throw new Error('No se pudieron cargar los centros de trabajo desde Firestore. Por favor, verifique la conexión y la ruta en Firestore.');
  }
};