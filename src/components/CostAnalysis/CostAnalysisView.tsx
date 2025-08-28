import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import FileUploadBox from '../BidAnalyzer/FileUploadBox';
import { useCostAnalysis } from '../../hooks/useCostAnalysis';
import CostAnalysisReport from './CostAnalysisReport';
import CostBreakdownView from './CostBreakdownView';
import ScoreAnalysisView from './ScoreAnalysisView';
import GeenioChatbot from '../BidAnalyzer/GeenioChatbot';
import { useChatbotContext } from '../../hooks/useChatbotContext';

interface CostAnalysisViewProps {
  language: Language;
}

const CostAnalysisView: React.FC<CostAnalysisViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [pcapFile, setPcapFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const { analyzeCosts, analysisResult, isLoading, error } = useCostAnalysis();
  const { updateAnalysisContext } = useChatbotContext();

  const handlePcapUpload = (file: File) => {
    setPcapFile(file);
    console.log('PCAP file uploaded:', file.name);
  };

  const handlePptUpload = (file: File) => {
    setPptFile(file);
    console.log('PPT file uploaded:', file.name);
  };

  const handleAnalyzeCosts = async () => {
    if (!pcapFile || !pptFile) return;
    
    try {
      await analyzeCosts(pcapFile, pptFile);
      
      // Actualizar contexto del chatbot cuando se complete el análisis
      if (analysisResult) {
        updateAnalysisContext({
          pcapData: { fileName: pcapFile.name, size: pcapFile.size },
          pptData: { fileName: pptFile.name, size: pptFile.size },
          analysisResults: analysisResult,
          reportData: analysisResult
        });
        console.log('🤖 Contexto del chatbot actualizado con nuevo análisis de costes');
        setActiveTab('report');
      }
    } catch (error) {
      console.error('Error analyzing costs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 md:p-8 shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Análisis de Costes</h1>
          <p className="text-indigo-100 text-sm md:text-lg">
            Analiza los documentos de licitación para obtener un desglose detallado de costes
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 h-auto p-1">
            <TabsTrigger 
              value="upload" 
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3"
            >
              📁 Subir Archivos
            </TabsTrigger>
            <TabsTrigger 
              value="report" 
              disabled={!analysisResult}
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3"
            >
              📊 Informe
            </TabsTrigger>
            <TabsTrigger 
              value="costs" 
              disabled={!analysisResult}
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3"
            >
              💰 Costes
            </TabsTrigger>
            <TabsTrigger 
              value="scores" 
              disabled={!analysisResult}
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3"
            >
              🎯 Puntuación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
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
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
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
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {pcapFile && pptFile && (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-semibold text-blue-900 dark:text-blue-100">
                    📈 Análisis de Costes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 md:p-6 border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-200 font-medium mb-4 text-sm md:text-base">
                      ✅ Archivos listos para análisis
                    </p>
                    <p className="text-green-600 dark:text-green-300 text-xs md:text-sm mb-4">
                      Los archivos PCAP y PPT han sido cargados correctamente. El análisis se realizará con IA avanzada.
                    </p>
                    <Button
                      onClick={handleAnalyzeCosts}
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm md:text-base py-2 md:py-3"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Analizando Costes...
                        </div>
                      ) : (
                        'Iniciar Análisis de Costes'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="shadow-lg border-0 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 text-lg">❌</div>
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200 text-sm md:text-base">
                        Error en el Análisis
                      </h3>
                      <p className="text-red-600 dark:text-red-300 text-xs md:text-sm mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            {analysisResult && <CostAnalysisReport data={analysisResult as any} />}
          </TabsContent>

          <TabsContent value="costs" className="mt-6">
            {analysisResult && <CostBreakdownView data={analysisResult} />}
          </TabsContent>

          <TabsContent value="scores" className="mt-6">
            {analysisResult && <ScoreAnalysisView data={analysisResult} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot Genie */}
      <GeenioChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        context={analysisResult}
      />
    </div>
  );
};

export default CostAnalysisView;
