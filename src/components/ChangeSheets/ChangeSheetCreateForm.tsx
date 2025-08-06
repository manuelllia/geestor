
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface ChangeSheetCreateFormProps {
  language: Language;
  onBack: () => void;
}

interface FormData {
  employeeName: string;
  employeeLastName: string;
  originCenter: string;
  currentPosition: string;
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  newPosition: string;
  newSupervisorName: string;
  newSupervisorLastName: string;
  startDate: Date | undefined;
  changeType: 'permanent' | 'temporary' | '';
  needs: string[];
  currentCompany: string;
  companyChange: 'yes' | 'no' | '';
  observations: string;
}

const ChangeSheetCreateForm: React.FC<ChangeSheetCreateFormProps> = ({ 
  language, 
  onBack 
}) => {
  const { t } = useTranslation(language);

  // TODO: Estas opciones vendrán de una base de datos o configuración
  const originCenters = [
    'Seleccionar',
    // Aquí irán los centros de salida que no especificaste
    'Centro Madrid',
    'Centro Barcelona',
    'Centro Valencia'
  ];

  const positions = [
    'Seleccionar',
    'Técnico/a',
    'Responsable de Centro',
    'Especialista (EDE)',
    'Administrativo/a',
    'Otro'
  ];

  const companies = [
    'ASIME SA',
    'IBERMAN SA',
    'MANTELEC SA',
    'INDEL FACILITIES',
    'INSANEX SL',
    'SSM',
    'RD HEALING',
    'AINATEC',
    'OTRA'
  ];

  const needsOptions = [
    { id: 'prl', label: 'Actuación PRL' },
    { id: 'displacement', label: 'Desplazamiento' },
    { id: 'accommodation', label: 'Alojamiento' },
    { id: 'psio', label: 'Psio GEE' },
    { id: 'vehicle', label: 'Vehículo' }
  ];

  const [formData, setFormData] = useState<FormData>({
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNeedChange = (needId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      needs: checked 
        ? [...prev.needs, needId]
        : prev.needs.filter(need => need !== needId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación básica
    const requiredFields = [
      'employeeName', 'employeeLastName', 'originCenter', 'currentPosition',
      'currentSupervisorName', 'currentSupervisorLastName', 'newPosition',
      'newSupervisorName', 'newSupervisorLastName', 'startDate', 'changeType',
      'currentCompany', 'companyChange', 'observations'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      if (field === 'startDate') return !value;
      if (typeof value === 'string') return !value.trim() || value === 'Seleccionar' || value === '';
      return !value;
    });

    if (missingFields.length > 0) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    console.log('Formulario enviado:', formData);
    // Aquí iría la lógica para guardar los datos
  };

  const dateLocale = language === 'es' ? es : enUS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          {t('createNew')} - {t('hojasCambio')}
        </h1>
      </div>

      {/* Formulario */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            {t('changeSheetDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del Empleado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">{t('name')} *</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  placeholder={t('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeLastName">Apellidos *</Label>
                <Input
                  id="employeeLastName"
                  value={formData.employeeLastName}
                  onChange={(e) => handleInputChange('employeeLastName', e.target.value)}
                  placeholder="Apellidos"
                />
              </div>
            </div>

            {/* Centro de Salida */}
            <div className="space-y-2">
              <Label>{t('originCenter')} *</Label>
              <Select value={formData.originCenter} onValueChange={(value) => handleInputChange('originCenter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('select')} ${t('originCenter')}`} />
                </SelectTrigger>
                <SelectContent>
                  {originCenters.map((center) => (
                    <SelectItem key={center} value={center} disabled={center === 'Seleccionar'}>
                      {center}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Puesto Actual */}
            <div className="space-y-2">
              <Label>Puesto Actual *</Label>
              <Select value={formData.currentPosition} onValueChange={(value) => handleInputChange('currentPosition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Puesto Actual" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position} disabled={position === 'Seleccionar'}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Responsable Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentSupervisorName">Nombre Responsable Actual *</Label>
                <Input
                  id="currentSupervisorName"
                  value={formData.currentSupervisorName}
                  onChange={(e) => handleInputChange('currentSupervisorName', e.target.value)}
                  placeholder="Nombre del responsable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSupervisorLastName">Apellidos Responsable Actual *</Label>
                <Input
                  id="currentSupervisorLastName"
                  value={formData.currentSupervisorLastName}
                  onChange={(e) => handleInputChange('currentSupervisorLastName', e.target.value)}
                  placeholder="Apellidos del responsable"
                />
              </div>
            </div>

            {/* Nuevo Puesto */}
            <div className="space-y-2">
              <Label>Nuevo Puesto *</Label>
              <Select value={formData.newPosition} onValueChange={(value) => handleInputChange('newPosition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Nuevo Puesto" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position} disabled={position === 'Seleccionar'}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nuevo Responsable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newSupervisorName">Nombre Nuevo Responsable *</Label>
                <Input
                  id="newSupervisorName"
                  value={formData.newSupervisorName}
                  onChange={(e) => handleInputChange('newSupervisorName', e.target.value)}
                  placeholder="Nombre del nuevo responsable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newSupervisorLastName">Apellidos Nuevo Responsable *</Label>
                <Input
                  id="newSupervisorLastName"
                  value={formData.newSupervisorLastName}
                  onChange={(e) => handleInputChange('newSupervisorLastName', e.target.value)}
                  placeholder="Apellidos del nuevo responsable"
                />
              </div>
            </div>

            {/* Fecha de Inicio */}
            <div className="space-y-2">
              <Label>{t('startDate')} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP", { locale: dateLocale })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleInputChange('startDate', date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Tipo de Cambio */}
            <div className="space-y-2">
              <Label>Tipo de Cambio *</Label>
              <Select value={formData.changeType} onValueChange={(value) => handleInputChange('changeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Tipo de Cambio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Cambio Permanente</SelectItem>
                  <SelectItem value="temporary">Cambio Temporal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Necesidades */}
            <div className="space-y-2">
              <Label>Necesidades</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {needsOptions.map((need) => (
                  <div key={need.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={need.id}
                      checked={formData.needs.includes(need.id)}
                      onCheckedChange={(checked) => handleNeedChange(need.id, !!checked)}
                    />
                    <Label htmlFor={need.id} className="text-sm">
                      {need.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Empresa Actual */}
            <div className="space-y-2">
              <Label>Empresa Actual *</Label>
              <Select value={formData.currentCompany} onValueChange={(value) => handleInputChange('currentCompany', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Empresa Actual" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cambio de Empresa */}
            <div className="space-y-2">
              <Label>Cambio de Empresa *</Label>
              <Select value={formData.companyChange} onValueChange={(value) => handleInputChange('companyChange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="¿Habrá cambio de empresa?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observations">Motivo del Cambio/Observaciones *</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Describe el motivo del cambio y cualquier observación relevante..."
                rows={4}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Crear Hoja de Cambio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeSheetCreateForm;
