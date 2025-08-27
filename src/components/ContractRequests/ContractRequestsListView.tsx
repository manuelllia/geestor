
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Copy, Edit, Trash, FileText, Plus, Upload, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getContractRequests, deleteContractRequest, duplicateContractRequest, ContractRequestRecord } from '../../services/contractRequestsService';
import ContractRequestCreateForm from './ContractRequestCreateForm';
import ContractRequestDetailView from './ContractRequestDetailView';
import ContractRequestEditForm from './ContractRequestEditForm';
import ImportContractRequestsModal from './ImportContractRequestsModal';
import { toast } from 'sonner';

interface ContractRequestsListViewProps {
  language: Language;
}

const ContractRequestsListView: React.FC<ContractRequestsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [requests, setRequests] = useState<ContractRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContractRequestRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ContractRequestRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await getContractRequests();
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading contract requests:', error);
      toast.error('Error al cargar las solicitudes de contratación');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleViewRequest = (request: ContractRequestRecord) => {
    setSelectedRequest(request);
    setShowDetailView(true);
  };

  const handleEditRequest = (request: ContractRequestRecord) => {
    setSelectedRequest(request);
    setShowEditForm(true);
  };

  const handleDuplicateRequest = async (request: ContractRequestRecord) => {
    try {
      await duplicateContractRequest(request);
      await loadRequests();
      toast.success('Solicitud duplicada correctamente');
    } catch (error) {
      console.error('Error duplicating request:', error);
      toast.error('Error al duplicar la solicitud');
    }
  };

  const handleDeleteRequest = (request: ContractRequestRecord) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      await deleteContractRequest(requestToDelete.id);
      await loadRequests();
      toast.success('Solicitud eliminada correctamente');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Error al eliminar la solicitud');
    } finally {
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  const handleRequestCreated = () => {
    setShowCreateForm(false);
    loadRequests();
  };

  const handleRequestUpdated = () => {
    setShowEditForm(false);
    setSelectedRequest(null);
    loadRequests();
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    loadRequests();
  };

  // Cálculos de paginación
  const totalItems = requests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = requests.slice(startIndex, endIndex);

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

  if (showCreateForm) {
    return (
      <ContractRequestCreateForm
        language={language}
        onBack={() => setShowCreateForm(false)}
        onSave={handleRequestCreated}
      />
    );
  }

  if (showDetailView && selectedRequest) {
    return (
      <ContractRequestDetailView
        requestId={selectedRequest.id}
        language={language}
        onBack={() => {
          setShowDetailView(false);
          setSelectedRequest(null);
        }}
      />
    );
  }

  if (showEditForm && selectedRequest) {
    return (
      <ContractRequestEditForm
        requestId={selectedRequest.id}
        language={language}
        onBack={() => {
          setShowEditForm(false);
          setSelectedRequest(null);
        }}
        onSave={handleRequestUpdated}
      />
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header responsive mejorado */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {t('contractRequests')}
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestiona las solicitudes de contratación
            </p>
          </div>
          
          {/* Botones con iconos siempre visibles */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm"
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 flex-shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>
            
            <Button
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 text-sm"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Importar</span>
            </Button>
            
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Nueva Solicitud</span>
            </Button>
          </div>
        </div>

        {/* Card con tabla responsive */}
        <Card className="border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg text-blue-800 dark:text-blue-200 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Lista de Solicitudes</span>
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {requests.length} solicitudes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Información de paginación */}
            <div className="px-3 sm:px-6 pb-3">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Mostrando del {startIndex + 1} al {Math.min(endIndex, totalItems)} de {totalItems} solicitudes
              </p>
            </div>

            {/* Contenedor con scroll horizontal mejorado */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px] px-2 sm:px-4 text-xs sm:text-sm">Empleado</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Centro de Trabajo</TableHead>
                      <TableHead className="min-w-[100px] px-2 sm:px-4 text-xs sm:text-sm">Ciudad</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Puesto</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Departamento</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Fecha Inicio</TableHead>
                      <TableHead className="min-w-[100px] px-2 sm:px-4 text-xs sm:text-sm">Estado</TableHead>
                      <TableHead className="w-[80px] px-2 sm:px-4 text-xs sm:text-sm text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">
                            {request.requesterName} {request.requesterLastName}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">{request.workCenter}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">{request.city}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">{request.jobPosition}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">{request.professionalCategory}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          {new Date(request.incorporationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <Badge variant="secondary" className="text-xs">
                            Activa
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
                                <DropdownMenuItem onClick={() => handleViewRequest(request)} className="cursor-pointer text-xs sm:text-sm">
                                  <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Ver detalles</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditRequest(request)} className="cursor-pointer text-xs sm:text-sm">
                                  <Edit className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicateRequest(request)} className="cursor-pointer text-xs sm:text-sm">
                                  <Copy className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Duplicar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteRequest(request)} className="cursor-pointer text-red-600 text-xs sm:text-sm">
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
                    Anterior
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
                    Siguiente
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
                Esta acción no se puede deshacer. Se eliminará permanentemente la solicitud de contratación.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de importación */}
        {showImportModal && (
          <ImportContractRequestsModal
            open={showImportModal}
            onClose={() => setShowImportModal(false)}
            language={language}
            onImportSuccess={handleImportSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ContractRequestsListView;
