
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import FileUploadBox from './FileUploadBox';
import GeenioChatbot from './GeenioChatbot';

interface BidAnalyzerViewProps {
  language: Language;
}

const BidAnalyzerView: React.FC<BidAnalyzerViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [pcapFile, setPcapFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handlePcapUpload = (file: File) => {
    setPcapFile(file);
    console.log('PCAP file uploaded:', file.name);
  };

  const handlePptUpload = (file: File) => {
    setPptFile(file);
    console.log('PPT file uploaded:', file.name);
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Análisis de Licitaciones</h1>
        <p className="text-blue-100 text-lg">
          Sube los archivos PCAP y PPT para realizar un análisis completo de la licitación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              📄 Archivo PCAP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadBox
              onFileUpload={handlePcapUpload}
              uploadedFile={pcapFile}
              fileType="PCAP"
              acceptedFormats=".pdf"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              📊 Archivo PPT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadBox
              onFileUpload={handlePptUpload}
              uploadedFile={pptFile}
              fileType="PPT"
              acceptedFormats=".pdf"
            />
          </CardContent>
        </Card>
      </div>

      {pcapFile && pptFile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              📈 Estado del Análisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
              <p className="text-green-800 dark:text-green-200 font-medium">
                ✅ Archivos listos para análisis
              </p>
              <p className="text-green-600 dark:text-green-300 text-sm mt-2">
                Los archivos PCAP y PPT han sido cargados correctamente. El análisis se realizará automáticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <GeenioChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  );
};

export default BidAnalyzerView;
