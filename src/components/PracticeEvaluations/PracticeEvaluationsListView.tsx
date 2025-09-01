
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash, FileText, Plus, RefreshCw, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getPracticeEvaluations, deletePracticeEvaluation, exportPracticeEvaluationsToCSV, PracticeEvaluationRecord } from '../../services/practiceEvaluationService';
import PracticeEvaluationDetailView from './PracticeEvaluationDetailView';
import { toast } from 'sonner';

interface PracticeEvaluationsListViewProps {
  language: Language;
}

export const PracticeEvaluationsListView: React.FC<PracticeEvaluationsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [evaluations, setEvaluations] = useState<PracticeEvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PracticeEvaluationRecord | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<PracticeEvaluationRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const evaluationsData = await getPracticeEvaluations();
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error('Error loading evaluations:', error);
      toast.error('Error al cargar las evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvaluations();
    setRefreshing(false);
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      toast.info(t('exporting_data'));
      await exportPracticeEvaluationsToCSV();
      toast.success(t('export_successful'));
    } catch (error) {
      console.error('Error exporting evaluations:', error);
      toast.error(t('export_failed'));
    } finally {
      setExporting(false);
    }
  };

  const handleViewEvaluation = (evaluation: PracticeEvaluationRecord) => {
    setSelectedEvaluation(evaluation);
    setShowDetailView(true);
  };

  const handleDeleteEvaluation = (evaluation: PracticeEvaluationRecord) => {
    setEvaluationToDelete(evaluation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!evaluationToDelete) return;

    try {
      await deletePracticeEvaluation(evaluationToDelete.id);
      await loadEvaluations();
      toast.success('Evaluación eliminada correctamente');
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      toast.error('Error al eliminar la evaluación');
    } finally {
      setDeleteDialogOpen(false);
      setEvaluationToDelete(null);
    }
  };

  // Cálculos de paginación
  const totalItems = evaluations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = evaluations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (showDetailView && selectedEvaluation) {
    return (
      <PracticeEvaluationDetailView
        evaluation={selectedEvaluation}
        language={language}
        onBack={() => {
          setShowDetailView(false);
          setSelectedEvaluation(null);
        }}
        onDelete={() => {
          if (selectedEvaluation) {
            handleDeleteEvaluation(selectedEvaluation);
            setShowDetailView(false);
            setSelectedEvaluation(null);
          }
        }}
      />
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
        {/* Header responsivo */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {t('practice_evaluations')}
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestiona las evaluaciones de prácticas del sistema
            </p>
          </div>
          
          {/* Botones responsivos */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm flex-grow sm:flex-grow-0"
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 flex-shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{t('refresh')}</span>
            </Button>
            
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 text-sm flex-grow sm:flex-grow-0"
              disabled={exporting || evaluations.length === 0}
              size="sm"
            >
              <Download className={`w-4 h-4 mr-2 flex-shrink-0 ${exporting ? 'animate-pulse' : ''}`} />
              <span>{t('export_csv')}</span>
            </Button>
          </div>
        </div>

        {/* Card con tabla responsive */}
        <Card className="border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg text-blue-800 dark:text-blue-200 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Lista de Evaluaciones de Prácticas</span>
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {evaluations.length} evaluaciones
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Información de paginación */}
            <div className="px-3 sm:px-6 pb-3">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Mostrando del {startIndex + 1} al {Math.min(endIndex, totalItems)} de {totalItems} evaluaciones
              </p>
            </div>

            {/* Contenedor con scroll horizontal para tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[950px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px] px-2 sm:px-4 text-xs sm:text-sm">Estudiante</TableHead>
                      <TableHead className="min-w-[150px] px-2 sm:px-4 text-xs sm:text-sm">Tutor</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Formación</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Institución</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Fecha Evaluación</TableHead>
                      <TableHead className="min-w-[100px] px-2 sm:px-4 text-xs sm:text-sm">Calificación</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Evaluación Final</TableHead>
                      <TableHead className="w-[80px] px-2 sm:px-4 text-xs sm:text-sm text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate max-w-[140px]">
                            {evaluation.studentName} {evaluation.studentLastName}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate max-w-[140px]">
                            {evaluation.tutorName} {evaluation.tutorLastName}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate max-w-[110px]">{evaluation.formation || '-'}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate max-w-[110px]">{evaluation.institution || '-'}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          {evaluation.evaluationDate ? new Date(evaluation.evaluationDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {evaluation.performanceRating}/10
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <Badge 
                            variant={evaluation.finalEvaluation === 'Apto' ? 'default' : 'destructive'} 
                            className="text-xs"
                          >
                            {evaluation.finalEvaluation}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4 flex-shrink-0" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                                <DropdownMenuItem onClick={() => handleViewEvaluation(evaluation)} className="cursor-pointer text-xs sm:text-sm">
                                  <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Ver detalles</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteEvaluation(evaluation)} className="cursor-pointer text-red-600 text-xs sm:text-sm">
                                  <Trash className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Indicador de scroll en móvil */}
            <div className="sm:hidden p-4 text-center">
              <p className="text-xs text-gray-500">
                ← Desliza horizontalmente para ver más columnas →
              </p>
            </div>

            {/* Paginación responsive */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4 border-t">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>Página {currentPage} de {totalPages}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {t('previous')}
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <Button
                        key={index}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                        disabled={page === '...'}
                        className="min-w-[32px] text-xs sm:text-sm px-2"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {t('next')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de confirmación para eliminar */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la evaluación de prácticas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                {t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PracticeEvaluationsListView;
