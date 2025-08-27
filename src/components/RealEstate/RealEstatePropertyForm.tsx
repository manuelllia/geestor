
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { Language } from '../../utils/translations';
import { addRealEstateProperty } from '../../services/realEstateService';
import { toast } from 'sonner';

interface RealEstatePropertyFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

interface PropertyFormData {
  nombre: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  tipo: string;
  estado: string;
  habitaciones: number;
  costeAnual: number;
  descripcion: string;
  empresa: string;
}

const RealEstatePropertyForm: React.FC<RealEstatePropertyFormProps> = ({
  language,
  onBack,
  onSave
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    nombre: '',
    direccion: '',
    provincia: '',
    ciudad: '',
    tipo: 'Residencial',
    estado: 'Activo',
    habitaciones: 1,
    costeAnual: 0,
    descripcion: '',
    empresa: 'GEE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provincias = [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia',
    'Palma de Mallorca', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid',
    'Vigo', 'Gijón', 'Granada', 'Oviedo', 'Santa Cruz de Tenerife', 'Burgos',
    'Santander', 'Castellón', 'Logroño', 'Badajoz', 'Salamanca', 'Huelva',
    'Lleida', 'Tarragona', 'León', 'Cádiz', 'Jaén', 'Ourense', 'Almería',
    'Toledo', 'Cáceres', 'Lugo', 'Pontevedra', 'A Coruña'
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.direccion || !formData.provincia) {
      toast.error('Por favor, completa los campos obligatorios');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const propertyData = {
        'CENTRO TRABAJO': formData.nombre,
        'DIRECCIÓN': formData.direccion,
        'PROVINCIA': formData.provincia,
        'CIUDAD': formData.ciudad,
        'TIPO': formData.tipo,
        'ESTADO': formData.estado,
        'HABITACIONES': formData.habitaciones,
        'COSTE ANUAL': formData.costeAnual,
        'DESCRIPCIÓN': formData.descripcion,
        'EMPRESA GEE': formData.empresa,
        'FECHA CREACIÓN': new Date().toISOString(),
        'ID': `PROP_${Date.now()}`,
        status: formData.estado
      };

      await addRealEstateProperty(propertyData);
      toast.success('Propiedad agregada correctamente');
      onSave();
    } catch (error) {
      console.error('Error al agregar propiedad:', error);
      toast.error('Error al agregar la propiedad');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agregar Nueva Propiedad
          </h1>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
            Información de la Propiedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre/Centro de Trabajo */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium">
                  Nombre/Centro de Trabajo *
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Ej: Oficina Central Madrid"
                  required
                />
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="empresa" className="text-sm font-medium">
                  Empresa
                </Label>
                <Select
                  value={formData.empresa}
                  onValueChange={(value) => handleInputChange('empresa', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GEE">GEE</SelectItem>
                    <SelectItem value="Grupo Empresarial Electromédico">Grupo Empresarial Electromédico</SelectItem>
                    <SelectItem value="Otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dirección */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion" className="text-sm font-medium">
                  Dirección *
                </Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Ej: Calle Mayor 123, 28001 Madrid"
                  required
                />
              </div>

              {/* Provincia */}
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-sm font-medium">
                  Provincia *
                </Label>
                <Select
                  value={formData.provincia}
                  onValueChange={(value) => handleInputChange('provincia', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="ciudad" className="text-sm font-medium">
                  Ciudad
                </Label>
                <Input
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  placeholder="Ej: Madrid"
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium">
                  Tipo de Propiedad
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleInputChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residencial">Residencial</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Oficina">Oficina</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium">
                  Estado
                </Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Habitaciones */}
              <div className="space-y-2">
                <Label htmlFor="habitaciones" className="text-sm font-medium">
                  Número de Habitaciones
                </Label>
                <Input
                  id="habitaciones"
                  type="number"
                  min="1"
                  value={formData.habitaciones}
                  onChange={(e) => handleInputChange('habitaciones', parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Coste Anual */}
              <div className="space-y-2">
                <Label htmlFor="costeAnual" className="text-sm font-medium">
                  Coste Anual (€)
                </Label>
                <Input
                  id="costeAnual"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costeAnual}
                  onChange={(e) => handleInputChange('costeAnual', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Descripción adicional de la propiedad..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Guardando...' : 'Guardar Propiedad'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstatePropertyForm;
