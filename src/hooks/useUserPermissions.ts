
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface UserPermissions {
  Per_Ope: boolean;
  Per_GT: boolean;
  Per_GDT: boolean;
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
        // Configurar listener en tiempo real para los permisos del usuario
        setupPermissionsListener(user.uid);
      } else {
        // Si no hay usuario autenticado, usamos permisos por defecto
        setPermissions({
          Per_Ope: true,
          Per_GT: true,
          Per_GDT: true
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
              Per_Ope: data.Per_Ope ?? true,
              Per_GT: data.Per_GT ?? true,
              Per_GDT: data.Per_GDT ?? true
            });
            console.log('Permisos actualizados en tiempo real:', data);
          } else {
            console.log('No se encontraron permisos específicos, usando valores por defecto');
            // Si no existen permisos específicos, usar valores por defecto
            setPermissions({
              Per_Ope: true,
              Per_GT: true,
              Per_GDT: true
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
            Per_GDT: true
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
        Per_GDT: true
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
