
import React from 'react';
import { Language } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';
import ContractRequestsListView from './ContractRequests/ContractRequestsListView';
import ChangeSheetsListView from './ChangeSheets/ChangeSheetsListView';
import EmployeeAgreementsListView from './EmployeeAgreements/EmployeeAgreementsListView';
import RealEstateMainView from './RealEstate/RealEstateMainView';
import PracticeEvaluationsListView from './PracticeEvaluations/PracticeEvaluationsListView';
import ExitInterviewsListView from './ExitInterviews/ExitInterviewsListView';
import UsersManagementView from './Users/UsersManagementView';
import Footer from './Footer';
import { Hammer, Hourglass, Wrench } from 'lucide-react'; 

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const { t } = useTranslation(language);

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <div className="text-center py-6 sm:py-8 lg:py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <img 
                src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
                alt="GEESTOR Logo" 
                className="h-12 sm:h-16 lg:h-20 w-auto mx-auto mb-4 sm:mb-6"
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2 sm:mb-3">
                {t('welcome')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
                {t('loginSubtitle')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('operations')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('costAnalysis')} y gestión operativa
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('technicalManagement')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('maintenanceCalendar')} y control de equipos
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-lg shadow-md border border-blue-200 dark:border-blue-800 sm:col-span-2 lg:col-span-1">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('talentManagement')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Recursos humanos y desarrollo profesional
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'analisis-coste':
        return <CostAnalysisView language={language} />;
      case 'calendario-mantenimiento':
        return <MaintenanceCalendarView language={language} />;
      case 'comprobadores':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-2xl transition-all duration-300 ease-in-out mx-2 sm:mx-4">
            <Hammer className="h-16 sm:h-20 lg:h-24 text-orange-600 dark:text-orange-400 mb-6 animate-bounce-slow" /> 
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-900 dark:text-blue-100 mb-3 tracking-tight">
              {t('featureTitleComprobadores') || 'Módulo de Comprobadores'}
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-xl leading-relaxed">
              {t('comingSoonDescriptionComprobadores') || 'Esta sección está actualmente en desarrollo. ¡Pronto estará disponible con nuevas funcionalidades avanzadas para la gestión de tus procesos de verificación y control!'}
            </p>
            
            <div className="flex items-center space-x-3 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900/50 p-3 px-4 rounded-full border border-blue-300 dark:border-blue-700 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Hourglass className="h-6 w-6 animate-spin-slow" />
                <span className="text-base sm:text-lg font-bold">{t('comingSoon') || 'Próximamente...'}</span>
            </div>
          </div>
        );
      case 'solicitudes-contratacion':
        return <ContractRequestsListView language={language} />;
      case 'hojas-cambio':
        return <ChangeSheetsListView 
          language={language} 
          onViewDetails={() => {}} 
          onCreateNew={() => {}} 
        />;
      case 'acuerdo-empleado':
        return <EmployeeAgreementsListView language={language} />;
      case 'gestion-inmuebles':
        return <RealEstateMainView language={language} />;
      case 'valoracion-practicas':
        return <PracticeEvaluationsListView language={language} />;
      case 'entrevista-salida':
        return <ExitInterviewsListView language={language} />;
      case 'usuarios':
        return <UsersManagementView language={language} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 sm:p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md mx-2 sm:mx-4">
            <Wrench className="h-12 sm:h-16 lg:h-20 text-red-500 dark:text-red-400 mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">{t('recordNotFound')}</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">La sección solicitada no existe o está en mantenimiento.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div className="w-full h-full min-h-0"> 
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainContent;
