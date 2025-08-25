
import React, { useState, useEffect } from 'react';
import RealEstateDashboard from './RealEstateDashboard';
import RealEstateListView from './RealEstateListView';
import RealEstateUploadView from './RealEstateUploadView';
import { Language } from '../../utils/translations';
import { checkRealEstateDocument } from '../../services/realEstateService';

interface RealEstateMainViewProps {
  language: Language;
}

type ViewType = 'dashboard' | 'list' | 'upload';

const RealEstateMainView: React.FC<RealEstateMainViewProps> = ({ language }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkData = async () => {
      try {
        setIsLoading(true);
        const documentExists = await checkRealEstateDocument();
        setHasData(documentExists);
        
        // Si no hay datos, mostrar directamente la vista de carga
        if (!documentExists) {
          setCurrentView('upload');
        }
      } catch (error) {
        console.error('Error verificando datos:', error);
        setHasData(false);
        setCurrentView('upload');
      } finally {
        setIsLoading(false);
      }
    };

    checkData();
  }, []);

  const handleImportData = () => {
    setCurrentView('upload');
  };

  const handleViewTables = () => {
    setCurrentView('list');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    // Recargar datos después de importar
    const recheckData = async () => {
      const documentExists = await checkRealEstateDocument();
      setHasData(documentExists);
    };
    recheckData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6 lg:p-8">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  switch (currentView) {
    case 'list':
      return <RealEstateListView onBack={handleBackToDashboard} />;
    case 'upload':
      return (
        <RealEstateUploadView
          language={language}
          onUploadComplete={handleBackToDashboard}
          onCancel={hasData ? handleBackToDashboard : undefined}
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
