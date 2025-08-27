
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
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <img 
                src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
                alt="GEESTOR Logo" 
                className="h-16 sm:h-20 lg:h-24 w-auto mx-auto mb-6 sm:mb-8"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-3 sm:mb-4">
                {t('welcome')}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto">
                {t('loginSubtitle')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('operations')}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {t('costAnalysis')} y gestión operativa
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('technicalManagement')}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {t('maintenanceCalendar')} y control de equipos
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800 sm:col-span-2 lg:col-span-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('talentManagement')}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
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
          <div className="text-center py-12 sm:py-16 px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">Comprobadores</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4">{t('comingSoon')}</p>
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
          <div className="text-center py-12 sm:py-16 px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">{t('recordNotFound')}</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4">La sección solicitada no existe</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-2 sm:p-4 lg:p-6 xl:p-8 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
        <div className="min-w-0 w-full">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainContent;
