import React, { useState, useEffect } from 'react';
import RealEstateDashboard from './RealEstateDashboard';
import RealEstateListView from './RealEstateListView';
import RealEstateUploadView from './RealEstateUploadView';
import PropertyTypeSelectionModal from './PropertyTypeSelectionModal';
import ActivePropertyForm from './ActivePropertyForm';
import InactivePropertyForm from './InactivePropertyForm';
import { Language } from '../../utils/translations';
import { checkRealEstateDocument } from '../../services/realEstateService';

interface RealEstateMainViewProps {
  language: Language;
}

type ViewType = 'dashboard' | 'list' | 'upload' | 'addActiveProperty' | 'addInactiveProperty';

const RealEstateMainView: React.FC<RealEstateMainViewProps> = ({ language }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);

  useEffect(() => {
    const checkData = async () => {
      try {
        setIsLoading(true);
        const documentExists = await checkRealEstateDocument();
        setHasData(documentExists);
        
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

  const handleAddProperty = () => {
    console.log('🏠 Abriendo modal de selección de tipo de propiedad');
    setShowPropertyTypeModal(true);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    const recheckData = async () => {
      const documentExists = await checkRealEstateDocument();
      setHasData(documentExists);
    };
    recheckData();
  };

  const handlePropertyTypeConfirm = (propertyType: 'active' | 'inactive') => {
    console.log(`🏠 Tipo seleccionado: ${propertyType}`);
    if (propertyType === 'active') {
      setCurrentView('addActiveProperty');
    } else {
      setCurrentView('addInactiveProperty');
    }
    setShowPropertyTypeModal(false);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6 lg:p-8">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  switch (currentView) {
    case 'list':
      return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
          <RealEstateListView onBack={handleBackToDashboard} />
        </div>
      );
    case 'upload':
      return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
          <RealEstateUploadView
            language={language}
            onUploadComplete={handleBackToDashboard}
            onCancel={hasData ? handleBackToDashboard : undefined}
          />
        </div>
      );
    case 'addActiveProperty':
      return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
          <ActivePropertyForm
            onBack={handleBackToDashboard}
            onSave={handleBackToDashboard}
            language={language}
          />
        </div>
      );
    case 'addInactiveProperty':
      return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
          <InactivePropertyForm
            onBack={handleBackToDashboard}
            onSave={handleBackToDashboard}
            language={language}
          />
        </div>
      );
    default:
      return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
          <RealEstateDashboard
            language={language}
            onImportData={handleImportData}
            onViewTables={handleViewTables}
            onAddProperty={handleAddProperty}
          />
          <PropertyTypeSelectionModal
            isOpen={showPropertyTypeModal}
            onClose={() => setShowPropertyTypeModal(false)}
            onConfirm={handlePropertyTypeConfirm}
            language={language}
          />
        </div>
      );
  }
};

export default RealEstateMainView;
