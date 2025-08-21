
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Loader2, Calendar, Clock, Wrench, CheckCircle } from 'lucide-react';

interface OptimizedCalendarGeneratorProps {
  isGenerating: boolean;
  progress?: {
    current: number;
    total: number;
    currentTask: string;
  };
}

const OptimizedCalendarGenerator: React.FC<OptimizedCalendarGeneratorProps> = ({
  isGenerating,
  progress
}) => {
  if (!isGenerating) return null;

  const progressPercentage = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95">
        <CardContent className="p-8 text-center">
          {/* Icono animado */}
          <div className="mb-6 relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Generando Calendario Profesional
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Optimizando distribución de mantenimientos...
          </p>

          {/* Barra de progreso */}
          {progress && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Procesando: {progress.current} / {progress.total}</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {progress.currentTask}
              </p>
            </div>
          )}

          {/* Etapas del proceso */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Análisis de denominaciones completado</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-gray-700 dark:text-gray-300">Optimizando distribución temporal</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">Aplicando lógica de mantenimiento especializada</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Wrench className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">Generando calendario final</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Optimización inteligente:</strong> El sistema está aplicando algoritmos avanzados 
              para distribuir eficientemente los mantenimientos, considerando factores como 
              estacionalidad, carga de trabajo y recursos disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedCalendarGenerator;
