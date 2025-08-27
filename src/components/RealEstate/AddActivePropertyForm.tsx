
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createPropertyRecord } from '../../services/realEstateService';
import AddButton from '../Common/AddButton';

interface AddActivePropertyFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddActivePropertyForm: React.FC<AddActivePropertyFormProps> = ({
  onBack,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombreTrabajadores: [''],
    dni: [''],
    empresaGee: '',
    empresaGeeOtra: '',
    estadoPiso: '',
    habitaciones: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    ccaa: '',
    provinciaOrigen: '',
    costeAnual: '',
    fechaOcupacion: undefined as Date | undefined,
    fechaInicioContrato: undefined as Date | undefined,
    codMeta4: '',
    contratoProyecto: ''
  });

  const empresasGee = [
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'nombreTrabajadores' | 'dni', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'nombreTrabajadores' | 'dni') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'nombreTrabajadores' | 'dni', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleDateChange = (field: 'fechaOcupacion' | 'fechaInicioContrato', date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const validateForm = () => {
    const required = ['id', 'empresaGee', 'estadoPiso', 'habitaciones', 'provinciaOrigen'];
    const missingFields = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obligatorios",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive"
      });
      return false;
    }

    if (formData.nombreTrabajadores.some(name => !name.trim())) {
      toast({
        title: "Nombre de trabajadores",
        description: "Por favor, completa todos los nombres de trabajadores",
        variant: "destructive"
      });
      return false;
    }

    if (formData.dni.some(dni => !dni.trim())) {
      toast({
        title: "DNI",
        description: "Por favor, completa todos los DNI",
        variant: "destructive"
      });
      return false;
    }

    if (formData.empresaGee === 'OTRA' && !formData.empresaGeeOtra.trim()) {
      toast({
        title: "Empresa GEE",
        description: "Por favor, especifica la empresa cuando selecciones 'OTRA'",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const dataToSave = {
        ID: parseInt(formData.id),
        'NOMBRE TRABAJADORES': formData.nombreTrabajadores.join('. '),
        DNI: formData.dni.join(', '),
        'EMPRESA GEE': formData.empresaGee === 'OTRA' ? formData.empresaGeeOtra : formData.empresaGee,
        'ESTADO PISO': formData.estadoPiso,
        HABIT: parseInt(formData.habitaciones),
        'DIRECCIÓN': formData.direccion,
        'POBLACIÓN': formData.poblacion,
        PROVINCIA: formData.provincia,
        'CCAA DESTINO': formData.ccaa,
        'PROVINCIA ORIGEN': formData.provinciaOrigen,
        'COSTE ANUAL': formData.costeAnual ? parseFloat(formData.costeAnual) : undefined,
        'FECHA DE OCUPACIÓN': formData.fechaOcupacion ? format(formData.fechaOcupacion, 'dd/MM/yyyy') : '',
        'FECHA INICIO CONTRATO': formData.fechaInicioContrato ? Math.floor(formData.fechaInicioContrato.getTime() / (1000 * 60 * 60 * 24)) + 25569 : undefined,
        'COD. META 4': formData.codMeta4,
        'CONTRATO PROYECTO': formData.contratoProyecto
      };

      await createPropertyRecord(dataToSave, 'PISOS ACTIVOS');
      
      toast({
        title: "Éxito",
        description: "Inmueble activo creado correctamente",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error al crear inmueble activo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el inmueble activo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <CardTitle className="text-xl font-semibold text-blue-800 dark:text-blue-200">
              Agregar Inmueble Activo
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="space-y-2">
                <Label htmlFor="id">ID *</Label>
                <Input
                  id="id"
                  type="number"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  required
                />
              </div>

              {/* Nº Habitaciones */}
              <div className="space-y-2">
                <Label htmlFor="habitaciones">Nº Habitaciones *</Label>
                <Input
                  id="habitaciones"
                  type="number"
                  value={formData.habitaciones}
                  onChange={(e) => handleInputChange('habitaciones', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Nombre Trabajadores */}
            <div className="space-y-2">
              <Label>Nombre Trabajadores *</Label>
              {formData.nombreTrabajadores.map((nombre, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={nombre}
                    onChange={(e) => handleArrayChange('nombreTrabajadores', index, e.target.value)}
                    placeholder={`Trabajador ${index + 1}`}
                    required
                  />
                  {formData.nombreTrabajadores.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('nombreTrabajadores', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <AddButton onClick={() => addArrayField('nombreTrabajadores')} label="Añadir Trabajador" />
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label>DNI *</Label>
              {formData.dni.map((dni, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={dni}
                    onChange={(e) => handleArrayChange('dni', index, e.target.value)}
                    placeholder={`DNI ${index + 1}`}
                    required
                  />
                  {formData.dni.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('dni', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <AddButton onClick={() => addArrayField('dni')} label="Añadir DNI" />
            </div>

            {/* Empresa GEE */}
            <div className="space-y-2">
              <Label htmlFor="empresaGee">Empresa GEE *</Label>
              <Select value={formData.empresaGee} onValueChange={(value) => handleInputChange('empresaGee', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasGee.map((empresa) => (
                    <SelectItem key={empresa} value={empresa}>
                      {empresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.empresaGee === 'OTRA' && (
                <Input
                  placeholder="Especifica la empresa"
                  value={formData.empresaGeeOtra}
                  onChange={(e) => handleInputChange('empresaGeeOtra', e.target.value)}
                  required
                />
              )}
            </div>

            {/* Estado del Piso */}
            <div className="space-y-2">
              <Label>Estado del Piso *</Label>
              <RadioGroup value={formData.estadoPiso} onValueChange={(value) => handleInputChange('estadoPiso', value)}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                />
              </div>

              {/* Población */}
              <div className="space-y-2">
                <Label htmlFor="poblacion">Población</Label>
                <Input
                  id="poblacion"
                  value={formData.poblacion}
                  onChange={(e) => handleInputChange('poblacion', e.target.value)}
                />
              </div>

              {/* Provincia */}
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => handleInputChange('provincia', e.target.value)}
                />
              </div>

              {/* CCAA */}
              <div className="space-y-2">
                <Label htmlFor="ccaa">CCAA</Label>
                <Input
                  id="ccaa"
                  value={formData.ccaa}
                  onChange={(e) => handleInputChange('ccaa', e.target.value)}
                />
              </div>

              {/* Provincia de Origen */}
              <div className="space-y-2">
                <Label htmlFor="provinciaOrigen">Provincia de Origen *</Label>
                <Input
                  id="provinciaOrigen"
                  value={formData.provinciaOrigen}
                  onChange={(e) => handleInputChange('provinciaOrigen', e.target.value)}
                  required
                />
              </div>

              {/* Coste Anual */}
              <div className="space-y-2">
                <Label htmlFor="costeAnual">Coste Anual</Label>
                <Input
                  id="costeAnual"
                  type="number"
                  step="0.01"
                  value={formData.costeAnual}
                  onChange={(e) => handleInputChange('costeAnual', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de Ocupación */}
              <div className="space-y-2">
                <Label>Fecha de Ocupación</Label>
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
                      {formData.fechaOcupacion ? format(formData.fechaOcupacion, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaOcupacion}
                      onSelect={(date) => handleDateChange('fechaOcupacion', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Inicio de Contrato */}
              <div className="space-y-2">
                <Label>Fecha Inicio de Contrato</Label>
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
                      {formData.fechaInicioContrato ? format(formData.fechaInicioContrato, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaInicioContrato}
                      onSelect={(date) => handleDateChange('fechaInicioContrato', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cod. Meta 4 */}
              <div className="space-y-2">
                <Label htmlFor="codMeta4">Cod. Meta 4</Label>
                <Input
                  id="codMeta4"
                  value={formData.codMeta4}
                  onChange={(e) => handleInputChange('codMeta4', e.target.value)}
                />
              </div>

              {/* Contrato Proyecto */}
              <div className="space-y-2">
                <Label htmlFor="contratoProyecto">Contrato Proyecto</Label>
                <Input
                  id="contratoProyecto"
                  value={formData.contratoProyecto}
                  onChange={(e) => handleInputChange('contratoProyecto', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddActivePropertyForm;
