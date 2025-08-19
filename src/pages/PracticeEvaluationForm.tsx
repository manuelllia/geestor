import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardCheck, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc, updateDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { savePracticeEvaluation, PracticeEvaluationData } from '../services/practiceEvaluationService';

export default function PracticeEvaluationForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkData, setLinkData] = useState<any>(null);
  const [isValidLink, setIsValidLink] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<Partial<PracticeEvaluationData>>({
    tutorName: '',
    tutorLastName: '',
    workCenter: '',
    studentName: '',
    studentLastName: '',
    formation: '',
    institute: '',
    practices: '',
    competencies: {
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
  });

  // Verificar enlace al cargar
  useEffect(() => {
    const verifyLink = async () => {
      if (!token) {
        setIsValidLink(false);
        setIsLoading(false);
        return;
      }

      try {
        // Buscar el enlace en la colección
        const linksCollection = collection(db, 'Gestión de Talento', 'valoracion-practicas', 'Enlaces');
        const linkQuery = query(linksCollection, where('token', '==', token));
        const linkSnapshot = await getDocs(linkQuery);

        if (linkSnapshot.empty) {
          setIsValidLink(false);
          setIsLoading(false);
          return;
        }

        const linkDoc = linkSnapshot.docs[0];
        const linkInfo = linkDoc.data();

        // Verificar si el enlace está activo y no ha expirado
        const now = new Date();
        const expirationDate = linkInfo.expiresAt?.toDate();

        if (!linkInfo.isActive || linkInfo.isUsed || (expirationDate && now > expirationDate)) {
          setIsValidLink(false);
          setIsLoading(false);
          return;
        }

        // Enlace válido - prellenar datos
        setLinkData({ id: linkDoc.id, ...linkInfo });
        setFormData(prev => ({
          ...prev,
          tutorName: linkInfo.tutorName || '',
          workCenter: linkInfo.workCenter || '',
          studentName: linkInfo.studentName || '',
        }));
        setIsValidLink(true);
      } catch (error) {
        console.error('Error verificando enlace:', error);
        setIsValidLink(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyLink();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tutorName || !formData.studentName || !formData.finalEvaluation) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Guardar evaluación
      const evaluationId = await savePracticeEvaluation(formData as PracticeEvaluationData);

      // Marcar el enlace como usado
      if (linkData) {
        const linkDocRef = doc(db, 'Gestión de Talento', 'valoracion-practicas', 'Enlaces', linkData.id);
        await updateDoc(linkDocRef, {
          isUsed: true,
          usedAt: Timestamp.now(),
          evaluationId
        });
      }

      setIsSubmitted(true);
      toast.success('Evaluación enviada correctamente', {
        description: 'Gracias por completar la valoración de prácticas'
      });

    } catch (error) {
      console.error('Error enviando evaluación:', error);
      toast.error('Error al enviar la evaluación', {
        description: 'Por favor intenta de nuevo'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCompetency = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      competencies: {
        ...prev.competencies!,
        [key]: value
      }
    }));
  };

  const updateOrganizationalSkill = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      organizationalSkills: {
        ...prev.organizationalSkills!,
        [key]: value
      }
    }));
  };

  const updateTechnicalSkill = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills!,
        [key]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Enlace no válido</CardTitle>
            <CardDescription>
              No se encontró la evaluación solicitada o el enlace ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="outline"
            >
              Ir al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">¡Evaluación enviada!</CardTitle>
            <CardDescription>
              Gracias por completar la valoración de prácticas. Sus respuestas han sido registradas correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Finalizar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-2xl text-blue-600">Valoración de Prácticas</CardTitle>
            </div>
            <CardDescription>
              Formulario de evaluación del desempeño de estudiantes en prácticas
            </CardDescription>
            {linkData && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  Evaluación para: {linkData.studentName}
                </div>
                <div className="text-xs text-blue-600">
                  Centro: {linkData.workCenter}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tutorName">Nombre del Tutor *</Label>
                  <Input
                    id="tutorName"
                    value={formData.tutorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, tutorName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutorLastName">Apellidos del Tutor *</Label>
                  <Input
                    id="tutorLastName"
                    value={formData.tutorLastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, tutorLastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nombre del Estudiante *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentLastName">Apellidos del Estudiante *</Label>
                  <Input
                    id="studentLastName"
                    value={formData.studentLastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentLastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Datos académicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formation">Formación *</Label>
                  <Input
                    id="formation"
                    value={formData.formation}
                    onChange={(e) => setFormData(prev => ({ ...prev, formation: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institute">Instituto *</Label>
                  <Input
                    id="institute"
                    value={formData.institute}
                    onChange={(e) => setFormData(prev => ({ ...prev, institute: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Datos de las prácticas */}
              <div className="space-y-2">
                <Label htmlFor="practices">Prácticas *</Label>
                <Textarea
                  id="practices"
                  placeholder="Descripción de las prácticas realizadas"
                  value={formData.practices}
                  onChange={(e) => setFormData(prev => ({ ...prev, practices: e.target.value }))}
                  required
                />
              </div>

              {/* Competencias */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Competencias (1-10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meticulousness">Meticulosidad</Label>
                    <Slider
                      id="meticulousness"
                      defaultValue={[formData.competencies?.meticulousness || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('meticulousness', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamwork">Trabajo en equipo</Label>
                    <Slider
                      id="teamwork"
                      defaultValue={[formData.competencies?.teamwork || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('teamwork', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adaptability">Adaptabilidad</Label>
                    <Slider
                      id="adaptability"
                      defaultValue={[formData.competencies?.adaptability || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('adaptability', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stressTolerance">Tolerancia al estrés</Label>
                    <Slider
                      id="stressTolerance"
                      defaultValue={[formData.competencies?.stressTolerance || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('stressTolerance', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verbalCommunication">Comunicación verbal</Label>
                    <Slider
                      id="verbalCommunication"
                      defaultValue={[formData.competencies?.verbalCommunication || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('verbalCommunication', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commitment">Compromiso</Label>
                    <Slider
                      id="commitment"
                      defaultValue={[formData.competencies?.commitment || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('commitment', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initiative">Iniciativa</Label>
                    <Slider
                      id="initiative"
                      defaultValue={[formData.competencies?.initiative || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('initiative', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadership">Liderazgo</Label>
                    <Slider
                      id="leadership"
                      defaultValue={[formData.competencies?.leadership || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('leadership', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="learningCapacity">Capacidad de aprendizaje</Label>
                    <Slider
                      id="learningCapacity"
                      defaultValue={[formData.competencies?.learningCapacity || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('learningCapacity', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="writtenCommunication">Comunicación escrita</Label>
                    <Slider
                      id="writtenCommunication"
                      defaultValue={[formData.competencies?.writtenCommunication || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('writtenCommunication', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problemSolving">Resolución de problemas</Label>
                    <Slider
                      id="problemSolving"
                      defaultValue={[formData.competencies?.problemSolving || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('problemSolving', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskCommitment">Compromiso con la tarea</Label>
                    <Slider
                      id="taskCommitment"
                      defaultValue={[formData.competencies?.taskCommitment || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateCompetency('taskCommitment', value[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Aptitudes Organizativas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Aptitudes Organizativas (1-10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organized">Organización</Label>
                    <Slider
                      id="organized"
                      defaultValue={[formData.organizationalSkills?.organized || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateOrganizationalSkill('organized', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newChallenges">Nuevos desafíos</Label>
                    <Slider
                      id="newChallenges"
                      defaultValue={[formData.organizationalSkills?.newChallenges || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateOrganizationalSkill('newChallenges', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemAdaptation">Adaptación al sistema</Label>
                    <Slider
                      id="systemAdaptation"
                      defaultValue={[formData.organizationalSkills?.systemAdaptation || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateOrganizationalSkill('systemAdaptation', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="efficiency">Eficiencia</Label>
                    <Slider
                      id="efficiency"
                      defaultValue={[formData.organizationalSkills?.efficiency || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateOrganizationalSkill('efficiency', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="punctuality">Puntualidad</Label>
                    <Slider
                      id="punctuality"
                      defaultValue={[formData.organizationalSkills?.punctuality || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateOrganizationalSkill('punctuality', value[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Aptitudes Técnicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Aptitudes Técnicas (1-10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceImprovements">Mejoras en el servicio</Label>
                    <Slider
                      id="serviceImprovements"
                      defaultValue={[formData.technicalSkills?.serviceImprovements || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateTechnicalSkill('serviceImprovements', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosticSkills">Habilidades de diagnóstico</Label>
                    <Slider
                      id="diagnosticSkills"
                      defaultValue={[formData.technicalSkills?.diagnosticSkills || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateTechnicalSkill('diagnosticSkills', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="innovativeSolutions">Soluciones innovadoras</Label>
                    <Slider
                      id="innovativeSolutions"
                      defaultValue={[formData.technicalSkills?.innovativeSolutions || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateTechnicalSkill('innovativeSolutions', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sharesSolutions">Comparte soluciones</Label>
                    <Slider
                      id="sharesSolutions"
                      defaultValue={[formData.technicalSkills?.sharesSolutions || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateTechnicalSkill('sharesSolutions', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toolUsage">Uso de herramientas</Label>
                    <Slider
                      id="toolUsage"
                      defaultValue={[formData.technicalSkills?.toolUsage || 5]}
                      max={10}
                      min={1}
                      step={1}
                      onValueChange={(value) => updateTechnicalSkill('toolUsage', value[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Otros datos de interés */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Otros datos de interés</h3>
                <div className="space-y-2">
                  <Label>Disponibilidad para viajar</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="national"
                        checked={formData.travelAvailability?.includes('Nacional')}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            travelAvailability: checked
                              ? [...(prev.travelAvailability || []), 'Nacional']
                              : (prev.travelAvailability || []).filter(item => item !== 'Nacional'),
                          }));
                        }}
                      />
                      <Label htmlFor="national">Nacional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="international"
                        checked={formData.travelAvailability?.includes('Internacional')}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            travelAvailability: checked
                              ? [...(prev.travelAvailability || []), 'Internacional']
                              : (prev.travelAvailability || []).filter(item => item !== 'Internacional'),
                          }));
                        }}
                      />
                      <Label htmlFor="international">Internacional</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cambio de residencia</Label>
                  <RadioGroup
                    value={formData.residenceChange}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, residenceChange: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Si" id="residence-yes" />
                      <Label htmlFor="residence-yes">Si</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="residence-no" />
                      <Label htmlFor="residence-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="englishLevel">Nivel de inglés</Label>
                  <Input
                    id="englishLevel"
                    value={formData.englishLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, englishLevel: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="performanceRating">Valoración del desempeño (1-10)</Label>
                  <Slider
                    id="performanceRating"
                    defaultValue={[formData.performanceRating || 5]}
                    max={10}
                    min={1}
                    step={1}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, performanceRating: value[0] }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="performanceJustification">Justificación de la valoración</Label>
                  <Textarea
                    id="performanceJustification"
                    placeholder="Justificación de la valoración del desempeño"
                    value={formData.performanceJustification}
                    onChange={(e) => setFormData(prev => ({ ...prev, performanceJustification: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="futureInterest">Interés futuro</Label>
                  <Textarea
                    id="futureInterest"
                    placeholder="Interés futuro"
                    value={formData.futureInterest}
                    onChange={(e) => setFormData(prev => ({ ...prev, futureInterest: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practicalTraining">Formación práctica</Label>
                  <Textarea
                    id="practicalTraining"
                    placeholder="Formación práctica"
                    value={formData.practicalTraining}
                    onChange={(e) => setFormData(prev => ({ ...prev, practicalTraining: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observaciones</Label>
                  <Textarea
                    id="observations"
                    placeholder="Observaciones"
                    value={formData.observations}
                    onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  />
                </div>
              </div>

              {/* Evaluación final */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Evaluación Final</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Evaluación Final *</Label>
                    <RadioGroup
                      value={formData.finalEvaluation}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, finalEvaluation: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Apto" id="apt" />
                        <Label htmlFor="apt">Apto</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No Apto" id="not-apt" />
                        <Label htmlFor="not-apt">No Apto</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluatorName">Nombre del Evaluador *</Label>
                    <Input
                      id="evaluatorName"
                      value={formData.evaluatorName}
                      onChange={(e) => setFormData(prev => ({ ...prev, evaluatorName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
