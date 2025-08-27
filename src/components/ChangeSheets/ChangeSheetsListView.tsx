import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown, RefreshCw, AlertCircle, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { ResponsiveTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/responsive-table';
import ChangeSheetCreateForm from './ChangeSheetCreateForm';
import ChangeSheetDetailView from './ChangeSheetDetailView';
import ImportChangeSheetsModal from './ImportChangeSheetsModal';
import { getChangeSheets, ChangeSheetRecord, duplicateChangeSheet, exportChangeSheetsToCSV } from '../../services/changeSheetsService';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useResponsive } from '../../hooks/useResponsive';
import jsPDF from 'jspdf';
import { cn } from '@/lib/utils';

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
  const { isMobile, isTablet } = useResponsive();
  
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

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedChangeSheets = useMemo(() => {
    if (!sortColumn) {
      return changeSheets;
    }

    const sortedData = [...changeSheets].sort((a, b) => {
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sortedData;
  }, [changeSheets, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedChangeSheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedChangeSheets.length);
  const currentData = sortedChangeSheets.slice(startIndex, endIndex);

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
      await loadChangeSheets();
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

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hoja de Cambio de Empleado', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

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

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SUPERVISOR ACTUAL', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${sheet.currentSupervisorName} ${sheet.currentSupervisorLastName}`, 20, yPosition);
    yPosition += 15;

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

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DETALLES DEL CAMBIO', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Tipo de Cambio: ${sheet.changeType === 'Permanente' ? 'Permanente' : 'Temporal'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Empresa Actual: ${sheet.currentCompany}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Cambio de Empresa: ${sheet.companyChange === 'Si' ? 'Sí' : 'No'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Estado: ${sheet.status}`, 20, yPosition);
    yPosition += 15;

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

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Creado: ${sheet.createdAt.toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Última actualización: ${sheet.updatedAt.toLocaleDateString()}`, 20, yPosition);

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
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
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
          loadChangeSheets();
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
          loadChangeSheets();
        }}
        onSave={() => {
          setShowCreateForm(false);
          setEditingSheet(null);
          loadChangeSheets();
        }}
      />
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="responsive-container responsive-padding space-y-4 sm:space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <h1 className="responsive-title font-semibold text-primary">
            {t('changeSheetsManagement')}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="button-responsive border-primary/30 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`icon-responsive mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Actualizar</span>
            </Button>
            
            {canCreate && (
              <Button
                onClick={() => {
                  setEditingSheet(null);
                  setShowCreateForm(true);
                }}
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

        <Card className="border-primary/20">
          <CardHeader className="responsive-padding">
            <CardTitle className="responsive-subtitle text-primary">
              {t('hojasCambio')}
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
                <Button onClick={handleRefresh} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                  Cargando hojas de cambio...
                </h3>
              </div>
            )}
            
            {!isLoading && !error && changeSheets.length === 0 && (
              <div className="text-center py-12 responsive-padding">
                <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="responsive-text font-medium text-foreground mb-2">
                  No hay hojas de cambio
                </h3>
                <p className="responsive-text text-muted-foreground mb-4">
                  Comienza creando una nueva hoja de cambio o importa datos desde un archivo.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="icon-responsive mr-2 flex-shrink-0" />
                    Crear Nueva
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
            
            {!isLoading && !error && changeSheets.length > 0 && (
              <div className="w-full">
                <ResponsiveTable minWidth="900px">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer select-none min-w-[140px]"
                          onClick={() => handleSort('employeeName')}
                        >
                          <div className="flex items-center">
                            <span className="responsive-text font-medium">{t('employeeName')}</span>
                            {sortColumn === 'employeeName' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none min-w-[120px]"
                          onClick={() => handleSort('originCenter')}
                        >
                          <div className="flex items-center">
                            <span className="responsive-text font-medium">{t('originCenter')}</span>
                            {sortColumn === 'originCenter' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none min-w-[120px]"
                          onClick={() => handleSort('newPosition')}
                        >
                          <div className="flex items-center">
                            <span className="responsive-text font-medium">Nuevo Puesto</span>
                            {sortColumn === 'newPosition' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none min-w-[100px]"
                          onClick={() => handleSort('startDate')}
                        >
                          <div className="flex items-center">
                            <span className="responsive-text font-medium">{t('startDate')}</span>
                            {sortColumn === 'startDate' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer select-none min-w-[100px]"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            <span className="responsive-text font-medium">{t('status')}</span>
                            {sortColumn === 'status' && (
                              <span className="ml-1 flex-shrink-0">
                                {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-center min-w-[150px]">
                          <span className="responsive-text font-medium">{t('actions')}</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((sheet) => (
                        <TableRow key={sheet.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="responsive-text truncate max-w-[120px]">
                              {sheet.employeeName} {sheet.employeeLastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {sheet.originCenter}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text truncate max-w-[100px]">
                              {sheet.newPosition}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="responsive-text">
                              {sheet.startDate ? formatDate(sheet.startDate) : 'No especificada'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(sheet.status)} text-xs`}>
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
                                  className="hover:bg-primary/10"
                                >
                                  <Eye className="icon-responsive flex-shrink-0" />
                                </Button>
                              )}
                              {canModify && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(sheet)}
                                    title="Editar registro"
                                    className="hover:bg-primary/10"
                                  >
                                    <Edit className="icon-responsive flex-shrink-0" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDuplicate(sheet.id)}
                                    title={t('duplicateRecord')}
                                    className="hover:bg-primary/10"
                                  >
                                    <Copy className="icon-responsive flex-shrink-0" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPDF(sheet)}
                                title={t('downloadPDF')}
                                className="hover:bg-primary/10"
                              >
                                <Download className="icon-responsive flex-shrink-0" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ResponsiveTable>

                {changeSheets.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center responsive-padding responsive-gap">
                    <div className="responsive-text text-muted-foreground">
                      Mostrando {startIndex + 1} a {endIndex} de {sortedChangeSheets.length} registros
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
                              className={cn(
                                "responsive-text",
                                currentPage === pageNumber ? "bg-primary text-primary-foreground" : ""
                              )}
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
            <Button onClick={confirmDuplicate} className="bg-primary hover:bg-primary/90">
              Duplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportChangeSheetsModal
        open={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          loadChangeSheets();
        }}
        language={language}
      />
    </div>
  );
};

export default ChangeSheetsListView;
