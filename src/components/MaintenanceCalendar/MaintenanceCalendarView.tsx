
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileSpreadsheet, Calendar, BarChart3, ArrowLeft } from 'lucide-react';
import { useMaintenanceCalendar } from '../../hooks/useMaintenanceCalendar';
import { useOptimizedMaintenanceCalendar } from '../../hooks/useOptimizedMaintenanceCalendar';
import AICalendarGenerator from './AICalendarGenerator';
import DataSummary from './DataSummary';
import DenominacionesEditableTable from './DenominacionesEditableTable';
import EditableMaintenanceCalendar from './EditableMaintenanceCalendar';
import OptimizedCalendarGenerator from './OptimizedCalendarGenerator';

const MaintenanceCalendarView: React.FC = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'analysis' | 'calendar'>('upload');
  
  const {
    inventory,
    denominacionesData,
    isLoading,
    error,
    processingStep,
    selectedSheets,
    frecTipoData,
    processInventoryFile,
    processMaintenanceFile,
    processFinalSheets,
    generateAICalendar,
    resetProcess,
    setSelectedSheets,
    setProcessingStep
  } = useMaintenanceCalendar();

  const {
    denominaciones,
    events,
    setEvents,
    isGenerating,
    generationProgress,
    selectedEvent,
    setSelectedEvent,
    constraints,
    setConstraints,
    generateOptimizedCalendar,
    updateDenominaciones,
    stats
  } = useOptimizedMaintenanceCalendar(denominacionesData);

  const handleGenerateCalendar = () => {
    setCurrentView('calendar');
    generateOptimizedCalendar();
  };

  const handleBackToAnalysis = () => {
    setCurrentView('analysis');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'upload':
        return (
          <AICalendarGenerator
            inventory={inventory}
            isLoading={isLoading}
            error={error}
            processingStep={processingStep}
            selectedSheets={selectedSheets}
            onInventoryFileUpload={processInventoryFile}
            onMaintenanceFileUpload={processMaintenanceFile}
            onProcessSheets={processFinalSheets}
            onGenerateCalendar={generateAICalendar}
            onReset={resetProcess}
            onSheetsChange={setSelectedSheets}
            onStepChange={setProcessingStep}
          />
        );
      
      case 'analysis':
        return (
          <div className="space-y-6">
            <DataSummary 
              inventoryCount={inventory.length}
              denominacionesCount={denominacionesData.length}
              frecTipoCount={frecTipoData.length}
            />
            
            <DenominacionesEditableTable
              denominaciones={denominacionesData}
              onUpdateDenominaciones={updateDenominaciones}
              onGenerateCalendar={handleGenerateCalendar}
              isGenerating={isGenerating}
            />
          </div>
        );
      
      case 'calendar':
        return (
          <>
            <OptimizedCalendarGenerator 
              isGenerating={isGenerating}
              progress={generationProgress}
            />
            <EditableMaintenanceCalendar
              denominaciones={denominaciones}
              onBack={handleBackToAnalysis}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  // Mostrar el análisis una vez completado el procesamiento
  if (processingStep === 'complete' && currentView === 'upload') {
    setCurrentView('analysis');
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-6 w-6" />
                🏥 Calendario de Mantenimiento Profesional
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Sistema avanzado de programación de mantenimientos con IA y optimización inteligente
              </p>
            </div>
            {currentView !== 'upload' && (
              <Button
                onClick={() => {
                  resetProcess();
                  setCurrentView('upload');
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nuevo Análisis
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              currentView === 'upload' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <FileSpreadsheet className="h-4 w-4" />
              Carga de Datos
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              currentView === 'analysis' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <BarChart3 className="h-4 w-4" />
              Análisis de Denominaciones
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              currentView === 'calendar' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <Calendar className="h-4 w-4" />
              Calendario Interactivo
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current View Content */}
      {renderCurrentView()}
    </div>
  );
};

export default MaintenanceCalendarView;
