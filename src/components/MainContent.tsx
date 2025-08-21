
import React, { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import PracticeEvaluationForm from '../pages/PracticeEvaluationForm';
import ExitInterviewForm from '../pages/ExitInterviewForm';
import RealEstateListView from './RealEstate/RealEstateListView';
import MaintenanceCalendarView from './MaintenanceCalendar/MaintenanceCalendarView';
import { Language } from '../utils/translations';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return <Dashboard language={language} />;
      case 'practiceEvaluationForm':
        return <PracticeEvaluationForm />;
      case 'exitInterviewForm':
        return <ExitInterviewForm />;
      case 'realEstate':
        return <RealEstateListView onBack={() => {}} />;
      case 'calendario-mantenimiento':
        return <MaintenanceCalendarView language={language} />;
      default:
        return <Dashboard language={language} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {renderContent()}
    </div>
  );
};

export default MainContent;
