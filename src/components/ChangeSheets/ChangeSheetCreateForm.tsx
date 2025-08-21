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
import { getWorkCenters, getContracts } from '../../services/workCentersService';
import { ChangeSheetRecord } from '../../services/changeSheetsService';
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

interface ChangeSheetFormData {
  title: string;
  description: string;
  reason: string;
  date: string;
  workCenter: string;
  contractsManaged: string;
  newPosition: string;
  newSalary: string;
  newSchedule: string;
  newBenefits: string;
  employeeFeedback: string;
}

interface ChangeSheetCreateFormProps {
  language: Language;
  editingSheet?: ChangeSheetRecord | null;
  onBack: () => void;
  onSave: () => void;
}

const ChangeSheetCreateForm: React.FC<ChangeSheetCreateFormProps> = ({
  language,
  editingSheet,
  onBack,
  onSave
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [workCenters, setWorkCenters] = useState<Array<{id: string, name: string}>>([]);
  const [contracts, setContracts] = useState<Array<{id: string, name: string}>>([]);
  
  const {
    isWorkCenterModalOpen,
    isContractModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal,
    openContractModal,
    closeContractModal
  } = useWorkCenterModals();

  const [formData, setFormData] = useState<ChangeSheetFormData>({
    title: '',
    description: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    workCenter: '',
    contractsManaged: '',
    newPosition: '',
    newSalary: '',
    newSchedule: '',
    newBenefits: '',
    employeeFeedback: '',
  });

  // Initialize form data when editing
  useEffect(() => {
    if (editingSheet) {
      setFormData({
        title: editingSheet.employeeName || '',
        description: editingSheet.observations || '',
        reason: editingSheet.changeType || '',
        date: editingSheet.startDate ? editingSheet.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        workCenter: editingSheet.originCenter || '',
        contractsManaged: '',
        newPosition: editingSheet.newPosition || '',
        newSalary: '',
        newSchedule: '',
        newBenefits: '',
        employeeFeedback: '',
      });
    }
  }, [editingSheet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(editingSheet ? 'Updating change sheet:' : 'Creating change sheet:', formData);
      toast({
        title: "Éxito",
        description: editingSheet ? "Hoja de cambio actualizada correctamente" : "Hoja de cambio creada correctamente",
      });
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: editingSheet ? "Error al actualizar la hoja de cambio" : "Error al crear la hoja de cambio",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkCentersAndContracts = async () => {
    try {
      const [workCentersData, contractsData] = await Promise.all([
        getWorkCenters(),
        getContracts()
      ]);
      setWorkCenters(workCentersData);
      setContracts(contractsData);
    } catch (error) {
      console.error('Error loading work centers and contracts:', error);
    }
  };

  useEffect(() => {
    loadWorkCentersAndContracts();
  }, []);

  const handleWorkCenterSuccess = () => {
    loadWorkCentersAndContracts();
  };

  const handleContractSuccess = () => {
    loadWorkCentersAndContracts();
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
          {editingSheet ? 'Editar Hoja de Cambio' : 'Crear Nueva Hoja de Cambio'}
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Información de la Hoja de Cambio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                Título *
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título de la hoja de cambio"
                required
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                Fecha *
              </Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
              Descripción *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción detallada de la hoja de cambio"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason" className="text-gray-700 dark:text-gray-300">
              Razón del Cambio *
            </Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Motivo o justificación del cambio"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="workCenter" className="text-gray-700 dark:text-gray-300">
                Centro de Trabajo *
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select value={formData.workCenter} onValueChange={(value) => setFormData(prev => ({ ...prev, workCenter: value }))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccione un centro de trabajo" />
                  </SelectTrigger>
                  <SelectContent>
                    {workCenters.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AddButton 
                  onClick={openWorkCenterModal}
                  label="Añadir"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contract" className="text-gray-700 dark:text-gray-300">
                Contratos que Administra *
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select value={formData.contractsManaged} onValueChange={(value) => setFormData(prev => ({ ...prev, contractsManaged: value }))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccione un contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AddButton 
                  onClick={openContractModal}
                  label="Añadir"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="newPosition" className="text-gray-700 dark:text-gray-300">
                Nueva Posición
              </Label>
              <Input
                type="text"
                id="newPosition"
                name="newPosition"
                value={formData.newPosition}
                onChange={handleChange}
                placeholder="Nueva posición del empleado"
              />
            </div>

            <div>
              <Label htmlFor="newSalary" className="text-gray-700 dark:text-gray-300">
                Nuevo Salario
              </Label>
              <Input
                type="text"
                id="newSalary"
                name="newSalary"
                value={formData.newSalary}
                onChange={handleChange}
                placeholder="Nuevo salario del empleado"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="newSchedule" className="text-gray-700 dark:text-gray-300">
              Nuevo Horario
            </Label>
            <Input
              type="text"
              id="newSchedule"
              name="newSchedule"
              value={formData.newSchedule}
              onChange={handleChange}
              placeholder="Nuevo horario del empleado"
            />
          </div>

          <div>
            <Label htmlFor="newBenefits" className="text-gray-700 dark:text-gray-300">
              Nuevos Beneficios
            </Label>
            <Textarea
              id="newBenefits"
              name="newBenefits"
              value={formData.newBenefits}
              onChange={handleChange}
              placeholder="Nuevos beneficios del empleado"
            />
          </div>

          <div>
            <Label htmlFor="employeeFeedback" className="text-gray-700 dark:text-gray-300">
              Feedback del Empleado
            </Label>
            <Textarea
              id="employeeFeedback"
              name="employeeFeedback"
              value={formData.employeeFeedback}
              onChange={handleChange}
              placeholder="Comentarios o feedback del empleado"
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
                {editingSheet ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingSheet ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateWorkCenterModal
        isOpen={isWorkCenterModalOpen}
        onClose={closeWorkCenterModal}
        onSuccess={handleWorkCenterSuccess}
      />

      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={closeContractModal}
        onSuccess={handleContractSuccess}
      />
    </div>
  );
};

export default ChangeSheetCreateForm;
