import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CSVExporter } from "../utils/csvExporter";

// INTERFAZ AJUSTADA PARA COINCIDIR CON ZOD SCHEMA Y JSX
export interface PracticeEvaluationData {
  // Datos básicos
  tutorName: string;
  tutorLastName: string;
  workCenter: string;
  studentName: string;
  studentLastName: string;
  formation: string;
  institution: string; // AJUSTADO: era 'institute'
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
    charisma: number; // AJUSTADO: era 'leadership'
    learningCapacity: number; // AJUSTADO: era 'learningCapability'
    writtenCommunication: number;
    problemSolving: number;
    taskCommitment: number;
  };
  
  // Aptitudes Organizativas (1-10)
  organizationalSkills: {
    organized: number;
    newChallenges: number;
    systemAdaptation: number; // AJUSTADO: era 'adaptationToSystems'
    efficiency: number;
    punctuality: number;
  };
  
  // Aptitudes Técnicas (1-10)
  technicalSkills: {
    serviceImprovements: number;
    diagnosticSkills: number;
    innovativeSolutions: number;
    sharesSolutions: number; // AJUSTADO: era 'sharingKnowledge'
    toolUsage: number; // AJUSTADO: era 'toolsUsage'
  };
  
  // Otros datos de interés
  travelAvailability?: string[]; // Opcional
  residenceChange: "Si" | "No"; // AJUSTADO: era 'residenceChange' pero tipo string. Ahora enum.
  englishLevel: string;
  performanceRating: number; // 1-10
  performanceJustification: string;
  finalEvaluation: "Apto" | "No Apto"; // Enum
  futureInterest?: string; // Opcional (siempre asegúrate que esté en tu schema si es necesario)
  practicalTraining?: string; // Opcional
  observations?: string; // Opcional
  evaluatorName: string;
  evaluationDate: Date; // Espera un objeto Date, que convertirás de string en el formulario
}

// Esta interfaz es para cuando RECUPERAS los datos de Firestore
export interface PracticeEvaluationRecord extends PracticeEvaluationData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  response?: any; // Esto sugiere que puedes tener una respuesta guardada aparte.
}

/**
 * Elimina una valoración de prácticas de Firestore.
 */
export const deletePracticeEvaluation = async (id: string): Promise<void> => {
  try {
    console.log('Eliminando valoración de prácticas con ID:', id);
    
    const evaluationDocRef = doc(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas", id);
    await deleteDoc(evaluationDocRef);
    
    console.log('Valoración de prácticas eliminada exitosamente');
  } catch (error) {
    console.error('Error al eliminar la valoración de prácticas:', error);
    throw error;
  }
};

/**
 * Obtiene una valoración de prácticas por ID.
 */
export const getPracticeEvaluationById = async (id: string): Promise<PracticeEvaluationRecord | null> => {
  try {
    const evaluationDocRef = doc(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas", id);
    const docSnap = await getDoc(evaluationDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        evaluationDate: data.evaluationDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as PracticeEvaluationRecord;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener valoración de prácticas por ID:', error);
    throw error;
  }
};

/**
 * Guarda una NUEVA valoración de prácticas en Firestore.
 * Este es el método que tu `PracticeEvaluationForm` llamará ahora.
 * Retorna el ID del documento recién creado.
 */
export const savePracticeEvaluation = async (data: PracticeEvaluationData): Promise<string> => {
  try {
    console.log('Guardando nueva valoración de prácticas:', data);
    
    const evaluationRef = collection(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas");
    
    // Aquí data.evaluationDate ya debería ser un objeto Date
    const docData = {
      ...data,
      evaluationDate: Timestamp.fromDate(data.evaluationDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(evaluationRef, docData);
    
    console.log('Nueva valoración de prácticas guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la nueva valoración de prácticas:', error);
    throw error;
  }
};

// =========================================================================
// LAS SIGUIENTES FUNCIONES NO SON UTILIZADAS POR EL `PracticeEvaluationForm`
// EN SU MODO DE "CREAR NUEVA EVALUACIÓN".
// MANTÉNLAS SI OTRAS PARTES DE TU APLICACIÓN LAS REQUIEREN (EJ. UN DASHBOARD).
// =========================================================================

/*
// Originalmente para guardar una respuesta a una evaluación existente.
// Tu nuevo formulario no lo necesita.
export const savePracticeEvaluationResponse = async (id: string, responseData: any): Promise<void> => {
  try {
    console.log('Guardando respuesta de valoración de prácticas:', id, responseData);
    
    const evaluationDocRef = doc(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas", id);
    
    await updateDoc(evaluationDocRef, {
      response: responseData,
      respondedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Respuesta de valoración de prácticas guardada');
  } catch (error) {
    console.error('Error al guardar la respuesta de valoración de prácticas:', error);
    throw error;
  }
};
*/

/*
// Originalmente para obtener una evaluación existente por ID.
// Tu nuevo formulario no lo necesita.
export const getPracticeEvaluationById = async (id: string): Promise<PracticeEvaluationRecord | null> => {
  try {
    const evaluationDocRef = doc(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas", id);
    const docSnap = await getDoc(evaluationDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        evaluationDate: data.evaluationDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as PracticeEvaluationRecord;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener valoración de prácticas por ID:', error);
    throw error;
  }
};
*/

// Mantenemos esta función si la usas para listar todas las evaluaciones en otro lugar
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
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as PracticeEvaluationRecord);
    });
    
    return evaluations;
  } catch (error) {
    console.error('Error al obtener valoraciones de prácticas:', error);
    throw error;
  }
};

// Nueva función para exportar evaluaciones de prácticas a CSV
export const exportPracticeEvaluationsToCSV = async (): Promise<void> => {
  try {
    const evaluations = await getPracticeEvaluations();
    
    if (evaluations.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const headers = {
      tutorName: 'Nombre del Tutor',
      tutorLastName: 'Apellidos del Tutor',
      workCenter: 'Centro de Trabajo',
      studentName: 'Nombre del Estudiante',
      studentLastName: 'Apellidos del Estudiante',
      formation: 'Formación',
      institution: 'Institución',
      practices: 'Prácticas',
      evaluationDate: 'Fecha de Evaluación',
      performanceRating: 'Calificación de Rendimiento',
      finalEvaluation: 'Evaluación Final',
      englishLevel: 'Nivel de Inglés',
      residenceChange: 'Cambio de Residencia',
      performanceJustification: 'Justificación del Rendimiento',
      observations: 'Observaciones',
      evaluatorName: 'Nombre del Evaluador',
      createdAt: 'Fecha de Creación',
      updatedAt: 'Última Actualización'
    };

    CSVExporter.exportToCSV(evaluations, headers, {
      filename: 'valoraciones_practicas'
    });

    console.log('Evaluaciones de prácticas exportadas correctamente');
  } catch (error) {
    console.error('Error al exportar evaluaciones de prácticas:', error);
    throw error;
  }
};

// Mantenemos esta función si la usas para generar tokens en otro lugar (ej. para ExitInterviewForm)
export const generatePracticeEvaluationToken = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Asegúrate de que este hook esté en `src/hooks/useWorkCenters.ts` o donde sea que lo tengas
// Si está en el mismo archivo de servicio, no hay problema.
export const useWorkCenters = () => {
  const workCenters = [
    { id: 'madridNorte', displayText: 'Centro Madrid Norte' },
    { id: 'madridSur', displayText: 'Centro Madrid Sur' },
    { id: 'barcelona', displayText: 'Centro Barcelona' },
    { id: 'valencia', displayText: 'Centro Valencia' },
    { id: 'sevilla', displayText: 'Centro Sevilla' },
    { id: 'bilbao', displayText: 'Centro Bilbao' },
    { id: 'zaragoza', displayText: 'Centro Zaragoza' },
    { id: 'sedeCentral', displayText: 'Sede Central Madrid' },
  ];
  return { workCenters, isLoading: false };
};
