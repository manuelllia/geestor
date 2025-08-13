
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
import { saveEmployeeAgreement, EmployeeAgreementData } from '../../services/employeeAgreementsService';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  employeeName: z.string().min(1, 'Nombre del empleado es obligatorio'),
  employeeLastName: z.string().min(1, 'Apellidos del empleado es obligatorio'),
  workCenter: z.string().min(1, 'Centro de trabajo es obligatorio'),
  city: z.string().optional(),
  province: z.string().optional(),
  autonomousCommunity: z.string().optional(),
  responsibleName: z.string().min(1, 'Nombre del responsable es obligatorio'),
  responsibleLastName: z.string().min(1, 'Apellidos del responsable es obligatorio'),
  agreementConcept: z.string().min(1, 'Concepto del acuerdo es obligatorio'),
  economicAgreement1: z.string().optional(),
  concept1: z.string().optional(),
  economicAgreement2: z.string().optional(),
  concept2: z.string().optional(),
  economicAgreement3: z.string().optional(),
  concept3: z.string().optional(),
  activationDate: z.date({
    required_error: 'Fecha de activación es obligatoria',
  }),
  endDate: z.date().optional(),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EmployeeAgreementCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

const EmployeeAgreementCreateForm: React.FC<EmployeeAgreementCreateFormProps> = ({
  language,
  onBack,
  onSave,
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: '',
      employeeLastName: '',
      workCenter: '',
      city: '',
      province: '',
      autonomousCommunity: '',
      responsibleName: '',
      responsibleLastName: '',
      agreementConcept: '',
      economicAgreement1: '',
      concept1: '',
      economicAgreement2: '',
      concept2: '',
      economicAgreement3: '',
      concept3: '',
      observations: '',
    },
  });

  const workCenters = [
    'Centro Madrid Norte',
    'Centro Madrid Sur',
    'Centro Barcelona',
    'Centro Valencia',
    'Centro Sevilla',
    'Centro Bilbao',
    'Centro Zaragoza',
    'Sede Central Madrid',
  ];

  const agreementConcepts = [
    { value: 'cambio-puesto', label: 'Cambio de Puesto' },
    { value: 'complemento-responsabilidad', label: 'Complemento de Responsabilidad' },
    { value: 'complemento-destino', label: 'Complemento de Destino' },
    { value: 'complemento-internacional', label: 'Complemento Internacional' },
    { value: 'subida-salarial', label: 'Subida Salarial' },
    { value: 'anulacion-acuerdo', label: 'Anulación de Acuerdo' },
    { value: 'otro', label: 'Otro' },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const agreementData: EmployeeAgreementData = {
        employeeName: data.employeeName,
        employeeLastName: data.employeeLastName,
        position: '', // Se puede agregar después si es necesario
        department: data.workCenter,
        agreementType: data.agreementConcept,
        startDate: data.activationDate,
        endDate: data.endDate,
        salary: data.economicAgreement1 || '',
        benefits: [data.concept1, data.concept2, data.concept3].filter(Boolean),
        conditions: `Centro: ${data.workCenter}${data.city ? `, Ciudad: ${data.city}` : ''}${data.province ? `, Provincia: ${data.province}` : ''}${data.autonomousCommunity ? `, CA: ${data.autonomousCommunity}` : ''}\nResponsable: ${data.responsibleName} ${data.responsibleLastName}`,
        observations: data.observations || '',
      };

      const docId = await saveEmployeeAgreement(agreementData);
      
      toast({
        title: 'Acuerdo creado exitosamente',
        description: `El acuerdo ha sido guardado con ID: ${docId}`,
      });
      
      onSave();
    } catch (error) {
      console.error('Error al guardar el acuerdo:', error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudo guardar el acuerdo. Inténtalo de nuevo.',
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
          Nuevo Acuerdo con Empleado
        </h1>
      </div>

      {/* Formulario */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Datos del Acuerdo
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

              {/* Centro de Trabajo y Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="workCenter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Centro de Trabajo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar centro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workCenters.map((center) => (
                            <SelectItem key={center} value={center}>
                              {center}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Población</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <FormControl>
                        <Input placeholder="Provincia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autonomousCommunity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comunidad Autónoma</FormLabel>
                      <FormControl>
                        <Input placeholder="Comunidad Autónoma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Datos del Responsable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsibleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Responsable *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del responsable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibleLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos Responsable *</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellidos del responsable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Concepto del Acuerdo */}
              <FormField
                control={form.control}
                name="agreementConcept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concepto del Acuerdo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar concepto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {agreementConcepts.map((concept) => (
                          <SelectItem key={concept.value} value={concept.value}>
                            {concept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acuerdos Económicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                  Acuerdos Económicos
                </h3>
                
                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`economicAgreement${num}` as keyof FormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acuerdo Económico {num}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Cantidad en euros" 
                              {...field} 
                              value={field.value as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`concept${num}` as keyof FormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Concepto {num}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descripción del concepto" 
                              {...field} 
                              value={field.value as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="activationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Activación *</FormLabel>
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

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha Fin</FormLabel>
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
                                <span>Seleccionar fecha (opcional)</span>
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
              </div>

              {/* Observaciones */}
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones y Compromisos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones adicionales y compromisos..."
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
                  {isLoading ? 'Guardando...' : 'Guardar Acuerdo'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAgreementCreateForm;
