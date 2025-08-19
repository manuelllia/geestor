import { collection, addDoc, getDocs, doc, getDoc, updateDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

// INTERFAZ AJUSTADA para coincidir con el zodSchema y tu JSX
export interface PracticeEvaluationData {
  // Datos básicos
  tutorName: string;
  tutorLastName: string;
  workCenter: string;
  studentName: string;
  studentLastName: string;
  formation: string;
  institution: string; // Coincide con el schema y JSX
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
    charisma: number; // Coincide con el schema y JSX (antes leadership)
    learningCapacity: number; // Coincide con el schema y JSX (antes learningCapability, o learningCapacity en tu servicio original)
    writtenCommunication: number;
    problemSolving: number;
    taskCommitment: number;
  };
  
  // Aptitudes Organizativas (1-10)
  organizationalSkills: {
    organized: number;
    newChallenges: number;
    systemAdaptation: number; // Coincide con el schema y JSX
    efficiency: number;
    punctuality: number;
  };
  
  // Aptitudes Técnicas (1-10)
  technicalSkills: {
    serviceImprovements: number;
    diagnosticSkills: number;
    innovativeSolutions: number;
    sharesSolutions: number; // Coincide con el schema y JSX (antes sharingKnowledge)
    toolUsage: number; // Coincide con el schema y JSX (antes toolsUsage)
  };
  
  // Otros datos de interés
  travelAvailability?: string[]; // Marcado como opcional en Zod
  residenceChange: "Si" | "No"; // Coincide con el schema y JSX (antes residenceChange)
  englishLevel: string;
  performanceRating: number; // 1-10
  performanceJustification: string;
  finalEvaluation: "Apto" | "No Apto"; // Coincide con el schema
  futureInterest?: string; // Marcado como opcional, añadido porque estaba en tu interfaz pero no en el schema inicial
  practicalTraining?: string; // Marcado como opcional en Zod
  observations?: string; // Marcado como opcional en Zod
  evaluatorName: string;
  evaluationDate: Date; // Usaremos Date en el frontend y convertiremos a Timestamp
}

// Esta interfaz es para cuando RECUPERAS los datos del Firestore, ya que tendrán un ID y createdAt
export interface PracticeEvaluationRecord extends PracticeEvaluationData {
  id: string;
  createdAt: Date;
  updatedAt: Date; // Añadido para reflejar lo que se guarda
  response?: any; // Esto sugiere que puedes tener una respuesta guardada aparte.
                  // Si una evaluación solo tiene `response` después de ser creada y luego editada,
                  // el formulario de creación no lo necesita.
}

/**
 * Guarda una NUEVA valoración de prácticas en Firestore.
 * Este es el método que tu `PracticeEvaluationForm` llamará ahora.
 * Retorna el ID del documento recién creado.
 */
export const savePracticeEvaluation = async (data: PracticeEvaluationData): Promise<string> => {
  try {
    console.log('Guardando nueva valoración de prácticas:', data);
    
    // Ruta a la colección donde se guardarán las valoraciones (puede ser diferente si organizas tus datos de otra manera)
    // Asegúrate de que esta ruta sea la correcta en tu Firestore
    const evaluationCollectionRef = collection(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas");
    
    // Prepara los datos para Firestore, convirtiendo Date a Timestamp
    const docData = {
      ...data,
      evaluationDate: Timestamp.fromDate(data.evaluationDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(evaluationCollectionRef, docData);
    
    console.log('Nueva valoración de prácticas guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la nueva valoración de prácticas:', error);
    throw error;
  }
};

// =========================================================================
// LAS SIGUIENTES FUNCIONES YA NO SON NECESARIAS PARA EL FLUJO DE "CREAR NUEVA"
// DE TU PracticeEvaluationForm, PERO PUEDEN SER NECESARIAS PARA OTRAS PARTES
// DE TU APLICACIÓN (EJ. UN PANEL DE ADMINISTRACIÓN).
// SI NO SE USAN EN NINGÚN OTRO LADO, PUEDES ELIMINARLAS.
// =========================================================================

/**
 * (Opcional) Guarda una respuesta o actualiza una valoración de prácticas existente.
 * Esto sería si un formulario EXISTENTE fuera rellenado por el alumno/tutor
 * DESPUÉS de haber sido creado inicialmente.
 */
/*
export const savePracticeEvaluationResponse = async (id: string, responseData: any): Promise<void> => {
  try {
    console.log('Actualizando respuesta de valoración de prácticas (ID:', id, ') con:', responseData);
    
    const evaluationDocRef = doc(db, "Gestión de Talento", "valoracion-practicas", "Valoración Prácticas", id);
    
    await updateDoc(evaluationDocRef, {
      response: responseData,
      respondedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Respuesta de valoración de prácticas actualizada');
  } catch (error) {
    console.error('Error al actualizar la respuesta de valoración de prácticas:', error);
    throw error;
  }
};
*/

/**
 * (Opcional) Obtiene una valoración de prácticas por su ID.
 * Útil si tuvieras una ruta para editar o ver una valoración específica.
 */
/*
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
        updatedAt: data.updatedAt?.toDate() || new Date(), // Asegúrate de convertir updatedAt también
      } as PracticeEvaluationRecord;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener valoración de prácticas por ID:', error);
    throw error;
  }
};
*/

/**
 * (Mantener) Obtiene todas las valoraciones de prácticas.
 * Probablemente utilizado para un panel de administración.
 */
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
        updatedAt: data.updatedAt?.toDate() || new Date(), // Asegúrate de convertir updatedAt también
      } as PracticeEvaluationRecord);
    });
    
    return evaluations;
  } catch (error) {
    console.error('Error al obtener valoraciones de prácticas:', error);
    throw error;
  }
};

/**
 * (Mantener) Genera un token, probablemente para el ExitInterviewForm
 * o si decides volver a tener enlaces únicos para este formulario en el futuro.
 */
export const generatePracticeEvaluationToken = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Si usas useWorkCenters en PracticeEvaluationForm, asegúrate de que también está definido
// en tu servicio o en un archivo de hooks aparte. Lo he añadido aquí por completitud.
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
  return { workCenters, isLoading: false }; // isLoading es false si los datos son estáticos
};