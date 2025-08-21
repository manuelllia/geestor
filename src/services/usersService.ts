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
    
    // OPCIÓN 1: Si los documentos de usuario están directamente en la colección "Información"
    // const usersRef = collection(db, "Usuarios", "Información");
    // const querySnapshot = await getDocs(usersRef);
    
    // OPCIÓN 2: Si necesitas acceder a una subcolección específica
    // Primero, obtén todos los documentos de "Usuarios/Información"
    const usersRef = collection(db, "Usuarios", "Información");
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    
    console.log(`Encontrados ${querySnapshot.docs.length} documentos en la colección`);
    
    // Para cada documento de usuario
    for (const userDoc of querySnapshot.docs) {
      const userId = userDoc.id;
      console.log(`Procesando usuario: ${userId}`);
      
      try {
        // OPCIÓN A: Si los datos están en el documento principal
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
        } else {
          // OPCIÓN B: Si los datos están en un subdocumento con el mismo ID
          const userSubDocRef = doc(db, "Usuarios", "Información", userId, userId);
          const userSubDoc = await getDoc(userSubDocRef);
          
          if (userSubDoc.exists()) {
            const subData = userSubDoc.data();
            
            if (subData.nombre && subData.email) {
              users.push({
                uid: userId,
                nombre: subData.nombre || '',
                email: subData.email || '',
                Per_Create: subData.Per_Create ?? true,
                Per_Delete: subData.Per_Delete ?? true,
                Per_Modificate: subData.Per_Modificate ?? true,
                Per_View: subData.Per_View ?? true,
                Per_Ope: subData.Per_Ope ?? true,
                Per_GT: subData.Per_GT ?? true,
                Per_GDT: subData.Per_GDT ?? true,
                Per_User: subData.Per_User ?? false
              });
            }
          } else {
            console.log(`No se encontró el subdocumento para el usuario: ${userId}`);
          }
        }
      } catch (userError) {
        console.error(`Error al obtener datos del usuario ${userId}:`, userError);
      }
    }
    
    console.log('Usuarios obtenidos exitosamente:', users.length);
    console.log('Usuarios:', users);
    return users;
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    console.error('Detalles del error:', error);
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
    
    const usersRef = collection(db, "Usuarios", "Información");
    const querySnapshot = await getDocs(usersRef);
    
    console.log(`Documentos encontrados en "Usuarios/Información": ${querySnapshot.docs.length}`);
    
    for (const doc of querySnapshot.docs) {
      console.log(`\n--- Documento ID: ${doc.id} ---`);
      console.log('Datos del documento:', doc.data());
      
      // Verificar si hay subcolecciones
      try {
        const subCollectionRef = collection(db, "Usuarios", "Información", doc.id);
        const subSnapshot = await getDocs(subCollectionRef);
        console.log(`Subdocumentos en ${doc.id}:`, subSnapshot.docs.length);
        
        subSnapshot.forEach(subDoc => {
          console.log(`  Subdoc ID: ${subDoc.id}`, subDoc.data());
        });
      } catch (subError) {
        console.log('No hay subcolecciones o error:', subError.message);
      }
    }
    
  } catch (error) {
    console.error('Error en debug:', error);
  }
};