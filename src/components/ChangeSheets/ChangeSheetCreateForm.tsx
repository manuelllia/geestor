
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
import { useWorkCenters } from '../../hooks/useWorkCenters';

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
  const { workCenters, isLoading: loadingWorkCenters, error: workCentersError } = useWorkCenters();
  
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
        await updateChangeSheet(editingSheet.id, formData);
        console.log('Hoja de cambio actualizada correctamente');
      } else {
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
              {editingSheet ? 'Editar Hoja de Cambio' : 'Nueva Hoja de Cambio'}
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
                <Label htmlFor="originCenter">Centro de Origen</Label>
                <Select 
                  value={formData.originCenter} 
                  onValueChange={(value) => handleInputChange('originCenter', value)}
                  disabled={loadingWorkCenters}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingWorkCenters ? "Cargando centros..." : "Seleccionar centro de origen"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                    {workCenters.map((center) => (
                      <SelectItem key={center.id} value={center.displayText}>
                        {center.displayText}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {workCentersError && (
                  <p className="text-sm text-red-500">Error al cargar centros de trabajo</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentPosition">Posición Actual</Label>
                <Input
                  id="currentPosition"
                  value={formData.currentPosition}
                  onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                  placeholder="Posición Actual"
                />
              </div>
            </div>

            {/* Supervisor Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentSupervisorName">Nombre Supervisor Actual</Label>
                <Input
                  id="currentSupervisorName"
                  value={formData.currentSupervisorName}
                  onChange={(e) => handleInputChange('currentSupervisorName', e.target.value)}
                  placeholder="Nombre Supervisor Actual"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentSupervisorLastName">Apellidos Supervisor Actual</Label>
                <Input
                  id="currentSupervisorLastName"
                  value={formData.currentSupervisorLastName}
                  onChange={(e) => handleInputChange('currentSupervisorLastName', e.target.value)}
                  placeholder="Apellidos Supervisor Actual"
                />
              </div>
            </div>

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
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="changeType">Tipo de Cambio</Label>
              <Select value={formData.changeType} onValueChange={(value) => handleInputChange('changeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de cambio" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                  <SelectItem value="permanent">Permanente</SelectItem>
                  <SelectItem value="temporary">Temporal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Necesidades de Formación</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentCompany">Empresa Actual</Label>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                  placeholder="Empresa Actual"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyChange">¿Cambio de Empresa?</Label>
                <Select value={formData.companyChange} onValueChange={(value) => handleInputChange('companyChange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar opción" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                    <SelectItem value="yes">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Observaciones adicionales"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{editingSheet ? 'Actualizando...' : 'Guardando...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{editingSheet ? 'Actualizar Hoja de Cambio' : 'Guardar Hoja de Cambio'}</span>
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
