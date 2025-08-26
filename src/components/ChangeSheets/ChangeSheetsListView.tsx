
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash2, Plus, FileText, Upload, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getChangeSheets, deleteChangeSheet, ChangeSheetRecord } from '../../services/changeSheetsService';
import ChangeSheetCreateForm from './ChangeSheetCreateForm';
import ChangeSheetDetailView from './ChangeSheetDetailView';
import ImportChangeSheetsModal from './ImportChangeSheetsModal';
import { toast } from 'sonner';

interface ChangeSheetsListViewProps {
  language: Language;
}

const ChangeSheetsListView: React.FC<ChangeSheetsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [sheets, setSheets] = useState<ChangeSheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    try {
      setLoading(true);
      const data = await getChangeSheets();
      setSheets(data);
    } catch (error) {
      console.error('Error loading change sheets:', error);
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSheets();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        await deleteChangeSheet(id);
        setSheets(prev => prev.filter(sheet => sheet.id !== id));
        toast.success('Eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting change sheet:', error);
        toast.error('Error al eliminar');
      }
    }
  };

  const handleView = (id: string) => {
    setSelectedSheetId(id);
    setCurrentView('detail');
  };

  const handleSave = () => {
    loadSheets();
    setCurrentView('list');
    setSelectedSheetId(null);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedSheetId(null);
  };

  if (currentView === 'create') {
    return (
      <ChangeSheetCreateForm
        language={language}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  if (currentView === 'detail' && selectedSheetId) {
    return (
      <ChangeSheetDetailView
        sheetId={selectedSheetId}
        language={language}
        onBack={handleBack}
        onDelete={(id: string) => {
          handleDelete(id);
          handleBack();
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
              {t('changeSheets')}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestionar hojas de cambio
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
                Lista de hojas de cambio
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {sheets.length} hojas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Empleado</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">{t('workCenter')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden lg:table-cell">Fecha</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">{t('status')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden md:table-cell">Solicitado por</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheets.map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[120px] sm:max-w-[200px]">
                            {`${sheet.employeeName} ${sheet.employeeLastName}` || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[100px]">
                            {sheet.originCenter || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {sheet.startDate?.toLocaleDateString() || 'Sin datos'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {sheet.status || t('pending')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <div className="truncate max-w-[120px]">
                            {`${sheet.currentSupervisorName} ${sheet.currentSupervisorLastName}` || 'Sin datos'}
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
                              <DropdownMenuItem onClick={() => handleView(sheet.id!)} className="cursor-pointer text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                {t('view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(sheet.id!)} 
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

        <ImportChangeSheetsModal
          open={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ChangeSheetsListView;
