
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, Package, Settings } from 'lucide-react';

interface DenominacionHomogeneaData {
  denominacion: string;
  cantidad: number;
  frecuencia?: string;
  tipoMantenimiento?: string;
}

interface DenominacionAnalysisProps {
  denominaciones: DenominacionHomogeneaData[];
}

const DenominacionAnalysis: React.FC<DenominacionAnalysisProps> = ({ denominaciones }) => {
  const totalEquipos = denominaciones.reduce((sum, item) => sum + item.cantidad, 0);
  const totalTipos = denominaciones.length;

  const getFrecuenciaColor = (frecuencia: string) => {
    const freq = frecuencia.toLowerCase();
    if (freq.includes('diario') || freq.includes('semanal')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    } else if (freq.includes('mensual')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    } else if (freq.includes('trimestral') || freq.includes('semestral')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    } else if (freq.includes('anual')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Análisis de Denominaciones Homogéneas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalTipos}</div>
              <div className="text-blue-100">Tipos de Equipos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalEquipos}</div>
              <div className="text-blue-100">Total de Equipos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {denominaciones.filter(d => d.frecuencia && !d.frecuencia.includes('No especificada')).length}
              </div>
              <div className="text-blue-100">Con Frecuencia Definida</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Detalle por Denominación Homogénea
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Denominación Homogénea</TableHead>
                  <TableHead className="text-center">Cantidad en Inventario</TableHead>
                  <TableHead>Frecuencia de Mantenimiento</TableHead>
                  <TableHead>Tipo de Mantenimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {denominaciones.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        {item.denominacion}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-semibold">
                        {item.cantidad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFrecuenciaColor(item.frecuencia || '')}>
                        {item.frecuencia}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.tipoMantenimiento}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DenominacionAnalysis;
