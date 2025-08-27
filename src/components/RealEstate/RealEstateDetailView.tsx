
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface RealEstateDetailViewProps {
  language: Language;
  propertyId: string;
  onBack: () => void;
}

const RealEstateDetailView: React.FC<RealEstateDetailViewProps> = ({ 
  language, 
  propertyId,
  onBack 
}) => {
  const { t } = useTranslation(language);

  const handleExportPDF = () => {
    console.log('Exportando inmueble PDF');
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        {/* Header con botones responsive */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm w-fit"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{t('back')}</span>
          </Button>
          
          <Button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-fit sm:w-auto"
            size="sm"
          >
            <FileDown className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{t('exportPDF')}</span>
          </Button>
        </div>

        {/* Contenido del inmueble responsive */}
        <Card className="border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl text-blue-800 dark:text-blue-200">
              {t('realEstateDetails')} - ID: {propertyId}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <div className="space-y-2 sm:space-y-4">
                <p className="text-sm sm:text-base">{t('detailViewPlaceholder')}</p>
                <p className="text-xs sm:text-sm">{t('comingSoon')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateDetailView;
