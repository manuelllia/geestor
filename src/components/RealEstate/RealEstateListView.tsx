
import React, { useState } from 'react';
import RealEstateDashboard from './RealEstateDashboard';
import RealEstateUploadView from './RealEstateUploadView';
import RealEstateDetailView from './RealEstateDetailView';
import RealEstateTableManager from './RealEstateTableManager';
import { Language } from '../../utils/translations';

interface RealEstateListViewProps {
  language: Language;
}

const RealEstateListView: React.FC<RealEstateListViewProps> = ({ language }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload' | 'detail' | 'tables'>('dashboard');

  const handleImportData = () => {
    setCurrentView('upload');
  };

  const handleViewTables = () => {
    setCurrentView('tables');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  switch (currentView) {
    case 'upload':
      return (
        <RealEstateUploadView 
          language={language}
          onUploadComplete={handleBackToDashboard}
          onCancel={handleBackToDashboard}
        />
      );
    case 'detail':
      return (
        <RealEstateDetailView 
          language={language}
          onClose={handleBackToDashboard}
        />
      );
    case 'tables':
      return (
        <RealEstateTableManager 
          onBack={handleBackToDashboard}
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

export default RealEstateListView;
