
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface EmployeeAgreementData {
  employeeName: string;
  employeeLastName: string;
  position: string;
  department: string;
  agreementType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  salary: string;
  benefits: string[];
  conditions: string;
  observations: string;
}

export interface EmployeeAgreementRecord extends EmployeeAgreementData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_PATH = "Gestión de Talento/acuerdos-empleados/Acuerdos con empleados";

export const saveEmployeeAgreement = async (data: EmployeeAgreementData): Promise<string> => {
  try {
    console.log('Guardando acuerdo con empleado:', data);
    
    const agreementRef = collection(db, COLLECTION_PATH);
    
    const docData = {
      ...data,
      startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
      endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(agreementRef, docData);
    
    console.log('Acuerdo con empleado guardado con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar el acuerdo con empleado:', error);
    throw error;
  }
};

export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    const agreementRef = collection(db, COLLECTION_PATH);
    const q = query(agreementRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const agreements: EmployeeAgreementRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      agreements.push({
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate() || undefined,
        endDate: data.endDate?.toDate() || undefined,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as EmployeeAgreementRecord);
    });
    
    return agreements;
  } catch (error) {
    console.error('Error al obtener acuerdos con empleados:', error);
    throw error;
  }
};

export const getEmployeeAgreementById = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        startDate: data.startDate?.toDate() || undefined,
        endDate: data.endDate?.toDate() || undefined,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as EmployeeAgreementRecord;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener acuerdo con empleado:', error);
    throw error;
  }
};

export const updateEmployeeAgreement = async (id: string, data: Partial<EmployeeAgreementData>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    const updateData = {
      ...data,
      startDate: data.startDate ? Timestamp.fromDate(data.startDate) : undefined,
      endDate: data.endDate ? Timestamp.fromDate(data.endDate) : undefined,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
    console.log('Acuerdo con empleado actualizado con ID:', id);
  } catch (error) {
    console.error('Error al actualizar acuerdo con empleado:', error);
    throw error;
  }
};

export const deleteEmployeeAgreement = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    await deleteDoc(docRef);
    console.log('Acuerdo con empleado eliminado con ID:', id);
  } catch (error) {
    console.error('Error al eliminar acuerdo con empleado:', error);
    throw error;
  }
};

export const duplicateEmployeeAgreement = async (id: string): Promise<string> => {
  try {
    const originalAgreement = await getEmployeeAgreementById(id);
    if (!originalAgreement) {
      throw new Error('Acuerdo con empleado no encontrado');
    }
    
    const { id: _, createdAt, updatedAt, ...agreementData } = originalAgreement;
    const duplicatedData = {
      ...agreementData,
      employeeName: `${agreementData.employeeName} (Copia)`,
    };
    
    return await saveEmployeeAgreement(duplicatedData);
  } catch (error) {
    console.error('Error al duplicar acuerdo con empleado:', error);
    throw error;
  }
};

export const exportEmployeeAgreementsToCSV = (agreements: EmployeeAgreementRecord[]): string => {
  if (agreements.length === 0) return '';

  const headers = [
    'ID',
    'Nombre Empleado',
    'Apellidos Empleado',
    'Puesto',
    'Departamento',
    'Tipo de Acuerdo',
    'Fecha Inicio',
    'Fecha Fin',
    'Salario',
    'Beneficios',
    'Condiciones',
    'Observaciones',
    'Fecha de Creación',
    'Última Actualización'
  ];

  const csvContent = [
    headers.join(','),
    ...agreements.map(agreement => [
      agreement.id,
      `"${agreement.employeeName}"`,
      `"${agreement.employeeLastName}"`,
      `"${agreement.position}"`,
      `"${agreement.department}"`,
      `"${agreement.agreementType}"`,
      agreement.startDate ? agreement.startDate.toLocaleDateString('es-ES') : '',
      agreement.endDate ? agreement.endDate.toLocaleDateString('es-ES') : '',
      `"${agreement.salary}"`,
      `"${agreement.benefits.join('; ')}"`,
      `"${agreement.conditions}"`,
      `"${agreement.observations}"`,
      agreement.createdAt.toLocaleDateString('es-ES'),
      agreement.updatedAt.toLocaleDateString('es-ES')
    ].join(','))
  ].join('\n');

  return csvContent;
};
