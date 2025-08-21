
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { useMaintenanceCalendar } from '../../hooks/useMaintenanceCalendar';
import MaintenanceFileUploader from './MaintenanceFileUploader';
import MaintenanceInventoryTable from './MaintenanceInventoryTable';
import MaintenanceCalendarGrid from './MaintenanceCalendarGrid';
import SheetSelector from './SheetSelector';
import DataSummary from './DataSummary';
import DenominacionAnalysis from './DenominacionAnalysis';
import AICalendarGenerator from './AICalendarGenerator';
import DenominacionesTable from './DenominacionesTable';
import EditableMaintenanceCalendar from './EditableMaintenanceCalendar';

interface MaintenanceCalendarViewProps {
  language: Language;
}

const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('upload');
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [maintenanceFile, setMaintenanceFile] = useState<File | null>(null);
  const [currentProcessingFile, setCurrentProcessingFile] = useState<'inventory' | 'maintenance' | null>(null);
  const [showEditableCalendar, setShowEditableCalendar] = useState(false);
  
  const {
    inventory,
    maintenanceCalendar,
    denominacionesData,
    processInventoryFile,
    processMaintenanceFile,
    isLoading,
    error,
    processingStep,
    selectedSheets,
    processFinalSheets,
    generateAICalendar,
    resetProcess,
    setSelectedSheets,
    setProcessingStep,
    frecTipoData
  } = useMaintenanceCalendar();

  const hasData = inventory.length > 0 || maintenanceCalendar.length > 0;
  const bothFilesUploaded = inventoryFile && maintenanceFile;
  const bothFilesProcessed = inventory.length > 0 && frecTipoData.length > 0;

  const handleInventoryUpload = (file: File) => {
    setInventoryFile(file);
    console.log('Archivo de inventario cargado:', file.name);
  };

  const handleMaintenanceUpload = (file: File) => {
    setMaintenanceFile(file);
    console.log('Archivo de mantenimiento cargado:', file.name);
  };

  const handleProcessFiles = () => {
    if (!bothFilesUploaded) return;
    
    setCurrentProcessingFile('inventory');
    processInventoryFile(inventoryFile);
  };

  const handleSheetsSelected = (sheets: any[]) => {
    setSelectedSheets(sheets);
    
    if (currentProcessingFile === 'inventory' && maintenanceFile) {
      processFinalSheets(true);
      setCurrentProcessingFile('maintenance');
      processMaintenanceFile(maintenanceFile);
    } else if (currentProcessingFile === 'maintenance') {
      processFinalSheets(false);
      setProcessingStep('generate-calendar');
    }
  };

  const handleGenerateCalendar = () => {
    generateAICalendar();
  };

  const handleBackToSheetSelection = () => {
    setProcessingStep('select-sheets');
  };

  const handleBackToUpload = () => {
    resetProcess();
    setInventoryFile(null);
    setMaintenanceFile(null);
    setCurrentProcessingFile(null);
  };

  const handleShowEditableCalendar = () => {
    setShowEditableCalendar(true);
  };

  const handleBackToAnalysis = () => {
    setShowEditableCalendar(false);
  };

  // Si se está mostrando el calendario editable
  if (showEditableCalendar) {
    return (
      <EditableMaintenanceCalendar
        denominaciones={denominacionesData}
        onBack={handleBackToAnalysis}
      />
    );
  }

  const renderUploadContent = () => {
    switch (processingStep) {
      case 'select-sheets':
        const currentFile = currentProcessingFile === 'inventory' ? inventoryFile : maintenanceFile;
        const fileTitle = currentProcessingFile === 'inventory' ? 'Inventario Hospitalario' : 'Calendario de Mantenimiento';
        
        return (
          <Card className="animate-slideInLeft">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base md:text-lg">📋 Seleccionar Hojas - {fileTitle}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <SheetSelector
                file={currentFile!}
                onSheetsSelected={handleSheetsSelected}
                onBack={() => handleBackToUpload()}
              />
            </CardContent>
          </Card>
        );

      case 'generate-calendar':
        return (
          <div className="space-y-4 sm:space-y-6">
            <Card className="animate-bounceIn">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                  🤖 Generar Calendario de Mantenimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-700">
                  <p className="text-blue-800 dark:text-blue-200 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                    ✅ Archivos procesados correctamente
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border">
                      <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        {inventory.length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Equipos en Inventario
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {frecTipoData.length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Datos de Mantenimiento
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-blue-600 dark:text-blue-300 text-xs sm:text-sm mb-3 sm:mb-4">
                    La IA analizará las denominaciones homogéneas y generará un calendario de mantenimiento personalizado.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleGenerateCalendar}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-xs sm:text-sm"
                      size="sm"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm">Generando...</span>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm">Generar Calendario con IA</span>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleBackToUpload}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      Volver al Inicio
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'processing':
        return (
          <Card className="animate-zoomIn">
            <CardContent className="flex items-center justify-center py-8 sm:py-12 p-3 sm:p-6">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-sm sm:text-lg font-medium text-center">Analizando denominaciones homogéneas...</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm text-center">Esto puede tomar unos momentos</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'complete':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="animate-slideInRight">
              <DenominacionesTable 
                denominaciones={denominacionesData} 
                onGenerateCalendar={handleShowEditableCalendar}
              />
            </div>
            
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 animate-fadeIn">
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="text-center">
                  <div className="text-green-600 dark:text-green-400 text-sm sm:text-lg font-medium mb-2">
                    ¡Análisis completado exitosamente!
                  </div>
                  <p className="text-green-700 dark:text-green-300 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Se han detectado {denominacionesData.length} tipos de equipos en el inventario
                  </p>
                  <Button onClick={() => handleBackToUpload()} variant="outline" size="sm" className="text-xs sm:text-sm">
                    Importar Más Archivos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="animate-slideInLeft hover-lift">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">📦 Inventario Hospitalario</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <MaintenanceFileUploader
                    title="Inventario Hospitalario"
                    description="Sube un archivo Excel o CSV con el inventario de equipos médicos"
                    acceptedFormats=".xlsx,.xls,.csv"
                    onFileUpload={(file) => setInventoryFile(file)}
                    isLoading={isLoading}
                    icon={<span>📦</span>}
                  />
                  {inventoryFile && (
                    <div className="mt-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 animate-bounceIn">
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium break-words">
                        ✅ Archivo cargado: {inventoryFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="animate-slideInRight hover-lift">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">🔧 Calendario de Mantenimiento</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <MaintenanceFileUploader
                    title="Calendario de Mantenimiento"
                    description="Sube un archivo Excel o CSV con la programación de mantenimiento"
                    acceptedFormats=".xlsx,.xls,.csv"
                    onFileUpload={(file) => setMaintenanceFile(file)}
                    isLoading={isLoading}
                    icon={<span>🔧</span>}
                  />
                  {maintenanceFile && (
                    <div className="mt-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 animate-bounceIn">
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium break-words">
                        ✅ Archivo cargado: {maintenanceFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {bothFilesUploaded && (
              <Card className="animate-zoomIn hover-glow">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-xl font-semibold text-blue-900 dark:text-blue-100">
                    📈 Procesar Archivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-700">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-3 sm:mb-4 text-xs sm:text-sm">
                      ✅ Ambos archivos están listos para procesar
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 text-xs sm:text-sm mb-3 sm:mb-4">
                      Se analizarán las hojas de cada archivo y podrás seleccionar cuáles importar.
                    </p>
                    <Button
                      onClick={() => {
                        if (!bothFilesUploaded) return;
                        setCurrentProcessingFile('inventory');
                        processInventoryFile(inventoryFile);
                      }}
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm"
                      size="sm"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm">Procesando...</span>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm">Procesar Archivos</span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {bothFilesProcessed && processingStep === 'upload' && (
              <div className="animate-float">
                <AICalendarGenerator
                  inventoryCount={inventory.length}
                  maintenanceDataCount={frecTipoData.length}
                  onGenerateCalendar={() => generateAICalendar()}
                  isLoading={isLoading}
                />
              </div>
            )}

            {hasData && processingStep === 'upload' && !bothFilesUploaded && (
              <Card className="animate-fadeIn">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base md:text-lg">✅ Estado de los Archivos</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${inventory.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-xs sm:text-sm">Inventario: {inventory.length} elementos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${maintenanceCalendar.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-xs sm:text-sm">Mantenimiento: {maintenanceCalendar.length} programaciones</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-lg p-4 sm:p-6 lg:p-8 animate-slideDown">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">Calendario de Mantenimiento</h1>
        <p className="text-emerald-100 text-sm sm:text-base lg:text-lg">
          Gestiona el inventario hospitalario y programa el mantenimiento de equipos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
          <TabsTrigger value="upload" className="text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">📁 Subir Archivos</span>
            <span className="sm:hidden">📁 Subir</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={denominacionesData.length === 0} className="text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">📊 Análisis ({denominacionesData.length})</span>
            <span className="sm:hidden">📊 ({denominacionesData.length})</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" disabled={inventory.length === 0} className="text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">📋 Inventario ({inventory.length})</span>
            <span className="sm:hidden">📋 ({inventory.length})</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" disabled={maintenanceCalendar.length === 0} className="text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">📅 Calendario ({maintenanceCalendar.length})</span>
            <span className="sm:hidden">📅 ({maintenanceCalendar.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {renderUploadContent()}
        </TabsContent>

        <TabsContent value="analysis" className="mt-4 sm:mt-6">
          <div className="animate-slideInLeft">
            <DenominacionesTable 
              denominaciones={denominacionesData}
              onGenerateCalendar={handleShowEditableCalendar}
            />
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4 sm:mt-6">
          <div className="animate-slideInRight">
            <MaintenanceInventoryTable inventory={inventory} language={language} />
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 sm:mt-6">
          <div className="animate-zoomIn">
            <MaintenanceCalendarGrid calendar={maintenanceCalendar} language={language} />
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 animate-bounceIn">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceCalendarView;
