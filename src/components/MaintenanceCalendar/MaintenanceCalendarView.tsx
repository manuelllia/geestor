import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Bot, FileSpreadsheet, Layers, BarChart3, AlertTriangle, Settings, Package, Calendar } from 'lucide-react';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import MaintenanceFileUploader from './MaintenanceFileUploader';
import AICalendarGenerator from './AICalendarGenerator';
import SheetSelector from './SheetSelector';
import DataSummary from './DataSummary';
import DenominacionAnalysis from './DenominacionAnalysis';
import IncompleteDenominationsManager from './IncompleteDenominationsManager';
import MaintenanceInventoryTable from './MaintenanceInventoryTable';
import EditableMaintenanceCalendar from './EditableMaintenanceCalendar';
import MaintenanceEventModal from './MaintenanceEventModal';
import HospitalConfirmationModal from './HospitalConfirmationModal';

interface MaintenanceCalendarViewProps {
  language: Language;
}

const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [showUploader, setShowUploader] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [maintenanceData, setMaintenanceData] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  const handleFileProcessed = useCallback((data: any, sheetNames: string[]) => {
    setSheets(sheetNames);
    setSelectedSheet(sheetNames[0]);
    setMaintenanceData(data[sheetNames[0]]);
  }, []);

  useEffect(() => {
    if (selectedSheet && maintenanceData.length > 0) {
      generateCalendarEvents(maintenanceData);
    }
  }, [selectedSheet, maintenanceData]);

  const generateCalendarEvents = useCallback((data: any[]) => {
    const events = data.map((item) => ({
      title: item.Denominación,
      start: new Date(item.Fecha),
      end: new Date(item.Fecha),
      allDay: true,
      resource: item,
    }));
    setCalendarEvents(events);
  }, []);

  const handleAICalendarGenerated = (events: any[]) => {
    setCalendarEvents(events);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event.event);
    setIsEventModalOpen(true);
  };

  const handleEventSave = (updatedEvent: any) => {
    const updatedEvents = calendarEvents.map((event) =>
      event.title === updatedEvent.title ? updatedEvent : event
    );
    setCalendarEvents(updatedEvents);
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleHospitalConfirm = () => {
    setShowHospitalModal(false);
    // Aquí puedes implementar la lógica para enviar la confirmación al hospital
    alert('Confirmación enviada al hospital para ' + selectedEvent.title);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
            Calendario de Mantenimientos
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Gestiona y visualiza los mantenimientos programados
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={() => setShowUploader(!showUploader)}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Subir Archivo</span>
            <span className="sm:hidden">Subir</span>
          </Button>
          
          <Button
            onClick={() => setShowAIGenerator(!showAIGenerator)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          >
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Generar con IA</span>
            <span className="sm:hidden">IA</span>
          </Button>
        </div>
      </div>

      {/* Subida de archivos */}
      {showUploader && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2 text-sm sm:text-base">
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
              Subir Archivo de Mantenimientos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <MaintenanceFileUploader onFileProcessed={handleFileProcessed} />
          </CardContent>
        </Card>
      )}

      {/* Generador de IA */}
      {showAIGenerator && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2 text-sm sm:text-base">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              Generador de Calendario con IA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <AICalendarGenerator onCalendarGenerated={handleAICalendarGenerated} />
          </CardContent>
        </Card>
      )}

      {/* Selector de hojas */}
      {sheets.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2 text-sm sm:text-base">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              Seleccionar Hoja de Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <SheetSelector
              sheets={sheets}
              selectedSheet={selectedSheet}
              onSheetSelect={setSelectedSheet}
            />
          </CardContent>
        </Card>
      )}

      {/* Resumen de datos */}
      {maintenanceData.length > 0 && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              Resumen de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <DataSummary data={maintenanceData} />
          </CardContent>
        </Card>
      )}

      {/* Análisis de denominaciones */}
      {maintenanceData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                Análisis de Denominaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <DenominacionAnalysis data={maintenanceData} />
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2 text-sm sm:text-base">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                Denominaciones Incompletas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <IncompleteDenominationsManager
                data={maintenanceData}
                onUpdateData={setMaintenanceData}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de inventario */}
      {maintenanceData.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2 text-sm sm:text-base">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Inventario de Mantenimientos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <MaintenanceInventoryTable data={maintenanceData} />
          </CardContent>
        </Card>
      )}

      {/* Calendario de mantenimientos */}
      {calendarEvents.length > 0 && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Calendario de Mantenimientos Generado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <EditableMaintenanceCalendar
              events={calendarEvents}
              onEventsChange={setCalendarEvents}
              onEventClick={handleEventClick}
            />
          </CardContent>
        </Card>
      )}

      {/* Modal de evento */}
      {selectedEvent && (
        <MaintenanceEventModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleEventSave}
        />
      )}

      {/* Modal de confirmación de hospital */}
      {showHospitalModal && selectedEvent && (
        <HospitalConfirmationModal
          event={selectedEvent}
          isOpen={showHospitalModal}
          onClose={() => setShowHospitalModal(false)}
          onConfirm={handleHospitalConfirm}
        />
      )}
    </div>
  );
};

export default MaintenanceCalendarView;
