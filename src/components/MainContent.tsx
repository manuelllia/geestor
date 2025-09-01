
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
// Importamos los iconos necesarios de lucide-react
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
          // Contenedor principal con centrado y altura para llenar el espacio disponible
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-2xl transition-all duration-300 ease-in-out">
            {/* Icono principal, grande y con animación de rebote para "en construcción" */}
            <Hammer className="h-28 w-28 text-orange-600 dark:text-orange-400 mb-8 animate-bounce-slow" /> 
            
            {/* Título de la sección */}
            <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-4 tracking-tight">
              {t('featureTitleComprobadores') || 'Módulo de Comprobadores'}
            </h2>
            
            {/* Descripción detallada */}
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
              {t('comingSoonDescriptionComprobadores') || 'Esta sección está actualmente en desarrollo. ¡Pronto estará disponible con nuevas funcionalidades avanzadas para la gestión de tus procesos de verificación y control!'}
            </p>
            
            {/* Indicador de "Próximamente" con icono y estilo destacado */}
            <div className="flex items-center space-x-4 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900/50 p-4 px-6 rounded-full border border-blue-300 dark:border-blue-700 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Hourglass className="h-8 w-8 animate-spin-slow" /> {/* Reloj de arena girando suavemente */}
                <span className="text-2xl font-bold">{t('comingSoon') || 'Próximamente...'}</span>
            </div>

            {/* Opcional: una barra de progreso sutil o un mensaje extra */}
            {/* <div className="w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-10">
                <div className="bg-blue-600 h-2.5 rounded-full w-[45%]" style={{ width: '45%' }}></div>
            </div> */}
          </div>
        );
      case 'solicitudes-contratacion':
        return <ContractRequestsListView language={language} />;
      case 'hojas-cambio':
        return <ChangeSheetsListView 
          language={language}
          onCreateNew={() => console.log('Create new change sheet')}
          onEdit={(id) => console.log('Edit change sheet:', id)}
          onView={(id) => console.log('View change sheet:', id)}
          onImport={() => console.log('Import change sheets')}
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
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Wrench className="h-20 w-20 text-red-500 dark:text-red-400 mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">{t('recordNotFound')}</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4">La sección solicitada no existe o está en mantenimiento.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-2 sm:p-4 lg:p-6 xl:p-8 bg-gray-50 dark:bg-gray-900 overflow-auto">
        {/* Aseguramos que este div ocupe todo el espacio vertical disponible */}
        <div className="min-w-0 w-full h-full"> 
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainContent;
