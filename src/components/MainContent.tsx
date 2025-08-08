
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';
import ChangeSheetsListView from './ChangeSheets/ChangeSheetsListView';
import ChangeSheetDetailView from './ChangeSheets/ChangeSheetDetailView';
import EmployeeAgreementsListView from './EmployeeAgreements/EmployeeAgreementsListView';
import EmployeeAgreementDetailView from './EmployeeAgreements/EmployeeAgreementDetailView';
import RealEstateListView from './RealEstate/RealEstateListView';
import RealEstateDetailView from './RealEstate/RealEstateDetailView';
import RealEstateUploadView from './RealEstate/RealEstateUploadView';
import BidAnalyzerView from './BidAnalyzer/BidAnalyzerView';
import { checkPisosDocument } from '../services/realEstateService';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const { t } = useTranslation(language);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'upload'>('list');
  const [selectedId, setSelectedId] = useState<string>('');
  const [pisosDocumentExists, setPisosDocumentExists] = useState<boolean | null>(null);

  const handleViewDetails = (id: string) => {
    setSelectedId(id);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedId('');
  };

  // Verificar si existe el documento pisos cuando se selecciona gestión de inmuebles
  useEffect(() => {
    if (activeSection === 'gestion-inmuebles') {
      const checkDocument = async () => {
        try {
          const exists = await checkPisosDocument();
          setPisosDocumentExists(exists);
          if (!exists) {
            setCurrentView('upload');
          }
        } catch (error) {
          console.error('Error checking pisos document:', error);
          setPisosDocumentExists(false);
          setCurrentView('upload');
        }
      };
      checkDocument();
    } else {
      setPisosDocumentExists(null);
      setCurrentView('list');
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-8 mb-8">
                <h1 className="text-3xl font-bold mb-4">{t('welcomeMessage')}</h1>
                <p className="text-blue-100 text-lg">{t('welcomeSubtitle')}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <p className="text-gray-700 dark:text-gray-300">{t('selectSection')}</p>
              </div>
            </div>
          </div>
        );

      case 'analisis-coste':
        return <BidAnalyzerView language={language} />;

      case 'hojas-cambio':
        if (currentView === 'detail') {
          return (
            <ChangeSheetDetailView
              language={language}
              sheetId={selectedId}
              onBack={handleBackToList}
            />
          );
        }
        return (
          <ChangeSheetsListView
            language={language}
            onViewDetails={handleViewDetails}
            onCreateNew={() => console.log('Crear nueva hoja de cambio')}
          />
        );

      case 'acuerdo-empleado':
        if (currentView === 'detail') {
          return (
            <EmployeeAgreementDetailView
              language={language}
              agreementId={selectedId}
              onBack={handleBackToList}
            />
          );
        }
        return (
          <EmployeeAgreementsListView
            language={language}
            onViewDetails={handleViewDetails}
            onCreateNew={() => console.log('Crear nuevo acuerdo')}
          />
        );

      case 'gestion-inmuebles':
        if (pisosDocumentExists === null) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          );
        }

        if (!pisosDocumentExists || currentView === 'upload') {
          return <RealEstateUploadView language={language} />;
        }

        if (currentView === 'detail') {
          return (
            <RealEstateDetailView
              language={language}
              propertyId={selectedId}
              onBack={handleBackToList}
            />
          );
        }
        return (
          <RealEstateListView
            language={language}
            onViewDetails={handleViewDetails}
            onCreateNew={() => console.log('Crear nuevo inmueble')}
          />
        );

      default:
        return (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-8 border border-blue-200 dark:border-blue-700">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              {t('mainContent')}
            </h2>
            <div className="bg-white dark:bg-blue-800/50 rounded-lg p-6 shadow-sm border border-blue-100 dark:border-blue-700">
              <p className="text-gray-600 dark:text-gray-300">
                {t('noContentSelected')} - {activeSection}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-6 bg-gradient-to-br from-blue-25 via-white to-blue-50 dark:from-blue-950 dark:via-gray-900 dark:to-blue-900 min-h-screen overflow-auto">
      {renderContent()}
    </main>
  );
};

export default MainContent;
