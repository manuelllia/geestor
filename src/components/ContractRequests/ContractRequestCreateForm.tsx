import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Importado para Piso de Empresa
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getWorkCenters, getContracts } from '../../services/workCentersService';
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

// --- NUEVA INTERFAZ ContractRequestFormData ---
interface ContractRequestFormData {
  requesterName: string; // Nombre Solicitante
  requesterLastName: string; // Apellidos Solicitante
  contractType: string; // Tipo de Contrato
  salary: string; // Salario (campo de texto número)
  observations: string; // Observaciones (campo de texto)
  incorporationDate: string; // Fecha de Incorporación
  company: string; // Empresa (valor de selección)
  companyOther: string; // Para la opción 'OTRA' de Empresa
  jobPosition: string; // Puesto de Trabajo (valor de selección)
  jobPositionOther: string; // Para la opción 'OTRO' de Puesto de Trabajo
  professionalCategory: string; // Categoría Profesional (valor de selección)
  professionalCategoryOther: string; // Para la opción 'OTRO' de Categoría Profesional
  city: string; // Población
  province: string; // Provincia
  autonomousCommunity: string; // Comunidad Autónoma
  workCenter: string; // Centro de Trabajo (mantiene funcionalidad)
  companyFlat: 'Si' | 'No' | ''; // Piso de Empresa (radio)
  language1: string; // Idioma 1 (valor de selección)
  language1Other: string; // Para la opción 'OTRO' de Idioma 1
  level1: string; // Nivel 1
  language2: string; // Idioma 2 (valor de selección)
  language2Other: string; // Para la opción 'OTRO' de Idioma 2
  level2: string; // Nivel 2
  experienceElectromedicine: string; // Experiencia Previa en Electromedicina (textarea)
  experienceInstallations: string; // Experiencia Previa en Instalaciones (textarea)
  contractingReason: string; // Motivo de la Contratación (textarea)
  notesAndCommitments: string; // Observaciones y/o compromisos (textarea)
}

interface ContractRequestCreateFormProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
  // Si necesitaras editar, añadirías un prop 'editingRequest?: ContractRequestRecord | null;'
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
  // Los contratos se cargan pero no se usan en los campos de este formulario, pero se mantiene la lógica y el modal
  const [contracts, setContracts] = useState<Array<{id: string, name: string}>>([]);
  
  const {
    isWorkCenterModalOpen,
    isContractModalOpen,
    openWorkCenterModal,
    closeWorkCenterModal,
    openContractModal,
    closeContractModal
  } = useWorkCenterModals();

  // --- Opciones predefinidas para los campos de selección ---
  const companyOptions = ['IBERMAN SA', 'ASIME SA', 'MANTELEC SA', 'INSANEX SL', 'SSM', 'RD HEALING', 'AINATEC INDEL FACILITIES', 'OTRA'];
  const jobPositionOptions = [
    'TÉCNICO/A DE ELECTROMEDICINA', 'RC', 'INGENIERO/A ELECTRONICO', 'INGENIERO/A MECANICO',
    'INGENIERO/A DESARROLLO HW Y SW', 'ELECTRICISTA', 'FRIGORISTA', 'TÉCNICO/A DE INSTALACIONES',
    'ALBAÑIL', 'OTRO'
  ];
  const professionalCategoryOptions = ['TÉCNICO/A', 'INGENIERO/A', 'OFICIAL 1º', 'OFICIAL 2º', 'OFICIAL 3º', 'OTRO'];
  const language1Options = ['INGLÉS', 'FRANCÉS', 'PORTUGÉS', 'OTRO'];
  const language2Options = ['FRANCÉS', 'PORTUGÉS', 'OTRO']; // Nota: inglés no está en el idioma 2
  const levelOptions = [
    'A1-A2 (BÁSICO)', 'B1 (INTERMEDIO-BAJO)', 'B1-B2', 'B2 (FIRST CERTIFICATE)',
    'B2-C1', 'C1 (ADVANCED)', 'C2(BILINGÜE)'
  ];

  // --- NUEVA INICIALIZACIÓN DEL ESTADO formData ---
  const [formData, setFormData] = useState<ContractRequestFormData>({
    requesterName: '',
    requesterLastName: '',
    contractType: '',
    salary: '',
    observations: '',
    incorporationDate: '', // Sin fecha por defecto, o puedes poner new Date().toISOString().split('T')[0]
    company: '',
    companyOther: '',
    jobPosition: '',
    jobPositionOther: '',
    professionalCategory: '',
    professionalCategoryOther: '',
    city: '',
    province: '',
    autonomousCommunity: '',
    workCenter: '',
    companyFlat: '',
    language1: '',
    language1Other: '',
    level1: '',
    language2: '',
    language2Other: '',
    level2: '',
    experienceElectromedicine: '',
    experienceInstallations: '',
    contractingReason: '',
    notesAndCommitments: '',
  });

  // Manejador genérico para inputs de texto, textarea y fecha
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para Select y RadioGroup
  const handleSelectOrRadioChange = (name: keyof ContractRequestFormData, value: string) => {
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
      setContracts(contractsData); // Se mantiene por si es necesario en el futuro o en otros componentes
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
      ...formData,
      company: formData.company === 'OTRA' ? formData.companyOther : formData.company,
      jobPosition: formData.jobPosition === 'OTRO' ? formData.jobPositionOther : formData.jobPosition,
      professionalCategory: formData.professionalCategory === 'OTRO' ? formData.professionalCategoryOther : formData.professionalCategory,
      language1: formData.language1 === 'OTRO' ? formData.language1Other : formData.language1,
      language2: formData.language2 === 'OTRO' ? formData.language2Other : formData.language2,
    };

    // 2. Validación de campos obligatorios
    const requiredFields: Array<keyof typeof processedData | 'companyOther' | 'jobPositionOther' | 'professionalCategoryOther'> = [
      'requesterName', 'requesterLastName', 'contractType', 'incorporationDate',
      'company', 'jobPosition', 'professionalCategory', 'workCenter', 'companyFlat',
      'contractingReason', 'notesAndCommitments' // 'observations' no era obligatorio en la lista pero lo mantengo así.
    ];

    let isValid = true;
    let missingFieldName = '';

    for (const field of requiredFields) {
      const value = processedData[field as keyof typeof processedData]; // Castear para acceso directo

      if (typeof value === 'string' && value.trim() === '') {
        isValid = false;
        missingFieldName = field;
        break;
      }
      // Validaciones específicas para campos 'Other' si la opción 'OTRA'/'OTRO' fue seleccionada
      if (field === 'company' && formData.company === 'OTRA' && formData.companyOther.trim() === '') {
        isValid = false;
        missingFieldName = 'Empresa (especificar)';
        break;
      }
      if (field === 'jobPosition' && formData.jobPosition === 'OTRO' && formData.jobPositionOther.trim() === '') {
        isValid = false;
        missingFieldName = 'Puesto de Trabajo (especificar)';
        break;
      }
      if (field === 'professionalCategory' && formData.professionalCategory === 'OTRO' && formData.professionalCategoryOther.trim() === '') {
        isValid = false;
        missingFieldName = 'Categoría Profesional (especificar)';
        break;
      }
      if (field === 'language1' && formData.language1 === 'OTRO' && formData.language1Other.trim() === '') {
        isValid = false;
        missingFieldName = 'Idioma 1 (especificar)';
        break;
      }
      if (field === 'language2' && formData.language2 === 'OTRO' && formData.language2Other.trim() === '') {
        isValid = false;
        missingFieldName = 'Idioma 2 (especificar)';
        break;
      }
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
      // Simulate creating contract request - replace with actual service call (e.g., Firestore)
      console.log('Creando solicitud de contratación:', processedData);
      // Aquí iría tu llamada a la API o Firestore, por ejemplo:
      // await addDoc(collection(db, 'SolicitudesDeContratacion'), {
      //   ...processedData,
      //   createdAt: serverTimestamp(),
      //   status: 'Pendiente', // Asumiendo un estado inicial
      // });

      toast({
        title: "Éxito",
        description: "Solicitud de contratación creada correctamente",
      });
      onSave(); // Llama a la función onSave para refrescar la lista o redirigir
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
          Solicitud de Contratación
        </h1>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Detalles de la Solicitud
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nombre y Apellidos Solicitante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="requesterName" className="text-gray-700 dark:text-gray-300">
                Nombre Solicitante *
              </Label>
              <Input
                type="text"
                id="requesterName"
                name="requesterName"
                value={formData.requesterName}
                onChange={handleChange}
                placeholder="Nombre del solicitante"
                required
              />
            </div>
            <div>
              <Label htmlFor="requesterLastName" className="text-gray-700 dark:text-gray-300">
                Apellidos Solicitante *
              </Label>
              <Input
                type="text"
                id="requesterLastName"
                name="requesterLastName"
                value={formData.requesterLastName}
                onChange={handleChange}
                placeholder="Apellidos del solicitante"
                required
              />
            </div>
          </div>

          {/* Tipo de Contrato y Salario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contractType" className="text-gray-700 dark:text-gray-300">
                Tipo de Contrato *
              </Label>
              <Input
                type="text"
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                placeholder="Ej. Indefinido, Temporal"
                required
              />
            </div>
            <div>
              <Label htmlFor="salary" className="text-gray-700 dark:text-gray-300">
                Salario
              </Label>
              <Input
                type="number" // Usa type="number" para el teclado numérico en móviles, pero mantén el valor como string en el estado para flexibilidad con decimales o símbolos.
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salario Bruto Anual"
              />
            </div>
          </div>

          {/* Fecha de Incorporación y Observaciones Generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="incorporationDate" className="text-gray-700 dark:text-gray-300">
                Fecha de Incorporación *
              </Label>
              <Input
                type="date"
                id="incorporationDate"
                name="incorporationDate"
                value={formData.incorporationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="observations" className="text-gray-700 dark:text-gray-300">
                Observaciones Generales
              </Label>
              <Textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Observaciones adicionales sobre la solicitud"
              />
            </div>
          </div>

          {/* Empresa */}
          <div>
            <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">
              Empresa *
            </Label>
            <Select
              value={formData.company}
              onValueChange={(value) => handleSelectOrRadioChange('company', value)}
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
            {formData.company === 'OTRA' && (
              <Input
                type="text"
                id="companyOther"
                name="companyOther"
                value={formData.companyOther}
                onChange={handleChange}
                placeholder="Especifique la empresa"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Puesto de Trabajo */}
          <div>
            <Label htmlFor="jobPosition" className="text-gray-700 dark:text-gray-300">
              Puesto de Trabajo *
            </Label>
            <Select
              value={formData.jobPosition}
              onValueChange={(value) => handleSelectOrRadioChange('jobPosition', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="SELECCIONAR" />
              </SelectTrigger>
              <SelectContent>
                {jobPositionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.jobPosition === 'OTRO' && (
              <Input
                type="text"
                id="jobPositionOther"
                name="jobPositionOther"
                value={formData.jobPositionOther}
                onChange={handleChange}
                placeholder="Especifique el puesto de trabajo"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Categoría Profesional */}
          <div>
            <Label htmlFor="professionalCategory" className="text-gray-700 dark:text-gray-300">
              Categoría Profesional *
            </Label>
            <Select
              value={formData.professionalCategory}
              onValueChange={(value) => handleSelectOrRadioChange('professionalCategory', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="SELECCIONAR" />
              </SelectTrigger>
              <SelectContent>
                {professionalCategoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.professionalCategory === 'OTRO' && (
              <Input
                type="text"
                id="professionalCategoryOther"
                name="professionalCategoryOther"
                value={formData.professionalCategoryOther}
                onChange={handleChange}
                placeholder="Especifique la categoría profesional"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Ubicación (Población, Provincia, Comunidad Autónoma) */}
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

          {/* Centro de Trabajo y Piso de Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="workCenter" className="text-gray-700 dark:text-gray-300">
                Centro de Trabajo *
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.workCenter}
                  onValueChange={(value) => handleSelectOrRadioChange('workCenter', value)}
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
              <Label className="text-gray-700 dark:text-gray-300">
                Piso de Empresa *
              </Label>
              <RadioGroup
                value={formData.companyFlat}
                onValueChange={(value: 'Si' | 'No') => handleSelectOrRadioChange('companyFlat', value)}
                className="flex space-x-4 mt-2"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Si" id="companyFlat-si" />
                  <Label htmlFor="companyFlat-si">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="companyFlat-no" />
                  <Label htmlFor="companyFlat-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Idioma 1 y Nivel 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="language1" className="text-gray-700 dark:text-gray-300">
                Idioma 1
              </Label>
              <Select
                value={formData.language1}
                onValueChange={(value) => handleSelectOrRadioChange('language1', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="SELECCIONAR" />
                </SelectTrigger>
                <SelectContent>
                  {language1Options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.language1 === 'OTRO' && (
                <Input
                  type="text"
                  id="language1Other"
                  name="language1Other"
                  value={formData.language1Other}
                  onChange={handleChange}
                  placeholder="Especifique el idioma"
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <Label htmlFor="level1" className="text-gray-700 dark:text-gray-300">
                Nivel 1
              </Label>
              <Select
                value={formData.level1}
                onValueChange={(value) => handleSelectOrRadioChange('level1', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="SELECCIONAR" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Idioma 2 y Nivel 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="language2" className="text-gray-700 dark:text-gray-300">
                Idioma 2
              </Label>
              <Select
                value={formData.language2}
                onValueChange={(value) => handleSelectOrRadioChange('language2', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="SELECCIONAR" />
                </SelectTrigger>
                <SelectContent>
                  {language2Options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.language2 === 'OTRO' && (
                <Input
                  type="text"
                  id="language2Other"
                  name="language2Other"
                  value={formData.language2Other}
                  onChange={handleChange}
                  placeholder="Especifique el idioma"
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <Label htmlFor="level2" className="text-gray-700 dark:text-gray-300">
                Nivel 2
              </Label>
              <Select
                value={formData.level2}
                onValueChange={(value) => handleSelectOrRadioChange('level2', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="SELECCIONAR" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experiencia Previa en Electromedicina */}
          <div>
            <Label htmlFor="experienceElectromedicine" className="text-gray-700 dark:text-gray-300">
              Experiencia Previa en Electromedicina
            </Label>
            <Textarea
              id="experienceElectromedicine"
              name="experienceElectromedicine"
              value={formData.experienceElectromedicine}
              onChange={handleChange}
              placeholder="Describa la experiencia previa en electromedicina"
            />
          </div>

          {/* Experiencia Previa en Instalaciones */}
          <div>
            <Label htmlFor="experienceInstallations" className="text-gray-700 dark:text-gray-300">
              Experiencia Previa en Instalaciones
            </Label>
            <Textarea
              id="experienceInstallations"
              name="experienceInstallations"
              value={formData.experienceInstallations}
              onChange={handleChange}
              placeholder="Describa la experiencia previa en instalaciones"
            />
          </div>

          {/* Motivo de la Contratación */}
          <div>
            <Label htmlFor="contractingReason" className="text-gray-700 dark:text-gray-300">
              Motivo de la Contratación *
            </Label>
            <Textarea
              id="contractingReason"
              name="contractingReason"
              value={formData.contractingReason}
              onChange={handleChange}
              placeholder="Explique el motivo de la necesidad de contratación"
              required
            />
          </div>

          {/* Observaciones y/o compromisos */}
          <div>
            <Label htmlFor="notesAndCommitments" className="text-gray-700 dark:text-gray-300">
              Observaciones y/o Compromisos *
            </Label>
            <Textarea
              id="notesAndCommitments"
              name="notesAndCommitments"
              value={formData.notesAndCommitments}
              onChange={handleChange}
              placeholder="Añada cualquier observación o compromiso adicional"
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

      {/* Se mantiene el modal de Contratos, aunque no se usa directamente en este formulario */}
      <CreateContractModal
        isOpen={isContractModalOpen}
        onClose={closeContractModal}
        onSuccess={handleContractSuccess}
      />
    </div>
  );
};

export default ContractRequestCreateForm;