
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

interface AICalendarGeneratorProps {
  inventoryCount: number;
  maintenanceDataCount: number;
  onGenerateCalendar: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const AICalendarGenerator: React.FC<AICalendarGeneratorProps> = ({
  inventoryCount,
  maintenanceDataCount,
  onGenerateCalendar,
  isLoading,
  disabled = false
}) => {
  const hasData = inventoryCount > 0 && maintenanceDataCount > 0;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Bot className="w-6 h-6" />
          Generador de Calendario con IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {inventoryCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Equipos en Inventario
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {maintenanceDataCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Datos de Mantenimiento
            </div>
          </div>
        </div>

        {hasData ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                ✅ Datos listos para procesamiento
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Se analizarán las denominaciones homogéneas y se generará el calendario de mantenimiento personalizado
              </p>
            </div>
            
            <Button 
              onClick={onGenerateCalendar}
              disabled={disabled || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizando Denominaciones Homogéneas...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generar Calendario de Mantenimiento con IA
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
            <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
              ⚠️ Datos incompletos
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
              Se necesitan tanto datos del inventario como del plan de mantenimiento para generar el calendario
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICalendarGenerator;
