import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit, Copy, Download } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { ResponsiveTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/responsive-table';
import EmployeeAgreementCreateForm from './EmployeeAgreementCreateForm';
import EmployeeAgreementDetailView from './EmployeeAgreementDetailView';
import EmployeeAgreementEditForm from './EmployeeAgreementEditForm';
import ImportEmployeeAgreementsModal from './ImportEmployeeAgreementsModal';
import { getEmployeeAgreements, EmployeeAgreementRecord, deleteEmployeeAgreement, exportEmployeeAgreementsToCSV } from '../../services/employeeAgreementsService';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useResponsive } from '../../hooks/useResponsive';

interface EmployeeAgreementsListViewProps {
  language: Language;
}

const EmployeeAgreementsListView: React.FC<EmployeeAgreementsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const { permissions } = useUserPermissions();
  const { isMobile, isTablet } = useResponsive();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [editingAgreementId, setEditingAgreementId] = useState<string | null>(null);
  const [agreements, setAgreements] = useState<EmployeeAgreementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const canCreate = permissions?.Per_Create ?? true;
  const canDelete = permissions?.Per_Delete ?? true;
  const canView = permissions?.Per_View ?? true;
  const canModify = permissions?.Per_Modificate ?? true;

  const loadAgreements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const agreementsData = await getEmployeeAgreements();
      setAgreements(agreementsData);
    } catch (err) {
      console.error('Error cargando acuerdos:', err);
      setError('Error al cargar los acuerdos de empleados');
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

  const handleViewDetails = (id: string) => {
    setSelectedAgreementId(id);
    setShowDetailView(true);
  };

  const handleEdit = (agreement: EmployeeAgreementRecord) => {
    setEditingAgreementId(agreement.id);
    setShowEditForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este acuerdo?')) {
      try {
        await deleteEmployeeAgreement(id);
        await loadAgreements();
        console.log('Acuerdo eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar acuerdo:', error);
        alert('Error al eliminar el acuerdo');
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportEmployeeAgreementsToCSV();
      console.log('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  if (showDetailView && selectedAgreementId) {
    return (
      <EmployeeAgreementDetailView
        language={language}
        agreementId={selectedAgreementId}
        onBack={() => {
          setShowDetailView(false);
          setSelectedAgreementId(null);
          loadAgreements();
        }}
      />
    );
  }

  if (showCreateForm) {
    return (
      <EmployeeAgreementCreateForm 
        language={language} 
        onBack={() => {
          setShowCreateForm(false);
          loadAgreements();
        }}
        onSave={() => {
          setShowCreateForm(false);
          loadAgreements();
        }}
      />
    );
  }

  if (showEditForm && editingAgreementId) {
    return (
      <EmployeeAgreementEditForm 
        language={language} 
        agreementId={editingAgreementId}
        onBack={() => {
          setShowEditForm(false);
          setEditingAgreementId(null);
          loadAgreements();
        }}
        onSave={() => {
          setShowEditForm(false);
          setEditingAgreementId(null);
          loadAgreements();
        }}
      />
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="responsive-container responsive-padding space-y-4 sm:space-y-6">
        {/* Header responsivo */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <h1 className="responsive-title font-semibold text-primary">
            {t('employeeAgreements')}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={loadAgreements}
              variant="outline"
              disabled={isLoading}
              className="button-responsive border-primary/30 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`icon-responsive mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Actualizar</span>
            </Button>
            
            {canCreate && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="button-responsive bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="icon-responsive mr-2 flex-shrink-0" />
                <span className="hidden xs:inline">{t('createNew')}</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleExport}
              className="button-responsive border-primary/30 text-primary hover:bg-primary/10"
            >
              <FileDown className="icon-responsive mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{t('export')}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="button-responsive border-primary/30 text-primary hover:bg-primary/10"
            >
              <Upload className="icon-responsive mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{t('import')}</span>
            </Button>
          </div>
        </div>

        {/* Card con tabla responsiva */}
        <Card className="border-primary/20">
          <CardHeader className="responsive-padding">
            <CardTitle className="responsive-subtitle text-primary">
              Lista de Acuerdos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="text-center py-8 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="responsive-text font-medium text-destructive mb-2">
                  Error al cargar datos
                </h3>
                <p className="responsive-text text-destructive/80 mb-4">
                  {error}
                </p>
                <Button onClick={loadAgreements} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Intentar de nuevo
                </Button>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-12 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
                <h3 className="responsive-text font-medium text-foreground mb-2">
                  Cargando acuerdos...
                </h3>
              </div>
            )}
            
            {!isLoading && !error && agreements.length === 0 && (
              <div className="text-center py-12 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="responsive-text font-medium text-foreground mb-2">
                  No hay acuerdos de empleados
                </h3>
                <p className="responsive-text text-muted-foreground mb-4">
                  Comienza creando un nuevo acuerdo o importa datos desde un archivo.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="icon-responsive mr-2 flex-shrink-0" />
                    Crear Nuevo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowImportModal(true)}
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Upload className="icon-responsive mr-2 flex-shrink-0" />
                    Importar Datos
                  </Button>
                </div>
              </div>
            )}
            
            {!isLoading && !error && agreements.length > 0 && (
              <div className="w-full">
                <ResponsiveTable minWidth="900px">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[140px]">
                          <span className="responsive-text font-medium">{t('employeeName')}</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">{t('position')}</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">{t('department')}</span>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <span className="responsive-text font-medium">Tipo de Contrato</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">{t('startDate')}</span>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <span className="responsive-text font-medium">{t('salary')}</span>
                        </TableHead>
                        <TableHead className="text-center min-w-[150px]">
                          <span className="responsive-text font-medium">{t('actions')}</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((agreement) => (
                        <TableRow key={agreement.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="responsive-text truncate max-w-[120px]">
                              {agreement.employeeName} {agreement.employeeLastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {agreement.jobPosition}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {agreement.department}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {agreement.contractType}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text">
                              {agreement.startDate ? formatDate(agreement.startDate) : 'No especificada'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text">
                              {agreement.salary}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-1">
                              {canView && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(agreement.id)}
                                  title={t('view')}
                                  className="hover:bg-primary/10"
                                >
                                  <Eye className="icon-responsive flex-shrink-0" />
                                </Button>
                              )}
                              {canModify && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(agreement)}
                                  title="Editar acuerdo"
                                  className="hover:bg-primary/10"
                                >
                                  <Edit className="icon-responsive flex-shrink-0" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ResponsiveTable>

                {/* Paginación responsiva */}
                {agreements.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center responsive-padding responsive-gap">
                    <div className="responsive-text text-muted-foreground">
                      Mostrando {startIndex + 1} a {endIndex} de {agreements.length} registros
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="responsive-text"
                      >
                        Anterior
                      </Button>
                      
                      <div className="text-sm text-muted-foreground">
                        {currentPage} de {totalPages}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="responsive-text"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de importación */}
      <ImportEmployeeAgreementsModal
        open={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          loadAgreements();
        }}
        onImportSuccess={() => {
          loadAgreements();
        }}
      />
    </div>
  );
};

export default EmployeeAgreementsListView;
