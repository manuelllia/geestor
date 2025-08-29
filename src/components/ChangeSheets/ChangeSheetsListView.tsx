
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
import { getChangeSheets, deleteChangeSheet, duplicateChangeSheet, ChangeSheetRecord } from '../../services/changeSheetsService';
import ChangeSheetCreateForm from './ChangeSheetCreateForm';
import ChangeSheetDetailView from './ChangeSheetDetailView';
import ImportChangeSheetsModal from './ImportChangeSheetsModal';
import { toast } from 'sonner';

interface ChangeSheetsListViewProps {
  language: Language;
}

export const ChangeSheetsListView: React.FC<ChangeSheetsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [sheets, setSheets] = useState<ChangeSheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState<ChangeSheetRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState<ChangeSheetRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    try {
      setLoading(true);
      const sheetsData = await getChangeSheets();
      setSheets(sheetsData);
    } catch (error) {
      console.error('Error loading change sheets:', error);
      toast.error('Error al cargar las hojas de cambio');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSheets();
    setRefreshing(false);
  };

  const handleViewSheet = (sheet: ChangeSheetRecord) => {
    setSelectedSheet(sheet);
    setShowDetailView(true);
  };

  const handleDuplicateSheet = async (sheet: ChangeSheetRecord) => {
    try {
      await duplicateChangeSheet(sheet.id);
      await loadSheets();
      toast.success('Hoja de cambio duplicada correctamente');
    } catch (error) {
      console.error('Error duplicating sheet:', error);
      toast.error('Error al duplicar la hoja de cambio');
    }
  };

  const handleDeleteSheet = (sheet: ChangeSheetRecord) => {
    setSheetToDelete(sheet);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!sheetToDelete) return;

    try {
      await deleteChangeSheet(sheetToDelete.id);
      await loadSheets();
      toast.success('Hoja de cambio eliminada correctamente');
    } catch (error) {
      console.error('Error deleting sheet:', error);
      toast.error('Error al eliminar la hoja de cambio');
    } finally {
      setDeleteDialogOpen(false);
      setSheetToDelete(null);
    }
  };

  const handleSheetCreated = () => {
    setShowCreateForm(false);
    loadSheets();
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    loadSheets();
  };

  // Cálculos de paginación
  const totalItems = sheets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sheets.slice(startIndex, endIndex);

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
      <ChangeSheetCreateForm
        language={language}
        onBack={() => setShowCreateForm(false)}
        onSave={handleSheetCreated}
      />
    );
  }

  if (showDetailView && selectedSheet) {
    return (
      <ChangeSheetDetailView
        sheetId={selectedSheet.id}
        language={language}
        onBack={() => {
          setShowDetailView(false);
          setSelectedSheet(null);
        }}
        onDelete={() => {
          if (selectedSheet) {
            handleDeleteSheet(selectedSheet);
            setShowDetailView(false);
            setSelectedSheet(null);
          }
        }}
      />
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header responsive */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
              Hojas de Cambio
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestiona las hojas de cambio del sistema
            </p>
          </div>
          
          {/* Botones responsivos */}
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
              <span>Nueva Hoja</span>
            </Button>
          </div>
        </div>

        {/* Card con tabla responsive */}
        <Card className="border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg text-blue-800 dark:text-blue-200 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Lista de Hojas de Cambio</span>
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {sheets.length} hojas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Información de paginación */}
            <div className="px-3 sm:px-6 pb-3">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Mostrando del {startIndex + 1} al {Math.min(endIndex, totalItems)} de {totalItems} hojas
              </p>
            </div>

            {/* Contenedor con scroll horizontal para tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px] px-2 sm:px-4 text-xs sm:text-sm">Empleado</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Centro de Trabajo</TableHead>
                      <TableHead className="min-w-[100px] px-2 sm:px-4 text-xs sm:text-sm">Tipo</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Estado</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Fecha Inicio</TableHead>
                      <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">Fecha Fin</TableHead>
                      <TableHead className="w-[80px] px-2 sm:px-4 text-xs sm:text-sm text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell className="font-medium px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">
                            {sheet.employeeName} {sheet.employeeLastName}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">{sheet.company || '-'}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <div className="truncate">{sheet.changeType}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {sheet.status || 'Activa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          {sheet.startDate ? new Date(sheet.startDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                          {sheet.endDate ? new Date(sheet.endDate).toLocaleDateString() : '-'}
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
                                <DropdownMenuItem onClick={() => handleViewSheet(sheet)} className="cursor-pointer text-xs sm:text-sm">
                                  <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Ver detalles</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicateSheet(sheet)} className="cursor-pointer text-xs sm:text-sm">
                                  <Copy className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span>Duplicar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteSheet(sheet)} className="cursor-pointer text-red-600 text-xs sm:text-sm">
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
                Esta acción no se puede deshacer. Se eliminará permanentemente la hoja de cambio.
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
          <ImportChangeSheetsModal
            open={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImportSuccess={handleImportSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ChangeSheetsListView;
