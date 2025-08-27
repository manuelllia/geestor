import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Edit3, Trash2, Clock, Wrench, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import MissingMaintenanceModal from './MissingMaintenanceModal';
import { useMaintenanceSuggestions } from '../../hooks/useMaintenanceSuggestions';
import { toast } from 'react-hot-toast';

interface MaintenanceTask {
  id: string;
  tipoMantenimiento: string;
  frecuencia: string;
  tiempo: string;
}

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
  maintenanceTasks?: MaintenanceTask[];
}

interface EditableDenominationsFormProps {
  denominaciones: DenominacionHomogeneaData[];
  frecuenciaOptions: string[];
  tipoOptions: string[];
  onUpdate: (denominaciones: DenominacionHomogeneaData[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  language: Language;
}

const EditableDenominationsForm: React.FC<EditableDenominationsFormProps> = ({
  denominaciones,
  frecuenciaOptions,
  tipoOptions,
  onUpdate,
  onGenerate,
  isGenerating,
  language
}) => {
  const { t } = useTranslation(language);
  const [selectedDenominacion, setSelectedDenominacion] = useState<DenominacionHomogeneaData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [newMaintenanceForm, setNewMaintenanceForm] = useState({
    tipoMantenimiento: '',
    frecuencia: '',
    tiempo: '2'
  });

  // Hook para sugerencias de mantenimiento
  const {
    getSuggestions,
    applySuggestions,
    clearSuggestions,
    suggestions,
    isLoading: isLoadingSuggestions,
    error: suggestionsError
  } = useMaintenanceSuggestions();

  // Identificar denominaciones sin mantenimientos completos
  const incompleteDenominaciones = denominaciones.filter(d => {
    const hasTasks = d.maintenanceTasks && d.maintenanceTasks.length > 0;
    const hasBasicMaintenance = d.frecuencia && d.frecuencia !== 'No especificada' && 
                               d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado';
    return !hasTasks && !hasBasicMaintenance;
  });

  const handleEditDenominacion = (denominacion: DenominacionHomogeneaData) => {
    setSelectedDenominacion({
      ...denominacion,
      maintenanceTasks: denominacion.maintenanceTasks || []
    });
    setIsEditModalOpen(true);
  };

  const handleSuggestMaintenances = async () => {
    console.log('🤖 Iniciando proceso de sugerencias de mantenimiento...');
    
    try {
      await getSuggestions(denominaciones, tipoOptions);
      setShowSuggestionsModal(true);
      toast.success('¡Sugerencias de mantenimiento obtenidas exitosamente!');
    } catch (error) {
      console.error('❌ Error obteniendo sugerencias:', error);
      toast.error('Error al obtener sugerencias de mantenimiento');
    }
  };

  const handleApplySuggestions = (selectedSuggestions: any[]) => {
    console.log('✅ Aplicando sugerencias seleccionadas...');
    
    const updatedDenominaciones = applySuggestions(denominaciones, selectedSuggestions);
    onUpdate(updatedDenominaciones);
    setShowSuggestionsModal(false);
    clearSuggestions();
    
    toast.success(`¡${selectedSuggestions.length} sugerencias aplicadas exitosamente!`);
  };

  const handleAddMaintenanceTask = () => {
    if (!selectedDenominacion || !newMaintenanceForm.tipoMantenimiento || !newMaintenanceForm.frecuencia) return;

    const newTask: MaintenanceTask = {
      id: `task-${Date.now()}`,
      tipoMantenimiento: newMaintenanceForm.tipoMantenimiento,
      frecuencia: newMaintenanceForm.frecuencia,
      tiempo: newMaintenanceForm.tiempo
    };

    setSelectedDenominacion(prev => ({
      ...prev!,
      maintenanceTasks: [...(prev!.maintenanceTasks || []), newTask]
    }));

    setNewMaintenanceForm({
      tipoMantenimiento: '',
      frecuencia: '',
      tiempo: '2'
    });
  };

  const handleRemoveMaintenanceTask = (taskId: string) => {
    if (!selectedDenominacion) return;

    setSelectedDenominacion(prev => ({
      ...prev!,
      maintenanceTasks: prev!.maintenanceTasks?.filter(task => task.id !== taskId) || []
    }));
  };

  const handleSaveDenominacion = () => {
    if (!selectedDenominacion) return;

    const updatedDenominaciones = denominaciones.map(d => 
      d.codigo === selectedDenominacion.codigo ? selectedDenominacion : d
    );

    onUpdate(updatedDenominaciones);
    setIsEditModalOpen(false);
    setSelectedDenominacion(null);
  };

  const handleGenerateCalendar = () => {
    if (incompleteDenominaciones.length > 0) {
      setShowMissingModal(true);
    } else {
      onGenerate();
    }
  };

  const handleGenerateAnyway = () => {
    setShowMissingModal(false);
    onGenerate();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('equipmentTypes')} ({denominaciones.length})</span>
            <div className="flex items-center gap-2">
              {incompleteDenominaciones.length > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {incompleteDenominaciones.length} {t('missingMaintenanceTitle').toLowerCase()}
                </Badge>
              )}
              <Button 
                onClick={handleSuggestMaintenances}
                disabled={isLoadingSuggestions || isGenerating}
                variant="outline"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isLoadingSuggestions ? 'Analizando...' : 'Sugerir Mantenimientos'}
              </Button>
              <Button 
                onClick={handleGenerateCalendar}
                disabled={isGenerating || isLoadingSuggestions}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isGenerating ? t('loading') : t('generateCalendar')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {denominaciones.map((denominacion) => {
              const hasMaintenanceTasks = denominacion.maintenanceTasks && denominacion.maintenanceTasks.length > 0;
              const hasBasicMaintenance = denominacion.frecuencia && denominacion.frecuencia !== 'No especificada';
              const isComplete = hasMaintenanceTasks || hasBasicMaintenance;

              return (
                <div
                  key={denominacion.codigo}
                  className={`p-4 rounded-lg border transition-colors ${
                    isComplete 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {denominacion.denominacion}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('equipmentCount')}: {denominacion.cantidad} • Código: {denominacion.codigo}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleEditDenominacion(denominacion)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {t('edit')}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {hasMaintenanceTasks && denominacion.maintenanceTasks?.map(task => (
                      <div key={task.id} className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 rounded p-2">
                        <Wrench className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">{task.tipoMantenimiento}</span>
                        <span className="text-gray-500">•</span>
                        <Clock className="h-3 w-3 text-green-500" />
                        <span>{task.frecuencia}</span>
                        <span className="text-gray-500">•</span>
                        <span>{task.tiempo}h</span>
                      </div>
                    ))}

                    {hasBasicMaintenance && !hasMaintenanceTasks && (
                      <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 rounded p-2">
                        <Wrench className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">{denominacion.tipoMantenimiento}</span>
                        <span className="text-gray-500">•</span>
                        <Clock className="h-3 w-3 text-green-500" />
                        <span>{denominacion.frecuencia}</span>
                        <span className="text-gray-500">•</span>
                        <span>{denominacion.tiempo || '2'}h</span>
                      </div>
                    )}

                    {!isComplete && (
                      <div className="text-sm text-amber-600 dark:text-amber-400 italic">
                        {t('missingMaintenanceTitle').toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              {t('edit')} - {selectedDenominacion?.denominacion}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDenominacion && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('equipmentCount')}: {selectedDenominacion.cantidad} • Código: {selectedDenominacion.codigo}
                </p>
              </div>

              {/* Lista de mantenimientos existentes */}
              {selectedDenominacion.maintenanceTasks && selectedDenominacion.maintenanceTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">{t('maintenanceType')}s configurados:</h4>
                  {selectedDenominacion.maintenanceTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Wrench className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{task.tipoMantenimiento}</span>
                        <span className="text-gray-500">•</span>
                        <Clock className="h-4 w-4 text-green-500" />
                        <span>{task.frecuencia}</span>
                        <span className="text-gray-500">•</span>
                        <span>{task.tiempo}h</span>
                      </div>
                      <Button
                        onClick={() => handleRemoveMaintenanceTask(task.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para agregar nuevo mantenimiento */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('addMaintenance')}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('maintenanceType')} *
                    </label>
                    <Select 
                      value={newMaintenanceForm.tipoMantenimiento} 
                      onValueChange={(value) => setNewMaintenanceForm(prev => ({ ...prev, tipoMantenimiento: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoOptions.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('frequency')} *
                    </label>
                    <Select 
                      value={newMaintenanceForm.frecuencia} 
                      onValueChange={(value) => setNewMaintenanceForm(prev => ({ ...prev, frecuencia: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {frecuenciaOptions.map(freq => (
                          <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('estimatedTime')} (h)
                    </label>
                    <Input
                      type="number"
                      value={newMaintenanceForm.tiempo}
                      onChange={(e) => setNewMaintenanceForm(prev => ({ ...prev, tiempo: e.target.value }))}
                      min="0.5"
                      max="8"
                      step="0.5"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddMaintenanceTask}
                  disabled={!newMaintenanceForm.tipoMantenimiento || !newMaintenanceForm.frecuencia}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addMaintenance')}
                </Button>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSaveDenominacion} className="flex-1">
                  {t('save')}
                </Button>
                <Button onClick={() => setIsEditModalOpen(false)} variant="outline">
                  {t('cancel')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de sugerencias de mantenimiento */}
      <Dialog open={showSuggestionsModal} onOpenChange={setShowSuggestionsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Sugerencias de Mantenimiento IA
            </DialogTitle>
          </DialogHeader>
          
          {suggestionsError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">
                Error: {suggestionsError}
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <SuggestionsReviewModal
              suggestions={suggestions}
              denominaciones={denominaciones}
              onApply={handleApplySuggestions}
              onClose={() => {
                setShowSuggestionsModal(false);
                clearSuggestions();
              }}
              language={language}
            />
          )}
        </DialogContent>
      </Dialog>

      <MissingMaintenanceModal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        onGenerateAnyway={handleGenerateAnyway}
        missingCount={incompleteDenominaciones.length}
        language={language}
      />
    </>
  );
};

export default EditableDenominationsForm;
