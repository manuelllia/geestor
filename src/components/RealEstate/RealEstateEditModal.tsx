
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyData, updatePropertyRecord } from '../../services/realEstateService';
import { toast } from 'sonner';

interface RealEstateEditModalProps {
  property: PropertyData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: PropertyData) => void;
}

const RealEstateEditModal: React.FC<RealEstateEditModalProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<PropertyData>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({ ...property });
    }
  }, [property]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!property || !formData.source) return;

    try {
      setSaving(true);
      
      // Actualizar en Firebase
      await updatePropertyRecord(property.id, formData, formData.source);
      
      // Llamar al callback con los datos actualizados
      onSave(formData);
      
      toast.success('Propiedad actualizada correctamente');
      onClose();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error al actualizar la propiedad');
    } finally {
      setSaving(false);
    }
  };

  const formatFieldName = (field: string): string => {
    const fieldMap: { [key: string]: string } = {
      'CCAA DESTINO': 'Comunidad Autónoma',
      'CENTRO TRABAJO': 'Centro de Trabajo',
      'COD. META 4': 'Código Meta 4',
      'CODIGO CENTRO TRABAJO': 'Código Centro',
      'CONTRATO PROYECTO': 'Contrato Proyecto',
      'COSTE ANUAL': 'Coste Anual',
      'DIRECCIÓN': 'Dirección',
      'DNI': 'DNI',
      'EMPRESA GEE': 'Empresa GEE',
      'ESTADO': 'Estado',
      'FECHA DE OCUPACIÓN': 'Fecha de Ocupación',
      'FECHA INICIO CONTRATO': 'Fecha Inicio Contrato',
      'HABIT': 'Habitaciones',
      'ID': 'ID',
      'NOMBRE TRABAJADORES': 'Nombre Trabajadores',
      'PROVINCIA': 'Provincia',
      'PROVINCIA DE ORIGEN': 'Provincia de Origen'
    };
    return fieldMap[field] || field;
  };

  const renderField = (field: string, value: any) => {
    // Omitir campos de sistema
    if (['id', 'createdAt', 'updatedAt', 'originalSheet', 'status', 'source'].includes(field)) {
      return null;
    }

    const fieldName = formatFieldName(field);
    const fieldValue = value || '';

    // Campos numéricos
    if (['COSTE ANUAL', 'HABIT', 'ID', 'CODIGO CENTRO TRABAJO', 'CONTRATO PROYECTO', 'FECHA DE OCUPACIÓN', 'FECHA INICIO CONTRATO'].includes(field)) {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="text-sm font-medium">
            {fieldName}
          </Label>
          <Input
            id={field}
            type="number"
            value={fieldValue}
            onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
            className="border-blue-200 focus:border-blue-500"
          />
        </div>
      );
    }

    // Campo de estado con select
    if (field === 'ESTADO') {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="text-sm font-medium">
            {fieldName}
          </Label>
          <Select value={fieldValue} onValueChange={(value) => handleInputChange(field, value)}>
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ocupado">Ocupado</SelectItem>
              <SelectItem value="Libre">Libre</SelectItem>
              <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Campos de texto
    return (
      <div key={field} className="space-y-2">
        <Label htmlFor={field} className="text-sm font-medium">
          {fieldName}
        </Label>
        <Input
          id={field}
          type="text"
          value={fieldValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="border-blue-200 focus:border-blue-500"
        />
      </div>
    );
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Editar Propiedad
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {Object.entries(formData).map(([field, value]) => renderField(field, value))}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RealEstateEditModal;
