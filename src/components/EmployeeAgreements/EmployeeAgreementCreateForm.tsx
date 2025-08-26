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
import CreateContractModal from '../Modals/CreateContractModal'; // Mantenido si se usa en otro contexto
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';
import { getWorkCenters, getContracts } from '../../services/workCentersService'; // getContracts se mantiene si el modal aún se usa
import { saveEmployeeAgreement } from '../../services/employeeAgreementsService'; // IMPORTANTE: Importa la función de guardado

// --- NUEVA INTERFAZ EmployeeAgreementFormData ---
interface EmployeeAgreementFormData {
  employeeName: string; // Nombre Empleado
  employeeLastName: string; // Apellidos Empleado
  workCenter: string; // Centro de Trabajo
  city: string; // Población
  province: string; // Provincia
  autonomousCommunity: string; // Comunidad Autónoma
  responsibleName: string; // Nombre Responsable
  responsibleLastName: string; // Apellidos Responsable
  agreementConcepts: string; // Conceptos del Acuerdo (valor de selección)
  agreementConceptsOther: string; // Para la opción 'Otro' de Conceptos del Acuerdo
  economicAgreement1: string; // Acuerdo Económico 1 (campo de texto numérico)
  concept1: string; // Concepto 1
  economicAgreement2: string; // Acuerdo Económico 2 (campo de texto numérico)
  concept2: string; // Concepto 2
  economicAgreement3: string; // Acuerdo Económico 3 (campo de texto numérico)
  concept3: string; // Concepto 3
  activationDate: string; // Fecha de Activación (selector de fecha)
  endDate: string; // Fecha Fin (selector de fecha)
  observationsAndCommitment: string; // Observaciones y Compromiso (textarea)
}

interface EmployeeAgreementCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
  // Si necesitaras editar, añadirías un prop 'editingAgreement?: EmployeeAgreementRecord | null;'
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
  const [contracts, setContracts] = useState<Array<{id: string, name: string}>>([]); // Se mantiene por si el modal de contratos es útil en otro contexto
  
  const {
    isWorkCenterModalOpen,
    isContractModalOpen, // Se mantiene por si el modal de contratos es útil en otro contexto
    openWorkCenterModal,
    closeWorkCenterModal,
    openContractModal,
    closeContractModal
  } = useWorkCenterModals();

  // --- Opciones predefinidas para Conceptos del Acuerdo ---
  const agreementConceptsOptions = [
    'Cambio de Puesto',
    'Complemento de Responsabilidad',
    'Complemento de Destino',
    'Complemento Internacional',
    'Subida Salarial',
    'Anulación de Acuerdo',
    'Otro'
  ];

  // --- ESTADO DEL FORMULARIO INICIALIZADO CON LOS NUEVOS CAMPOS ---
  const [formData, setFormData] = useState<EmployeeAgreementFormData>({
    employeeName: '',
    employeeLastName: '',
    workCenter: '',
    city: '',
    province: '',
    autonomousCommunity: '',
    responsibleName: '',
    responsibleLastName: '',
    agreementConcepts: '',
    agreementConceptsOther: '',
    economicAgreement1: '',
    concept1: '',
    economicAgreement2: '',
    concept2: '',
    economicAgreement3: '',
    concept3: '',
    activationDate: '', // O puedes poner new Date().toISOString().split('T')[0]
    endDate: '',
    observationsAndCommitment: '',
  });

  // Manejador genérico para inputs de texto, textarea y fecha
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para Select
  const handleSelectChange = (name: keyof EmployeeAgreementFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadWorkCentersAndContracts = async () => {
    try {
      const [workCentersData, contractsData] = await Promise.all([
        getWorkCenters(),
        getContracts()
      ]);
      setWorkCenters(workCentersData);
      setContracts(contractsData); // Se mantiene si el modal de contratos es útil en otro contexto
    } catch (error) {
      console.error('Error loading work centers and contracts:', error);
    }
  };

  useEffect(() => {
    loadWorkCentersAndContracts();
  }, []);

  const handleWorkCenterSuccess = () => {
    closeWorkCenterModal();
    loadWorkCentersAndContracts();
  };

  const handleContractSuccess = () => {
    closeContractModal();
    loadWorkCentersAndContracts();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // 1. Pre-procesar los datos para la validación y el envío
    const processedData = {
      employeeName: formData.employeeName,
      employeeLastName: formData.employeeLastName,
      workCenter: formData.workCenter,
      city: formData.city,
      province: formData.province,
      autonomousCommunity: formData.autonomousCommunity,
      responsibleName: formData.responsibleName,
      responsibleLastName: formData.responsibleLastName,
      agreementConcepts: formData.agreementConcepts === 'Otro' ? formData.agreementConceptsOther : formData.agreementConcepts,
      economicAgreement1: formData.economicAgreement1,
      concept1: formData.concept1,
      economicAgreement2: formData.economicAgreement2,
      concept2: formData.concept2,
      economicAgreement3: formData.economicAgreement3,
      concept3: formData.concept3,
      activationDate: formData.activationDate, // Se envía como string al servicio, que lo convertirá a Timestamp
      endDate: formData.endDate,             // Se envía como string al servicio, que lo convertirá a Timestamp
      observationsAndCommitment: formData.observationsAndCommitment,
    };

    // 2. Validación de campos obligatorios
    const requiredFields: Array<keyof typeof processedData> = [
      'employeeName', 'employeeLastName', 'workCenter', 'responsibleName', 'responsibleLastName',
      'agreementConcepts', 'activationDate', 'observationsAndCommitment'
    ];

    let isValid = true;
    let missingFieldName = '';

    for (const field of requiredFields) {
      const value = processedData[field];

      if (typeof value === 'string' && value.trim() === '') {
        isValid = false;
        missingFieldName = field;
        break;
      }
      // Validación específica para el campo 'Otro' de Conceptos del Acuerdo
      if (field === 'agreementConcepts' && formData.agreementConcepts === 'Otro' && formData.agreementConceptsOther.trim() === '') {
        isValid = false;
        missingFieldName = 'Conceptos del Acuerdo (especificar)';
        break;
      }
    }
    
    // Validación de acuerdos económicos si se ha rellenado alguno
    if (formData.economicAgreement1.trim() !== '' && formData.concept1.trim() === '') {
        isValid = false;
        missingFieldName = 'Concepto 1 (si hay acuerdo económico)';
    }
    if (formData.economicAgreement2.trim() !== '' && formData.concept2.trim() === '') {
        isValid = false;
        missingFieldName = 'Concepto 2 (si hay acuerdo económico)';
    }
    if (formData.economicAgreement3.trim() !== '' && formData.concept3.trim() === '') {
        isValid = false;
        missingFieldName = 'Concepto 3 (si hay acuerdo económico)';
    }


    if (!isValid) {
      toast({
        title: "Campos Incompletos",
        description: `Por favor, complete todos los campos obligatorios. Falta: ${missingFieldName}.`,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // *** ESTA ES LA LÍNEA CRÍTICA: LLAMADA REAL AL SERVICIO DE FIRESTORE ***
      await saveEmployeeAgreement(processedData);

      toast({
        title: "Éxito",
        description: "Acuerdo con empleado creado correctamente",
      });
      onSave(); // Vuelve a la pantalla anterior o actualiza la lista
    } catch (error) {
      console.error('Error al crear el acuerdo con empleado:', error);
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
          Acuerdo con Empleado
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Información del Acuerdo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nombre y Apellidos Empleado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employeeName" className="text-gray-700 dark:text-gray-300">
                Nombre Empleado *
              </Label>
              <Input
                id="employeeName"
                name="employeeName"
                type="text"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="Ingrese el nombre del empleado"
                required
              />
            </div>
            <div>
              <Label htmlFor="employeeLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos Empleado *
              </Label>
              <Input
                id="employeeLastName"
                name="employeeLastName"
                type="text"
                value={formData.employeeLastName}
                onChange={handleChange}
                placeholder="Ingrese los apellidos del empleado"
                required
              />
            </div>
          </div>

          {/* Centro de Trabajo y Ubicación (Población, Provincia, Comunidad Autónoma) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="workCenter" className="text-gray-700 dark:text-gray-300">
                Centro de Trabajo *
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.workCenter}
                  onValueChange={(value) => handleSelectChange('workCenter', value)}
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
            {/* Ubicación (Población, Provincia, Comunidad Autónoma) como una sub-grid dentro de la segunda columna */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
                  Población
                </Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Población"
                />
              </div>
              <div>
                <Label htmlFor="province" className="text-gray-700 dark:text-gray-300">
                  Provincia
                </Label>
                <Input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Provincia"
                />
              </div>
              <div>
                <Label htmlFor="autonomousCommunity" className="text-gray-700 dark:text-gray-300">
                  Comunidad Autónoma
                </Label>
                <Input
                  type="text"
                  id="autonomousCommunity"
                  name="autonomousCommunity"
                  value={formData.autonomousCommunity}
                  onChange={handleChange}
                  placeholder="Comunidad Autónoma"
                />
              </div>
            </div>
          </div>


          {/* Nombre y Apellidos Responsable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="responsibleName" className="text-gray-700 dark:text-gray-300">
                Nombre Responsable *
              </Label>
              <Input
                type="text"
                id="responsibleName"
                name="responsibleName"
                value={formData.responsibleName}
                onChange={handleChange}
                placeholder="Nombre del responsable"
                required
              />
            </div>
            <div>
              <Label htmlFor="responsibleLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos Responsable *
              </Label>
              <Input
                type="text"
                id="responsibleLastName"
                name="responsibleLastName"
                value={formData.responsibleLastName}
                onChange={handleChange}
                placeholder="Apellidos del responsable"
                required
              />
            </div>
          </div>

          {/* Conceptos del Acuerdo */}
          <div>
            <Label htmlFor="agreementConcepts" className="text-gray-700 dark:text-gray-300">
              Conceptos del Acuerdo *
            </Label>
            <Select
              value={formData.agreementConcepts}
              onValueChange={(value) => handleSelectChange('agreementConcepts', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {agreementConceptsOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.agreementConcepts === 'Otro' && (
              <Input
                type="text"
                id="agreementConceptsOther"
                name="agreementConceptsOther"
                value={formData.agreementConceptsOther}
                onChange={handleChange}
                placeholder="Especifique el concepto del acuerdo"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Acuerdos Económicos y Conceptos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="economicAgreement1" className="text-gray-700 dark:text-gray-300">
                Acuerdo Económico 1
              </Label>
              <Input
                type="text" // Usamos text para permitir formatos de moneda o decimales
                id="economicAgreement1"
                name="economicAgreement1"
                value={formData.economicAgreement1}
                onChange={handleChange}
                placeholder="Ej. 1500.00"
              />
            </div>
            <div>
              <Label htmlFor="concept1" className="text-gray-700 dark:text-gray-300">
                Concepto 1
              </Label>
              <Input
                type="text"
                id="concept1"
                name="concept1"
                value={formData.concept1}
                onChange={handleChange}
                placeholder="Ej. Complemento de Idioma"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="economicAgreement2" className="text-gray-700 dark:text-gray-300">
                Acuerdo Económico 2
              </Label>
              <Input
                type="text"
                id="economicAgreement2"
                name="economicAgreement2"
                value={formData.economicAgreement2}
                onChange={handleChange}
                placeholder="Ej. 500.00"
              />
            </div>
            <div>
              <Label htmlFor="concept2" className="text-gray-700 dark:text-gray-300">
                Concepto 2
              </Label>
              <Input
                type="text"
                id="concept2"
                name="concept2"
                value={formData.concept2}
                onChange={handleChange}
                placeholder="Ej. Incentivo por Proyecto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="economicAgreement3" className="text-gray-700 dark:text-gray-300">
                Acuerdo Económico 3
              </Label>
              <Input
                type="text"
                id="economicAgreement3"
                name="economicAgreement3"
                value={formData.economicAgreement3}
                onChange={handleChange}
                placeholder="Ej. 200.00"
              />
            </div>
            <div>
              <Label htmlFor="concept3" className="text-gray-700 dark:text-gray-300">
                Concepto 3
              </Label>
              <Input
                type="text"
                id="concept3"
                name="concept3"
                value={formData.concept3}
                onChange={handleChange}
                placeholder="Ej. Ayuda de Transporte"
              />
            </div>
          </div>

          {/* Fechas de Activación y Fin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="activationDate" className="text-gray-700 dark:text-gray-300">
                Fecha de Activación *
              </Label>
              <Input
                type="date"
                id="activationDate"
                name="activationDate"
                value={formData.activationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-gray-700 dark:text-gray-300">
                Fecha Fin
              </Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Observaciones y Compromiso */}
          <div>
            <Label htmlFor="observationsAndCommitment" className="text-gray-700 dark:text-gray-300">
              Observaciones y Compromiso *
            </Label>
            <Textarea
              id="observationsAndCommitment"
              name="observationsAndCommitment"
              value={formData.observationsAndCommitment}
              onChange={handleChange}
              placeholder="Ingrese las observaciones y cualquier compromiso del acuerdo"
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

      {/* Se mantiene el modal de Contratos, aunque no se usa directamente en este formulario con los nuevos campos */}
      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={closeContractModal}
        onSuccess={handleContractSuccess}
      />
    </div>
  );
};

export default EmployeeAgreementCreateForm;