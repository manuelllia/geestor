
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Building2, RefreshCw, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getRealEstateProperties, deletePropertyRecord, PropertyData } from '../../services/realEstateService';
import RealEstateDetailModal from './RealEstateDetailModal';
import RealEstateEditModal from './RealEstateEditModal';
import { toast } from 'sonner';

interface RealEstateTableManagerProps {
  onBack: () => void;
}

const RealEstateTableManager: React.FC<RealEstateTableManagerProps> = ({ onBack }) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const propertiesData = await getRealEstateProperties();
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Error al cargar las propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  };

  const handleViewProperty = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleEditProperty = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleSaveProperty = (updatedProperty: PropertyData) => {
    setProperties(prev => prev.map(prop => 
      prop.id === updatedProperty.id ? updatedProperty : prop
    ));
  };

  const handleDeleteProperty = async (property: PropertyData) => {
    if (!property.source || !property.id) return;

    try {
      setDeletingId(property.id);
      await deletePropertyRecord(property.id, property.source);
      
      // Remover de la lista local
      setProperties(prev => prev.filter(prop => prop.id !== property.id));
      
      toast.success('Propiedad eliminada correctamente');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error al eliminar la propiedad');
    } finally {
      setDeletingId(null);
    }
  };

  const getPropertyName = (property: PropertyData): string => {
    return property['CENTRO TRABAJO'] || 
           property['DIRECCIÓN'] || 
           property['NOMBRE TRABAJADORES'] || 
           `Propiedad ${property.ID || property.id || 'Sin ID'}`;
  };

  const getPropertyType = (property: PropertyData): string => {
    return property['EMPRESA GEE'] || 'No especificado';
  };

  const getPropertyCity = (property: PropertyData): string => {
    // Intentar extraer la ciudad de la dirección
    const direccion = property['DIRECCIÓN'] || '';
    const parts = direccion.split('-');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    return 'No especificado';
  };

  const getPropertyProvince = (property: PropertyData): string => {
    return property['PROVINCIA'] || 'No especificado';
  };

  const getPropertyPrice = (property: PropertyData): number => {
    return property['COSTE ANUAL'] || 0;
  };

  if (loading) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 mb-2 sm:mb-3"
              size="sm"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Volver</span>
            </Button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              Gestión de Inmuebles
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Administra los inmuebles de la empresa
            </p>
          </div>
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
        </div>

        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Gestión de Inmuebles
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {properties.length} inmuebles
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Nombre/Descripción</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">Tipo</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px] hidden sm:table-cell">Ciudad</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px] hidden lg:table-cell">Provincia</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[70px]">Estado</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px] hidden sm:table-cell">Precio</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property, index) => (
                      <TableRow key={property.id || index}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[120px] sm:max-w-[200px]">
                            {getPropertyName(property)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="truncate max-w-[80px]">
                            {getPropertyType(property)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[80px]">
                            {getPropertyCity(property)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <div className="truncate max-w-[80px]">
                            {getPropertyProvince(property)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={property.status === 'Activo' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {property['ESTADO'] || property.status || 'No especificado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[100px]">
                            {getPropertyPrice(property) > 0
                              ? `${getPropertyPrice(property).toLocaleString('es-ES')} €`
                              : 'No especificado'
                            }
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
                              <DropdownMenuItem onClick={() => handleViewProperty(property)} className="cursor-pointer text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProperty(property)} className="cursor-pointer text-xs sm:text-sm">
                                <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Editar
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer text-xs sm:text-sm text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se eliminará permanentemente la propiedad de la base de datos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteProperty(property)}
                                      disabled={deletingId === property.id}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {deletingId === property.id ? 'Eliminando...' : 'Eliminar'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

        {/* Modal de detalles */}
        {selectedProperty && (
          <RealEstateDetailModal
            property={selectedProperty}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedProperty(null);
            }}
          />
        )}

        {/* Modal de edición */}
        {selectedProperty && (
          <RealEstateEditModal
            property={selectedProperty}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProperty(null);
            }}
            onSave={handleSaveProperty}
          />
        )}
      </div>
    </div>
  );
};

export default RealEstateTableManager;
