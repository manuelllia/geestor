
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { useWorkCenters } from '../../hooks/useWorkCenters';
import { saveContractRequest, updateContractRequest, ContractRequestData } from '../../services/contractRequestsService';

interface ContractRequestCreateFormProps {
  language: Language;
  editingRequest?: ContractRequestData | null;
  onBack: () => void;
  onSave: () => void;
}

const ContractRequestCreateForm: React.FC<ContractRequestCreateFormProps> = ({
  language,
  editingRequest,
  onBack,
  onSave
}) => {
  const { t } = useTranslation(language);
  const { workCenters, isLoading: workCentersLoading } = useWorkCenters();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ContractRequestData>>({
    applicantName: '',
    applicantLastName: '',
    contractType: '',
    salary: '',
    observations: '',
    incorporationDate: undefined,
    company: '',
    position: '',
    professionalCategory: '',
    city: '',
    province: '',
    autonomousCommunity: '',
    workCenter: '',
    directResponsible: '',
    directSupervisorLastName: '',
    companyFloor: '',
    language: '',
    languageLevel: '',
    language2: '',
    languageLevel2: '',
    electromedicalExperience: '',
    installationExperience: '',
    hiringReason: '',
    commitmentsObservations: '',
    status: 'Pendiente',
    requestDate: new Date()
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingRequest) {
      setFormData(editingRequest);
    }
  }, [editingRequest]);

  const handleInputChange = (field: keyof ContractRequestData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de campos obligatorios
    if (!formData.applicantName || !formData.applicantLastName || !formData.contractType || 
        !formData.incorporationDate || !formData.company || !formData.position || 
        !formData.professionalCategory || !formData.workCenter || !formData.companyFloor) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      if (editingRequest && editingRequest.id) {
        await updateContractRequest(editingRequest.id, formData);
        console.log('Solicitud actualizada correctamente');
      } else {
        await saveContractRequest(formData as ContractRequestData);
        console.log('Nueva solicitud creada correctamente');
      }
      
      onSave();
      onBack();
    } catch (error) {
      console.error('Error saving contract request:', error);
      alert(editingRequest ? 'Error al actualizar la solicitud' : 'Error al guardar la solicitud');
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
              {t('contractRequestTitle')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Candidato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicantName">{t('selectedCandidateName')} *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName || ''}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  placeholder={t('selectedCandidateName')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="applicantLastName">{t('selectedCandidateLastName')} *</Label>
                <Input
                  id="applicantLastName"
                  value={formData.applicantLastName || ''}
                  onChange={(e) => handleInputChange('applicantLastName', e.target.value)}
                  placeholder={t('selectedCandidateLastName')}
                  required
                />
              </div>
            </div>

            {/* Tipo de Contrato y Salario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contractType">{t('contractType')} *</Label>
                <Input
                  id="contractType"
                  value={formData.contractType || ''}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  placeholder={t('contractType')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">{t('salary')}</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || ''}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder={t('salary')}
                />
              </div>
            </div>

            {/* Observaciones y Fecha de Incorporación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="observations">{t('observations')}</Label>
                <Textarea
                  id="observations"
                  value={formData.observations || ''}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder={t('observations')}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incorporationDate">{t('incorporationDate')} *</Label>
                <Input
                  id="incorporationDate"
                  type="date"
                  value={formData.incorporationDate ? formData.incorporationDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('incorporationDate', new Date(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">{t('company')} *</Label>
              <Select 
                value={formData.company || ''} 
                onValueChange={(value) => handleInputChange('company', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IBERMAN SA">IBERMAN SA</SelectItem>
                  <SelectItem value="ASIME SA">ASIME SA</SelectItem>
                  <SelectItem value="MANTELEC SA">MANTELEC SA</SelectItem>
                  <SelectItem value="INSANEX SL">INSANEX SL</SelectItem>
                  <SelectItem value="SSM">SSM</SelectItem>
                  <SelectItem value="RD HEALING">RD HEALING</SelectItem>
                  <SelectItem value="AINATEC">AINATEC</SelectItem>
                  <SelectItem value="INDEL FACILITIES">INDEL FACILITIES</SelectItem>
                  <SelectItem value="OTRA">OTRA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Puesto de Trabajo y Categoría Profesional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position">{t('position')} *</Label>
                <Select 
                  value={formData.position || ''} 
                  onValueChange={(value) => handleInputChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar puesto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TÉCNICO/A DE ELECTROMEDICINA">TÉCNICO/A DE ELECTROMEDICINA</SelectItem>
                    <SelectItem value="RC">RC</SelectItem>
                    <SelectItem value="INGENIERO/A ELECTRÓNICO">INGENIERO/A ELECTRÓNICO</SelectItem>
                    <SelectItem value="INGENIERO/A MECÁNICO">INGENIERO/A MECÁNICO</SelectItem>
                    <SelectItem value="INGENIERO/A DESARROLLO HW Y SW">INGENIERO/A DESARROLLO HW Y SW</SelectItem>
                    <SelectItem value="ELECTRICISTA">ELECTRICISTA</SelectItem>
                    <SelectItem value="FRIGORISTA">FRIGORISTA</SelectItem>
                    <SelectItem value="TÉCNICO/A DE INSTALACIONES">TÉCNICO/A DE INSTALACIONES</SelectItem>
                    <SelectItem value="ALBAÑIL">ALBAÑIL</SelectItem>
                    <SelectItem value="OTRO">OTRO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="professionalCategory">{t('professionalCategory')} *</Label>
                <Select 
                  value={formData.professionalCategory || ''} 
                  onValueChange={(value) => handleInputChange('professionalCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TÉCNICO/A">TÉCNICO/A</SelectItem>
                    <SelectItem value="INGENIERO/A">INGENIERO/A</SelectItem>
                    <SelectItem value="OFICIAL 1º">OFICIAL 1º</SelectItem>
                    <SelectItem value="OFICIAL 2º">OFICIAL 2º</SelectItem>
                    <SelectItem value="OFICIAL 3º">OFICIAL 3º</SelectItem>
                    <SelectItem value="OTRA">OTRA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')}</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t('city')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">{t('province')}</Label>
                <Input
                  id="province"
                  value={formData.province || ''}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  placeholder={t('province')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autonomousCommunity">{t('autonomousCommunity')}</Label>
                <Input
                  id="autonomousCommunity"
                  value={formData.autonomousCommunity || ''}
                  onChange={(e) => handleInputChange('autonomousCommunity', e.target.value)}
                  placeholder={t('autonomousCommunity')}
                />
              </div>
            </div>

            {/* Centro de Trabajo */}
            <div className="space-y-2">
              <Label htmlFor="workCenter">{t('workCenter')} *</Label>
              <Select 
                value={formData.workCenter || ''} 
                onValueChange={(value) => handleInputChange('workCenter', value)}
                disabled={workCentersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={workCentersLoading ? "Cargando..." : "Seleccionar centro de trabajo"} />
                </SelectTrigger>
                <SelectContent>
                  {workCenters.map((center) => (
                    <SelectItem key={center.id} value={center.displayText}>
                      {center.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Responsable Directo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="directResponsible">{t('directSupervisorName')}</Label>
                <Input
                  id="directResponsible"
                  value={formData.directResponsible || ''}
                  onChange={(e) => handleInputChange('directResponsible', e.target.value)}
                  placeholder={t('directSupervisorName')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="directSupervisorLastName">{t('directSupervisorLastName')}</Label>
                <Input
                  id="directSupervisorLastName"
                  value={formData.directSupervisorLastName || ''}
                  onChange={(e) => handleInputChange('directSupervisorLastName', e.target.value)}
                  placeholder={t('directSupervisorLastName')}
                />
              </div>
            </div>

            {/* Piso de Empresa */}
            <div className="space-y-2">
              <Label>{t('companyFloor')} *</Label>
              <RadioGroup 
                value={formData.companyFloor || ''} 
                onValueChange={(value) => handleInputChange('companyFloor', value)}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Si" id="floor-yes" />
                  <Label htmlFor="floor-yes">{t('yes')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="floor-no" />
                  <Label htmlFor="floor-no">{t('no')}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Título: Otros Datos de Interés */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                {t('otherDataTitle')}
              </h3>

              {/* Idiomas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="language1">{t('language1')}</Label>
                  <Select 
                    value={formData.language || ''} 
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INGLÉS">INGLÉS</SelectItem>
                      <SelectItem value="FRANCÉS">FRANCÉS</SelectItem>
                      <SelectItem value="PORTUGUÉS">PORTUGUÉS</SelectItem>
                      <SelectItem value="OTRO">OTRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level1">{t('level1')}</Label>
                  <Select 
                    value={formData.languageLevel || ''} 
                    onValueChange={(value) => handleInputChange('languageLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1-A2 (BÁSICO)">A1-A2 (BÁSICO)</SelectItem>
                      <SelectItem value="B1(INTERMEDIO-BAJO)">B1(INTERMEDIO-BAJO)</SelectItem>
                      <SelectItem value="B1-B2">B1-B2</SelectItem>
                      <SelectItem value="B2(FIRST CERTIFICATE)">B2(FIRST CERTIFICATE)</SelectItem>
                      <SelectItem value="B2-C1">B2-C1</SelectItem>
                      <SelectItem value="C1(ADVANCED)">C1(ADVANCED)</SelectItem>
                      <SelectItem value="C2(BILINGÜE)">C2(BILINGÜE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Segundo Idioma */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="language2">{t('language2')}</Label>
                  <Select 
                    value={formData.language2 || ''} 
                    onValueChange={(value) => handleInputChange('language2', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar segundo idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRANCÉS">FRANCÉS</SelectItem>
                      <SelectItem value="PORTUGUÉS">PORTUGUÉS</SelectItem>
                      <SelectItem value="OTRO">OTRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level2">{t('level2')}</Label>
                  <Select 
                    value={formData.languageLevel2 || ''} 
                    onValueChange={(value) => handleInputChange('languageLevel2', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1-A2 (BÁSICO)">A1-A2 (BÁSICO)</SelectItem>
                      <SelectItem value="B1(INTERMEDIO-BAJO)">B1(INTERMEDIO-BAJO)</SelectItem>
                      <SelectItem value="B1-B2">B1-B2</SelectItem>
                      <SelectItem value="B2(FIRST CERTIFICATE)">B2(FIRST CERTIFICATE)</SelectItem>
                      <SelectItem value="B2-C1">B2-C1</SelectItem>
                      <SelectItem value="C1(ADVANCED)">C1(ADVANCED)</SelectItem>
                      <SelectItem value="C2(BILINGÜE)">C2(BILINGÜE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Experiencia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="electromedicalExperience">{t('electromedicalExperience')}</Label>
                  <Textarea
                    id="electromedicalExperience"
                    value={formData.electromedicalExperience || ''}
                    onChange={(e) => handleInputChange('electromedicalExperience', e.target.value)}
                    placeholder={t('electromedicalExperience')}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installationExperience">{t('installationExperience')}</Label>
                  <Textarea
                    id="installationExperience"
                    value={formData.installationExperience || ''}
                    onChange={(e) => handleInputChange('installationExperience', e.target.value)}
                    placeholder={t('installationExperience')}
                    rows={3}
                  />
                </div>
              </div>

              {/* Motivo y Observaciones */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hiringReason">{t('hiringReason')}</Label>
                  <Textarea
                    id="hiringReason"
                    value={formData.hiringReason || ''}
                    onChange={(e) => handleInputChange('hiringReason', e.target.value)}
                    placeholder={t('hiringReason')}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commitmentsObservations">{t('commitmentsObservations')}</Label>
                  <Textarea
                    id="commitmentsObservations"
                    value={formData.commitmentsObservations || ''}
                    onChange={(e) => handleInputChange('commitmentsObservations', e.target.value)}
                    placeholder={t('commitmentsObservations')}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{editingRequest ? 'Actualizando...' : 'Guardando...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{editingRequest ? 'Actualizar Solicitud' : 'Guardar Solicitud'}</span>
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
