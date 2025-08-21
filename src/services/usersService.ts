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
    
    // Primero, accede al documento "Información" para ver qué contiene
    const informacionDocRef = doc(db, "Usuarios", "Información");
    const informacionDoc = await getDoc(informacionDocRef);
    
    if (!informacionDoc.exists()) {
      console.log('El documento "Información" no existe');
      return [];
    }
    
    console.log('Datos del documento Información:', informacionDoc.data());
    
    // Ahora accede a las subcolecciones del documento "Información"
    // Necesitamos obtener las subcolecciones manualmente
    // Esto significa que los usuarios están como subcolecciones de "Información"
    
    // Método 1: Si conoces los IDs de usuario, puedes buscarlos directamente
    // Pero como no los conocemos, necesitamos un enfoque diferente
    
    // Para obtener las subcolecciones, necesitamos usar listCollections (solo disponible en Admin SDK)
    // En el cliente, necesitamos conocer los IDs de usuario de antemano
    
    // SOLUCIÓN: Buscar directamente en las subcolecciones conocidas
    // Si tienes una lista de usuarios en el documento "Información", úsala
    const informacionData = informacionDoc.data();
    const users: UserData[] = [];
    
    // Si el documento "Información" contiene una lista de UIDs de usuarios
    if (informacionData?.usuarios) {
      console.log('Encontrada lista de usuarios:', informacionData.usuarios);
      
      for (const userId of informacionData.usuarios) {
        try {
          const userDocRef = doc(db, "Usuarios", "Información", userId, userId);
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
        } catch (userError) {
          console.error(`Error al obtener usuario ${userId}:`, userError);
        }
      }
    } else {
      console.log('No se encontró lista de usuarios en el documento Información');
      // Intenta buscar subcolecciones conocidas o usar IDs conocidos
      // Este es un enfoque alternativo si tienes usuarios específicos
      console.log('Intentando acceso directo a usuarios conocidos...');
    }
    
    console.log('Usuarios obtenidos exitosamente:', users.length);
    return users;
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Versión alternativa si tu estructura es diferente
export const getUsersListAlternative = async (): Promise<UserData[]> => {
  try {
    console.log('Obteniendo lista de usuarios desde Firebase (método alternativo)...');
    
    // Si los usuarios están en una colección plana
    const usersRef = collection(db, "usuarios"); // Cambia por tu colección real
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
    
    // Verificar el documento "Información"
    const informacionDocRef = doc(db, "Usuarios", "Información");
    const informacionDoc = await getDoc(informacionDocRef);
    
    console.log('¿Existe el documento "Información"?', informacionDoc.exists());
    
    if (informacionDoc.exists()) {
      console.log('Datos del documento "Información":', informacionDoc.data());
    }
    
    // Intentar acceder a algunos usuarios conocidos si los tienes
    const commonUserIds = ['usuario1', 'admin', 'test']; // Agrega aquí IDs que sepas que existen
    
    for (const userId of commonUserIds) {
      try {
        const userDocRef = doc(db, "Usuarios", "Información", userId, userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          console.log(`Usuario encontrado - ID: ${userId}`, userDoc.data());
        } else {
          console.log(`Usuario no encontrado: ${userId}`);
        }
      } catch (error) {
        console.log(`Error al buscar usuario ${userId}:`, error.message);
      }
    }
    
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
        const userDocRef = doc(db, "Usuarios", "Información", userId, userId);
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