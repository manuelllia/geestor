import React, { useState, useEffect } from 'react'; // Agregamos useEffect
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Building2, Save, Plus, Trash2, CalendarIcon, PlusCircle } from 'lucide-react'; // Agregamos PlusCircle
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createPropertyRecord } from '../../services/realEstateService';
import { getWorkCenters } from '../../services/workCentersService'; // Importamos el servicio para Centros de Trabajo
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal'; // Importamos el modal
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals'; // Importamos el hook para gestionar modales

interface ActivePropertyFormProps {
  onBack: () => void;
  onSave: () => void;
}

interface Worker {
  id: string;
  name: string;
  dni: string;
}

// Interfaz actualizada para reflejar la separación de campos
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
  contratoProyecto: string; // Este campo ahora será SÓLO para el string del contrato de proyecto
  workCenterCode: string; // NUEVO: Este campo será para el ID del centro de trabajo seleccionado del desplegable
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

const ActivePropertyForm: React.FC<ActivePropertyFormProps> = ({ onBack, onSave }) => {
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
    contratoProyecto: '', // Inicializamos el contrato de proyecto
    workCenterCode: '', // Inicializamos el nuevo campo para el código del centro de trabajo
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workCenters, setWorkCenters] = useState<Array<{id: string, name: string}>>([]); // Estado para los centros de trabajo

  // Hook para gestionar los modales de centros de trabajo y contratos
  const {
    isWorkCenterModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal,
    // isContractModalOpen, // No necesitamos el de contratos aquí
    // openContractModal,
    // closeContractModal
  } = useWorkCenterModals();

  // Función para cargar los centros de trabajo desde Firebase
  const loadWorkCenters = async () => {
    try {
      const data = await getWorkCenters();
      setWorkCenters(data);
    } catch (error) {
      console.error('Error loading work centers:', error);
      toast.error('Error al cargar los centros de trabajo.');
    }
  };

  // Cargar centros de trabajo al montar el componente
  useEffect(() => {
    loadWorkCenters();
  }, []);

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
        !formData.habitaciones || !formData.provinciaOrigen || !formData.workCenterCode) { // Agregada validación para workCenterCode
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Validar trabajadores
    const validWorkers = formData.workers.filter(w => w.name.trim() && w.dni.trim());
    if (validWorkers.length === 0) {
      toast.error('Debe agregar al menos un trabajador con nombre y DNI');
      return;
    }

    if (formData.empresaGee === 'OTRA' && !formData.empresaGeeCustom.trim()) {
      toast.error('Por favor, especifica la empresa personalizada');
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
        'CONTRATO PROYECTO': formData.contratoProyecto, // Ahora usa el campo específico para el proyecto
        'CODIGO CENTRO TRABAJO': formData.workCenterCode // Ahora usa el nuevo campo del desplegable
      };

      await createPropertyRecord(propertyData, 'PISOS ACTIVOS');
      toast.success('Inmueble activo agregado correctamente');
      onSave();
    } catch (error) {
      console.error('Error al agregar inmueble activo:', error);
      toast.error('Error al agregar el inmueble activo');
    } finally {
      setIsSubmitting(false);
    }
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
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agregar Inmueble Activo
          </h1>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
            Información del Inmueble Activo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="space-y-2">
                <Label htmlFor="id" className="text-sm font-medium">
                  ID *
                </Label>
                <Input
                  id="id"
                  type="number"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="Ej: 123"
                  required
                />
              </div>

              {/* Habitaciones */}
              <div className="space-y-2">
                <Label htmlFor="habitaciones" className="text-sm font-medium">
                  Nº Habitaciones *
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
                  <Label className="text-sm font-medium">Trabajadores *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWorker}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Agregar
                  </Button>
                </div>
                {formData.workers.map((worker, index) => (
                  <div key={worker.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded">
                    <Input
                      placeholder="Nombre del trabajador"
                      value={worker.name}
                      onChange={(e) => updateWorker(worker.id, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="DNI"
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
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Empresa GEE */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="empresaGee" className="text-sm font-medium">
                  Empresa GEE *
                </Label>
                <Select
                  value={formData.empresaGee}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, empresaGee: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresasGeeOptions.map((empresa) => (
                      <SelectItem key={empresa} value={empresa}>
                        {empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.empresaGee === 'OTRA' && (
                  <Input
                    placeholder="Especificar empresa"
                    value={formData.empresaGeeCustom}
                    onChange={(e) => setFormData(prev => ({ ...prev, empresaGeeCustom: e.target.value }))}
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* Estado del Piso */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium">Estado del Piso *</Label>
                <RadioGroup
                  value={formData.estadoPiso}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, estadoPiso: value }))}
                  className="flex gap-6"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ocupado" id="ocupado" />
                    <Label htmlFor="ocupado">Ocupado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vacio" id="vacio" />
                    <Label htmlFor="vacio">Vacío</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dirección */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion" className="text-sm font-medium">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  placeholder="Ej: C/ Isaac Peral, 37, 3ºB"
                />
              </div>

              {/* Población */}
              <div className="space-y-2">
                <Label htmlFor="poblacion" className="text-sm font-medium">
                  Población
                </Label>
                <Input
                  id="poblacion"
                  value={formData.poblacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, poblacion: e.target.value }))}
                />
              </div>

              {/* Provincia */}
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-sm font-medium">
                  Provincia
                </Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => setFormData(prev => ({ ...prev, provincia: e.target.value }))}
                />
              </div>

              {/* CCAA */}
              <div className="space-y-2">
                <Label htmlFor="ccaa" className="text-sm font-medium">
                  CCAA
                </Label>
                <Input
                  id="ccaa"
                  value={formData.ccaa}
                  onChange={(e) => setFormData(prev => ({ ...prev, ccaa: e.target.value }))}
                />
              </div>

              {/* Provincia de Origen */}
              <div className="space-y-2">
                <Label htmlFor="provinciaOrigen" className="text-sm font-medium">
                  Provincia de Origen *
                </Label>
                <Input
                  id="provinciaOrigen"
                  value={formData.provinciaOrigen}
                  onChange={(e) => setFormData(prev => ({ ...prev, provinciaOrigen: e.target.value }))}
                  required
                />
              </div>

              {/* Coste Anual */}
              <div className="space-y-2">
                <Label htmlFor="costeAnual" className="text-sm font-medium">
                  Coste Anual (€)
                </Label>
                <Input
                  id="costeAnual"
                  type="number"
                  step="0.01"
                  value={formData.costeAnual}
                  onChange={(e) => setFormData(prev => ({ ...prev, costeAnual: e.target.value }))}
                />
              </div>

              {/* Fecha de Ocupación */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha de Ocupación</Label>
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
                        format(formData.fechaOcupacion, "PPP")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaOcupacion}
                      onSelect={(date) => setFormData(prev => ({ ...prev, fechaOcupacion: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Inicio de Contrato */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha Inicio de Contrato</Label>
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
                        format(formData.fechaInicioContrato, "PPP")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaInicioContrato}
                      onSelect={(date) => setFormData(prev => ({ ...prev, fechaInicioContrato: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cod. Meta 4 */}
              <div className="space-y-2">
                <Label htmlFor="codMeta4" className="text-sm font-medium">
                  Cod. Meta 4
                </Label>
                <Input
                  id="codMeta4"
                  value={formData.codMeta4}
                  onChange={(e) => setFormData(prev => ({ ...prev, codMeta4: e.target.value }))}
                  placeholder="Ej: 39-5"
                />
              </div>

              {/* Contrato Proyecto (ahora es solo para el string del contrato) */}
              <div className="space-y-2">
                <Label htmlFor="contratoProyecto" className="text-sm font-medium">
                  Contrato Proyecto
                </Label>
                <Input
                  id="contratoProyecto"
                  value={formData.contratoProyecto}
                  onChange={(e) => setFormData(prev => ({ ...prev, contratoProyecto: e.target.value }))}
                  placeholder="Ej: 06005"
                />
              </div>

              {/* Código Centro Trabajo (¡NUEVO DESPLEGABLE!) */}
              <div className="space-y-2">
                <Label htmlFor="workCenterCode" className="text-sm font-medium">
                  Código Centro Trabajo *
                </Label>
                <div className="flex items-center space-x-2">
                    <Select
                        value={formData.workCenterCode}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, workCenterCode: value }))}
                        required
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Seleccione un centro de trabajo" />
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
                        size="icon" // Usamos size="icon" para un botón más compacto con solo el icono
                        onClick={openWorkCenterModal}
                        title="Añadir nuevo centro de trabajo"
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
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Guardando...' : 'Guardar Inmueble'}
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
      />
    </div>
  );
};

export default ActivePropertyForm;