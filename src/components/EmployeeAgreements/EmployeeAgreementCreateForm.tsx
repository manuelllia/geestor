
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { createEmployeeAgreement, EmployeeAgreementRecord } from '../../services/employeeAgreementsService';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface EmployeeAgreementCreateFormProps {
  language: Language;
  onSubmit: (record: EmployeeAgreementRecord) => void;
  onCancel: () => void;
}

interface FormData {
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
  startDate: string;
  endDate: string;
  status: string;
  observations: string;
  // Add missing required fields
  agreementType: string;
  department: string;
  salary: string;
  jobPosition: string;
  observationsAndCommitment: string;
}

const EmployeeAgreementCreateForm: React.FC<EmployeeAgreementCreateFormProps> = ({ 
  language, 
  onSubmit, 
  onCancel 
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
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
    startDate: '',
    endDate: '',
    status: 'Activo',
    observations: '',
    // Initialize missing required fields
    agreementType: 'Contrato Indefinido',
    department: '',
    salary: '',
    jobPosition: '',
    observationsAndCommitment: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prevData => ({
        ...prevData,
        [name]: format(date, 'yyyy-MM-dd'),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const agreementData = {
        employeeName: formData.employeeName,
        employeeLastName: formData.employeeLastName,
        workCenter: formData.workCenter,
        city: formData.city,
        province: formData.province,
        autonomousCommunity: formData.autonomousCommunity,
        responsibleName: formData.responsibleName,
        responsibleLastName: formData.responsibleLastName,
        agreementConcepts: formData.agreementConcepts,
        economicAgreement1: parseFloat(formData.economicAgreement1) || 0,
        concept1: formData.concept1,
        economicAgreement2: parseFloat(formData.economicAgreement2) || 0,
        concept2: formData.concept2,
        economicAgreement3: parseFloat(formData.economicAgreement3) || 0,
        concept3: formData.concept3,
        status: formData.status as 'Activo' | 'Finalizado' | 'Suspendido',
        observations: formData.observations,
        startDate: formData.startDate,
        endDate: formData.endDate,
        activationDate: formData.activationDate,
        // Add required fields with values from form
        description: formData.observations || '',
        terms: formData.agreementConcepts || '',
        supervisor: `${formData.responsibleName} ${formData.responsibleLastName}`,
        benefits: `${formData.concept1}, ${formData.concept2}, ${formData.concept3}`.replace(/^, |, $/g, ''),
        // Include the missing required fields
        agreementType: formData.agreementType,
        department: formData.department,
        salary: formData.salary,
        jobPosition: formData.jobPosition,
        observationsAndCommitment: formData.observationsAndCommitment,
      };

      const createdRecord = await createEmployeeAgreement(agreementData);
      onSubmit(createdRecord);
      
      toast({
        title: t('success'),
        description: 'Acuerdo de empleado creado correctamente',
      });
    } catch (err) {
      console.error('Error creating employee agreement:', err);
      setError(err instanceof Error ? err.message : 'Error creating employee agreement');
      
      toast({
        title: t('error'),
        description: 'Error al crear el acuerdo de empleado',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100 leading-tight">
            Crear Acuerdo de Empleado
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Completa el formulario para crear un nuevo acuerdo de empleado.
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-blue-800 dark:text-blue-200">
              Información del Acuerdo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Employee Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeName" className="text-sm">
                    {t('employeeName')}:
                  </Label>
                  <Input
                    type="text"
                    id="employeeName"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employeeLastName" className="text-sm">
                    {t('employeeLastName')}:
                  </Label>
                  <Input
                    type="text"
                    id="employeeLastName"
                    name="employeeLastName"
                    value={formData.employeeLastName}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Job Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobPosition" className="text-sm">
                    {t('position')}:
                  </Label>
                  <Input
                    type="text"
                    id="jobPosition"
                    name="jobPosition"
                    value={formData.jobPosition}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm">
                    {t('department')}:
                  </Label>
                  <Input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Work Center and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workCenter" className="text-sm">
                    Centro de Trabajo:
                  </Label>
                  <Input
                    type="text"
                    id="workCenter"
                    name="workCenter"
                    value={formData.workCenter}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-sm">
                    Ciudad:
                  </Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Province and Autonomous Community */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province" className="text-sm">
                    Provincia:
                  </Label>
                  <Input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="autonomousCommunity" className="text-sm">
                    Comunidad Autónoma:
                  </Label>
                  <Input
                    type="text"
                    id="autonomousCommunity"
                    name="autonomousCommunity"
                    value={formData.autonomousCommunity}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Agreement Type and Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agreementType" className="text-sm">
                    {t('agreementType')}:
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('agreementType', value)}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Seleccionar tipo de acuerdo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contrato Indefinido" className="text-sm">Contrato Indefinido</SelectItem>
                      <SelectItem value="Contrato Temporal" className="text-sm">Contrato Temporal</SelectItem>
                      <SelectItem value="Contrato de Prácticas" className="text-sm">Contrato de Prácticas</SelectItem>
                      <SelectItem value="Contrato de Formación" className="text-sm">Contrato de Formación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary" className="text-sm">
                    {t('salary')}:
                  </Label>
                  <Input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Responsible Person Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsibleName" className="text-sm">
                    Nombre del Responsable:
                  </Label>
                  <Input
                    type="text"
                    id="responsibleName"
                    name="responsibleName"
                    value={formData.responsibleName}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleLastName" className="text-sm">
                    Apellidos del Responsable:
                  </Label>
                  <Input
                    type="text"
                    id="responsibleLastName"
                    name="responsibleLastName"
                    value={formData.responsibleLastName}
                    onChange={handleInputChange}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              {/* Agreement Concepts */}
              <div>
                <Label htmlFor="agreementConcepts" className="text-sm">
                  Conceptos del Acuerdo:
                </Label>
                <Textarea
                  id="agreementConcepts"
                  name="agreementConcepts"
                  value={formData.agreementConcepts}
                  onChange={handleInputChange}
                  className="text-sm"
                  required
                />
              </div>

              {/* Economic Agreements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="economicAgreement1" className="text-sm">
                    Acuerdo Económico 1:
                  </Label>
                  <Input
                    type="number"
                    id="economicAgreement1"
                    name="economicAgreement1"
                    value={formData.economicAgreement1}
                    onChange={handleInputChange}
                    className="text-sm"
                  />
                  <Input
                    type="text"
                    id="concept1"
                    name="concept1"
                    value={formData.concept1}
                    onChange={handleInputChange}
                    placeholder="Concepto 1"
                    className="text-sm mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="economicAgreement2" className="text-sm">
                    Acuerdo Económico 2:
                  </Label>
                  <Input
                    type="number"
                    id="economicAgreement2"
                    name="economicAgreement2"
                    value={formData.economicAgreement2}
                    onChange={handleInputChange}
                    className="text-sm"
                  />
                  <Input
                    type="text"
                    id="concept2"
                    name="concept2"
                    value={formData.concept2}
                    onChange={handleInputChange}
                    placeholder="Concepto 2"
                    className="text-sm mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="economicAgreement3" className="text-sm">
                    Acuerdo Económico 3:
                  </Label>
                  <Input
                    type="number"
                    id="economicAgreement3"
                    name="economicAgreement3"
                    value={formData.economicAgreement3}
                    onChange={handleInputChange}
                    className="text-sm"
                  />
                  <Input
                    type="text"
                    id="concept3"
                    name="concept3"
                    value={formData.concept3}
                    onChange={handleInputChange}
                    placeholder="Concepto 3"
                    className="text-sm mt-2"
                  />
                </div>
              </div>

              {/* Activation, Start, and End Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="activationDate" className="text-sm">
                    Fecha de Activación:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-sm",
                          !formData.activationDate && "text-muted-foreground"
                        )}
                      >
                        {formData.activationDate ? (
                          format(new Date(formData.activationDate), "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={formData.activationDate ? new Date(formData.activationDate) : undefined}
                        onSelect={(date) => handleDateChange('activationDate', date)}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="startDate" className="text-sm">
                    Fecha de Inicio:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-sm",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        {formData.startDate ? (
                          format(new Date(formData.startDate), "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={formData.startDate ? new Date(formData.startDate) : undefined}
                        onSelect={(date) => handleDateChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm">
                    Fecha de Fin:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-sm",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        {formData.endDate ? (
                          format(new Date(formData.endDate), "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={formData.endDate ? new Date(formData.endDate) : undefined}
                        onSelect={(date) => handleDateChange('endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-sm">
                  Estado:
                </Label>
                <Select onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo" className="text-sm">Activo</SelectItem>
                    <SelectItem value="Finalizado" className="text-sm">Finalizado</SelectItem>
                    <SelectItem value="Suspendido" className="text-sm">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Observations */}
              <div>
                <Label htmlFor="observations" className="text-sm">
                  {t('observations')}:
                </Label>
                <Textarea
                  id="observations"
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  className="text-sm"
                />
              </div>

              {/* Observations and Commitment */}
              <div>
                <Label htmlFor="observationsAndCommitment" className="text-sm">
                  Observaciones y Compromisos:
                </Label>
                <Textarea
                  id="observationsAndCommitment"
                  name="observationsAndCommitment"
                  value={formData.observationsAndCommitment}
                  onChange={handleInputChange}
                  className="text-sm"
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="text-sm"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Acuerdo'}
                </Button>
              </div>
            </form>
            {error && (
              <div className="mt-4 text-red-500 text-sm">
                Error: {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeAgreementCreateForm;
