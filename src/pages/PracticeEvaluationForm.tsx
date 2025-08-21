import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Send, CheckCircle, Loader2 } from 'lucide-react'; // Importa Loader2 para el spinner de carga

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription, // Útil para mensajes de carga/error del Select
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { savePracticeEvaluation, PracticeEvaluationData } from '../services/practiceEvaluationService';
// Importa el servicio y la interfaz para los centros de trabajo
import { getWorkCenters, WorkCenter } from '../services/workCentersService'; // Asegúrate de que la ruta sea correcta

// Esquema de validación (sin cambios, ya es correcto)
const formSchema = z.object({
  tutorName: z.string().min(2, {
    message: "El nombre del tutor debe tener al menos 2 caracteres.",
  }),
  tutorLastName: z.string().min(2, {
    message: "El apellido del tutor debe tener al menos 2 caracteres.",
  }),
  // El centro de trabajo ahora validará la cadena de texto completa (ID - Nombre)
  workCenter: z.string().min(2, {
    message: "El centro de trabajo debe tener al menos 2 caracteres.",
  }),
  studentName: z.string().min(2, {
    message: "El nombre del estudiante debe tener al menos 2 caracteres.",
  }),
  studentLastName: z.string().min(2, {
    message: "El apellido del estudiante debe tener al menos 2 caracteres.",
  }),
  formation: z.string().min(2, {
    message: "La formación debe tener al menos 2 caracteres.",
  }),
  institution: z.string().min(2, {
    message: "La institución debe tener al menos 2 caracteres.",
  }),
  practices: z.string().min(2, {
    message: "Las prácticas deben tener al menos 2 caracteres.",
  }),
  meticulousness: z.number().min(1).max(10),
  teamwork: z.number().min(1).max(10),
  adaptability: z.number().min(1).max(10),
  stressTolerance: z.number().min(1).max(10),
  verbalCommunication: z.number().min(1).max(10),
  commitment: z.number().min(1).max(10),
  initiative: z.number().min(1).max(10),
  charisma: z.number().min(1).max(10),
  learningCapacity: z.number().min(1).max(10),
  writtenCommunication: z.number().min(1).max(10),
  problemSolving: z.number().min(1).max(10),
  taskCommitment: z.number().min(1).max(10),
  organized: z.number().min(1).max(10),
  newChallenges: z.number().min(1).max(10),
  systemAdaptation: z.number().min(1).max(10),
  efficiency: z.number().min(1).max(10),
  punctuality: z.number().min(1).max(10),
  serviceImprovements: z.number().min(1).max(10),
  diagnosticSkills: z.number().min(1).max(10),
  innovativeSolutions: z.number().min(1).max(10),
  sharesSolutions: z.number().min(1).max(10),
  toolUsage: z.number().min(1).max(10),
  travelAvailability: z.string().array().optional(),
  residenceChange: z.enum(["Si", "No"]),
  englishLevel: z.string().optional(),
  performanceRating: z.number().min(1).max(10),
  performanceJustification: z.string().min(10, {
    message: "La justificación del rendimiento debe tener al menos 10 caracteres.",
  }),
  finalEvaluation: z.enum(["Apto", "No Apto"]),
  futureInterest: z.string().optional(),
  practicalTraining: z.string().optional(),
  observations: z.string().optional(),
  evaluatorName: z.string().min(2, {
    message: "El nombre del evaluador debe tener al menos 2 caracteres.",
  }),
  evaluationDate: z.date({
    required_error: 'La fecha de evaluación es obligatoria', // Añadir mensaje de error para fecha
  }),
});

type FormData = z.infer<typeof formSchema>;

const PracticeEvaluationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Nuevos estados para cargar los centros de trabajo
  const [workCentersOptions, setWorkCentersOptions] = useState<WorkCenter[]>([]);
  const [isLoadingWorkCenters, setIsLoadingWorkCenters] = useState(true);
  const [workCentersError, setWorkCentersError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tutorName: "",
      tutorLastName: "",
      workCenter: "", // El valor por defecto puede ser una cadena vacía
      studentName: "",
      studentLastName: "",
      formation: "",
      institution: "",
      practices: "",
      meticulousness: 5,
      teamwork: 5,
      adaptability: 5,
      stressTolerance: 5,
      verbalCommunication: 5,
      commitment: 5,
      initiative: 5,
      charisma: 5,
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
      residenceChange: "No",
      englishLevel: "",
      performanceRating: 5,
      performanceJustification: "",
      finalEvaluation: "Apto",
      futureInterest: "",
      practicalTraining: "",
      observations: "",
      evaluatorName: "",
      evaluationDate: new Date(),
    },
  });

  // useEffect para cargar los centros de trabajo
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setIsLoadingWorkCenters(true);
        setWorkCentersError(null);
        const centers = await getWorkCenters();
        setWorkCentersOptions(centers);
      } catch (err) {
        console.error('Error al cargar centros de trabajo:', err);
        setWorkCentersError('Error al cargar los centros de trabajo. Intente recargar la página.');
      } finally {
        setIsLoadingWorkCenters(false);
      }
    };
    fetchCenters();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Construye los datos de la evaluación con la estructura anidada para el servicio
      const evaluationData: PracticeEvaluationData = {
        tutorName: data.tutorName,
        tutorLastName: data.tutorLastName,
        workCenter: data.workCenter, // Este campo ahora contendrá "ID - Nombre"
        studentName: data.studentName,
        studentLastName: data.studentLastName,
        formation: data.formation,
        institution: data.institution,
        practices: data.practices,
        competencies: {
          meticulousness: data.meticulousness,
          teamwork: data.teamwork,
          adaptability: data.adaptability,
          stressTolerance: data.stressTolerance,
          verbalCommunication: data.verbalCommunication,
          commitment: data.commitment,
          initiative: data.initiative,
          charisma: data.charisma,
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
        englishLevel: data.englishLevel || '',
        performanceRating: data.performanceRating,
        performanceJustification: data.performanceJustification,
        finalEvaluation: data.finalEvaluation,
        futureInterest: data.futureInterest,
        practicalTraining: data.practicalTraining,
        observations: data.observations,
        evaluatorName: data.evaluatorName,
        evaluationDate: data.evaluationDate
      };

      await savePracticeEvaluation(evaluationData);

      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const competencyFields = [
    { key: 'meticulousness', label: 'Meticulosidad' },
    { key: 'teamwork', label: 'Trabajo en Equipo' },
    { key: 'adaptability', label: 'Adaptabilidad' },
    { key: 'stressTolerance', label: 'Tolerancia al Estrés' },
    { key: 'verbalCommunication', label: 'Comunicación Verbal' },
    { key: 'commitment', label: 'Compromiso' },
    { key: 'initiative', label: 'Iniciativa' },
    { key: 'charisma', label: 'Carisma' },
    { key: 'learningCapacity', label: 'Capacidad de Aprendizaje' },
    { key: 'writtenCommunication', label: 'Comunicación Escrita' },
    { key: 'problemSolving', label: 'Resolución de Problemas' },
    { key: 'taskCommitment', label: 'Compromiso con la Tarea' },
  ];

  const organizationalFields = [
    { key: 'organized', label: 'Organizado' },
    { key: 'newChallenges', label: 'Nuevos Retos' },
    { key: 'systemAdaptation', label: 'Adaptación al Sistema' },
    { key: 'efficiency', label: 'Eficiencia' },
    { key: 'punctuality', label: 'Puntualidad' },
  ];

  const technicalFields = [
    { key: 'serviceImprovements', label: 'Mejoras del Servicio' },
    { key: 'diagnosticSkills', label: 'Habilidades de Diagnóstico' },
    { key: 'innovativeSolutions', label: 'Soluciones Innovadoras' },
    { key: 'sharesSolutions', label: 'Comparte Soluciones' },
    { key: 'toolUsage', label: 'Uso de Herramientas' },
  ];

  // Si el formulario ha sido enviado, muestra la pantalla de éxito
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¡Evaluación enviada correctamente!
            </h2>
            <p className="text-gray-600 mb-6">
              Gracias por completar la evaluación de prácticas.
            </p>
            <p className="text-sm text-gray-500">
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
        <Card className="border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-800">
              Formulario de Evaluación de Prácticas
            </CardTitle>
            <p className="text-gray-600 mt-4">
              Por favor, completa este formulario para evaluar el desempeño del estudiante en sus prácticas.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Datos básicos */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-800">Datos Básicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tutorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Tutor</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del tutor" {...field} />
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
                          <FormLabel>Apellido del Tutor</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellido del tutor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workCenter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Centro de Trabajo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value} // Usa value para un componente controlado
                            disabled={isLoadingWorkCenters || !!workCentersError} // Deshabilita si carga o hay error
                          >
                            <FormControl>
                              <SelectTrigger>
                                {isLoadingWorkCenters ? (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando centros...
                                  </div>
                                ) : workCentersError ? (
                                  <span className="text-destructive">{workCentersError}</span>
                                ) : (
                                  <SelectValue placeholder="Centro de trabajo" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workCentersOptions.map((center) => (
                                <SelectItem key={center.id} value={center.displayText}>
                                  {center.displayText}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {/* Opcional: Mostrar el mensaje de error/carga debajo del Select */}
                          {isLoadingWorkCenters && (
                            <FormDescription>Cargando centros de trabajo...</FormDescription>
                          )}
                          {workCentersError && (
                            <FormMessage>{workCentersError}</FormMessage>
                          )}
                          <FormMessage /> {/* Muestra errores de validación del zod */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Estudiante</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del estudiante" {...field} />
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
                          <FormLabel>Apellido del Estudiante</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellido del estudiante" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="formation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formación</FormLabel>
                          <FormControl>
                            <Input placeholder="Formación" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institución</FormLabel>
                          <FormControl>
                            <Input placeholder="Institución" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="practices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prácticas</FormLabel>
                          <FormControl>
                            <Input placeholder="Prácticas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Competencias */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-800">Competencias (1-10)</h3>
                  <p className="text-gray-600">
                    Puntúa las siguientes competencias en una escala del 1 al 10 (1: muy deficiente, 10: excelente).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {competencyFields.map(({ key, label }) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof FormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                placeholder={label}
                                value={typeof field.value === 'number' ? field.value.toString() : ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Aptitudes Organizativas */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-800">Aptitudes Organizativas (1-10)</h3>
                  <p className="text-gray-600">
                    Puntúa las siguientes aptitudes organizativas en una escala del 1 al 10.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {organizationalFields.map(({ key, label }) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof FormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                placeholder={label}
                                value={typeof field.value === 'number' ? field.value.toString() : ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Aptitudes Técnicas */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-800">Aptitudes Técnicas (1-10)</h3>
                  <p className="text-gray-600">
                    Puntúa las siguientes aptitudes técnicas en una escala del 1 al 10.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {technicalFields.map(({ key, label }) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof FormData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                placeholder={label}
                                value={typeof field.value === 'number' ? field.value.toString() : ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Otros datos de interés */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-800">Otros Datos de Interés</h3>
                  <FormField
                    control={form.control}
                    name="travelAvailability"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-semibold">
                          Disponibilidad para viajar
                        </FormLabel>
                        <div className="flex flex-col space-y-2">
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("national")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), "national"])
                                    : field.onChange(field.value?.filter((v) => v !== "national"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Nacional
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("international")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), "international"])
                                    : field.onChange(field.value?.filter((v) => v !== "international"))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Internacional
                            </FormLabel>
                          </FormItem>
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
                        <FormLabel>Cambio de Residencia</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2" // Ajustado el espacio
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="Si" />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">Si</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="No" />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">No</FormLabel>
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
                              <SelectValue placeholder="Selecciona un nivel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A1">A1</SelectItem>
                            <SelectItem value="A2">A2</SelectItem>
                            <SelectItem value="B1">B1</SelectItem>
                            <SelectItem value="B2">B2</SelectItem>
                            <SelectItem value="C1">C1</SelectItem>
                            <SelectItem value="C2">C2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="performanceRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valoración del Rendimiento (1-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="Valoración del rendimiento"
                              value={typeof field.value === 'number' ? field.value.toString() : ''}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
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
                          <FormLabel>Justificación del Rendimiento</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Justificación del rendimiento"
                              className="min-h-[100px]"
                              {...field}
                            />
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
                        <FormLabel>Evaluación Final</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="Apto" />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">Apto</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="No Apto" />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">No Apto</FormLabel>
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
                        <FormLabel>Interés Futuro</FormLabel>
                        <FormControl>
                          <Input placeholder="Interés futuro" {...field} />
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
                        <FormLabel>Formación Práctica</FormLabel>
                        <FormControl>
                          <Input placeholder="Formación práctica" {...field} />
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
                          <Textarea
                            placeholder="Observaciones"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="evaluatorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Evaluador</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del evaluador" {...field} />
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
                          <FormLabel>Fecha de Evaluación</FormLabel>
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
                                disabled={(date) =>
                                  date > new Date()
                                }
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

                {/* Botón de envío */}
                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "Enviando..." : "Enviar Evaluación"}
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

export default PracticeEvaluationForm;