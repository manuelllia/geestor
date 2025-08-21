
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface WorkCenter {
  id: string;
  name: string;
  location?: string;
  description?: string;
}

export interface Contract {
  id: string;
  name: string;
}

export const getWorkCenters = async (): Promise<WorkCenter[]> => {
  try {
    const workCentersRef = collection(db, 'Centros de Trabajo', 'Centros', 'CENTROS');
    console.log("Intentando obtener centros de trabajo desde:", workCentersRef.path);
    const snapshot = await getDocs(workCentersRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().Nombre || doc.data().name || 'Sin nombre',
      location: doc.data().location,
      description: doc.data().description
    }));
  } catch (error) {
    console.error('Error fetching work centers:', error);
    throw new Error('Error al obtener los centros de trabajo');
  }
};

export const getContracts = async (): Promise<Contract[]> => {
  try {
    const contractsRef = collection(db, 'Centros de Trabajo', 'Contratos', 'CONTRATOS');
    const snapshot = await getDocs(contractsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().Nombre || doc.data().name || 'Sin nombre'
    }));
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw new Error('Error al obtener los contratos');
  }
};

export const getWorkCenterById = async (id: string): Promise<WorkCenter | null> => {
  try {
    const workCenterRef = doc(db, 'Centros de Trabajo', 'Centros', 'CENTROS', id);
    const snapshot = await getDoc(workCenterRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.id,
      name: snapshot.data().Nombre || snapshot.data().name || 'Sin nombre',
      location: snapshot.data().location,
      description: snapshot.data().description
    };
  } catch (error) {
    console.error('Error fetching work center:', error);
    throw new Error('Error al obtener el centro de trabajo');
  }
};
