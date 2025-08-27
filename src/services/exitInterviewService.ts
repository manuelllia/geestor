import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ExitInterviewData {
  employeeName: string;
  employeeLastName: string;
  supervisorName: string;
  supervisorLastName: string;
  workCenter: string;
  position: string;
  seniority: string;
  exitType: string;
  exitDate: Date;
  joiningReasons: string[];
  mainExitReason: string;
  mainExitReasonOther?: string;
  otherInfluencingFactors: string[];
  comments: string;
  scores: {
    integration: number;
    internalCommunication: number;
    compensation: number;
    training: number;
    workSchedule: number;
    mentoring: number;
    workPerformed: number;
    workEnvironment: number;
    corporateCulture: number;
    supervisorRelation: number;
    globalAssessment: number;
  };
}

export interface ExitInterviewRecord extends ExitInterviewData {
  id: string;
  createdAt: Date;
}

const COLLECTION_PATH = "Gestión de Talento/entrevistas-salida/Entrevistas de Salida";

export const saveExitInterview = async (data: ExitInterviewData): Promise<string> => {
  try {
    console.log('Guardando entrevista de salida:', data);
    
    const exitInterviewRef = collection(db, COLLECTION_PATH);
    
    const docData = {
      ...data,
      exitDate: Timestamp.fromDate(data.exitDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(exitInterviewRef, docData);
    
    console.log('Entrevista de salida guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la entrevista de salida:', error);
    throw error;
  }
};

export const getExitInterviews = async (): Promise<ExitInterviewRecord[]> => {
  try {
    const exitInterviewRef = collection(db, COLLECTION_PATH);
    const q = query(exitInterviewRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const interviews: ExitInterviewRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      interviews.push({
        id: doc.id,
        ...data,
        exitDate: data.exitDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as ExitInterviewRecord);
    });
    
    return interviews;
  } catch (error) {
    console.error('Error al obtener entrevistas de salida:', error);
    throw error;
  }
};

export const getExitInterviewById = async (id: string): Promise<ExitInterviewRecord | null> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        exitDate: data.exitDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as ExitInterviewRecord;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener entrevista de salida:', error);
    throw error;
  }
};

export const updateExitInterview = async (id: string, data: Partial<ExitInterviewData>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    const updateData = {
      ...data,
      exitDate: data.exitDate ? Timestamp.fromDate(data.exitDate) : undefined,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
    console.log('Entrevista de salida actualizada con ID:', id);
  } catch (error) {
    console.error('Error al actualizar entrevista de salida:', error);
    throw error;
  }
};

export const deleteExitInterview = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    await deleteDoc(docRef);
    console.log('Entrevista de salida eliminada con ID:', id);
  } catch (error) {
    console.error('Error al eliminar entrevista de salida:', error);
    throw error;
  }
};

export const duplicateExitInterview = async (id: string): Promise<string> => {
  try {
    const originalInterview = await getExitInterviewById(id);
    if (!originalInterview) {
      throw new Error('Entrevista de salida no encontrada');
    }
    
    const { id: _, createdAt, ...interviewData } = originalInterview;
    const duplicatedData = {
      ...interviewData,
      employeeName: `${interviewData.employeeName} (Copia)`,
    };
    
    return await saveExitInterview(duplicatedData);
  } catch (error) {
    console.error('Error al duplicar entrevista de salida:', error);
    throw error;
  }
};

export const generateExitInterviewToken = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const exportExitInterviewsToCSV = async (): Promise<void> => {
  try {
    const interviews = await getExitInterviews();
    
    // Crear headers del CSV
    const headers = [
      'Nombre del Empleado',
      'Apellidos del Empleado',
      'Posición',
      'Centro de Trabajo',
      'Tipo de Baja',
      'Fecha de Baja',
      'Antigüedad',
      'Fecha de Entrevista'
    ];

    // Convertir datos a formato CSV
    const csvData = interviews.map(interview => [
      interview.employeeName || '',
      interview.employeeLastName || '',
      interview.position || '',
      interview.workCenter || '',
      interview.exitType || '',
      interview.exitDate ? interview.exitDate.toLocaleDateString() : '',
      interview.seniority || '',
      interview.createdAt ? interview.createdAt.toLocaleDateString() : ''
    ]);

    // Crear contenido CSV
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `entrevistas_salida_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Entrevistas de salida exportadas a CSV correctamente');
  } catch (error) {
    console.error('Error al exportar entrevistas de salida a CSV:', error);
    throw error;
  }
};
