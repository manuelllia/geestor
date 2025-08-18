
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { savePracticeEvaluation, PracticeEvaluationData } from '../services/practiceEvaluationService';
import { useWorkCenters } from '../hooks/useWorkCenters';

const practiceEvaluationSchema = z.object({
  tutorName: z.string().min(1, 'Nombre del tutor es obligatorio'),
  tutorLastName: z.string().min(1, 'Apellidos del tutor son obligatorios'),
  workCenter: z.string().min(1, 'Centro de trabajo es obligatorio'),
  studentName: z.string().min(1, 'Nombre del estudiante es obligatorio'),
  studentLastName: z.string().min(1, 'Apellidos del estudiante son obligatorios'),
  formation: z.string().min(1, 'Formación es obligatoria'),
  institute: z.string().min(1, 'Instituto/Universidad es obligatorio'),
  practices: z.string().min(1, 'Prácticas es obligatorio'),
  
  // Competencias
  meticulousness: z.number().min(1).max(10),
  teamwork: z.number().min(1).max(10),
  adaptability: z.number().min(1).max(10),
  stressTolerance: z.number().min(1).max(10),
  verbalCommunication: z.number().min(1).max(10),
  commitment: z.number().min(1).max(10),
  initiative: z.number().min(1).max(10),
  leadership: z.number().min(1).max(10),
  learningCapacity: z.number().min(1).max(10),
  writtenCommunication: z.number().min(1).max(10),
  problemSolving: z.number().min(1).max(10),
  taskCommitment: z.number().min(1).max(10),
  
  // Aptitudes Organizativas
  organized: z.number().min(1).max(10),
  newChallenges: z.number().min(1).max(10),
  systemAdaptation: z.number().min(1).max(10),
  efficiency: z.number().min(1).max(10),
  punctuality: z.number().min(1).max(10),
  
  // Aptitudes Técnicas
  serviceImprovements: z.number().min(1).max(10),
  diagnosticSkills: z.number().min(1).max(10),
  innovativeSolutions: z.number().min(1).max(10),
  sharesSolutions: z.number().min(1).max(10),
  toolUsage: z.number().min(1).max(10),
  
  // Otros datos
  travelAvailability: z.array(z.string()),
  residenceChange: z.string().min(1, 'Disponibilidad para cambio de residencia es obligatoria'),
  englishLevel: z.string().min(1, 'Nivel de inglés es obligatorio'),
  performanceRating: z.number().min(1).max(10),
  performanceJustification: z.string().min(1, 'Justificación es obligatoria'),
  finalEvaluation: z.string().min(1, 'Valoración final es obligatoria'),
  futureInterest: z.string(),
  practicalTraining: z.string(),
  observations: z.string(),
  evaluatorName: z.string().min(1, 'Nombre del evaluador es obligatorio'),
  evaluationDate: z.date({
    required_error: 'Fecha de evaluación es obligatoria',
  }),
});

type PracticeEvaluationFormData = z.infer<typeof practiceEvaluationSchema>;

export default function PracticeEvaluationForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { workCenters } = useWorkCenters();

  const form = useForm<PracticeEvaluationFormData>({
    resolver: zodResolver(practiceEvaluationSchema),
    defaultValues: {
      tutorName: '',
      tutorLastName: '',
      workCenter: '',
      studentName: '',
      studentLastName: '',
      formation: '',
      institute: '',
      practices: '',
      meticulousness: 5,
      teamwork: 5,
      adaptability: 5,
      stressTolerance: 5,
      verbalCommunication: 5,
      commitment: 5,
      initiative: 5,
      leadership: 5,
      learningCapacity: 5,
      writtenCommunication: 5,
      problemSolving: 5,
      taskCommitment: 5,
      organized: 5,
      newChallenges: 5,
      systemAdaptation: 5,
      efficiency: 5,
      punctuality: 5,
      serviceImprovements: 5,
      diagnosticSkills: 5,
      innovativeSolutions: 5,
      sharesSolutions: 5,
      toolUsage: 5,
      travelAvailability: [],
      residenceChange: '',
      englishLevel: '',
      performanceRating: 5,
      performanceJustification: '',
      finalEvaluation: '',
      futureInterest: '',
      practicalTraining: '',
      observations: '',
      evaluatorName: '',
      evaluationDate: new Date(),
    },
  });

  const onSubmit = async (data: PracticeEvaluationFormData) => {
    setIsSubmitting(true);
    try {
      const evaluationData: PracticeEvaluationData = {
        tutorName: data.tutorName,
        tutorLastName: data.tutorLastName,
        workCenter: data.workCenter,
        studentName: data.studentName,
        studentLastName: data.studentLastName,
        formation: data.formation,
        institute: data.institute,
        practices: data.practices,
        competencies: {
          meticulousness: data.meticulousness,
          teamwork: data.teamwork,
          adaptability: data.adaptability,
          stressTolerance: data.stressTolerance,
          verbalCommunication: data.verbalCommunication,
          commitment: data.commitment,
          initiative: data.initiative,
          leadership: data.leadership,
          learningCapacity: data.learningCapacity,
          writtenCommunication: data.writtenCommunication,
          problemSolving: data.problemSolving,
          taskCommitment: data.taskCommitment,
        },
        organizationalSkills: {
          organized: data.organized,
          newChallenges: data.newChallenges,
          systemAdaptation: data.systemAdaptation,
          efficiency: data.efficiency,
          punctuality: data.punctuality,
        },
        technicalSkills: {
          serviceImprovements: data.serviceImprovements,
          diagnosticSkills: data.diagnosticSkills,
          innovativeSolutions: data.innovativeSolutions,
          sharesSolutions: data.sharesSolutions,
          toolUsage: data.toolUsage,
        },
        travelAvailability: data.travelAvailability,
        residenceChange: data.residenceChange,
        englishLevel: data.englishLevel,
        performanceRating: data.performanceRating,
        performanceJustification: data.performanceJustification,
        finalEvaluation: data.finalEvaluation,
        futureInterest: data.futureInterest,
        practicalTraining: data.practicalTraining,
        observations: data.observations,
        evaluatorName: data.evaluatorName,
        evaluationDate: data.evaluationDate,
      };

      await savePracticeEvaluation(evaluationData);
      
      toast.success('Valoración enviada correctamente', {
        description: 'La valoración de prácticas ha sido registrada exitosamente.',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      toast.error('Error al enviar la valoración', {
        description: 'Por favor, inténtalo de nuevo más tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const NumberInput = ({ name, label }: { name: keyof PracticeEvaluationFormData; label: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              max="10"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              className="text-center"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-300">
              Valoración de Prácticas - GEE
            </CardTitle>
            <CardDescription>
              Complete esta valoración para evaluar el desempeño del estudiante durante las prácticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Datos básicos */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tutorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Tutor de GEE *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tutorLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos del Tutor de GEE *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="workCenter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Centro de Trabajo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un centro de trabajo" />
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
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Alumno *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos del Alumno *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="formation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formación *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="institute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instituto/Universidad *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="practices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prácticas *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Competencias */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2">COMPETENCIAS</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <NumberInput name="meticulousness" label="Meticulosidad" />
                    <NumberInput name="teamwork" label="Trabajo en Equipo / Participativo" />
                    <NumberInput name="adaptability" label="Adaptabilidad / Flexibilidad" />
                    <NumberInput name="stressTolerance" label="Tolerancia al estrés" />
                    <NumberInput name="verbalCommunication" label="Comunicación Verbal" />
                    <NumberInput name="commitment" label="Compromiso" />
                    <NumberInput name="initiative" label="Iniciativa" />
                    <NumberInput name="leadership" label="Carisma / Liderazgo" />
                    <NumberInput name="learningCapacity" label="Capacidad de Aprendizaje" />
                    <NumberInput name="writtenCommunication" label="Comunicación Escrita" />
                    <NumberInput name="problemSolving" label="Persona Resolutiva" />
                    <NumberInput name="taskCommitment" label="Compromiso con las Tareas" />
                  </div>
                </div>

                {/* Aptitudes Organizativas */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2">APTITUDES ORGANIZATIVAS</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <NumberInput name="organized" label="Organizado, Metódico, Ordenado" />
                    <NumberInput name="newChallenges" label="Asume nuevos retos" />
                    <NumberInput name="systemAdaptation" label="Adaptación a nuevos sistemas de trabajo" />
                    <NumberInput name="efficiency" label="Eficiencia" />
                    <NumberInput name="punctuality" label="Puntualidad" />
                  </div>
                </div>

                {/* Aptitudes Técnicas */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2">APTITUDES TÉCNICAS</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <NumberInput name="serviceImprovements" label="Propone mejoras en servicio de electromedicina" />
                    <NumberInput name="diagnosticSkills" label="Habilidad en diagnóstico y detección de averías" />
                    <NumberInput name="innovativeSolutions" label="Aporta soluciones innovadoras" />
                    <NumberInput name="sharesSolutions" label="Comparte soluciones y problemas" />
                    <NumberInput name="toolUsage" label="Uso correcto de herramientas informáticas (MantHosp, etc.)" />
                  </div>
                </div>

                {/* Otros datos de interés */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2">OTROS DATOS DE INTERÉS</h3>
                  
                  <FormField
                    control={form.control}
                    name="travelAvailability"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Disponibilidad para viajar</FormLabel>
                        </div>
                        <div className="flex gap-4">
                          {["Nacional", "Internacional"].map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="travelAvailability"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item}
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

                  <FormField
                    control={form.control}
                    name="residenceChange"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Disponibilidad para cambio de residencia</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row gap-6"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Si" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sí
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="No" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="englishLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel de Inglés</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Elija una opción" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bajo">Bajo (A1, A2)</SelectItem>
                            <SelectItem value="medio">Medio (B1)</SelectItem>
                            <SelectItem value="alto">Alto (B2)</SelectItem>
                            <SelectItem value="muy-alto">Muy Alto (C1, C2)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="performanceRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valora el desempeño del alumno durante las prácticas</FormLabel>
                          <FormDescription>
                            Por favor, escribe un número entre 1 y 10. Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              className="text-center"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="performanceJustification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Justifica tu respuesta</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="finalEvaluation"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Valoración Final *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row gap-6"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Apto" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Apto
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="No Apto" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No Apto
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="futureInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indica si consideras que podría ser interesante contar con el alumno en el GEE ahora o en el futuro</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="practicalTraining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formación Práctica Recibida</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="evaluatorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre y Apellidos del Evaluador *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="evaluationDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Selecciona una fecha</span>
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
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
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
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando valoración...
                      </>
                    ) : (
                      'Enviar Valoración'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
