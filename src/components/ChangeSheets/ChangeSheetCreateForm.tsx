import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { saveChangeSheet, ChangeSheetData } from '../../services/changeSheetService';
import { useToast } from '@/hooks/use-toast';
import { useWorkCenters } from '../../hooks/useWorkCenters';

const formSchema = z.object({
  employeeName: z.string().min(1, 'Nombre del empleado es obligatorio'),
  employeeLastName: z.string().min(1, 'Apellidos del empleado es obligatorio'),
  originCenter: z.string().min(1, 'Centro de origen es obligatorio'),
  currentPosition: z.string().min(1, 'Puesto actual es obligatorio'),
  currentSupervisorName: z.string().min(1, 'Nombre del supervisor actual es obligatorio'),
  currentSupervisorLastName: z.string().min(1, 'Apellidos del supervisor actual es obligatorio'),
  newPosition: z.string().min(1, 'Nuevo puesto es obligatorio'),
  newSupervisorName: z.string().min(1, 'Nombre del nuevo supervisor es obligatorio'),
  newSupervisorLastName: z.string().min(1, 'Apellidos del nuevo supervisor es obligatorio'),
  startDate: z.date({
    required_error: 'Fecha de inicio es obligatoria',
  }),
  changeType: z.enum(['permanent', 'temporary'], {
    required_error: 'Tipo de cambio es obligatorio',
  }),
  needs: z.array(z.string()).optional(),
  currentCompany: z.string().min(1, 'Compañía actual es obligatoria'),
  companyChange: z.enum(['yes', 'no'], {
    required_error: 'Cambio de compañía es obligatorio',
  }),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ChangeSheetCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

const ChangeSheetCreateForm: React.FC<ChangeSheetCreateFormProps> = ({
  language,
  onBack,
  onSave,
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const { workCenters, isLoading: loadingCenters, error: centersError } = useWorkCenters();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      changeType: undefined,
      needs: [],
      currentCompany: '',
      companyChange: undefined,
      observations: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const changeSheetData: ChangeSheetData = {
        employeeName: data.employeeName,
        employeeLastName: data.employeeLastName,
        originCenter: data.originCenter,
        currentPosition: data.currentPosition,
        currentSupervisorName: data.currentSupervisorName,
        currentSupervisorLastName: data.currentSupervisorLastName,
        newPosition: data.newPosition,
        newSupervisorName: data.newSupervisorName,
        newSupervisorLastName: data.newSupervisorLastName,
        startDate: data.startDate,
        changeType: data.changeType,
        needs: data.needs || [],
        currentCompany: data.currentCompany,
        companyChange: data.companyChange,
        observations: data.observations || '',
      };

      const docId = await saveChangeSheet(changeSheetData);
      
      toast({
        title: 'Hoja de cambio creada exitosamente',
        description: `La hoja de cambio ha sido guardada con ID: ${docId}`,
      });
      
      onSave();
    } catch (error) {
      console.error('Error al guardar la hoja de cambio:', error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudo guardar la hoja de cambio. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Nueva Hoja de Cambio
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Datos de la Hoja de Cambio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Datos del Empleado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Empleado/a *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del empleado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos Empleado/a *</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellidos del empleado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Centro Origen */}
              <FormField
                control={form.control}
                name="originCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro Origen *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            loadingCenters ? "Cargando centros..." : 
                            centersError ? "Error al cargar centros" : 
                            "Seleccionar centro origen"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workCenters.map((center) => (
                          <SelectItem key={center.id} value={center.displayText}>
                            {center.displayText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {centersError && (
                      <p className="text-sm text-red-600 mt-1">{centersError}</p>
                    )}
                  </FormItem>
                )}
              />

              {/* Puesto Actual */}
              <FormField
                control={form.control}
                name="currentPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puesto Actual *</FormLabel>
                    <FormControl>
                      <Input placeholder="Puesto actual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supervisor Actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentSupervisorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Supervisor Actual *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del supervisor actual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSupervisorLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos Supervisor Actual *</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellidos del supervisor actual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Nuevo Puesto */}
              <FormField
                control={form.control}
                name="newPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuevo Puesto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nuevo puesto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nuevo Supervisor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newSupervisorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Nuevo Supervisor *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del nuevo supervisor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newSupervisorLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos Nuevo Supervisor *</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellidos del nuevo supervisor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fecha de Inicio */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Cambio */}
              <FormField
                control={form.control}
                name="changeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cambio *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">Permanente</SelectItem>
                        <SelectItem value="temporary">Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Necesidades */}
              <FormField
                control={form.control}
                name="needs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Necesidades</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Necesidades adicionales..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Compañía Actual */}
              <FormField
                control={form.control}
                name="currentCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compañía Actual *</FormLabel>
                    <FormControl>
                      <Input placeholder="Compañía actual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cambio de Compañía */}
              <FormField
                control={form.control}
                name="companyChange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cambio de Compañía *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Observaciones */}
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones adicionales..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Guardando...' : 'Guardar Hoja de Cambio'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeSheetCreateForm;
