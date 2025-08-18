import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import LoginScreen from './LoginScreen';
import VerificationScreen from './VerificationScreen';
import BidAnalyzerView from './BidAnalyzer/BidAnalyzerView';
import CostAnalysisView from './CostAnalysis/CostAnalysisView';
import CalendarView from './Calendar/CalendarView';
import RealEstateView from './RealEstate/RealEstateView';
import { MaintenanceCalendar } from './Maintenance/MaintenanceCalendar';

export default function MainContent() {
  const { user, userData, isLoading: authLoading } = useAuth();
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

  if (!user) {
    return <LoginScreen />;
  }

  if (!userData?.isVerified) {
    return <VerificationScreen user={user} />;
  }

  return (
    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<BidAnalyzerView language={preferences.language} />} />
        <Route path="/bid-analyzer" element={<BidAnalyzerView language={preferences.language} />} />
        <Route path="/cost-analysis" element={<CostAnalysisView language={preferences.language} />} />
        <Route path="/maintenance" element={<MaintenanceCalendar language={preferences.language} />} />
        <Route path="/calendar" element={<CalendarView language={preferences.language} />} />
        <Route path="/real-estate" element={<RealEstateView language={preferences.language} />} />
      </Routes>
    </main>
  );
}
