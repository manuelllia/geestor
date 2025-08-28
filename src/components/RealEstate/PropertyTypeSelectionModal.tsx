import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation'; // Ajusta la ruta
import { Language } from '../../utils/translations'; // Ajusta la ruta

interface PropertyTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (propertyType: 'active' | 'inactive') => void;
  language: Language; // Añade la prop de idioma
}

const PropertyTypeSelectionModal: React.FC<PropertyTypeSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language // Destructura la prop de idioma
}) => {
  const { t } = useTranslation(language); // Inicializa el hook de traducción
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
            {t('selectPropertyType')} {/* Traducido */}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="property-type">{t('propertyTypeLabel')}</Label> {/* Traducido */}
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as 'active' | 'inactive')}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectTypePlaceholder')} /> {/* Traducido */}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('activeProperty')}</SelectItem> {/* Traducido */}
                <SelectItem value="inactive">{t('inactiveProperty')}</SelectItem> {/* Traducido */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('cancel')} {/* Traducido */}
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedType}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {t('accept')} {/* Traducido */}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyTypeSelectionModal;