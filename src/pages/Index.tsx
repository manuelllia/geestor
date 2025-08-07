
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
  const [userState, setUserState] = useState(user);
  const [permissionsUpdateKey, setPermissionsUpdateKey] = useState(0);

  // Update user state when user prop changes
  React.useEffect(() => {
    setUserState(user);
  }, [user]);

  const handleUserUpdate = (updatedUser: typeof user) => {
    setUserState(updatedUser);
  };

  const handlePermissionsUpdate = () => {
    setPermissionsUpdateKey(prev => prev + 1);
  };

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
  if (!isAuthenticated || !userState) {
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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar
          language={preferences.language}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          key={permissionsUpdateKey}
        />
        
        <div className="flex flex-col min-h-screen w-full">
          <Header
            user={userState}
            onLogout={logout}
            language={preferences.language}
            theme={preferences.theme}
            onLanguageChange={setLanguage}
            onThemeChange={setTheme}
            onUserUpdate={handleUserUpdate}
            onPermissionsUpdate={handlePermissionsUpdate}
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
