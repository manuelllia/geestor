import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { saveExitInterview, ExitInterviewData } from '../services/exitInterviewService';
import { useWorkCenters } from '../hooks/useWorkCenters';

const formSchema = z.object({
  employeeName: z.string().min(1, 'Nombre es obligatorio'),
  employeeLastName: z.string().min(1, 'Apellidos es obligatorio'),
  supervisorName: z.string().min(1, 'Nombre del responsable es obligatorio'),
  supervisorLastName: z.string().min(1, 'Apellidos del responsable es obligatorio'),
  workCenter: z.string().min(1, 'Centro de trabajo es obligatorio'),
  position: z.string().min(1, 'Puesto es obligatorio'),
  seniority: z.string().optional(),
  exitType: z.string().min(1, 'Tipo de baja es obligatorio'),
  exitDate: z.date({
    required_error: 'Fecha de baja es obligatoria',
  }),
  joiningReasons: z.array(z.string()).min(0),
  mainExitReason: z.string().min(1, 'Motivo principal es obligatorio'),
  mainExitReasonOther: z.string().optional(),
  otherInfluencingFactors: z.array(z.string()).min(0),
  comments: z.string().optional(),
  integration: z.number().min(1).max(10),
  internalCommunication: z.number().min(1).max(10),
  compensation: z.number().min(1).max(10),
  training: z.number().min(1).max(10),
  workSchedule: z.number().min(1).max(10),
  mentoring: z.number().min(1).max(10),
  workPerformed: z.number().min(1).max(10),
  workEnvironment: z.number().min(1).max(10),
  corporateCulture: z.number().min(1).max(10),
  supervisorRelation: z.number().min(1).max(10),
  globalAssessment: z.number().min(1).max(10),
});

type FormData = z.infer<typeof formSchema>;

const ExitInterviewForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);
  const { workCenters, isLoading: workCentersLoading, error: workCentersError } = useWorkCenters();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: '',
      employeeLastName: '',
      supervisorName: '',
      supervisorLastName: '',
      workCenter: '',
      position: '',
      seniority: '',
      exitType: '',
      joiningReasons: [],
      mainExitReason: '',
      mainExitReasonOther: '',
      otherInfluencingFactors: [],
      comments: '',
      integration: 5,
      internalCommunication: 5,
      compensation: 5,
      training: 5,
      workSchedule: 5,
      mentoring: 5,
      workPerformed: 5,
      workEnvironment: 5,
      corporateCulture: 5,
      supervisorRelation: 5,
      globalAssessment: 5,
    },
  });

  const seniorityOptions = [
    'De 0 a 6 meses',
    'de 6 meses a 1 año',
    'De 1 a 2 años',
    'De 2 a 4 años',
    'De 4 a 7 años',
    'De 7 a 10 años',
    'Más de 10 años'
  ];

  const exitTypes = ['Voluntaria', 'Excedencia'];

  const joiningReasonsOptions = [
    'Expectativas de formación',
    'Condiciones económicas',
    'Horario de trabajo',
    'Interés del trabajo a desempeñar',
    'Oportunidades de desarrollo/promoción',
    'Prestigio de la empresa',
    'Impresiones en el proceso de selección (ambiente percibido, impresión sobre el/los responsables en las entrevistas…)',
    'Recomendaciones de amigos o conocidos',
    'Otra'
  ];

  const exitReasonOptions = [
    'Pocas oportunidades de promoción profesional',
    'Trabajo poco interesante. Deseo de variar/cambiar funciones',
    'No identificación con el puesto. Reorientación profesional',
    'Condiciones económicas',
    'Desacuerdo con el tipo de dirección/falta de confianza en el responsable',
    'Carga de trabajo excesiva',
    'Ambiente de trabajo o relación con el equipo de trabajo',
    'Equilibrio vida personal/profesional',
    'No identificación con los valores o cultura del GEE',
    'Búsqueda de mayor estabilidad profesional',
    'Otra'
  ];

  const influencingFactorsOptions = [
    'Pocas oportunidades de promoción profesional',
    'Trabajo poco interesante. Deseo de variar/cambiar funciones',
    'No identificación con el puesto. Reorientación profesional',
    'Condiciones económicas',
    'Desacuerdo con el tipo de dirección/falta de confianza en el responsable',
    'Carga de trabajo excesiva',
    'Ambiente de trabajo o relación con el equipo de trabajo',
    'Equilibrio vida personal/profesional',
    'No identificación con los valores o cultura del GEE',
    'Búsqueda de mayor estabilidad profesional',
    'Especializarse en una marca concreta de equipamiento',
    'Otra'
  ];

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const exitInterviewData: ExitInterviewData = {
        employeeName: data.employeeName,
        employeeLastName: data.employeeLastName,
        supervisorName: data.supervisorName,
        supervisorLastName: data.supervisorLastName,
        workCenter: data.workCenter,
        position: data.position,
        seniority: data.seniority || '',
        exitType: data.exitType,
        exitDate: data.exitDate,
        joiningReasons: data.joiningReasons,
        mainExitReason: data.mainExitReason === 'Otra' && data.mainExitReasonOther ? data.mainExitReasonOther : data.mainExitReason,
        otherInfluencingFactors: data.otherInfluencingFactors,
        comments: data.comments || '',
        scores: {
          integration: data.integration,
          internalCommunication: data.internalCommunication,
          compensation: data.compensation,
          training: data.training,
          workSchedule: data.workSchedule,
          mentoring: data.mentoring,
          workPerformed: data.workPerformed,
          workEnvironment: data.workEnvironment,
          corporateCulture: data.corporateCulture,
          supervisorRelation: data.supervisorRelation,
          globalAssessment: data.globalAssessment,
        },
      };

      await saveExitInterview(exitInterviewData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error al enviar la entrevista:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md animate-fade-in-scale">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-gentle-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 animate-slide-in-top">
              ¡Formulario enviado correctamente!
            </h2>
            <p className="text-gray-600 mb-6 animate-slide-in-bottom animate-stagger-1">
              Gracias por completar la entrevista de salida. Tu feedback es muy valioso para nosotros.
            </p>
            <p className="text-sm text-gray-500 animate-slide-in-bottom animate-stagger-2">
              Ya puedes cerrar esta ventana.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-blue-200 animate-slide-in-top hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-800 animate-slide-in-left">
              Cuestionario de Salida
            </CardTitle>
            <p className="text-gray-600 mt-4 animate-slide-in-right animate-stagger-1">
              Por favor, cumplimenta este cuestionario, en él recogemos información sobre tus motivos de baja y la valoración de algunos aspectos de tu paso por el GEE. Esta información nos ayudará a proponer acciones de mejora en un futuro.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Datos personales */}
                <div className="space-y-6 animate-slide-in-bottom animate-stagger-1">
                  <h3 className="text-xl font-semibold text-blue-800">Datos Personales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeName"
                      render={({ field }) => (
                        <FormItem className="animate-slide-in-left animate-stagger-1">
                          <FormLabel>Nombre de la Persona *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre" className="focus-ring hover-glow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employeeLastName"
                      render={({ field }) => (
                        <FormItem className="animate-slide-in-right animate-stagger-1">
                          <FormLabel>Apellidos de la Persona *</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellidos" className="focus-ring hover-glow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="supervisorName"
                      render={({ field }) => (
                        <FormItem className="animate-slide-in-left animate-stagger-2">
                          <FormLabel>Nombre Responsable Directo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del responsable" className="focus-ring hover-glow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supervisorLastName"
                      render={({ field }) => (
                        <FormItem className="animate-slide-in-right animate-stagger-2">
                          <FormLabel>Apellidos Responsable Directo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellidos del responsable" className="focus-ring hover-glow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workCenter"
                      render={({ field }) => (
                        <FormItem className="animate-slide-in-left animate-stagger-3">
                          <FormLabel>Centro de Trabajo *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={workCentersLoading}>
                            <FormControl>
                              <SelectTrigger className="focus-ring hover-glow">
                                <SelectValue placeholder={workCentersLoading ? "Cargando centros..." : "Seleccionar centro"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              {workCenters.map((center) => (
                                <SelectItem key={center.id} value={center.displayText} className="hover:bg-blue-50 cursor-pointer">
                                  {center.displayText}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {workCentersError && (
                            <p className="text-sm text-red-600 animate-slide-in-bottom">{workCentersError}</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem className="animate-slide-in-right animate-stagger-3">
                          <FormLabel>Puesto *</FormLabel>
                          <FormControl>
                            <Input placeholder="Puesto de trabajo" className="focus-ring hover-glow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="seniority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antigüedad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar antigüedad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {seniorityOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="exitType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Baja *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {exitTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
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
                      name="exitDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de Baja *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
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
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Preguntas sobre motivación */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-800">Preguntas sobre tu experiencia</h3>
                  
                  {/* Razones para aceptar la oferta */}
                  <FormField
                    control={form.control}
                    name="joiningReasons"
                    render={() => (
                      <FormItem>
                        <FormLabel>Cuando te incorporaste en GEE, ¿Qué razones tuvieron más relevancia a la hora de aceptar la oferta?</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {joiningReasonsOptions.map((reason) => (
                            <FormField
                              key={reason}
                              control={form.control}
                              name="joiningReasons"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={reason}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(reason)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, reason])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== reason
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {reason}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Motivo principal de salida */}
                  <FormField
                    control={form.control}
                    name="mainExitReason"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>¿Cuál ha sido el motivo que te hizo pensar en dejar el GEE?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setShowOtherField(value === 'Otra');
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {exitReasonOptions.map((reason) => (
                              <div key={reason} className="flex items-center space-x-2">
                                <RadioGroupItem value={reason} id={reason} />
                                <FormLabel htmlFor={reason} className="text-sm font-normal">
                                  {reason}
                                </FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo "Otra" para motivo principal */}
                  {showOtherField && (
                    <FormField
                      control={form.control}
                      name="mainExitReasonOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifica el motivo:</FormLabel>
                          <FormControl>
                            <Input placeholder="Describe el motivo..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Otros factores influyentes */}
                  <FormField
                    control={form.control}
                    name="otherInfluencingFactors"
                    render={() => (
                      <FormItem>
                        <FormLabel>¿Qué otros motivos han influido en tu decisión de dejar la empresa?</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {influencingFactorsOptions.map((factor) => (
                            <FormField
                              key={factor}
                              control={form.control}
                              name="otherInfluencingFactors"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={factor}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(factor)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, factor])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== factor
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {factor}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Comentarios */}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentarios</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Comparte cualquier comentario adicional..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Puntuaciones */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">Puntuación</h3>
                    <p className="text-gray-600">
                      Por favor, puntúa de 1 a 10 (siendo 1 muy deficiente y 10 excelente) los siguientes aspectos de tu paso por el GEE.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: 'integration', label: 'Acogida/Integración' },
                      { name: 'internalCommunication', label: 'Comunicación Interna' },
                      { name: 'compensation', label: 'Retribución' },
                      { name: 'training', label: 'Formación' },
                      { name: 'workSchedule', label: 'Horario de Trabajo' },
                      { name: 'mentoring', label: 'Tutorización' },
                      { name: 'workPerformed', label: 'Trabajo Realizado' },
                      { name: 'workEnvironment', label: 'Ambiente de trabajo' },
                      { name: 'corporateCulture', label: 'Cultura corporativa' },
                      { name: 'supervisorRelation', label: 'Relación con mi responsable' },
                      { name: 'globalAssessment', label: 'Valoración global de tu paso por el GEE' },
                    ].map((item) => (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name as keyof FormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                placeholder="1-10"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                value={typeof field.value === 'number' ? field.value.toString() : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón enviar */}
                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg hover-lift animate-pulse-glow transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Enviando...' : 'Enviar Entrevista'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExitInterviewForm;
