
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (propertyType: 'active' | 'inactive') => void;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedType, setSelectedType] = useState<'active' | 'inactive' | ''>('');

  const handleValueChange = (value: string) => {
    setSelectedType(value as 'active' | 'inactive' | '');
  };

  const handleConfirm = () => {
    if (selectedType) {
      onConfirm(selectedType as 'active' | 'inactive');
      setSelectedType('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Agregar Inmueble
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Inmueble
            </label>
            <Select value={selectedType} onValueChange={handleValueChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de inmueble" />
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
            className="bg-primary hover:bg-primary/90"
          >
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;
