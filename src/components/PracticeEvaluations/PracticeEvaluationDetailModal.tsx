
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, User, Building, GraduationCap, Star, CheckCircle, XCircle } from 'lucide-react';
import { PracticeEvaluationRecord } from '../../services/practiceEvaluationService';
import { useEnhancedPDFExport } from '../../hooks/useEnhancedPDFExport';

interface PracticeEvaluationDetailModalProps {
  evaluation: PracticeEvaluationRecord;
  isOpen: boolean;
  onClose: () => void;
}

const PracticeEvaluationDetailModal: React.FC<PracticeEvaluationDetailModalProps> = ({
  evaluation,
  isOpen,
  onClose,
}) => {
  const { exportToPDF } = useEnhancedPDFExport();

  const handleExportPDF = () => {
    const sections = [
      {
        title: 'Información General',
        fields: [
          { label: 'Nombre del Tutor', value: `${evaluation.tutorName} ${evaluation.tutorLastName}` },
          { label: 'Centro de Trabajo', value: evaluation.workCenter },
          { label: 'Nombre del Estudiante', value: `${evaluation.studentName} ${evaluation.studentLastName}` },
          { label: 'Formación', value: evaluation.formation },
          { label: 'Institución', value: evaluation.institution },
          { label: 'Prácticas', value: evaluation.practices },
          { label: 'Fecha de Evaluación', value: evaluation.evaluationDate, type: 'date' as const },
        ]
      },
      {
        title: 'Competencias (1-10)',
        fields: [
          { label: 'Meticulosidad', value: evaluation.competencies.meticulousness, type: 'number' as const },
          { label: 'Trabajo en Equipo', value: evaluation.competencies.teamwork, type: 'number' as const },
          { label: 'Adaptabilidad', value: evaluation.competencies.adaptability, type: 'number' as const },
          { label: 'Tolerancia al Estrés', value: evaluation.competencies.stressTolerance, type: 'number' as const },
          { label: 'Comunicación Verbal', value: evaluation.competencies.verbalCommunication, type: 'number' as const },
          { label: 'Compromiso', value: evaluation.competencies.commitment, type: 'number' as const },
          { label: 'Iniciativa', value: evaluation.competencies.initiative, type: 'number' as const },
          { label: 'Carisma', value: evaluation.competencies.charisma, type: 'number' as const },
          { label: 'Capacidad de Aprendizaje', value: evaluation.competencies.learningCapacity, type: 'number' as const },
          { label: 'Comunicación Escrita', value: evaluation.competencies.writtenCommunication, type: 'number' as const },
          { label: 'Resolución de Problemas', value: evaluation.competencies.problemSolving, type: 'number' as const },
          { label: 'Compromiso con las Tareas', value: evaluation.competencies.taskCommitment, type: 'number' as const },
        ]
      },
      {
        title: 'Aptitudes Organizativas (1-10)',
        fields: [
          { label: 'Organizado', value: evaluation.organizationalSkills.organized, type: 'number' as const },
          { label: 'Nuevos Desafíos', value: evaluation.organizationalSkills.newChallenges, type: 'number' as const },
          { label: 'Adaptación al Sistema', value: evaluation.organizationalSkills.systemAdaptation, type: 'number' as const },
          { label: 'Eficiencia', value: evaluation.organizationalSkills.efficiency, type: 'number' as const },
          { label: 'Puntualidad', value: evaluation.organizationalSkills.punctuality, type: 'number' as const },
        ]
      },
      {
        title: 'Aptitudes Técnicas (1-10)',
        fields: [
          { label: 'Mejoras de Servicio', value: evaluation.technicalSkills.serviceImprovements, type: 'number' as const },
          { label: 'Habilidades de Diagnóstico', value: evaluation.technicalSkills.diagnosticSkills, type: 'number' as const },
          { label: 'Soluciones Innovadoras', value: evaluation.technicalSkills.innovativeSolutions, type: 'number' as const },
          { label: 'Comparte Soluciones', value: evaluation.technicalSkills.sharesSolutions, type: 'number' as const },
          { label: 'Uso de Herramientas', value: evaluation.technicalSkills.toolUsage, type: 'number' as const },
        ]
      },
      {
        title: 'Evaluación Final',
        fields: [
          { label: 'Disponibilidad de Viaje', value: evaluation.travelAvailability?.join(', ') || 'No especificado' },
          { label: 'Cambio de Residencia', value: evaluation.residenceChange },
          { label: 'Nivel de Inglés', value: evaluation.englishLevel },
          { label: 'Calificación de Rendimiento', value: evaluation.performanceRating, type: 'number' as const },
          { label: 'Justificación del Rendimiento', value: evaluation.performanceJustification },
          { label: 'Evaluación Final', value: evaluation.finalEvaluation },
          { label: 'Interés Futuro', value: evaluation.futureInterest || 'No especificado' },
          { label: 'Formación Práctica', value: evaluation.practicalTraining || 'No especificado' },
          { label: 'Observaciones', value: evaluation.observations || 'No especificado' },
          { label: 'Nombre del Evaluador', value: evaluation.evaluatorName },
        ]
      }
    ];

    exportToPDF({
      title: `Valoración de Prácticas - ${evaluation.studentName} ${evaluation.studentLastName}`,
      data: evaluation,
      sections
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 8) return 'default';
    if (rating >= 6) return 'secondary';
    return 'destructive';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <GraduationCap className="w-5 h-5" />
              Valoración de Prácticas - {evaluation.studentName} {evaluation.studentLastName}
            </DialogTitle>
            <Button onClick={handleExportPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="w-4 h-4" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tutor</label>
                <p className="text-sm">{evaluation.tutorName} {evaluation.tutorLastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Centro de Trabajo</label>
                <p className="text-sm">{evaluation.workCenter}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estudiante</label>
                <p className="text-sm">{evaluation.studentName} {evaluation.studentLastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Formación</label>
                <p className="text-sm">{evaluation.formation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Institución</label>
                <p className="text-sm">{evaluation.institution}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Evaluación</label>
                <p className="text-sm">{evaluation.evaluationDate.toLocaleDateString('es-ES')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Competencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Star className="w-4 h-4" />
                Competencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(evaluation.competencies).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Badge variant={getRatingBadgeVariant(value)} className={getRatingColor(value)}>
                      {value}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Aptitudes Organizativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Building className="w-4 h-4" />
                Aptitudes Organizativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(evaluation.organizationalSkills).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Badge variant={getRatingBadgeVariant(value)} className={getRatingColor(value)}>
                      {value}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Aptitudes Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Settings className="w-4 h-4" />
                Aptitudes Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(evaluation.technicalSkills).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Badge variant={getRatingBadgeVariant(value)} className={getRatingColor(value)}>
                      {value}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evaluación Final */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                {evaluation.finalEvaluation === 'Apto' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                Evaluación Final
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Calificación de Rendimiento</label>
                  <Badge variant={getRatingBadgeVariant(evaluation.performanceRating)} className="ml-2">
                    {evaluation.performanceRating}/10
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Evaluación Final</label>
                  <Badge 
                    variant={evaluation.finalEvaluation === 'Apto' ? 'default' : 'destructive'}
                    className="ml-2"
                  >
                    {evaluation.finalEvaluation}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nivel de Inglés</label>
                  <p className="text-sm">{evaluation.englishLevel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cambio de Residencia</label>
                  <p className="text-sm">{evaluation.residenceChange}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-gray-600">Justificación del Rendimiento</label>
                <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{evaluation.performanceJustification}</p>
              </div>
              
              {evaluation.observations && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Observaciones</label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{evaluation.observations}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Evaluador</label>
                <p className="text-sm">{evaluation.evaluatorName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeEvaluationDetailModal;
