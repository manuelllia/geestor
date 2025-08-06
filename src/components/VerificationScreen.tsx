
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface VerificationScreenProps {
  language: Language;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ language }) => {
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
        </CardHeader>
        <CardContent className="text-center pb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-lg font-medium text-primary">
              {t('verifyingAccount')}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationScreen;
