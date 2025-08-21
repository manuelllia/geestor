
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { checkWorkCenterExists, createWorkCenter, updateWorkCenter, WorkCenterData } from '../../services/workCentersManagementService';

interface CreateWorkCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateWorkCenterModal: React.FC<CreateWorkCenterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<WorkCenterData>({
    Nombre: '',
    Id: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showExistsDialog, setShowExistsDialog] = useState(false);
  const { toast } = useToast();

  const handleClear = () => {
    setFormData({ Nombre: '', Id: '' });
  };

  const handleSubmit = async () => {
    if (!formData.Nombre.trim() || !formData.Id.trim()) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);

    try {
      const exists = await checkWorkCenterExists(formData.Id);
      
      if (exists) {
        setShowExistsDialog(true);
      } else {
        await createWorkCenter(formData);
        toast({
          title: "Éxito",
          description: "Centro de trabajo creado correctamente"
        });
        handleClose();
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el centro de trabajo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExisting = async () => {
    setShowExistsDialog(false);
    setIsLoading(true);

    try {
      await updateWorkCenter(formData);
      toast({
        title: "Éxito",
        description: "Centro de trabajo actualizado correctamente"
      });
      handleClose();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el centro de trabajo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ Nombre: '', Id: '' });
    setShowConfirmDialog(false);
    setShowExistsDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900 dark:text-blue-100">
              Crear Centro de Trabajo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="text-gray-700 dark:text-gray-300">
                Nombre del Centro
              </Label>
              <Input
                id="nombre"
                value={formData.Nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, Nombre: e.target.value }))}
                placeholder="Ingrese el nombre del centro"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="id" className="text-gray-700 dark:text-gray-300">
                ID del Centro
              </Label>
              <Input
                id="id"
                value={formData.Id}
                onChange={(e) => setFormData(prev => ({ ...prev, Id: e.target.value }))}
                placeholder="Ingrese el ID del centro"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
            >
              Limpiar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Procesando...' : 'Subir Centro'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Creación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea crear el centro de trabajo "{formData.Nombre}" con ID "{formData.Id}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showExistsDialog} onOpenChange={setShowExistsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Centro de Trabajo Existente</AlertDialogTitle>
            <AlertDialogDescription>
              Ya existe un centro de trabajo con el ID "{formData.Id}". ¿Qué desea hacer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExistsDialog(false)}>
              Dejarlo como está
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateExisting}>
              Actualizar registro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateWorkCenterModal;
