import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getEmployeeAgreementById, updateEmployeeAgreement, EmployeeAgreementRecord } from '../../services/employeeAgreementsService';

interface EmployeeAgreementEditFormProps {
  agreementId: string;
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

interface EmployeeAgreementFormData {
  employeeName: string;
  employeeLastName: string;
  workCenter: string;
  city: string;
  province: string;
  autonomousCommunity: string;
  responsibleName: string;
  responsibleLastName: string;
  agreementConcepts: string;
  economicAgreement1: string;
  concept1: string;
  economicAgreement2: string;
  concept2: string;
  economicAgreement3: string;
  concept3: string;
  activationDate: string;
  endDate: string;
  jobPosition: string;
  startDate: string;
  salary: string;
  agreementDate: string;
  agreementType: string;
  position: string;
  department: string;
  observations: string;
}

const EmployeeAgreementEditForm: React.FC<EmployeeAgreementEditFormProps> = ({
  agreementId,
  language,
  onBack,
  onSave
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeAgreementFormData>({
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
    jobPosition: '',
    startDate: '',
    salary: '',
    agreementDate: '',
    agreementType: '',
    position: '',
    department: '',
    observations: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof EmployeeAgreementFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const agreement = await getEmployeeAgreementById(agreementId);
        if (agreement) {
          setFormData({
            employeeName: agreement.employeeName,
            employeeLastName: agreement.employeeLastName,
            workCenter: agreement.workCenter,
            city: agreement.city,
            province: agreement.province,
            autonomousCommunity: agreement.autonomousCommunity,
            responsibleName: agreement.responsibleName,
            responsibleLastName: agreement.responsibleLastName,
            agreementConcepts: agreement.agreementConcepts,
            economicAgreement1: agreement.economicAgreement1,
            concept1: agreement.concept1,
            economicAgreement2: agreement.economicAgreement2,
            concept2: agreement.concept2,
            economicAgreement3: agreement.economicAgreement3,
            concept3: agreement.concept3,
            activationDate: agreement.activationDate.toISOString().split('T')[0],
            endDate: agreement.endDate ? agreement.endDate.toISOString().split('T')[0] : '',
            jobPosition: agreement.jobPosition,
            startDate: agreement.startDate.toISOString().split('T')[0],
            salary: agreement.salary,
            agreementDate: agreement.agreementDate.toISOString().split('T')[0],
            agreementType: agreement.agreementType,
            position: agreement.position,
            department: agreement.department || '',
            observations: agreement.observations || ''
          });
        }
      } catch (error) {
        console.error('Error al obtener el acuerdo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreement();
  }, [agreementId]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const processedData = {
        title: `Acuerdo de ${formData.employeeName} ${formData.employeeLastName}`,
        type: 'Acuerdo de Empleado',
        priority: 'Media' as 'Alta' | 'Media' | 'Baja',
        requesterName: formData.employeeName,
        requesterLastName: formData.employeeLastName,
        requestDate: new Date(),
        status: 'Activo' as 'Activo' | 'Finalizado' | 'Suspendido',
        employeeName: formData.employeeName,
        employeeLastName: formData.employeeLastName,
        position: formData.position,
        department: formData.department,
        agreementType: formData.agreementType,
        workCenter: formData.workCenter,
        city: formData.city,
        province: formData.province,
        autonomousCommunity: formData.autonomousCommunity,
        responsibleName: formData.responsibleName,
        responsibleLastName: formData.responsibleLastName,
        agreementConcepts: formData.agreementConcepts,
        economicAgreement1: formData.economicAgreement1,
        concept1: formData.concept1,
        economicAgreement2: formData.economicAgreement2,
        concept2: formData.concept2,
        economicAgreement3: formData.economicAgreement3,
        concept3: formData.concept3,
        activationDate: new Date(formData.activationDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        observations: formData.observations,
        jobPosition: formData.jobPosition,
        startDate: new Date(formData.startDate),
        salary: formData.salary,
        agreementDate: new Date(formData.agreementDate)
      };

      await updateEmployeeAgreement(agreementId, processedData);

      toast({
        title: "Éxito",
        description: "Acuerdo actualizado correctamente",
      });
      onSave();
    } catch (error) {
      console.error('Error al actualizar el acuerdo:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el acuerdo",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Editar Acuerdo de Empleado
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Información del Empleado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employeeName" className="text-gray-700 dark:text-gray-300">
                Nombre del Empleado
              </Label>
              <Input
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="Nombre del empleado"
              />
            </div>
            <div>
              <Label htmlFor="employeeLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos del Empleado
              </Label>
              <Input
                type="text"
                id="employeeLastName"
                name="employeeLastName"
                value={formData.employeeLastName}
                onChange={handleChange}
                placeholder="Apellidos del empleado"
              />
            </div>
          </div>

          {/* Agreement Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="workCenter" className="text-gray-700 dark:text-gray-300">
                Centro de Trabajo
              </Label>
              <Input
                type="text"
                id="workCenter"
                name="workCenter"
                value={formData.workCenter}
                onChange={handleChange}
                placeholder="Centro de Trabajo"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
                Ciudad
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ciudad"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="province" className="text-gray-700 dark:text-gray-300">
                Provincia
              </Label>
              <Input
                type="text"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="Provincia"
              />
            </div>
            <div>
              <Label htmlFor="autonomousCommunity" className="text-gray-700 dark:text-gray-300">
                Comunidad Autónoma
              </Label>
              <Input
                type="text"
                id="autonomousCommunity"
                name="autonomousCommunity"
                value={formData.autonomousCommunity}
                onChange={handleChange}
                placeholder="Comunidad Autónoma"
              />
            </div>
             <div>
              <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                Departamento
              </Label>
              <Input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Departamento"
              />
            </div>
          </div>

          {/* Responsible Person */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="responsibleName" className="text-gray-700 dark:text-gray-300">
                Nombre del Responsable
              </Label>
              <Input
                type="text"
                id="responsibleName"
                name="responsibleName"
                value={formData.responsibleName}
                onChange={handleChange}
                placeholder="Nombre del responsable"
              />
            </div>
            <div>
              <Label htmlFor="responsibleLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos del Responsable
              </Label>
              <Input
                type="text"
                id="responsibleLastName"
                name="responsibleLastName"
                value={formData.responsibleLastName}
                onChange={handleChange}
                placeholder="Apellidos del responsable"
              />
            </div>
          </div>

          {/* Agreement Concepts */}
          <div>
            <Label htmlFor="agreementConcepts" className="text-gray-700 dark:text-gray-300">
              Conceptos del Acuerdo
            </Label>
            <Textarea
              id="agreementConcepts"
              name="agreementConcepts"
              value={formData.agreementConcepts}
              onChange={handleChange}
              placeholder="Conceptos del acuerdo"
              rows={3}
            />
          </div>

          {/* Economic Agreements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="economicAgreement1" className="text-gray-700 dark:text-gray-300">
                Acuerdo Económico 1
              </Label>
              <Input
                type="text"
                id="economicAgreement1"
                name="economicAgreement1"
                value={formData.economicAgreement1}
                onChange={handleChange}
                placeholder="Acuerdo económico 1"
              />
              <Input
                type="text"
                id="concept1"
                name="concept1"
                value={formData.concept1}
                onChange={handleChange}
                placeholder="Concepto 1"
              />
            </div>
            <div>
              <Label htmlFor="economicAgreement2" className="text-gray-700 dark:text-gray-300">
                Acuerdo Económico 2
              </Label>
              <Input
                type="text"
                id="economicAgreement2"
                name="economicAgreement2"
                value={formData.economicAgreement2}
                onChange={handleChange}
                placeholder="Acuerdo económico 2"
              />
              <Input
                type="text"
                id="concept2"
                name="concept2"
                value={formData.concept2}
                onChange={handleChange}
                placeholder="Concepto 2"
              />
            </div>
            <div>
              <Label htmlFor="economicAgreement3" className="text-gray-700 dark:text-gray-300">
                Acuerdo Económico 3
              </Label>
              <Input
                type="text"
                id="economicAgreement3"
                name="economicAgreement3"
                value={formData.economicAgreement3}
                onChange={handleChange}
                placeholder="Acuerdo económico 3"
              />
              <Input
                type="text"
                id="concept3"
                name="concept3"
                value={formData.concept3}
                onChange={handleChange}
                placeholder="Concepto 3"
              />
            </div>
          </div>

          {/* Dates */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="agreementType" className="text-gray-700 dark:text-gray-300">
                Tipo de acuerdo
              </Label>
              <Input
                type="text"
                id="agreementType"
                name="agreementType"
                value={formData.agreementType}
                onChange={handleChange}
                placeholder="Tipo de acuerdo"
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">
                Posición
              </Label>
              <Input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Posición"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="activationDate" className="text-gray-700 dark:text-gray-300">
                Fecha de Activación
              </Label>
              <Input
                type="date"
                id="activationDate"
                name="activationDate"
                value={formData.activationDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-gray-700 dark:text-gray-300">
                Fecha de Finalización
              </Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="agreementDate" className="text-gray-700 dark:text-gray-300">
                Fecha de Acuerdo
              </Label>
              <Input
                type="date"
                id="agreementDate"
                name="agreementDate"
                value={formData.agreementDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="jobPosition" className="text-gray-700 dark:text-gray-300">
                Posición de trabajo
              </Label>
              <Input
                type="text"
                id="jobPosition"
                name="jobPosition"
                value={formData.jobPosition}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="text-gray-700 dark:text-gray-300">
                Fecha de inicio
              </Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="salary" className="text-gray-700 dark:text-gray-300">
                Salario
              </Label>
              <Input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observations" className="text-gray-700 dark:text-gray-300">
              Observaciones y compromisos
            </Label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Observaciones adicionales"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAgreementEditForm;
