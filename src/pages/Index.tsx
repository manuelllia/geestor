
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import LoginScreen from '../components/LoginScreen';
import VerificationScreen from '../components/VerificationScreen';
import { Header } from '../components/Header';
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
  const { user, logout, isAuthenticated, isVerifying, loginWithMicrosoft } = useAuth();
  const { preferences, setLanguage, setTheme } = usePreferences();
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

  const handleSectionChange = (section: string) => {
    setActiveView(section as ActiveView);
  };

  const handleUserUpdate = (updatedUser: any) => {
    // Handle user update logic here
    console.log('User updated:', updatedUser);
  };

  const handlePermissionsUpdate = () => {
    // Handle permissions update logic here
    console.log('Permissions updated');
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={loginWithMicrosoft}
        isLoading={isVerifying}
        language={preferences.language}
      />
    );
  }

  if (isVerifying) {
    return <VerificationScreen language={preferences.language} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'users':
        return <UsersManagementView language={preferences.language} />;
      case 'realEstate':
        return <RealEstateMainView language={preferences.language} />;
      case 'bidAnalyzer':
        return <BidAnalyzerView language={preferences.language} />;
      case 'costAnalysis':
        return <CostAnalysisView language={preferences.language} />;
      case 'maintenanceCalendar':
        return <MaintenanceCalendarView language={preferences.language} />;
      case 'changeSheets':
        return (
          <ChangeSheetsListView 
            language={preferences.language}
            onViewDetails={() => {}}
            onCreateNew={() => {}}
          />
        );
      case 'contractRequests':
        return <ContractRequestsListView language={preferences.language} />;
      case 'employeeAgreements':
        return <EmployeeAgreementsListView language={preferences.language} />;
      case 'exitInterviews':
        return <ExitInterviewsListView language={preferences.language} />;
      case 'practiceEvaluations':
        return <PracticeEvaluationsListView language={preferences.language} />;
      default:
        return (
          <MainContent 
            activeSection={activeView} 
            language={preferences.language} 
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <AppSidebar 
          language={preferences.language}
          activeSection={activeView}
          onSectionChange={handleSectionChange}
        />
        <div className="flex-1 flex flex-col">
          <Header 
            user={user}
            onLogout={logout}
            language={preferences.language}
            theme={preferences.theme}
            onLanguageChange={setLanguage}
            onThemeChange={setTheme}
            onUserUpdate={handleUserUpdate}
            onPermissionsUpdate={handlePermissionsUpdate}
          />
          <main className="flex-1 overflow-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
