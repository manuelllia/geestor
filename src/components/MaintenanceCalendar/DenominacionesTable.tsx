
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
      <Card>
        <CardHeader>
          <CardTitle>📋 Denominaciones Homogéneas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Denominaciones Homogéneas - Plan de Mantenimiento
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({uniqueDenominaciones} denominaciones, {totalMantenimientos} tipos de mantenimiento)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Estadísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {uniqueDenominaciones}
            </div>
            <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
              Denominaciones Únicas
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalEquipos}
            </div>
            <div className="text-sm text-green-600/70 dark:text-green-400/70">
              Total de Equipos
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalMantenimientos}
            </div>
            <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
              Tipos de Mantenimiento
            </div>
          </div>
        </div>

        {/* Tabla detallada */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Código</TableHead>
                <TableHead className="font-semibold">Denominación Homogénea</TableHead>
                <TableHead className="font-semibold text-center">Cantidad</TableHead>
                <TableHead className="font-semibold text-center">Frecuencia</TableHead>
                <TableHead className="font-semibold text-center">Tipo de Mantenimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {denominaciones.map((denominacion, index) => (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="font-mono text-xs">
                      {denominacion.codigo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {denominacion.denominacion}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold">
                      {denominacion.cantidad}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getFrecuenciaColor(denominacion.frecuencia)}>
                      {denominacion.frecuencia}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getTipoColor(denominacion.tipoMantenimiento)}>
                      {denominacion.tipoMantenimiento}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-start gap-3">
            <div className="text-green-600 dark:text-green-400 text-2xl">✅</div>
            <div>
              <p className="text-green-700 dark:text-green-300 font-semibold mb-1">
                Análisis Completado Exitosamente
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                Se han procesado <strong>{uniqueDenominaciones} denominaciones homogéneas</strong> diferentes 
                con un total de <strong>{totalEquipos} equipos</strong> distribuidos en <strong>{totalMantenimientos} tipos de mantenimiento</strong> específicos.
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-2">
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
