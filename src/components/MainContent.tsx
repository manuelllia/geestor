import React from 'react';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Calendar, BarChart2, Calculator } from 'lucide-react';
import ChangeSheetsListView from './ChangeSheets/ChangeSheetsListView';
import ContractRequestsListView from './ContractRequests/ContractRequestsListView';
import EmployeeAgreementsListView from './EmployeeAgreements/EmployeeAgreementsListView';
import ExitInterviewsListView from './ExitInterviews/ExitInterviewsListView';
import PracticeEvaluationsListView from './PracticeEvaluations/PracticeEvaluationsListView';
import RealEstateDashboard from './RealEstate/RealEstateDashboard';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import BidAnalyzerView from './BidAnalyzer/BidAnalyzerView';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const { t } = useTranslation(language);

  const handleViewDetails = (id: string) => {
    console.log('Ver detalles:', id);
  };

  const handleCreateNew = () => {
    console.log('Crear nuevo');
  };

  const handleImportData = () => {
    console.log('Importar datos');
  };

  const handleViewTables = () => {
    console.log('Ver tablas');
  };

  const renderMainDashboard = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center space-x-3">
        <Home className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          {t('dashboard')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <Calculator className="w-5 h-5" />
              <span>{t('costAnalysis')}</span>
            </CardTitle>
            <CardDescription>
              {t('costAnalysisDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {/* Navigate to cost analysis */}}
            >
              {t('analyzeCosts')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <Calendar className="w-5 h-5" />
              <span>{t('maintenanceCalendar')}</span>
            </CardTitle>
            <CardDescription>
              {t('maintenanceCalendarDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {/* Navigate to maintenance calendar */}}
            >
              {t('calendar')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <BarChart2 className="w-5 h-5" />
              <span>{t('practiceEvaluation')}</span>
            </CardTitle>
            <CardDescription>
              {t('practiceEvaluationDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {/* Navigate to practice evaluations */}}
            >
              {t('generateEvaluationLink')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return renderMainDashboard();
        
      case 'analisis-coste':
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('costAnalysis')}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t('costAnalysisDescription')}
              </p>
            </div>
            <BidAnalyzerView language={language} />
          </div>
        );
        
      case 'calendario-mantenimiento':
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('maintenanceCalendar')}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t('maintenanceCalendarDescription')}
              </p>
            </div>
            <MaintenanceCalendarView language={language} />
          </div>
        );
        
      case 'solicitudes-contratacion':
        return <ContractRequestsListView language={language} />;
        
      case 'hojas-cambio':
        return (
          <ChangeSheetsListView 
            language={language}
            onViewDetails={handleViewDetails}
            onCreateNew={handleCreateNew}
          />
        );
        
      case 'acuerdo-empleado':
        return (
          <EmployeeAgreementsListView 
            language={language}
            onViewDetails={handleViewDetails}
            onCreateNew={handleCreateNew}
          />
        );
        
      case 'valoracion-practicas':
        return <PracticeEvaluationsListView />;
        
      case 'entrevista-salida':
        return <ExitInterviewsListView language={language} />;
        
      case 'gestion-inmuebles':
        return (
          <RealEstateDashboard 
            language={language}
            onImportData={handleImportData}
            onViewTables={handleViewTables}
          />
        );
        
      case 'comprobadores':
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Comprobadores
            </h1>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('detailViewPlaceholder')} - {t('comingSoon')}
                </p>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return renderMainDashboard();
    }
  };

  return (
    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      {renderContent()}
    </main>
  );
};

export default MainContent;
