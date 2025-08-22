
import React, { useState } from 'react';
import RealEstateDashboard from './RealEstateDashboard';
import RealEstateListView from './RealEstateListView';
import RealEstateUploadView from './RealEstateUploadView';
import { Language } from '../../utils/translations';

interface RealEstateMainViewProps {
  language: Language;
}

type ViewType = 'dashboard' | 'list' | 'upload';

const RealEstateMainView: React.FC<RealEstateMainViewProps> = ({ language }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleImportData = () => {
    setCurrentView('upload');
  };

  const handleViewTables = () => {
    setCurrentView('list');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  switch (currentView) {
    case 'list':
      return <RealEstateListView onBack={handleBackToDashboard} />;
    case 'upload':
      return (
        <RealEstateUploadView
          language={language}
          onUploadComplete={handleBackToDashboard}
          onCancel={handleBackToDashboard}
        />
      );
    default:
      return (
        <RealEstateDashboard
          language={language}
          onImportData={handleImportData}
          onViewTables={handleViewTables}
        />
      );
  }
};

export default RealEstateMainView;
