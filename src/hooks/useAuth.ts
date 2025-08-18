
import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const ADMIN_UID = 'f5hxxnZBA9Xn7hxkdpzkcdFkfEz1';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isVerifying: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.uid === ADMIN_UID;
        
        const user: User = {
          id: firebaseUser.uuid || firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Usuario',
          profilePicture: firebaseUser.photoURL || undefined,
          isAdmin
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isVerifying: false
        });
        
        // Guardar en localStorage también
        localStorage.setItem('geestor-user', JSON.stringify(user));
      } else {
        // No hay usuario autenticado
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isVerifying: false
        });
        localStorage.removeItem('geestor-user');
      }
    });

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
        id: ADMIN_UID, // Usar UID de admin para pruebas
        email: 'admin@empresa.com',
        name: 'Administrador Demo',
        profilePicture: 'https://via.placeholder.com/40',
        isAdmin: true
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
      // Cerrar sesión en Firebase
      await signOut(auth);
      
      // Limpiar localStorage
      localStorage.removeItem('geestor-user');
      localStorage.removeItem('geestor-language');
      
      // Actualizar estado
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerifying: false
      });
      
      // Redirigir a login
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar limpieza local aunque falle Firebase
      localStorage.removeItem('geestor-user');
      localStorage.removeItem('geestor-language');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerifying: false
      });
      window.location.href = '/';
    }
  };

  return {
    ...authState,
    loginWithMicrosoft,
    logout
  };
};
