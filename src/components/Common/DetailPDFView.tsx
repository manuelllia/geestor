
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileDown, Calendar, User, Building, MapPin } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DetailField {
  label: string;
  value: string | number | Date | undefined | null;
  type?: 'text' | 'date' | 'email' | 'phone' | 'currency' | 'list';
  icon?: React.ReactNode;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface DetailPDFViewProps {
  language: Language;
  title: string;
  recordId: string;
  sections: DetailSection[];
  onBack: () => void;
  fileName?: string;
}

const DetailPDFView: React.FC<DetailPDFViewProps> = ({
  language,
  title,
  recordId,
  sections,
  onBack,
  fileName
}) => {
  const { t } = useTranslation(language);

  const formatValue = (value: any, type: string = 'text') => {
    if (value === null || value === undefined || value === '') {
      return 'No especificado';
    }

    switch (type) {
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
        }
        return value.toString();
      case 'currency':
        return `€${parseFloat(value.toString()).toLocaleString()}`;
      case 'list':
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value.toString();
      default:
        return value.toString();
    }
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('pdf-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const defaultFileName = `${title.replace(/\s+/g, '_')}_${recordId}_${new Date().toISOString().split('T')[0]}`;
      pdf.save(`${fileName || defaultFileName}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
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

      {/* Contenido del PDF */}
      <Card className="border-blue-200 dark:border-blue-800">
        <div id="pdf-content" className="p-6 bg-white">
          {/* Header del documento */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{title}</h1>
            <p className="text-gray-600">ID: {recordId}</p>
            <p className="text-gray-500 text-sm">
              {t('generatedOn')}: {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
            </p>
          </div>

          {/* Secciones del documento */}
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                  {section.title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {field.icon}
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}:
                        </label>
                      </div>
                      <div className="text-gray-900 bg-gray-50 p-2 rounded border">
                        {formatValue(field.value, field.type)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer del documento */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>{t('documentGenerated')} - GEEstor</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailPDFView;
