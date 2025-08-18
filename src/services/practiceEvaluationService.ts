
import { collection, addDoc, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PracticeEvaluation {
  id: string;
  studentName: string;
  studentLastName: string;
  institute: string;
  tutorName: string;
  tutorLastName: string;
  workCenter: string;
  formation: string;
  finalEvaluation: 'Apto' | 'No Apto';
  evaluationDate: Date;
  performanceRating: number;
  createdAt: Date;
  token: string;
}

export interface PracticeEvaluationForm {
  studentName: string;
  studentLastName: string;
  institute: string;
  tutorName: string;
  tutorLastName: string;
  workCenter: string;
  formation: string;
  finalEvaluation: 'Apto' | 'No Apto';
  performanceRating: number;
}

export const generatePracticeEvaluationToken = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
};

export const createPracticeEvaluationLink = async (): Promise<string> => {
  const token = generatePracticeEvaluationToken();
  
  // Crear documento placeholder en Firestore
  await addDoc(collection(db, 'PracticeEvaluations', 'Tokens', 'Active'), {
    token,
    createdAt: new Date(),
    used: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
  });
  
  const link = `${window.location.origin}/valoracion-practicas/${token}`;
  return link;
};

export const validateEvaluationToken = async (token: string): Promise<boolean> => {
  try {
    const tokensCollection = collection(db, 'PracticeEvaluations', 'Tokens', 'Active');
    const snapshot = await getDocs(tokensCollection);
    
    const tokenDoc = snapshot.docs.find(doc => doc.data().token === token);
    if (!tokenDoc) return false;
    
    const tokenData = tokenDoc.data();
    const now = new Date();
    const expiresAt = tokenData.expiresAt.toDate();
    
    return !tokenData.used && now < expiresAt;
  } catch (error) {
    console.error('Error validando token:', error);
    return false;
  }
};

export const submitPracticeEvaluation = async (
  token: string, 
  evaluation: PracticeEvaluationForm
): Promise<void> => {
  try {
    // Guardar evaluación
    await addDoc(collection(db, 'PracticeEvaluations', 'Completed', 'Evaluations'), {
      ...evaluation,
      token,
      evaluationDate: new Date(),
      createdAt: new Date()
    });
    
    // Marcar token como usado
    const tokensCollection = collection(db, 'PracticeEvaluations', 'Tokens', 'Active');
    const snapshot = await getDocs(tokensCollection);
    
    const tokenDoc = snapshot.docs.find(doc => doc.data().token === token);
    if (tokenDoc) {
      await addDoc(collection(db, 'PracticeEvaluations', 'Tokens', 'Used'), {
        ...tokenDoc.data(),
        usedAt: new Date(),
        used: true
      });
    }
    
    console.log('Evaluación de prácticas guardada exitosamente');
  } catch (error) {
    console.error('Error guardando evaluación:', error);
    throw new Error('Error al guardar la evaluación');
  }
};

export const getPracticeEvaluations = async (): Promise<PracticeEvaluation[]> => {
  try {
    const evaluationsCollection = collection(db, 'PracticeEvaluations', 'Completed', 'Evaluations');
    const q = query(evaluationsCollection, orderBy('createdAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      evaluationDate: doc.data().evaluationDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as PracticeEvaluation[];
  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error);
    return [];
  }
};
