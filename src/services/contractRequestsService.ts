
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ContractRequestData {
  id: string;
  applicantName: string;
  applicantLastName: string;
  position: string;
  department: string;
  requestType: string;
  requestDate: Date;
  expectedStartDate: Date;
  salary: string;
  status: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractRequestInput {
  applicantName: string;
  applicantLastName: string;
  position: string;
  department: string;
  requestType: string;
  requestDate: Date;
  expectedStartDate: Date;
  salary: string;
  status: string;
  observations?: string;
}

const COLLECTION_PATH = 'Gestión de Talento/solicitudes-contratacion/Solicitudes de Contratación';

// Función para convertir timestamp de Firestore a Date
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

export const getContractRequests = async (): Promise<ContractRequestData[]> => {
  try {
    console.log('Cargando solicitudes de contrato desde:', COLLECTION_PATH);
    const querySnapshot = await getDocs(collection(db, COLLECTION_PATH));
    
    const requests: ContractRequestData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Documento encontrado:', doc.id, data);
      
      requests.push({
        id: doc.id,
        applicantName: data.applicantName || '',
        applicantLastName: data.applicantLastName || '',
        position: data.position || '',
        department: data.department || '',
        requestType: data.requestType || '',
        requestDate: convertTimestampToDate(data.requestDate),
        expectedStartDate: convertTimestampToDate(data.expectedStartDate),
        salary: data.salary || '',
        status: data.status || 'Pendiente',
        observations: data.observations || '',
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      });
    });
    
    console.log('Solicitudes cargadas:', requests.length);
    return requests;
  } catch (error) {
    console.error('Error al obtener solicitudes de contrato:', error);
    throw error;
  }
};

export const createContractRequest = async (requestData: ContractRequestInput): Promise<string> => {
  try {
    console.log('Creando nueva solicitud de contrato:', requestData);
    
    const docData = {
      ...requestData,
      requestDate: Timestamp.fromDate(requestData.requestDate),
      expectedStartDate: Timestamp.fromDate(requestData.expectedStartDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_PATH), docData);
    console.log('Solicitud creada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al crear solicitud de contrato:', error);
    throw error;
  }
};

export const updateContractRequest = async (id: string, requestData: Partial<ContractRequestInput>): Promise<void> => {
  try {
    console.log('Actualizando solicitud de contrato:', id, requestData);
    
    const updateData: any = {
      ...requestData,
      updatedAt: Timestamp.now(),
    };
    
    if (requestData.requestDate) {
      updateData.requestDate = Timestamp.fromDate(requestData.requestDate);
    }
    if (requestData.expectedStartDate) {
      updateData.expectedStartDate = Timestamp.fromDate(requestData.expectedStartDate);
    }
    
    const docRef = doc(db, COLLECTION_PATH, id);
    await updateDoc(docRef, updateData);
    console.log('Solicitud actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar solicitud de contrato:', error);
    throw error;
  }
};

export const deleteContractRequest = async (id: string): Promise<void> => {
  try {
    console.log('Eliminando solicitud de contrato:', id);
    const docRef = doc(db, COLLECTION_PATH, id);
    await deleteDoc(docRef);
    console.log('Solicitud eliminada exitosamente');
  } catch (error) {
    console.error('Error al eliminar solicitud de contrato:', error);
    throw error;
  }
};

export const getContractRequestById = async (id: string): Promise<ContractRequestData | null> => {
  try {
    console.log('Obteniendo solicitud de contrato por ID:', id);
    const docRef = doc(db, COLLECTION_PATH, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        applicantName: data.applicantName || '',
        applicantLastName: data.applicantLastName || '',
        position: data.position || '',
        department: data.department || '',
        requestType: data.requestType || '',
        requestDate: convertTimestampToDate(data.requestDate),
        expectedStartDate: convertTimestampToDate(data.expectedStartDate),
        salary: data.salary || '',
        status: data.status || 'Pendiente',
        observations: data.observations || '',
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      };
    } else {
      console.log('No se encontró la solicitud');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener solicitud de contrato por ID:', error);
    throw error;
  }
};

// Función para importar múltiples solicitudes desde CSV/Excel
export const importContractRequests = async (requests: ContractRequestInput[]): Promise<{ success: number; errors: string[] }> => {
  const batch = writeBatch(db);
  const errors: string[] = [];
  let success = 0;

  try {
    console.log('Iniciando importación de', requests.length, 'solicitudes');
    
    for (let i = 0; i < requests.length; i++) {
      try {
        const request = requests[i];
        
        // Validar datos requeridos
        if (!request.applicantName || !request.position) {
          errors.push(`Fila ${i + 1}: Faltan datos requeridos (nombre del solicitante o puesto)`);
          continue;
        }
        
        const docRef = doc(collection(db, COLLECTION_PATH));
        const docData = {
          applicantName: request.applicantName,
          applicantLastName: request.applicantLastName || '',
          position: request.position,
          department: request.department || '',
          requestType: request.requestType || 'Nueva Contratación',
          requestDate: Timestamp.fromDate(request.requestDate || new Date()),
          expectedStartDate: Timestamp.fromDate(request.expectedStartDate || new Date()),
          salary: request.salary || '',
          status: request.status || 'Pendiente',
          observations: request.observations || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        batch.set(docRef, docData);
        success++;
        
        // Firestore tiene un límite de 500 operaciones por batch
        if (success % 500 === 0) {
          await batch.commit();
          console.log(`Procesadas ${success} solicitudes`);
        }
        
      } catch (error) {
        console.error(`Error procesando fila ${i + 1}:`, error);
        errors.push(`Fila ${i + 1}: Error al procesar - ${error}`);
      }
    }
    
    // Commit final para las operaciones restantes
    if (success % 500 !== 0) {
      await batch.commit();
    }
    
    console.log(`Importación completada: ${success} exitosas, ${errors.length} errores`);
    return { success, errors };
    
  } catch (error) {
    console.error('Error en la importación masiva:', error);
    throw error;
  }
};
