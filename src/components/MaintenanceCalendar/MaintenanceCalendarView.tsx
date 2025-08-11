
import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { useMaintenanceCalendar } from '../../hooks/useMaintenanceCalendar';
import MaintenanceFileUploader from './MaintenanceFileUploader';
import MaintenanceInventoryTable from './MaintenanceInventoryTable';
import MaintenanceCalendarGrid from './MaintenanceCalendarGrid';

interface MaintenanceCalendarViewProps {
  language: Language;
}

const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const {
    inventory,
    maintenanceCalendar,
    isLoading,
    error,
    processInventoryFile,
    processMaintenanceFile
  } = useMaintenanceCalendar();

  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'calendar'>('upload');

  const hasData = inventory.length > 0 || maintenanceCalendar.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Calendario de Mantenimiento
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Gestiona el inventario de equipos y programa el mantenimiento
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-blue-50 dark:bg-blue-900/30 p-1 rounded-lg">
        <Button
          variant={activeTab === 'upload' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upload')}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Subir Archivos
        </Button>
        <Button
          variant={activeTab === 'inventory' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('inventory')}
          className="flex-1"
          disabled={inventory.length === 0}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Inventario ({inventory.length})
        </Button>
        <Button
          variant={activeTab === 'calendar' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('calendar')}
          className="flex-1"
          disabled={maintenanceCalendar.length === 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendario ({maintenanceCalendar.length})
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaintenanceFileUploader
            title="Inventario de Hospital"
            description="Sube un archivo Excel o CSV con el inventario de equipos médicos"
            acceptedFormats=".xlsx,.xls,.csv"
            onFileUpload={processInventoryFile}
            isLoading={isLoading}
            icon={<FileSpreadsheet className="h-8 w-8 text-blue-500" />}
          />
          <MaintenanceFileUploader
            title="Calendario de Mantenimiento"
            description="Sube un archivo Excel o CSV con la programación de mantenimientos"
            acceptedFormats=".xlsx,.xls,.csv"
            onFileUpload={processMaintenanceFile}
            isLoading={isLoading}
            icon={<Calendar className="h-8 w-8 text-green-500" />}
          />
        </div>
      )}

      {activeTab === 'inventory' && inventory.length > 0 && (
        <MaintenanceInventoryTable inventory={inventory} language={language} />
      )}

      {activeTab === 'calendar' && maintenanceCalendar.length > 0 && (
        <MaintenanceCalendarGrid calendar={maintenanceCalendar} language={language} />
      )}

      {/* Instructions */}
      {!hasData && activeTab === 'upload' && (
        <Card className="border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Instrucciones de Uso
            </CardTitle>
            <CardDescription>
              Sigue estos pasos para configurar tu calendario de mantenimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  Archivo de Inventario
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Columna A: Nombre del equipo</li>
                  <li>• Columna B: Modelo</li>
                  <li>• Columna C: Número de serie</li>
                  <li>• Columna D: Ubicación</li>
                  <li>• Columna E: Departamento</li>
                  <li>• Columna F: Fecha de adquisición</li>
                  <li>• Columna G: Último mantenimiento</li>
                  <li>• Columna H: Próximo mantenimiento</li>
                  <li>• Columna I: Estado</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Archivo de Calendario
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Columna A: ID del equipo</li>
                  <li>• Columna B: Nombre del equipo</li>
                  <li>• Columna C: Tipo de mantenimiento</li>
                  <li>• Columna D: Fecha programada</li>
                  <li>• Columna E: Duración estimada</li>
                  <li>• Columna F: Técnico asignado</li>
                  <li>• Columna G: Prioridad</li>
                  <li>• Columna H: Estado</li>
                  <li>• Columna I: Notas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceCalendarView;
