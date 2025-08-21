
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, Euro, Home, Calendar, FileText } from 'lucide-react';
import { useEnhancedPDFExport } from '../../hooks/useEnhancedPDFExport';

interface RealEstateProperty {
  [key: string]: any;
}

interface RealEstateDetailModalProps {
  property: RealEstateProperty;
  isOpen: boolean;
  onClose: () => void;
}

const RealEstateDetailModal: React.FC<RealEstateDetailModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { exportToPDF } = useEnhancedPDFExport();

  const handleExportToPDF = () => {
    const sections = [
      {
        title: 'Información General',
        fields: [
          { label: 'Nombre/Descripción', value: property.nombre || property.description, type: 'text' as const },
          { label: 'Tipo de Inmueble', value: property.tipo || property.type, type: 'text' as const },
          { label: 'Estado', value: property.estado || property.status, type: 'text' as const },
        ]
      },
      {
        title: 'Ubicación',
        fields: [
          { label: 'Dirección', value: property.direccion || property.address, type: 'text' as const },
          { label: 'Ciudad', value: property.ciudad || property.city, type: 'text' as const },
          { label: 'Provincia', value: property.provincia || property.province, type: 'text' as const },
          { label: 'Código Postal', value: property.codigoPostal || property.postalCode, type: 'text' as const },
        ]
      },
      {
        title: 'Información Económica',
        fields: [
          { label: 'Precio', value: property.precio || property.price, type: 'number' as const },
          { label: 'Valor Catastral', value: property.valorCatastral || property.cadastralValue, type: 'number' as const },
          { label: 'Gastos Anuales', value: property.gastosAnuales || property.annualExpenses, type: 'number' as const },
        ]
      },
      {
        title: 'Características',
        fields: [
          { label: 'Superficie', value: property.superficie || property.area, type: 'text' as const },
          { label: 'Habitaciones', value: property.habitaciones || property.rooms, type: 'number' as const },
          { label: 'Baños', value: property.banos || property.bathrooms, type: 'number' as const },
          { label: 'Año de Construcción', value: property.anoConstruction || property.constructionYear, type: 'text' as const },
        ]
      }
    ];

    exportToPDF({
      title: `Detalle de Inmueble - ${property.nombre || property.description || 'Sin nombre'}`,
      data: property,
      sections
    });
  };

  const renderFieldValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">No especificado</span>;
    }
    if (typeof value === 'boolean') {
      return <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? 'Sí' : 'No'}</span>;
    }
    if (typeof value === 'number') {
      return <span className="font-medium">{value.toLocaleString('es-ES')}</span>;
    }
    return <span className="font-medium">{value.toString()}</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Building2 className="w-5 h-5" />
            Detalle del Inmueble
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información General */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Información General
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre/Descripción
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.nombre || property.description)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de Inmueble
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.tipo || property.type)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.estado || property.status)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ubicación */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Ubicación
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.direccion || property.address)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ciudad
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.ciudad || property.city)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Provincia
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.provincia || property.province)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Código Postal
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.codigoPostal || property.postalCode)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Económica */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Euro className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Información Económica
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Precio
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.precio || property.price)}
                  {(property.precio || property.price) && ' €'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor Catastral
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.valorCatastral || property.cadastralValue)}
                  {(property.valorCatastral || property.cadastralValue) && ' €'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gastos Anuales
                </Label>
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {renderFieldValue(property.gastosAnuales || property.annualExpenses)}
                  {(property.gastosAnuales || property.annualExpenses) && ' €'}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Características */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Características
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(property).map(([key, value]) => {
                // Excluir los campos ya mostrados en otras secciones
                const excludedFields = [
                  'nombre', 'description', 'tipo', 'type', 'estado', 'status',
                  'direccion', 'address', 'ciudad', 'city', 'provincia', 'province', 
                  'codigoPostal', 'postalCode', 'precio', 'price', 'valorCatastral', 
                  'cadastralValue', 'gastosAnuales', 'annualExpenses'
                ];
                
                if (excludedFields.includes(key)) return null;
                
                return (
                  <div key={key}>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {renderFieldValue(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleExportToPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RealEstateDetailModal;
