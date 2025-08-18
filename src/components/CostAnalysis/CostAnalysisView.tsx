import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Upload, FileText, BarChart3, AlertCircle, Download, Calculator, Bot } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { useCostAnalysis } from '../../hooks/useCostAnalysis';
import FileUploadBox from '../BidAnalyzer/FileUploadBox';
import CostAnalysisReport from './CostAnalysisReport';
import ScoreAnalysisView from './ScoreAnalysisView';
import CostBreakdownView from './CostBreakdownView';
import GeenioChatbot from '../BidAnalyzer/GeenioChatbot';

interface CostAnalysisViewProps {
  language: Language;
}

type ViewType = 'upload' | 'analysis' | 'score' | 'breakdown';

const CostAnalysisView: React.FC<CostAnalysisViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [currentView, setCurrentView] = useState<ViewType>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pcapFile, setPcapFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const { 
    analyzeCosts, 
    analysisResult, 
    isLoading, 
    error 
  } = useCostAnalysis();

  const handleFileUpload = (file: File) => {
    setUploadedFiles(prev => [...prev, file]);
    
    // Assign files based on name patterns or order
    if (!pcapFile && (file.name.toLowerCase().includes('pcap') || file.name.toLowerCase().includes('administrativ'))) {
      setPcapFile(file);
    } else if (!pptFile && (file.name.toLowerCase().includes('ppt') || file.name.toLowerCase().includes('tecnic'))) {
      setPptFile(file);
    } else if (!pcapFile) {
      setPcapFile(file);
    } else if (!pptFile) {
      setPptFile(file);
    }
    
    console.log('File uploaded for cost analysis:', file.name);
  };

  const handleFileRemove = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Update specific file states
    if (pcapFile === fileToRemove) {
      setPcapFile(null);
    }
    if (pptFile === fileToRemove) {
      setPptFile(null);
    }
  };

  const handleAnalyzeCosts = async () => {
    if (!pcapFile || !pptFile) {
      console.error('Both PCAP and PPT files are required');
      return;
    }
    
    try {
      await analyzeCosts(pcapFile, pptFile);
      setCurrentView('analysis');
    } catch (error) {
      console.error('Error analyzing costs:', error);
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
          <FileText className="h-4 w-4 mr-2" />
          Informe General
        </Button>
        <Button
          variant={currentView === 'score' ? 'default' : 'outline'}
          onClick={() => setCurrentView('score')}
          className="flex-1 min-w-0"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Análisis de Puntuación
        </Button>
        <Button
          variant={currentView === 'breakdown' ? 'default' : 'outline'}
          onClick={() => setCurrentView('breakdown')}
          className="flex-1 min-w-0"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Desglose de Costes
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded-lg p-8 mb-6">
              <h1 className="text-3xl font-bold mb-4">Análisis de Costes</h1>
              <p className="text-emerald-100 text-lg">
                Sube documentos de licitación para realizar un análisis completo de costes y puntuación
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FileUploadBox
                title="PCAP - Pliego Administrativo"
                description="Sube el archivo PDF del Pliego de Cláusulas Administrativas Particulares"
                file={pcapFile}
                onFileUpload={handleFileUpload}
                onFileRemove={() => setPcapFile(null)}
                accept=".pdf"
                isLoading={isLoading}
              />
              
              <FileUploadBox
                title="PPT - Pliego Técnico"
                description="Sube el archivo PDF del Pliego de Prescripciones Técnicas"
                file={pptFile}
                onFileUpload={handleFileUpload}
                onFileRemove={() => setPptFile(null)}
                accept=".pdf"
                isLoading={isLoading}
              />
            </div>

            {uploadedFiles.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Archivos Subidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileRemove(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {pcapFile && pptFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Análisis de Costes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-4">
                      ✅ Documentos listos para análisis
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 text-sm mb-4">
                      Ambos archivos (PCAP y PPT) están cargados. El análisis de costes se realizará automáticamente.
                    </p>
                    <Button
                      onClick={handleAnalyzeCosts}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Analizando Costes...
                        </div>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Analizar Costes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-red-200 dark:border-red-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">Error en el análisis</p>
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
                </CardContent>
              </Card>
            )}
          </>
        );

      case 'analysis':
        return <CostAnalysisReport data={analysisResult} />;

      case 'score':
        return <ScoreAnalysisView data={analysisResult} />;

      case 'breakdown':
        return <CostBreakdownView data={analysisResult} />;

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
        context={analysisResult}
      />
    </div>
  );
};

export default CostAnalysisView;
