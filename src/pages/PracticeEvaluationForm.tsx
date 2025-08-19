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

import { savePracticeEvaluation, PracticeEvaluationData } from '../services/practiceEvaluationService';

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
  competencies: z.object({
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
  }),
  organizationalSkills: z.object({
    organized: z.number().min(1).max(10),
    newChallenges: z.number().min(1).max(10),
    systemAdaptation: z.number().min(1).max(10),
    efficiency: z.number().min(1).max(10),
    punctuality: z.number().min(1).max(10),
  }),
  technicalSkills: z.object({
    serviceImprovements: z.number().min(1).max(10),
    diagnosticSkills: z.number().min(1).max(10),
    innovativeSolutions: z.number().min(1).max(10),
    sharesSolutions: z.number().min(1).max(10),
    toolUsage: z.number().min(1).max(10),
  }),
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
      competencies: {
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
      },
      organizationalSkills: {
        organized: 5,
        newChallenges: 5,
        systemAdaptation: 5,
        efficiency: 5,
        punctuality: 5,
      },
      technicalSkills: {
        serviceImprovements: 5,
        diagnosticSkills: 5,
        innovativeSolutions: 5,
        sharesSolutions: 5,
        toolUsage: 5,
      },
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
      
      // Validate that all required fields are present
      const requiredFields = [
        'tutorName', 'tutorLastName', 'workCenter', 'studentName', 'studentLastName',
        'formation', 'institution', 'practices', 'performanceRating', 
        'performanceJustification', 'finalEvaluation', 'evaluatorName'
      ];
      
      const missingFields = requiredFields.filter(field => !data[field as keyof FormData]);
      
      if (missingFields.length > 0) {
        toast.error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        return;
      }

      // Construct the evaluation data with all required fields
      const evaluationData: PracticeEvaluationData = {
        tutorName: data.tutorName!,
        tutorLastName: data.tutorLastName!,
        workCenter: data.workCenter!,
        studentName: data.studentName!,
        studentLastName: data.studentLastName!,
        formation: data.formation!,
        institution: data.institution!,
        practices: data.practices!,
        competencies: data.competencies,
        organizationalSkills: data.organizationalSkills,
        technicalSkills: data.technicalSkills,
        travelAvailability: data.travelAvailability,
        residenceChange: data.residenceChange,
        englishLevel: data.englishLevel || '',
        performanceRating: data.performanceRating!,
        performanceJustification: data.performanceJustification!,
        finalEvaluation: data.finalEvaluation!,
        futureInterest: data.futureInterest,
        practicalTraining: data.practicalTraining,
        observations: data.observations,
        evaluatorName: data.evaluatorName!,
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Formulario de Evaluación de Prácticas</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Datos básicos */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Datos básicos</h2>
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
                    <FormLabel>Centro de trabajo</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro de trabajo" {...field} />
                    </FormControl>
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
              {Object.entries(formSchema.shape.competencies.shape).map(([key, value]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`competencies.${key}` as keyof FormData["competencies"]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{key}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={key}
                          {...field}
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
              {Object.entries(formSchema.shape.organizationalSkills.shape).map(([key, value]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`organizationalSkills.${key}` as keyof FormData["organizationalSkills"]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{key}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={key}
                          {...field}
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
              {Object.entries(formSchema.shape.technicalSkills.shape).map(([key, value]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`technicalSkills.${key}` as keyof FormData["technicalSkills"]}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{key}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={key}
                          {...field}
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
                        placeholder="Valoración del rendimiento"
                        {...field}
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PracticeEvaluationForm;
