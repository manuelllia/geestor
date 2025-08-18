
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Calendar, Clock, Building2, Check, X } from 'lucide-react';

interface AcceptCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hospitalName: string) => void;
  totalEvents: number;
  totalHours: number;
}

const AcceptCalendarModal: React.FC<AcceptCalendarModalProps> = ({
  isOpen,
  onClose,
  onSave,
  totalEvents,
  totalHours
}) => {
  const [hospitalName, setHospitalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hospitalName.trim()) {
      alert('Por favor, introduce el nombre del hospital o centro');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular procesamiento
      onSave(hospitalName.trim());
      setHospitalName('');
    } catch (error) {
      console.error('Error al guardar calendario:', error);
      alert('Error al procesar el calendario');
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="h-5 w-5" />
            Aceptar Calendario de Mantenimiento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {totalEvents}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Eventos totales
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {totalHours}h
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Horas anuales
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hospital-name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nombre del Hospital o Centro
              </Label>
              <Input
                id="hospital-name"
                type="text"
                placeholder="Ej: Hospital Universitario La Paz"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Este nombre identificará el calendario de mantenimiento
              </p>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !hospitalName.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Aceptar Calendario
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptCalendarModal;
