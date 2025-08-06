
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, Download, Upload, Eye, FileText, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface RealEstateListViewProps {
  language: Language;
  onViewDetails: (id: string) => void;
  onCreateNew: () => void;
}

const RealEstateListView: React.FC<RealEstateListViewProps> = ({ 
  language, 
  onViewDetails,
  onCreateNew 
}) => {
  const { t } = useTranslation(language);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  
  // Datos vacíos para la demostración
  const data: any[] = [];
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleExport = (format: 'json' | 'csv') => {
    console.log(`Exportando en formato ${format}`);
    // Implementación futura para exportar datos
  };

  const handleImport = () => {
    console.log('Importando datos');
    // Implementación futura para importar datos
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            {t('realEstateManagement')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('createNew')}
            </Button>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Download className="w-4 h-4 mr-2" />
                    {t('export')}
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
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('import')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50 dark:bg-blue-900/50">
                <TableHead className="text-blue-800 dark:text-blue-200">{t('propertyCode')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('address')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('propertyType')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('status')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('registrationDate')}</TableHead>
                <TableHead className="text-blue-800 dark:text-blue-200">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-gray-500 dark:text-gray-400">{t('noDataAvailable')}</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.date}</TableCell>
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
                            {t('view')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {data.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('page')} {currentPage} {t('of')} {totalPages}
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
