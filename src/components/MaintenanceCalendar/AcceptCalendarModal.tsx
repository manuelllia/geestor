
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Check, Building2 } from 'lucide-react';

interface AcceptCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (hospitalName: string) => void;
}

const AcceptCalendarModal: React.FC<AcceptCalendarModalProps> = ({
  isOpen,
  onClose,
  onAccept
}) => {
  const [hospitalName, setHospitalName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hospitalName.trim()) {
      onAccept(hospitalName.trim());
      setHospitalName('');
    }
  };

  const handleClose = () => {
    setHospitalName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Aceptar Calendario de Mantenimiento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospital-name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Nombre del Hospital o Centro
            </Label>
            <Input
              id="hospital-name"
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Ej: Hospital General Universitario"
              className="w-full"
              required
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Introduce el nombre del centro sanitario para el que es este calendario de mantenimiento.
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!hospitalName.trim()}
            >
              <Check className="h-4 w-4 mr-2" />
              Aceptar Calendario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptCalendarModal;
