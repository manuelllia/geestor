
import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isVerifying: false
  });

  useEffect(() => {
    // Configurar listener de cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Si hay un usuario autenticado en Firebase, crear el objeto User
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email || 'Usuario',
          profilePicture: firebaseUser.photoURL || undefined
        };

        // Guardar en localStorage para persistencia
        localStorage.setItem('geestor-user', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isVerifying: false
        });
      } else {
        // No hay usuario autenticado
        localStorage.removeItem('geestor-user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isVerifying: false
        });
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
      const mockUser: User = {
        id: '1',
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
      
      // Limpiar localStorage
      localStorage.removeItem('geestor-user');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('userData');
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
