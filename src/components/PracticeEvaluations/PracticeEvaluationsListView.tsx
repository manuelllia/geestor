
import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileUp, Download, RefreshCw, Plus, Calendar, ArrowUp, ArrowDown, Eye, Trash2 } from 'lucide-react'; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getPracticeEvaluations, deletePracticeEvaluation, generatePracticeEvaluationToken, PracticeEvaluationRecord } from '../../services/practiceEvaluationService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Language, Translations } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import PracticeEvaluationDetailView from './PracticeEvaluationDetailView';

interface PracticeEvaluationsListViewProps {
  language?: Language;
}

export default function PracticeEvaluationsListView({ language = 'es' }: PracticeEvaluationsListViewProps) {
  const { t } = useTranslation(language);
  const queryClient = useQueryClient();
  const { data: evaluations = [], isLoading, refetch } = useQuery<PracticeEvaluationRecord[]>({
    queryKey: ['practice-evaluations'],
    queryFn: getPracticeEvaluations,
  });

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEvaluation, setSelectedEvaluation] = useState<PracticeEvaluationRecord | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // LÓGICA DE ORDENACIÓN
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // DATOS ORDENADOS Y MEMORIZADOS
  const sortedEvaluations = useMemo(() => {
    if (!sortColumn) {
      return evaluations;
    }

    const sortedData = [...evaluations].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Determinar los valores a comparar según la columna
      switch (sortColumn) {
        case 'studentName':
          aValue = `${a.studentName} ${a.studentLastName}`;
          bValue = `${b.studentName} ${b.studentLastName}`;
          break;
        case 'tutorName':
          aValue = `${a.tutorName} ${a.tutorLastName}`;
          bValue = `${b.tutorName} ${b.tutorLastName}`;
          break;
        case 'workCenter':
        case 'formation':
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
        case 'finalEvaluation':
            // Traducir los valores 'Apto'/'No Apto' para una correcta ordenación si se desea
            aValue = t(a.finalEvaluation as keyof Translations);
            bValue = t(b.finalEvaluation as keyof Translations);
            break;
        case 'evaluationDate':
          aValue = a.evaluationDate instanceof Date ? a.evaluationDate.getTime() : new Date(a.evaluationDate).getTime();
          bValue = b.evaluationDate instanceof Date ? b.evaluationDate.getTime() : new Date(b.evaluationDate).getTime();
          break;
        case 'performanceRating':
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
        default:
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
      }

      // Manejo de valores nulos o indefinidos
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, language === 'es' ? 'es-ES' : 'en-US');
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue), language === 'es' ? 'es-ES' : 'en-US');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sortedData;
  }, [evaluations, sortColumn, sortDirection, language, t]);

  const handleGenerateLink = () => {
    const token = generatePracticeEvaluationToken();
    const link = `${window.location.origin}/valoracion-practicas/${token}`; 
    
    navigator.clipboard.writeText(link);
    toast.success(t('linkCopiedToClipboardToastTitle'), {
      description: t('linkCopiedToClipboardToastDescription'),
    });
  };

  const handleViewEvaluation = (evaluation: PracticeEvaluationRecord) => {
    setSelectedEvaluation(evaluation);
    setIsDetailViewOpen(true);
  };

  const handleDeleteEvaluation = async (id: string) => {
    try {
      await deletePracticeEvaluation(id);
      toast.success(t('evaluationDeletedToastTitle'), {
        description: t('evaluationDeletedToastDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['practice-evaluations'] });
    } catch (error) {
      toast.error(t('errorDeletingEvaluationToastTitle'), {
        description: t('errorDeletingEvaluationToastDescription'),
      });
    }
  };

  const handleExport = () => {
    toast.info(t('exportFunctionComingSoonTitle'), {
      description: t('exportFunctionComingSoonDescription'),
    });
  };

  const handleImport = () => {
    toast.info(t('importFunctionComingSoonTitle'), {
      description: t('importFunctionComingSoonDescription'),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  // Helper para traducir 'Apto'/'No Apto'
  const getFinalEvaluationText = (value: string) => {
    return t(value as keyof Translations);
  };

  // Helper to check if evaluation is apt
  const isAptEvaluation = (finalEvaluation: string) => {
    return finalEvaluation === 'Apto' || finalEvaluation === 'Apt';
  };

  const formatDate = (date: Date) => {
    const locale = language === 'es' ? es : enUS;
    return format(date, 'dd/MM/yyyy', { locale });
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-300">{t('valoPracTit')}</CardTitle>
          <CardDescription>
            {t('valoPracSub')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button onClick={handleGenerateLink} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              {t('generarEnlaceVal')}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <FileUp className="w-4 h-4 mr-2" />
              {t('import')}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('recargar')}
            </Button>
          </div>

          {evaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('noEvaluationsRegistered')}</p>
              <p className="text-sm">{t('generateLinkToStartReceivingEvaluations')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleSort('studentName')}
                    >
                      <div className="flex items-center">
                        {t('student')}
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
                        {t('tutor')}
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
                        {t('workCenter')}
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
                        {t('formation')}
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
                        {t('finalEvaluation')}
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
                        {t('evaluationDate')}
                        {sortColumn === 'evaluationDate' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none text-center"
                      onClick={() => handleSort('performanceRating')}
                    >
                      <div className="flex items-center justify-center">
                        {t('performanceRating')}
                        {sortColumn === 'performanceRating' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[120px]">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                        <Badge variant={isAptEvaluation(evaluation.finalEvaluation) ? 'default' : 'destructive'}>
                          {getFinalEvaluationText(evaluation.finalEvaluation)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {evaluation.evaluationDate instanceof Date 
                           ? formatDate(evaluation.evaluationDate)
                           : t('invalidDate')}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-300">
                            {t('performanceRatingScore', { rating: evaluation.performanceRating })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEvaluation(evaluation)}
                            title={t('viewDetails')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title={t('delete')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('deleteEvaluationConfirmationTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('deleteEvaluationConfirmationDescription', { 
                                    studentName: evaluation.studentName, 
                                    studentLastName: evaluation.studentLastName 
                                  })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEvaluation(evaluation.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {t('delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Modal de detalle */}
      {isDetailViewOpen && selectedEvaluation && (
        <PracticeEvaluationDetailView
          evaluation={selectedEvaluation}
          onClose={() => {
            setIsDetailViewOpen(false);
            setSelectedEvaluation(null);
          }}
        />
      )}
    </div>
  );
}
