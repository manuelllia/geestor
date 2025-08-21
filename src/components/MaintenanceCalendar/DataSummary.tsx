
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface DataSummaryProps {
  inventoryCount: number;
  denominacionesCount: number;
  frecTipoCount: number;
}

const DataSummary: React.FC<DataSummaryProps> = ({ 
  inventoryCount, 
  denominacionesCount, 
  frecTipoCount 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Resumen de Datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {inventoryCount}
            </div>
            <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
              Equipos en Inventario
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {denominacionesCount}
            </div>
            <div className="text-sm text-green-600/70 dark:text-green-400/70">
              Denominaciones Homogéneas
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {frecTipoCount}
            </div>
            <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
              Tipos de Mantenimiento
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSummary;
