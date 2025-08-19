
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import ChangeSheetCreateForm from './ChangeSheetCreateForm';
import ChangeSheetDetailView from './ChangeSheetDetailView';
import ImportChangeSheetsModal from './ImportChangeSheetsModal';
import { getChangeSheets, ChangeSheetRecord, duplicateChangeSheet, exportChangeSheetsToCSV } from '../../services/changeSheetsService';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import jsPDF from 'jspdf';

interface ChangeSheetsListViewProps {
  language: Language;
  onViewDetails: (sheetId: string) => void;
  onCreateNew: () => void;
}

const ChangeSheetsListView: React.FC<ChangeSheetsListViewProps> = ({ 
  language, 
  onViewDetails,
  onCreateNew
}) => {
  const { t } = useTranslation(language);
  const { permissions, isLoading: permissionsLoading } = useUserPermissions();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [editingSheet, setEditingSheet] = useState<ChangeSheetRecord | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [changeSheets, setChangeSheets] = useState<ChangeSheetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 30;

  const canCreate = permissions?.Per_Create ?? true;
  const canDelete = permissions?.Per_Delete ?? true;
  const canView = permissions?.Per_View ?? true;
  const canModify = permissions?.Per_Modificate ?? true;

  const loadChangeSheets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sheets = await getChangeSheets();
      setChangeSheets(sheets);
      console.log('Hojas de cambio cargadas:', sheets.length);
    } catch (err) {
      console.error('Error cargando hojas de cambio:', err);
      setError('Error al cargar las hojas de cambio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChangeSheets();
  }, []);

  const totalPages = Math.ceil(changeSheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, changeSheets.length);
  const currentData = changeSheets.slice(startIndex, endIndex);

  const handleViewDetails = (id: string) => {
    setSelectedSheetId(id);
    setShowDetailView(true);
  };

  const handleEdit = (sheet: ChangeSheetRecord) => {
    setEditingSheet(sheet);
    setShowCreateForm(true);
  };

  const handleDuplicate = (id: string) => {
    setDuplicatingId(id);
    setShowDuplicateModal(true);
  };

  const confirmDuplicate = async () => {
    if (!duplicatingId) return;
    
    try {
      await duplicateChangeSheet(duplicatingId);
      setShowDuplicateModal(false);
      setDuplicatingId(null);
      await loadChangeSheets(); // Recargar la lista
      console.log('Registro duplicado correctamente');
    } catch (error) {
      console.error('Error al duplicar:', error);
      alert('Error al duplicar el registro');
    }
  };

  const handleDownloadPDF = (sheet: ChangeSheetRecord) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Título
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hoja de Cambio de Empleado', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Información del empleado
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMACIÓN DEL EMPLEADO', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${sheet.employeeName} ${sheet.employeeLastName}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Centro de Origen: ${sheet.originCenter}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Posición Actual: ${sheet.currentPosition}`, 20, yPosition);
    yPosition += 15;

    // Supervisor actual
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SUPERVISOR ACTUAL', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${sheet.currentSupervisorName} ${sheet.currentSupervisorLastName}`, 20, yPosition);
    yPosition += 15;

    // Nueva posición
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NUEVA POSICIÓN', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Posición: ${sheet.newPosition}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Supervisor: ${sheet.newSupervisorName} ${sheet.newSupervisorLastName}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Fecha de Inicio: ${sheet.startDate ? sheet.startDate.toLocaleDateString() : 'No especificada'}`, 20, yPosition);
    yPosition += 15;

    // Detalles del cambio
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETALLES DEL CAMBIO', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Tipo de Cambio: ${sheet.changeType === 'permanent' ? 'Permanente' : 'Temporal'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Empresa Actual: ${sheet.currentCompany}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Cambio de Empresa: ${sheet.companyChange === 'yes' ? 'Sí' : 'No'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Estado: ${sheet.status}`, 20, yPosition);
    yPosition += 15;

    // Necesidades
    if (sheet.needs.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NECESIDADES', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      sheet.needs.forEach(need => {
        pdf.text(`• ${need}`, 20, yPosition);
        yPosition += 8;
      });
      yPosition += 7;
    }

    // Observaciones
    if (sheet.observations) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OBSERVACIONES', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const splitObservations = pdf.splitTextToSize(sheet.observations, pageWidth - 40);
      pdf.text(splitObservations, 20, yPosition);
      yPosition += splitObservations.length * 6;
    }

    // Información de creación
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Creado: ${sheet.createdAt.toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Última actualización: ${sheet.updatedAt.toLocaleDateString()}`, 20, yPosition);

    // Descargar
    pdf.save(`Hoja_Cambio_${sheet.employeeName}_${sheet.employeeLastName}_${sheet.id}.pdf`);
  };

  const handleExport = async () => {
    try {
      await exportChangeSheetsToCSV();
      console.log('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const handleRefresh = () => {
    loadChangeSheets();
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

  if (showDetailView && selectedSheetId) {
    return (
      <ChangeSheetDetailView
        language={language}
        sheetId={selectedSheetId}
        onBack={() => {
          setShowDetailView(false);
          setSelectedSheetId(null);
          loadChangeSheets(); // Recargar en caso de que se haya eliminado
        }}
        onDelete={() => {
          setShowDetailView(false);
          setSelectedSheetId(null);
          loadChangeSheets();
        }}
      />
    );
  }

  if (showCreateForm) {
    return (
      <ChangeSheetCreateForm 
        language={language} 
        editingSheet={editingSheet}
        onBack={() => {
          setShowCreateForm(false);
          setEditingSheet(null);
          loadChangeSheets(); // Recargar datos después de crear/editar
        }}
        onSave={() => {
          setShowCreateForm(false);
          setEditingSheet(null);
          loadChangeSheets(); // Recargar datos después de guardar
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          {t('changeSheetsManagement')}
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
          
          {canCreate && (
            <Button
              onClick={() => {
                setEditingSheet(null);
                setShowCreateForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('createNew')}
            </Button>
          )}
          
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

      {/* Tabla de hojas de cambio */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            {t('hojasCambio')}
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
                Cargando hojas de cambio...
              </h3>
            </div>
          )}
          
          {!isLoading && !error && changeSheets.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay hojas de cambio
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza creando una nueva hoja de cambio o importa datos desde un archivo.
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
          
          {!isLoading && !error && changeSheets.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('employeeName')}</TableHead>
                      <TableHead>{t('originCenter')}</TableHead>
                      <TableHead>Nuevo Puesto</TableHead>
                      <TableHead>{t('startDate')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead className="text-center">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell className="font-medium">
                          {sheet.employeeName} {sheet.employeeLastName}
                        </TableCell>
                        <TableCell>{sheet.originCenter}</TableCell>
                        <TableCell>{sheet.newPosition}</TableCell>
                        <TableCell>
                          {sheet.startDate ? formatDate(sheet.startDate) : 'No especificada'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(sheet.status)}>
                            {sheet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-1">
                            {canView && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(sheet.id)}
                                title={t('view')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {canModify && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(sheet)}
                                  title="Editar registro"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDuplicate(sheet.id)}
                                  title={t('duplicateRecord')}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(sheet)}
                              title={t('downloadPDF')}
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
              {changeSheets.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {startIndex + 1} a {endIndex} de {changeSheets.length} registros
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

      {/* Modal de confirmación de duplicado */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Duplicación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas duplicar este registro? Se creará una copia con estado "Pendiente".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmDuplicate} className="bg-blue-600 hover:bg-blue-700">
              Duplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de importación */}
      <ImportChangeSheetsModal
        open={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          loadChangeSheets(); // Recargar datos después de importar
        }}
        language={language}
      />
    </div>
  );
};

export default ChangeSheetsListView;
