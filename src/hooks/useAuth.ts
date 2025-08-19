
import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';

interface AuthState {
  user: User | null;
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          name: firebaseUser.displayName || firebaseUser.email || 'Usuario',
          profilePicture: firebaseUser.photoURL || null
        };

        localStorage.setItem('geestor-user', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isVerifying: false
        });
        console.log("Usuario autenticado y cargado:", user.uid);
      } else {
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
        console.log("No hay usuario autenticado.");
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithMicrosoft = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAuthState(prev => ({ ...prev, isVerifying: true, isLoading: false }));
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockUser: User = {
        uid: 'mock-user-uid-123',
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
      await signOut(auth);
      
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
      
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
