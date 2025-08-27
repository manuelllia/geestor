
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createPropertyRecord } from '../../services/realEstateService';
import { useWorkCenters } from '../../hooks/useWorkCenters';

interface AddInactivePropertyFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddInactivePropertyForm: React.FC<AddInactivePropertyFormProps> = ({
  onBack,
  onSuccess
}) => {
  const { toast } = useToast();
  const { workCenters, isLoading: loadingWorkCenters } = useWorkCenters();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    motivoInactividad: '',
    habitaciones: '',
    empresaGee: '',
    empresaGeeOtra: '',
    centroTrabajo: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    ccaa: '',
    provinciaOrigen: '',
    codMeta4: '',
    contratoProyecto: '',
    fechaInicioContrato: undefined as Date | undefined,
    fechaOcupacion: undefined as Date | undefined
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

  const handleDateChange = (field: 'fechaInicioContrato' | 'fechaOcupacion', date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const validateForm = () => {
    const required = ['id', 'habitaciones', 'empresaGee', 'provinciaOrigen'];
    const missingFields = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obligatorios",
        description: "Por favor, completa todos los campos obligatorios",
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
        Id: parseInt(formData.id),
        Motivo: formData.motivoInactividad,
        Habitaciones: parseInt(formData.habitaciones),
        Empresa: formData.empresaGee === 'OTRA' ? formData.empresaGeeOtra : formData.empresaGee,
        'Centro de Trabajo': formData.centroTrabajo,
        'Dirección': formData.direccion,
        'Provincia Destino': formData.poblacion,
        CCAA: formData.ccaa,
        'Provincia de Origen': formData.provinciaOrigen,
        'Cod. Meta 4': formData.codMeta4,
        'Contrato Proyecto': formData.contratoProyecto,
        'Fecha Inicio Contrato': formData.fechaInicioContrato ? Math.floor(formData.fechaInicioContrato.getTime() / (1000 * 60 * 60 * 24)) + 25569 : undefined,
        'Fecha Ocupación': formData.fechaOcupacion ? Math.floor(formData.fechaOcupacion.getTime() / (1000 * 60 * 60 * 24)) + 25569 : undefined,
        'Código Centro de Trabajo': formData.centroTrabajo,
        DNI: '', // Campo requerido en la estructura pero no en el formulario
      };

      await createPropertyRecord(dataToSave, 'BAJA PISOS');
      
      toast({
        title: "Éxito",
        description: "Inmueble inactivo creado correctamente",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error al crear inmueble inactivo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el inmueble inactivo",
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
              Agregar Inmueble Inactivo
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

            {/* Motivo Inactividad */}
            <div className="space-y-2">
              <Label htmlFor="motivoInactividad">Motivo Inactividad</Label>
              <Textarea
                id="motivoInactividad"
                value={formData.motivoInactividad}
                onChange={(e) => handleInputChange('motivoInactividad', e.target.value)}
                rows={3}
              />
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

            {/* Centro de Trabajo */}
            <div className="space-y-2">
              <Label htmlFor="centroTrabajo">Centro de Trabajo</Label>
              <Select value={formData.centroTrabajo} onValueChange={(value) => handleInputChange('centroTrabajo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un centro de trabajo" />
                </SelectTrigger>
                <SelectContent>
                  {loadingWorkCenters ? (
                    <SelectItem value="" disabled>Cargando...</SelectItem>
                  ) : workCenters.length > 0 ? (
                    workCenters.map((center) => (
                      <SelectItem key={center.id} value={center.name}>
                        {center.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No hay centros disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
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

              {/* Cod. Meta 4 */}
              <div className="space-y-2">
                <Label htmlFor="codMeta4">Cod. Meta 4</Label>
                <Input
                  id="codMeta4"
                  value={formData.codMeta4}
                  onChange={(e) => handleInputChange('codMeta4', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha Inicio Contrato */}
              <div className="space-y-2">
                <Label>Fecha Inicio Contrato</Label>
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

              {/* Fecha Ocupación */}
              <div className="space-y-2">
                <Label>Fecha Ocupación</Label>
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

export default AddInactivePropertyForm;
