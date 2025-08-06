
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
import { Plus, Download, Upload, ChevronLeft, ChevronRight, FileJson, FileText, Copy, FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  const totalItems = changeSheets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleExport = (format: 'json' | 'csv') => {
    // Implementación futura del export
    console.log(`Exportando en formato ${format}`);
  };

  const handleImport = () => {
    // Implementación futura del import
    console.log('Importando datos');
  };

  const handleDuplicate = (id: string) => {
    // Implementación futura de duplicar registro
    console.log(`Duplicando registro ${id}`);
  };

  const handleDownloadPDF = (id: string) => {
    // Implementación futura de descarga PDF
    console.log(`Descargando PDF ${id}`);
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
                <TableHead className="text-blue-800 dark:text-blue-200">{t('employeeName')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('originCenter')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('destinationCenter')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('startDate')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('duplicateRecord')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('downloadPDF')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changeSheets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {t('noDataAvailable')}
                  </TableCell>
                </TableRow>
              ) : (
                changeSheets.map((sheet) => (
                  <TableRow key={sheet.id} className="hover:bg-blue-25 dark:hover:bg-blue-900/10">
                    <TableCell>{sheet.employeeName}</TableCell>
                    <TableCell>{sheet.originCenter}</TableCell>
                    <TableCell>{sheet.destinationCenter}</TableCell>
                    <TableCell>{sheet.startDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(sheet.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadPDF(sheet.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FileDown className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{sheet.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Información de registros y paginación */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {t('showingRecords', { start: startItem, end: endItem, total: totalItems })}
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
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
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default ChangeSheetsListView;
