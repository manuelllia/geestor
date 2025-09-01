import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CSVExporter } from "../utils/csvExporter";

export interface EmployeeAgreementRecord {
  id: string;
  employeeName: string;
  employeeLastName: string;
  agreementType: string;
  startDate?: Date;
  endDate?: Date;
  description: string;
  terms: string;
  status: 'Activo' | 'Inactivo';
  workCenter: string;
  supervisor: string;
  salary: string;
  benefits: string;
  observations: string;
  
  // Additional fields needed by forms
  city?: string;
  province?: string;
  autonomousCommunity?: string;
  responsibleName?: string;
  responsibleLastName?: string;
  agreementConcepts?: string;
  economicAgreement1?: string;
  concept1?: string;
  economicAgreement2?: string;
  concept2?: string;
  economicAgreement3?: string;
  concept3?: string;
  activationDate?: Date;
  observationsAndCommitment?: string;
  jobPosition?: string;
  department?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export type EmployeeAgreementFirestorePayload = Omit<EmployeeAgreementRecord, 'id' | 'startDate' | 'endDate' | 'activationDate' | 'createdAt' | 'updatedAt'> & {
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  activationDate: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const getEmployeeAgreementsCollectionRef = () => collection(db, "Gestión de Talento", "acuerdos-empleado", "Acuerdos de Empleado");

export const getEmployeeAgreementById = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const docRef = doc(getEmployeeAgreementsCollectionRef(), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        agreementType: data.agreementType || '',
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : undefined,
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        description: data.description || '',
        terms: data.terms || '',
        status: data.status || 'Inactivo',
        workCenter: data.workCenter || '',
        supervisor: data.supervisor || '',
        salary: data.salary || '',
        benefits: data.benefits || '',
        observations: data.observations || '',
        
        // Additional fields
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
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener acuerdo de empleado:', error);
    throw error;
  }
};

export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    console.log('Obteniendo acuerdos de empleado desde Firebase...');

    const q = query(getEmployeeAgreementsCollectionRef(), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const agreements: EmployeeAgreementRecord[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      agreements.push({
        id: docSnap.id,
        employeeName: data.employeeName || '',
        employeeLastName: data.employeeLastName || '',
        agreementType: data.agreementType || '',
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : undefined,
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        description: data.description || '',
        terms: data.terms || '',
        status: data.status || 'Inactivo',
        workCenter: data.workCenter || '',
        supervisor: data.supervisor || '',
        salary: data.salary || '',
        benefits: data.benefits || '',
        observations: data.observations || '',
        
        // Additional fields
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
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      });
    });

    console.log('Acuerdos de empleado obtenidos:', agreements.length);
    return agreements;
  } catch (error) {
    console.error('Error al obtener acuerdos de empleado:', error);
    throw error;
  }
};

export const saveEmployeeAgreement = async (
  agreementData: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'activationDate'> & {
    startDate?: string;
    endDate?: string;
    activationDate?: string;
  }
): Promise<string> => {
  try {
    const startDateTimestamp = agreementData.startDate ? Timestamp.fromDate(new Date(agreementData.startDate)) : null;
    const endDateTimestamp = agreementData.endDate ? Timestamp.fromDate(new Date(agreementData.endDate)) : null;
    const activationDateTimestamp = agreementData.activationDate ? Timestamp.fromDate(new Date(agreementData.activationDate)) : null;

    const payload: EmployeeAgreementFirestorePayload = {
      employeeName: agreementData.employeeName,
      employeeLastName: agreementData.employeeLastName,
      agreementType: agreementData.agreementType,
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
      description: agreementData.description,
      terms: agreementData.terms,
      status: agreementData.status,
      workCenter: agreementData.workCenter,
      supervisor: agreementData.supervisor,
      salary: agreementData.salary,
      benefits: agreementData.benefits,
      observations: agreementData.observations,
      
      // Additional fields
      city: agreementData.city,
      province: agreementData.province,
      autonomousCommunity: agreementData.autonomousCommunity,
      responsibleName: agreementData.responsibleName,
      responsibleLastName: agreementData.responsibleLastName,
      agreementConcepts: agreementData.agreementConcepts,
      economicAgreement1: agreementData.economicAgreement1,
      concept1: agreementData.concept1,
      economicAgreement2: agreementData.economicAgreement2,
      concept2: agreementData.concept2,
      economicAgreement3: agreementData.economicAgreement3,
      concept3: agreementData.concept3,
      activationDate: activationDateTimestamp,
      observationsAndCommitment: agreementData.observationsAndCommitment,
      jobPosition: agreementData.jobPosition,
      department: agreementData.department,
      
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(getEmployeeAgreementsCollectionRef(), payload);
    console.log('Acuerdo de empleado guardado exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar acuerdo de empleado:', error);
    throw error;
  }
};

export const updateEmployeeAgreement = async (
  id: string,
  agreementUpdates: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'activationDate'>> & {
    startDate?: string;
    endDate?: string;
    activationDate?: string;
  }
): Promise<void> => {
  try {
    const docRef = doc(getEmployeeAgreementsCollectionRef(), id);

    const updatePayload: { [key: string]: any } = { ...agreementUpdates };

    if (agreementUpdates.startDate !== undefined) {
      updatePayload.startDate = agreementUpdates.startDate ? Timestamp.fromDate(new Date(agreementUpdates.startDate)) : null;
    }
    if (agreementUpdates.endDate !== undefined) {
      updatePayload.endDate = agreementUpdates.endDate ? Timestamp.fromDate(new Date(agreementUpdates.endDate)) : null;
    }
    if (agreementUpdates.activationDate !== undefined) {
      updatePayload.activationDate = agreementUpdates.activationDate ? Timestamp.fromDate(new Date(agreementUpdates.activationDate)) : null;
    }
    updatePayload.updatedAt = Timestamp.now();

    await updateDoc(docRef, updatePayload);
    console.log('Acuerdo de empleado actualizado exitosamente:', id);
  } catch (error) {
    console.error('Error al actualizar acuerdo de empleado:', error);
    throw error;
  }
};

export const deleteEmployeeAgreement = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(getEmployeeAgreementsCollectionRef(), id));
    console.log('Acuerdo de empleado eliminado exitosamente:', id);
  } catch (error) {
    console.error('Error al eliminar acuerdo de empleado:', error);
    throw error;
  }
};

// --- Función para exportar Acuerdos de Empleado a CSV (ACTUALIZADA) ---
export const exportEmployeeAgreementsToCSV = async (): Promise<void> => {
  try {
    const agreements = await getEmployeeAgreements();
    
    if (agreements.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const headers = {
      id: 'ID',
      employeeName: 'Nombre del Empleado',
      employeeLastName: 'Apellidos del Empleado',
      agreementType: 'Tipo de Acuerdo',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      description: 'Descripción',
      terms: 'Términos',
      status: 'Estado',
      workCenter: 'Centro de Trabajo',
      supervisor: 'Supervisor',
      salary: 'Salario',
      benefits: 'Beneficios',
      observations: 'Observaciones',
      city: 'Ciudad',
      province: 'Provincia',
      autonomousCommunity: 'Comunidad Autónoma',
      responsibleName: 'Nombre Responsable',
      responsibleLastName: 'Apellidos Responsable',
      agreementConcepts: 'Conceptos Acuerdo',
      economicAgreement1: 'Acuerdo Económico 1',
      concept1: 'Concepto 1',
      economicAgreement2: 'Acuerdo Económico 2',
      concept2: 'Concepto 2',
      economicAgreement3: 'Acuerdo Económico 3',
      concept3: 'Concepto 3',
      activationDate: 'Fecha Activación',
      observationsAndCommitment: 'Observaciones y Compromisos',
      jobPosition: 'Puesto de Trabajo',
      department: 'Departamento',
      createdAt: 'Fecha de Creación',
      updatedAt: 'Última Actualización'
    };

    CSVExporter.exportToCSV(agreements, headers, {
      filename: 'acuerdos_empleado'
    });

    console.log('Acuerdos de empleado exportados correctamente');
  } catch (error) {
    console.error('Error al exportar acuerdos de empleado:', error);
    throw error;
  }
};
