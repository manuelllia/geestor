import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { savePracticeEvaluation, PracticeEvaluationData } from '../services/practiceEvaluationService';
import { useWorkCenters } from '../hooks/useWorkCenters';

const formSchema = z.object({
  tutorName: z.string().min(2, {
    message: "El nombre del tutor debe tener al menos 2 caracteres.",
  }),
  tutorLastName: z.string().min(2, {
    message: "El apellido del tutor debe tener al menos 2 caracteres.",
  }),
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
  evaluationDate: z.date(),
});

type FormData = z.infer<typeof formSchema>;

const PracticeEvaluationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { workCenters, isLoading: workCentersLoading, error: workCentersError } = useWorkCenters();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tutorName: "",
      tutorLastName: "",
      workCenter: "",
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

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Construct the evaluation data with nested structure for service
      const evaluationData: PracticeEvaluationData = {
        tutorName: data.tutorName,
        tutorLastName: data.tutorLastName,
        workCenter: data.workCenter,
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

      const docId = await savePracticeEvaluation(evaluationData);
      
      toast.success('Evaluación guardada exitosamente');
      console.log('Evaluación guardada con ID:', docId);
      
      // Reset form after successful submission
      form.reset();
      
    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
      toast.error('Error al guardar la evaluación');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-800">
              Formulario de Evaluación de Prácticas
            </CardTitle>
            <p className="text-gray-600 mt-4">
              Completa esta evaluación para registrar el rendimiento y las competencias del estudiante durante sus prácticas.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Datos básicos */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">Datos básicos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tutorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del tutor</FormLabel>
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
                          <FormLabel>Apellido del tutor</FormLabel>
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
                          <FormLabel>Centro de trabajo *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={workCentersLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={workCentersLoading ? "Cargando centros..." : "Seleccionar centro de trabajo"} />
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
                          {workCentersError && (
                            <p className="text-sm text-red-600">{workCentersError}</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del estudiante</FormLabel>
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
                          <FormLabel>Apellido del estudiante</FormLabel>
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
                <div>
                  <h2 className="text-xl font-semibold mb-2">Competencias (1-10)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                value={field.value as number}
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
                <div>
                  <h2 className="text-xl font-semibold mb-2">Aptitudes Organizativas (1-10)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                value={field.value as number}
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
                <div>
                  <h2 className="text-xl font-semibold mb-2">Aptitudes Técnicas (1-10)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                value={field.value as number}
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
                <div>
                  <h2 className="text-xl font-semibold mb-2">Otros datos de interés</h2>
                  <FormField
                    control={form.control}
                    name="travelAvailability"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-semibold">
                          Disponibilidad para viajar
                        </FormLabel>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="national"
                              checked={field.value?.includes("national")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "national"])
                                } else {
                                  field.onChange(field.value?.filter((v) => v !== "national"))
                                }
                              }}
                            />
                            <label
                              htmlFor="national"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Nacional
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="international"
                              checked={field.value?.includes("international")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "international"])
                                } else {
                                  field.onChange(field.value?.filter((v) => v !== "international"))
                                }
                              }}
                            />
                            <label
                              htmlFor="international"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Internacional
                            </label>
                          </div>
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
                        <FormLabel>Cambio de residencia</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="Si" />
                              </FormControl>
                              <FormLabel>Si</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="No" />
                              </FormControl>
                              <FormLabel>No</FormLabel>
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
                        <FormLabel>Nivel de inglés</FormLabel>
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
                          <FormLabel>Valoración del rendimiento (1-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="Valoración del rendimiento"
                              value={field.value}
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
                          <FormLabel>Justificación del rendimiento</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Justificación del rendimiento"
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
                        <FormLabel>Evaluación final</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="Apto" />
                              </FormControl>
                              <FormLabel>Apto</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="No Apto" />
                              </FormControl>
                              <FormLabel>No Apto</FormLabel>
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
                        <FormLabel>Interés futuro</FormLabel>
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
                        <FormLabel>Formación práctica</FormLabel>
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
                          <Textarea placeholder="Observaciones" {...field} />
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
                          <FormLabel>Nombre del evaluador</FormLabel>
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
                          <FormLabel>Fecha de evaluación</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="w-[240px] pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    field.value?.toLocaleDateString()
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
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

                <div className="flex justify-center pt-8">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Evaluación"}
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
