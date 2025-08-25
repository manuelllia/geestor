
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Building2, RefreshCw, ArrowLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import RealEstateDetailModal from './RealEstateDetailModal';

interface RealEstateTableManagerProps {
  onBack: () => void;
}

const RealEstateTableManager: React.FC<RealEstateTableManagerProps> = ({ onBack }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const properties: any[] = [];
      
      // Obtener datos de pisos activos
      const activePisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "PISOS ACTIVOS");
      const activePisosSnapshot = await getDocs(activePisosRef);
      
      activePisosSnapshot.forEach((doc) => {
        properties.push({
          id: doc.id,
          ...doc.data(),
          status: 'Activo',
          source: 'PISOS ACTIVOS'
        });
      });

      // Obtener datos de pisos de baja
      const bajaPisosRef = collection(db, "Gestión de Talento", "Gestión Inmuebles", "BAJA PISOS");
      const bajaPisosSnapshot = await getDocs(bajaPisosRef);
      
      bajaPisosSnapshot.forEach((doc) => {
        properties.push({
          id: doc.id,
          ...doc.data(),
          status: 'Inactivo',
          source: 'BAJA PISOS'
        });
      });
      
      setProperties(properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  };

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  return (
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

      <Card className="border-blue-200 dark:border-blue-800">
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
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="overflow-x-auto">
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
                        {property.nombre || property.description || 'Sin nombre'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="truncate max-w-[80px]">
                        {property.tipo || property.type || 'No especificado'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                      <div className="truncate max-w-[80px]">
                        {property.ciudad || property.city || 'No especificado'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      <div className="truncate max-w-[80px]">
                        {property.provincia || property.province || 'No especificado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={property.status === 'Activo' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {property.status || 'No especificado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                      <div className="truncate max-w-[100px]">
                        {property.precio || property.price 
                          ? `${(property.precio || property.price).toLocaleString('es-ES')} €`
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
};

export default RealEstateTableManager;
