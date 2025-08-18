
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
        await fetchUserPermissions(user.uid);
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

  const fetchUserPermissions = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ruta: Usuarios/Información/{uid}/{uid}
      const userPermissionsDocRef = doc(db, 'Usuarios', 'Información', uid, uid);
      const userPermissionsDoc = await getDoc(userPermissionsDocRef);

      if (userPermissionsDoc.exists()) {
        const data = userPermissionsDoc.data();
        setPermissions({
          Per_Ope: data.Per_Ope ?? true,
          Per_GT: data.Per_GT ?? true,
          Per_GDT: data.Per_GDT ?? true
        });
        console.log('Permisos de usuario obtenidos:', data);
      } else {
        console.log('No se encontraron permisos específicos, usando valores por defecto');
        // Si no existen permisos específicos, usar valores por defecto
        setPermissions({
          Per_Ope: true,
          Per_GT: true,
          Per_GDT: true
        });
      }
    } catch (err) {
      console.error('Error al obtener permisos de usuario:', err);
      setError('Error al cargar permisos de usuario');
      // En caso de error, usar permisos por defecto
      setPermissions({
        Per_Ope: true,
        Per_GT: true,
        Per_GDT: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = async () => {
    if (currentUserUid) {
      await fetchUserPermissions(currentUserUid);
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
