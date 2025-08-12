
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Upload, Download, AlertCircle, Loader2, RefreshCw, FileDown } from 'lucide-react';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getContractRequests, ContractRequestData } from '../../services/contractRequestsService';
import ContractRequestCreateForm from './ContractRequestCreateForm';
import ImportContractRequestsModal from './ImportContractRequestsModal';

interface ContractRequestsListViewProps {
  language: Language;
}

const ContractRequestsListView: React.FC<ContractRequestsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [requests, setRequests] = useState<ContractRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContractRequests();
      setRequests(data);
      console.log('Solicitudes de contrato cargadas:', data.length);
    } catch (err) {
      console.error('Error loading contract requests:', err);
      setError('Error al cargar las solicitudes de contrato');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, requests.length);
  const currentData = requests.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300';
      case 'aprobado':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300';
      case 'rechazado':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleExport = () => {
    console.log('Exportar solicitudes de contrato');
  };

  const handleRefresh = () => {
    loadRequests();
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
          loadRequests(); // Recargar datos después de crear
        }}
        onSave={loadRequests}
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
            disabled={loading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Tabla de solicitudes de contratación */}
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
          
          {loading && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Cargando solicitudes de contratación...
              </h3>
            </div>
          )}
          
          {!loading && !error && requests.length === 0 && (
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
          
          {!loading && !error && requests.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellidos</TableHead>
                      <TableHead>Puesto</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Tipo de Solicitud</TableHead>
                      <TableHead>Fecha de Solicitud</TableHead>
                      <TableHead>Fecha de Inicio Esperada</TableHead>
                      <TableHead>Salario</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.applicantName}</TableCell>
                        <TableCell>{request.applicantLastName}</TableCell>
                        <TableCell>{request.position}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.requestType}</TableCell>
                        <TableCell>
                          {request.requestDate 
                            ? formatDate(request.requestDate) 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {request.expectedStartDate 
                            ? formatDate(request.expectedStartDate) 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{request.salary}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.observations || '-'}
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
        onClose={() => {
          setShowImportModal(false);
          loadRequests(); // Recargar datos después de importar
        }}
        language={language}
      />
    </div>
  );
};

export default ContractRequestsListView;
