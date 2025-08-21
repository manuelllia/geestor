
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
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';
import { getWorkCenters, getContracts } from '../../services/workCentersService';

interface EmployeeAgreementFormData {
  employeeName: string;
  employeeLastName: string;
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  agreementType: string;
  salary: number;
  benefits: string;
  responsibilities: string;
  workCenter: string;
  contractsManaged: string;
  performanceGoals: string;
  developmentPlan: string;
  comments: string;
}

interface EmployeeAgreementCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

const EmployeeAgreementCreateForm: React.FC<EmployeeAgreementCreateFormProps> = ({
  language,
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

  const [formData, setFormData] = useState<EmployeeAgreementFormData>({
    employeeName: '',
    employeeLastName: '',
    position: '',
    department: '',
    startDate: new Date(),
    endDate: undefined,
    agreementType: '',
    salary: 0,
    benefits: '',
    responsibilities: '',
    workCenter: '',
    contractsManaged: '',
    performanceGoals: '',
    developmentPlan: '',
    comments: ''
  });

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate creating employee agreement - replace with actual service call
      console.log('Creating employee agreement:', formData);
      toast({
        title: "Éxito",
        description: "Acuerdo con empleado creado correctamente",
      });
      onSave();
    } catch (error) {
      console.error('Error creating employee agreement:', error);
      toast({
        title: "Error",
        description: "Error al crear el acuerdo con empleado",
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
          Crear Nuevo Acuerdo con Empleado
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Información del Acuerdo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employeeName" className="text-gray-700 dark:text-gray-300">
                Nombre del Empleado *
              </Label>
              <Input
                id="employeeName"
                type="text"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                placeholder="Ingrese el nombre del empleado"
              />
            </div>

            <div>
              <Label htmlFor="employeeLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos del Empleado *
              </Label>
              <Input
                id="employeeLastName"
                type="text"
                value={formData.employeeLastName}
                onChange={(e) => setFormData({ ...formData, employeeLastName: e.target.value })}
                placeholder="Ingrese los apellidos del empleado"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">
                Posición *
              </Label>
              <Input
                id="position"
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Ingrese la posición"
              />
            </div>

            <div>
              <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                Departamento *
              </Label>
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Ingrese el departamento"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="agreementType" className="text-gray-700 dark:text-gray-300">
                Tipo de Acuerdo *
              </Label>
              <Input
                id="agreementType"
                type="text"
                value={formData.agreementType}
                onChange={(e) => setFormData({ ...formData, agreementType: e.target.value })}
                placeholder="Ingrese el tipo de acuerdo"
              />
            </div>

            <div>
              <Label htmlFor="salary" className="text-gray-700 dark:text-gray-300">
                Salario *
              </Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                placeholder="Ingrese el salario"
              />
            </div>
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

          <div>
            <Label htmlFor="benefits" className="text-gray-700 dark:text-gray-300">
              Beneficios
            </Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              placeholder="Ingrese los beneficios"
            />
          </div>

          <div>
            <Label htmlFor="responsibilities" className="text-gray-700 dark:text-gray-300">
              Responsabilidades
            </Label>
            <Textarea
              id="responsibilities"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              placeholder="Ingrese las responsabilidades"
            />
          </div>

          <div>
            <Label htmlFor="performanceGoals" className="text-gray-700 dark:text-gray-300">
              Objetivos de Rendimiento
            </Label>
            <Textarea
              id="performanceGoals"
              value={formData.performanceGoals}
              onChange={(e) => setFormData({ ...formData, performanceGoals: e.target.value })}
              placeholder="Ingrese los objetivos de rendimiento"
            />
          </div>

          <div>
            <Label htmlFor="developmentPlan" className="text-gray-700 dark:text-gray-300">
              Plan de Desarrollo
            </Label>
            <Textarea
              id="developmentPlan"
              value={formData.developmentPlan}
              onChange={(e) => setFormData({ ...formData, developmentPlan: e.target.value })}
              placeholder="Ingrese el plan de desarrollo"
            />
          </div>

          <div>
            <Label htmlFor="comments" className="text-gray-700 dark:text-gray-300">
              Comentarios
            </Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Ingrese comentarios adicionales"
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

export default EmployeeAgreementCreateForm;
