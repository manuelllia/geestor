
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserData {
  id: string;
  nombre: string;
  email: string;
  Per_Create: boolean;
  Per_Delete: boolean;
  Per_Modificate: boolean;
  Per_View: boolean;
  Per_Ope: boolean;
  Per_GT: boolean;
  Per_GDT: boolean;
}

export const getUsersList = async (): Promise<UserData[]> => {
  try {
    console.log('Obteniendo lista de usuarios desde Firebase...');
    
    // Acceder a la colección anidada: Usuarios/Información/{uid}
    const usersRef = collection(db, "Usuarios", "Información");
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    
    // Obtener todos los documentos de usuario
    for (const userDoc of querySnapshot.docs) {
      const userId = userDoc.id;
      
      // Obtener la subcolección del usuario específico
      const userDataRef = collection(db, "Usuarios", "Información", userId, userId);
      const userDataSnapshot = await getDocs(userDataRef);
      
      userDataSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Solo agregar si tiene los campos necesarios
        if (data.nombre && data.email) {
          users.push({
            id: doc.id,
            nombre: data.nombre || '',
            email: data.email || '',
            Per_Create: data.Per_Create ?? true,
            Per_Delete: data.Per_Delete ?? true,
            Per_Modificate: data.Per_Modificate ?? true,
            Per_View: data.Per_View ?? true,
            Per_Ope: data.Per_Ope ?? true,
            Per_GT: data.Per_GT ?? true,
            Per_GDT: data.Per_GDT ?? true
          });
        }
      });
    }
    
    console.log('Usuarios obtenidos:', users.length);
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const updateUserPermissions = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    console.log('Actualizando permisos de usuario:', userId);
    
    // Buscar el documento del usuario en la estructura anidada
    const usersRef = collection(db, "Usuarios", "Información");
    const querySnapshot = await getDocs(usersRef);
    
    for (const userDoc of querySnapshot.docs) {
      const userDataRef = collection(db, "Usuarios", "Información", userDoc.id);
      const userDataSnapshot = await getDocs(userDataRef);
      
      for (const doc of userDataSnapshot.docs) {
        if (doc.id === userId) {
          const docRef = doc.ref;
          await updateDoc(docRef, {
            Per_Create: userData.Per_Create,
            Per_Delete: userData.Per_Delete,
            Per_Modificate: userData.Per_Modificate,
            Per_View: userData.Per_View,
            Per_Ope: userData.Per_Ope,
            Per_GT: userData.Per_GT,
            Per_GDT: userData.Per_GDT,
            updatedAt: new Date()
          });
          
          console.log('Permisos de usuario actualizados:', userId);
          return;
        }
      }
    }
    
    throw new Error('Usuario no encontrado');
  } catch (error) {
    console.error('Error al actualizar permisos de usuario:', error);
    throw error;
  }
};
