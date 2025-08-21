
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Loader2, Upload, FileSpreadsheet } from 'lucide-react';

interface InventoryItem {
  id: string;
  denominacion: string;
  cantidad: number;
}

interface SheetInfo {
  name: string;
  rowCount: number;
  columns: string[];
}

interface AICalendarGeneratorProps {
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string;
  processingStep: 'upload' | 'select-sheets' | 'generate-calendar' | 'processing' | 'complete';
  selectedSheets: SheetInfo[];
  onInventoryFileUpload: (file: File) => void;
  onMaintenanceFileUpload: (file: File) => void;
  onProcessSheets: () => void;
  onGenerateCalendar: () => void;
  onReset: () => void;
  onSheetsChange: (sheets: SheetInfo[]) => void;
  onStepChange: (step: 'upload' | 'select-sheets' | 'generate-calendar' | 'processing' | 'complete') => void;
}

const AICalendarGenerator: React.FC<AICalendarGeneratorProps> = ({
  inventory,
  isLoading,
  error,
  processingStep,
  selectedSheets,
  onInventoryFileUpload,
  onMaintenanceFileUpload,
  onProcessSheets,
  onGenerateCalendar,
  onReset,
  onSheetsChange,
  onStepChange
}) => {
  const hasInventory = inventory.length > 0;
  const hasSelectedSheets = selectedSheets.length > 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'inventory' | 'maintenance') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'inventory') {
        onInventoryFileUpload(file);
      } else {
        onMaintenanceFileUpload(file);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Bot className="w-6 h-6" />
          Generador de Calendario con IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              ❌ Error: {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">1. Subir Inventario</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, 'inventory')}
                className="hidden"
                id="inventory-upload"
              />
              <label
                htmlFor="inventory-upload"
                className="cursor-pointer flex flex-col items-center gap-2 text-center"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {hasInventory ? `${inventory.length} equipos cargados` : 'Subir archivo de inventario'}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">2. Subir Plan de Mantenimiento</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, 'maintenance')}
                className="hidden"
                id="maintenance-upload"
              />
              <label
                htmlFor="maintenance-upload"
                className="cursor-pointer flex flex-col items-center gap-2 text-center"
              >
                <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {hasSelectedSheets ? `${selectedSheets.length} hojas seleccionadas` : 'Subir plan de mantenimiento'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {hasInventory && hasSelectedSheets && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                ✅ Datos listos para procesamiento
              </p>
            </div>
            
            <Button 
              onClick={onGenerateCalendar}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generar Calendario de Mantenimiento con IA
                </div>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICalendarGenerator;
