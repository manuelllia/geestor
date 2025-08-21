
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock } from 'lucide-react';

const VerificationScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cuenta en Verificación
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Clock className="h-5 w-5" />
            <span className="font-medium">En proceso de revisión</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Tu cuenta está siendo revisada por nuestro equipo. Recibirás una notificación una vez que el proceso haya sido completado.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Este proceso puede tomar entre 24-48 horas hábiles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationScreen;
