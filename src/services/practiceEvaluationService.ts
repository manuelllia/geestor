
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface PracticeEvaluationData {
  // Datos básicos
  tutorName: string;
  tutorLastName: string;
  workCenter: string;
  studentName: string;
  studentLastName: string;
  formation: string;
  institute: string;
  practices: string;
  
  // Competencias (1-10)
  competencies: {
    meticulousness: number;
    teamwork: number;
    adaptability: number;
    stressTolerance: number;
    verbalCommunication: number;
    commitment: number;
    initiative: number;
    leadership: number;
    learningCapacity: number;
    writtenCommunication: number;
    problemSolving: number;
    taskCommitment: number;
  };
  
  // Aptitudes Organizativas (1-10)
  organizationalSkills: {
    organized: number;
    newChallenges: number;
    systemAdaptation: number;
    efficiency: number;
    punctuality: number;
  };
  
  // Aptitudes Técnicas (1-10)
  technicalSkills: {
    serviceImprovements: number;
    diagnosticSkills: number;
    innovativeSolutions: number;
    sharesSolutions: number;
    toolUsage: number;
  };
  
  // Otros datos de interés
  travelAvailability: string[]; // ["Nacional", "Internacional"]
  residenceChange: string; // "Si" | "No"
  englishLevel: string;
  performanceRating: number; // 1-10
  performanceJustification: string;
  finalEvaluation: string; // "Apto" | "No Apto"
  futureInterest: string;
  practicalTraining: string;
  observations: string;
  evaluatorName: string;
  evaluationDate: Date;
}

export interface PracticeEvaluationRecord extends PracticeEvaluationData {
  id: string;
  createdAt: Date;
}

export const savePracticeEvaluation = async (data: PracticeEvaluationData): Promise<string> => {
  try {
    console.log('Guardando valoración de prácticas:', data);
    
    const evaluationRef = collection(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas");
    
    const docData = {
      ...data,
      evaluationDate: Timestamp.fromDate(data.evaluationDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(evaluationRef, docData);
    
    console.log('Valoración de prácticas guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la valoración de prácticas:', error);
    throw error;
  }
};

export const getPracticeEvaluations = async (): Promise<PracticeEvaluationRecord[]> => {
  try {
    const evaluationRef = collection(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas");
    const q = query(evaluationRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const evaluations: PracticeEvaluationRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      evaluations.push({
        id: doc.id,
        ...data,
        evaluationDate: data.evaluationDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as PracticeEvaluationRecord);
    });
    
    return evaluations;
  } catch (error) {
    console.error('Error al obtener valoraciones de prácticas:', error);
    throw error;
  }
};

export const generatePracticeEvaluationToken = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
