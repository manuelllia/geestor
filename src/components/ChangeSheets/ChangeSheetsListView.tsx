
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, Download, Upload, ChevronLeft, ChevronRight, FileJson, FileText } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface ChangeSheetsListViewProps {
  language: Language;
  onCreateNew?: () => void;
  onViewDetails?: (id: string) => void;
}

const ChangeSheetsListView: React.FC<ChangeSheetsListViewProps> = ({ 
  language, 
  onCreateNew,
  onViewDetails 
}) => {
  const { t } = useTranslation(language);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Datos simulados vacíos por ahora
  const changeSheets: any[] = [];
  const totalPages = Math.ceil(changeSheets.length / itemsPerPage);

  const handleExport = (format: 'json' | 'csv') => {
    // Implementación futura del export
    console.log(`Exportando en formato ${format}`);
  };

  const handleImport = () => {
    // Implementación futura del import
    console.log('Importando datos');
  };

  return (
    <div className="space-y-6">
      {/* Botones de acción */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            {t('changeSheetsManagement')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('createNew')}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Download className="w-4 h-4 mr-2" />
                  {t('export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileJson className="w-4 h-4 mr-2" />
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
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('import')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de hojas de cambio */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50 dark:bg-blue-900/20">
                <TableHead className="text-blue-800 dark:text-blue-200">ID</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('title')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('status')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('createdDate')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('lastModified')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changeSheets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {t('noDataAvailable')}
                  </TableCell>
                </TableRow>
              ) : (
                changeSheets.map((sheet) => (
                  <TableRow key={sheet.id} className="hover:bg-blue-25 dark:hover:bg-blue-900/10">
                    <TableCell>{sheet.id}</TableCell>
                    <TableCell>{sheet.title}</TableCell>
                    <TableCell>{sheet.status}</TableCell>
                    <TableCell>{sheet.createdDate}</TableCell>
                    <TableCell>{sheet.lastModified}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails?.(sheet.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {t('view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-blue-300 text-blue-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-blue-700 dark:text-blue-300">
            {t('page')} {currentPage} {t('of')} {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-blue-300 text-blue-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChangeSheetsListView;
