
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

interface MaintenanceCalendarViewProps {
  language: Language;
}

const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('upload');
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [maintenanceFile, setMaintenanceFile] = useState<File | null>(null);
  const [currentProcessingFile, setCurrentProcessingFile] = useState<'inventory' | 'maintenance' | null>(null);
  
  const {
    inventory,
    maintenanceCalendar,
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
    setProcessingStep
  } = useMaintenanceCalendar();

  const hasData = inventory.length > 0 || maintenanceCalendar.length > 0;
  const bothFilesUploaded = inventoryFile && maintenanceFile;

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
    
    // Primero procesamos el archivo de inventario
    setCurrentProcessingFile('inventory');
    processInventoryFile(inventoryFile);
  };

  const handleSheetsSelected = (sheets: any[]) => {
    setSelectedSheets(sheets);
    
    // Si estamos procesando inventario y hay archivo de mantenimiento pendiente
    if (currentProcessingFile === 'inventory' && maintenanceFile) {
      // Procesamos las hojas seleccionadas del inventario
      processFinalSheets(true);
      // Después procesamos el archivo de mantenimiento
      setCurrentProcessingFile('maintenance');
      processMaintenanceFile(maintenanceFile);
    } else if (currentProcessingFile === 'maintenance') {
      // Procesamos las hojas seleccionadas del mantenimiento
      processFinalSheets(false);
      setProcessingStep('summary');
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

  const renderUploadContent = () => {
    switch (processingStep) {
      case 'select-sheets':
        const currentFile = currentProcessingFile === 'inventory' ? inventoryFile : maintenanceFile;
        const fileTitle = currentProcessingFile === 'inventory' ? 'Inventario Hospitalario' : 'Calendario de Mantenimiento';
        
        return (
          <Card>
            <CardHeader>
              <CardTitle>📋 Seleccionar Hojas - {fileTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <SheetSelector
                file={currentFile!}
                onSheetsSelected={handleSheetsSelected}
                onBack={handleBackToUpload}
              />
            </CardContent>
          </Card>
        );

      case 'summary':
        return (
          <DataSummary
            sheets={selectedSheets.filter(s => s.selected)}
            onBack={handleBackToSheetSelection}
            onGenerateCalendar={handleGenerateCalendar}
          />
        );

      case 'processing':
        return (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-lg font-medium">Generando calendario con IA...</p>
                <p className="text-gray-600 dark:text-gray-300">Esto puede tomar unos momentos</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'complete':
        return (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-green-600 dark:text-green-400 text-lg font-medium mb-2">
                  ¡Calendario generado exitosamente!
                </div>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Puedes ver los resultados en las pestañas de Inventario y Calendario
                </p>
                <Button onClick={handleBackToUpload} variant="outline">
                  Importar Más Archivos
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📦 Inventario Hospitalario</CardTitle>
                </CardHeader>
                <CardContent>
                  <MaintenanceFileUploader
                    title="Inventario Hospitalario"
                    description="Sube un archivo Excel o CSV con el inventario de equipos médicos"
                    acceptedFormats=".xlsx,.xls,.csv"
                    onFileUpload={handleInventoryUpload}
                    isLoading={isLoading}
                    icon={<span>📦</span>}
                  />
                  {inventoryFile && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                        ✅ Archivo cargado: {inventoryFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔧 Calendario de Mantenimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <MaintenanceFileUploader
                    title="Calendario de Mantenimiento"
                    description="Sube un archivo Excel o CSV con la programación de mantenimiento"
                    acceptedFormats=".xlsx,.xls,.csv"
                    onFileUpload={handleMaintenanceUpload}
                    isLoading={isLoading}
                    icon={<span>🔧</span>}
                  />
                  {maintenanceFile && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                        ✅ Archivo cargado: {maintenanceFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {bothFilesUploaded && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                    📈 Procesar Archivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-4">
                      ✅ Ambos archivos están listos para procesar
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 text-sm mb-4">
                      Se analizarán las hojas de cada archivo y podrás seleccionar cuáles importar.
                    </p>
                    <Button
                      onClick={handleProcessFiles}
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Procesando Archivos...
                        </div>
                      ) : (
                        'Procesar Archivos'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasData && processingStep === 'upload' && !bothFilesUploaded && (
              <Card>
                <CardHeader>
                  <CardTitle>✅ Estado de los Archivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${inventory.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Inventario: {inventory.length} elementos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${maintenanceCalendar.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Mantenimiento: {maintenanceCalendar.length} programaciones</span>
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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Calendario de Mantenimiento</h1>
        <p className="text-emerald-100 text-lg">
          Gestiona el inventario hospitalario y programa el mantenimiento de equipos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">📁 Subir Archivos</TabsTrigger>
          <TabsTrigger value="inventory" disabled={inventory.length === 0}>
            📋 Inventario ({inventory.length})
          </TabsTrigger>
          <TabsTrigger value="calendar" disabled={maintenanceCalendar.length === 0}>
            📅 Calendario ({maintenanceCalendar.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {renderUploadContent()}
        </TabsContent>

        <TabsContent value="inventory">
          <MaintenanceInventoryTable inventory={inventory} language={language} />
        </TabsContent>

        <TabsContent value="calendar">
          <MaintenanceCalendarGrid calendar={maintenanceCalendar} language={language} />
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceCalendarView;
