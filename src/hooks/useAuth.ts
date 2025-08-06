
import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isVerifying: false
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('geestor-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isVerifying: false
        });
      } catch (error) {
        localStorage.removeItem('geestor-user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      // Check if we're returning from Microsoft OAuth
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const savedState = sessionStorage.getItem('oauth-state');

      if (code && state && state === savedState) {
        handleOAuthCallback(code);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // En un entorno real, aquí enviarías el código al backend para intercambiarlo por un token
      // Por ahora, simularemos la respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAuthState(prev => ({ ...prev, isVerifying: true, isLoading: false }));
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock user data - en producción vendría del token de Microsoft
      const mockUser: User = {
        id: '1',
        email: 'usuario@empresa.com',
        name: 'Usuario Demo',
        profilePicture: 'https://via.placeholder.com/40'
      };

      localStorage.setItem('geestor-user', JSON.stringify(mockUser));
      sessionStorage.removeItem('oauth-state');
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        isVerifying: false
      });
    } catch (error) {
      console.error('OAuth callback failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isVerifying: false 
      }));
    }
  };

  const loginWithMicrosoft = async () => {
    // Esta función ahora se maneja en LoginScreen
    // Aquí podrías agregar lógica adicional si es necesaria
  };

  const logout = () => {
    localStorage.removeItem('geestor-user');
    sessionStorage.removeItem('oauth-state');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isVerifying: false
    });
  };

  return {
    ...authState,
    loginWithMicrosoft,
    logout
  };
};
