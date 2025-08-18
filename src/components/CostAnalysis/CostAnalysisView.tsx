import React, { useState, useEffect } from 'react';
import { useCostAnalysis } from '../../hooks/useCostAnalysis';
import CostAnalysisReport from './CostAnalysisReport';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Upload, BarChart3, Calculator } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

// Simple file upload component
const SimpleFileUpload = ({ onFileUpload }: { onFileUpload: (file: File) => Promise<void> }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onFileUpload(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setIsUploading(true);
      try {
        await onFileUpload(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center gap-4">
        <FileText className="w-12 h-12 text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isUploading ? 'Procesando archivo...' : 'Arrastra tu archivo aquí'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            O haz clic para seleccionar
          </p>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar archivo
          </label>
        </div>
      </div>
    </div>
  );
};

interface CostAnalysisViewProps {
  language: Language;
}

export default function CostAnalysisView({ language }: CostAnalysisViewProps) {
  const { t } = useTranslation(language);
  const { analyzeCosts, analysisResult, isLoading, error } = useCostAnalysis();
  const [currentView, setCurrentView] = useState<'upload' | 'analysis'>('upload');

  const handleFileUpload = async (file: File) => {
    // Para este componente, necesitaríamos dos archivos (PCAP y PPT)
    // Por ahora, usamos el mismo archivo para ambos
    await analyzeCosts(file, file);
    if (!error) {
      setCurrentView('analysis');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header responsive */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-blue-200 dark:border-blue-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Análisis de Coste
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                Analiza y compara costes de ofertas
              </p>
            </div>
          </div>
          
          {/* Navigation buttons - stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant={currentView === 'upload' ? 'default' : 'outline'}
              onClick={() => setCurrentView('upload')}
              className="w-full sm:w-auto text-xs sm:text-sm"
              size="sm"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Subir Archivo
            </Button>
            <Button
              variant={currentView === 'analysis' ? 'default' : 'outline'}
              onClick={() => setCurrentView('analysis')}
              disabled={!analysisResult}
              className="w-full sm:w-auto text-xs sm:text-sm"
              size="sm"
            >
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Ver Análisis
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area - responsive */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'upload' ? (
          <div className="h-full p-3 sm:p-4 lg:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {/* Upload section */}
              <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-800/50">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-white mb-2">
                    Sube tu archivo de costes
                  </CardTitle>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Acepta archivos Excel (.xlsx, .xls) y CSV con datos de ofertas y costes
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <SimpleFileUpload onFileUpload={handleFileUpload} />
                </CardContent>
              </Card>

              {/* Instructions - responsive grid */}
              <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                          Prepara tu archivo
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          Asegúrate de que incluya columnas como: Proveedor, Precio, Descripción, Cantidad
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                          Sube el archivo
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          Arrastra y suelta o haz clic para seleccionar tu archivo de datos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 md:col-span-2 lg:col-span-1">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                          Revisa el análisis
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          Obtén comparativas detalladas y recomendaciones automáticas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <CostAnalysisReport analysis={analysisResult} language={language} />
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center">
              Analizando archivo...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
          <div className="max-w-sm mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Error al procesar archivo
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                {error}
              </p>
              <Button 
                onClick={() => setCurrentView('upload')} 
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
