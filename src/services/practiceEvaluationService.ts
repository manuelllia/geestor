
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PracticeEvaluation {
  id: string;
  student: string;
  tutor: string;
  workCenter: string;
  formation: string;
  finalEvaluation: number;
  date: string;
  createdAt: any;
}

export interface PracticeEvaluationLink {
  id: string;
  token: string;
  student: string;
  tutor: string;
  workCenter: string;
  formation: string;
  createdAt: any;
  expiresAt: any;
  completed: boolean;
}

export interface PracticeEvaluationResponse {
  student: string;
  tutor: string;
  workCenter: string;
  formation: string;
  finalEvaluation: number;
  comments?: string;
}

// Generar enlace de evaluación
export const generatePracticeEvaluationLink = async (data: {
  student: string;
  tutor: string;
  workCenter: string;
  formation: string;
}): Promise<string> => {
  try {
    const token = generateUniqueToken();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30); // Expira en 30 días

    const linkData = {
      token,
      student: data.student,
      tutor: data.tutor,
      workCenter: data.workCenter,
      formation: data.formation,
      createdAt: serverTimestamp(),
      expiresAt: expirationDate,
      completed: false
    };

    const docRef = await addDoc(collection(db, 'practiceEvaluationLinks'), linkData);
    
    // Retornar la URL completa del enlace
    const baseUrl = window.location.origin;
    return `${baseUrl}/evaluacion-practica/${token}`;
  } catch (error) {
    console.error('Error generating practice evaluation link:', error);
    throw new Error('No se pudo generar el enlace de evaluación');
  }
};

// Obtener evaluación por token
export const getPracticeEvaluationByToken = async (token: string): Promise<PracticeEvaluationLink | null> => {
  try {
    const q = query(
      collection(db, 'practiceEvaluationLinks'), 
      where('token', '==', token),
      where('completed', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // Verificar si el enlace ha expirado
    const now = new Date();
    const expiresAt = data.expiresAt?.toDate();
    
    if (expiresAt && now > expiresAt) {
      return null;
    }

    return {
      id: doc.id,
      token: data.token,
      student: data.student,
      tutor: data.tutor,
      workCenter: data.workCenter,
      formation: data.formation,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      completed: data.completed
    };
  } catch (error) {
    console.error('Error getting practice evaluation by token:', error);
    throw new Error('Error al obtener la evaluación');
  }
};

// Obtener evaluación por ID
export const getPracticeEvaluationById = async (id: string): Promise<PracticeEvaluationLink | null> => {
  try {
    const docRef = doc(db, 'practiceEvaluationLinks', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      token: data.token,
      student: data.student,
      tutor: data.tutor,
      workCenter: data.workCenter,
      formation: data.formation,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      completed: data.completed
    };
  } catch (error) {
    console.error('Error getting practice evaluation by ID:', error);
    throw new Error('Error al obtener la evaluación');
  }
};

// Guardar respuesta de evaluación
export const savePracticeEvaluationResponse = async (
  token: string, 
  response: PracticeEvaluationResponse
): Promise<void> => {
  try {
    // Primero obtener el enlace por token
    const evaluationLink = await getPracticeEvaluationByToken(token);
    
    if (!evaluationLink) {
      throw new Error('Enlace de evaluación no válido o expirado');
    }

    // Guardar la evaluación completada
    const evaluationData = {
      student: response.student,
      tutor: response.tutor,
      workCenter: response.workCenter,
      formation: response.formation,
      finalEvaluation: response.finalEvaluation,
      comments: response.comments || '',
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
      linkId: evaluationLink.id
    };

    await addDoc(collection(db, 'practiceEvaluations'), evaluationData);

    // Marcar el enlace como completado
    const linkRef = doc(db, 'practiceEvaluationLinks', evaluationLink.id);
    await updateDoc(linkRef, {
      completed: true,
      completedAt: serverTimestamp()
    });

  } catch (error) {
    console.error('Error saving practice evaluation response:', error);
    throw new Error('Error al guardar la evaluación');
  }
};

// Obtener todas las evaluaciones de prácticas
export const getPracticeEvaluations = async (): Promise<PracticeEvaluation[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'practiceEvaluations'));
    const evaluations: PracticeEvaluation[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      evaluations.push({
        id: doc.id,
        student: data.student,
        tutor: data.tutor,
        workCenter: data.workCenter,
        formation: data.formation,
        finalEvaluation: data.finalEvaluation,
        date: data.date,
        createdAt: data.createdAt
      });
    });

    return evaluations.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error getting practice evaluations:', error);
    throw new Error('Error al obtener las evaluaciones');
  }
};

// Función auxiliar para generar token único
const generateUniqueToken = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}`;
};
