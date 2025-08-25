
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface UserPermissions {
  // Permisos existentes de departamentos
  Per_Ope: boolean;
  Per_GT: boolean;
  Per_GDT: boolean;
  // Permisos de acciones
  Per_Create: boolean;
  Per_Delete: boolean;
  Per_View: boolean;
  Per_Modificate: boolean;
  // Nuevo permiso de usuarios
  Per_User: boolean;
}

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  const defaultPermissions: UserPermissions = {
    Per_Ope: true,
    Per_GT: true,
    Per_GDT: true,
    Per_Create: true,
    Per_Delete: true,
    Per_View: true,
    Per_Modificate: true,
    Per_User: false
  };

  const setupPermissionsListener = (uid: string) => {
    try {
      console.log('📊 Configurando listener de permisos para UID:', uid);
      setIsLoading(true);
      setError(null);

      // Nueva ruta: Usuarios/Información/Users/{uid}
      const userPermissionsDocRef = doc(db, 'Usuarios', 'Información', 'Users', uid);
      
      // Configurar listener en tiempo real
      const unsubscribe = onSnapshot(
        userPermissionsDocRef,
        (doc) => {
          console.log('📊 Documento de permisos consultado para UID:', uid);
          
          if (doc.exists()) {
            const data = doc.data();
            console.log('📊 Datos de permisos encontrados:', data);
            
            const userPermissions: UserPermissions = {
              // Permisos existentes de departamentos
              Per_Ope: data.Per_Ope ?? true,
              Per_GT: data.Per_GT ?? true,
              Per_GDT: data.Per_GDT ?? true,
              // Permisos de acciones
              Per_Create: data.Per_Create ?? true,
              Per_Delete: data.Per_Delete ?? true,
              Per_View: data.Per_View ?? true,
              Per_Modificate: data.Per_Modificate ?? true,
              // Permiso de usuarios
              Per_User: data.Per_User ?? false
            };
            
            setPermissions(userPermissions);
            localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
            console.log('📊 Permisos específicos cargados:', userPermissions);
            
          } else {
            console.log('📊 Usuario sin permisos específicos configurados, usando valores por defecto para UID:', uid);
            setPermissions(defaultPermissions);
            localStorage.setItem('userPermissions', JSON.stringify(defaultPermissions));
          }
          setIsLoading(false);
        },
        (err) => {
          console.error('❌ Error al escuchar cambios en permisos de usuario:', err);
          setError('Error al cargar permisos de usuario');
          
          // Intentar cargar desde localStorage como fallback
          const cachedPermissions = localStorage.getItem('userPermissions');
          if (cachedPermissions) {
            try {
              const parsed = JSON.parse(cachedPermissions);
              console.log('📊 Usando permisos desde cache:', parsed);
              setPermissions(parsed);
            } catch (parseError) {
              console.error('❌ Error parseando permisos desde cache:', parseError);
              setPermissions(defaultPermissions);
            }
          } else {
            setPermissions(defaultPermissions);
          }
          setIsLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('❌ Error al configurar listener de permisos:', err);
      setError('Error al configurar seguimiento de permisos');
      setPermissions(defaultPermissions);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('📊 Inicializando useUserPermissions...');
    let unsubscribePermissions: (() => void) | undefined;

    // Escuchar cambios de autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('📊 Usuario autenticado detectado, configurando permisos para:', user.uid);
        setCurrentUserUid(user.uid);
        
        // Limpiar listener anterior si existe
        if (unsubscribePermissions) {
          unsubscribePermissions();
        }
        
        unsubscribePermissions = setupPermissionsListener(user.uid);
      } else {
        console.log('📊 No hay usuario autenticado, usando permisos por defecto');
        setPermissions(defaultPermissions);
        setCurrentUserUid(null);
        setIsLoading(false);
        
        // Limpiar listener si existe
        if (unsubscribePermissions) {
          unsubscribePermissions();
          unsubscribePermissions = undefined;
        }
      }
    });

    // Escuchar evento personalizado de autenticación
    const handleUserAuthenticated = (event: CustomEvent) => {
      const { uid } = event.detail;
      console.log('📊 Evento de usuario autenticado recibido para UID:', uid);
      
      // Asegurar que cargamos los permisos
      if (unsubscribePermissions) {
        unsubscribePermissions();
      }
      unsubscribePermissions = setupPermissionsListener(uid);
    };

    window.addEventListener('user-authenticated', handleUserAuthenticated as EventListener);

    return () => {
      console.log('📊 Limpiando listeners de permisos...');
      unsubscribeAuth();
      if (unsubscribePermissions) {
        unsubscribePermissions();
      }
      window.removeEventListener('user-authenticated', handleUserAuthenticated as EventListener);
    };
  }, []);

  const refreshPermissions = async () => {
    console.log('📊 Refrescando permisos manualmente...');
    if (currentUserUid) {
      setupPermissionsListener(currentUserUid);
    }
  };

  return {
    permissions,
    isLoading,
    error,
    currentUserUid,
    refreshPermissions
  };
};
