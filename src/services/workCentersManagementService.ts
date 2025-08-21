
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface WorkCenterData {
  Nombre: string;
  Id: string;
}

export interface ContractData {
  Nombre: string;
  Id: string;
}

// Servicios para Centros de Trabajo
export const checkWorkCenterExists = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "Centros De Trabajo", "Centros", "CENTROS", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking work center existence:', error);
    throw error;
  }
};

export const createWorkCenter = async (data: WorkCenterData): Promise<void> => {
  try {
    const docRef = doc(db, "Centros De Trabajo", "Centros", "CENTROS", data.Id);
    await setDoc(docRef, {
      Nombre: data.Nombre,
      Id: data.Id
    });
  } catch (error) {
    console.error('Error creating work center:', error);
    throw error;
  }
};

export const updateWorkCenter = async (data: WorkCenterData): Promise<void> => {
  try {
    const docRef = doc(db, "Centros De Trabajo", "Centros", "CENTROS", data.Id);
    await updateDoc(docRef, {
      Nombre: data.Nombre,
      Id: data.Id
    });
  } catch (error) {
    console.error('Error updating work center:', error);
    throw error;
  }
};

// Servicios para Contratos
export const checkContractExists = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "Centros De Trabajo", "Contratos", "CONTRATOS", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking contract existence:', error);
    throw error;
  }
};

export const createContract = async (data: ContractData): Promise<void> => {
  try {
    const docRef = doc(db, "Centros De Trabajo", "Contratos", "CONTRATOS", data.Id);
    await setDoc(docRef, {
      Nombre: data.Nombre,
      Id: data.Id
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

export const updateContract = async (data: ContractData): Promise<void> => {
  try {
    const docRef = doc(db, "Centros De Trabajo", "Contratos", "CONTRATOS", data.Id);
    await updateDoc(docRef, {
      Nombre: data.Nombre,
      Id: data.Id
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
};
