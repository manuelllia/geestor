// src/services/contractRequestsService.ts

import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { db, serverTimestamp } from '../lib/firebase'; // Asegúrate de que la ruta a tu archivo firebase.ts sea correcta

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

// --- Tipo para los datos que se enviarán directamente a Firestore ---
// Las fechas se convierten a Timestamp para Firestore.
export type ContractRequestFirestorePayload = Omit<
  ContractRequestRecord,
  'id' | 'requestDate' | 'incorporationDate' | 'createdAt' | 'updatedAt'
> & {
  requestDate: Timestamp; // Para guardar en Firestore, será un serverTimestamp al crear
  incorporationDate: Timestamp | null; // Para guardar en Firestore, puede ser null
  createdAt?: Timestamp; // Para guardar en Firestore, opcional al crear/actualizar
  updatedAt?: Timestamp; // Para guardar en Firestore, opcional al crear/actualizar
};

// --- RUTA DE LA COLECCIÓN EN FIRESTORE ---
const COLLECTION_PATH = 'Gestión de Talento/solicitudes-contratacion/Solicitudes de Contratación';

// --- FUNCIÓN para obtener una Solicitud de Contratación por ID ---
export const getContractRequestById = async (id: string): Promise<ContractRequestRecord | null> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
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

    // Asume que 'requestDate' se usa para ordenar. Si el formulario no lo genera,
    // puedes usar 'createdAt' en su lugar.
    const q = query(collection(db, COLLECTION_PATH), orderBy("createdAt", "desc"));
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
  requestDataFromForm: Omit<ContractRequestRecord, 'id' | 'requestDate' | 'createdAt' | 'updatedAt' | 'status'> & {
    incorporationDate: string; // La fecha de incorporación viene como string del formulario
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

    const docRef = await addDoc(collection(db, COLLECTION_PATH), payload);
    console.log('Solicitud de contratación guardada exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar solicitud de contratación:', error);
    throw error;
  }
};


// --- FUNCIÓN para actualizar una Solicitud de Contratación existente ---
// Permite actualizaciones parciales.
export const updateContractRequest = async (
  id: string,
  requestUpdates: Partial<Omit<ContractRequestRecord, 'id' | 'requestDate' | 'createdAt' | 'updatedAt'>> & {
    incorporationDate?: string; // Permite string para la fecha de incorporación al actualizar
  }
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);

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
    await deleteDoc(doc(db, COLLECTION_PATH, id));
    console.log('Solicitud de contratación eliminada exitosamente:', id);
  } catch (error) {
    console.error('Error al eliminar solicitud de contratación:', error);
    throw error;
  }
};


// --- FUNCIÓN para importar Solicitudes de Contratación (ej. desde CSV/Excel) ---
export const importContractRequests = async (requests: any[]): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };

  // Opciones predefinidas (deben coincidir con las del formulario)
  const companyOptions = ['IBERMAN SA', 'ASIME SA', 'MANTELEC SA', 'INSANEX SL', 'SSM', 'RD HEALING', 'AINATEC INDEL FACILITIES'];
  const jobPositionOptions = [
    'TÉCNICO/A DE ELECTROMEDICINA', 'RC', 'INGENIERO/A ELECTRONICO', 'INGENIERO/A MECANICO',
    'INGENIERO/A DESARROLLO HW Y SW', 'ELECTRICISTA', 'FRIGORISTA', 'TÉCNICO/A DE INSTALACIONES',
    'ALBAÑIL'
  ];
  const professionalCategoryOptions = ['TÉCNICO/A', 'INGENIERO/A', 'OFICIAL 1º', 'OFICIAL 2º', 'OFICIAL 3º'];
  const languageOptions = ['INGLÉS', 'FRANCÉS', 'PORTUGÉS'];
  const levelOptions = [
    'A1-A2 (BÁSICO)', 'B1 (INTERMEDIO-BAJO)', 'B1-B2', 'B2 (FIRST CERTIFICATE)',
    'B2-C1', 'C1 (ADVANCED)', 'C2(BILINGÜE)'
  ];


  for (let i = 0; i < requests.length; i++) {
    try {
      const request = requests[i];

      // Helper para convertir fechas de importación (puede venir como string o número)
      const parseDate = (dateValue: any): Timestamp | null => {
        if (!dateValue) return null;
        let date;
        if (typeof dateValue === 'string') {
          date = new Date(dateValue);
        } else if (typeof dateValue === 'number') {
          // Asume que es un timestamp de Excel, por ejemplo. Ajustar si tu fuente es diferente.
          date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
        } else if (dateValue instanceof Date) {
          date = dateValue;
        } else {
          return null;
        }
        return isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
      };

      // Helper para resolver campos 'Otro'
      const resolveOtherField = (value: string, otherValue: string, options: string[]) => {
        if (!value) return '';
        return options.includes(value) ? value : otherValue || value;
      };

      // Mapeo exhaustivo de los campos de la importación a la nueva interfaz
      const payload: ContractRequestFirestorePayload = {
        requesterName: request['Nombre Solicitante'] || '',
        requesterLastName: request['Apellidos Solicitante'] || '',
        contractType: request['Tipo de Contrato'] || '',
        salary: request['Salario']?.toString() || '',
        observations: request['Observaciones Generales'] || '',
        incorporationDate: parseDate(request['Fecha de Incorporación']),
        
        company: resolveOtherField(request['Empresa'] || '', request['Especificar Empresa'] || '', companyOptions),
        jobPosition: resolveOtherField(request['Puesto de Trabajo'] || '', request['Especificar Puesto de Trabajo'] || '', jobPositionOptions),
        professionalCategory: resolveOtherField(request['Categoría Profesional'] || '', request['Especificar Categoría Profesional'] || '', professionalCategoryOptions),
        
        city: request['Población'] || '',
        province: request['Provincia'] || '',
        autonomousCommunity: request['Comunidad Autónoma'] || '',
        workCenter: request['Centro de Trabajo'] || '', // Asumiendo que viene el ID/Nombre
        companyFlat: (request['Piso de Empresa'] === 'Si' || request['Piso de Empresa'] === 'No') ? request['Piso de Empresa'] : 'No',
        
        language1: resolveOtherField(request['Idioma'] || '', request['Especificar Idioma'] || '', languageOptions),
        level1: request['Nivel'] || '',
        language2: resolveOtherField(request['Idioma 2'] || '', request['Especificar Idioma 2'] || '', languageOptions), // Revisa si language2Options es diferente
        level2: request['Nivel 2'] || '',
        
        experienceElectromedicine: request['Experiencia Previa en Electromedicina'] || '',
        experienceInstallations: request['Experiencia Previa en Instalaciones'] || '',
        hiringReason: request['Motivo de la Contratación'] || '',
        notesAndCommitments: request['Observaciones y/o Compromisos'] || '',

        // Campos de sistema para importación
        status: (request['Estado'] === 'Aprobado' || request['Estado'] === 'Rechazado' || request['Estado'] === 'Pendiente') ? request['Estado'] : 'Pendiente',
        requestDate: parseDate(request['Fecha Solicitud']) || serverTimestamp(), // Usa fecha importada o serverTimestamp
        createdAt: parseDate(request['Fecha Creación']) || serverTimestamp(),
        updatedAt: parseDate(request['Última Actualización']) || serverTimestamp(),

        // Campos adicionales, si existen en la importación
        createdByUserId: request['Creada por (ID de usuario)'] || undefined,
        pdfSolicitation: request['PDF: Solicitud de Contratación'] || undefined,
        selectedCandidate: request['Candidato Seleccionado'] || undefined,
        approved: typeof request['Approved? (Admin-only)'] === 'boolean' ? request['Approved? (Admin-only)'] : undefined,
      };
      
      await addDoc(collection(db, COLLECTION_PATH), payload);
      results.success++;

    } catch (error) {
      console.error(`Error importing request ${i + 1}:`, error);
      results.errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  return results;
};