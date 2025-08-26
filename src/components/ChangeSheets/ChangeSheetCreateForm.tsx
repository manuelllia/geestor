import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Importado para Tipo de Cambio y Cambio de Empresa
import { Checkbox } from '@/components/ui/checkbox'; // Importado para Necesidades
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getWorkCenters, getContracts } from '../../services/workCentersService';
// Asumo que ChangeSheetRecord puede necesitar algunas de las nuevas propiedades,
// aunque se manejarán como opcionales en el mapeo si no existen.
import { ChangeSheetRecord } from '../../services/changeSheetsService';
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

// --- NUEVA INTERFAZ ChangeSheetFormData ---
interface ChangeSheetFormData {
  employeeName: string; // Nombre Empleado
  employeeLastName: string; // Apellidos Empleado
  originCenter: string; // Centro De Salida (anteriormente workCenter)
  contractsManaged: string; // Contratos que Administra (campo existente)
  currentPosition: string; // Puesto Actual (valor de selección)
  currentPositionOther: string; // Para la opción 'Otro' de Puesto Actual
  currentSupervisorName: string; // Nombre Responsable Actual
  currentSupervisorLastName: string; // Apellidos Responsable Actual
  destinationCenter: string; // Centro de Destino (nuevo campo)
  contractsToManage: string; // Contratos a Gestionar (nuevo campo)
  newPosition: string; // Nuevo Puesto (valor de selección)
  newPositionOther: string; // Para la opción 'Otro' de Nuevo Puesto
  startDate: string; // Fecha de Inicio
  changeType: 'Permanente' | 'Temporal' | ''; // Tipo de Cambio (radio)
  needs: string[]; // Necesidades (array de checkboxes)
  currentCompany: string; // Empresa Actual (valor de selección)
  currentCompanyOther: string; // Para la opción 'OTRA' de Empresa Actual
  companyChange: 'Si' | 'No' | ''; // Cambio de Empresa (radio)
  observations: string; // Motivo del Cambio y Observaciones (textarea combinado)
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

  // Opciones predefinidas para los campos de selección y checkboxes
  const positionOptions = ['Técnico/a', 'Responsable de Centro', 'Especialista (EDE)', 'Adminitrativo/a', 'Otro'];
  const companyOptions = ['ASIME SA', 'IBERMAN SA', 'MANTELEC SA', 'INDEL FACILITIES', 'INSANEX SSL', 'SSM', 'RD HEALING', 'AINTEC', 'OTRA'];
  const needsOptions = ['Actuación PRL', 'Desplazamiento', 'Alojamiento', 'Piso GEE', 'Vehíclo'];
  
  const {
    isWorkCenterModalOpen,
    isContractModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal,
    openContractModal,
    closeContractModal
  } = useWorkCenterModals();

  // --- NUEVA INICIALIZACIÓN DEL ESTADO formData ---
  const [formData, setFormData] = useState<ChangeSheetFormData>({
    employeeName: '',
    employeeLastName: '',
    originCenter: '',
    contractsManaged: '',
    currentPosition: '',
    currentPositionOther: '',
    currentSupervisorName: '',
    currentSupervisorLastName: '',
    destinationCenter: '',
    contractsToManage: '',
    newPosition: '',
    newPositionOther: '',
    startDate: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    changeType: '',
    needs: [],
    currentCompany: '',
    currentCompanyOther: '',
    companyChange: '',
    observations: '',
  });

  // --- Mapeo de datos para edición (editingSheet) ---
  useEffect(() => {
    if (editingSheet) {
      setFormData({
        employeeName: editingSheet.employeeName || '',
        employeeLastName: editingSheet.employeeLastName || '',
        originCenter: editingSheet.originCenter || '',
        contractsManaged: editingSheet.contractsManaged || '',
        currentPosition: editingSheet.currentPosition || '',
        currentPositionOther: '', // No se mapea desde editingSheet, se maneja en el UI
        currentSupervisorName: editingSheet.currentSupervisorName || '',
        currentSupervisorLastName: editingSheet.currentSupervisorLastName || '',
        destinationCenter: editingSheet.destinationCenter || '', // Nuevo campo
        contractsToManage: editingSheet.contractsToManage || '', // Nuevo campo
        newPosition: editingSheet.newPosition || '',
        newPositionOther: '', // No se mapea desde editingSheet
        startDate: editingSheet.startDate
          ? (editingSheet.startDate instanceof Date ? editingSheet.startDate.toISOString().split('T')[0] : editingSheet.startDate)
          : new Date().toISOString().split('T')[0],
        changeType: (editingSheet.changeType === 'Permanente' || editingSheet.changeType === 'Temporal')
          ? editingSheet.changeType
          : '',
        needs: editingSheet.needs || [],
        currentCompany: editingSheet.currentCompany || '',
        currentCompanyOther: '', // No se mapea desde editingSheet
        companyChange: (editingSheet.companyChange === 'Si' || editingSheet.companyChange === 'No')
          ? editingSheet.companyChange
          : '',
        observations: editingSheet.observations || '', // Combina motivo y observaciones
      });
    }
  }, [editingSheet]);

  // Manejador genérico para inputs de texto, textarea y fecha
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para Select y RadioGroup
  const handleSelectOrRadioChange = (name: keyof ChangeSheetFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para Checkbox (Necesidades)
  const handleNeedsChange = (item: string, checked: boolean) => {
    setFormData(prev => {
      const newNeeds = checked
        ? [...prev.needs, item]
        : prev.needs.filter(n => n !== item);
      return { ...prev, needs: newNeeds };
    });
  };

  // Función para cargar Centros de Trabajo y Contratos
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
  }, []); // Se ejecuta solo una vez al montar el componente

  const handleWorkCenterSuccess = () => {
    closeWorkCenterModal();
    loadWorkCentersAndContracts();
  };

  const handleContractSuccess = () => {
    closeContractModal();
    loadWorkCentersAndContracts();
  };

  // --- Función handleSubmit (enviando los nuevos campos) ---
  const handleSubmit = async () => {
    setIsLoading(true);

    // Validación básica de campos obligatorios
    if (
      !formData.employeeName ||
      !formData.employeeLastName ||
      !formData.originCenter ||
      !formData.currentPosition || (formData.currentPosition === 'Otro' && !formData.currentPositionOther) ||
      !formData.currentSupervisorName ||
      !formData.currentSupervisorLastName ||
      !formData.destinationCenter ||
      !formData.newPosition || (formData.newPosition === 'Otro' && !formData.newPositionOther) ||
      !formData.startDate ||
      !formData.changeType ||
      !formData.currentCompany || (formData.currentCompany === 'OTRA' && !formData.currentCompanyOther) ||
      !formData.companyChange ||
      !formData.observations
    ) {
      toast({
        title: "Campos Requeridos",
        description: "Por favor, complete todos los campos obligatorios.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Prepara los datos para guardar, manejando las opciones "Otro" / "OTRA"
      const dataToSave = {
        ...formData,
        currentPosition: formData.currentPosition === 'Otro' ? formData.currentPositionOther : formData.currentPosition,
        newPosition: formData.newPosition === 'Otro' ? formData.newPositionOther : formData.newPosition,
        currentCompany: formData.currentCompany === 'OTRA' ? formData.currentCompanyOther : formData.currentCompany,
        // Eliminar campos temporales 'Other' si no deben guardarse en la base de datos
        currentPositionOther: undefined,
        newPositionOther: undefined,
        currentCompanyOther: undefined,
      };

      console.log(editingSheet ? 'Updating change sheet:' : 'Creating change sheet:', dataToSave);
      // Aquí iría la llamada a tu servicio para guardar/actualizar la hoja de cambio en Firebase
      // await saveChangeSheet(dataToSave); // Ejemplo

      toast({
        title: "Éxito",
        description: editingSheet ? "Hoja de cambio actualizada correctamente" : "Hoja de cambio creada correctamente",
      });
      onSave(); // Vuelve a la pantalla anterior o actualiza la lista
    } catch (error) {
      console.error("Error saving change sheet:", error);
      toast({
        title: "Error",
        description: editingSheet ? "Error al actualizar la hoja de cambio" : "Error al crear la hoja de cambio",
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
          {/* Nombre Empleado y Apellidos Empleado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employeeName" className="text-gray-700 dark:text-gray-300">
                Nombre Empleado *
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
                Apellidos Empleado *
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

          {/* Centro De Salida y Contratos que Administra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="originCenter" className="text-gray-700 dark:text-gray-300">
                Centro De Salida *
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.originCenter}
                  onValueChange={(value) => handleSelectOrRadioChange('originCenter', value)}
                  required
                >
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
              <Label htmlFor="contractsManaged" className="text-gray-700 dark:text-gray-300">
                Contratos que Administra
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.contractsManaged}
                  onValueChange={(value) => handleSelectOrRadioChange('contractsManaged', value)}
                >
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

          {/* Puesto Actual */}
          <div>
            <Label htmlFor="currentPosition" className="text-gray-700 dark:text-gray-300">
              Puesto Actual *
            </Label>
            <Select
              value={formData.currentPosition}
              onValueChange={(value) => handleSelectOrRadioChange('currentPosition', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {positionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.currentPosition === 'Otro' && (
              <Input
                type="text"
                id="currentPositionOther"
                name="currentPositionOther"
                value={formData.currentPositionOther}
                onChange={handleChange}
                placeholder="Especifique el puesto actual"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Nombre Responsable Actual y Apellidos Responsable Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currentSupervisorName" className="text-gray-700 dark:text-gray-300">
                Nombre Responsable Actual *
              </Label>
              <Input
                type="text"
                id="currentSupervisorName"
                name="currentSupervisorName"
                value={formData.currentSupervisorName}
                onChange={handleChange}
                placeholder="Nombre del responsable actual"
                required
              />
            </div>
            <div>
              <Label htmlFor="currentSupervisorLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos Responsable Actual *
              </Label>
              <Input
                type="text"
                id="currentSupervisorLastName"
                name="currentSupervisorLastName"
                value={formData.currentSupervisorLastName}
                onChange={handleChange}
                placeholder="Apellidos del responsable actual"
                required
              />
            </div>
          </div>

          {/* Centro de Destino y Contratos a Gestionar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="destinationCenter" className="text-gray-700 dark:text-gray-300">
                Centro de Destino *
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.destinationCenter}
                  onValueChange={(value) => handleSelectOrRadioChange('destinationCenter', value)}
                  required
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccione un centro de destino" />
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
              <Label htmlFor="contractsToManage" className="text-gray-700 dark:text-gray-300">
                Contratos a Gestionar
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.contractsToManage}
                  onValueChange={(value) => handleSelectOrRadioChange('contractsToManage', value)}
                >
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

          {/* Nuevo Puesto */}
          <div>
            <Label htmlFor="newPosition" className="text-gray-700 dark:text-gray-300">
              Nuevo Puesto *
            </Label>
            <Select
              value={formData.newPosition}
              onValueChange={(value) => handleSelectOrRadioChange('newPosition', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {positionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.newPosition === 'Otro' && (
              <Input
                type="text"
                id="newPositionOther"
                name="newPositionOther"
                value={formData.newPositionOther}
                onChange={handleChange}
                placeholder="Especifique el nuevo puesto"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Fecha de Inicio */}
          <div>
            <Label htmlFor="startDate" className="text-gray-700 dark:text-gray-300">
              Fecha de Inicio *
            </Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tipo de Cambio */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              Tipo de Cambio *
            </Label>
            <RadioGroup
              value={formData.changeType}
              onValueChange={(value: 'Permanente' | 'Temporal') => handleSelectOrRadioChange('changeType', value)}
              className="flex space-x-4 mt-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Permanente" id="changeType-permanente" />
                <Label htmlFor="changeType-permanente">Cambio Permanente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Temporal" id="changeType-temporal" />
                <Label htmlFor="changeType-temporal">Cambio Temporal</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Necesidades */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              Necesidades
            </Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {needsOptions.map((need) => (
                <div key={need} className="flex items-center space-x-2">
                  <Checkbox
                    id={`need-${need}`}
                    checked={formData.needs.includes(need)}
                    onCheckedChange={(checked) => handleNeedsChange(need, checked as boolean)}
                  />
                  <Label htmlFor={`need-${need}`}>{need}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Empresa Actual */}
          <div>
            <Label htmlFor="currentCompany" className="text-gray-700 dark:text-gray-300">
              Empresa Actual *
            </Label>
            <Select
              value={formData.currentCompany}
              onValueChange={(value) => handleSelectOrRadioChange('currentCompany', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {companyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.currentCompany === 'OTRA' && (
              <Input
                type="text"
                id="currentCompanyOther"
                name="currentCompanyOther"
                value={formData.currentCompanyOther}
                onChange={handleChange}
                placeholder="Especifique la empresa actual"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Cambio de Empresa */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              Cambio de Empresa *
            </Label>
            <RadioGroup
              value={formData.companyChange}
              onValueChange={(value: 'Si' | 'No') => handleSelectOrRadioChange('companyChange', value)}
              className="flex space-x-4 mt-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Si" id="companyChange-si" />
                <Label htmlFor="companyChange-si">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="companyChange-no" />
                <Label htmlFor="companyChange-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Motivo del Cambio y Observaciones */}
          <div>
            <Label htmlFor="observations" className="text-gray-700 dark:text-gray-300">
              Motivo del Cambio y Observaciones *
            </Label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Escriba el motivo del cambio y las observaciones"
              required
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

      {/* Modales existentes */}
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