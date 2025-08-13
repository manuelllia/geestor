
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from "firebase/firestore";
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

export const saveExitInterview = async (data: ExitInterviewData): Promise<string> => {
  try {
    console.log('Guardando entrevista de salida:', data);
    
    const exitInterviewRef = collection(db, "Gestión de Talento", "entrevistas-salida", "Entrevistas de Salida");
    
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
    const exitInterviewRef = collection(db, "Gestión de Talento", "entrevistas-salida", "Entrevistas de Salida");
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

export const generateExitInterviewToken = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
