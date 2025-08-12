
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { ContractRequestData, saveContractRequest } from '../../services/contractRequestsService';

interface ContractRequestCreateFormProps {
  language: Language;
  onBack: () => void;
}

const ContractRequestCreateForm: React.FC<ContractRequestCreateFormProps> = ({ 
  language, 
  onBack 
}) => {
  const { t } = useTranslation(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContractRequestData>({
    applicantName: '',
    applicantLastName: '',
    contractType: '',
    salary: '',
    incorporationDate: undefined,
    company: '',
    position: '',
    professionalCategory: '',
    population: '',
    province: '',
    autonomousCommunity: '',
    workCenter: '',
    directManagerName: '',
    directManagerLastName: '',
    expenseValidatorName: '',
    expenseValidatorLastName: '',
    companyFloor: '',
    language1: '',
    language1Level: '',
    language2: '',
    language2Level: '',
    electromedicalExperience: '',
    electromedicalExperienceDuration: '',
    installationsExperience: '',
    installationsExperienceDuration: '',
    contractingReason: '',
    observationsCommitments: '',
    status: 'Pendiente',
    observations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveContractRequest(formData);
      console.log('Solicitud de contrato guardada exitosamente');
      onBack(); // Volver a la lista
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContractRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: keyof ContractRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? new Date(value) : undefined
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
          Nueva Solicitud de Contratación
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidato Seleccionado */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Candidato Seleccionado <span className="text-red-500">(Obligatorio)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicantName">Nombre</Label>
              <Input
                id="applicantName"
                value={formData.applicantName}
                onChange={(e) => handleInputChange('applicantName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="applicantLastName">Apellidos</Label>
              <Input
                id="applicantLastName"
                value={formData.applicantLastName}
                onChange={(e) => handleInputChange('applicantLastName', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Información del Contrato */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Información del Contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contractType">Tipo de Contrato <span className="text-red-500">(Obligatorio)</span></Label>
              <Select onValueChange={(value) => handleInputChange('contractType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indefinido">Indefinido</SelectItem>
                  <SelectItem value="temporal">Temporal</SelectItem>
                  <SelectItem value="practicas">Prácticas</SelectItem>
                  <SelectItem value="obra-servicio">Obra y Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary">Salario</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="Indicar importe"
              />
            </div>
            <div>
              <Label htmlFor="observations">Observaciones</Label>
              <Input
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Ej: Según convenio"
              />
            </div>
            <div>
              <Label htmlFor="incorporationDate">Fecha de Incorporación <span className="text-red-500">(Obligatorio)</span></Label>
              <Input
                id="incorporationDate"
                type="date"
                onChange={(e) => handleDateChange('incorporationDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa <span className="text-red-500">(Obligatorio)</span></Label>
              <Select onValueChange={(value) => handleInputChange('company', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iberman-sa">IBERMAN SA</SelectItem>
                  <SelectItem value="asime-sa">ASIME SA</SelectItem>
                  <SelectItem value="mantelec-sa">MANTELEC SA</SelectItem>
                  <SelectItem value="insanex-sl">INSANEX SL</SelectItem>
                  <SelectItem value="ssm">SSM</SelectItem>
                  <SelectItem value="rd-healing">RD HEALING</SelectItem>
                  <SelectItem value="ainatec">AINATEC</SelectItem>
                  <SelectItem value="indel-facilities">INDEL FACILITIES</SelectItem>
                  <SelectItem value="otra">OTRA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position">Puesto de Trabajo <span className="text-red-500">(Obligatorio)</span></Label>
              <Select onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnico-electromedicina">TÉCNICO/A DE ELECTROMEDICINA</SelectItem>
                  <SelectItem value="rc">RC</SelectItem>
                  <SelectItem value="ingeniero-electronico">INGENIERO/A ELECTRÓNICO</SelectItem>
                  <SelectItem value="ingeniero-mecanico">INGENIERO/A MECÁNICO</SelectItem>
                  <SelectItem value="ingeniero-desarrollo">INGENIERO/A DESARROLLO HW Y SW</SelectItem>
                  <SelectItem value="electricista">ELECTRICISTA</SelectItem>
                  <SelectItem value="frigorista">FRIGORISTA</SelectItem>
                  <SelectItem value="tecnico-instalaciones">TÉCNICO/A DE INSTALACIONES</SelectItem>
                  <SelectItem value="albanil">ALBAÑIL</SelectItem>
                  <SelectItem value="otro">OTRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="professionalCategory">Categoría Profesional <span className="text-red-500">(Obligatorio)</span></Label>
              <Select onValueChange={(value) => handleInputChange('professionalCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnico">TÉCNICO/A</SelectItem>
                  <SelectItem value="ingeniero">INGENIERO/A</SelectItem>
                  <SelectItem value="oficial-1">OFICIAL 1ª</SelectItem>
                  <SelectItem value="oficial-2">OFICIAL 2ª</SelectItem>
                  <SelectItem value="oficial-3">OFICIAL 3ª</SelectItem>
                  <SelectItem value="otra">OTRA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="population">Población</Label>
              <Input
                id="population"
                value={formData.population}
                onChange={(e) => handleInputChange('population', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="autonomousCommunity">Comunidad Autónoma</Label>
              <Input
                id="autonomousCommunity"
                value={formData.autonomousCommunity}
                onChange={(e) => handleInputChange('autonomousCommunity', e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="workCenter">Centro de Trabajo <span className="text-red-500">(Obligatorio)</span></Label>
              <Select onValueChange={(value) => handleInputChange('workCenter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sede-central">Sede Central</SelectItem>
                  <SelectItem value="delegacion-madrid">Delegación Madrid</SelectItem>
                  <SelectItem value="delegacion-barcelona">Delegación Barcelona</SelectItem>
                  <SelectItem value="delegacion-valencia">Delegación Valencia</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Responsable Directo */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Responsable Directo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="directManagerName">Nombre</Label>
              <Input
                id="directManagerName"
                value={formData.directManagerName}
                onChange={(e) => handleInputChange('directManagerName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="directManagerLastName">Apellidos</Label>
              <Input
                id="directManagerLastName"
                value={formData.directManagerLastName}
                onChange={(e) => handleInputChange('directManagerLastName', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Validador de Gastos y Vacaciones */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Validador de Gastos y Vacaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expenseValidatorName">Nombre</Label>
              <Input
                id="expenseValidatorName"
                value={formData.expenseValidatorName}
                onChange={(e) => handleInputChange('expenseValidatorName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expenseValidatorLastName">Apellidos</Label>
              <Input
                id="expenseValidatorLastName"
                value={formData.expenseValidatorLastName}
                onChange={(e) => handleInputChange('expenseValidatorLastName', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Piso de Empresa */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Piso de Empresa <span className="text-red-500">(Obligatorio)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="companyFloor"
                  value="Si"
                  checked={formData.companyFloor === 'Si'}
                  onChange={(e) => handleInputChange('companyFloor', e.target.value)}
                />
                Sí
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="companyFloor"
                  value="No"
                  checked={formData.companyFloor === 'No'}
                  onChange={(e) => handleInputChange('companyFloor', e.target.value)}
                />
                No
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Otros Datos de Interés */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Otros Datos de Interés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language1">Idioma</Label>
                <Select onValueChange={(value) => handleInputChange('language1', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingles">INGLÉS</SelectItem>
                    <SelectItem value="frances">FRANCÉS</SelectItem>
                    <SelectItem value="portugues">PORTUGUÉS</SelectItem>
                    <SelectItem value="otro">OTRO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language1Level">Nivel</Label>
                <Select onValueChange={(value) => handleInputChange('language1Level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a1-a2">A1-A2 (BÁSICO)</SelectItem>
                    <SelectItem value="b1">B1 (INTERMEDIO-BAJO)</SelectItem>
                    <SelectItem value="b1-b2">B1-B2</SelectItem>
                    <SelectItem value="b2">B2 (FIRST CERTIFICATE)</SelectItem>
                    <SelectItem value="b2-c1">B2-C1</SelectItem>
                    <SelectItem value="c1">C1 (ADVANCED)</SelectItem>
                    <SelectItem value="c2">C2 (BILINGÜE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language2">Idioma 2</Label>
                <Select onValueChange={(value) => handleInputChange('language2', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frances">FRANCÉS</SelectItem>
                    <SelectItem value="portugues">PORTUGUÉS</SelectItem>
                    <SelectItem value="otro">OTRO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language2Level">Nivel 2</Label>
                <Select onValueChange={(value) => handleInputChange('language2Level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a1-a2">A1-A2 (BÁSICO)</SelectItem>
                    <SelectItem value="b1">B1 (INTERMEDIO-BAJO)</SelectItem>
                    <SelectItem value="b1-b2">B1-B2</SelectItem>
                    <SelectItem value="b2">B2 (FIRST CERTIFICATE)</SelectItem>
                    <SelectItem value="b2-c1">B2-C1</SelectItem>
                    <SelectItem value="c1">C1 (ADVANCED)</SelectItem>
                    <SelectItem value="c2">C2 (BILINGÜE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="electromedicalExperience">Experiencia Previa en Electromedicina</Label>
                <Input
                  id="electromedicalExperience"
                  value={formData.electromedicalExperience}
                  onChange={(e) => handleInputChange('electromedicalExperience', e.target.value)}
                />
                <Label htmlFor="electromedicalExperienceDuration" className="text-sm text-gray-600">Duración</Label>
                <Input
                  id="electromedicalExperienceDuration"
                  value={formData.electromedicalExperienceDuration}
                  onChange={(e) => handleInputChange('electromedicalExperienceDuration', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="installationsExperience">Experiencia Previa en Instalaciones</Label>
                <Input
                  id="installationsExperience"
                  value={formData.installationsExperience}
                  onChange={(e) => handleInputChange('installationsExperience', e.target.value)}
                />
                <Label htmlFor="installationsExperienceDuration" className="text-sm text-gray-600">Duración</Label>
                <Input
                  id="installationsExperienceDuration"
                  value={formData.installationsExperienceDuration}
                  onChange={(e) => handleInputChange('installationsExperienceDuration', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contractingReason">Motivo de la Contratación</Label>
              <Textarea
                id="contractingReason"
                value={formData.contractingReason}
                onChange={(e) => handleInputChange('contractingReason', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="observationsCommitments">Observaciones y/o Compromisos</Label>
              <Textarea
                id="observationsCommitments"
                value={formData.observationsCommitments}
                onChange={(e) => handleInputChange('observationsCommitments', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContractRequestCreateForm;
