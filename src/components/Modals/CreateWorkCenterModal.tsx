
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { checkWorkCenterExists, createWorkCenter, updateWorkCenter, WorkCenterData } from '../../services/workCentersManagementService';

import { useTranslation } from '../../hooks/useTranslation';
import { Language, Translations } from '../../utils/translations';

interface CreateWorkCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  language: Language;
}

const CreateWorkCenterModal: React.FC<CreateWorkCenterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const { t } = useTranslation(language);
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
        title: t('error'),
        description: t('requiredFieldsError'),
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
          title: t('success'),
          description: t('workCenterCreatedSuccess')
        });
        handleClose();
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorCreatingWorkCenter'),
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
        title: t('success'),
        description: t('workCenterUpdatedSuccess')
      });
      handleClose();
      onSuccess?.();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorUpdatingWorkCenter'),
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
              {t('createWorkCenterTitle')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="text-gray-700 dark:text-gray-300">
                {t('workCenterNameLabel')}
              </Label>
              <Input
                id="nombre"
                value={formData.Nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, Nombre: e.target.value }))}
                placeholder={t('workCenterNamePlaceholder')}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="id" className="text-gray-700 dark:text-gray-300">
                {t('workCenterIdLabel')}
              </Label>
              <Input
                id="id"
                value={formData.Id}
                onChange={(e) => setFormData(prev => ({ ...prev, Id: e.target.value }))}
                placeholder={t('workCenterIdPlaceholder')}
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
              {t('clearButton')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? t('processing') : t('uploadCenterButton')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmCreationTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmCreationDescription').replace('{name}', formData.Nombre).replace('{id}', formData.Id)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {t('confirmButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showExistsDialog} onOpenChange={setShowExistsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('workCenterExistsTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('workCenterExistsDescription').replace('{id}', formData.Id)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExistsDialog(false)}>
              {t('leaveAsIsButton')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateExisting}>
              {t('updateRecordButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateWorkCenterModal;
