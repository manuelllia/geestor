
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import LoginScreen from '../components/LoginScreen';
import VerificationScreen from '../components/VerificationScreen';
import Header from '../components/Header';
import AppSidebar from '../components/AppSidebar';
import MainContent from '../components/MainContent';

const Index = () => {
  const { user, isAuthenticated, isLoading, isVerifying, loginWithMicrosoft, logout } = useAuth();
  const { preferences, setLanguage, setTheme } = usePreferences();
  const [activeSection, setActiveSection] = useState('inicio');

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Show verification screen during account verification
  if (isVerifying) {
    return <VerificationScreen language={preferences.language} />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <LoginScreen
        onLogin={loginWithMicrosoft}
        isLoading={isLoading}
        language={preferences.language}
      />
    );
  }

  // Main application interface
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar
          language={preferences.language}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <div className="flex flex-col flex-1 min-w-0">
          <Header
            user={user}
            onLogout={logout}
            language={preferences.language}
            theme={preferences.theme}
            onLanguageChange={setLanguage}
            onThemeChange={setTheme}
          />
          
          <MainContent
            activeSection={activeSection}
            language={preferences.language}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
