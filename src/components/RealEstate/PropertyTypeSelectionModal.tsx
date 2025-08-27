
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface PropertyTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (propertyType: 'active' | 'inactive') => void;
}

const PropertyTypeSelectionModal: React.FC<PropertyTypeSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedType, setSelectedType] = useState<'active' | 'inactive' | ''>('');

  const handleConfirm = () => {
    if (selectedType) {
      onConfirm(selectedType);
      onClose();
      setSelectedType('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedType('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Seleccionar Tipo de Inmueble
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="property-type">Tipo de Inmueble</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as 'active' | 'inactive')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Inmueble Activo</SelectItem>
                <SelectItem value="inactive">Inmueble dado de baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedType}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyTypeSelectionModal;
