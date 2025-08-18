
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import LoginScreen from './LoginScreen';
import VerificationScreen from './VerificationScreen';
import BidAnalyzerView from './BidAnalyzer/BidAnalyzerView';
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';

export default function MainContent() {
  const { user, isAuthenticated, isLoading: authLoading, loginWithMicrosoft } = useAuth();
  const { preferences } = usePreferences();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginScreen onLogin={loginWithMicrosoft} isLoading={authLoading} language={preferences.language} />;
  }

  return (
    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<BidAnalyzerView language={preferences.language} />} />
        <Route path="/bid-analyzer" element={<BidAnalyzerView language={preferences.language} />} />
        <Route path="/analisis-coste" element={<CostAnalysisView language={preferences.language} />} />
        <Route path="/calendario-mantenimiento" element={<MaintenanceCalendarView language={preferences.language} />} />
      </Routes>
    </main>
  );
}
