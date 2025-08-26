
// src/services/employeeAgreementsService.ts

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, serverTimestamp } from '../lib/firebase';

export interface EmployeeAgreementRecord {
  id: string;
  employeeName: string;
  employeeLastName: string;
  workCenter: string;
  city: string;
  province: string;
  autonomousCommunity: string;
  responsibleName: string;
  responsibleLastName: string;
  agreementConcepts: string;
  economicAgreement1: string;
  concept1: string;
  economicAgreement2: string;
  concept2: string;
  economicAgreement3: string;
  concept3: string;
  activationDate: Date;
  endDate?: Date;
  observationsAndCommitment: string;
  // Campos originales que se mantienen para compatibilidad
  jobPosition: string;
  department: string;
  agreementType: string;
  startDate: Date;
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
  'id' | 'startDate' | 'endDate' | 'activationDate' | 'createdAt' | 'updatedAt'
> & {
  startDate: any;
  endDate?: any;
  activationDate: any;
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
        workCenter: data.workCenter || '',
        city: data.city || '',
        province: data.province || '',
        autonomousCommunity: data.autonomousCommunity || '',
        responsibleName: data.responsibleName || '',
        responsibleLastName: data.responsibleLastName || '',
        agreementConcepts: data.agreementConcepts || '',
        economicAgreement1: data.economicAgreement1 || '',
        concept1: data.concept1 || '',
        economicAgreement2: data.economicAgreement2 || '',
        concept2: data.concept2 || '',
        economicAgreement3: data.economicAgreement3 || '',
        concept3: data.concept3 || '',
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : new Date(),
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',
        // Campos originales para compatibilidad
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        agreementType: data.agreementType || '',
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(),
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
  agreementData: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'activationDate'> & {
    startDate: string;
    endDate?: string;
    activationDate: string;
  }
): Promise<string> => {
  try {
    const startDateTimestamp = Timestamp.fromDate(new Date(agreementData.startDate));
    const endDateTimestamp = agreementData.endDate 
      ? Timestamp.fromDate(new Date(agreementData.endDate))
      : null;
    const activationDateTimestamp = Timestamp.fromDate(new Date(agreementData.activationDate));

    const payload: EmployeeAgreementFirestorePayload = {
      ...agreementData,
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
      activationDate: activationDateTimestamp,
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
  updates: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'activationDate'>> & {
    startDate?: string;
    endDate?: string;
    activationDate?: string;
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
    if (updates.activationDate) {
      updatePayload.activationDate = Timestamp.fromDate(new Date(updates.activationDate));
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

export const duplicateEmployeeAgreement = async (id: string): Promise<string> => {
  try {
    const agreements = await getEmployeeAgreements();
    const originalAgreement = agreements.find(agreement => agreement.id === id);
    
    if (!originalAgreement) {
      throw new Error('Acuerdo no encontrado');
    }

    // Crear una copia sin el id y actualizando las fechas
    const duplicatedData = {
      ...originalAgreement,
      startDate: new Date().toISOString(),
      activationDate: new Date().toISOString(),
      endDate: originalAgreement.endDate ? new Date(originalAgreement.endDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
    };

    // Remover campos que no deben duplicarse
    delete (duplicatedData as any).id;
    delete (duplicatedData as any).createdAt;
    delete (duplicatedData as any).updatedAt;

    return await saveEmployeeAgreement(duplicatedData);
  } catch (error) {
    console.error('Error al duplicar acuerdo de empleado:', error);
    throw error;
  }
};
