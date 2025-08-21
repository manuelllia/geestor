
import React from 'react';
import Dashboard from '../pages/Dashboard';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';
import BidAnalyzerView from './BidAnalyzer/BidAnalyzerView';
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import ContractRequestsListView from './ContractRequests/ContractRequestsListView';
import ChangeSheetsListView from './ChangeSheets/ChangeSheetsListView';
import EmployeeAgreementsListView from './EmployeeAgreements/EmployeeAgreementsListView';
import ExitInterviewsListView from './ExitInterviews/ExitInterviewsListView';
import RealEstateListView from './RealEstate/RealEstateListView';

interface Language {
  code: string;
  name: string;
}

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'maintenance-calendar':
        return <MaintenanceCalendarView />;
      case 'bid-analyzer':
        return <BidAnalyzerView />;
      case 'cost-analysis':
        return <CostAnalysisView />;
      case 'contract-requests':
        return <ContractRequestsListView />;
      case 'change-sheets':
        return <ChangeSheetsListView />;
      case 'employee-agreements':
        return <EmployeeAgreementsListView />;
      case 'exit-interviews':
        return <ExitInterviewsListView />;
      case 'real-estate':
        return <RealEstateListView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent;
