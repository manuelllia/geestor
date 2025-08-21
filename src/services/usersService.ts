
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
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
    
    // Acceder a la colección: Usuarios/Información
    const usersRef = collection(db, "Usuarios", "Información");
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    
    // Obtener todos los documentos de usuario
    for (const userDoc of querySnapshot.docs) {
      const userId = userDoc.id;
      
      // Obtener el documento específico del usuario: Usuarios/Información/{uid}/{uid}
      const userDataDoc = doc(db, "Usuarios", "Información", userId, userId);
      
      try {
        // Como no podemos usar getDoc directamente en esta versión, 
        // accedemos a la subcolección y buscamos el documento
        const userSubCollectionRef = collection(db, "Usuarios", "Información", userId);
        const userSubSnapshot = await getDocs(userSubCollectionRef);
        
        userSubSnapshot.forEach((subDoc) => {
          if (subDoc.id === userId) {
            const data = subDoc.data();
            
            // Solo agregar si tiene los campos necesarios
            if (data.nombre && data.email) {
              users.push({
                uid: userId,
                nombre: data.nombre || '',
                email: data.email || '',
                Per_Create: data.Per_Create ?? true,
                Per_Delete: data.Per_Delete ?? true,
                Per_Modificate: data.Per_Modificate ?? true,
                Per_View: data.Per_View ?? true,
                Per_Ope: data.Per_Ope ?? true,
                Per_GT: data.Per_GT ?? true,
                Per_GDT: data.Per_GDT ?? true,
                Per_User: data.Per_User ?? false
              });
            }
          }
        });
      } catch (error) {
        console.log(`Error al obtener datos del usuario ${userId}:`, error);
      }
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
    
    console.log('Permisos de usuario actualizados:', userId);
  } catch (error) {
    console.error('Error al actualizar permisos de usuario:', error);
    throw error;
  }
};
