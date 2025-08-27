
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
import { useResponsive } from '../hooks/useResponsive';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const { t } = useTranslation(language);
  const { isMobile } = useResponsive();

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <div className="text-center responsive-padding">
            <div className="responsive-container">
              <img 
                src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
                alt="GEESTOR Logo" 
                className="h-16 sm:h-20 lg:h-24 w-auto mx-auto mb-6"
              />
              <h1 className="responsive-title font-bold text-primary mb-4">
                {t('welcome')}
              </h1>
              <p className="responsive-text text-muted-foreground mb-8 max-w-3xl mx-auto">
                {t('loginSubtitle')}
              </p>
              <div className="responsive-grid responsive-gap mt-8">
                <div className="bg-card p-6 rounded-lg shadow-md border">
                  <h3 className="responsive-subtitle font-semibold text-primary mb-2">
                    {t('operations')}
                  </h3>
                  <p className="responsive-text text-muted-foreground">
                    {t('costAnalysis')} y gestión operativa
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-md border">
                  <h3 className="responsive-subtitle font-semibold text-primary mb-2">
                    {t('technicalManagement')}
                  </h3>
                  <p className="responsive-text text-muted-foreground">
                    {t('maintenanceCalendar')} y control de equipos
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-md border">
                  <h3 className="responsive-subtitle font-semibold text-primary mb-2">
                    {t('talentManagement')}
                  </h3>
                  <p className="responsive-text text-muted-foreground">
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
          <div className="text-center responsive-padding">
            <h2 className="responsive-title font-bold text-primary">Comprobadores</h2>
            <p className="responsive-text text-muted-foreground mt-4">{t('comingSoon')}</p>
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
          <div className="text-center responsive-padding">
            <h2 className="responsive-title font-bold text-primary">{t('recordNotFound')}</h2>
            <p className="responsive-text text-muted-foreground mt-4">La sección solicitada no existe</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default MainContent;
