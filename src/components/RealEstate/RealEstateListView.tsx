import React, { useState } from 'react';
import RealEstateDashboard from './RealEstateDashboard';
import RealEstateTableManager from './RealEstateTableManager';
import RealEstateUploadView from './RealEstateUploadView';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';

interface RealEstateListViewProps {
  language: Language;
}

const RealEstateListView: React.FC<RealEstateListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [currentView, setCurrentView] = useState<'dashboard' | 'table' | 'upload'>('dashboard');

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleViewTable = () => {
    setCurrentView('table');
  };

  const handleViewUpload = () => {
    setCurrentView('upload');
  };

  if (currentView === 'table') {
    return (
      <RealEstateTableManager
        language={language}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'upload') {
    return (
      <RealEstateUploadView
        language={language}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <RealEstateDashboard
      language={language}
      onViewTable={handleViewTable}
      onViewUpload={handleViewUpload}
    />
  );
};

export default RealEstateListView;
