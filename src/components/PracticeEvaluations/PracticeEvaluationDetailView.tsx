
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Calendar, MapPin, GraduationCap, User, Star } from 'lucide-react';
import { PracticeEvaluationRecord } from '../../services/practiceEvaluationService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PracticeEvaluationDetailViewProps {
  evaluation: PracticeEvaluationRecord;
  onClose: () => void;
}

export default function PracticeEvaluationDetailView({ evaluation, onClose }: PracticeEvaluationDetailViewProps) {
  const renderSkillSection = (title: string, skills: { [key: string]: number }, icon: React.ReactNode) => (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(skills).map(([skill, value]) => (
            <div key={skill} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm font-medium capitalize">
                {skill.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= value 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-300">{value}/10</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              Valoración de Prácticas
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {evaluation.studentName} {evaluation.studentLastName}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <User className="w-5 h-5" />
                  Información del Estudiante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                  <p className="font-semibold">{evaluation.studentName} {evaluation.studentLastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Institución</p>
                  <p>{evaluation.institution}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Formación</p>
                  <p>{evaluation.formation}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <MapPin className="w-5 h-5" />
                  Información del Tutor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tutor</p>
                  <p className="font-semibold">{evaluation.tutorName} {evaluation.tutorLastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Centro de Trabajo</p>
                  <p>{evaluation.workCenter}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Evaluador</p>
                  <p>{evaluation.evaluatorName}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Calendar className="w-5 h-5" />
                  Información de Evaluación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Evaluación</p>
                  <p className="font-semibold">
                    {format(evaluation.evaluationDate, 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Evaluación Final</p>
                  <Badge variant={evaluation.finalEvaluation === 'Apto' ? 'default' : 'destructive'}>
                    {evaluation.finalEvaluation}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valoración General</p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {evaluation.performanceRating}/10
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Competencias */}
          {renderSkillSection(
            'Competencias Profesionales',
            evaluation.competencies,
            <GraduationCap className="w-5 h-5" />
          )}

          {/* Aptitudes Organizativas */}
          {renderSkillSection(
            'Aptitudes Organizativas',
            evaluation.organizationalSkills,
            <MapPin className="w-5 h-5" />
          )}

          {/* Aptitudes Técnicas */}
          {renderSkillSection(
            'Aptitudes Técnicas',
            evaluation.technicalSkills,
            <Star className="w-5 h-5" />
          )}

          <Separator />

          {/* Información Adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Disponibilidad para Viajar</p>
                  <p>{evaluation.travelAvailability?.join(', ') || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cambio de Residencia</p>
                  <p>{evaluation.residenceChange}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nivel de Inglés</p>
                  <p>{evaluation.englishLevel}</p>
                </div>
                {evaluation.futureInterest && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interés Futuro</p>
                    <p>{evaluation.futureInterest}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Observaciones y Justificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Justificación de la Valoración</p>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    {evaluation.performanceJustification}
                  </p>
                </div>
                {evaluation.observations && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Observaciones Adicionales</p>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {evaluation.observations}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
