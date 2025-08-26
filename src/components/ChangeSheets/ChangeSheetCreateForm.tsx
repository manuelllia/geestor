// src/components/Forms/ChangeSheetCreateForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getWorkCenters, getContracts } from '../../services/workCentersService';
import { ChangeSheetRecord } from '../../services/changeSheetsService'; // Importa la interfaz actualizada
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

// Importa Firebase Firestore
import { db, serverTimestamp, Timestamp } from '../../lib/firebase'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';


// --- Interfaz ChangeSheetFormData para el estado local del formulario ---
// Incluye los campos 'Other' para la lógica del UI
interface ChangeSheetFormData {
  employeeName: string;
  employeeLastName: string;
  originCenter: string; // ID del centro de trabajo de origen
  contractsManaged: string; // ID del contrato que administra
  currentPosition: string; // Valor de selección (puede ser 'Otro')
  currentPositionOther: string; // Para la opción 'Otro' de Puesto Actual
  currentSupervisorName: string;
  currentSupervisorLastName: string;
  destinationCenter: string; // Nuevo campo: ID del centro de trabajo de destino
  contractsToManage: string; // Nuevo campo: ID del contrato a gestionar
  newPosition: string; // Valor de selección (puede ser 'Otro')
  newPositionOther: string; // Para la opción 'Otro' de Nuevo Puesto
  startDate: string; // Fecha en formato 'YYYY-MM-DD'
  changeType: 'Permanente' | 'Temporal' | '';
  needs: string[]; // Array de strings
  currentCompany: string; // Valor de selección (puede ser 'OTRA')
  currentCompanyOther: string; // Para la opción 'OTRA' de Empresa Actual
  companyChange: 'Si' | 'No' | '';
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
        // Manejar 'Otro' y 'OTRA' al cargar para edición
        currentPosition: positionOptions.includes(editingSheet.currentPosition) ? editingSheet.currentPosition : 'Otro',
        currentPositionOther: !positionOptions.includes(editingSheet.currentPosition) ? editingSheet.currentPosition : '',
        currentSupervisorName: editingSheet.currentSupervisorName || '',
        currentSupervisorLastName: editingSheet.currentSupervisorLastName || '',
        destinationCenter: editingSheet.destinationCenter || '', // Nuevo campo
        contractsToManage: editingSheet.contractsToManage || '', // Nuevo campo
        newPosition: positionOptions.includes(editingSheet.newPosition) ? editingSheet.newPosition : 'Otro',
        newPositionOther: !positionOptions.includes(editingSheet.newPosition) ? editingSheet.newPosition : '',
        startDate: editingSheet.startDate
          ? editingSheet.startDate.toISOString().split('T')[0] // Convierte Date a string YYYY-MM-DD
          : new Date().toISOString().split('T')[0],
        changeType: editingSheet.changeType || '',
        needs: editingSheet.needs || [],
        currentCompany: companyOptions.includes(editingSheet.currentCompany) ? editingSheet.currentCompany : 'OTRA',
        currentCompanyOther: !companyOptions.includes(editingSheet.currentCompany) ? editingSheet.currentCompany : '',
        companyChange: editingSheet.companyChange || '',
        observations: editingSheet.observations || '',
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
  }, []);

  const handleWorkCenterSuccess = () => {
    closeWorkCenterModal();
    loadWorkCentersAndContracts(); // Recarga los centros para que el nuevo aparezca en el select
  };

  const handleContractSuccess = () => {
    closeContractModal();
    loadWorkCentersAndContracts(); // Recarga los contratos para que el nuevo aparezca en el select
  };

  // --- Función handleSubmit (enviando los nuevos campos a Firestore) ---
  const handleSubmit = async () => {
    setIsLoading(true);

    // 1. Pre-procesar los datos y validar campos obligatorios
    // Los campos 'Other' y 'OTRA' se resuelven aquí para el payload final
    const processedData = {
      employeeName: formData.employeeName,
      employeeLastName: formData.employeeLastName,
      originCenter: formData.originCenter,
      contractsManaged: formData.contractsManaged || '', // Opcional
      currentPosition: formData.currentPosition === 'Otro' ? formData.currentPositionOther : formData.currentPosition,
      currentSupervisorName: formData.currentSupervisorName,
      currentSupervisorLastName: formData.currentSupervisorLastName,
      destinationCenter: formData.destinationCenter,
      contractsToManage: formData.contractsToManage || '', // Opcional
      newPosition: formData.newPosition === 'Otro' ? formData.newPositionOther : formData.newPosition,
      startDate: formData.startDate, // Todavía en string para validación
      changeType: formData.changeType,
      needs: formData.needs,
      currentCompany: formData.currentCompany === 'OTRA' ? formData.currentCompanyOther : formData.currentCompany,
      companyChange: formData.companyChange,
      observations: formData.observations,
    };

    // 2. Validación de campos obligatorios
    // Lista de campos que deben tener un valor.
    // Los campos de selección con "Otro"/"OTRA" requieren que el campo "Other" esté relleno si se elige esa opción.
    const requiredFields: Array<keyof typeof processedData> = [
      'employeeName', 'employeeLastName', 'originCenter', 'currentPosition',
      'currentSupervisorName', 'currentSupervisorLastName', 'destinationCenter',
      'newPosition', 'startDate', 'changeType', 'currentCompany', 'companyChange', 'observations'
    ];

    let isValid = true;
    let missingFieldName = ''; // Para identificar el campo faltante

    for (const field of requiredFields) {
      const value = processedData[field];

      if (typeof value === 'string' && value.trim() === '') {
        isValid = false;
        missingFieldName = field;
        break;
      }
      if (Array.isArray(value) && value.length === 0 && field === 'needs' /* si 'needs' fuera obligatorio */) {
         // Si 'needs' no es obligatorio, no se necesita esta validación
      }
      // Validaciones específicas para campos 'Otro'
      if (field === 'currentPosition' && formData.currentPosition === 'Otro' && formData.currentPositionOther.trim() === '') {
        isValid = false;
        missingFieldName = 'currentPositionOther';
        break;
      }
      if (field === 'newPosition' && formData.newPosition === 'Otro' && formData.newPositionOther.trim() === '') {
        isValid = false;
        missingFieldName = 'newPositionOther';
        break;
      }
      if (field === 'currentCompany' && formData.currentCompany === 'OTRA' && formData.currentCompanyOther.trim() === '') {
        isValid = false;
        missingFieldName = 'currentCompanyOther';
        break;
      }
    }

    if (!isValid) {
      toast({
        title: "Campos Incompletos",
        description: `Por favor, complete todos los campos obligatorios. Falta: ${missingFieldName}`,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Convertir la fecha string a Timestamp para Firestore
    const startDateTimestamp = processedData.startDate ? Timestamp.fromDate(new Date(processedData.startDate)) : null;

    // Payload final para Firestore
    const firestorePayload = {
      ...processedData,
      startDate: startDateTimestamp,
      // Asegurarse de que los tipos literales sean correctos
      changeType: processedData.changeType as 'Permanente' | 'Temporal',
      companyChange: processedData.companyChange as 'Si' | 'No',
    };

    // 3. Lógica de guardado/actualización en Firestore
    try {
      const sheetsCollectionRef = collection(db, 'Gestión de Talento', 'hojas-cambio', 'Hojas de Cambio');

      if (editingSheet && editingSheet.id) {
        // Modo Edición: Actualizar documento existente
        const docRef = doc(sheetsCollectionRef, editingSheet.id);
        await updateDoc(docRef, {
          ...firestorePayload,
          updatedAt: serverTimestamp(),
        });
        toast({
          title: "Éxito",
          description: "Hoja de cambio actualizada correctamente.",
        });
      } else {
        // Modo Creación: Añadir nuevo documento
        await addDoc(sheetsCollectionRef, {
          ...firestorePayload,
          status: 'Pendiente', // Estado por defecto para nuevas hojas
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast({
          title: "Éxito",
          description: "Nueva hoja de cambio creada correctamente.",
        });
      }
      onSave(); // Llama a la función onSave para refrescar la lista o redirigir
    } catch (error) {
      console.error("Error al guardar la hoja de cambio:", error);
      toast({
        title: "Error",
        description: `Hubo un error al ${editingSheet ? 'actualizar' : 'crear'} la hoja de cambio. Inténtelo de nuevo.`,
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