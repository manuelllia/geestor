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
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

interface ContractRequestFormData {
  requestTitle: string;
  description: string;
  priority: string;
  requestDate: string;
  workCenter: string;
  contractsManaged: string;
  expectedStartDate: string;
  budgetEstimate: string;
  requestReason: string;
  additionalNotes: string;
}

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

  const [formData, setFormData] = useState<ContractRequestFormData>({
    requestTitle: '',
    description: '',
    priority: '',
    requestDate: new Date().toISOString().split('T')[0],
    workCenter: '',
    contractsManaged: '',
    expectedStartDate: '',
    budgetEstimate: '',
    requestReason: '',
    additionalNotes: ''
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
      // Simulate creating contract request - replace with actual service call
      console.log('Creating contract request:', formData);
      toast({
        title: "Éxito",
        description: "Solicitud de contratación creada correctamente",
      });
      onSave();
    } catch (error) {
      console.error('Error creating contract request:', error);
      toast({
        title: "Error",
        description: "Error al crear la solicitud de contratación",
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
          Crear Nueva Solicitud de Contratación
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Información de la Solicitud
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="requestTitle" className="text-gray-700 dark:text-gray-300">
                Título de la Solicitud *
              </Label>
              <Input
                id="requestTitle"
                type="text"
                value={formData.requestTitle}
                onChange={(e) => setFormData({ ...formData, requestTitle: e.target.value })}
                placeholder="Ingrese el título de la solicitud"
              />
            </div>

            <div>
              <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">
                Prioridad *
              </Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
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
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
              Descripción *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada de la solicitud"
            />
          </div>

          <div>
            <Label htmlFor="requestReason" className="text-gray-700 dark:text-gray-300">
              Razón de la Solicitud
            </Label>
            <Textarea
              id="requestReason"
              value={formData.requestReason}
              onChange={(e) => setFormData({ ...formData, requestReason: e.target.value })}
              placeholder="Motivo de la solicitud"
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

export default ContractRequestCreateForm;
