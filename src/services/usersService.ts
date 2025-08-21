
import { collection, getDocs, doc, updateDoc, getDoc, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserData {
  uid: string;
  nombre: string;
  email: string;
  Per_Create: boolean;
  Per_Delete: boolean;
  Per_Modificate: boolean;
  Per_View: boolean;
  Per_Ope: boolean;
  Per_GT: boolean;
  Per_GDT: boolean;
  Per_User?: boolean;
}

export const getUsersList = async (): Promise<UserData[]> => {
  try {
    console.log('Obteniendo lista de usuarios desde Firebase...');
    
    // Obtener todos los documentos de la colección Usuarios/Información
    const informacionRef = collection(db, "Usuarios", "Información");
    const informacionSnapshot = await getDocs(informacionRef);
    
    const users: UserData[] = [];
    
    // Para cada documento en Información, buscar la subcolección con el mismo ID
    for (const informacionDoc of informacionSnapshot.docs) {
      const userId = informacionDoc.id;
      
      try {
        // Acceder al documento específico del usuario: Usuarios/Información/{uid}/{uid}
        const userDocRef = doc(db, "Usuarios", "Información", userId, userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Verificar que tiene los campos necesarios
          if (userData.nombre && userData.email) {
            users.push({
              uid: userId,
              nombre: userData.nombre || '',
              email: userData.email || '',
              Per_Create: userData.Per_Create ?? true,
              Per_Delete: userData.Per_Delete ?? true,
              Per_Modificate: userData.Per_Modificate ?? true,
              Per_View: userData.Per_View ?? true,
              Per_Ope: userData.Per_Ope ?? true,
              Per_GT: userData.Per_GT ?? true,
              Per_GDT: userData.Per_GDT ?? true,
              Per_User: userData.Per_User ?? false
            });
          }
        }
      } catch (userError) {
        console.error(`Error al obtener datos del usuario ${userId}:`, userError);
      }
    }
    
    console.log(`Usuarios obtenidos exitosamente: ${users.length}`);
    return users;
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const updateUserPermissions = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    console.log('Actualizando permisos de usuario:', userId);
    
    // Ruta correcta: Usuarios/Información/{uid}/{uid}
    const userDocRef = doc(db, "Usuarios", "Información", userId, userId);
    
    await updateDoc(userDocRef, {
      Per_Create: userData.Per_Create,
      Per_Delete: userData.Per_Delete,
      Per_Modificate: userData.Per_Modificate,
      Per_View: userData.Per_View,
      Per_Ope: userData.Per_Ope,
      Per_GT: userData.Per_GT,
      Per_GDT: userData.Per_GDT,
      Per_User: userData.Per_User,
      updatedAt: new Date()
    });
    
    console.log('Permisos de usuario actualizados correctamente:', userId);
  } catch (error) {
    console.error('Error al actualizar permisos de usuario:', error);
    throw error;
  }
};
