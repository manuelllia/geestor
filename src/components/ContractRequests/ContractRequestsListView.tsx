
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Plus, FileDown, FileUp, RefreshCw, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getContractRequests, ContractRequest } from '../../services/contractRequestsService';
import ContractRequestCreateForm from './ContractRequestCreateForm';
import ContractRequestDetailView from './ContractRequestDetailView';
import ImportContractRequestsModal from './ImportContractRequestsModal';
import { toast } from 'sonner';

interface ContractRequestsListViewProps {
  language: Language;
}

const ContractRequestsListView: React.FC<ContractRequestsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [contractRequests, setContractRequests] = useState<ContractRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ContractRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ContractRequest | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadContractRequests();
  }, []);

  useEffect(() => {
    const filtered = contractRequests.filter(request =>
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterLastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [contractRequests, searchTerm]);

  const loadContractRequests = async () => {
    try {
      setLoading(true);
      const requests = await getContractRequests();
      setContractRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Error loading contract requests:', error);
      toast.error('Error al cargar las solicitudes de contratación');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: ContractRequest) => {
    setSelectedRequest(request);
    setShowDetailView(true);
  };

  const handleExport = () => {
    // Implementation for export functionality
    console.log('Export functionality');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-hidden p-3 sm:p-4 lg:p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">
                Solicitudes de Contratación
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gestiona las solicitudes de contratación
              </p>
            </div>
            
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="flex items-center justify-center h-32 sm:h-40">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <ContractRequestCreateForm
        language={language}
        onBack={() => setShowCreateForm(false)}
        onSave={loadContractRequests}
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
        onEdit={() => {
          // Navigate to edit view
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">
                Solicitudes de Contratación
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gestiona las solicitudes de contratación
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Crear Nuevo</span>
              </Button>
              
              <Button
                onClick={loadContractRequests}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                size="sm"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Actualizar</span>
              </Button>
              
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
                size="sm"
              >
                <FileDown className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Exportar</span>
              </Button>
              
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm"
                size="sm"
              >
                <FileUp className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Importar</span>
              </Button>
            </div>
          </div>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 sm:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Buscar por solicitante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-xs sm:text-sm border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800 flex-1 min-h-0">
            <CardHeader className="p-3 sm:p-4 flex-shrink-0">
              <CardTitle className="text-sm sm:text-base text-blue-800 dark:text-blue-200 flex items-center gap-2 flex-wrap">
                <span>Lista de Solicitudes</span>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  Mostrando {filteredRequests.length} de {contractRequests.length} solicitudes
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
              <div className="h-full overflow-auto">
                <div className="min-w-[700px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                      <TableRow>
                        <TableHead className="text-xs min-w-[150px] px-2 sm:px-3">Solicitante</TableHead>
                        <TableHead className="text-xs min-w-[120px] px-2 sm:px-3">Centro de Trabajo</TableHead>
                        <TableHead className="text-xs min-w-[100px] px-2 sm:px-3">Puesto</TableHead>
                        <TableHead className="text-xs min-w-[80px] px-2 sm:px-3">Ciudad</TableHead>
                        <TableHead className="text-xs min-w-[100px] px-2 sm:px-3 text-center">Fecha</TableHead>
                        <TableHead className="text-xs min-w-[80px] px-2 sm:px-3 text-center">Estado</TableHead>
                        <TableHead className="w-[60px] text-xs text-center sticky right-0 bg-white dark:bg-gray-900">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="text-xs px-2 sm:px-3 font-medium">
                            <div className="max-w-[150px] truncate">
                              {request.requesterName} {request.requesterLastName}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs px-2 sm:px-3">
                            <div className="max-w-[120px] truncate">
                              {request.workCenter}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs px-2 sm:px-3">
                            <div className="max-w-[100px] truncate">
                              {request.jobPosition}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs px-2 sm:px-3">
                            <div className="max-w-[80px] truncate">
                              {request.city}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs px-2 sm:px-3 text-center">
                            {request.requestDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-xs px-2 sm:px-3 text-center">
                            <Badge 
                              variant={request.status === 'Aprobado' ? 'default' : 
                                      request.status === 'Rechazado' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 sm:px-3 sticky right-0 bg-white dark:bg-gray-900">
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-7 w-7 p-0">
                                    <MoreHorizontal className="h-3.5 w-3.5 flex-shrink-0" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 z-50">
                                  <DropdownMenuItem onClick={() => handleViewDetails(request)} className="cursor-pointer text-xs">
                                    <Eye className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                                    <span>Ver detalles</span>
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
              
              <div className="sm:hidden p-3 text-center border-t flex-shrink-0">
                <p className="text-xs text-gray-500">
                  ← Desliza horizontalmente para ver más columnas →
                </p>
              </div>
            </CardContent>
          </Card>

          <ImportContractRequestsModal
            open={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImportSuccess={() => {
              loadContractRequests();
              setShowImportModal(false);
            }}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractRequestsListView;
