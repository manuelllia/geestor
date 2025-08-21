// src/services/workCentersService.ts

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Asegúrate que la ruta a 'db' es correcta

export interface WorkCenter {
  id: string; // El ID real del documento en Firestore
  name: string; // La cadena concatenada (ID - Nombre) para mostrar en el Select
  location?: string;
  description?: string;
}

export interface Contract {
  id: string; // El ID real del documento en Firestore
  name: string; // La cadena concatenada (ID - Nombre) para mostrar en el Select
}

// Estos console.log son para depuración y te ayudan a ver si 'db' está disponible
// y qué ruta se está intentando acceder.
console.log('Firebase db object (from workCentersService):', db); 
if (!db) {
    console.error('ERROR: db (Firestore) no está inicializado en workCentersService.ts al cargar el módulo.');
}

export const getWorkCenters = async (): Promise<WorkCenter[]> => {
  try {
    // *********************************************************************************
    // ¡¡¡IMPORTANTE!!! VERIFICA ESTA RUTA EN TU CONSOLA DE FIREBASE.
    // Los nombres de colecciones y documentos son CASE-SENSITIVE (sensibles a mayúsculas/minúsculas).
    // 'Centros De Trabajo' es diferente de 'Centros de Trabajo'.
    // 'CENTROS' es diferente de 'centros'.
    // La estructura DEBE ser: Colección 'Centros De Trabajo' -> Documento 'Centros' -> Subcolección 'CENTROS'
    // *********************************************************************************
    const workCentersRef = collection(db, 'Centros De Trabajo', 'Centros', 'CENTROS');
    
    console.log("Intentando obtener centros de trabajo desde la ruta:", workCentersRef.path);
    const snapshot = await getDocs(workCentersRef);
    
    // Estos console.log te mostrarán cuántos documentos se encontraron y su data bruta
    console.log("Número de documentos de centros de trabajo encontrados:", snapshot.docs.length);
    snapshot.docs.forEach(d => {
        console.log("Doc ID:", d.id, "Data:", d.data());
    });

    return snapshot.docs.map(doc => {
      // Obtiene el nombre del campo 'Nombre' o 'name' dentro del documento
      const docName = doc.data().Nombre || doc.data().name || 'Sin nombre';
      
      // Obtiene el ID real del documento de Firestore
      const docId = doc.id; 

      // Concatena el ID del documento con el nombre
      const combinedName = `${docId} - ${docName}`; 

      return {
        id: docId,       // 'id' del documento de Firestore (para el 'value' del SelectItem)
        name: combinedName, // La cadena 'ID - Nombre' (para lo que se muestra en el SelectItem)
        location: doc.data().location,
        description: doc.data().description
      };
    });
  } catch (error) {
    console.error('Error fetching work centers:', error);
    throw new Error('Error al obtener los centros de trabajo');
  }
};

export const getContracts = async (): Promise<Contract[]> => {
  try {
    // *********************************************************************************
    // ¡¡¡IMPORTANTE!!! Verifica también esta ruta para los contratos en Firebase.
    // Mismo principio de case-sensitivity.
    // *********************************************************************************
    const contractsRef = collection(db, 'Centros De Trabajo', 'Contratos', 'CONTRATOS');
    const snapshot = await getDocs(contractsRef);
    
    console.log("Número de documentos de contratos encontrados:", snapshot.docs.length);
    snapshot.docs.forEach(d => {
        console.log("Contrato ID:", d.id, "Data:", d.data());
    });

    return snapshot.docs.map(doc => {
        const docName = doc.data().Nombre || doc.data().name || 'Sin nombre';
        const docId = doc.id; 
        const combinedName = `${docId} - ${docName}`;

        return {
            id: docId,
            name: combinedName
        };
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw new Error('Error al obtener los contratos');
  }
};

export const getWorkCenterById = async (id: string): Promise<WorkCenter | null> => {
  try {
    // Nota: Esta ruta usa 'Centros de Trabajo' (con 'd' minúscula), mientras que arriba usas 'Centros De Trabajo' (con 'D' mayúscula).
    // ¡Esto podría causar que esta función no encuentre el documento si la colección real tiene 'd' minúscula!
    // Asegúrate de que la ruta aquí coincida EXACTAMENTE con la real.
    const workCenterRef = doc(db, 'Centros De Trabajo', 'Centros', 'CENTROS', id);
    const snapshot = await getDoc(workCenterRef);
    
    if (!snapshot.exists()) {
      console.log(`No se encontró el centro de trabajo con ID: ${id}`);
      return null;
    }
    
    console.log(`Centro de trabajo encontrado por ID ${id}:`, snapshot.data());

    return {
      id: snapshot.id,
      // Para un solo centro, normalmente solo querrías el nombre, no ID - Nombre,
      // a menos que sea el propósito específico de esta función también.
      name: snapshot.data().Nombre || snapshot.data().name || 'Sin nombre', 
      location: snapshot.data().location,
      description: snapshot.data().description
    };
  } catch (error) {
    console.error(`Error fetching work center by ID ${id}:`, error);
    throw new Error('Error al obtener el centro de trabajo por ID');
  }
};