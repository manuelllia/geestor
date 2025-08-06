
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
  language: Language;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading, language }) => {
  const { t } = useTranslation(language);

  // Función para manejar el login emulado
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
        <CardContent className="pb-8">
          {/* Botón oficial de Microsoft */}
          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
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
              * Modo desarrollo: Login emulado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
