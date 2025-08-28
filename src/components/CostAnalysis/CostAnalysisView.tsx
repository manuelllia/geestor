
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

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
    } catch (err) {
      console.error('Error analyzing costs:', err);
      toast.error(t('errorAnalyzingCosts'));
    }
  };

  // Actualizar contexto cuando se complete el análisis
  useEffect(() => {
    if (analysisResult) {
      updateAnalysisContext({
        pcapData: { fileName: pcapFile?.name, size: pcapFile?.size },
        pptData: { fileName: pptFile?.name, size: pptFile?.size },
        analysisResults: analysisResult,
        reportData: analysisResult
      });
      console.log(t('chatbotContextUpdated'));
      setActiveTab('report');
    }
  }, [analysisResult, pcapFile, pptFile, updateAnalysisContext, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-x-hidden">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6 max-w-7xl">
        {/* Header responsivo */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 shadow-lg">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-2 md:mb-4">
            {t('tituloAnalisis')}
          </h1>
          <p className="text-indigo-100 text-sm md:text-base lg:text-lg">
            {t('subtiAnalisis')}
          </p>
        </div>

        {/* Tabs responsivos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 h-auto p-1 bg-white dark:bg-gray-800 rounded-lg">
            <TabsTrigger 
              value="upload" 
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <span className="hidden sm:inline">📁 </span>
              {t('subirPdf')}
            </TabsTrigger>
            <TabsTrigger 
              value="report" 
              disabled={!analysisResult}
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white disabled:opacity-50"
            >
              <span className="hidden sm:inline">📊 </span>
              {t('informepdf')}
            </TabsTrigger>
            <TabsTrigger 
              value="costs" 
              disabled={!analysisResult}
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white disabled:opacity-50"
            >
              <span className="hidden sm:inline">💰 </span>
              {t('costespdf')}
            </TabsTrigger>
            <TabsTrigger 
              value="scores" 
              disabled={!analysisResult}
              className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white disabled:opacity-50"
            >
              <span className="hidden sm:inline">🎯 </span>
              {t('puntuacionPdf')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            {/* Upload boxes responsivos */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="text-base md:text-lg lg:text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <span className="text-lg md:text-xl">📄</span>
                    <span className="hidden sm:inline">{t('pcapFileLabel')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadBox
                    title={t('pcapFileTitle')}
                    description={t('pcapFileDescription')}
                    file={pcapFile}
                    onFileUpload={handlePcapUpload}
                    onFileRemove={() => setPcapFile(null)}
                    accept=".pdf"
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="text-base md:text-lg lg:text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <span className="text-lg md:text-xl">📊</span>
                    <span className="hidden sm:inline">{t('pptFileLabel')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadBox
                    title={t('pptFileTitle')}
                    description={t('pptFileDescription')}
                    file={pptFile}
                    onFileUpload={handlePptUpload}
                    onFileRemove={() => setPptFile(null)}
                    accept=".pdf"
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Botón de análisis responsivo */}
            {pcapFile && pptFile && (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="text-base md:text-lg lg:text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <span className="text-lg md:text-xl">📈</span>
                    {t('professionalCostAnalysisTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 md:p-6 border border-green-200 dark:border-green-700">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="text-green-600 dark:text-green-400 text-xl md:text-2xl">✅</div>
                      <div className="flex-1">
                        <p className="text-green-800 dark:text-green-200 font-medium text-sm md:text-base mb-2">
                          {t('filesReadyForAnalysis')}
                        </p>
                        <p className="text-green-600 dark:text-green-300 text-xs md:text-sm mb-4">
                          {t('analysisDescription')}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleAnalyzeCosts}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm md:text-base py-3 md:py-4 h-auto font-semibold"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>{t('analyzingWithAI')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">🚀</span>
                          <span>{t('startProfessionalCostAnalysis')}</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error display responsivo */}
            {error && (
              <Card className="shadow-lg border-0 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 text-xl flex-shrink-0">❌</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-red-800 dark:text-red-200 text-sm md:text-base mb-1">
                        {t('analysisErrorTitle')}
                      </h3>
                      <p className="text-red-600 dark:text-red-300 text-xs md:text-sm break-words">
                        {error}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="report" className="mt-4 md:mt-6">
            {analysisResult && <CostAnalysisReport data={analysisResult} />}
          </TabsContent>

          <TabsContent value="costs" className="mt-4 md:mt-6">
            {analysisResult && <CostBreakdownView data={analysisResult} />}
          </TabsContent>

          <TabsContent value="scores" className="mt-4 md:mt-6">
            {analysisResult && <ScoreAnalysisView data={analysisResult} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot responsivo */}
      <GeenioChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        context={analysisResult}
        language={language}
      />
    </div>
  );
};

export default CostAnalysisView;
