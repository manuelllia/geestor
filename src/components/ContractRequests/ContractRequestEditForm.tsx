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
import { getContractRequestById, updateContractRequest, ContractRequestRecord } from '../../services/contractRequestsService';

interface ContractRequestEditFormProps {
  language: Language;
  requestId: string;
  onBack: () => void;
  onSave: () => void;
}

const ContractRequestEditForm: React.FC<ContractRequestEditFormProps> = ({
  language,
  requestId,
  onBack,
  onSave
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<ContractRequestRecord, 'id' | 'createdAt' | 'updatedAt'>>({
    position: '',
    department: '',
    urgency: 'Media',
    requesterName: '',
    requesterLastName: '',
    requestDate: new Date(),
    status: 'Pendiente',
    contractType: '',
    salary: '',
    observations: '',
    incorporationDate: undefined,
    company: '',
    jobPosition: '',
    professionalCategory: '',
    city: '',
    province: '',
    autonomousCommunity: '',
    workCenter: '',
    companyFlat: 'No',
    language1: '',
    level1: '',
    language2: '',
    level2: '',
    experienceElectromedicine: '',
    experienceInstallations: '',
    hiringReason: '',
    notesAndCommitments: '',
  });

  useEffect(() => {
    const loadRequestData = async () => {
      try {
        const requestData = await getContractRequestById(requestId);
        if (requestData) {
          setFormData({
            position: requestData.position,
            department: requestData.department,
            urgency: requestData.urgency,
            requesterName: requestData.requesterName,
            requesterLastName: requestData.requesterLastName,
            requestDate: requestData.requestDate,
            status: requestData.status,
            contractType: requestData.contractType || '',
            salary: requestData.salary || '',
            observations: requestData.observations || '',
            incorporationDate: requestData.incorporationDate,
            company: requestData.company || '',
            jobPosition: requestData.jobPosition || '',
            professionalCategory: requestData.professionalCategory || '',
            city: requestData.city || '',
            province: requestData.province || '',
            autonomousCommunity: requestData.autonomousCommunity || '',
            workCenter: requestData.workCenter || '',
            companyFlat: (requestData.companyFlat as string) || 'No',
            language1: requestData.language1 || '',
            level1: requestData.level1 || '',
            language2: requestData.language2 || '',
            level2: requestData.level2 || '',
            experienceElectromedicine: requestData.experienceElectromedicine || '',
            experienceInstallations: requestData.experienceInstallations || '',
            hiringReason: requestData.hiringReason || '',
            notesAndCommitments: requestData.notesAndCommitments || '',
          });
        }
      } catch (error) {
        console.error('Error loading request data:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar los datos de la solicitud.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRequestData();
  }, [requestId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requesterName || !formData.company || !formData.position || !formData.department) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, completa todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        status: formData.status as 'Pendiente' | 'Aprobado' | 'Rechazado'
      };
      
      await updateContractRequest(requestId, updateData);
      
      toast({
        title: 'Solicitud actualizada',
        description: 'La solicitud de contratación ha sido actualizada exitosamente.',
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar la solicitud de contratación.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
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
          Editar Solicitud de Contratación
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Información del Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requesterName">Nombre *</Label>
                <Input
                  id="requesterName"
                  value={formData.requesterName}
                  onChange={(e) => handleChange('requesterName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="requesterLastName">Apellidos *</Label>
                <Input
                  id="requesterLastName"
                  value={formData.requesterLastName}
                  onChange={(e) => handleChange('requesterLastName', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Empresa */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Empresa *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="workCenter">Centro de Trabajo</Label>
                <Input
                  id="workCenter"
                  value={formData.workCenter}
                  onChange={(e) => handleChange('workCenter', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles del Puesto */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Detalles del Puesto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobPosition">Puesto de Trabajo</Label>
                <Input
                  id="jobPosition"
                  value={formData.jobPosition}
                  onChange={(e) => handleChange('jobPosition', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="professionalCategory">Categoría Profesional</Label>
                <Input
                  id="professionalCategory"
                  value={formData.professionalCategory}
                  onChange={(e) => handleChange('professionalCategory', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractType">Tipo de Contrato</Label>
                <Input
                  id="contractType"
                  value={formData.contractType}
                  onChange={(e) => handleChange('contractType', e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incorporationDate">Fecha de Incorporación</Label>
                <Input
                  id="incorporationDate"
                  type="date"
                  value={formData.incorporationDate ? new Date(formData.incorporationDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('incorporationDate', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobado">Aprobado</SelectItem>
                    <SelectItem value="Rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Población</Label>
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
            
            <div>
              <Label htmlFor="companyFlat">Piso de Empresa</Label>
              <Select value={formData.companyFlat} onValueChange={(value) => handleChange('companyFlat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Si">Sí</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Idiomas */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Idiomas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language1">Idioma 1</Label>
                <Input
                  id="language1"
                  value={formData.language1}
                  onChange={(e) => handleChange('language1', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="level1">Nivel 1</Label>
                <Input
                  id="level1"
                  value={formData.level1}
                  onChange={(e) => handleChange('level1', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language2">Idioma 2</Label>
                <Input
                  id="language2"
                  value={formData.language2}
                  onChange={(e) => handleChange('language2', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="level2">Nivel 2</Label>
                <Input
                  id="level2"
                  value={formData.level2}
                  onChange={(e) => handleChange('level2', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiencia y Observaciones */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Experiencia y Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="experienceElectromedicine">Experiencia en Electromedicina</Label>
              <Textarea
                id="experienceElectromedicine"
                value={formData.experienceElectromedicine}
                onChange={(e) => handleChange('experienceElectromedicine', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="experienceInstallations">Experiencia en Instalaciones</Label>
              <Textarea
                id="experienceInstallations"
                value={formData.experienceInstallations}
                onChange={(e) => handleChange('experienceInstallations', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="hiringReason">Motivo de Contratación</Label>
              <Textarea
                id="hiringReason"
                value={formData.hiringReason}
                onChange={(e) => handleChange('hiringReason', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="notesAndCommitments">Observaciones y Compromisos</Label>
              <Textarea
                id="notesAndCommitments"
                value={formData.notesAndCommitments}
                onChange={(e) => handleChange('notesAndCommitments', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="observations">Observaciones Generales</Label>
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

export default ContractRequestEditForm;
