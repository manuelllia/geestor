import React, { useState, useEffect } from 'react'; // Eliminaremos useEffect si ya no lo usas para cargar datos
import { useParams, useNavigate } from 'react-router-dom'; // Eliminaremos useParams
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'; // Eliminaremos AlertCircle
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWorkCenters } from '../hooks/useWorkCenters';
// Solo importamos savePracticeEvaluationResponse, ya no getPracticeEvaluationById
import { savePracticeEvaluationResponse } from '../services/practiceEvaluationService';

const practiceEvaluationSchema = z.object({
  tutorName: z.string().min(1, 'El nombre del tutor es obligatorio'),
  tutorLastName: z.string().min(1, 'Los apellidos del tutor son obligatorios'),
  workCenter: z.string().min(1, 'El centro de trabajo es obligatorio'),
  studentName: z.string().min(1, 'El nombre del alumno es obligatorio'),
  studentLastName: z.string().min(1, 'Los apellidos del alumno son obligatorios'),
  formation: z.string().min(1, 'La formación es obligatoria'),
  institution: z.string().min(1, 'El instituto/universidad es obligatorio'),
  practices: z.string().min(1, 'Las prácticas son obligatorias'),
  
  // Competencias (1-10)
  meticulousness: z.number().min(1).max(10),
  teamwork: z.number().min(1).max(10),
  adaptability: z.number().min(1).max(10),
  stressTolerance: z.number().min(1).max(10),
  verbalCommunication: z.number().min(1).max(10),
  commitment: z.number().min(1).max(10),
  initiative: z.number().min(1).max(10),
  charisma: z.number().min(1).max(10),
  learningCapability: z.number().min(1).max(10),
  writtenCommunication: z.number().min(1).max(10),
  problemSolving: z.number().min(1).max(10),
  taskCommitment: z.number().min(1).max(10),
  
  // Aptitudes Organizativas (1-10)
  organized: z.number().min(1).max(10),
  newChallenges: z.number().min(1).max(10),
  adaptationToSystems: z.number().min(1).max(10),
  efficiency: z.number().min(1).max(10),
  punctuality: z.number().min(1).max(10),
  
  // Aptitudes Técnicas (1-10)
  serviceImprovements: z.number().min(1).max(10),
  diagnosticSkills: z.number().min(1).max(10),
  innovativeSolutions: z.number().min(1).max(10),
  sharingKnowledge: z.number().min(1).max(10),
  toolsUsage: z.number().min(1).max(10),
  
  // Otros datos
  travelAvailability: z.array(z.string()).optional(),
  relocationWillingness: z.enum(['Si', 'No']),
  englishLevel: z.string().min(1, 'El nivel de inglés es obligatorio'),
  performanceRating: z.number().min(1).max(10),
  performanceJustification: z.string().min(1, 'La justificación es obligatoria'),
  finalEvaluation: z.enum(['Apto', 'No Apto']),
  practicalTraining: z.string().optional(),
  observations: z.string().optional(),
  evaluatorName: z.string().min(1, 'El nombre del evaluador es obligatorio'),
  evaluationDate: z.string().min(1, 'La fecha es obligatoria'),
});

type PracticeEvaluationFormType = z.infer<typeof practiceEvaluationSchema>; // Renombrado para evitar conflicto con el nombre de la función

export default function PracticeEvaluationForm() {
  // ELIMINADO: const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // isLoading ahora solo para el envío
  const [isSubmitted, setIsSubmitted] = useState(false);
  // ELIMINADO: const [evaluationData, setEvaluationData] = useState<any>(null);
  const { workCenters, isLoading: isLoadingWorkCenters } = useWorkCenters(); // Considera si useWorkCenters es asíncrono

  const {
    control,
    handleSubmit,
    formState: { errors },
    // ELIMINADO: setValue, watch (si no se usan para otra cosa)
  } = useForm<PracticeEvaluationFormType>({ // Usamos el tipo renombrado
    resolver: zodResolver(practiceEvaluationSchema),
    defaultValues: {
      travelAvailability: [],
      relocationWillingness: 'No',
      englishLevel: '',
      finalEvaluation: 'Apto',
      evaluationDate: new Date().toISOString().split('T')[0],
      // Asegúrate de que todos los campos con puntuación (1-10) tienen un default numérico
      meticulousness: 5, teamwork: 5, adaptability: 5, stressTolerance: 5, verbalCommunication: 5,
      commitment: 5, initiative: 5, charisma: 5, learningCapability: 5, writtenCommunication: 5,
      problemSolving: 5, taskCommitment: 5, organized: 5, newChallenges: 5, adaptationToSystems: 5,
      efficiency: 5, punctuality: 5, serviceImprovements: 5, diagnosticSkills: 5, innovativeSolutions: 5,
      sharingKnowledge: 5, toolsUsage: 5, performanceRating: 5 // Si no tienen un default, Zod lanzará un error para `number`
    }
  });

  // ELIMINADO: useEffect para cargar datos, ya no es necesario
  // useEffect(() => { ... loadEvaluationData(); ... }, [id]);

  const onSubmit = async (data: PracticeEvaluationFormType) => { // Usamos el tipo renombrado
    // ELIMINADO: if (!id) return; // Ya no hay ID en la URL para validar
    
    setIsLoading(true);
    try {
      // CAMBIO CLAVE: Llamada a la función de servicio sin el ID
      await savePracticeEvaluationResponse(data); 
      setIsSubmitted(true);
      toast.success('Valoración de prácticas enviada correctamente');
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast.error('Error al enviar la valoración de prácticas');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Renderizado Condicional ---

  // 1. Si ya se envió el formulario
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-green-600">¡Evaluación Enviada!</CardTitle>
            <CardDescription>
              Gracias por completar la valoración de prácticas. Sus respuestas han sido registradas correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Opcional: Puedes redirigir a una página de inicio o dejar que el usuario cierre */}
            <Button onClick={() => navigate('/')} className="w-full">
              Cerrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ELIMINADO: El bloque `if (!id)` ya no es necesario, el formulario siempre estará disponible.
  // if (!id) { ... }

  // Opcional: Si `useWorkCenters` es asíncrono y quieres un spinner mientras carga los centros de trabajo
  if (isLoadingWorkCenters) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg text-blue-700">Cargando centros de trabajo...</p>
      </div>
    );
  }

  // 3. Si no está enviado y no hay errores de "enlace no válido", muestra el formulario
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            {/* Título actualizado para reflejar que es una "nueva" evaluación */}
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-300">
              Nueva Valoración de Prácticas
            </CardTitle>
            <CardDescription>
              Complete todos los campos requeridos para enviar la evaluación de prácticas.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Datos del Tutor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  Datos del Tutor
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tutorName">Nombre del Tutor de GEE *</Label>
                    <Controller
                      name="tutorName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.tutorName ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.tutorName && (
                      <p className="text-red-500 text-sm mt-1">{errors.tutorName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="tutorLastName">Apellidos del Tutor de GEE *</Label>
                    <Controller
                      name="tutorLastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.tutorLastName ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.tutorLastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.tutorLastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="workCenter">Centro de Trabajo *</Label>
                  <Controller
                    name="workCenter"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.workCenter ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccione un centro de trabajo" />
                        </SelectTrigger>
                        <SelectContent>
                          {workCenters.map((center: any) => ( // Ajusta el tipo de `center` si es necesario
                            <SelectItem key={center.id} value={center.displayText}>
                              {center.displayText}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.workCenter && (
                    <p className="text-red-500 text-sm mt-1">{errors.workCenter.message}</p>
                  )}
                </div>
              </div>

              {/* Datos del Alumno */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  Datos del Alumno
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Nombre del Alumno *</Label>
                    <Controller
                      name="studentName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.studentName ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.studentName && (
                      <p className="text-red-500 text-sm mt-1">{errors.studentName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="studentLastName">Apellidos del Alumno *</Label>
                    <Controller
                      name="studentLastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.studentLastName ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.studentLastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.studentLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formation">Formación *</Label>
                    <Controller
                      name="formation"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.formation ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.formation && (
                      <p className="text-red-500 text-sm mt-1">{errors.formation.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="institution">Instituto/Universidad *</Label>
                    <Controller
                      name="institution"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.institution ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.institution && (
                      <p className="text-red-500 text-sm mt-1">{errors.institution.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="practices">Prácticas *</Label>
                  <Controller
                    name="practices"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className={errors.practices ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.practices && (
                    <p className="text-red-500 text-sm mt-1">{errors.practices.message}</p>
                  )}
                </div>
              </div>

              {/* Competencias */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  COMPETENCIAS
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'meticulousness', label: 'Meticulosidad' },
                    { name: 'teamwork', label: 'Trabajo en Equipo / Participativo' },
                    { name: 'adaptability', label: 'Adaptabilidad / Flexibilidad' },
                    { name: 'stressTolerance', label: 'Tolerancia al estrés' },
                    { name: 'verbalCommunication', label: 'Comunicación Verbal' },
                    { name: 'commitment', label: 'Compromiso' },
                    { name: 'initiative', label: 'Iniciativa' },
                    { name: 'charisma', label: 'Carisma / Liderazgo' },
                    { name: 'learningCapability', label: 'Capacidad de Aprendizaje' },
                    { name: 'writtenCommunication', label: 'Comunicación Escrita' },
                    { name: 'problemSolving', label: 'Persona Resolutiva' },
                    { name: 'taskCommitment', label: 'Compromiso con las Tareas' },
                  ].map((field) => (
                    <div key={field.name}>
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Controller
                        name={field.name as keyof PracticeEvaluationFormType}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...controllerField}
                            onChange={(e) => controllerField.onChange(parseInt(e.target.value) || 1)}
                            className={errors[field.name as keyof PracticeEvaluationFormType] ? 'border-red-500' : ''}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Aptitudes Organizativas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  APTITUDES ORGANIZATIVAS
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'organized', label: 'Organizado, Metódico, Ordenado' },
                    { name: 'newChallenges', label: 'Asume nuevos retos' },
                    { name: 'adaptationToSystems', label: 'Adaptación a nuevos sistemas de trabajo' },
                    { name: 'efficiency', label: 'Eficiencia' },
                    { name: 'punctuality', label: 'Puntualidad' },
                  ].map((field) => (
                    <div key={field.name}>
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Controller
                        name={field.name as keyof PracticeEvaluationFormType}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...controllerField}
                            onChange={(e) => controllerField.onChange(parseInt(e.target.value) || 1)}
                            className={errors[field.name as keyof PracticeEvaluationFormType] ? 'border-red-500' : ''}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Aptitudes Técnicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  APTITUDES TÉCNICAS
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'serviceImprovements', label: 'Propone mejoras en servicio de electromedicina' },
                    { name: 'diagnosticSkills', label: 'Habilidad en diagnóstico y detección de averías' },
                    { name: 'innovativeSolutions', label: 'Aporta soluciones innovadoras' },
                    { name: 'sharingKnowledge', label: 'Comparte soluciones y problemas' },
                    { name: 'toolsUsage', label: 'Uso correcto de herramientas informáticas (MantHosp, etc.)' },
                  ].map((field) => (
                    <div key={field.name}>
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Controller
                        name={field.name as keyof PracticeEvaluationFormType}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...controllerField}
                            onChange={(e) => controllerField.onChange(parseInt(e.target.value) || 1)}
                            className={errors[field.name as keyof PracticeEvaluationFormType] ? 'border-red-500' : ''}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Otros Datos de Interés */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  OTROS DATOS DE INTERÉS
                </h3>
                
                <div>
                  <Label>Disponibilidad para viajar</Label>
                  <div className="flex space-x-4 mt-2">
                    <Controller
                      name="travelAvailability"
                      control={control}
                      render={({ field }) => (
                        <>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="nacional"
                              checked={field.value?.includes('Nacional')}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, 'Nacional']);
                                } else {
                                  field.onChange(currentValue.filter(v => v !== 'Nacional'));
                                }
                              }}
                            />
                            <Label htmlFor="nacional">Nacional</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="internacional"
                              checked={field.value?.includes('Internacional')}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, 'Internacional']);
                                } else {
                                  field.onChange(currentValue.filter(v => v !== 'Internacional'));
                                }
                              }}
                            />
                            <Label htmlFor="internacional">Internacional</Label>
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label>Disponibilidad para cambio de residencia</Label>
                  <Controller
                    name="relocationWillingness"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Si" id="relocation-si" />
                          <Label htmlFor="relocation-si">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="relocation-no" />
                          <Label htmlFor="relocation-no">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="englishLevel">Nivel de Inglés *</Label>
                  <Controller
                    name="englishLevel"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.englishLevel ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Elija una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bajo (A1, A2)">Bajo (A1, A2)</SelectItem>
                          <SelectItem value="Medio (B1)">Medio (B1)</SelectItem>
                          <SelectItem value="Alto (B2)">Alto (B2)</SelectItem>
                          <SelectItem value="Muy Alto (C1, C2)">Muy Alto (C1, C2)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.englishLevel && (
                    <p className="text-red-500 text-sm mt-1">{errors.englishLevel.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="performanceRating">
                    Valora el desempeño del alumno durante las prácticas
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Por favor, escribe un número entre 1 y 10. Valore del 1 al 10 (siendo 1 la valoración más baja y 10 la más alta)
                  </p>
                  <Controller
                    name="performanceRating"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        className={errors.performanceRating ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.performanceRating && (
                    <p className="text-red-500 text-sm mt-1">{errors.performanceRating.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="performanceJustification">Justifica tu respuesta *</Label>
                  <Controller
                    name="performanceJustification"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className={errors.performanceJustification ? 'border-red-500' : ''}
                        rows={4}
                      />
                    )}
                  />
                  {errors.performanceJustification && (
                    <p className="text-red-500 text-sm mt-1">{errors.performanceJustification.message}</p>
                  )}
                </div>

                <div>
                  <Label>Valoración Final *</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Indica si consideras que podría ser interesante contar con el alumno en el GEE ahora o en el futuro
                  </p>
                  <Controller
                    name="finalEvaluation"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Apto" id="evaluation-apto" />
                          <Label htmlFor="evaluation-apto">Apto</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No Apto" id="evaluation-no-apto" />
                          <Label htmlFor="evaluation-no-apto">No Apto</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.finalEvaluation && (
                    <p className="text-red-500 text-sm mt-1">{errors.finalEvaluation.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="practicalTraining">Formación Práctica Recibida</Label>
                  <Controller
                    name="practicalTraining"
                    control={control}
                    render={({ field }) => (
                      <Textarea {...field} rows={4} />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="observations">Observaciones</Label>
                  <Controller
                    name="observations"
                    control={control}
                    render={({ field }) => (
                      <Textarea {...field} rows={4} />
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evaluatorName">Nombre y Apellidos del Evaluador *</Label>
                    <Controller
                      name="evaluatorName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={errors.evaluatorName ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.evaluatorName && (
                      <p className="text-red-500 text-sm mt-1">{errors.evaluatorName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="evaluationDate">Fecha *</Label>
                    <Controller
                      name="evaluationDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          {...field}
                          value={typeof field.value === 'string' ? field.value : ''}
                          className={errors.evaluationDate ? 'border-red-500' : ''}
                        />
                      )}
                    />
                    {errors.evaluationDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.evaluationDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Evaluación'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}