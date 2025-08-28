import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import FileUploadBox from './FileUploadBox';
import GeenioChatbot from './GeenioChatbot';
import BidAnalysisResults from './BidAnalysisResults';
import EconomicScoreCalculator from './EconomicScoreCalculator';
import TotalScoreCalculator from './TotalScoreCalculator';
import { useBidAnalysis } from '../../hooks/useBidAnalysis';

interface BidAnalyzerViewProps {
  language: Language;
}

type ViewType = 'upload' | 'analysis' | 'economic' | 'total';

const BidAnalyzerView: React.FC<BidAnalyzerViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [pcapFile, setPcapFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { analyzeBid, analysisResult, isLoading } = useBidAnalysis();

  const handlePcapUpload = (file: File) => {
    setPcapFile(file);
    console.log('PCAP file uploaded:', file.name);
  };

  const handlePptUpload = (file: File) => {
    setPptFile(file);
    console.log('PPT file uploaded:', file.name);
  };

  const handleAnalyzeBid = async () => {
    if (!pcapFile || !pptFile) return;
    
    setIsAnalyzing(true);
    try {
      await analyzeBid(pcapFile, pptFile);
      setCurrentView('analysis');
    } catch (error) {
      console.error('Error analyzing bid:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderNavigationButtons = () => {
    if (currentView === 'upload') return null;

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={currentView === 'analysis' ? 'default' : 'outline'}
          onClick={() => setCurrentView('analysis')}
          className="flex-1 min-w-0"
        >
          Análisis IA
        </Button>
        <Button
          variant={currentView === 'economic' ? 'default' : 'outline'}
          onClick={() => setCurrentView('economic')}
          className="flex-1 min-w-0"
        >
          Puntos Económicos
        </Button>
        <Button
          variant={currentView === 'total' ? 'default' : 'outline'}
          onClick={() => setCurrentView('total')}
          className="flex-1 min-w-0"
        >
          Puntos Totales
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCurrentView('upload')}
          className="ml-auto"
        >
          ← Volver a Subida
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'upload':
        return (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-8 mb-6">
              <h1 className="text-3xl font-bold mb-4">Análisis de Licitaciones</h1>
              <p className="text-blue-100 text-lg">
                Sube los archivos PCAP y PPT para realizar un análisis completo de la licitación
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    📄 Archivo PCAP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadBox
                    title="Pliego de Cláusulas Administrativas Particulares"
                    description="Sube el archivo PCAP en formato PDF"
                    file={pcapFile}
                    onFileUpload={handlePcapUpload}
                    onFileRemove={() => setPcapFile(null)}
                    accept=".pdf"
                    isLoading={isAnalyzing}
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
                    title="Pliego de Prescripciones Técnicas"
                    description="Sube el archivo PPT en formato PDF"
                    file={pptFile}
                    onFileUpload={handlePptUpload}
                    onFileRemove={() => setPptFile(null)}
                    accept=".pdf"
                    isLoading={isAnalyzing}
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
                    <p className="text-green-800 dark:text-green-200 font-medium mb-4">
                      ✅ Archivos listos para análisis
                    </p>
                    <p className="text-green-600 dark:text-green-300 text-sm mb-4">
                      Los archivos PCAP y PPT han sido cargados correctamente. El análisis se realizará automáticamente.
                    </p>
                    <Button
                      onClick={handleAnalyzeBid}
                      disabled={isAnalyzing || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing || isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Analizando Licitación...
                        </div>
                      ) : (
                        'Analizar Licitación'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        );

      case 'analysis':
        return <BidAnalysisResults analysisData={analysisResult} />;

      case 'economic':
        return <EconomicScoreCalculator analysisData={analysisResult} />;

      case 'total':
        return <TotalScoreCalculator analysisData={analysisResult} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 relative">
      {renderNavigationButtons()}
      {renderContent()}
      
      <GeenioChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
        language={language}
      />
    </div>
  );
};

export default BidAnalyzerView;
