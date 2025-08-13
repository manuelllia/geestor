
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
}

interface DenominacionesTableProps {
  denominaciones: DenominacionHomogeneaData[];
}

const DenominacionesTable: React.FC<DenominacionesTableProps> = ({ denominaciones }) => {
  if (denominaciones.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base md:text-lg">📋 Denominaciones Homogéneas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 sm:py-8">
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              No se encontraron denominaciones homogéneas en el inventario
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar por denominación para mostrar estadísticas
  const groupedStats = denominaciones.reduce((acc, item) => {
    const key = `${item.codigo}-${item.denominacion}`;
    if (!acc[key]) {
      acc[key] = {
        codigo: item.codigo,
        denominacion: item.denominacion,
        cantidad: item.cantidad,
        mantenimientos: []
      };
    }
    acc[key].mantenimientos.push({
      frecuencia: item.frecuencia,
      tipo: item.tipoMantenimiento
    });
    return acc;
  }, {} as any);

  const uniqueDenominaciones = Object.keys(groupedStats).length;
  const totalEquipos = denominaciones.reduce((sum, item) => sum + item.cantidad, 0);
  const totalMantenimientos = denominaciones.length;

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

  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('preventivo')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    } else if (tipoLower.includes('correctivo')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    } else if (tipoLower.includes('calibración') || tipoLower.includes('calibracion')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    }
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base md:text-lg">
          <span>📋 Denominaciones Homogéneas - Plan de Mantenimiento</span>
          <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
            ({uniqueDenominaciones} denominaciones, {totalMantenimientos} tipos de mantenimiento)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Estadísticas resumidas - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {uniqueDenominaciones}
            </div>
            <div className="text-xs sm:text-sm text-blue-600/70 dark:text-blue-400/70">
              Denominaciones Únicas
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {totalEquipos}
            </div>
            <div className="text-xs sm:text-sm text-green-600/70 dark:text-green-400/70">
              Total de Equipos
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-700 sm:col-span-2 lg:col-span-1">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalMantenimientos}
            </div>
            <div className="text-xs sm:text-sm text-purple-600/70 dark:text-purple-400/70">
              Tipos de Mantenimiento
            </div>
          </div>
        </div>

        {/* Tabla detallada - Responsive */}
        <div className="w-full overflow-x-auto rounded-md border">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-xs sm:text-sm w-20 sm:w-24">Código</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-32 sm:min-w-40">Denominación Homogénea</TableHead>
                <TableHead className="font-semibold text-center text-xs sm:text-sm w-16 sm:w-20">Cant.</TableHead>
                <TableHead className="font-semibold text-center text-xs sm:text-sm min-w-24 sm:min-w-28">Frecuencia</TableHead>
                <TableHead className="font-semibold text-center text-xs sm:text-sm min-w-28 sm:min-w-36">Tipo de Mantenimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {denominaciones.map((denominacion, index) => (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="p-2 sm:p-4">
                    <Badge variant="outline" className="font-mono text-xs break-all">
                      {denominacion.codigo}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-2 sm:p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm break-words">
                        {denominacion.denominacion}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center p-2 sm:p-4">
                    <Badge variant="secondary" className="font-semibold text-xs">
                      {denominacion.cantidad}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center p-2 sm:p-4">
                    <Badge className={`${getFrecuenciaColor(denominacion.frecuencia)} text-xs break-words`}>
                      {denominacion.frecuencia}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center p-2 sm:p-4">
                    <Badge className={`${getTipoColor(denominacion.tipoMantenimiento)} text-xs break-words`}>
                      {denominacion.tipoMantenimiento}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="text-green-600 dark:text-green-400 text-lg sm:text-2xl">✅</div>
            <div className="min-w-0 flex-1">
              <p className="text-green-700 dark:text-green-300 font-semibold mb-1 text-xs sm:text-sm">
                Análisis Completado Exitosamente
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm break-words">
                Se han procesado <strong>{uniqueDenominaciones} denominaciones homogéneas</strong> diferentes 
                con un total de <strong>{totalEquipos} equipos</strong> distribuidos en <strong>{totalMantenimientos} tipos de mantenimiento</strong> específicos.
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1 sm:mt-2">
                * Cada fila representa un tipo específico de mantenimiento para cada denominación homogénea.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DenominacionesTable;
