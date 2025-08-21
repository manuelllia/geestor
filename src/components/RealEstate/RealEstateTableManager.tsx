import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Building2, RefreshCw, ArrowLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import RealEstateDetailModal from './RealEstateDetailModal';

interface RealEstateTableManagerProps {
  language: Language;
  onBack: () => void;
}

const RealEstateTableManager: React.FC<RealEstateTableManagerProps> = ({ language, onBack }) => {
  const { t } = useTranslation(language);
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
      const propertiesRef = collection(db, "RealEstate");
      const querySnapshot = await getDocs(propertiesRef);
      
      const propertiesData: any[] = [];
      querySnapshot.forEach((doc) => {
        propertiesData.push({ id: doc.id, ...doc.data() });
      });
      
      setProperties(propertiesData);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm sm:text-base p-2 sm:p-3"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Volver</span>
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
            Gestión de Inmuebles
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Administra los inmuebles de la empresa
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          disabled={refreshing}
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
          <span className="sm:hidden">Act.</span>
        </Button>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Gestión de Inmuebles</span>
            </span>
            <Badge variant="secondary" className="text-xs self-start sm:self-center">
              {properties.length} inmuebles
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm min-w-[120px]">Nombre</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="text-xs sm:text-sm">Ciudad</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Provincia</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Estado</TableHead>
                  <TableHead className="text-xs sm:text-sm">Precio</TableHead>
                  <TableHead className="w-[40px] sm:w-[50px]">Acc.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property, index) => (
                  <TableRow key={property.id || index}>
                    <TableCell className="font-medium text-xs sm:text-sm max-w-[120px] truncate">
                      {property.nombre || property.description || 'Sin nombre'}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                      {property.tipo || property.type || 'N/E'}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {property.ciudad || property.city || 'N/E'}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                      {property.provincia || property.province || 'N/E'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge 
                        variant={property.estado === 'Activo' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {property.estado || property.status || 'N/E'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <span className="block sm:hidden">
                        {property.precio || property.price 
                          ? `${Math.round((property.precio || property.price) / 1000)}k €`
                          : 'N/E'
                        }
                      </span>
                      <span className="hidden sm:block">
                        {property.precio || property.price 
                          ? `${(property.precio || property.price).toLocaleString('es-ES')} €`
                          : 'No especificado'
                        }
                      </span>
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
