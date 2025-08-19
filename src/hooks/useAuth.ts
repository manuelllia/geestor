import { useState, useEffect } from 'react';
// Importamos AppUser directamente desde el UserProfileModal, ya que no puedes crear nuevos archivos
// Esto crea una dependencia circular si UserProfileModal también importa User desde aquí.
// Sin embargo, si App.tsx es el intermediario, esto debería funcionar.
import { AppUser } from '../components/UserProfileModal'; // <-- IMPORTANTE: Ajustar esta ruta si UserProfileModal no está en 'components'
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth'; // Importamos FirebaseAuthUser para tipado

// Definición de AuthState (no hay cambios aquí)
interface AuthState {
  user: AppUser | null; // CAMBIO: Usar AppUser aquí
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isVerifying: false
  });

  useEffect(() => {
    // Configurar listener de cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseAuthUser | null) => { // Tipar firebaseUser
      if (firebaseUser) {
        // Si hay un usuario autenticado en Firebase, crear el objeto AppUser
        const user: AppUser = { // CAMBIO: Crear objeto de tipo AppUser
          uid: firebaseUser.uid, // CAMBIO: Usar 'uid' en lugar de 'id'
          email: firebaseUser.email || null, // Asegurar que es null si no existe
          name: firebaseUser.displayName || firebaseUser.email || 'Usuario',
          profilePicture: firebaseUser.photoURL || null // Asegurar que es null si no existe
        };

        // Guardar en localStorage para persistencia
        // Es recomendable solo guardar el UID o datos no sensibles.
        // Los permisos se cargarán de Firestore cada vez que el modal se abra.
        localStorage.setItem('geestor-user', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isVerifying: false
        });
        console.log("Usuario autenticado y cargado:", user.uid);
      } else {
        // No hay usuario autenticado
        localStorage.removeItem('geestor-user');
        // También limpia otros elementos relacionados si existen para evitar estados inconsistentes
        localStorage.removeItem('userPermissions'); 
        localStorage.removeItem('userData');
        sessionStorage.removeItem('oauth-state');

        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isVerifying: false
        });
        console.log("No hay usuario autenticado.");
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const loginWithMicrosoft = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simular proceso de verificación en desarrollo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAuthState(prev => ({ ...prev, isVerifying: true, isLoading: false }));
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock user data para desarrollo
      // CAMBIO: Asegurarse de que el mock user sea de tipo AppUser con 'uid'
      const mockUser: AppUser = {
        uid: 'mock-user-uid-123', // Usar 'uid'
        email: 'usuario@empresa.com',
        name: 'Usuario Demo',
        profilePicture: 'https://via.placeholder.com/40'
      };

      localStorage.setItem('geestor-user', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        isVerifying: false
      });
      console.log("Login de Microsoft simulado exitosamente para UID:", mockUser.uid);
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isVerifying: false 
      }));
    }
  };

  const logout = async () => {
    try {
      // Cerrar sesión en Firebase Authentication
      await signOut(auth);
      
      // Limpiar localStorage (importante para una salida limpia)
      localStorage.removeItem('geestor-user');
      localStorage.removeItem('userPermissions'); // Limpia permisos locales si existieran
      localStorage.removeItem('userData'); // Limpia userData local si existiera
      sessionStorage.removeItem('oauth-state');
      
      // Actualizar estado
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerifying: false
      });
      
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aunque haya error en Firebase, limpiar el estado local
      localStorage.removeItem('geestor-user');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('oauth-state');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerifying: false
      });
    }
  };

  return {
    ...authState,
    loginWithMicrosoft,
    logout
  };
};