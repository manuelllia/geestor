
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserUid(user.uid);
        setupPermissionsListener(user.uid);
      } else {
        // Si no hay usuario autenticado, usamos permisos por defecto
        setPermissions({
          Per_Ope: true,
          Per_GT: true,
          Per_GDT: true,
          Per_Create: true,
          Per_Delete: true,
          Per_View: true,
          Per_Modificate: true,
          Per_User: false // Por defecto no tiene permisos de usuario
        });
        setCurrentUserUid(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const setupPermissionsListener = (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ruta: Usuarios/Información/{uid}/{uid}
      const userPermissionsDocRef = doc(db, 'Usuarios', 'Información', uid, uid);
      
      // Configurar listener en tiempo real
      const unsubscribe = onSnapshot(
        userPermissionsDocRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setPermissions({
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
            });
            console.log('Permisos actualizados en tiempo real:', data);
          } else {
            console.log('No se encontraron permisos específicos, usando valores por defecto');
            // Si no existen permisos específicos, usar valores por defecto
            setPermissions({
              Per_Ope: true,
              Per_GT: true,
              Per_GDT: true,
              Per_Create: true,
              Per_Delete: true,
              Per_View: true,
              Per_Modificate: true,
              Per_User: false
            });
          }
          setIsLoading(false);
        },
        (err) => {
          console.error('Error al escuchar cambios en permisos de usuario:', err);
          setError('Error al cargar permisos de usuario');
          // En caso de error, usar permisos por defecto
          setPermissions({
            Per_Ope: true,
            Per_GT: true,
            Per_GDT: true,
            Per_Create: true,
            Per_Delete: true,
            Per_View: true,
            Per_Modificate: true,
            Per_User: false
          });
          setIsLoading(false);
        }
      );

      // Cleanup function para desconectar el listener
      return unsubscribe;
    } catch (err) {
      console.error('Error al configurar listener de permisos:', err);
      setError('Error al configurar seguimiento de permisos');
      setPermissions({
        Per_Ope: true,
        Per_GT: true,
        Per_GDT: true,
        Per_Create: true,
        Per_Delete: true,
        Per_View: true,
        Per_Modificate: true,
        Per_User: false
      });
      setIsLoading(false);
    }
  };

  const refreshPermissions = async () => {
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
