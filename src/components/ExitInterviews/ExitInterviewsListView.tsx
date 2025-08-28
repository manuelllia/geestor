import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, 
  Share, Link, Edit, Trash2, ArrowUp, ArrowDown
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language, Translations } from '../../utils/translations';
import { 
  getExitInterviews, 
  ExitInterviewRecord,
  generateExitInterviewToken,
  duplicateExitInterview,
  deleteExitInterview,
  exportExitInterviewsToCSV
} from '../../services/exitInterviewService';
import { useToast } from '@/hooks/use-toast';
import ExitInterviewDetailView from './ExitInterviewDetailView';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ExitInterviewsListViewProps {
  language: Language;
}

const ExitInterviewsListView: React.FC<ExitInterviewsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [exitInterviews, setExitInterviews] = useState<ExitInterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const itemsPerPage = 30;

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadExitInterviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const interviews = await getExitInterviews();
      setExitInterviews(interviews);
      console.log(`${t('exitInterviewsLoaded')}: ${interviews.length}`);
    } catch (err) {
      console.error('Error cargando entrevistas de salida:', err);
      setError(t('errorLoadingExitInterviews'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExitInterviews();
  }, [t]);

  // Helper function to safely translate exit types
  const translateExitType = (exitType: string): string => {
    // Map exit types to known translation keys
    switch (exitType.toLowerCase()) {
      case 'voluntaria':
      case 'voluntary':
        return t('voluntary');
      case 'excedencia':
      case 'leave of absence':
        return t('leaveOfAbsence');
      default:
        return exitType; // Return original if no translation found
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedExitInterviews = useMemo(() => {
    if (!sortColumn) {
      return exitInterviews;
    }

    const sortedData = [...exitInterviews].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'employeeName':
          aValue = `${a.employeeName} ${a.employeeLastName}`;
          bValue = `${b.employeeName} ${b.employeeLastName}`;
          break;
        case 'position':
        case 'workCenter':
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
        case 'exitType':
          aValue = translateExitType(a.exitType);
          bValue = translateExitType(b.exitType);
          break;
        case 'exitDate':
          aValue = a.exitDate instanceof Date ? a.exitDate.getTime() : new Date(a.exitDate).getTime();
          bValue = b.exitDate instanceof Date ? b.exitDate.getTime() : new Date(b.exitDate).getTime();
          break;
        default:
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
      }

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
  }, [exitInterviews, sortColumn, sortDirection, language, t]);

  const totalPages = Math.ceil(sortedExitInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedExitInterviews.length);
  const currentData = sortedExitInterviews.slice(startIndex, endIndex);

  const handleViewDetails = (id: string) => {
    setSelectedInterviewId(id);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInterviewId(null);
    loadExitInterviews();
  };

  const handleGenerateLink = () => {
    const token = generateExitInterviewToken();
    const link = `${window.location.origin}/entrevista-salida/${token}`;
    
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: t('linkCopiedTitle'),
        description: t('linkCopiedDescription'),
      });
    }).catch(() => {
      toast({
        title: t('errorCopyingLinkTitle'),
        description: `${t('errorCopyingLinkDescription')} ${link}`,
        variant: 'destructive',
      });
    });
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateExitInterview(id);
      toast({
        title: t('interviewDuplicatedTitle'),
        description: t('interviewDuplicatedDescription'),
      });
      loadExitInterviews();
    } catch (error) {
      toast({
        title: t('errorDuplicatingTitle'),
        description: t('errorDuplicatingDescription'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDeleteInterview'))) {
      try {
        await deleteExitInterview(id);
        toast({
          title: t('interviewDeletedTitle'),
          description: t('interviewDeletedDescription'),
        });
        loadExitInterviews();
      } catch (error) {
        toast({
          title: t('errorDeletingTitle'),
          description: t('errorDeletingDescription'),
          variant: 'destructive',
        });
      }
    }
  };

  const handleDownloadPDF = (id: string) => {
    console.log(`Simulando descarga de PDF para entrevista con ID: ${id}`);
    toast({
      title: t('functionNotImplementedTitle'),
      description: t('downloadPdfNotAvailable'),
      variant: "default",
    });
  };

  const handleExport = () => {
    if (exitInterviews.length === 0) {
      toast({
        title: t('noDataTitle'),
        description: t('noDataToExportDescription'),
        variant: 'destructive',
      });
      return;
    }

    const csvContent = exportExitInterviewsToCSV(exitInterviews);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `exit_interviews_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('exportCompletedTitle'),
        description: t('exportCompletedDescription'),
      });
    }
  };

  const handleImport = () => {
    toast({
      title: t('functionNotImplementedTitle'),
      description: t('importNotAvailable'),
      variant: "default",
    });
  };

  const handleRefresh = () => {
    loadExitInterviews();
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const getExitTypeBadgeClass = (exitType: string) => {
    const typeConfig = {
      'Voluntaria': 'bg-blue-100 text-blue-800 border-blue-300',
      'Excedencia': 'bg-orange-100 text-orange-800 border-orange-300',
      'Voluntary': 'bg-blue-100 text-blue-800 border-blue-300',
      'Leave of Absence': 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return typeConfig[exitType as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (date: Date) => {
    const locale = language === 'es' ? es : enUS;
    return format(date, 'P', { locale });
  };

  if (viewMode === 'detail' && selectedInterviewId) {
    return (
      <ExitInterviewDetailView
        language={language}
        interviewId={selectedInterviewId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-full p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header responsive */}
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100 leading-tight">
              {t('entrevistaTit')}
            </h1>
          </div>
          
          {/* Botones responsive */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('recargar')}</span>
            </Button>
            
            <Button
              onClick={handleGenerateLink}
              className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <Share className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t('generarEnla1')}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <FileDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t('exportarEntre')}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleImport}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t('importarEntre')}</span>
            </Button>
          </div>
        </div>

        {/* Card responsive */}
        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-lg text-blue-800 dark:text-blue-200">
              {t('entrevistaTit')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="text-center py-6 sm:py-8 px-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                  {t('errorLoadingData')}
                </h3>
                <p className="text-sm sm:text-base text-red-600 dark:text-red-400 mb-4">
                  {error}
                </p>
                <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
                  {t('tryAgain')}
                </Button>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('loadingExitInterviews')}
                </h3>
              </div>
            )}
            
            {!isLoading && !error && exitInterviews.length === 0 && (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('noExitInterviewsFound')}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                  {t('generateLinkToStart')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    onClick={handleGenerateLink}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    {t('generarEnla1')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImport}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('importData')}
                  </Button>
                </div>
              </div>
            )}
            
            {!isLoading && !error && exitInterviews.length > 0 && (
              <>
                {/* Contenedor con scroll horizontal para tablas */}
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer select-none text-xs sm:text-sm"
                          onClick={() => handleSort('employeeName')}
                        >
                          <div className="flex items-center">
                            <span className="truncate">{t('employeeName')}</span>
                            {sortColumn === 'employeeName' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none text-xs sm:text-sm"
                          onClick={() => handleSort('position')}
                        >
                          <div className="flex items-center">
                            <span className="truncate">{t('positionShort')}</span>
                            {sortColumn === 'position' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none text-xs sm:text-sm"
                          onClick={() => handleSort('workCenter')}
                        >
                          <div className="flex items-center">
                            <span className="truncate">{t('workCenterShort')}</span>
                            {sortColumn === 'workCenter' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none text-xs sm:text-sm"
                          onClick={() => handleSort('exitType')}
                        >
                          <div className="flex items-center">
                            <span className="truncate">{t('exitType')}</span>
                            {sortColumn === 'exitType' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none text-xs sm:text-sm"
                          onClick={() => handleSort('exitDate')}
                        >
                          <div className="flex items-center">
                            <span className="truncate">{t('exitDate')}</span>
                            {sortColumn === 'exitDate' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-center text-xs sm:text-sm">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((interview) => (
                        <TableRow key={interview.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="truncate max-w-[120px]">
                              {interview.employeeName} {interview.employeeLastName}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="truncate max-w-[100px]">
                              {interview.position}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="truncate max-w-[100px]">
                              {interview.workCenter}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getExitTypeBadgeClass(interview.exitType)} text-xs`}>
                              {translateExitType(interview.exitType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="truncate">
                              {interview.exitDate instanceof Date 
                                ? formatDate(interview.exitDate) 
                                : t('invalidDate')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(interview.id)}
                                title={t('viewDetails')}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicate(interview.id)}
                                title={t('duplicate')}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              >
                                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPDF(interview.id)}
                                title={t('downloadPDF')}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(interview.id)}
                                title={t('delete')}
                                className="text-red-600 hover:text-red-800 h-6 w-6 sm:h-8 sm:w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación responsive */}
                {exitInterviews.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 p-3 sm:p-4 border-t">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                      {t('showingRecords', { 
                        start: startIndex + 1, 
                        end: endIndex, 
                        total: sortedExitInterviews.length 
                      })}
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="text-xs h-7 px-2"
                      >
                        {t('previous')}
                      </Button>
                      
                      <div className="flex space-x-1 max-w-[200px] overflow-x-auto">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              className={cn(
                                  currentPage === pageNumber ? "bg-blue-600 text-white" : "",
                                  "text-xs h-7 min-w-[28px] px-1"
                              )}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="text-xs h-7 px-2"
                      >
                        {t('next')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExitInterviewsListView;
