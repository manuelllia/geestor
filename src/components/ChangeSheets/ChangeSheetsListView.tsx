
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import ChangeSheetCreateForm from './ChangeSheetCreateForm';
import ImportChangeSheetsModal from './ImportChangeSheetsModal';

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Datos vacíos - eliminando simulaciones
  const mockData: any[] = [];

  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, mockData.length);
  const currentData = mockData.slice(startIndex, endIndex);

  const handleDuplicate = (id: string) => {
    console.log('Duplicar registro:', id);
  };

  const handleDownloadPDF = (id: string) => {
    console.log('Descargar PDF:', id);
  };

  const handleExport = () => {
    console.log('Exportar datos');
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

  if (showCreateForm) {
    return (
      <ChangeSheetCreateForm 
        language={language} 
        onBack={() => setShowCreateForm(false)} 
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
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('createNew')}
          </Button>
          
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
          {mockData.length === 0 ? (
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
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('employeeName')}</TableHead>
                      <TableHead>{t('originCenter')}</TableHead>
                      <TableHead>{t('destinationCenter')}</TableHead>
                      <TableHead>{t('startDate')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead className="text-center">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell className="font-medium">
                          {sheet.employeeName}
                        </TableCell>
                        <TableCell>{sheet.originCenter}</TableCell>
                        <TableCell>{sheet.destinationCenter}</TableCell>
                        <TableCell>{formatDate(sheet.startDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(sheet.status)}>
                            {sheet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetails(sheet.id)}
                              title={t('view')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(sheet.id)}
                              title={t('duplicateRecord')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(sheet.id)}
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

              {/* Paginación - solo mostrar si hay datos */}
              {mockData.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('showingRecords', {
                      start: startIndex + 1,
                      end: endIndex,
                      total: mockData.length
                    })}
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

      {/* Modal de importación */}
      <ImportChangeSheetsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        language={language}
      />
    </div>
  );
};

export default ChangeSheetsListView;
