
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
  const [fileType, setFileType] = useState<'inventory' | 'maintenance'>('inventory');
  
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

  const handleFileUpload = (file: File, type: 'inventory' | 'maintenance') => {
    setFileType(type);
    if (type === 'inventory') {
      processInventoryFile(file);
    } else {
      processMaintenanceFile(file);
    }
  };

  const handleSheetsSelected = (sheets: any[]) => {
    setSelectedSheets(sheets);
    setProcessingStep('summary');
  };

  const handleGenerateCalendar = () => {
    generateAICalendar();
  };

  const handleBackToSheetSelection = () => {
    setProcessingStep('select-sheets');
  };

  const handleBackToUpload = () => {
    resetProcess();
  };

  const renderUploadContent = () => {
    switch (processingStep) {
      case 'select-sheets':
        return (
          <SheetSelector
            file={selectedSheets[0] ? new File([], selectedSheets[0].name) : new File([], 'file')}
            onSheetsSelected={handleSheetsSelected}
            onBack={handleBackToUpload}
          />
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
                  onFileUpload={(file) => handleFileUpload(file, 'inventory')}
                  isLoading={isLoading}
                  icon={<span>📦</span>}
                />
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
                  onFileUpload={(file) => handleFileUpload(file, 'maintenance')}
                  isLoading={isLoading}
                  icon={<span>🔧</span>}
                />
              </CardContent>
            </Card>
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

          {hasData && processingStep === 'upload' && (
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
