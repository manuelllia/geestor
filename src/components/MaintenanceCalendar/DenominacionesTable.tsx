
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface DenominacionHomogeneaData {
  codigo?: string;
  denominacion: string;
  cantidad: number;
  frecuencia?: string;
  tipoMantenimiento?: string;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Denominaciones Homogéneas Detectadas
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({denominaciones.length} tipos encontrados)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {denominacion.codigo || `COD-${index + 1}`}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {denominacion.denominacion}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {denominacion.cantidad}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {denominacion.frecuencia || 'No especificada'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {denominacion.tipoMantenimiento || 'No especificado'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <p className="text-green-700 dark:text-green-300 text-sm">
            <strong>Total:</strong> {denominaciones.reduce((total, d) => total + d.cantidad, 0)} equipos distribuidos en {denominaciones.length} denominaciones homogéneas diferentes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DenominacionesTable;
