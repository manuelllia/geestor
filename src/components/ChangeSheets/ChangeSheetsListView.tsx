import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Eye, Edit, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChangeSheetRecord, getChangeSheets, deleteChangeSheet, exportChangeSheetsToCSV } from '../../services/changeSheetsService';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface ChangeSheetsListViewProps {
  language: Language;
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onImport: () => void;
}

const ChangeSheetsListView: React.FC<ChangeSheetsListViewProps> = ({
  language,
  onCreateNew,
  onEdit,
  onView,
  onImport
}) => {
  const { toast } = useToast();
  const { t } = useTranslation(language);
  const [changeSheets, setChangeSheets] = useState<ChangeSheetRecord[]>([]);
  const [filteredChangeSheets, setFilteredChangeSheets] = useState<ChangeSheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadChangeSheets();
  }, []);

  useEffect(() => {
    filterChangeSheets();
  }, [changeSheets, searchTerm, statusFilter]);

  const loadChangeSheets = async () => {
    try {
      setLoading(true);
      const data = await getChangeSheets();
      setChangeSheets(data);
    } catch (error) {
      console.error('Error loading change sheets:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las hojas de cambio.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      toast({
        title: t('exporting_data'),
      });
      await exportChangeSheetsToCSV();
      toast({
        title: t('export_successful'),
      });
    } catch (error) {
      toast({
        title: t('export_failed'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const filterChangeSheets = () => {
    let filtered = changeSheets;

    if (searchTerm) {
      filtered = filtered.filter(sheet =>
        sheet.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.employeeLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.changeType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sheet => sheet.status === statusFilter);
    }

    setFilteredChangeSheets(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta hoja de cambio?')) {
      try {
        await deleteChangeSheet(id);
        toast({
          title: 'Hoja de cambio eliminada',
          description: 'La hoja de cambio ha sido eliminada correctamente.',
        });
        loadChangeSheets();
      } catch (error) {
        console.error('Error deleting change sheet:', error);
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la hoja de cambio.',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando hojas de cambio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
            Hojas de Cambio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las hojas de cambio de empleados
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onImport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Importar
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exportando...' : t('export_csv')}
          </Button>
          <Button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Hoja de Cambio
          </Button>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por empleado, empresa o tipo de cambio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Lista de Hojas de Cambio ({filteredChangeSheets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredChangeSheets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No se encontraron hojas de cambio
              </p>
              <Button
                onClick={onCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Hoja de Cambio
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Empresa Actual</TableHead>
                    <TableHead>Tipo de Cambio</TableHead>
                    <TableHead>Centro Origen</TableHead>
                    <TableHead>Centro Destino</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChangeSheets.map((sheet) => (
                    <TableRow key={sheet.id}>
                      <TableCell className="font-medium">
                        {sheet.employeeName} {sheet.employeeLastName}
                      </TableCell>
                      <TableCell>{sheet.currentCompany}</TableCell>
                      <TableCell>{sheet.changeType}</TableCell>
                      <TableCell>{sheet.originCenter}</TableCell>
                      <TableCell>{sheet.destinationCenter}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sheet.status === 'Aprobado'
                              ? 'default'
                              : sheet.status === 'Pendiente'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className={
                            sheet.status === 'Aprobado'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : sheet.status === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }
                        >
                          {sheet.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sheet.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(sheet.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(sheet.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sheet.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeSheetsListView;
