
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, 
  Share, Link, Edit, Trash2 
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
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

  const loadExitInterviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const interviews = await getExitInterviews();
      setExitInterviews(interviews);
      console.log('Entrevistas de salida cargadas:', interviews.length);
    } catch (err) {
      console.error('Error cargando entrevistas de salida:', err);
      setError('Error al cargar las entrevistas de salida');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExitInterviews();
  }, []);

  const totalPages = Math.ceil(exitInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, exitInterviews.length);
  const currentData = exitInterviews.slice(startIndex, endIndex);

  const handleViewDetails = (id: string) => {
    setSelectedInterviewId(id);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInterviewId(null);
  };

  const handleGenerateLink = () => {
    const token = generateExitInterviewToken();
    const link = `${window.location.origin}/entrevista-salida/${token}`;
    
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: 'Enlace copiado',
        description: 'El enlace de la entrevista de salida ha sido copiado al portapapeles.',
      });
    }).catch(() => {
      toast({
        title: 'Enlace generado',
        description: link,
        variant: 'default',
      });
    });
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateExitInterview(id);
      toast({
        title: 'Entrevista duplicada',
        description: 'La entrevista de salida ha sido duplicada exitosamente.',
      });
      loadExitInterviews();
    } catch (error) {
      toast({
        title: 'Error al duplicar',
        description: 'No se pudo duplicar la entrevista de salida.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta entrevista de salida?')) {
      try {
        await deleteExitInterview(id);
        toast({
          title: 'Entrevista eliminada',
          description: 'La entrevista de salida ha sido eliminada exitosamente.',
        });
        loadExitInterviews();
      } catch (error) {
        toast({
          title: 'Error al eliminar',
          description: 'No se pudo eliminar la entrevista de salida.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDownloadPDF = (id: string) => {
    handleViewDetails(id);
  };

  const handleExport = () => {
    if (exitInterviews.length === 0) {
      toast({
        title: 'Sin datos',
        description: 'No hay entrevistas de salida para exportar.',
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
      link.setAttribute('download', `entrevistas_salida_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Exportación completada',
        description: 'Las entrevistas de salida han sido exportadas exitosamente.',
      });
    }
  };

  const handleImport = () => {
    console.log('Importar datos');
  };

  const handleRefresh = () => {
    loadExitInterviews();
  };

  const getExitTypeBadge = (exitType: string) => {
    const typeConfig = {
      'Voluntaria': 'bg-blue-100 text-blue-800 border-blue-300',
      'Excedencia': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return typeConfig[exitType as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
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
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Entrevistas de Salida
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Button
            onClick={handleGenerateLink}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Share className="w-4 h-4 mr-2" />
            Generar Enlace
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button
            variant="outline"
            onClick={handleImport}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {/* Tabla de entrevistas de salida */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Entrevistas de Salida
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                Error al cargar datos
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
              <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 text-white">
                Intentar de nuevo
              </Button>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Cargando entrevistas de salida...
              </h3>
            </div>
          )}
          
          {!isLoading && !error && exitInterviews.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay entrevistas de salida
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Genera un enlace para comenzar a recibir entrevistas de salida.
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={handleGenerateLink}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Generar Enlace
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImport}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Datos
                </Button>
              </div>
            </div>
          )}
          
          {!isLoading && !error && exitInterviews.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre Empleado</TableHead>
                      <TableHead>Puesto</TableHead>
                      <TableHead>Centro</TableHead>
                      <TableHead>Tipo de Baja</TableHead>
                      <TableHead>Fecha de Baja</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          {interview.employeeName} {interview.employeeLastName}
                        </TableCell>
                        <TableCell>{interview.position}</TableCell>
                        <TableCell>{interview.workCenter}</TableCell>
                        <TableCell>
                          <Badge className={getExitTypeBadge(interview.exitType)}>
                            {interview.exitType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(interview.exitDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(interview.id)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(interview.id)}
                              title="Duplicar"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(interview.id)}
                              title="Descargar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(interview.id)}
                              title="Eliminar"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {exitInterviews.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {startIndex + 1} a {endIndex} de {exitInterviews.length} registros
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    <div className="flex space-x-1">
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
                            className={currentPage === pageNumber ? "bg-blue-600 text-white" : ""}
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
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitInterviewsListView;
