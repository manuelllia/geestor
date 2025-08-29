
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getWorkCenters } from '../../services/workCentersService';
import { createChangeSheet } from '../../services/changeSheetsService';
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

interface ChangeSheetFormData {
  employeeName: string;
  employeeLastName: string;
  originCenter: string;
  contractsManaged: string;
  currentPosition: string;
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  destinationCenter: string;
  contractsToManage: string;
  newPosition: string;
  newSupervisorName: string;
  newSupervisorLastName: string;
  startDate: string;
  changeType: '' | 'Permanente' | 'Temporal';
  needs: string[];
  currentCompany: string;
  companyChange: '' | 'Si' | 'No';
  observations: string;
}

interface ChangeSheetCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

const ChangeSheetCreateForm: React.FC<ChangeSheetCreateFormProps> = ({
  language,
  onBack,
  onSave
}) => {
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [workCenters, setWorkCenters] = useState<Array<{id: string, name: string}>>([]);
  
  const {
    isWorkCenterModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal
  } = useWorkCenterModals();

  const [formData, setFormData] = useState<ChangeSheetFormData>({
    employeeName: '',
    employeeLastName: '',
    originCenter: '',
    contractsManaged: '',
    currentPosition: '',
    currentSupervisorName: '',
    currentSupervisorLastName: '',
    destinationCenter: '',
    contractsToManage: '',
    newPosition: '',
    newSupervisorName: '',
    newSupervisorLastName: '',
    startDate: '',
    changeType: '',
    needs: [],
    currentCompany: '',
    companyChange: '',
    observations: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof ChangeSheetFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNeedsChange = (need: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      needs: checked 
        ? [...prev.needs, need]
        : prev.needs.filter(n => n !== need)
    }));
  };

  const loadWorkCenters = async () => {
    try {
      const workCentersData = await getWorkCenters();
      setWorkCenters(workCentersData);
    } catch (error) {
      console.error('Error loading work centers:', error);
    }
  };

  useEffect(() => {
    loadWorkCenters();
  }, []);

  const handleWorkCenterSuccess = () => {
    closeWorkCenterModal();
    loadWorkCenters();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Validation
    if (!formData.employeeName || !formData.employeeLastName || !formData.originCenter || !formData.currentPosition) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, complete todos los campos obligatorios.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const processedData = {
        employeeName: formData.employeeName,
        employeeLastName: formData.employeeLastName,
        originCenter: formData.originCenter,
        contractsManaged: formData.contractsManaged,
        currentPosition: formData.currentPosition,
        currentSupervisorName: formData.currentSupervisorName,
        currentSupervisorLastName: formData.currentSupervisorLastName,
        destinationCenter: formData.destinationCenter,
        contractsToManage: formData.contractsToManage,
        newPosition: formData.newPosition,
        newSupervisorName: formData.newSupervisorName,
        newSupervisorLastName: formData.newSupervisorLastName,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        changeType: formData.changeType as '' | 'Permanente' | 'Temporal',
        needs: formData.needs,
        currentCompany: formData.currentCompany,
        companyChange: formData.companyChange as '' | 'Si' | 'No',
        observations: formData.observations,
        title: `Cambio de ${formData.employeeName} ${formData.employeeLastName}`,
        type: 'Cambio de Centro',
        priority: 'Media' as 'Alta' | 'Media' | 'Baja',
        requesterName: formData.employeeName,
        requesterLastName: formData.employeeLastName,
        requestDate: new Date(),
        status: 'Pendiente'
      };

      await createChangeSheet(processedData);

      toast({
        title: "Éxito",
        description: "Hoja de cambio creada correctamente",
      });
      onSave();
    } catch (error) {
      console.error('Error al crear la hoja de cambio:', error);
      toast({
        title: "Error",
        description: "Error al crear la hoja de cambio",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const needsOptions = [
    'Teléfono móvil',
    'Tarjeta de combustible',
    'Vehículo de empresa',
    'Formación específica',
    'Equipo informático',
    'Uniformes/EPIs'
  ];

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
          Nueva Hoja de Cambio
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
                Nombre del Empleado *
              </Label>
              <Input
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="Nombre del empleado"
                required
              />
            </div>
            <div>
              <Label htmlFor="employeeLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos del Empleado *
              </Label>
              <Input
                type="text"
                id="employeeLastName"
                name="employeeLastName"
                value={formData.employeeLastName}
                onChange={handleChange}
                placeholder="Apellidos del empleado"
                required
              />
            </div>
          </div>

          {/* Current Position Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="originCenter" className="text-gray-700 dark:text-gray-300">
                Centro de Origen *
              </Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.originCenter}
                  onValueChange={(value) => handleSelectChange('originCenter', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccione un centro" />
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
              <Label htmlFor="currentPosition" className="text-gray-700 dark:text-gray-300">
                Posición Actual *
              </Label>
              <Input
                type="text"
                id="currentPosition"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
                placeholder="Posición actual"
                required
              />
            </div>
          </div>

          {/* Change Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="changeType" className="text-gray-700 dark:text-gray-300">
                Tipo de Cambio
              </Label>
              <Select
                value={formData.changeType}
                onValueChange={(value: 'Permanente' | 'Temporal') => handleSelectChange('changeType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanente">Permanente</SelectItem>
                  <SelectItem value="Temporal">Temporal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate" className="text-gray-700 dark:text-gray-300">
                Fecha de Inicio
              </Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Needs Section */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              Necesidades
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {needsOptions.map((need) => (
                <div key={need} className="flex items-center space-x-2">
                  <Checkbox
                    id={need}
                    checked={formData.needs.includes(need)}
                    onCheckedChange={(checked) => handleNeedsChange(need, !!checked)}
                  />
                  <Label htmlFor={need} className="text-sm">
                    {need}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Company Change */}
          <div>
            <Label htmlFor="companyChange" className="text-gray-700 dark:text-gray-300">
              Cambio de Empresa
            </Label>
            <Select
              value={formData.companyChange}
              onValueChange={(value: 'Si' | 'No') => handleSelectChange('companyChange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Si">Sí</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observations" className="text-gray-700 dark:text-gray-300">
              Observaciones
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

      <CreateWorkCenterModal
        isOpen={isWorkCenterModalOpen}
        onClose={closeWorkCenterModal}
        onSuccess={handleWorkCenterSuccess}
      />
    </div>
  );
};

export default ChangeSheetCreateForm;
