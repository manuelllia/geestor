
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  language: string;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">
          {t('dashboard.title', 'Panel de Control')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('dashboard.welcome', 'Bienvenido al sistema de gestión empresarial')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-300">
              {t('dashboard.overview', 'Resumen General')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.overviewDesc', 'Estado actual del sistema')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.systemStatus', 'Sistema operativo y funcionando correctamente')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-300">
              {t('dashboard.quickActions', 'Acciones Rápidas')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.quickActionsDesc', 'Funciones más utilizadas')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.selectOption', 'Selecciona una opción del menú lateral')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-300">
              {t('dashboard.notifications', 'Notificaciones')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.notificationsDesc', 'Alertas y recordatorios')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.noNotifications', 'No hay notificaciones pendientes')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
