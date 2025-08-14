
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Edit } from 'lucide-react';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

interface DenominacionesTableProps {
  denominaciones: DenominacionHomogeneaData[];
  onGenerateCalendar?: () => void;
}

const ITEMS_PER_PAGE = 100;

const DenominacionesTable: React.FC<DenominacionesTableProps> = ({ 
  denominaciones, 
  onGenerateCalendar 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(denominaciones.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = denominaciones.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getFrecuenciaColor = (frecuencia: string) => {
    const freq = frecuencia.toLowerCase();
    if (freq.includes('mensual')) return 'bg-red-100 text-red-800 border-red-200';
    if (freq.includes('trimestral')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (freq.includes('semestral')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (freq.includes('anual')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTipoMantenimientoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('preventivo')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (tipoLower.includes('correctivo')) return 'bg-red-100 text-red-800 border-red-200';
    if (tipoLower.includes('calibración')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (tipoLower.includes('verificación')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            📊 Análisis de Denominaciones Homogéneas
          </CardTitle>
          {denominaciones.length > 0 && (
            <Button
              onClick={onGenerateCalendar}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              size="lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Generar Calendario Modificable
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Mostrando {startIndex + 1}-{Math.min(endIndex, denominaciones.length)} de {denominaciones.length} denominaciones
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Código</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Denominación</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Frecuencia</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr 
                    key={`${item.codigo}-${index}`}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-3">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {item.codigo}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {item.denominacion}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.cantidad}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={getFrecuenciaColor(item.frecuencia)}>
                        {item.frecuencia}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={getTipoMantenimientoColor(item.tipoMantenimiento)}>
                        {item.tipoMantenimiento}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.tiempo || 'No especificado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DenominacionesTable;
