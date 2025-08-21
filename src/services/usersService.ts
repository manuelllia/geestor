
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
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
    
    // Nueva ruta: Usuarios/Información/Users
    const usersRef = collection(db, "Usuarios", "Información", "Users");
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.nombre && data.email) {
        users.push({
          uid: doc.id,
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
    });
    
    console.log('Usuarios obtenidos exitosamente:', users.length);
    return users;
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const updateUserPermissions = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    console.log('Actualizando permisos de usuario:', userId);
    
    // Nueva ruta: Usuarios/Información/Users/{uid}
    const userDocRef = doc(db, "Usuarios", "Información", "Users", userId);
    
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

// Función de debug para entender la estructura de tu base de datos
export const debugFirestoreStructure = async () => {
  try {
    console.log('=== DEBUG: Estructura de Firestore ===');
    
    // Verificar la colección Users
    const usersRef = collection(db, "Usuarios", "Información", "Users");
    const querySnapshot = await getDocs(usersRef);
    
    console.log('Número de usuarios encontrados:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      console.log(`Usuario ID: ${doc.id}`, doc.data());
    });
    
  } catch (error) {
    console.error('Error en debug:', error);
  }
};

// Función alternativa si tienes los IDs de usuarios
export const getUsersListWithKnownIds = async (userIds: string[]): Promise<UserData[]> => {
  try {
    console.log('Obteniendo usuarios con IDs conocidos:', userIds);
    
    const users: UserData[] = [];
    
    for (const userId of userIds) {
      try {
        // Nueva ruta: Usuarios/Información/Users/{uid}
        const userDocRef = doc(db, "Usuarios", "Información", "Users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
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
      } catch (error) {
        console.error(`Error al obtener usuario ${userId}:`, error);
      }
    }
    
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios con IDs conocidos:', error);
    throw error;
  }
};
