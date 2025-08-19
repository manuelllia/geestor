
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileUp, Download, RefreshCw, Plus, Calendar } from 'lucide-react';
import { getPracticeEvaluations, generatePracticeEvaluationToken } from '../../services/practiceEvaluationService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PracticeEvaluationsListView() {
  const { data: evaluations = [], isLoading, refetch } = useQuery({
    queryKey: ['practice-evaluations'],
    queryFn: getPracticeEvaluations,
  });

  const handleGenerateLink = () => {
    const token = generatePracticeEvaluationToken();
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
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Centro de Trabajo</TableHead>
                    <TableHead>Formación</TableHead>
                    <TableHead>Evaluación Final</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Valoración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
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
                        {format(evaluation.evaluationDate, 'dd/MM/yyyy', { locale: es })}
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
