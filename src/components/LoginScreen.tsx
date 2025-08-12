
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from '@/components/ui/use-toast';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
  language: Language;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading, language }) => {
  const { t } = useTranslation(language);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Función para manejar el login emulado con Microsoft
  const handleMicrosoftLogin = () => {
    // En entorno de desarrollo (Lovable), emulamos el login
    if (process.env.NODE_ENV === 'development') {
      onLogin();
      return;
    }

    // En producción, configuración real de Microsoft OAuth 2.0
    const clientId = process.env.VITE_MICROSOFT_CLIENT_ID || 'your-client-id';
    const redirectUri = encodeURIComponent(window.location.origin);
    const responseType = 'code';
    const scope = encodeURIComponent('openid profile email User.Read');
    const state = Math.random().toString(36).substring(7);
    
    // Guardar state para validación posterior
    sessionStorage.setItem('oauth-state', state);
    
    // URL de autorización de Microsoft
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    // Redirigir a Microsoft para autenticación
    window.location.href = authUrl;
  };

  // Función para manejar el login con correo y contraseña
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: language === 'es' ? "Por favor, completa todos los campos" : "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsEmailLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Crear objeto de usuario para el estado de la aplicación
      const userData = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Usuario',
        profilePicture: user.photoURL || 'https://via.placeholder.com/40'
      };

      // Guardar usuario en localStorage
      localStorage.setItem('geestor-user', JSON.stringify(userData));
      
      toast({
        title: language === 'es' ? "Inicio de sesión exitoso" : "Login successful",
        description: language === 'es' ? "Bienvenido a GEESTOR" : "Welcome to GEESTOR",
      });

      // Llamar a la función onLogin para actualizar el estado de autenticación
      onLogin();
      
    } catch (error: any) {
      console.error('Error en login con email:', error);
      
      let errorMessage = language === 'es' ? 'Error al iniciar sesión' : 'Login error';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = language === 'es' ? 'Credenciales incorrectas' : 'Invalid credentials';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = language === 'es' ? 'Correo electrónico inválido' : 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = language === 'es' ? 'Demasiados intentos. Inténtalo más tarde' : 'Too many attempts. Try again later';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      {/* Logo principal fuera del card */}
      <div className="mb-12">
        <div className="mx-auto w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center shadow-lg">
          <img 
            src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
            alt="GEESTOR Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-primary mt-6 text-center">
          GEESTOR
        </h1>
        <p className="text-muted-foreground text-center mt-2 text-lg">
          Sistema de Gestión Empresarial
        </p>
      </div>

      {/* Card de login */}
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('welcome')}
          </h2>
          <p className="text-muted-foreground">
            {t('loginSubtitle')}
          </p>
        </CardHeader>
        <CardContent className="pb-8 space-y-6">
          {/* Formulario de login con correo y contraseña */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {language === 'es' ? 'Correo electrónico' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'es' ? 'tu@correo.com' : 'your@email.com'}
                disabled={isEmailLoading || isLoading}
                className="w-full"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {language === 'es' ? 'Contraseña' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'es' ? 'Tu contraseña' : 'Your password'}
                  disabled={isEmailLoading || isLoading}
                  className="w-full pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isEmailLoading || isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isEmailLoading || isLoading}
            >
              {isEmailLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{language === 'es' ? 'Iniciando sesión...' : 'Signing in...'}</span>
                </div>
              ) : (
                language === 'es' ? 'Iniciar sesión' : 'Sign in'
              )}
            </Button>
          </form>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                {language === 'es' ? 'O continúa con' : 'Or continue with'}
              </span>
            </div>
          </div>

          {/* Botón oficial de Microsoft */}
          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading || isEmailLoading}
            className="w-full h-12 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded-md transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{t('loginButton')}...</span>
              </div>
            ) : (
              <>
                <svg width="21" height="21" viewBox="0 0 21 21" className="fill-current">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="12" y="1" width="9" height="9" fill="#00a4ef"/>
                  <rect x="1" y="12" width="9" height="9" fill="#ffb900"/>
                  <rect x="12" y="12" width="9" height="9" fill="#7fba00"/>
                </svg>
                <span>{t('loginButton')}</span>
              </>
            )}
          </button>
          
          {/* Información adicional para desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              * Modo desarrollo: Login emulado disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
