
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash2, Plus, FileText, Upload, Download, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getContractRequests, deleteContractRequest, ContractRequest } from '../../services/contractRequestsService';
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
  const [requests, setRequests] = useState<ContractRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'detail' | 'edit'>('list');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getContractRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading contract requests:', error);
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        await deleteContractRequest(id);
        setRequests(prev => prev.filter(request => request.id !== id));
        toast.success('Eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting contract request:', error);
        toast.error('Error al eliminar');
      }
    }
  };

  const handleView = (id: string) => {
    setSelectedRequestId(id);
    setCurrentView('detail');
  };

  const handleEdit = (id: string) => {
    setSelectedRequestId(id);
    setCurrentView('edit');
  };

  const handleSave = () => {
    loadRequests();
    setCurrentView('list');
    setSelectedRequestId(null);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedRequestId(null);
  };

  if (currentView === 'create') {
    return (
      <ContractRequestCreateForm
        language={language}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  if (currentView === 'detail' && selectedRequestId) {
    return (
      <ContractRequestDetailView
        requestId={selectedRequestId}
        language={language}
        onBack={handleBack}
      />
    );
  }

  if (currentView === 'edit' && selectedRequestId) {
    return (
      <ContractRequestEditForm
        requestId={selectedRequestId}
        language={language}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {t('contractRequests')}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestionar solicitudes de contrato
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button
              onClick={() => setIsImportModalOpen(true)}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
              size="sm"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Importar
            </Button>
            
            <Button
              onClick={() => setCurrentView('create')}
              className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
              size="sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {t('createNew')}
            </Button>
          </div>
        </div>

        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Lista de solicitudes de contrato
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {requests.length} solicitudes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Empleado</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">{t('workCenter')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden lg:table-cell">Fecha solicitud</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">{t('status')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden md:table-cell">Tipo solicitud</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[120px] sm:max-w-[200px]">
                            {request.employee || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[100px]">
                            {request.workCenter || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {request.requestDate instanceof Date 
                            ? request.requestDate.toLocaleDateString() 
                            : request.requestDate || 'Sin datos'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {request.status || t('pending')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <div className="truncate max-w-[100px]">
                            {request.contractType || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                              <DropdownMenuItem onClick={() => handleView(request.id!)} className="cursor-pointer text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                {t('view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(request.id!)} className="cursor-pointer text-xs sm:text-sm">
                                <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                {t('edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(request.id!)} 
                                className="cursor-pointer text-red-600 hover:text-red-700 text-xs sm:text-sm"
                              >
                                <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                {t('delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <ImportContractRequestsModal
          open={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          language={language}
        />
      </div>
    </div>
  );
};

export default ContractRequestsListView;
