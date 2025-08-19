import React, { useState, useMemo } from 'react'; // Importar useMemo
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// Importar ArrowUp, ArrowDown de lucide-react
import { FileUp, Download, RefreshCw, Plus, Calendar, ArrowUp, ArrowDown } from 'lucide-react'; 
import { getPracticeEvaluations, generatePracticeEvaluationToken, PracticeEvaluationRecord } from '../../services/practiceEvaluationService'; // Importa PracticeEvaluationRecord
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils'; // Asegúrate de que tienes esta utilidad (si no, ver nota al final)


export default function PracticeEvaluationsListView() {
  const { data: evaluations = [], isLoading, refetch } = useQuery({
    queryKey: ['practice-evaluations'],
    queryFn: getPracticeEvaluations,
  });

  // NUEVOS ESTADOS DE ORDENACIÓN
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Por defecto ascendente

  // LÓGICA DE ORDENACIÓN
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Si se hace clic en la misma columna, se cambia la dirección
      setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
    } else {
      // Si se hace clic en una nueva columna, se ordena por esa columna en ascendente
      setSortColumn(column);
      setSortDirection('asc');
    }
    // No hay paginación explícita aquí, pero si la añades, resetea currentPage a 1.
  };

  // DATOS ORDENADOS Y MEMORIZADOS
  const sortedEvaluations = useMemo(() => {
    if (!sortColumn) {
      return evaluations; // Si no hay columna de ordenación, devuelve los datos sin ordenar
    }

    const sortedData = [...evaluations].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Determinar los valores a comparar según la columna
      switch (sortColumn) {
        case 'studentName': // Ordenar por nombre completo del estudiante
          aValue = `${a.studentName} ${a.studentLastName}`;
          bValue = `${b.studentName} ${b.studentLastName}`;
          break;
        case 'tutorName': // Ordenar por nombre completo del tutor
          aValue = `${a.tutorName} ${a.tutorLastName}`;
          bValue = `${b.tutorName} ${b.tutorLastName}`;
          break;
        case 'workCenter':
        case 'formation':
        case 'finalEvaluation':
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
        case 'evaluationDate':
          // Asegúrate de que evaluationDate sea un objeto Date para comparar
          aValue = a.evaluationDate instanceof Date ? a.evaluationDate.getTime() : new Date(a.evaluationDate).getTime();
          bValue = b.evaluationDate instanceof Date ? b.evaluationDate.getTime() : new Date(b.evaluationDate).getTime();
          break;
        case 'performanceRating':
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
        default:
          // Fallback para cualquier otra columna si no se especifica el tipo de comparación
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
      }

      // Manejo de valores nulos o indefinidos para una ordenación consistente
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1; // Nulos al principio en asc, al final en desc
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, language === 'es' ? 'es-ES' : 'en-US'); // Comparación de cadenas sensible a la configuración regional
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue; // Comparación de números (ya sean ratings o timestamps de fecha)
      } else {
        // En caso de tipos mixtos o no manejados, intenta una conversión a string como fallback
        comparison = String(aValue).localeCompare(String(bValue), language === 'es' ? 'es-ES' : 'en-US');
      }

      return sortDirection === 'asc' ? comparison : -comparison; // Aplica la dirección
    });
    return sortedData;
  }, [evaluations, sortColumn, sortDirection, language]); // Dependencias para useMemo


  const handleGenerateLink = () => {
    const token = generatePracticeEvaluationToken();
    // Asegúrate de que esta URL coincida con la ruta en tu App.tsx si sigue usando un token
    // Si has cambiado /valoracion-practicas/:token a /crear-valoracion-practicas, este enlace ya no sería válido para el formulario de creación.
    // Esto es para la generación de enlaces ÚNICOS si volvieras a tener evaluaciones pre-creadas.
    const link = `${window.location.origin}/valoracion-practicas/${token}`; 
    
    navigator.clipboard.writeText(link);
    toast.success('Enlace copiado al portapapeles', {
      description: 'Comparte este enlace para que se complete la valoración de prácticas',
    });
  };

  const handleExport = () => {
    toast.info('Función de exportación', {
      description: 'Esta función se implementará próximamente',
    });
  };

  const handleImport = () => {
    toast.info('Función de importación', {
      description: 'Esta función se implementará próximamente',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-300">Valoración de Prácticas</CardTitle>
          <CardDescription>
            Gestiona las valoraciones de prácticas realizadas por los tutores de GEE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Si el formulario es para crear nuevas valoraciones y no requiere un token,
                este botón podría ir a '/crear-valoracion-practicas' o ser eliminado si ya no es relevante.
                Si es para que un tutor externo rellene una valoración específica pre-existente, entonces sí.
                Revisa cómo quieres que funcione el flujo de "Generar Enlace".
            */}
            <Button onClick={handleGenerateLink} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Generar Enlace de Valoración
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <FileUp className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>

          {evaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay valoraciones de prácticas registradas</p>
              <p className="text-sm">Genera un enlace para comenzar a recibir valoraciones</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Cabeceras ordenables */}
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('studentName')}
                    >
                      <div className="flex items-center">
                        Estudiante
                        {sortColumn === 'studentName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('tutorName')}
                    >
                      <div className="flex items-center">
                        Tutor
                        {sortColumn === 'tutorName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('workCenter')}
                    >
                      <div className="flex items-center">
                        Centro de Trabajo
                        {sortColumn === 'workCenter' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('formation')}
                    >
                      <div className="flex items-center">
                        Formación
                        {sortColumn === 'formation' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('finalEvaluation')}
                    >
                      <div className="flex items-center">
                        Evaluación Final
                        {sortColumn === 'finalEvaluation' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('evaluationDate')}
                    >
                      <div className="flex items-center">
                        Fecha
                        {sortColumn === 'evaluationDate' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none text-center" // Centrar la cabecera también
                      onClick={() => handleSort('performanceRating')}
                    >
                      <div className="flex items-center justify-center"> {/* Centrar contenido de cabecera */}
                        Valoración
                        {sortColumn === 'performanceRating' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Utiliza los datos ordenados: sortedEvaluations */}
                  {sortedEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {evaluation.studentName} {evaluation.studentLastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {evaluation.institution}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {evaluation.tutorName} {evaluation.tutorLastName}
                      </TableCell>
                      <TableCell>{evaluation.workCenter}</TableCell>
                      <TableCell>{evaluation.formation}</TableCell>
                      <TableCell>
                        <Badge variant={evaluation.finalEvaluation === 'Apto' ? 'default' : 'destructive'}>
                          {evaluation.finalEvaluation}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Asegúrate de que evaluation.evaluationDate sea un objeto Date para format */}
                        {evaluation.evaluationDate instanceof Date 
                           ? format(evaluation.evaluationDate, 'dd/MM/yyyy', { locale: es })
                           : 'Fecha no válida'}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-300">
                            {evaluation.performanceRating}/10
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}