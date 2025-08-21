
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Gestión de Inmuebles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los inmuebles de la empresa
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Gestión de Inmuebles
            </span>
            <Badge variant="secondary">
              {properties.length} inmuebles
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre/Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Provincia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property, index) => (
                  <TableRow key={property.id || index}>
                    <TableCell className="font-medium">
                      {property.nombre || property.description || 'Sin nombre'}
                    </TableCell>
                    <TableCell>{property.tipo || property.type || 'No especificado'}</TableCell>
                    <TableCell>{property.ciudad || property.city || 'No especificado'}</TableCell>
                    <TableCell>{property.provincia || property.province || 'No especificado'}</TableCell>
                    <TableCell>
                      <Badge variant={property.status === 'Activo' ? 'default' : 'secondary'}>
                        {property.status || 'No especificado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {property.precio || property.price 
                        ? `${(property.precio || property.price).toLocaleString('es-ES')} €`
                        : 'No especificado'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                          <DropdownMenuItem onClick={() => handleViewProperty(property)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
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
