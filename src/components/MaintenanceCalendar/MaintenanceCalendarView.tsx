
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMaintenanceCalendar } from '@/hooks/useMaintenanceCalendar';
import MaintenanceCalendarGrid from './MaintenanceCalendarGrid';
import EditableMaintenanceCalendar from './EditableMaintenanceCalendar';
import DenominacionesPaginatedTable from './DenominacionesPaginatedTable';
import { Language } from '@/utils/translations';

interface MaintenanceCalendarViewProps {
  language: Language;
}

const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ language }) => {
  const {
    inventory,
    maintenanceCalendar,
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
    setProcessingStep,
    showEditableCalendar,
    showCalendarView,
    hideCalendarView
  } = useMaintenanceCalendar();

  const { t } = useTranslation(language);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{t('error')}: {error}</div>;
  }

  if (processingStep === 'upload') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Subir Archivos de Mantenimiento</h2>
        <p className="text-gray-500 mb-4">Sube los archivos de inventario y mantenimiento</p>
        <div className="flex space-x-4">
          <input
            type="file"
            onChange={(e) => e.target.files && processInventoryFile(e.target.files[0])}
            className="hidden"
            id="inventory-upload"
          />
          <label htmlFor="inventory-upload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Subir Inventario
          </label>
          <input
            type="file"
            onChange={(e) => e.target.files && processMaintenanceFile(e.target.files[0])}
            className="hidden"
            id="maintenance-upload"
          />
          <label htmlFor="maintenance-upload" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Subir Mantenimiento
          </label>
        </div>
      </div>
    );
  }

  if (processingStep === 'select-sheets') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Seleccionar Hojas</h2>
        <p className="text-gray-500">Selecciona las hojas que deseas procesar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedSheets.map(sheet => (
            <Card key={sheet.name} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">{sheet.name}</CardTitle>
                <CardDescription>
                  {sheet.rowCount} filas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {sheet.columns.map((col, index) => (
                          <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.preview.map((row, index) => (
                        <tr key={index}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <label className="inline-flex items-center">
                  <Input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-800"
                    checked={sheet.selected}
                    onChange={() => setSelectedSheets(prev =>
                      prev.map(s => s.name === sheet.name ? { ...s, selected: !s.selected } : s)
                    )}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Seleccionar hoja</span>
                </label>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={resetProcess} variant="outline">
            {t('cancel')}
          </Button>
          <Button onClick={() => processFinalSheets()}>
            Procesar Hojas Seleccionadas
          </Button>
        </div>
      </div>
    );
  }

  if (processingStep === 'processing') {
    return <div>Procesando datos...</div>;
  }

  if (processingStep === 'generate-calendar') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Generar Calendario</h2>
        <p className="text-gray-500">Genera el calendario de mantenimiento con IA</p>
        <Button onClick={generateAICalendar}>
          Generar Calendario de Mantenimiento con IA
        </Button>
      </div>
    );
  }

  if (showEditableCalendar) {
    return (
      <EditableMaintenanceCalendar
        denominacionesData={denominacionesData}
        frecTipoData={frecTipoData}
        onBack={hideCalendarView}
      />
    );
  }

  if (processingStep === 'complete') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              Calendario de Mantenimiento
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Análisis completado - {denominacionesData.length} denominaciones procesadas
            </p>
          </div>
          <Button 
            onClick={resetProcess}
            variant="outline"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Procesar Nuevos Archivos
          </Button>
        </div>

        <DenominacionesPaginatedTable 
          data={denominacionesData}
          onGenerateCalendar={showCalendarView}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Calendario de Mantenimiento</h2>
      <MaintenanceCalendarGrid calendar={maintenanceCalendar} language={language} />
    </div>
  );
};

export default MaintenanceCalendarView;
