// src/services/employeeAgreementsService.ts

import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy, Timestamp, getDoc, serverTimestamp as firebaseServerTimestamp } from 'firebase/firestore';
import { db, serverTimestamp } from '../lib/firebase';

// --- Interfaz EmployeeAgreementRecord: Define la estructura de datos en el cliente ---
export interface EmployeeAgreementRecord {
  id: string; // ID del documento Firestore
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
  // Campos requeridos para compatibilidad
  jobPosition: string;
  department: string;
  agreementType: string;
  startDate: Date;
  salary: string;
  status: 'Activo' | 'Finalizado' | 'Suspendido';
  observations: string;

  // Campos de sistema (gestionados por Firestore)
  createdAt: Date; // Timestamp de creación en Firestore -> Date en cliente
  updatedAt: Date; // Timestamp de última actualización en Firestore -> Date en cliente

  // Campos adicionales que pueden existir en Firestore pero no vienen directamente del formulario
  createdByUserId?: string; // ID del usuario que creó la solicitud
  pdfAgreement?: string; // URL o referencia a PDF del acuerdo
  notes?: string; // Notas adicionales
  approved?: boolean; // Booleano para aprobación
}

// Export type aliases for compatibility with imports
export type EmployeeAgreementData = EmployeeAgreementRecord;
export type EmployeeAgreementInput = Partial<EmployeeAgreementRecord>;

// --- Tipo para los datos que se enviarán directamente a Firestore ---
// Las fechas se convierten a Timestamp para Firestore.
export type EmployeeAgreementFirestorePayload = Omit<
  EmployeeAgreementRecord,
  'id' | 'activationDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'startDate'
> & {
  activationDate: any; // Para guardar en Firestore, será un Timestamp
  endDate: any; // Para guardar en Firestore, puede ser Timestamp o null
  createdAt?: any; // Para guardar en Firestore, opcional al crear/actualizar
  updatedAt?: any; // Para guardar en Firestore, opcional al crear/actualizar
  startDate: any; // Para guardar en Firestore, será un Timestamp
};

// --- RUTA DE LA COLECCIÓN EN FIRESTORE (CORREGIDA) ---
// Colección "Gestión de Talento" -> Documento "Acuerdos Empleados" -> Subcolección "acuerdos"
const getEmployeeAgreementsCollectionRef = () => collection(db, "Gestión de Talento", "Acuerdos de Empleados", "acuerdos");

// --- FUNCIÓN para obtener un Acuerdo con Empleado por ID ---
export const getEmployeeAgreementById = async (id: string): Promise<EmployeeAgreementRecord | null> => {
  try {
    const docRef = doc(getEmployeeAgreementsCollectionRef(), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Validar y tipar correctamente los campos de tipo literal
      const status: 'Activo' | 'Finalizado' | 'Suspendido' = (data.status === 'Activo' || data.status === 'Finalizado' || data.status === 'Suspendido') ? data.status : 'Activo';

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
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : new Date(),
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',
        // Campos requeridos para compatibilidad
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        agreementType: data.agreementType || '',
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(),
        salary: data.salary || '',
        status: status,
        observations: data.observations || '',

        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),

        createdByUserId: data.createdByUserId || undefined,
        pdfAgreement: data.pdfAgreement || undefined,
        notes: data.notes || undefined,
        approved: typeof data.approved === 'boolean' ? data.approved : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener acuerdo con empleado por ID:', error);
    throw error;
  }
};

// --- FUNCIÓN para obtener todos los Acuerdos con Empleados ---
export const getEmployeeAgreements = async (): Promise<EmployeeAgreementRecord[]> => {
  try {
    console.log('Obteniendo acuerdos con empleados desde Firebase...');

    const q = query(getEmployeeAgreementsCollectionRef(), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const agreements: EmployeeAgreementRecord[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Validar y tipar correctamente los campos de tipo literal
      const status: 'Activo' | 'Finalizado' | 'Suspendido' = (data.status === 'Activo' || data.status === 'Finalizado' || data.status === 'Suspendido') ? data.status : 'Activo';

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
        activationDate: data.activationDate instanceof Timestamp ? data.activationDate.toDate() : new Date(),
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
        observationsAndCommitment: data.observationsAndCommitment || '',
        // Campos requeridos para compatibilidad
        jobPosition: data.jobPosition || '',
        department: data.department || '',
        agreementType: data.agreementType || '',
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(),
        salary: data.salary || '',
        status: status,
        observations: data.observations || '',

        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),

        createdByUserId: data.createdByUserId || undefined,
        pdfAgreement: data.pdfAgreement || undefined,
        notes: data.notes || undefined,
        approved: typeof data.approved === 'boolean' ? data.approved : undefined,
      });
    });

    console.log('Acuerdos con empleados obtenidos:', agreements.length);
    return agreements;
  } catch (error) {
    console.error('Error al obtener acuerdos con empleados:', error);
    throw error;
  }
};

export const saveEmployeeAgreement = async (
  agreementDataFromForm: Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'activationDate' | 'endDate' | 'startDate'> & {
    activationDate: string; // La fecha de activación viene como string del formulario
    endDate?: string; // La fecha de finalización viene como string del formulario
    startDate: string; // La fecha de inicio viene como string del formulario
  }
): Promise<string> => {
  try {
    // Convertir las fechas de string a Timestamp
    const activationDateTimestamp = Timestamp.fromDate(new Date(agreementDataFromForm.activationDate));
    const endDateTimestamp = agreementDataFromForm.endDate ? Timestamp.fromDate(new Date(agreementDataFromForm.endDate)) : null;
    const startDateTimestamp = Timestamp.fromDate(new Date(agreementDataFromForm.startDate));

    const payload: EmployeeAgreementFirestorePayload = {
      ...agreementDataFromForm,
      activationDate: activationDateTimestamp,
      endDate: endDateTimestamp,
      startDate: startDateTimestamp,
      status: 'Activo', // Add default status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(getEmployeeAgreementsCollectionRef(), payload);
    console.log('Acuerdo con empleado guardado exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar acuerdo con empleado:', error);
    throw error;
  }
};

export const duplicateEmployeeAgreement = async (agreementId: string): Promise<string> => {
  try {
    const originalAgreement = await getEmployeeAgreementById(agreementId);
    if (!originalAgreement) {
      throw new Error('Acuerdo no encontrado');
    }

    const duplicatedData: EmployeeAgreementFirestorePayload = {
      employeeName: originalAgreement.employeeName + ' (Copia)',
      employeeLastName: originalAgreement.employeeLastName,
      workCenter: originalAgreement.workCenter,
      city: originalAgreement.city,
      province: originalAgreement.province,
      autonomousCommunity: originalAgreement.autonomousCommunity,
      responsibleName: originalAgreement.responsibleName,
      responsibleLastName: originalAgreement.responsibleLastName,
      agreementConcepts: originalAgreement.agreementConcepts,
      economicAgreement1: originalAgreement.economicAgreement1,
      concept1: originalAgreement.concept1,
      economicAgreement2: originalAgreement.economicAgreement2,
      concept2: originalAgreement.concept2,
      economicAgreement3: originalAgreement.economicAgreement3,
      concept3: originalAgreement.concept3,
      activationDate: Timestamp.fromDate(originalAgreement.activationDate),
      endDate: originalAgreement.endDate ? Timestamp.fromDate(originalAgreement.endDate) : null,
      observationsAndCommitment: originalAgreement.observationsAndCommitment,
      jobPosition: originalAgreement.jobPosition,
      department: originalAgreement.department,
      agreementType: originalAgreement.agreementType,
      startDate: Timestamp.fromDate(originalAgreement.startDate),
      salary: originalAgreement.salary,
      status: originalAgreement.status,
      observations: originalAgreement.observations,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByUserId: originalAgreement.createdByUserId,
      pdfAgreement: originalAgreement.pdfAgreement,
      notes: originalAgreement.notes,
      approved: originalAgreement.approved,
    };
    
    const docRef = await addDoc(getEmployeeAgreementsCollectionRef(), duplicatedData);
    console.log('Acuerdo con empleado duplicado exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al duplicar acuerdo con empleado:', error);
    throw error;
  }
};

export const updateEmployeeAgreement = async (
  id: string,
  agreementUpdates: Partial<Omit<EmployeeAgreementRecord, 'id' | 'createdAt' | 'updatedAt' | 'activationDate' | 'endDate' | 'startDate'>> & {
    activationDate?: string; // Permite string para la fecha de activación al actualizar
    endDate?: string; // Permite string para la fecha de finalización al actualizar
    startDate?: string; // Permite string para la fecha de inicio al actualizar
  }
): Promise<void> => {
  try {
    const docRef = doc(getEmployeeAgreementsCollectionRef(), id);

    const updatePayload: { [key: string]: any } = { ...agreementUpdates };

    // Convertir las fechas de string a Timestamp si están presentes en las actualizaciones
    if (agreementUpdates.activationDate !== undefined) {
      updatePayload.activationDate = agreementUpdates.activationDate
        ? Timestamp.fromDate(new Date(agreementUpdates.activationDate))
        : null;
    }
    if (agreementUpdates.endDate !== undefined) {
      updatePayload.endDate = agreementUpdates.endDate
        ? Timestamp.fromDate(new Date(agreementUpdates.endDate))
        : null;
    }
     if (agreementUpdates.startDate !== undefined) {
      updatePayload.startDate = agreementUpdates.startDate
        ? Timestamp.fromDate(new Date(agreementUpdates.startDate))
        : null;
    }

    updatePayload.updatedAt = serverTimestamp(); // Actualizar la marca de tiempo de modificación

    await updateDoc(docRef, updatePayload);
    console.log('Acuerdo con empleado actualizado exitosamente:', id);
  } catch (error) {
    console.error('Error al actualizar acuerdo con empleado:', error);
    throw error;
  }
};

export const deleteEmployeeAgreement = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(getEmployeeAgreementsCollectionRef(), id));
    console.log('Acuerdo con empleado eliminado exitosamente:', id);
  } catch (error) {
    console.error('Error al eliminar acuerdo con empleado:', error);
    throw error;
  }
};

export const importEmployeeAgreements = async (agreements: Partial<EmployeeAgreementRecord>[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };

  for (let i = 0; i < agreements.length; i++) {
    try {
      const agreement = agreements[i];

      // Validar campos requeridos mínimos
      if (!agreement.employeeName && !agreement.workCenter) {
        results.errors.push(`Fila ${i + 2}: Faltan datos mínimos requeridos`);
        continue;
      }

      // Convertir fechas a Timestamp si existen
      const activationDateTimestamp = agreement.activationDate
        ? Timestamp.fromDate(agreement.activationDate instanceof Date ? agreement.activationDate : new Date(agreement.activationDate))
        : null;
      const endDateTimestamp = agreement.endDate
        ? Timestamp.fromDate(agreement.endDate instanceof Date ? agreement.endDate : new Date(agreement.endDate))
        : null;
      const startDateTimestamp = agreement.startDate
        ? Timestamp.fromDate(agreement.startDate instanceof Date ? agreement.startDate : new Date(agreement.startDate))
        : null;

      const payload: EmployeeAgreementFirestorePayload = {
        employeeName: agreement.employeeName || '',
        employeeLastName: agreement.employeeLastName || '',
        workCenter: agreement.workCenter || '',
        city: agreement.city || '',
        province: agreement.province || '',
        autonomousCommunity: agreement.autonomousCommunity || '',
        responsibleName: agreement.responsibleName || '',
        responsibleLastName: agreement.responsibleLastName || '',
        agreementConcepts: agreement.agreementConcepts || '',
        economicAgreement1: agreement.economicAgreement1 || '',
        concept1: agreement.concept1 || '',
        economicAgreement2: agreement.economicAgreement2 || '',
        concept2: agreement.concept2 || '',
        economicAgreement3: agreement.economicAgreement3 || '',
        concept3: agreement.concept3 || '',
        activationDate: activationDateTimestamp,
        endDate: endDateTimestamp,
        observationsAndCommitment: agreement.observationsAndCommitment || '',
        // Campos requeridos para compatibilidad
        jobPosition: agreement.jobPosition || '',
        department: agreement.department || '',
        agreementType: agreement.agreementType || '',
        startDate: startDateTimestamp,
        salary: agreement.salary || '',
        status: (agreement.status === 'Activo' || agreement.status === 'Finalizado' || agreement.status === 'Suspendido') ? agreement.status : 'Activo',
        observations: agreement.observations || '',

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByUserId: agreement.createdByUserId,
        pdfAgreement: agreement.pdfAgreement,
        notes: agreement.notes,
        approved: agreement.approved,
      };

      await addDoc(getEmployeeAgreementsCollectionRef(), payload);
      results.success++;

    } catch (error) {
      console.error(`Error importing agreement ${i + 1}:`, error);
      results.errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  return results;
};
