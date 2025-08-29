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

const ChangeSheetsListView: React.FC<ChangeSheetsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [changeSheets, setChangeSheets] = useState<ChangeSheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChangeSheet, setSelectedChangeSheet] = useState<ChangeSheetRecord | null>(null);
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
    loadChangeSheets();
  }, []);

  const loadChangeSheets = async () => {
    try {
      setLoading(true);
      const sheetsData = await getChangeSheets();
      setChangeSheets(sheetsData);
    } catch (error) {
      console.error('Error loading change sheets:', error);
      toast.error('Error al cargar las hojas de cambio');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChangeSheets();
    setRefreshing(false);
  };

  const handleViewSheet = (sheet: ChangeSheetRecord) => {
    setSelectedChangeSheet(sheet);
    setShowDetailView(true);
  };

  const handleEditSheet = (sheet: ChangeSheetRecord) => {
    console.log('Edit functionality not implemented yet');
    toast.info('Funcionalidad de edición próximamente');
  };

  const handleDuplicateSheet = async (sheet: ChangeSheetRecord) => {
    try {
      await duplicateChangeSheet(sheet.id);
      await loadChangeSheets();
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
      await loadChangeSheets();
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
    loadChangeSheets();
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    loadChangeSheets();
  };

  // Cálculos de paginación
  const totalItems = changeSheets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = changeSheets.slice(startIndex, endIndex);

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

  if (showDetailView && selectedChangeSheet) {
    return (
      <ChangeSheetDetailView
        sheetId={selectedChangeSheet.id}
        language={language}
        onBack={() => {
          setShowDetailView(false);
          setSelectedChangeSheet(null);
        }}
        onDelete={() => {
          setShowDetailView(false);
          setSelectedChangeSheet(null);
          loadChangeSheets();
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              Hojas de Cambio
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestiona las hojas de cambio del sistema
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
              size="sm"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Importar
            </Button>
            
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
              size="sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Nueva Hoja
            </Button>
          </div>
        </div>

        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Lista de Hojas de Cambio
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {changeSheets.length} hojas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Información de paginación */}
            <div className="px-3 sm:px-0 pb-3 sm:pb-4">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Mostrando del {startIndex + 1} al {Math.min(endIndex, totalItems)} de {totalItems} hojas
              </p>
            </div>

            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Título</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px]">Tipo</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px] hidden sm:table-cell">Prioridad</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden lg:table-cell">Solicitante</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[90px] hidden sm:table-cell">Fecha Solicitud</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">Estado</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {changeSheets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[120px]">
                            {sheet.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="truncate max-w-[100px]">
                            {sheet.type}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <Badge 
                            variant={sheet.priority === 'Alta' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {sheet.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <div className="truncate max-w-[100px]">
                            {sheet.requesterName} {sheet.requesterLastName}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[90px]">
                            {new Date(sheet.requestDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {sheet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                              <DropdownMenuItem onClick={() => handleViewSheet(sheet)} className="cursor-pointer text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditSheet(sheet)} className="cursor-pointer text-xs sm:text-sm">
                                <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateSheet(sheet)} className="cursor-pointer text-xs sm:text-sm">
                                <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteSheet(sheet)} className="cursor-pointer text-red-600 text-xs sm:text-sm">
                                <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Eliminar
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 sm:p-4 border-t">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>Página {currentPage} de {totalPages}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs sm:text-sm"
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
                        className="text-xs sm:text-sm min-w-[32px] sm:min-w-[36px]"
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
                    className="text-xs sm:text-sm"
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
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default ChangeSheetsListView;
