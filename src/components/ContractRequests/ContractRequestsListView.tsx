

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { 
  getContractRequests, 
  ContractRequestRecord,
  deleteContractRequest,
  updateContractRequest,
  saveContractRequest
} from '../../services/contractRequestsService';
import { useToast } from '@/hooks/use-toast';
import ImportContractRequestsModal from './ImportContractRequestsModal';
import ContractRequestCreateForm from './ContractRequestCreateForm';

interface ContractRequestsListViewProps {
  language: Language;
}

const ContractRequestsListView: React.FC<ContractRequestsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<ContractRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
  const itemsPerPage = 30;

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requestsData = await getContractRequests();
      setRequests(requestsData);
      console.log('Solicitudes de contratación cargadas:', requestsData.length);
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      setError('Error al cargar las solicitudes de contratación');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, requests.length);
  const currentData = requests.slice(startIndex, endIndex);

  const handleViewDetails = (requestId: string) => {
    setSelectedRequestId(requestId);
    setViewMode('detail');
  };

  const handleCreateNew = () => {
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedRequestId(null);
  };

  const handleSave = () => {
    loadRequests();
    handleBackToList();
  };

  const handleDuplicate = async (id: string) => {
    try {
      const originalRequest = requests.find(r => r.id === id);
      if (!originalRequest) return;

      const { id: _, createdAt, updatedAt, status, requestDate, ...requestData } = originalRequest;
      const duplicatedData = {
        ...requestData,
        requesterName: `${requestData.requesterName} (Copia)`,
        incorporationDate: requestData.incorporationDate?.toISOString().split('T')[0] || '',
      };
      
      await saveContractRequest(duplicatedData);
      toast({
        title: 'Solicitud duplicada',
        description: 'La solicitud de contratación ha sido duplicada exitosamente.',
      });
      loadRequests();
    } catch (error) {
      toast({
        title: 'Error al duplicar',
        description: 'No se pudo duplicar la solicitud de contratación.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud de contratación?')) {
      try {
        await deleteContractRequest(id);
        toast({
          title: 'Solicitud eliminada',
          description: 'La solicitud de contratación ha sido eliminada exitosamente.',
        });
        loadRequests();
      } catch (error) {
        toast({
          title: 'Error al eliminar',
          description: 'No se pudo eliminar la solicitud de contratación.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDownloadPDF = (id: string) => {
    handleViewDetails(id);
  };

  const handleExport = () => {
    if (requests.length === 0) {
      toast({
        title: 'Sin datos',
        description: 'No hay solicitudes de contratación para exportar.',
        variant: 'destructive',
      });
      return;
    }

    const headers = [
      'ID',
      'Nombre Solicitante',
      'Apellidos Solicitante',
      'Puesto',
      'Empresa',
      'Tipo de Contrato',
      'Fecha de Solicitud',
      'Fecha Incorporación',
      'Salario',
      'Estado',
      'Observaciones',
      'Fecha de Creación'
    ];

    const csvContent = [
      headers.join(','),
      ...requests.map(request => [
        request.id || '',
        `"${request.requesterName}"`,
        `"${request.requesterLastName}"`,
        `"${request.jobPosition}"`,
        `"${request.company}"`,
        `"${request.contractType}"`,
        request.requestDate.toLocaleDateString('es-ES'),
        request.incorporationDate ? request.incorporationDate.toLocaleDateString('es-ES') : '',
        `"${request.salary}"`,
        `"${request.status}"`,
        `"${request.observations}"`,
        request.createdAt ? request.createdAt.toLocaleDateString('es-ES') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `solicitudes_contratacion_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Exportación completada',
        description: 'Las solicitudes de contratación han sido exportadas exitosamente.',
      });
    }
  };

  const handleRefresh = () => {
    loadRequests();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Aprobado': 'bg-green-100 text-green-800 border-green-300',
      'Rechazado': 'bg-red-100 text-red-800 border-red-300',
      'En Proceso': 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  if (viewMode === 'create') {
    return (
      <ContractRequestCreateForm
        language={language}
        onBack={handleBackToList}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Solicitudes de Contratación
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
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Nueva
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
            onClick={() => setShowImportModal(true)}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Solicitudes de Contratación
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
                Cargando solicitudes de contratación...
              </h3>
            </div>
          )}

          {!isLoading && !error && requests.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay solicitudes de contratación
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza creando una nueva solicitud o importa datos desde un archivo.
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nueva
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Datos
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && requests.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Puesto</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha Solicitud</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.requesterName} {request.requesterLastName}
                        </TableCell>
                        <TableCell>{request.jobPosition}</TableCell>
                        <TableCell>{request.company}</TableCell>
                        <TableCell>{request.contractType}</TableCell>
                        <TableCell>
                          {formatDate(request.requestDate)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(request.id)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(request.id)}
                              title="Duplicar"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(request.id)}
                              title="Descargar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(request.id)}
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
              {requests.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {startIndex + 1} a {endIndex} de {requests.length} registros
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

      {/* Modal de importación */}
      <ImportContractRequestsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        language={language}
      />
    </div>
  );
};

export default ContractRequestsListView;

