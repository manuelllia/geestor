import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Building2, Save, Plus, Trash2, CalendarIcon, PlusCircle } from 'lucide-react'; 
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale'; // Importa enUS
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createPropertyRecord } from '../../services/realEstateService';
import { getWorkCenters } from '../../services/workCentersService';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';
import { useTranslation } from '../../hooks/useTranslation'; // Ajusta la ruta
import { Language, Translations } from '../../utils/translations'; // Ajusta la ruta

interface ActivePropertyFormProps {
  onBack: () => void;
  onSave: () => void;
  language: Language; // Añade la prop de idioma
}

interface Worker {
  id: string;
  name: string;
  dni: string;
}

interface ActivePropertyFormData {
  id: string;
  workers: Worker[];
  empresaGee: string;
  empresaGeeCustom: string;
  estadoPiso: string;
  habitaciones: string;
  direccion: string;
  poblacion: string;
  provincia: string;
  ccaa: string;
  provinciaOrigen: string;
  costeAnual: string;
  fechaOcupacion: Date | undefined;
  fechaInicioContrato: Date | undefined;
  codMeta4: string;
  contratoProyecto: string;
  workCenterCode: string;
}

const empresasGeeOptions = [
  'ASIME SA',
  'IBERMAN SA',
  'MANTELEC SA',
  'INDEL FACILITIES',
  'INSANEX SL',
  'SSM',
  'AINATEC',
  'RD HEALING',
  'OTRA'
];

const ActivePropertyForm: React.FC<ActivePropertyFormProps> = ({ onBack, onSave, language }) => {
  const { t } = useTranslation(language); // Inicializa el hook de traducción
  
  const [formData, setFormData] = useState<ActivePropertyFormData>({
    id: '',
    workers: [{ id: '1', name: '', dni: '' }],
    empresaGee: '',
    empresaGeeCustom: '',
    estadoPiso: '',
    habitaciones: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    ccaa: '',
    provinciaOrigen: '',
    costeAnual: '',
    fechaOcupacion: undefined,
    fechaInicioContrato: undefined,
    codMeta4: '',
    contratoProyecto: '',
    workCenterCode: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workCenters, setWorkCenters] = useState<Array<{id: string, name: string}>>([]);

  const {
    isWorkCenterModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal,
  } = useWorkCenterModals();

  // Memoiza loadWorkCenters para que su referencia sea estable
  const loadWorkCenters = React.useMemo(() => async () => {
    try {
      const data = await getWorkCenters();
      setWorkCenters(data);
    } catch (error) {
      console.error('Error loading work centers:', error);
      toast.error(t('errorLoadingWorkCenters')); // Traducido
    }
  }, [t]); // Dependencia de `t` para que se recree si el idioma cambia

  // Cargar centros de trabajo al montar el componente o al cambiar `loadWorkCenters`
  useEffect(() => {
    loadWorkCenters();
  }, [loadWorkCenters]); // <-- Dependencia de la función memoizada

  // Callback para cuando se crea un nuevo centro de trabajo desde el modal
  const handleWorkCenterSuccess = () => {
    closeWorkCenterModal();
    loadWorkCenters(); // Recargar la lista para incluir el nuevo centro
  };

  const addWorker = () => {
    const newWorker = {
      id: Date.now().toString(),
      name: '',
      dni: ''
    };
    setFormData(prev => ({
      ...prev,
      workers: [...prev.workers, newWorker]
    }));
  };

  const removeWorker = (workerId: string) => {
    if (formData.workers.length > 1) {
      setFormData(prev => ({
        ...prev,
        workers: prev.workers.filter(w => w.id !== workerId)
      }));
    }
  };

  const updateWorker = (workerId: string, field: 'name' | 'dni', value: string) => {
    setFormData(prev => ({
      ...prev,
      workers: prev.workers.map(w => 
        w.id === workerId ? { ...w, [field]: value } : w
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones obligatorias
    if (!formData.id || !formData.empresaGee || !formData.estadoPiso || 
        !formData.habitaciones || !formData.provinciaOrigen || !formData.workCenterCode) {
      toast.error(t('requiredFieldsError')); // Traducido
      return;
    }

    // Validar trabajadores
    const validWorkers = formData.workers.filter(w => w.name.trim() && w.dni.trim());
    if (validWorkers.length === 0) {
      toast.error(t('addWorkerError')); // Traducido
      return;
    }

    if (formData.empresaGee === 'OTRA' && !formData.empresaGeeCustom.trim()) {
      toast.error(t('specifyCustomCompanyError')); // Traducido
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Formatear datos según la estructura requerida
      const workerNames = validWorkers.map(w => w.name).join('. ');
      const workerDnis = validWorkers.map(w => w.dni).join(', ');
      
      const propertyData = {
        'ID': parseInt(formData.id),
        'NOMBRE TRABAJADORES': workerNames,
        'DNI': workerDnis,
        'EMPRESA GEE': formData.empresaGee === 'OTRA' ? formData.empresaGeeCustom : formData.empresaGee,
        'HABIT': parseInt(formData.habitaciones),
        'DIRECCIÓN': formData.direccion,
        'POBLACION': formData.poblacion,
        'PROVINCIA': formData.provincia,
        'CCAA DESTINO': formData.ccaa,
        'PROVINCIA DE ORIGEN': formData.provinciaOrigen,
        'COSTE ANUAL': formData.costeAnual ? parseFloat(formData.costeAnual) : 0,
        'FECHA DE OCUPACIÓN': formData.fechaOcupacion ? format(formData.fechaOcupacion, 'dd/MM/yyyy') : '',
        'FECHA INICIO CONTRATO': formData.fechaInicioContrato ? Math.floor(formData.fechaInicioContrato.getTime() / (1000 * 60 * 60 * 24)) + 25569 : 0, // Excel serial date
        'COD. META 4': formData.codMeta4,
        'CONTRATO PROYECTO': formData.contratoProyecto,
        'CODIGO CENTRO TRABAJO': formData.workCenterCode
      };

      await createPropertyRecord(propertyData, 'PISOS ACTIVOS');
      toast.success(t('propertyAddedSuccess')); // Traducido
      onSave();
    } catch (error) {
      console.error('Error al agregar inmueble activo:', error);
      toast.error(t('errorAddingProperty')); // Traducido
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const locale = language === 'es' ? es : enUS;
    return format(date, "PPP", { locale });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')} {/* Traducido */}
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('addActivePropertyTitle')} {/* Traducido */}
          </h1>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
            {t('activePropertyInfoTitle')} {/* Traducido */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="space-y-2">
                <Label htmlFor="id" className="text-sm font-medium">
                  {t('idLabel')} *
                </Label>
                <Input
                  id="id"
                  type="number"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  placeholder={t('idLabel')} // Usamos la misma clave para placeholder si aplica
                  required
                />
              </div>

              {/* Habitaciones */}
              <div className="space-y-2">
                <Label htmlFor="habitaciones" className="text-sm font-medium">
                  {t('numRoomsLabel')} *
                </Label>
                <Input
                  id="habitaciones"
                  type="number"
                  min="1"
                  value={formData.habitaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, habitaciones: e.target.value }))}
                  required
                />
              </div>

              {/* Trabajadores */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">{t('workersLabel')} *</Label> {/* Traducido */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWorker}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {t('addWorkerButton')} {/* Traducido */}
                  </Button>
                </div>
                {formData.workers.map((worker, index) => (
                  <div key={worker.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded">
                    <Input
                      placeholder={t('workerNamePlaceholder')} {/* Traducido */}
                      value={worker.name}
                      onChange={(e) => updateWorker(worker.id, 'name', e.target.value)}
                    />
                    <Input
                      placeholder={t('dniPlaceholder')} {/* Traducido */}
                      value={worker.dni}
                      onChange={(e) => updateWorker(worker.id, 'dni', e.target.value)}
                    />
                    {formData.workers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeWorker(worker.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        {t('removeWorkerButton')} {/* Traducido */}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Empresa GEE */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="empresaGee" className="text-sm font-medium">
                  {t('geeCompanyLabel')} *
                </Label>
                <Select
                  value={formData.empresaGee}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, empresaGee: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCompanyPlaceholder')} /> {/* Traducido */}
                  </SelectTrigger>
                  <SelectContent>
                    {empresasGeeOptions.map((empresa) => (
                      <SelectItem key={empresa} value={empresa}>
                        {empresa === 'OTRA' ? t('otherCompanyOption') : empresa} {/* Traducir "OTRA" */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.empresaGee === 'OTRA' && (
                  <Input
                    placeholder={t('specifyCompanyPlaceholder')} {/* Traducido */}
                    value={formData.empresaGeeCustom}
                    onChange={(e) => setFormData(prev => ({ ...prev, empresaGeeCustom: e.target.value }))}
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* Estado del Piso */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium">{t('propertyStatusLabel')} *</Label> {/* Traducido */}
                <RadioGroup
                  value={formData.estadoPiso}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, estadoPiso: value }))}
                  className="flex gap-6"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ocupado" id="ocupado" />
                    <Label htmlFor="ocupado">{t('occupiedStatus')}</Label> {/* Traducido */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vacio" id="vacio" />
                    <Label htmlFor="vacio">{t('emptyStatus')}</Label> {/* Traducido */}
                  </div>
                </RadioGroup>
              </div>

              {/* Dirección */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion" className="text-sm font-medium">
                  {t('addressLabel')}
                </Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  placeholder={t('addressPlaceholder')} {/* Traducido */}
                />
              </div>

              {/* Población */}
              <div className="space-y-2">
                <Label htmlFor="poblacion" className="text-sm font-medium">
                  {t('cityLabel')}
                </Label>
                <Input
                  id="poblacion"
                  value={formData.poblacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, poblacion: e.target.value }))}
                  placeholder={t('cityLabel')} // Usamos la misma clave para placeholder si aplica
                />
              </div>

              {/* Provincia */}
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-sm font-medium">
                  {t('provinceLabel')}
                </Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => setFormData(prev => ({ ...prev, provincia: e.target.value }))}
                  placeholder={t('provinceLabel')} // Usamos la misma clave para placeholder si aplica
                />
              </div>

              {/* CCAA */}
              <div className="space-y-2">
                <Label htmlFor="ccaa" className="text-sm font-medium">
                  {t('ccaaLabel')}
                </Label>
                <Input
                  id="ccaa"
                  value={formData.ccaa}
                  onChange={(e) => setFormData(prev => ({ ...prev, ccaa: e.target.value }))}
                  placeholder={t('ccaaLabel')} // Usamos la misma clave para placeholder si aplica
                />
              </div>

              {/* Provincia de Origen */}
              <div className="space-y-2">
                <Label htmlFor="provinciaOrigen" className="text-sm font-medium">
                  {t('originProvinceLabel')} *
                </Label>
                <Input
                  id="provinciaOrigen"
                  value={formData.provinciaOrigen}
                  onChange={(e) => setFormData(prev => ({ ...prev, provinciaOrigen: e.target.value }))}
                  placeholder={t('originProvinceLabel')} // Usamos la misma clave para placeholder si aplica
                  required
                />
              </div>

              {/* Coste Anual */}
              <div className="space-y-2">
                <Label htmlFor="costeAnual" className="text-sm font-medium">
                  {t('annualCostLabel')} *
                </Label>
                <Input
                  id="costeAnual"
                  type="number"
                  step="0.01"
                  value={formData.costeAnual}
                  onChange={(e) => setFormData(prev => ({ ...prev, costeAnual: e.target.value }))}
                  placeholder={t('annualCostLabel')} // Usamos la misma clave para placeholder si aplica
                />
              </div>

              {/* Fecha de Ocupación */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('occupancyDateLabel')}</Label> {/* Traducido */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fechaOcupacion && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fechaOcupacion ? (
                        formatDate(formData.fechaOcupacion)
                      ) : (
                        <span>{t('selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaOcupacion}
                      onSelect={(date) => setFormData(prev => ({ ...prev, fechaOcupacion: date }))}
                      initialFocus
                      locale={language === 'es' ? es : enUS} // Pasa el locale al calendario
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Inicio de Contrato */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('contractStartDateLabel')}</Label> {/* Traducido */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fechaInicioContrato && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fechaInicioContrato ? (
                        formatDate(formData.fechaInicioContrato)
                      ) : (
                        <span>{t('selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaInicioContrato}
                      onSelect={(date) => setFormData(prev => ({ ...prev, fechaInicioContrato: date }))}
                      initialFocus
                      locale={language === 'es' ? es : enUS} // Pasa el locale al calendario
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cod. Meta 4 */}
              <div className="space-y-2">
                <Label htmlFor="codMeta4" className="text-sm font-medium">
                  {t('meta4CodeLabel')}
                </Label>
                <Input
                  id="codMeta4"
                  value={formData.codMeta4}
                  onChange={(e) => setFormData(prev => ({ ...prev, codMeta4: e.target.value }))}
                  placeholder={t('meta4CodePlaceholder')} {/* Traducido */}
                />
              </div>

              {/* Contrato Proyecto */}
              <div className="space-y-2">
                <Label htmlFor="contratoProyecto" className="text-sm font-medium">
                  {t('projectContractLabel')}
                </Label>
                <Input
                  id="contratoProyecto"
                  value={formData.contratoProyecto}
                  onChange={(e) => setFormData(prev => ({ ...prev, contratoProyecto: e.target.value }))}
                  placeholder={t('projectContractPlaceholder')} {/* Traducido */}
                />
              </div>

              {/* Código Centro Trabajo */}
              <div className="space-y-2">
                <Label htmlFor="workCenterCode" className="text-sm font-medium">
                  {t('workCenterCodeLabel')} *
                </Label>
                <div className="flex items-center space-x-2">
                    <Select
                        value={formData.workCenterCode}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, workCenterCode: value }))}
                        required
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder={t('selectWorkCenterPlaceholder')} /> {/* Traducido */}
                        </SelectTrigger>
                        <SelectContent>
                            {workCenters.map((center) => (
                                <SelectItem key={center.id} value={center.id}>
                                    {center.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={openWorkCenterModal}
                        title={t('addWorkCenterButtonTitle')} {/* Traducido */}
                    >
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
              >
                {t('cancel')} {/* Traducido */}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? t('saving') : t('saveProperty')} {/* Traducido */}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal para crear nuevo Centro de Trabajo */}
      <CreateWorkCenterModal
        isOpen={isWorkCenterModalOpen}
        onClose={closeWorkCenterModal}
        onSuccess={handleWorkCenterSuccess}
        language={language} {/* Pasa el idioma al modal */}
      />
    </div>
  );
};

export default ActivePropertyForm;
