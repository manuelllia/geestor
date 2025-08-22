import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import LoginScreen from '../components/LoginScreen';
import VerificationScreen from '../components/VerificationScreen';
import Header from '../components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import MainContent from '../components/MainContent';
import RealEstateMainView from '../components/RealEstate/RealEstateMainView';
import BidAnalyzerView from '../components/BidAnalyzer/BidAnalyzerView';
import MaintenanceCalendarView from '../components/MaintenanceCalendar/MaintenanceCalendarView';
import CostAnalysisView from '../components/CostAnalysis/CostAnalysisView';
import ChangeSheetsListView from '../components/ChangeSheets/ChangeSheetsListView';
import ContractRequestsListView from '../components/ContractRequests/ContractRequestsListView';
import EmployeeAgreementsListView from '../components/EmployeeAgreements/EmployeeAgreementsListView';
import ExitInterviewsListView from '../components/ExitInterviews/ExitInterviewsListView';
import PracticeEvaluationsListView from '../components/PracticeEvaluations/PracticeEvaluationsListView';
import UsersManagementView from '../components/Users/UsersManagementView';

export type ActiveView = 
  | 'home' 
  | 'users' 
  | 'realEstate' 
  | 'bidAnalyzer' 
  | 'costAnalysis' 
  | 'maintenanceCalendar'
  | 'changeSheets'
  | 'contractRequests' 
  | 'employeeAgreements'
  | 'exitInterviews'
  | 'practiceEvaluations';

const Index: React.FC = () => {
  const { user, logout, isAuthenticated, isVerified } = useAuth();
  const { language } = usePreferences();
  const [activeView, setActiveView] = useState<ActiveView>('home');

  useEffect(() => {
    const storedView = localStorage.getItem('activeView');
    if (storedView) {
      setActiveView(storedView as ActiveView);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (!isVerified) {
    return <VerificationScreen />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'users':
        return <UsersManagementView language={language} />;
      case 'realEstate':
        return <RealEstateMainView language={language} />;
      case 'bidAnalyzer':
        return <BidAnalyzerView language={language} />;
      case 'costAnalysis':
        return <CostAnalysisView language={language} />;
      case 'maintenanceCalendar':
        return <MaintenanceCalendarView language={language} />;
      case 'changeSheets':
        return <ChangeSheetsListView language={language} />;
      case 'contractRequests':
        return <ContractRequestsListView language={language} />;
      case 'employeeAgreements':
        return <EmployeeAgreementsListView language={language} />;
      case 'exitInterviews':
        return <ExitInterviewsListView language={language} />;
      case 'practiceEvaluations':
        return <PracticeEvaluationsListView language={language} />;
      default:
        return <MainContent language={language} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <AppSidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          language={language}
        />
        <div className="flex-1 flex flex-col">
          <Header user={user} onLogout={logout} />
          <main className="flex-1 overflow-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
