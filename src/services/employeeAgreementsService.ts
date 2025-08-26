// src/services/employeeAgreementsService.ts

import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db, serverTimestamp } from "../lib/firebase"; // Asegúrate de que la ruta a tu archivo firebase.ts sea correcta

// --- Interfaz EmployeeAgreementRecord: Define la estructura de datos en el cliente ---
// Esta interfaz incluye todos los campos del formulario, más los campos de sistema de Firestore.
export interface EmployeeAgreementRecord {
  id: string; // ID del documento Firestore
  employeeName: string; // Nombre Empleado
  employeeLastName: string; // Apellidos Empleado
  workCenter: string; // ID del Centro de Trabajo
  city?: string; // Población (opcional)
  province?: string; // Provincia (opcional)
  autonomousCommunity?: string; // Comunidad Autónoma (opcional)
  responsibleName: string; // Nombre Responsable
  responsibleLastName: string; // Apellidos Responsable
  agreementConcepts: string; // Conceptos del Acuerdo (valor resuelto de la selección o campo 'Otro')
  economicAgreement1?: string; // Acuerdo Económico 1 (string para permitir formatos de dinero)
  concept1?: string; // Concepto 1
  economicAgreement2?: string; // Acuerdo Económico 2
  concept2?: string; // Concepto 2
  economicAgreement3?: string; // Acuerdo Económico 3
  concept3?: string; // Concepto 3
  activationDate?: Date; // Fecha de Activación, puede ser undefined si es null en DB
  endDate?: Date; // Fecha Fin, puede ser undefined si es null en DB
  observationsAndCommitment: string; // Observaciones y Compromiso

  // Campos de sistema (gestionados por Firestore)
  createdAt: Date; // Timestamp de creación en Firestore -> Date en cliente
  updatedAt: Date; // Timestamp de última actualización en Firestore -> Date en cliente
}

// Export type alias for compatibility with imports
export type EmployeeAgreementData = EmployeeAgreementRecord;

// --- Tipo para los datos que se enviarán directamente a Firestore ---
// Las fechas se convierten a Timestamp para Firestore.
export type EmployeeAgreementFirestorePayload = Omit<
  EmployeeAgreementRecord,
  'id' | 'activationDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  activationDate: Timestamp | null; // Para guardar en Firestore, puede ser null
  endDate: Timestamp | null; // Para guardar en Firestore, puede ser null
  createdAt?: any; // Para guardar en Firestore, opcional al crear/actualizar
  updatedAt?: any; // Para guardar en Firestore, opcional al crear/actualizar
};

// --- RUTA DE LA COLECCIÓN EN FIRESTORE (CORREGIDA) ---
// Colección "Gestión de Talento" -> Documento "Acuerdos con Empleado" -> Subcolección "acuerdos"
const getAgreementsCollectionRef = () => collection(db, "Gestión de Talento", "Acuerdos con Empleado", "acuerdos");

// --- FUNCIÓN para guardar un nuevo Acuerdo con Empleado ---
// Recibe los datos del formulario (donde las fechas son strings 'YYYY-MM-DD').
export const saveEmployeeAgreement = async (
  formData: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'activationDate' | 'endDate'> & {
    activationDate: string; // La fecha de activación viene como string del formulario
    endDate: string; // La fecha fin viene como string del formulario (puede ser vacía)
  }
): Promise<string> => {
  try {
    console.log('Guardando acuerdo con empleado (desde formulario):', formData);

    // Convertir las fechas de string a Timestamp (o null si están vacías/no definidas)
    const activationDateTimestamp = formData.activationDate
      ? Timestamp.fromDate(new Date(formData.activationDate))
      : null;
    const endDateTimestamp = formData.endDate
      ? Timestamp.fromDate(new Date(formData.endDate))
      : null;

    const payload: EmployeeAgreementFirestorePayload = {
      ...formData, // Incluye todos los campos de texto y selección resueltos
      activationDate: activationDateTimestamp,
      endDate: endDateTimestamp,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(getAgreementsCollectionRef(), payload);
    
    console.log('Acuerdo con empleado guardado con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar el acuerdo con empleado:', error);
    throw error;
  }
};

// --- FUNCIÓN para obtener todos los Acuerdos con Empleados ---
export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    const agreementRef = getAgreementsCollectionRef();
    const q = query(agreementRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const agreements: EmployeeAgreementRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      agreements.push({
        id: docSnap.id,
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
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : undefined,
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',
        
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      });
    });
    
    console.log('Acuerdos con empleados obtenidos:', agreements.length);
    return agreements;
  } catch (error) {
    console.error('Error al obtener acuerdos con empleados:', error);
    throw error;
  }
};

// --- FUNCIÓN para obtener un Acuerdo con Empleado por ID ---
export const getEmployeeAgreementById = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const docRef = doc(getAgreementsCollectionRef(), id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : undefined,
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',

        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener acuerdo con empleado:', error);
    throw error;
  }
};

// --- FUNCIÓN para actualizar un Acuerdo con Empleado existente ---
// Recibe un Partial de los datos del formulario (donde las fechas son strings 'YYYY-MM-DD' o undefined).
export const updateEmployeeAgreement = async (
  id: string,
  updateDataFromForm: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'activationDate' | 'endDate'>> & {
    activationDate?: string; // Permite string para la fecha de activación al actualizar
    endDate?: string; // Permite string para la fecha fin al actualizar
  }
): Promise<void> => {
  try {
    const docRef = doc(getAgreementsCollectionRef(), id);
    
    const updatePayload: { [key: string]: any } = { ...updateDataFromForm };

    // Convertir la fecha de activación de string a Timestamp si está presente en las actualizaciones
    if (updateDataFromForm.activationDate !== undefined) {
      updatePayload.activationDate = updateDataFromForm.activationDate
        ? Timestamp.fromDate(new Date(updateDataFromForm.activationDate))
        : null;
    }
    // Convertir la fecha fin de string a Timestamp si está presente en las actualizaciones
    if (updateDataFromForm.endDate !== undefined) {
      updatePayload.endDate = updateDataFromForm.endDate
        ? Timestamp.fromDate(new Date(updateDataFromForm.endDate))
        : null;
    }
    updatePayload.updatedAt = serverTimestamp(); // Actualizar la marca de tiempo de modificación

    await updateDoc(docRef, updatePayload);
    console.log('Acuerdo con empleado actualizado con ID:', id);
  } catch (error) {
    console.error('Error al actualizar acuerdo con empleado:', error);
    throw error;
  }
};

// --- FUNCIÓN para eliminar un Acuerdo con Empleado ---
export const deleteEmployeeAgreement = async (id: string): Promise<void> => {
  try {
    const docRef = doc(getAgreementsCollectionRef(), id);
    await deleteDoc(docRef);
    console.log('Acuerdo con empleado eliminado con ID:', id);
  } catch (error) {
    console.error('Error al eliminar acuerdo con empleado:', error);
    throw error;
  }
};

// --- FUNCIÓN para duplicar un Acuerdo con Empleado ---
export const duplicateEmployeeAgreement = async (id: string): Promise<string> => {
  try {
    const originalAgreement = await getEmployeeAgreementById(id);
    if (!originalAgreement) {
      throw new Error('Acuerdo con empleado no encontrado');
    }
    
    // Extraer datos, excluyendo ID y Timestamps de sistema
    const { id: _, createdAt, updatedAt, ...agreementData } = originalAgreement;

    // Crear un nuevo objeto con los datos duplicados, ajustando las fechas a string para el 'saveEmployeeAgreement'
    const duplicatedData = {
      ...agreementData,
      employeeName: `${agreementData.employeeName} (Copia)`,
      // Convertir Date a string para que saveEmployeeAgreement lo pueda procesar
      activationDate: agreementData.activationDate?.toISOString().split('T')[0] || '',
      endDate: agreementData.endDate?.toISOString().split('T')[0] || '',
    };
    
    return await saveEmployeeAgreement(duplicatedData); // Reutilizar la función de guardar
  } catch (error) {
    console.error('Error al duplicar acuerdo con empleado:', error);
    throw error;
  }
};

// --- FUNCIÓN para exportar Acuerdos con Empleados a CSV ---
export const exportEmployeeAgreementsToCSV = (agreements: EmployeeAgreementRecord[]): string => {
  if (agreements.length === 0) return '';

  // Actualizar los headers del CSV para reflejar los nuevos campos
  const headers = [
    'ID',
    'Nombre Empleado',
    'Apellidos Empleado',
    'Centro de Trabajo',
    'Población',
    'Provincia',
    'Comunidad Autónoma',
    'Nombre Responsable',
    'Apellidos Responsable',
    'Conceptos del Acuerdo',
    'Acuerdo Económico 1',
    'Concepto 1',
    'Acuerdo Económico 2',
    'Concepto 2',
    'Acuerdo Económico 3',
    'Concepto 3',
    'Fecha de Activación',
    'Fecha Fin',
    'Observaciones y Compromiso',
    'Fecha de Creación',
    'Última Actualización'
  ];

  const csvContent = [
    headers.map(header => `"${header.replace(/"/g, '""')}"`).join(','), // Asegura que los headers también se escapen
    ...agreements.map(agreement => [
      agreement.id,
      agreement.employeeName,
      agreement.employeeLastName,
      agreement.workCenter,
      agreement.city || '',
      agreement.province || '',
      agreement.autonomousCommunity || '',
      agreement.responsibleName,
      agreement.responsibleLastName,
      agreement.agreementConcepts,
      agreement.economicAgreement1 || '',
      agreement.concept1 || '',
      agreement.economicAgreement2 || '',
      agreement.concept2 || '',
      agreement.economicAgreement3 || '',
      agreement.concept3 || '',
      agreement.activationDate ? agreement.activationDate.toLocaleDateString('es-ES') : '',
      agreement.endDate ? agreement.endDate.toLocaleDateString('es-ES') : '',
      agreement.observationsAndCommitment,
      agreement.createdAt.toLocaleDateString('es-ES'),
      agreement.updatedAt.toLocaleDateString('es-ES')
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')) // Escapar comillas dobles en los datos y asegurar string
  ].join('\n');

  return csvContent;
};
