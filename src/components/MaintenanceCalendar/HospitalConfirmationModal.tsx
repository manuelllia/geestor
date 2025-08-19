
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building2, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface HospitalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hospitalName: string) => void;
  totalEvents: number;
  totalHours: number;
}

const HospitalConfirmationModal: React.FC<HospitalConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalEvents,
  totalHours
}) => {
  const [hospitalName, setHospitalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hospitalName.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onConfirm(hospitalName.trim());
      setHospitalName('');
    } catch (error) {
      console.error('Error al confirmar calendario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHospitalName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <CheckCircle className="h-5 w-5" />
            Confirmar Calendario de Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Introduce el nombre del hospital o centro sanitario para el que se generará este calendario de mantenimiento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resumen del calendario */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Resumen del Calendario
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Total eventos:</span>
                <span className="font-semibold">{totalEvents}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600 dark:text-gray-300">Total horas:</span>
                <span className="font-semibold">{totalHours}h</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Promedio mensual:</span>
                <span className="font-semibold">{Math.round(totalHours / 12)}h</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Período:</span>
                <span className="font-semibold">12 meses</span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hospital-name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nombre del Hospital/Centro Sanitario
              </Label>
              <Input
                id="hospital-name"
                type="text"
                placeholder="Ej: Hospital Universitario La Paz"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Advertencia */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-semibold mb-1">Importante:</p>
                  <p>Una vez confirmado, este calendario se guardará y podrá ser utilizado para la planificación del mantenimiento. Asegúrate de que la distribución de eventos sea correcta antes de confirmar.</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={!hospitalName.trim() || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Calendario
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HospitalConfirmationModal;
