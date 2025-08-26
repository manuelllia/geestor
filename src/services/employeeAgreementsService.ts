// src/services/employeeAgreementsService.ts

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, serverTimestamp } from '../lib/firebase';

export interface EmployeeAgreementRecord {
  id: string;
  employeeName: string;
  employeeLastName: string;
  jobPosition: string;
  department: string;
  agreementType: string;
  startDate: Date;
  endDate?: Date;
  salary: string;
  status: 'Activo' | 'Finalizado' | 'Suspendido';
  observations: string;
  createdAt: Date;
  updatedAt: Date;
}

// Export type alias for compatibility
export type EmployeeAgreementData = EmployeeAgreementRecord;

// Tipo para los datos que se enviarán a Firestore
type EmployeeAgreementFirestorePayload = Omit<
  EmployeeAgreementRecord,
  'id' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  startDate: any; // Para Firestore Timestamp o serverTimestamp
  endDate?: any; // Para Firestore Timestamp o null
  createdAt?: any;
  updatedAt?: any;
};

const getEmployeeAgreementsCollectionRef = () => 
  collection(db, "Gestión de Talento", "Acuerdos de Empleados", "acuerdos");

export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    const q = query(getEmployeeAgreementsCollectionRef(), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        agreementType: data.agreementType || '',
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(),
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        salary: data.salary || '',
        status: data.status || 'Activo',
        observations: data.observations || '',
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      };
    });
  } catch (error) {
    console.error('Error al obtener acuerdos de empleados:', error);
    throw error;
  }
};

export const saveEmployeeAgreement = async (
  agreementData: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'> & {
    startDate: string;
    endDate?: string;
  }
): Promise<string> => {
  try {
    const startDateTimestamp = Timestamp.fromDate(new Date(agreementData.startDate));
    const endDateTimestamp = agreementData.endDate 
      ? Timestamp.fromDate(new Date(agreementData.endDate))
      : null;

    const payload: EmployeeAgreementFirestorePayload = {
      ...agreementData,
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(getEmployeeAgreementsCollectionRef(), payload);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar acuerdo de empleado:', error);
    throw error;
  }
};

export const updateEmployeeAgreement = async (
  id: string,
  updates: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'>> & {
    startDate?: string;
    endDate?: string;
  }
): Promise<void> => {
  try {
    const docRef = doc(getEmployeeAgreementsCollectionRef(), id);
    const updatePayload: Partial<EmployeeAgreementFirestorePayload> = { ...updates };

    if (updates.startDate) {
      updatePayload.startDate = Timestamp.fromDate(new Date(updates.startDate));
    }
    if (updates.endDate) {
      updatePayload.endDate = updates.endDate ? Timestamp.fromDate(new Date(updates.endDate)) : null;
    }
    updatePayload.updatedAt = serverTimestamp();

    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.error('Error al actualizar acuerdo de empleado:', error);
    throw error;
  }
};

export const deleteEmployeeAgreement = async (id: string): Promise<void> => {
  try {
    const docRef = doc(getEmployeeAgreementsCollectionRef(), id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar acuerdo de empleado:', error);
    throw error;
  }
};
