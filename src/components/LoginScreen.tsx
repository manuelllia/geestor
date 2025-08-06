
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <img 
              src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
              alt="GEESTOR Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            {t('welcome')}
          </h1>
          <p className="text-muted-foreground">
            {t('loginSubtitle')}
          </p>
        </CardHeader>
        <CardContent className="pb-12">
          <Button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{t('loginButton')}...</span>
              </div>
            ) : (
              t('loginButton')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
