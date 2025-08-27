import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { ResponsiveTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/responsive-table';
import PracticeEvaluationDetailView from './PracticeEvaluationDetailView';
import { getPracticeEvaluations, PracticeEvaluationRecord, exportPracticeEvaluationsToCSV } from '../../services/practiceEvaluationService';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useResponsive } from '../../hooks/useResponsive';

interface PracticeEvaluationsListViewProps {
  language: Language;
}

const PracticeEvaluationsListView: React.FC<PracticeEvaluationsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { permissions } = useUserPermissions();
  const { isMobile, isTablet } = useResponsive();
  
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PracticeEvaluationRecord | null>(null);
  const [evaluations, setEvaluations] = useState<PracticeEvaluationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const canView = permissions?.Per_View ?? true;

  const loadEvaluations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const evaluationsData = await getPracticeEvaluations();
      setEvaluations(evaluationsData);
    } catch (err) {
      console.error('Error cargando evaluaciones:', err);
      setError('Error al cargar las evaluaciones de prácticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  const totalPages = Math.ceil(evaluations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, evaluations.length);
  const currentData = evaluations.slice(startIndex, endIndex);

  const handleViewDetails = (evaluation: PracticeEvaluationRecord) => {
    setSelectedEvaluation(evaluation);
    setShowDetailView(true);
  };

  const handleExport = async () => {
    try {
      await exportPracticeEvaluationsToCSV();
      console.log('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  if (showDetailView && selectedEvaluation) {
    return (
      <PracticeEvaluationDetailView
        evaluation={selectedEvaluation}
        onClose={() => {
          setShowDetailView(false);
          setSelectedEvaluation(null);
          loadEvaluations();
        }}
      />
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="responsive-container responsive-padding space-y-4 sm:space-y-6">
        {/* Header responsivo */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <h1 className="responsive-title font-semibold text-primary">
            Valoración de Prácticas
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={loadEvaluations}
              variant="outline"
              disabled={isLoading}
              className="button-responsive border-primary/30 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`icon-responsive mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Actualizar</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExport}
              className="button-responsive border-primary/30 text-primary hover:bg-primary/10"
            >
              <FileDown className="icon-responsive mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{t('export')}</span>
            </Button>
          </div>
        </div>

        {/* Card con tabla responsiva */}
        <Card className="border-primary/20">
          <CardHeader className="responsive-padding">
            <CardTitle className="responsive-subtitle text-primary">
              Lista de Evaluaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="text-center py-8 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="responsive-text font-medium text-destructive mb-2">
                  Error al cargar datos
                </h3>
                <p className="responsive-text text-destructive/80 mb-4">
                  {error}
                </p>
                <Button onClick={loadEvaluations} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Intentar de nuevo
                </Button>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-12 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
                <h3 className="responsive-text font-medium text-foreground mb-2">
                  Cargando evaluaciones...
                </h3>
              </div>
            )}
            
            {!isLoading && !error && evaluations.length === 0 && (
              <div className="text-center py-12 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="responsive-text font-medium text-foreground mb-2">
                  No hay evaluaciones de prácticas
                </h3>
                <p className="responsive-text text-muted-foreground mb-4">
                  Las evaluaciones aparecerán aquí cuando los estudiantes completen el formulario de valoración.
                </p>
              </div>
            )}
            
            {!isLoading && !error && evaluations.length > 0 && (
              <div className="w-full">
                <ResponsiveTable minWidth="900px">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[140px]">
                          <span className="responsive-text font-medium">Estudiante</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">Institución</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">Centro de Trabajo</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">Tutor</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">Fecha Evaluación</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">Puntuación</span>
                        </TableHead>
                        <TableHead className="text-center min-w-[100px]">
                          <span className="responsive-text font-medium">{t('actions')}</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((evaluation) => (
                        <TableRow key={evaluation.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="responsive-text truncate max-w-[120px]">
                              {evaluation.studentName} {evaluation.studentLastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {evaluation.institution}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {evaluation.workCenter}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {evaluation.tutorName} {evaluation.tutorLastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text">
                              {evaluation.evaluationDate ? formatDate(evaluation.evaluationDate) : 'No especificada'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getScoreBadge(evaluation.performanceRating)} text-xs`}>
                              {evaluation.performanceRating}/10
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {canView && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(evaluation)}
                                  title={t('view')}
                                  className="hover:bg-primary/10"
                                >
                                  <Eye className="icon-responsive flex-shrink-0" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ResponsiveTable>

                {/* Paginación responsiva */}
                {evaluations.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center responsive-padding responsive-gap">
                    <div className="responsive-text text-muted-foreground">
                      Mostrando {startIndex + 1} a {endIndex} de {evaluations.length} registros
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="responsive-text"
                      >
                        Anterior
                      </Button>
                      
                      <div className="text-sm text-muted-foreground">
                        {currentPage} de {totalPages}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="responsive-text"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticeEvaluationsListView;
