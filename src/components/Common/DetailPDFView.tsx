
import React from 'react';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DetailField {
  label: string;
  value: any;
  type?: 'text' | 'date' | 'currency' | 'list' | 'email' | 'phone';
  icon?: React.ReactNode;
}

export interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface DetailPDFViewProps {
  language: Language;
  title: string;
  recordId: string;
  sections: DetailSection[];
  onBack: () => void;
  fileName: string;
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

  const formatValue = (value: any, type?: string) => {
    if (!value) return '-';
    
    switch (type) {
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
        }
        return value;
      case 'currency':
        return `€${value}`;
      case 'list':
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      default:
        return value;
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
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
      
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const duplicateRecord = () => {
    console.log('Duplicating record:', recordId);
    // Implementar lógica de duplicación
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={duplicateRecord}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {t('duplicateRecord')}
          </Button>
          <Button
            onClick={generatePDF}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('downloadPDF')}
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div id="pdf-content" className="bg-white p-8 rounded-lg shadow-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{title}</h1>
          <p className="text-gray-600">ID: {recordId}</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t('generatedOn')}: {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
            </p>
            <p className="text-sm text-gray-500">
              {t('documentGenerated')} GEESTOR
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border-2 border-blue-100">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-xl text-blue-700">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {field.icon}
                        <label className="text-sm font-semibold text-gray-700">
                          {field.label}:
                        </label>
                      </div>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                        {formatValue(field.value, field.type)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailPDFView;
