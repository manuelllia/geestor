
import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { auth, db } from '../lib/firebase';
import { 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseAuthUser,
  sendEmailVerification 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
}

// Función para enviar correo de bienvenida
const sendWelcomeEmail = async (user: FirebaseAuthUser) => {
  try {
    console.log('📧 Enviando correo de bienvenida a:', user.email);
    // En un entorno real, aquí usarías Firebase Functions o un servicio de email
    // Por ahora, simulamos el envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('📧 Correo de bienvenida enviado exitosamente');
  } catch (error) {
    console.error('❌ Error enviando correo de bienvenida:', error);
  }
};

// Función para verificar si es el primer login del usuario
const checkAndHandleFirstLogin = async (firebaseUser: FirebaseAuthUser): Promise<boolean> => {
  try {
    console.log('🔍 Verificando si es el primer login para:', firebaseUser.uid);
    
    const userDocRef = doc(db, 'Usuarios', 'Información', 'Users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Es el primer login - crear documento de usuario
      console.log('🆕 Primer login detectado, creando documento de usuario');
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
        createdAt: serverTimestamp(),
        firstLoginAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isFirstLogin: false, // Lo marcamos como false después del primer login
        // Permisos por defecto
        Per_Create: true,
        Per_Delete: false,
        Per_Modificate: true,
        Per_View: true,
        Per_Ope: true,
        Per_GT: false,
        Per_GDT: false,
        Per_User: false
      };
      
      await setDoc(userDocRef, userData);
      console.log('✅ Documento de usuario creado con permisos por defecto');
      
      // Enviar correo de bienvenida
      await sendWelcomeEmail(firebaseUser);
      
      return true; // Es primer login
    } else {
      // No es el primer login - actualizar última conexión
      console.log('🔄 Usuario existente, actualizando última conexión');
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp()
      });
      
      return false; // No es primer login
    }
  } catch (error) {
    console.error('❌ Error verificando primer login:', error);
    return false;
  }
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isVerifying: false
  });

  useEffect(() => {
    console.log('🔐 Inicializando listener de autenticación...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      console.log('🔐 Estado de autenticación cambió:', firebaseUser?.uid || 'No usuario');
      
      if (firebaseUser) {
        console.log('🔐 Usuario autenticado detectado, procesando...');
        
        // Activar verificación mientras procesamos
        setAuthState(prev => ({
          ...prev,
          isVerifying: true,
          isLoading: false
        }));

        try {
          // Verificar si es primer login y manejar el documento
          const isFirstLogin = await checkAndHandleFirstLogin(firebaseUser);
          
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || null,
            name: firebaseUser.displayName || firebaseUser.email || 'Usuario',
            profilePicture: firebaseUser.photoURL || null
          };

          localStorage.setItem('geestor-user', JSON.stringify(user));
          
          // Simular tiempo de verificación si es necesario
          if (isFirstLogin) {
            console.log('🎉 Procesando primer login del usuario...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            isVerifying: false
          });
          
          console.log('🔐 Usuario autenticado y cargado:', user.uid);
          console.log('📊 Disparando evento para cargar permisos...');
          
          // Disparar evento personalizado para que useUserPermissions se actualice
          window.dispatchEvent(new CustomEvent('user-authenticated', { 
            detail: { uid: user.uid, isFirstLogin } 
          }));
          
        } catch (error) {
          console.error('❌ Error procesando usuario autenticado:', error);
          setAuthState(prev => ({
            ...prev,
            isVerifying: false,
            isLoading: false
          }));
        }
        
      } else {
        console.log('🔐 No hay usuario autenticado, limpiando datos...');
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
    });

    return () => {
      console.log('🔐 Limpiando listener de autenticación...');
      unsubscribe();
    };
  }, []);

  const loginWithMicrosoft = async () => {
    try {
      console.log('🔐 Iniciando login con Microsoft...');
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simular el proceso de login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser: User = {
        uid: 'mock-user-uid-123',
        email: 'usuario@empresa.com',
        name: 'Usuario Demo',
        profilePicture: 'https://via.placeholder.com/40'
      };

      localStorage.setItem('geestor-user', JSON.stringify(mockUser));
      
      // No establecemos el estado aquí, dejamos que onAuthStateChanged lo maneje
      console.log('🔐 Login de Microsoft completado, esperando verificación...');
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isVerifying: false 
      }));
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 Cerrando sesión...');
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
      
      console.log('🔐 Sesión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
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
