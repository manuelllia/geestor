
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Upload, Download, AlertCircle, Loader2 } from 'lucide-react';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getContractRequests, ContractRequestData } from '../../services/contractRequestsService';
import ContractRequestCreateForm from './ContractRequestCreateForm';
import ImportContractRequestsModal from '../ChangeSheets/ImportContractRequestsModal';

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

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContractRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error loading contract requests:', err);
      setError('Error al cargar las solicitudes de contrato');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'aprobado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rechazado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleExport = () => {
    console.log('Exportar solicitudes de contrato');
  };

  if (showCreateForm) {
    return (
      <ContractRequestCreateForm
        language={language}
        onBack={() => setShowCreateForm(false)}
        onSave={loadRequests}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              Solicitudes de Contratación
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(true)}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Importar</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Crear Nuevo</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando solicitudes...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-red-600 dark:text-red-400">{error}</span>
              <Button 
                variant="outline" 
                onClick={loadRequests}
                className="ml-4"
              >
                Reintentar
              </Button>
            </div>
          ) : (
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
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No hay solicitudes de contrato registradas.
                        <br />
                        <Button 
                          variant="link" 
                          onClick={() => setShowCreateForm(true)}
                          className="mt-2"
                        >
                          Crear la primera solicitud
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.applicantName}</TableCell>
                        <TableCell>{request.applicantLastName}</TableCell>
                        <TableCell>{request.position}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.requestType}</TableCell>
                        <TableCell>
                          {request.requestDate 
                            ? request.requestDate.toLocaleDateString() 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {request.expectedStartDate 
                            ? request.expectedStartDate.toLocaleDateString() 
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ImportContractRequestsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        language={language}
      />
    </div>
  );
};

export default ContractRequestsListView;
