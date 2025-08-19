
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from './hooks/useAuth';
import { usePreferences } from './hooks/usePreferences';
import { Language, Theme } from './utils/translations';
import LoginScreen from './components/LoginScreen';
import VerificationScreen from './components/VerificationScreen';
import { Header } from './components/Header';
import { AppSidebar } from './components/AppSidebar';
import MainContent from './components/MainContent';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PracticeEvaluationForm from './pages/PracticeEvaluationForm';
import ExitInterviewForm from './pages/ExitInterviewForm';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const { user, isAuthenticated, isLoading, isVerifying, loginWithMicrosoft, logout } = useAuth();
  const { language, theme, updateLanguage, updateTheme } = usePreferences();
  const [activeSection, setActiveSection] = useState('inicio');

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleUserUpdate = (updatedUser: any) => {
    // Handle user profile updates
    console.log('User updated:', updatedUser);
  };

  const handlePermissionsUpdate = () => {
    // Handle permissions refresh
    console.log('Permissions updated');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return <VerificationScreen language={language} />;
  }

  if (!isAuthenticated || !user) {
    return <LoginScreen onLogin={loginWithMicrosoft} isLoading={isLoading} language={language} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Public routes */}
            <Route path="/valoracion-practicas/:token" element={<PracticeEvaluationForm />} />
            <Route path="/entrevista-salida/:token" element={<ExitInterviewForm />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar 
                    language={language}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    currentUserId={user.id}
                  />
                  <div className="flex-1 flex flex-col">
                    <Header
                      user={user}
                      onLogout={logout}
                      language={language}
                      theme={theme}
                      onLanguageChange={updateLanguage}
                      onThemeChange={updateTheme}
                      onUserUpdate={handleUserUpdate}
                      onPermissionsUpdate={handlePermissionsUpdate}
                    />
                    <Routes>
                      <Route path="/" element={
                        <MainContent 
                          activeSection={activeSection} 
                          language={language}
                        />
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              </SidebarProvider>
            } />
          </Routes>
          <Toaster 
            position="top-right"
            theme={theme}
            richColors
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
