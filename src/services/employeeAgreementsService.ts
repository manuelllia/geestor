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
  createdAt: Date;
  updatedAt: Date;
}

export type EmployeeAgreementFirestorePayload = Omit<EmployeeAgreementRecord, 'id' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
  startDate: Timestamp | null;
  endDate: Timestamp | null;
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
  agreementData: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'> & {
    startDate?: string;
    endDate?: string;
  }
): Promise<string> => {
  try {
    const startDateTimestamp = agreementData.startDate ? Timestamp.fromDate(new Date(agreementData.startDate)) : null;
    const endDateTimestamp = agreementData.endDate ? Timestamp.fromDate(new Date(agreementData.endDate)) : null;

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
  agreementUpdates: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'>> & {
    startDate?: string;
    endDate?: string;
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
