
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, Download, Upload, Eye, FileText, MoreHorizontal, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { getAvailableSheets, getSheetData, PropertyData } from '../../services/realEstateService';

interface RealEstateListViewProps {
  language: Language;
  onViewDetails: (id: string) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

const RealEstateListView: React.FC<RealEstateListViewProps> = ({ 
  language, 
  onViewDetails,
  onCreateNew,
  onBack 
}) => {
  const { t } = useTranslation(language);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [sheetData, setSheetData] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 30;
  
  const totalPages = Math.ceil(sheetData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sheetData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const loadSheets = async () => {
      try {
        const sheets = await getAvailableSheets();
        setAvailableSheets(sheets);
        if (sheets.length > 0) {
          setSelectedSheet(sheets[0]);
        }
      } catch (error) {
        console.error('Error al cargar hojas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSheets();
  }, []);

  useEffect(() => {
    if (selectedSheet) {
      const loadSheetData = async () => {
        setLoading(true);
        try {
          const data = await getSheetData(selectedSheet);
          setSheetData(data);
          setCurrentPage(1);
        } catch (error) {
          console.error('Error al cargar datos de la hoja:', error);
        } finally {
          setLoading(false);
        }
      };

      loadSheetData();
    }
  }, [selectedSheet]);

  const handleExport = (format: 'json' | 'csv') => {
    console.log(`Exportando ${selectedSheet} en formato ${format}`);
    // Implementación futura para exportar datos
  };

  const handleImport = () => {
    console.log('Importando datos');
    // Implementación futura para importar datos
  };

  // Obtener las columnas del primer registro
  const columns = currentData.length > 0 ? Object.keys(currentData[0]).filter(key => key !== 'id') : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Gestión de Tablas
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecciona una tabla" />
                </SelectTrigger>
                <SelectContent>
                  {availableSheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={onCreateNew}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Registro
              </Button>
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    <FileText className="w-4 h-4 mr-2" />
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                onClick={handleImport}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      {selectedSheet && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              {selectedSheet} ({sheetData.length} registros)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 dark:bg-blue-900/50">
                    {columns.slice(0, 6).map((column) => (
                      <TableHead key={column} className="text-blue-800 dark:text-blue-200 whitespace-nowrap">
                        {column}
                      </TableHead>
                    ))}
                    <TableHead className="text-blue-800 dark:text-blue-200">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.slice(0, 6).length + 1} className="h-24 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((item, index) => (
                      <TableRow key={item.id || index} className="hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        {columns.slice(0, 6).map((column) => (
                          <TableCell key={column} className="whitespace-nowrap max-w-[200px] truncate">
                            {String(item[column] || '-')}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewDetails(item.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver/Editar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paginación */}
      {sheetData.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages} (Total: {sheetData.length} registros)
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateListView;
