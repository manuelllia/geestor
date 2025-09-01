// src/services/contractRequestsService.ts

import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { db, serverTimestamp } from '../lib/firebase';

// --- Interfaz ContractRequestRecord: Define la estructura de datos en el cliente ---
export interface ContractRequestRecord {
  id: string; // ID del documento Firestore
  requesterName: string; // Nombre Solicitante
  requesterLastName: string; // Apellidos Solicitante
  contractType: string; // Tipo de Contrato
  salary: string; // Salario (string para flexibilidad: "30.000 €", "Negociable")
  observations: string; // Observaciones Generales
  incorporationDate?: Date; // Fecha de Incorporación, puede ser undefined si es null en DB
  company: string; // Empresa (valor resuelto, ej. "ASIME SA" o el texto de "OTRA")
  jobPosition: string; // Puesto de Trabajo (valor resuelto)
  professionalCategory: string; // Categoría Profesional (valor resuelto)
  city: string; // Población
  province: string; // Provincia
  autonomousCommunity: string; // Comunidad Autónoma
  workCenter: string; // ID del Centro de Trabajo (string)
  companyFlat: 'Si' | 'No'; // Piso de Empresa
  language1?: string; // Idioma 1 (valor resuelto, puede ser undefined si no se selecciona)
  level1?: string; // Nivel 1
  language2?: string; // Idioma 2 (valor resuelto)
  level2?: string; // Nivel 2
  experienceElectromedicine?: string; // Experiencia Previa en Electromedicina
  experienceInstallations?: string; // Experiencia Previa en Instalaciones
  hiringReason: string; // Motivo de la Contratación
  notesAndCommitments: string; // Observaciones y/o compromisos

  // Campos de sistema (gestionados por Firestore)
  status: 'Pendiente' | 'Aprobado' | 'Rechazado'; // Estado de la solicitud
  requestDate: Date; // Fecha en que se creó la solicitud en el sistema (Timestamp Firestore -> Date en cliente)
  createdAt: Date; // Timestamp de creación en Firestore -> Date en cliente
  updatedAt: Date; // Timestamp de última actualización en Firestore -> Date en cliente

  // Campos adicionales que pueden existir en Firestore pero no vienen directamente del formulario
  createdByUserId?: string; // ID del usuario que creó la solicitud
  pdfSolicitation?: string; // URL o referencia a PDF de la solicitud
  selectedCandidate?: string; // Nombre del candidato seleccionado (si aplica)
  approved?: boolean; // Booleano para aprobación (podría ser redundante con status, pero se mantiene si existe)
}

// Export type aliases for compatibility with imports
export type ContractRequestData = ContractRequestRecord;
export type ContractRequestInput = Partial<ContractRequestRecord>;
export type ContractRequest = ContractRequestRecord;

// --- Tipo para los datos que se enviarán directamente a Firestore ---
// Las fechas se convierten a Timestamp para Firestore.
export type ContractRequestFirestorePayload = Omit<
  ContractRequestRecord,
  'id' | 'requestDate' | 'incorporationDate' | 'createdAt' | 'updatedAt'
> & {
  requestDate: any; // Para guardar en Firestore, será un serverTimestamp al crear
  incorporationDate: any; // Para guardar en Firestore, puede ser Timestamp o null
  createdAt?: any; // Para guardar en Firestore, opcional al crear/actualizar
  updatedAt?: any; // Para guardar en Firestore, opcional al crear/actualizar
};

// --- RUTA DE LA COLECCIÓN EN FIRESTORE (CORREGIDA) ---
// Colección "Gestión de Talento" -> Documento "Solicitudes Contratación" -> Subcolección "solicitudes"
const getContractRequestsCollectionRef = () => collection(db, "Gestión de Talento", "Solicitudes Contratación", "solicitudes");

// --- FUNCIÓN para obtener una Solicitud de Contratación por ID ---
export const getContractRequestById = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const docRef = doc(getContractRequestsCollectionRef(), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Validar y tipar correctamente los campos de tipo literal
      const companyFlat: 'Si' | 'No' = (data.companyFlat === 'Si' || data.companyFlat === 'No') ? data.companyFlat : 'No';
      const status: 'Pendiente' | 'Aprobado' | 'Rechazado' = (data.status === 'Pendiente' || data.status === 'Aprobado' || data.status === 'Rechazado') ? data.status : 'Pendiente';

      return {
        id: docSnap.id,
        requesterName: data.requesterName || '',
        requesterLastName: data.requesterLastName || '',
        contractType: data.contractType || '',
        salary: data.salary || '',
        observations: data.observations || '',
        incorporationDate: data.incorporationDate instanceof Timestamp ? data.incorporationDate.toDate() : undefined,
        company: data.company || '',
        jobPosition: data.jobPosition || '',
        professionalCategory: data.professionalCategory || '',
        city: data.city || '',
        province: data.province || '',
        autonomousCommunity: data.autonomousCommunity || '',
        workCenter: data.workCenter || '',
        companyFlat: companyFlat,
        language1: data.language1 || '',
        level1: data.level1 || '',
        language2: data.language2 || '',
        level2: data.level2 || '',
        experienceElectromedicine: data.experienceElectromedicine || '',
        experienceInstallations: data.experienceInstallations || '',
        hiringReason: data.hiringReason || '',
        notesAndCommitments: data.notesAndCommitments || '',
        
        status: status,
        requestDate: data.requestDate instanceof Timestamp ? data.requestDate.toDate() : new Date(),
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),

        createdByUserId: data.createdByUserId || undefined,
        pdfSolicitation: data.pdfSolicitation || undefined,
        selectedCandidate: data.selectedCandidate || undefined,
        approved: typeof data.approved === 'boolean' ? data.approved : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener solicitud de contratación por ID:', error);
    throw error;
  }
};

// --- FUNCIÓN para obtener todas las Solicitudes de Contratación ---
export const getContractRequests = async (): Promise<ContractRequestRecord[]> => {
  try {
    console.log('Obteniendo solicitudes de contratación desde Firebase...');

    const q = query(getContractRequestsCollectionRef(), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const requests: ContractRequestRecord[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Validar y tipar correctamente los campos de tipo literal
      const companyFlat: 'Si' | 'No' = (data.companyFlat === 'Si' || data.companyFlat === 'No') ? data.companyFlat : 'No';
      const status: 'Pendiente' | 'Aprobado' | 'Rechazado' = (data.status === 'Pendiente' || data.status === 'Aprobado' || data.status === 'Rechazado') ? data.status : 'Pendiente';

      requests.push({
        id: docSnap.id,
        requesterName: data.requesterName || '',
        requesterLastName: data.requesterLastName || '',
        contractType: data.contractType || '',
        salary: data.salary || '',
        observations: data.observations || '',
        incorporationDate: data.incorporationDate instanceof Timestamp ? data.incorporationDate.toDate() : undefined,
        company: data.company || '',
        jobPosition: data.jobPosition || '',
        professionalCategory: data.professionalCategory || '',
        city: data.city || '',
        province: data.province || '',
        autonomousCommunity: data.autonomousCommunity || '',
        workCenter: data.workCenter || '',
        companyFlat: companyFlat,
        language1: data.language1 || '',
        level1: data.level1 || '',
        language2: data.language2 || '',
        level2: data.level2 || '',
        experienceElectromedicine: data.experienceElectromedicine || '',
        experienceInstallations: data.experienceInstallations || '',
        hiringReason: data.hiringReason || '',
        notesAndCommitments: data.notesAndCommitments || '',
        
        status: status,
        requestDate: data.requestDate instanceof Timestamp ? data.requestDate.toDate() : new Date(),
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),

        createdByUserId: data.createdByUserId || undefined,
        pdfSolicitation: data.pdfSolicitation || undefined,
        selectedCandidate: data.selectedCandidate || undefined,
        approved: typeof data.approved === 'boolean' ? data.approved : undefined,
      });
    });

    console.log('Solicitudes de contratación obtenidas:', requests.length);
    return requests;
  } catch (error) {
    console.error('Error al obtener solicitudes de contratación:', error);
    throw error;
  }
};

// --- FUNCIÓN para guardar una nueva Solicitud de Contratación ---
// Recibe los datos del formulario (donde las fechas aún son strings 'YYYY-MM-DD').
export const saveContractRequest = async (
  requestDataFromForm: Omit<ContractRequestRecord, 'id' | 'requestDate' | 'createdAt' | 'updatedAt' | 'status' | 'incorporationDate'> & {
    incorporationDate?: string; // La fecha de incorporación viene como string del formulario
  }
): Promise<string> => {
  try {
    // Convertir la fecha de incorporación de string a Timestamp (o null si está vacía/no definida)
    const incorporationDateTimestamp = requestDataFromForm.incorporationDate
      ? Timestamp.fromDate(new Date(requestDataFromForm.incorporationDate))
      : null;

    const payload: ContractRequestFirestorePayload = {
      ...requestDataFromForm,
      incorporationDate: incorporationDateTimestamp,
      requestDate: serverTimestamp(), // La fecha de la solicitud se establece en el servidor
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'Pendiente', // Estado por defecto para nuevas solicitudes
    };

    const docRef = await addDoc(getContractRequestsCollectionRef(), payload);
    console.log('Solicitud de contratación guardada exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar solicitud de contratación:', error);
    throw error;
  }
};

// --- FUNCIÓN para duplicar una Solicitud de Contratación ---
export const duplicateContractRequest = async (originalRequest: ContractRequestRecord): Promise<string> => {
  try {
    const duplicatedData: ContractRequestFirestorePayload = {
      requesterName: originalRequest.requesterName + ' (Copia)',
      requesterLastName: originalRequest.requesterLastName,
      contractType: originalRequest.contractType,
      salary: originalRequest.salary,
      observations: originalRequest.observations,
      incorporationDate: originalRequest.incorporationDate 
        ? Timestamp.fromDate(originalRequest.incorporationDate)
        : null,
      company: originalRequest.company,
      jobPosition: originalRequest.jobPosition,
      professionalCategory: originalRequest.professionalCategory,
      city: originalRequest.city,
      province: originalRequest.province,
      autonomousCommunity: originalRequest.autonomousCommunity,
      workCenter: originalRequest.workCenter,
      companyFlat: originalRequest.companyFlat,
      language1: originalRequest.language1,
      level1: originalRequest.level1,
      language2: originalRequest.language2,
      level2: originalRequest.level2,
      experienceElectromedicine: originalRequest.experienceElectromedicine,
      experienceInstallations: originalRequest.experienceInstallations,
      hiringReason: originalRequest.hiringReason,
      notesAndCommitments: originalRequest.notesAndCommitments,
      status: 'Pendiente',
      requestDate: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByUserId: originalRequest.createdByUserId,
      pdfSolicitation: originalRequest.pdfSolicitation,
      selectedCandidate: originalRequest.selectedCandidate,
      approved: originalRequest.approved,
    };

    const docRef = await addDoc(getContractRequestsCollectionRef(), duplicatedData);
    console.log('Solicitud de contratación duplicada exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al duplicar solicitud de contratación:', error);
    throw error;
  }
};

// --- FUNCIÓN para actualizar una Solicitud de Contratación existente ---
// Permite actualizaciones parciales.
export const updateContractRequest = async (
  id: string,
  requestUpdates: Partial<Omit<ContractRequestRecord, 'id' | 'requestDate' | 'createdAt' | 'updatedAt' | 'incorporationDate'>> & {
    incorporationDate?: string; // Permite string para la fecha de incorporación al actualizar
  }
): Promise<void> => {
  try {
    const docRef = doc(getContractRequestsCollectionRef(), id);

    const updatePayload: { [key: string]: any } = { ...requestUpdates };

    // Convertir la fecha de incorporación de string a Timestamp si está presente en las actualizaciones
    if (requestUpdates.incorporationDate !== undefined) {
      updatePayload.incorporationDate = requestUpdates.incorporationDate
        ? Timestamp.fromDate(new Date(requestUpdates.incorporationDate))
        : null;
    }
    updatePayload.updatedAt = serverTimestamp(); // Actualizar la marca de tiempo de modificación

    await updateDoc(docRef, updatePayload);
    console.log('Solicitud de contratación actualizada exitosamente:', id);
  } catch (error) {
    console.error('Error al actualizar solicitud de contratación:', error);
    throw error;
  }
};

// --- FUNCIÓN para eliminar una Solicitud de Contratación ---
export const deleteContractRequest = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(getContractRequestsCollectionRef(), id));
    console.log('Solicitud de contratación eliminada exitosamente:', id);
  } catch (error) {
    console.error('Error al eliminar solicitud de contratación:', error);
    throw error;
  }
};

// --- FUNCIÓN para importar Solicitudes de Contratación (ej. desde CSV/Excel) ---
export const importContractRequests = async (requests: Partial<ContractRequestRecord>[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };

  for (let i = 0; i < requests.length; i++) {
    try {
      const request = requests[i];

      // Validar campos requeridos mínimos
      if (!request.requesterName && !request.company) {
        results.errors.push(`Fila ${i + 2}: Faltan datos mínimos requeridos`);
        continue;
      }

      // Convertir fecha de incorporación a Timestamp si existe
      const incorporationDateTimestamp = request.incorporationDate
        ? Timestamp.fromDate(request.incorporationDate instanceof Date ? request.incorporationDate : new Date(request.incorporationDate))
        : null;

      const payload: ContractRequestFirestorePayload = {
        requesterName: request.requesterName || '',
        requesterLastName: request.requesterLastName || '',
        contractType: request.contractType || '',
        salary: request.salary || '',
        observations: request.observations || '',
        incorporationDate: incorporationDateTimestamp,
        company: request.company || '',
        jobPosition: request.jobPosition || '',
        professionalCategory: request.professionalCategory || '',
        city: request.city || '',
        province: request.province || '',
        autonomousCommunity: request.autonomousCommunity || '',
        workCenter: request.workCenter || '',
        companyFlat: (request.companyFlat === 'Si' || request.companyFlat === 'No') ? request.companyFlat : 'No',
        language1: request.language1 || '',
        level1: request.level1 || '',
        language2: request.language2 || '',
        level2: request.level2 || '',
        experienceElectromedicine: request.experienceElectromedicine || '',
        experienceInstallations: request.experienceInstallations || '',
        hiringReason: request.hiringReason || '',
        notesAndCommitments: request.notesAndCommitments || '',
        status: (request.status === 'Aprobado' || request.status === 'Rechazado' || request.status === 'Pendiente') ? request.status : 'Pendiente',
        requestDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByUserId: request.createdByUserId,
        pdfSolicitation: request.pdfSolicitation,
        selectedCandidate: request.selectedCandidate,
        approved: request.approved,
      };
      
      await addDoc(getContractRequestsCollectionRef(), payload);
      results.success++;

    } catch (error) {
      console.error(`Error importing request ${i + 1}:`, error);
      results.errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  return results;
};
