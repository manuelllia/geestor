
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
    Per_GT: false,
    Per_GDT: false,
    Per_Create: true,
    Per_Delete: false,
    Per_View: true,
    Per_Modificate: true,
    Per_User: false
  };

  const setupPermissionsListener = (uid: string) => {
    console.log('📊 Configurando listener de permisos en tiempo real para UID:', uid);
    setIsLoading(true);
    setError(null);

    // Ruta: Usuarios/Información/Users/{uid}
    const userPermissionsDocRef = doc(db, 'Usuarios', 'Información', 'Users', uid);
    
    // Configurar listener en tiempo real
    const unsubscribe = onSnapshot(
      userPermissionsDocRef,
      (doc) => {
        console.log('📊 Actualización de permisos recibida para UID:', uid);
        
        if (doc.exists()) {
          const data = doc.data();
          console.log('📊 Datos de permisos actualizados:', data);
          
          const userPermissions: UserPermissions = {
            // Permisos existentes de departamentos
            Per_Ope: data.Per_Ope ?? true,
            Per_GT: data.Per_GT ?? false,
            Per_GDT: data.Per_GDT ?? false,
            // Permisos de acciones
            Per_Create: data.Per_Create ?? true,
            Per_Delete: data.Per_Delete ?? false,
            Per_View: data.Per_View ?? true,
            Per_Modificate: data.Per_Modificate ?? true,
            // Permiso de usuarios
            Per_User: data.Per_User ?? false
          };
          
          setPermissions(userPermissions);
          localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
          console.log('📊 Permisos cargados y almacenados en caché:', userPermissions);
          
        } else {
          console.log('📊 Documento de permisos no existe para UID:', uid, '- Usando valores por defecto');
          setPermissions(defaultPermissions);
          localStorage.setItem('userPermissions', JSON.stringify(defaultPermissions));
        }
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('❌ Error al escuchar cambios en permisos de usuario:', err);
        setError('Error al cargar permisos de usuario en tiempo real');
        
        // Intentar cargar desde localStorage como fallback
        const cachedPermissions = localStorage.getItem('userPermissions');
        if (cachedPermissions) {
          try {
            const parsed = JSON.parse(cachedPermissions);
            console.log('📊 Usando permisos desde cache como fallback:', parsed);
            setPermissions(parsed);
          } catch (parseError) {
            console.error('❌ Error parseando permisos desde cache:', parseError);
            setPermissions(defaultPermissions);
          }
        } else {
          console.log('📊 No hay permisos en cache, usando valores por defecto');
          setPermissions(defaultPermissions);
        }
        setIsLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    console.log('📊 Inicializando useUserPermissions con listener en tiempo real...');
    let unsubscribePermissions: (() => void) | undefined;

    // Escuchar cambios de autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('📊 Usuario autenticado detectado en permisos, configurando para:', user.uid);
        setCurrentUserUid(user.uid);
        
        // Limpiar listener anterior si existe
        if (unsubscribePermissions) {
          console.log('📊 Limpiando listener anterior de permisos');
          unsubscribePermissions();
        }
        
        unsubscribePermissions = setupPermissionsListener(user.uid);
      } else {
        console.log('📊 No hay usuario autenticado, limpiando permisos');
        setPermissions(null);
        setCurrentUserUid(null);
        setIsLoading(false);
        setError(null);
        localStorage.removeItem('userPermissions');
        
        // Limpiar listener si existe
        if (unsubscribePermissions) {
          unsubscribePermissions();
          unsubscribePermissions = undefined;
        }
      }
    });

    // Escuchar evento personalizado de autenticación para sincronización inmediata
    const handleUserAuthenticated = (event: CustomEvent) => {
      const { uid, isFirstLogin } = event.detail;
      console.log('📊 Evento de usuario autenticado recibido para UID:', uid, 'Primer login:', isFirstLogin);
      
      // Pequeño delay para permitir que se cree el documento si es primer login
      if (isFirstLogin) {
        setTimeout(() => {
          if (unsubscribePermissions) {
            unsubscribePermissions();
          }
          unsubscribePermissions = setupPermissionsListener(uid);
        }, 1000);
      } else {
        // Para usuarios existentes, configurar inmediatamente
        if (unsubscribePermissions) {
          unsubscribePermissions();
        }
        unsubscribePermissions = setupPermissionsListener(uid);
      }
    };

    window.addEventListener('user-authenticated', handleUserAuthenticated as EventListener);

    return () => {
      console.log('📊 Limpiando todos los listeners de permisos...');
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
      // No necesitamos hacer nada especial, el listener en tiempo real se encarga
      console.log('📊 Los permisos se actualizan automáticamente en tiempo real');
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
