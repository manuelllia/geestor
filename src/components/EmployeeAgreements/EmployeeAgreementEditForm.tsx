
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Language } from '../../utils/translations';
import { getEmployeeAgreements, updateEmployeeAgreement, EmployeeAgreementRecord } from '../../services/employeeAgreementsService';

interface EmployeeAgreementEditFormProps {
  language: Language;
  agreementId: string;
  onBack: () => void;
  onSave: () => void;
}

const EmployeeAgreementEditForm: React.FC<EmployeeAgreementEditFormProps> = ({
  language,
  agreementId,
  onBack,
  onSave
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeLastName: '',
    workCenter: '',
    city: '',
    province: '',
    autonomousCommunity: '',
    responsibleName: '',
    responsibleLastName: '',
    agreementConcepts: '',
    economicAgreement1: '',
    concept1: '',
    economicAgreement2: '',
    concept2: '',
    economicAgreement3: '',
    concept3: '',
    activationDate: '',
    endDate: '',
    observationsAndCommitment: '',
    jobPosition: '',
    department: '',
    agreementType: '',
    startDate: '',
    salary: '',
    status: 'Activo' as 'Activo' | 'Finalizado' | 'Suspendido',
    observations: '',
    description: '',
    terms: '',
    supervisor: '',
    benefits: ''
  });

  useEffect(() => {
    const loadAgreementData = async () => {
      try {
        const agreements = await getEmployeeAgreements();
        const agreement = agreements.find(a => a.id === agreementId);
        
        if (agreement) {
          setFormData({
            employeeName: agreement.employeeName,
            employeeLastName: agreement.employeeLastName,
            workCenter: agreement.workCenter,
            city: agreement.city || '',
            province: agreement.province || '',
            autonomousCommunity: agreement.autonomousCommunity || '',
            responsibleName: agreement.responsibleName || '',
            responsibleLastName: agreement.responsibleLastName || '',
            agreementConcepts: agreement.agreementConcepts || '',
            economicAgreement1: agreement.economicAgreement1 || '',
            concept1: agreement.concept1 || '',
            economicAgreement2: agreement.economicAgreement2 || '',
            concept2: agreement.concept2 || '',
            economicAgreement3: agreement.economicAgreement3 || '',
            concept3: agreement.concept3 || '',
            activationDate: agreement.activationDate ? agreement.activationDate.toISOString().split('T')[0] : '',
            endDate: agreement.endDate ? agreement.endDate.toISOString().split('T')[0] : '',
            observationsAndCommitment: agreement.observationsAndCommitment || '',
            jobPosition: agreement.jobPosition || '',
            department: agreement.department || '',
            agreementType: agreement.agreementType,
            startDate: agreement.startDate ? agreement.startDate.toISOString().split('T')[0] : '',
            salary: agreement.salary,
            status: agreement.status,
            observations: agreement.observations,
            description: agreement.description,
            terms: agreement.terms,
            supervisor: agreement.supervisor,
            benefits: agreement.benefits
          });
        }
      } catch (error) {
        console.error('Error loading agreement data:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar los datos del acuerdo.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgreementData();
  }, [agreementId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeName || !formData.employeeLastName) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, completa todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateEmployeeAgreement(agreementId, formData);
      
      toast({
        title: 'Acuerdo actualizado',
        description: 'El acuerdo con el empleado ha sido actualizado exitosamente.',
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating agreement:', error);
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar el acuerdo con el empleado.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Editar Acuerdo con Empleado
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Información del Empleado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeName">Nombre del Empleado *</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="employeeLastName">Apellidos del Empleado *</Label>
                <Input
                  id="employeeLastName"
                  value={formData.employeeLastName}
                  onChange={(e) => handleChange('employeeLastName', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Centro de Trabajo y Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workCenter">Centro de Trabajo</Label>
              <Input
                id="workCenter"
                value={formData.workCenter}
                onChange={(e) => handleChange('workCenter', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="province">Provincia</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="autonomousCommunity">Comunidad Autónoma</Label>
                <Input
                  id="autonomousCommunity"
                  value={formData.autonomousCommunity}
                  onChange={(e) => handleChange('autonomousCommunity', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Responsable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsibleName">Nombre del Responsable</Label>
                <Input
                  id="responsibleName"
                  value={formData.responsibleName}
                  onChange={(e) => handleChange('responsibleName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="responsibleLastName">Apellidos del Responsable</Label>
                <Input
                  id="responsibleLastName"
                  value={formData.responsibleLastName}
                  onChange={(e) => handleChange('responsibleLastName', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Conceptos del Acuerdo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="agreementConcepts">Conceptos del Acuerdo</Label>
              <Textarea
                id="agreementConcepts"
                value={formData.agreementConcepts}
                onChange={(e) => handleChange('agreementConcepts', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="economicAgreement1">Acuerdo Económico 1</Label>
                <Input
                  id="economicAgreement1"
                  value={formData.economicAgreement1}
                  onChange={(e) => handleChange('economicAgreement1', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="concept1">Concepto 1</Label>
                <Input
                  id="concept1"
                  value={formData.concept1}
                  onChange={(e) => handleChange('concept1', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="economicAgreement2">Acuerdo Económico 2</Label>
                <Input
                  id="economicAgreement2"
                  value={formData.economicAgreement2}
                  onChange={(e) => handleChange('economicAgreement2', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="concept2">Concepto 2</Label>
                <Input
                  id="concept2"
                  value={formData.concept2}
                  onChange={(e) => handleChange('concept2', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="economicAgreement3">Acuerdo Económico 3</Label>
                <Input
                  id="economicAgreement3"
                  value={formData.economicAgreement3}
                  onChange={(e) => handleChange('economicAgreement3', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="concept3">Concepto 3</Label>
                <Input
                  id="concept3"
                  value={formData.concept3}
                  onChange={(e) => handleChange('concept3', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Fechas y Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activationDate">Fecha de Activación</Label>
                <Input
                  id="activationDate"
                  type="date"
                  value={formData.activationDate}
                  onChange={(e) => handleChange('activationDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="jobPosition">Puesto de Trabajo</Label>
                <Input
                  id="jobPosition"
                  value={formData.jobPosition}
                  onChange={(e) => handleChange('jobPosition', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salary">Salario</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="agreementType">Tipo de Acuerdo</Label>
              <Input
                id="agreementType"
                value={formData.agreementType}
                onChange={(e) => handleChange('agreementType', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="observationsAndCommitment">Observaciones y Compromisos</Label>
              <Textarea
                id="observationsAndCommitment"
                value={formData.observationsAndCommitment}
                onChange={(e) => handleChange('observationsAndCommitment', e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAgreementEditForm;
