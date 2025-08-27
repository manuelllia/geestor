
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Building2, Save, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createPropertyRecord } from '../../services/realEstateService';

interface InactivePropertyFormProps {
  onBack: () => void;
  onSave: () => void;
}

interface InactivePropertyFormData {
  id: string;
  motivoInactividad: string;
  habitaciones: string;
  empresaGee: string;
  empresaGeeCustom: string;
  centroTrabajo: string;
  direccion: string;
  poblacion: string;
  provincia: string;
  ccaa: string;
  provinciaOrigen: string;
  codMeta4: string;
  contratoProyecto: string;
  fechaInicioContrato: Date | undefined;
  fechaOcupacion: Date | undefined;
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

const centrosTrabajoOptions = [
  'DPTO INFORMATICA',
  'CENTRO PRINCIPAL',
  'SUCURSAL MADRID',
  'OFICINA BARCELONA',
  'DELEGACIÓN VALENCIA',
  'CENTRO LOGÍSTICO',
  'ALMACÉN CENTRAL',
  'OFICINA TÉCNICA'
];

const InactivePropertyForm: React.FC<InactivePropertyFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState<InactivePropertyFormData>({
    id: '',
    motivoInactividad: '',
    habitaciones: '',
    empresaGee: '',
    empresaGeeCustom: '',
    centroTrabajo: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    ccaa: '',
    provinciaOrigen: '',
    codMeta4: '',
    contratoProyecto: '',
    fechaInicioContrato: undefined,
    fechaOcupacion: undefined
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones obligatorias
    if (!formData.id || !formData.habitaciones || !formData.empresaGee || !formData.provinciaOrigen) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (formData.empresaGee === 'OTRA' && !formData.empresaGeeCustom.trim()) {
      toast.error('Por favor, especifica la empresa personalizada');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Formatear datos según la estructura requerida para BAJA PISOS
      const propertyData = {
        'Id': parseInt(formData.id),
        'Motivo': formData.motivoInactividad,
        'Habitaciones': parseInt(formData.habitaciones),
        'Empresa': formData.empresaGee === 'OTRA' ? formData.empresaGeeCustom : formData.empresaGee,
        'Centro de Trabajo': formData.centroTrabajo,
        'Dirección': formData.direccion,
        'Provincia Destino': formData.poblacion,
        'CCAA': formData.ccaa,
        'Provincia de Origen': formData.provinciaOrigen,
        'Cod. Meta 4': formData.codMeta4,
        'Contrato Proyecto': formData.contratoProyecto,
        'Código Centro de Trabajo': formData.contratoProyecto,
        'Fecha Inicio Contrato': formData.fechaInicioContrato ? Math.floor(formData.fechaInicioContrato.getTime() / (1000 * 60 * 60 * 24)) + 25569 : 0, // Excel serial date
        'Fecha Ocupación': formData.fechaOcupacion ? Math.floor(formData.fechaOcupacion.getTime() / (1000 * 60 * 60 * 24)) + 25569 : 0, // Excel serial date
        'DNI': '', // Se puede agregar si es necesario
      };

      await createPropertyRecord(propertyData, 'BAJA PISOS');
      toast.success('Inmueble inactivo agregado correctamente');
      onSave();
    } catch (error) {
      console.error('Error al agregar inmueble inactivo:', error);
      toast.error('Error al agregar el inmueble inactivo');
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
          <Building2 className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agregar Inmueble Inactivo
          </h1>
        </div>
      </div>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-lg text-red-800 dark:text-red-200">
            Información del Inmueble Inactivo
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
                  placeholder="Ej: 89"
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

              {/* Motivo Inactividad */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="motivoInactividad" className="text-sm font-medium">
                  Motivo Inactividad
                </Label>
                <Textarea
                  id="motivoInactividad"
                  value={formData.motivoInactividad}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivoInactividad: e.target.value }))}
                  placeholder="Ej: JAVIER MARTINEZ HERNANDEZ"
                  rows={3}
                />
              </div>

              {/* Empresa GEE */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="empresaGee" className="text-sm font-medium">
                  Empresa GEE *
                </Label>
                <Select
                  value={formData.empresaGee}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, empresaGee: value }))}
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
                  />
                )}
              </div>

              {/* Centro de Trabajo */}
              <div className="space-y-2">
                <Label htmlFor="centroTrabajo" className="text-sm font-medium">
                  Centro de Trabajo
                </Label>
                <Select
                  value={formData.centroTrabajo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, centroTrabajo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                  <SelectContent>
                    {centrosTrabajoOptions.map((centro) => (
                      <SelectItem key={centro} value={centro}>
                        {centro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Ej: VALENCIA"
                  required
                />
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
                  placeholder="Ej: PLAZA DE CIUDAD REAL Nº 4"
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
                  placeholder="Ej: SAN SEBASTIAN DE LOS REYES"
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
                  placeholder="Ej: MADRID*"
                />
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
                  placeholder="Ej: 28-58"
                />
              </div>

              {/* Contrato Proyecto */}
              <div className="space-y-2">
                <Label htmlFor="contratoProyecto" className="text-sm font-medium">
                  Contrato Proyecto
                </Label>
                <Input
                  id="contratoProyecto"
                  value={formData.contratoProyecto}
                  onChange={(e) => setFormData(prev => ({ ...prev, contratoProyecto: e.target.value }))}
                  placeholder="Ej: 01-ALCOB-02"
                />
              </div>

              {/* Fecha Inicio Contrato */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha Inicio Contrato</Label>
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

              {/* Fecha Ocupación */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha Ocupación</Label>
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
    </div>
  );
};

export default InactivePropertyForm;
