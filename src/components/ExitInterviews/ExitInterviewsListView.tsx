
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { ResponsiveTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/responsive-table';
import ExitInterviewDetailView from './ExitInterviewDetailView';
import { getExitInterviews, ExitInterviewRecord, exportExitInterviewsToCSV } from '../../services/exitInterviewService';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useResponsive } from '../../hooks/useResponsive';

interface ExitInterviewsListViewProps {
  language: Language;
}

const ExitInterviewsListView: React.FC<ExitInterviewsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { permissions } = useUserPermissions();
  const { isMobile, isTablet } = useResponsive();
  
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<ExitInterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const canView = permissions?.Per_View ?? true;

  const loadInterviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const interviewsData = await getExitInterviews();
      setInterviews(interviewsData);
    } catch (err) {
      console.error('Error cargando entrevistas:', err);
      setError('Error al cargar las entrevistas de salida');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const totalPages = Math.ceil(interviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, interviews.length);
  const currentData = interviews.slice(startIndex, endIndex);

  const handleViewDetails = (id: string) => {
    setSelectedInterviewId(id);
    setShowDetailView(true);
  };

  const handleExport = async () => {
    try {
      await exportExitInterviewsToCSV();
      console.log('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  const getExitTypeBadge = (exitType: string) => {
    const typeConfig = {
      'Voluntaria': 'bg-blue-100 text-blue-800 border-blue-300',
      'Involuntaria': 'bg-red-100 text-red-800 border-red-300',
      'Jubilación': 'bg-green-100 text-green-800 border-green-300',
      'Fin de contrato': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return typeConfig[exitType as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (showDetailView && selectedInterviewId) {
    return (
      <ExitInterviewDetailView
        language={language}
        interviewId={selectedInterviewId}
        onBack={() => {
          setShowDetailView(false);
          setSelectedInterviewId(null);
          loadInterviews();
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
            Entrevistas de Salida
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={loadInterviews}
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
              Lista de Entrevistas
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
                <Button onClick={loadInterviews} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                  Cargando entrevistas...
                </h3>
              </div>
            )}
            
            {!isLoading && !error && interviews.length === 0 && (
              <div className="text-center py-12 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="responsive-text font-medium text-foreground mb-2">
                  No hay entrevistas de salida
                </h3>
                <p className="responsive-text text-muted-foreground mb-4">
                  Las entrevistas aparecerán aquí cuando los empleados completen el formulario de salida.
                </p>
              </div>
            )}
            
            {!isLoading && !error && interviews.length > 0 && (
              <div className="w-full">
                <ResponsiveTable minWidth="900px">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[140px]">
                          <span className="responsive-text font-medium">Empleado</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">{t('position')}</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">Centro de Trabajo</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">Tipo de Baja</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">Fecha de Baja</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">Antigüedad</span>
                        </TableHead>
                        <TableHead className="text-center min-w-[100px]">
                          <span className="responsive-text font-medium">{t('actions')}</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((interview) => (
                        <TableRow key={interview.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="responsive-text truncate max-w-[120px]">
                              {interview.employeeName} {interview.employeeLastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {interview.position}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {interview.workCenter}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getExitTypeBadge(interview.exitType)} text-xs`}>
                              {interview.exitType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text">
                              {interview.exitDate ? formatDate(interview.exitDate) : 'No especificada'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text">
                              {interview.seniority}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {canView && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(interview.id)}
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
                {interviews.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center responsive-padding responsive-gap">
                    <div className="responsive-text text-muted-foreground">
                      Mostrando {startIndex + 1} a {endIndex} de {interviews.length} registros
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

export default ExitInterviewsListView;
