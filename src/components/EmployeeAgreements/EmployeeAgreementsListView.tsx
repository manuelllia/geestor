
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, Download, Plus, Upload, FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import ImportEmployeeAgreementsModal from './ImportEmployeeAgreementsModal';

interface EmployeeAgreementsListViewProps {
  language: Language;
  onViewDetails: (agreementId: string) => void;
  onCreateNew: () => void;
}

const EmployeeAgreementsListView: React.FC<EmployeeAgreementsListViewProps> = ({ 
  language, 
  onViewDetails,
  onCreateNew
}) => {
  const { t } = useTranslation(language);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Datos vacíos - se cargarán desde Firebase cuando se implemente
  const mockData: any[] = [];

  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, mockData.length);
  const currentData = mockData.slice(startIndex, endIndex);

  const handleDuplicate = (id: string) => {
    console.log('Duplicar acuerdo:', id);
  };

  const handleDownloadPDF = (id: string) => {
    console.log('Descargar PDF:', id);
  };

  const handleExport = () => {
    console.log('Exportar datos');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Activo': 'bg-green-100 text-green-800 border-green-300',
      'Vencido': 'bg-red-100 text-red-800 border-red-300',
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Acuerdos con Empleados
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onCreateNew}
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

      {/* Tabla de acuerdos */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Acuerdos con Empleados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockData.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay acuerdos con empleados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza creando un nuevo acuerdo o importa datos desde un archivo.
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={onCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Tipo de Acuerdo</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Aquí se mostrarán los datos cuando se carguen desde Firebase */}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de importación */}
      <ImportEmployeeAgreementsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        language={language}
      />
    </div>
  );
};

export default EmployeeAgreementsListView;
