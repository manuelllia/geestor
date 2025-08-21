
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
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const handleImportData = () => {
    setCurrentView('upload');
  };

  const handleViewTables = () => {
    setCurrentView('tables');
  };

  const handleViewDetail = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedPropertyId(null);
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
          propertyId={selectedPropertyId || 'sample-id'}
          onBack={handleBackToDashboard}
        />
      );
    case 'tables':
      return (
        <RealEstateTableManager 
          onBack={handleBackToDashboard}
          onViewDetail={handleViewDetail}
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
