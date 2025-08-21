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
import { createContractRequest, ContractRequestFormData } from '../../services/contractRequestsService';
import { getWorkCenters, getContracts } from '../../services/workCentersService';
import AddButton from '../Common/AddButton';
import CreateWorkCenterModal from '../Modals/CreateWorkCenterModal';
import CreateContractModal from '../Modals/CreateContractModal';
import { useWorkCenterModals } from '../../hooks/useWorkCenterModals';

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
    nombreSolicitante: '',
    puestoSolicitante: '',
    departamento: '',
    fechaSolicitud: new Date().toISOString().split('T')[0],
    tipoContrato: '',
    numeroVacantes: 1,
    descripcion: '',
    workCenter: '',
    contractsManaged: '',
    salarioPropuesto: 0,
    rangoSalarial: '',
    nivelAcademico: '',
    experienciaRequerida: '',
    habilidadesRequeridas: '',
    idiomasRequeridos: '',
    softwareRequerido: '',
    otrosRequisitos: '',
    aprobacionGerente: false,
    aprobacionRH: false,
    fechaAprobacionGerente: new Date().toISOString().split('T')[0],
    fechaAprobacionRH: new Date().toISOString().split('T')[0],
    comentarios: ''
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
      await createContractRequest(formData);
      toast({
        title: "Éxito",
        description: "Solicitud de contratación creada correctamente",
      });
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la solicitud de contratación",
        variant: "destructive",
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
              <Label htmlFor="nombreSolicitante" className="text-gray-700 dark:text-gray-300">
                Nombre del Solicitante *
              </Label>
              <Input
                id="nombreSolicitante"
                type="text"
                value={formData.nombreSolicitante}
                onChange={(e) => setFormData(prev => ({ ...prev, nombreSolicitante: e.target.value }))}
                placeholder="Ingrese el nombre del solicitante"
              />
            </div>

            <div>
              <Label htmlFor="puestoSolicitante" className="text-gray-700 dark:text-gray-300">
                Puesto del Solicitante *
              </Label>
              <Input
                id="puestoSolicitante"
                type="text"
                value={formData.puestoSolicitante}
                onChange={(e) => setFormData(prev => ({ ...prev, puestoSolicitante: e.target.value }))}
                placeholder="Ingrese el puesto del solicitante"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="departamento" className="text-gray-700 dark:text-gray-300">
                Departamento *
              </Label>
              <Input
                id="departamento"
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
                placeholder="Ingrese el departamento"
              />
            </div>

            <div>
              <Label htmlFor="fechaSolicitud" className="text-gray-700 dark:text-gray-300">
                Fecha de Solicitud *
              </Label>
              <Input
                id="fechaSolicitud"
                type="date"
                value={formData.fechaSolicitud}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaSolicitud: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="tipoContrato" className="text-gray-700 dark:text-gray-300">
                Tipo de Contrato *
              </Label>
              <Select value={formData.tipoContrato} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoContrato: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indefinido">Indefinido</SelectItem>
                  <SelectItem value="Temporal">Temporal</SelectItem>
                  <SelectItem value="Por Obra o Servicio">Por Obra o Servicio</SelectItem>
                  <SelectItem value="Prácticas">Prácticas</SelectItem>
                  <SelectItem value="Formación">Formación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numeroVacantes" className="text-gray-700 dark:text-gray-300">
                Número de Vacantes *
              </Label>
              <Input
                id="numeroVacantes"
                type="number"
                value={formData.numeroVacantes}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroVacantes: parseInt(e.target.value) }))}
                placeholder="Ingrese el número de vacantes"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion" className="text-gray-700 dark:text-gray-300">
              Descripción del Puesto *
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Ingrese la descripción del puesto"
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
              <Label htmlFor="contractsManaged" className="text-gray-700 dark:text-gray-300">
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
              <Label htmlFor="salarioPropuesto" className="text-gray-700 dark:text-gray-300">
                Salario Propuesto *
              </Label>
              <Input
                id="salarioPropuesto"
                type="number"
                value={formData.salarioPropuesto}
                onChange={(e) => setFormData(prev => ({ ...prev, salarioPropuesto: parseFloat(e.target.value) }))}
                placeholder="Ingrese el salario propuesto"
              />
            </div>

            <div>
              <Label htmlFor="rangoSalarial" className="text-gray-700 dark:text-gray-300">
                Rango Salarial
              </Label>
              <Input
                id="rangoSalarial"
                type="text"
                value={formData.rangoSalarial}
                onChange={(e) => setFormData(prev => ({ ...prev, rangoSalarial: e.target.value }))}
                placeholder="Ingrese el rango salarial"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nivelAcademico" className="text-gray-700 dark:text-gray-300">
                Nivel Académico
              </Label>
              <Input
                id="nivelAcademico"
                type="text"
                value={formData.nivelAcademico}
                onChange={(e) => setFormData(prev => ({ ...prev, nivelAcademico: e.target.value }))}
                placeholder="Ingrese el nivel académico"
              />
            </div>

            <div>
              <Label htmlFor="experienciaRequerida" className="text-gray-700 dark:text-gray-300">
                Experiencia Requerida
              </Label>
              <Input
                id="experienciaRequerida"
                type="text"
                value={formData.experienciaRequerida}
                onChange={(e) => setFormData(prev => ({ ...prev, experienciaRequerida: e.target.value }))}
                placeholder="Ingrese la experiencia requerida"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="habilidadesRequeridas" className="text-gray-700 dark:text-gray-300">
              Habilidades Requeridas
            </Label>
            <Input
              id="habilidadesRequeridas"
              type="text"
              value={formData.habilidadesRequeridas}
              onChange={(e) => setFormData(prev => ({ ...prev, habilidadesRequeridas: e.target.value }))}
              placeholder="Ingrese las habilidades requeridas"
            />
          </div>

          <div>
            <Label htmlFor="idiomasRequeridos" className="text-gray-700 dark:text-gray-300">
              Idiomas Requeridos
            </Label>
            <Input
              id="idiomasRequeridos"
              type="text"
              value={formData.idiomasRequeridos}
              onChange={(e) => setFormData(prev => ({ ...prev, idiomasRequeridos: e.target.value }))}
              placeholder="Ingrese los idiomas requeridos"
            />
          </div>

          <div>
            <Label htmlFor="softwareRequerido" className="text-gray-700 dark:text-gray-300">
              Software Requerido
            </Label>
            <Input
              id="softwareRequerido"
              type="text"
              value={formData.softwareRequerido}
              onChange={(e) => setFormData(prev => ({ ...prev, softwareRequerido: e.target.value }))}
              placeholder="Ingrese el software requerido"
            />
          </div>

          <div>
            <Label htmlFor="otrosRequisitos" className="text-gray-700 dark:text-gray-300">
              Otros Requisitos
            </Label>
            <Textarea
              id="otrosRequisitos"
              value={formData.otrosRequisitos}
              onChange={(e) => setFormData(prev => ({ ...prev, otrosRequisitos: e.target.value }))}
              placeholder="Ingrese otros requisitos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="aprobacionGerente" className="text-gray-700 dark:text-gray-300">
                Aprobación del Gerente
              </Label>
              <Select value={formData.aprobacionGerente.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, aprobacionGerente: value === 'true' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aprobado</SelectItem>
                  <SelectItem value="false">No Aprobado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fechaAprobacionGerente" className="text-gray-700 dark:text-gray-300">
                Fecha de Aprobación del Gerente
              </Label>
              <Input
                id="fechaAprobacionGerente"
                type="date"
                value={formData.fechaAprobacionGerente}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaAprobacionGerente: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="aprobacionRH" className="text-gray-700 dark:text-gray-300">
                Aprobación de Recursos Humanos
              </Label>
              <Select value={formData.aprobacionRH.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, aprobacionRH: value === 'true' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aprobado</SelectItem>
                  <SelectItem value="false">No Aprobado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fechaAprobacionRH" className="text-gray-700 dark:text-gray-300">
                Fecha de Aprobación de Recursos Humanos
              </Label>
              <Input
                id="fechaAprobacionRH"
                type="date"
                value={formData.fechaAprobacionRH}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaAprobacionRH: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comentarios" className="text-gray-700 dark:text-gray-300">
              Comentarios Adicionales
            </Label>
            <Textarea
              id="comentarios"
              value={formData.comentarios}
              onChange={(e) => setFormData(prev => ({ ...prev, comentarios: e.target.value }))}
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
                Creando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Crear Solicitud
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
