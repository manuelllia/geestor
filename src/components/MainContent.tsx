
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface MainContentProps {
  activeSection: string;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language }) => {
  const { t } = useTranslation(language);

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'inicio':
        return t('inicio');
      case 'operaciones':
        return t('operaciones');
      case 'gestion-tecnica':
        return t('gestionTecnica');
      case 'gestion-talento':
        return t('gestionTalento');
      default:
        return t('inicio');
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {getSectionTitle()}
        </h2>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
            </div>
            <p className="text-lg">
              Contenido de {getSectionTitle()} - Próximamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
