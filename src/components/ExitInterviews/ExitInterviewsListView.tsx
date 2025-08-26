import React, { useState, useEffect, useMemo } from 'react'; // Importar useMemo
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, 
  Share, Link, Edit, Trash2, ArrowUp, ArrowDown // Importar ArrowUp y ArrowDown
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { 
  getExitInterviews, 
  ExitInterviewRecord, // Asegúrate de que esta interfaz esté correctamente definida y exportada
  generateExitInterviewToken,
  duplicateExitInterview,
  deleteExitInterview,
  exportExitInterviewsToCSV
} from '../../services/exitInterviewService';
import { useToast } from '@/hooks/use-toast'; // Revisa si tu toast es de 'sonner' o '@/components/ui/use-toast'
import ExitInterviewDetailView from './ExitInterviewDetailView';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils'; // Asegúrate de que tienes esta utilidad

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

  // NUEVOS ESTADOS DE ORDENACIÓN
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Por defecto ascendente

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
    setCurrentPage(1); // Siempre volver a la primera página al ordenar
  };

  // DATOS ORDENADOS Y MEMORIZADOS
  const sortedExitInterviews = useMemo(() => {
    if (!sortColumn) {
      return exitInterviews; // Si no hay columna de ordenación, devuelve los datos sin ordenar
    }

    const sortedData = [...exitInterviews].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Determinar los valores a comparar según la columna
      switch (sortColumn) {
        case 'employeeName': // Ordenar por nombre completo del empleado
          aValue = `${a.employeeName} ${a.employeeLastName}`;
          bValue = `${b.employeeName} ${b.employeeLastName}`;
          break;
        case 'position':
        case 'workCenter':
        case 'exitType':
          aValue = (a as any)[sortColumn];
          bValue = (b as any)[sortColumn];
          break;
        case 'exitDate':
          // Asegúrate de que exitDate sea un objeto Date para comparar
          aValue = a.exitDate instanceof Date ? a.exitDate.getTime() : new Date(a.exitDate).getTime();
          bValue = b.exitDate instanceof Date ? b.exitDate.getTime() : new Date(b.exitDate).getTime();
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
        comparison = aValue - bValue; // Comparación de números (para fechas convertidas a timestamp, por ejemplo)
      } else {
        // En caso de tipos mixtos o no manejados, intenta una conversión a string como fallback
        comparison = String(aValue).localeCompare(String(bValue), language === 'es' ? 'es-ES' : 'en-US');
      }

      return sortDirection === 'asc' ? comparison : -comparison; // Aplica la dirección
    });
    return sortedData;
  }, [exitInterviews, sortColumn, sortDirection, language]); // Dependencias para useMemo

  const totalPages = Math.ceil(sortedExitInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedExitInterviews.length);
  // La paginación se aplica AHORA a los datos ordenados
  const currentData = sortedExitInterviews.slice(startIndex, endIndex); 

  const handleViewDetails = (id: string) => {
    setSelectedInterviewId(id);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInterviewId(null);
    loadExitInterviews(); // Recargar en caso de cambios en el detalle
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
        title: 'Error al copiar enlace',
        description: 'El enlace no pudo copiarse. Por favor, cópielo manualmente: ' + link,
        variant: 'destructive',
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
    // Si tu ExitInterviewDetailView tiene la lógica de PDF, podrías pasar el ID y activar la descarga allí.
    // O bien, puedes mover la lógica de generación de PDF directamente aquí, similar a ChangeSheetsListView.
    // Por ahora, solo simularé el comportamiento de ver detalles o un log.
    console.log(`Simulando descarga de PDF para entrevista con ID: ${id}`);
    toast({
      title: "Función no implementada",
      description: "La descarga de PDF para esta entrevista aún no está disponible.",
      variant: "default",
    });
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
    toast({
      title: "Función no implementada",
      description: "La importación de datos aún no está disponible.",
      variant: "default",
    });
  };

  const handleRefresh = () => {
    loadExitInterviews();
    setSortColumn(null); // Resetear ordenación al actualizar
    setSortDirection('asc');
    setCurrentPage(1);
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
                      {/* Cabeceras ordenables */}
                      <TableHead 
                        className="cursor-pointer select-none"
                        onClick={() => handleSort('employeeName')}
                      >
                        <div className="flex items-center">
                          Nombre Empleado
                          {sortColumn === 'employeeName' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none"
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center">
                          Puesto
                          {sortColumn === 'position' && (
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
                          Centro
                          {sortColumn === 'workCenter' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none"
                        onClick={() => handleSort('exitType')}
                      >
                        <div className="flex items-center">
                          Tipo de Baja
                          {sortColumn === 'exitType' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none"
                        onClick={() => handleSort('exitDate')}
                      >
                        <div className="flex items-center">
                          Fecha de Baja
                          {sortColumn === 'exitDate' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Utiliza los datos ordenados: sortedExitInterviews */}
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
                          {/* Asegúrate de que interview.exitDate sea un objeto Date para format */}
                          {interview.exitDate instanceof Date 
                            ? formatDate(interview.exitDate) 
                            : 'Fecha no válida'}
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
                    Mostrando {startIndex + 1} a {endIndex} de {sortedExitInterviews.length} registros
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
                            className={cn(
                                currentPage === pageNumber ? "bg-blue-600 text-white" : "",
                                "dark:bg-gray-700 dark:hover:bg-gray-600" // Añadir estilos de modo oscuro si usas shadcn
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