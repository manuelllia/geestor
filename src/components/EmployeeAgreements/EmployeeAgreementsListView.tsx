
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Search, Plus, Eye, Edit, Trash2, Download, Upload, MoreVertical, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { getEmployeeAgreements, deleteEmployeeAgreement, duplicateEmployeeAgreement, EmployeeAgreementRecord } from '../../services/employeeAgreementsService';
import { useToast } from '../../hooks/use-toast';
import ImportEmployeeAgreementsModal from './ImportEmployeeAgreementsModal';
import EmployeeAgreementDetailView from './EmployeeAgreementDetailView';
import EmployeeAgreementCreateForm from './EmployeeAgreementCreateForm';
import EmployeeAgreementEditForm from './EmployeeAgreementEditForm';

interface EmployeeAgreementsListViewProps {
  language: Language;
  onViewDetails?: (id: string) => void;
  onCreateNew?: () => void;
}

const EmployeeAgreementsListView: React.FC<EmployeeAgreementsListViewProps> = ({ 
  language,
  onViewDetails,
  onCreateNew 
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  
  const [agreements, setAgreements] = useState<EmployeeAgreementRecord[]>([]);
  const [filteredAgreements, setFilteredAgreements] = useState<EmployeeAgreementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<EmployeeAgreementRecord | null>(null);

  const loadAgreements = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployeeAgreements();
      setAgreements(data);
      setFilteredAgreements(data);
    } catch (error) {
      console.error('Error loading employee agreements:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los acuerdos con empleados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgreements();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAgreements(agreements);
    } else {
      const filtered = agreements.filter(agreement =>
        agreement.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.employeeLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.agreementType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgreements(filtered);
    }
  }, [searchTerm, agreements]);

  const handleViewDetails = (agreementId: string) => {
    setSelectedAgreementId(agreementId);
    setShowDetailView(true);
    if (onViewDetails) {
      onViewDetails(agreementId);
    }
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
    if (onCreateNew) {
      onCreateNew();
    }
  };

  const handleEdit = (agreement: EmployeeAgreementRecord) => {
    setEditingAgreement(agreement);
    setShowEditForm(true);
  };

  const handleDelete = async () => {
    if (!selectedAgreementId) return;
    
    try {
      await deleteEmployeeAgreement(selectedAgreementId);
      toast({
        title: "Éxito",
        description: "Acuerdo eliminado correctamente",
      });
      setShowDeleteModal(false);
      setSelectedAgreementId(null);
      loadAgreements();
    } catch (error) {
      console.error('Error deleting agreement:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el acuerdo",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (agreementId: string) => {
    try {
      await duplicateEmployeeAgreement(agreementId);
      toast({
        title: "Éxito",
        description: "Acuerdo duplicado correctamente",
      });
      loadAgreements();
    } catch (error) {
      console.error('Error duplicating agreement:', error);
      toast({
        title: "Error",
        description: "No se pudo duplicar el acuerdo",
        variant: "destructive",
      });
    }
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    loadAgreements();
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingAgreement(null);
    loadAgreements();
  };

  const handleBack = () => {
    setShowDetailView(false);
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingAgreement(null);
    setSelectedAgreementId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baja':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Aprobado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (showDetailView && selectedAgreementId) {
    return (
      <EmployeeAgreementDetailView
        agreementId={selectedAgreementId}
        language={language}
        onBack={handleBack}
      />
    );
  }

  if (showCreateForm) {
    return (
      <EmployeeAgreementCreateForm
        language={language}
        onBack={handleBack}
        onSave={handleFormSuccess}
      />
    );
  }

  if (showEditForm && editingAgreement) {
    return (
      <EmployeeAgreementEditForm
        agreement={editingAgreement}
        language={language}
        onBack={handleBack}
        onSave={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
            Acuerdos con Empleados
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los acuerdos y convenios con empleados
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm sm:text-base"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Importar
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Crear Nuevo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-blue-800 dark:text-blue-200 text-base sm:text-lg">
            Lista de Acuerdos con Empleados
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {filteredAgreements.length} acuerdos encontrados
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por empleado, tipo de acuerdo o estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs lg:text-sm">Empleado</TableHead>
                  <TableHead className="text-xs lg:text-sm">Tipo de Acuerdo</TableHead>
                  <TableHead className="text-xs lg:text-sm">Prioridad</TableHead>
                  <TableHead className="text-xs lg:text-sm">Estado</TableHead>
                  <TableHead className="text-xs lg:text-sm">Fecha</TableHead>
                  <TableHead className="text-xs lg:text-sm">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-sm text-gray-500">Cargando acuerdos...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredAgreements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-sm text-gray-500">
                        {searchTerm ? 'No se encontraron acuerdos que coincidan con la búsqueda' : 'No hay acuerdos disponibles'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgreements.map((agreement) => (
                    <TableRow key={agreement.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <TableCell className="text-xs lg:text-sm">
                        {agreement.employeeName} {agreement.employeeLastName}
                      </TableCell>
                      <TableCell className="text-xs lg:text-sm">
                        {agreement.agreementType}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(agreement.priority)} text-xs`}>
                          {agreement.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(agreement.status)} text-xs`}>
                          {agreement.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs lg:text-sm">
                        {agreement.agreementDate ? agreement.agreementDate.toLocaleDateString() : 'No especificada'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 lg:h-8 lg:w-8 p-0">
                              <MoreVertical className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewDetails(agreement.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(agreement)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(agreement.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedAgreementId(agreement.id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">Cargando acuerdos...</div>
              </div>
            ) : filteredAgreements.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">
                  {searchTerm ? 'No se encontraron acuerdos que coincidan con la búsqueda' : 'No hay acuerdos disponibles'}
                </div>
              </div>
            ) : (
              filteredAgreements.map((agreement) => (
                <Card key={agreement.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {agreement.employeeName} {agreement.employeeLastName}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {agreement.agreementType}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewDetails(agreement.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(agreement)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(agreement.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedAgreementId(agreement.id);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={`${getPriorityColor(agreement.priority)} text-xs`}>
                        {agreement.priority}
                      </Badge>
                      <Badge className={`${getStatusColor(agreement.status)} text-xs`}>
                        {agreement.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Fecha: {agreement.agreementDate ? agreement.agreementDate.toLocaleDateString() : 'No especificada'}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {filteredAgreements.length > 0 && (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Desliza para ver más opciones
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-sm">
              ¿Estás seguro de que deseas eliminar este acuerdo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="text-sm">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="text-sm">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <ImportEmployeeAgreementsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
        language={language}
      />
    </div>
  );
};

export default EmployeeAgreementsListView;
