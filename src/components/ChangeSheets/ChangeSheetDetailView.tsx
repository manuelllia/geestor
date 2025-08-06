
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface ChangeSheetDetailViewProps {
  language: Language;
  sheetId: string;
  onBack: () => void;
}

const ChangeSheetDetailView: React.FC<ChangeSheetDetailViewProps> = ({ 
  language, 
  sheetId,
  onBack 
}) => {
  const { t } = useTranslation(language);

  const handleExportPDF = () => {
    // Implementación futura para exportar PDF
    console.log('Exportando PDF');
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de navegación */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        
        <Button
          onClick={handleExportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FileDown className="w-4 h-4 mr-2" />
          {t('exportPDF')}
        </Button>
      </div>

      {/* Contenido de la hoja de cambio */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            {t('changeSheetDetails')} - ID: {sheetId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>{t('detailViewPlaceholder')}</p>
            <p className="text-sm mt-2">{t('comingSoon')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeSheetDetailView;
