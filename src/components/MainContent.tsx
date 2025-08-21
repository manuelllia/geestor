import React, { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import PracticeEvaluationForm from '../pages/PracticeEvaluationForm';
import ExitInterviewForm from '../pages/ExitInterviewForm';
import RealEstateListView from './RealEstate/RealEstateListView';
import { useTranslation } from 'react-i18next';

interface MainContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
  language: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeView, onViewChange, language }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useTranslation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard language={language} />;
      case 'practiceEvaluationForm':
        return <PracticeEvaluationForm />;
      case 'exitInterviewForm':
        return <ExitInterviewForm />;
      case 'realEstate':
        return <RealEstateListView onBack={() => onViewChange('dashboard')} />;
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
