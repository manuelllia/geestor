
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import ContractRequestCreateForm from './ContractRequestCreateForm';
import ImportContractRequestsModal from '../ChangeSheets/ImportContractRequestsModal';
import { getContractRequests, ContractRequestRecord } from '../../services/contractRequestsService';

interface ContractRequestsListViewProps {
  language: Language;
  onViewDetails: (requestId: string) => void;
  onCreateNew: () => void;
}

const ContractRequestsListView: React.FC<ContractRequestsListViewProps> = ({ 
  language, 
  onViewDetails,
  onCreateNew
}) => {
  const { t } = useTranslation(language);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractRequests, setContractRequests] = useState<ContractRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 30;

  const loadContractRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requests = await getContractRequests();
      setContractRequests(requests);
      console.log('Solicitudes de contrato cargadas:', requests.length);
    } catch (err) {
      console.error('Error cargando solicitudes de contrato:', err);
      setError('Error al cargar las solicitudes de contrato');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContractRequests();
  }, []);

  const totalPages = Math.ceil(contractRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, contractRequests.length);
  const currentData = contractRequests.slice(startIndex, endIndex);

  const handleDuplicate = (id: string) => {
    console.log('Duplicar registro:', id);
  };

  const handleDownloadPDF = (id: string) => {
    console.log('Descargar PDF:', id);
  };

  const handleExport = () => {
    console.log('Exportar datos');
  };

  const handleRefresh = () => {
    loadContractRequests();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Aprobado': 'bg-green-100 text-green-800 border-green-300',
      'Rechazado': 'bg-red-100 text-red-800 border-red-300'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  if (showCreateForm) {
    return (
      <ContractRequestCreateForm 
        language={language} 
        onBack={() => {
          setShowCreateForm(false);
          loadContractRequests(); // Recargar datos después de crear
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Gestión de Solicitudes de Contratación
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
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('createNew')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {t('export')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('import')}
          </Button>
        </div>
      </div>

      {/* Tabla de solicitudes de contrato */}
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
          
          {!isLoading && !error && contractRequests.length === 0 && (
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
                  onClick={() => setShowCreateForm(true)}
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
          
          {!isLoading && !error && contractRequests.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidato</TableHead>
                      <TableHead>Puesto</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Fecha Incorporación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.applicantName} {request.applicantLastName}
                        </TableCell>
                        <TableCell>{request.position}</TableCell>
                        <TableCell>{request.company}</TableCell>
                        <TableCell>
                          {request.incorporationDate ? formatDate(request.incorporationDate) : 'No especificada'}
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
                              onClick={() => onViewDetails(request.id)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(request.id)}
                              title="Duplicar registro"
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {contractRequests.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {startIndex + 1} a {endIndex} de {contractRequests.length} registros
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
        onClose={() => {
          setShowImportModal(false);
          loadContractRequests(); // Recargar datos después de importar
        }}
        language={language}
      />
    </div>
  );
};

export default ContractRequestsListView;
