
import React from 'react';
import { Language } from '../utils/translations';
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';
import ContractRequestsListView from './ContractRequests/ContractRequestsListView';
import ChangeSheetsListView from './ChangeSheets/ChangeSheetsListView';
import EmployeeAgreementsListView from './EmployeeAgreements/EmployeeAgreementsListView';
import RealEstateListView from './RealEstate/RealEstateListView';
import PracticeEvaluationsListView from './PracticeEvaluations/PracticeEvaluationsListView';
import ExitInterviewsListView from './ExitInterviews/ExitInterviewsListView';
import UsersManagementView from './Users/UsersManagementView';
import Footer from './Footer';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <img 
                src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
                alt="GEESTOR Logo" 
                className="h-24 w-auto mx-auto mb-8"
              />
              <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Bienvenido a GEESTOR
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Sistema integral de gestión empresarial del Grupo Empresarial Electromédico
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Operaciones
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Análisis de costes y gestión operativa
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Gestión Técnica
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mantenimiento y control de equipos
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Gestión de Talento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
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
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Comprobadores</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Funcionalidad en desarrollo</p>
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
        return <RealEstateListView onBack={() => {}} />;
      case 'valoracion-practicas':
        return <PracticeEvaluationsListView language={language} />;
      case 'entrevista-salida':
        return <ExitInterviewsListView language={language} />;
      case 'usuarios':
        return <UsersManagementView language={language} />;
      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Sección no encontrada</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">La sección solicitada no existe</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default MainContent;
