import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface InactivePropertyFormProps {
  onBack: () => void;
  onSave: () => void;
  language?: Language; // Make language prop optional
}

const InactivePropertyForm: React.FC<InactivePropertyFormProps> = ({ 
  onBack, 
  onSave, 
  language = 'es' // Default to Spanish if not provided
}) => {
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    id: '',
    address: '',
    city: '',
    province: '',
    ccaa: '',
    numRooms: '',
    annualCost: '',
    reason: '',
    inactiveDate: '',
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Guardando propiedad inactiva:', formData);
    onSave();
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        {/* Header responsive */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm w-fit"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{t('back')}</span>
          </Button>
          
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-fit sm:w-auto"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{t('saveProperty')}</span>
          </Button>
        </div>

        {/* Form content */}
        <Card className="border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl text-blue-800 dark:text-blue-200">
              {t('inactiveProperty')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* ID */}
              <div className="space-y-2">
                <Label htmlFor="id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('idLabel')}
                </Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Número de Habitaciones */}
              <div className="space-y-2">
                <Label htmlFor="numRooms" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('numRoomsLabel')}
                </Label>
                <Input
                  id="numRooms"
                  type="number"
                  value={formData.numRooms}
                  onChange={(e) => handleInputChange('numRooms', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('addressLabel')}
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t('addressPlaceholder')}
                  className="w-full"
                />
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('cityLabel')}
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Provincia */}
              <div className="space-y-2">
                <Label htmlFor="province" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('provinceLabel')}
                </Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* CCAA */}
              <div className="space-y-2">
                <Label htmlFor="ccaa" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('ccaaLabel')}
                </Label>
                <Input
                  id="ccaa"
                  value={formData.ccaa}
                  onChange={(e) => handleInputChange('ccaa', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Coste Anual */}
              <div className="space-y-2">
                <Label htmlFor="annualCost" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('annualCostLabel')}
                </Label>
                <Input
                  id="annualCost"
                  type="number"
                  value={formData.annualCost}
                  onChange={(e) => handleInputChange('annualCost', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Motivo de Inactividad */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('reason')}
                </Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Fecha de Inactividad */}
              <div className="space-y-2">
                <Label htmlFor="inactiveDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('date')}
                </Label>
                <Input
                  id="inactiveDate"
                  type="date"
                  value={formData.inactiveDate}
                  onChange={(e) => handleInputChange('inactiveDate', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Observaciones */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observations" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('observations')}
                </Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  className="w-full min-h-[100px]"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InactivePropertyForm;
