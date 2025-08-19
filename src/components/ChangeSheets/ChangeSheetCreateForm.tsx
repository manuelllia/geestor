
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { saveChangeSheet, ChangeSheetData } from '../../services/changeSheetService';
import { updateChangeSheet, ChangeSheetRecord } from '../../services/changeSheetsService';

interface ChangeSheetCreateFormProps {
  language: Language;
  editingSheet?: ChangeSheetRecord | null;
  onBack: () => void;
  onSave: () => void;
}

const ChangeSheetCreateForm: React.FC<ChangeSheetCreateFormProps> = ({
  language,
  editingSheet,
  onBack,
  onSave
}) => {
  const { t } = useTranslation(language);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ChangeSheetData>({
    employeeName: '',
    employeeLastName: '',
    originCenter: '',
    currentPosition: '',
    currentSupervisorName: '',
    currentSupervisorLastName: '',
    newPosition: '',
    newSupervisorName: '',
    newSupervisorLastName: '',
    startDate: undefined,
    changeType: '',
    needs: [],
    currentCompany: '',
    companyChange: '',
    observations: ''
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingSheet) {
      setFormData({
        employeeName: editingSheet.employeeName,
        employeeLastName: editingSheet.employeeLastName,
        originCenter: editingSheet.originCenter,
        currentPosition: editingSheet.currentPosition,
        currentSupervisorName: editingSheet.currentSupervisorName,
        currentSupervisorLastName: editingSheet.currentSupervisorLastName,
        newPosition: editingSheet.newPosition,
        newSupervisorName: editingSheet.newSupervisorName,
        newSupervisorLastName: editingSheet.newSupervisorLastName,
        startDate: editingSheet.startDate,
        changeType: editingSheet.changeType,
        needs: editingSheet.needs,
        currentCompany: editingSheet.currentCompany,
        companyChange: editingSheet.companyChange,
        observations: editingSheet.observations
      });
    }
  }, [editingSheet]);

  const handleInputChange = (field: keyof ChangeSheetData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNeedsChange = (need: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      needs: checked 
        ? [...prev.needs, need]
        : prev.needs.filter(n => n !== need)
    }));
  };

  const availableNeeds = [
    'Capacitación técnica',
    'Formación en nuevas tecnologías',
    'Desarrollo de habilidades de liderazgo',
    'Mejora en comunicación',
    'Conocimiento del producto',
    'Habilidades de gestión',
    'Actualización en normativas',
    'Idiomas'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeName || !formData.employeeLastName || !formData.newPosition) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      if (editingSheet) {
        // Actualizar registro existente
        await updateChangeSheet(editingSheet.id, formData);
        console.log('Hoja de cambio actualizada correctamente');
      } else {
        // Crear nuevo registro
        await saveChangeSheet(formData);
        console.log('Nueva hoja de cambio creada correctamente');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving change sheet:', error);
      alert(editingSheet ? 'Error al actualizar la hoja de cambio' : 'Error al guardar la hoja de cambio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {editingSheet ? 'Editar Hoja de Cambio' : t('newChangeSheet')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Empleado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeName">{t('employeeName')} *</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  placeholder={t('employeeName')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeLastName">{t('employeeLastName')} *</Label>
                <Input
                  id="employeeLastName"
                  value={formData.employeeLastName}
                  onChange={(e) => handleInputChange('employeeLastName', e.target.value)}
                  placeholder={t('employeeLastName')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="originCenter">{t('originCenter')}</Label>
                <Input
                  id="originCenter"
                  value={formData.originCenter}
                  onChange={(e) => handleInputChange('originCenter', e.target.value)}
                  placeholder={t('originCenter')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentPosition">{t('currentPosition')}</Label>
                <Input
                  id="currentPosition"
                  value={formData.currentPosition}
                  onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                  placeholder={t('currentPosition')}
                />
              </div>
            </div>

            {/* Supervisor Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentSupervisorName">{t('currentSupervisorName')}</Label>
                <Input
                  id="currentSupervisorName"
                  value={formData.currentSupervisorName}
                  onChange={(e) => handleInputChange('currentSupervisorName', e.target.value)}
                  placeholder={t('currentSupervisorName')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentSupervisorLastName">{t('currentSupervisorLastName')}</Label>
                <Input
                  id="currentSupervisorLastName"
                  value={formData.currentSupervisorLastName}
                  onChange={(e) => handleInputChange('currentSupervisorLastName', e.target.value)}
                  placeholder={t('currentSupervisorLastName')}
                />
              </div>
            </div>

            {/* Nueva Posición */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPosition">{t('newPosition')} *</Label>
                <Input
                  id="newPosition"
                  value={formData.newPosition}
                  onChange={(e) => handleInputChange('newPosition', e.target.value)}
                  placeholder={t('newPosition')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Nuevo Supervisor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newSupervisorName">{t('newSupervisorName')}</Label>
                <Input
                  id="newSupervisorName"
                  value={formData.newSupervisorName}
                  onChange={(e) => handleInputChange('newSupervisorName', e.target.value)}
                  placeholder={t('newSupervisorName')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newSupervisorLastName">{t('newSupervisorLastName')}</Label>
                <Input
                  id="newSupervisorLastName"
                  value={formData.newSupervisorLastName}
                  onChange={(e) => handleInputChange('newSupervisorLastName', e.target.value)}
                  placeholder={t('newSupervisorLastName')}
                />
              </div>
            </div>

            {/* Tipo de Cambio */}
            <div className="space-y-2">
              <Label htmlFor="changeType">{t('changeType')}</Label>
              <Select value={formData.changeType} onValueChange={(value) => handleInputChange('changeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectChangeType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">{t('permanent')}</SelectItem>
                  <SelectItem value="temporary">{t('temporary')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Necesidades */}
            <div className="space-y-4">
              <Label>{t('needs')}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableNeeds.map((need) => (
                  <div key={need} className="flex items-center space-x-2">
                    <Checkbox
                      id={need}
                      checked={formData.needs.includes(need)}
                      onCheckedChange={(checked) => handleNeedsChange(need, checked as boolean)}
                    />
                    <Label htmlFor={need} className="text-sm">{need}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de la Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentCompany">{t('currentCompany')}</Label>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                  placeholder={t('currentCompany')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyChange">{t('companyChange')}</Label>
                <Select value={formData.companyChange} onValueChange={(value) => handleInputChange('companyChange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t('yes')}</SelectItem>
                    <SelectItem value="no">{t('no')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observations">{t('observations')}</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder={t('observations')}
                rows={4}
              />
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{editingSheet ? 'Actualizando...' : t('saving')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{editingSheet ? 'Actualizar Hoja de Cambio' : t('saveChangeSheet')}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeSheetCreateForm;
