
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { saveContractRequest, ContractRequestData } from '../../services/contractRequestsService';

interface ContractRequestCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

const ContractRequestCreateForm: React.FC<ContractRequestCreateFormProps> = ({
  language,
  onBack,
  onSave
}) => {
  const { t } = useTranslation(language);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ContractRequestData>>({
    applicantName: '',
    applicantLastName: '',
    position: '',
    department: '',
    requestType: '',
    requestDate: new Date(),
    expectedStartDate: undefined,
    salary: '',
    experience: '', // Agregado correctamente
    qualifications: [],
    status: 'Pendiente',
    observations: ''
  });

  const handleInputChange = (field: keyof ContractRequestData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicantName || !formData.applicantLastName || !formData.position || !formData.department) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      await saveContractRequest(formData as ContractRequestData);
      onSave();
      onBack();
    } catch (error) {
      console.error('Error saving contract request:', error);
      alert('Error al guardar la solicitud de contrato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              Nueva Solicitud de Contratación
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Solicitante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicantName">Nombre *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName || ''}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  placeholder="Nombre del solicitante"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="applicantLastName">Apellidos *</Label>
                <Input
                  id="applicantLastName"
                  value={formData.applicantLastName || ''}
                  onChange={(e) => handleInputChange('applicantLastName', e.target.value)}
                  placeholder="Apellidos del solicitante"
                  required
                />
              </div>
            </div>

            {/* Información del Puesto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position">Puesto *</Label>
                <Input
                  id="position"
                  value={formData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Puesto solicitado"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento *</Label>
                <Select 
                  value={formData.department || ''} 
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finanzas">Finanzas</SelectItem>
                    <SelectItem value="Operaciones">Operaciones</SelectItem>
                    <SelectItem value="Administración">Administración</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tipo de Solicitud y Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="requestType">Tipo de Solicitud</Label>
                <Select 
                  value={formData.requestType || ''} 
                  onValueChange={(value) => handleInputChange('requestType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de solicitud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nueva contratación">Nueva contratación</SelectItem>
                    <SelectItem value="Reemplazo">Reemplazo</SelectItem>
                    <SelectItem value="Temporal">Temporal</SelectItem>
                    <SelectItem value="Prácticas">Prácticas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestDate">Fecha de Solicitud</Label>
                <Input
                  id="requestDate"
                  type="date"
                  value={formData.requestDate ? formData.requestDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('requestDate', new Date(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedStartDate">Fecha de Inicio Esperada</Label>
                <Input
                  id="expectedStartDate"
                  type="date"
                  value={formData.expectedStartDate ? formData.expectedStartDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('expectedStartDate', new Date(e.target.value))}
                />
              </div>
            </div>

            {/* Salario y Experiencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary">Salario</Label>
                <Input
                  id="salary"
                  value={formData.salary || ''}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="Rango salarial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia Requerida</Label>
                <Select 
                  value={formData.experience || ''} 
                  onValueChange={(value) => handleInputChange('experience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel de experiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sin experiencia">Sin experiencia</SelectItem>
                    <SelectItem value="1-2 años">1-2 años</SelectItem>
                    <SelectItem value="3-5 años">3-5 años</SelectItem>
                    <SelectItem value="5+ años">5+ años</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={formData.status || ''} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado de la solicitud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En proceso">En proceso</SelectItem>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations || ''}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Comentarios adicionales sobre la solicitud"
                rows={4}
              />
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Guardar Solicitud</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractRequestCreateForm;
