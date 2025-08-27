
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface MissingMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateAnyway: () => void;
  missingCount: number;
  language: Language;
}

const MissingMaintenanceModal: React.FC<MissingMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onGenerateAnyway,
  missingCount,
  language
}) => {
  const { t } = useTranslation(language);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            {t('missingMaintenanceTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
            <p className="text-amber-800 dark:text-amber-200 mb-2">
              {t('missingMaintenanceMessage')}
            </p>
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <span>{missingCount} denominaciones pendientes</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={onGenerateAnyway}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('generateAnyway')}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              {t('completeFirst')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissingMaintenanceModal;
