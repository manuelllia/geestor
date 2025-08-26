import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import {
  getEmployeeAgreements,
  EmployeeAgreementRecord,
  deleteEmployeeAgreement,
  duplicateEmployeeAgreement,
} from '../../services/employeeAgreementsService';
import { useToast } from '@/hooks/use-toast';
import ImportEmployeeAgreementsModal from './ImportEmployeeAgreementsModal';
import EmployeeAgreementCreateForm from './EmployeeAgreementCreateForm';
import EmployeeAgreementDetailView from './EmployeeAgreementDetailView';
import EmployeeAgreementEditForm from './EmployeeAgreementEditForm';

interface EmployeeAgreementsListViewProps {
  language: Language;
}

const EmployeeAgreementsListView: React.FC<EmployeeAgreementsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [agreements, setAgreements] = useState<EmployeeAgreementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const itemsPerPage = 30;

  const loadAgreements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const agreementsData = await getEmployeeAgreements();
      setAgreements(agreementsData);
      console.log('Acuerdos con empleados cargados:', agreementsData.length);
    } catch (err) {
      console.error('Error cargando acuerdos:', err);
      setError('Error al cargar los acuerdos con empleados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgreements();
  }, []);

  const totalPages = Math.ceil(agreements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, agreements.length);
  const currentData = agreements.slice(startIndex, endIndex);

  const handleViewDetails = (agreementId: string) => {
    setSelectedAgreementId(agreementId);
    setViewMode('detail');
  };

  const handleEdit = (agreementId: string) => {
    setSelectedAgreementId(agreementId);
    setViewMode('edit');
  };

  const handleCreateNew = () => {
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedAgreementId(null);
  };

  const handleSave = () => {
    loadAgreements();
    handleBackToList();
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateEmployeeAgreement(id);
      toast({
        title: 'Acuerdo duplicado',
        description: 'El acuerdo con el empleado ha sido duplicado exitosamente.',
      });
      loadAgreements();
    } catch (error) {
      toast({
        title: 'Error al duplicar',
        description: 'No se pudo duplicar el acuerdo con el empleado.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este acuerdo con el empleado?')) {
      try {
        await deleteEmployeeAgreement(id);
        toast({
          title: 'Acuerdo eliminado',
          description: 'El acuerdo con el empleado ha sido eliminado exitosamente.',
        });
        loadAgreements();
      } catch (error) {
        toast({
          title: 'Error al eliminar',
          description: 'No se pudo eliminar el acuerdo con el empleado.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDownloadPDF = (id: string) => {
    handleViewDetails(id);
  };

  const handleExport = () => {
    if (agreements.length === 0) {
      toast({
        title: 'Sin datos',
        description: 'No hay acuerdos con empleados para exportar.',
        variant: 'destructive',
      });
      return;
    }

    const headers = [
      'ID',
      'Nombre Empleado',
      'Apellidos Empleado',
      'Centro de Trabajo',
      'Nombre Responsable',
      'Apellidos Responsable',
      'Conceptos del Acuerdo',
      'Fecha de Activación',
      'Fecha Fin',
      'Fecha de Creación'
    ];

    const csvContent = [
      headers.join(','),
      ...agreements.map(agreement => [
        agreement.id || '',
        `"${agreement.employeeName}"`,
        `"${agreement.employeeLastName}"`,
        `"${agreement.workCenter}"`,
        `"${agreement.responsibleName}"`,
        `"${agreement.responsibleLastName}"`,
        `"${agreement.agreementConcepts}"`,
        agreement.activationDate ? agreement.activationDate.toLocaleDateString('es-ES') : '',
        agreement.endDate ? agreement.endDate.toLocaleDateString('es-ES') : '',
        agreement.createdAt ? agreement.createdAt.toLocaleDateString('es-ES') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `acuerdos_empleados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Exportación completada',
        description: 'Los acuerdos con empleados han sido exportados exitosamente.',
      });
    }
  };

  const handleRefresh = () => {
    loadAgreements();
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  if (viewMode === 'create') {
    return (
      <EmployeeAgreementCreateForm
        language={language}
        onBack={handleBackToList}
        onSave={handleSave}
      />
    );
  }

  if (viewMode === 'detail' && selectedAgreementId) {
    return (
      <EmployeeAgreementDetailView
        language={language}
        agreementId={selectedAgreementId}
        onBack={handleBackToList}
      />
    );
  }

  if (viewMode === 'edit' && selectedAgreementId) {
    return (
      <EmployeeAgreementEditForm
        language={language}
        agreementId={selectedAgreementId}
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
          Acuerdos con Empleados
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
            Crear Nuevo
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

      {/* Tabla de acuerdos */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Acuerdos con Empleados
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
                Cargando acuerdos con empleados...
              </h3>
            </div>
          )}

          {!isLoading && !error && agreements.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay acuerdos con empleados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza creando un nuevo acuerdo o importa datos desde un archivo.
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo
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

          {!isLoading && !error && agreements.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Centro de Trabajo</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Conceptos del Acuerdo</TableHead>
                      <TableHead>Fecha de Activación</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((agreement) => (
                      <TableRow key={agreement.id}>
                        <TableCell className="font-medium">
                          {agreement.employeeName} {agreement.employeeLastName}
                        </TableCell>
                        <TableCell>{agreement.workCenter}</TableCell>
                        <TableCell>{agreement.responsibleName} {agreement.responsibleLastName}</TableCell>
                        <TableCell>{agreement.agreementConcepts}</TableCell>
                        <TableCell>
                          {formatDate(agreement.activationDate)}
                        </TableCell>
                        <TableCell>
                          {formatDate(agreement.endDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(agreement.id)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(agreement.id)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(agreement.id)}
                              title="Duplicar"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(agreement.id)}
                              title="Descargar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(agreement.id)}
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

              {agreements.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {startIndex + 1} a {endIndex} de {agreements.length} registros
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

      <ImportEmployeeAgreementsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        language={language}
      />
    </div>
  );
};

export default EmployeeAgreementsListView;
