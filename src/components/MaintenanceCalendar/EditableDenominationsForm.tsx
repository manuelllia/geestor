import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Wand2, Eye } from 'lucide-react';
import { DenominacionHomogeneaData } from '../../hooks/useEnhancedMaintenanceCalendar';
import { useMaintenanceSuggestions } from '../../hooks/useMaintenanceSuggestions';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import SuggestionsReviewModal from './SuggestionsReviewModal';

export interface EditableDenominationsFormProps {
  denominaciones: DenominacionHomogeneaData[];
  frecuenciaOptions: string[];
  tipoOptions: string[];
  onUpdate: (updated: DenominacionHomogeneaData[]) => void;
  onGenerate: () => Promise<void>;
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    suggestions,
    getSuggestions,
    applySuggestions,
    clearSuggestions
  } = useMaintenanceSuggestions();

  const handleGetSuggestions = useCallback(async () => {
    const incompleteDenominaciones = denominaciones.filter(den => 
      !den.tipoMantenimiento || den.tipoMantenimiento === ''
    );
    
    if (incompleteDenominaciones.length === 0) {
      console.log('No hay denominaciones incompletas');
      return;
    }

    const tiposMantenimientoInteres = tipoOptions.filter(tipo => tipo && tipo.trim() !== '');
    
    try {
      await getSuggestions(incompleteDenominaciones, tiposMantenimientoInteres);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  }, [denominaciones, tipoOptions, getSuggestions]);

  const handleApplySuggestions = useCallback((suggestionsToApply: any[]) => {
    const updatedDenominaciones = applySuggestions(denominaciones, suggestionsToApply);
    onUpdate(updatedDenominaciones);
    setShowSuggestions(false);
    clearSuggestions();
  }, [denominaciones, applySuggestions, onUpdate, clearSuggestions]);

  const addNewDenominacion = useCallback(() => {
    const newDenominacion: DenominacionHomogeneaData = {
      codigo: '',
      denominacion: '',
      cantidad: 1,
      frecuencia: '',
      tipoMantenimiento: ''
    };
    onUpdate([...denominaciones, newDenominacion]);
  }, [denominaciones, onUpdate]);

  const removeDenominacion = useCallback((index: number) => {
    const updated = denominaciones.filter((_, i) => i !== index);
    onUpdate(updated);
  }, [denominaciones, onUpdate]);

  const updateDenominacion = useCallback((index: number, field: keyof DenominacionHomogeneaData, value: string | number) => {
    const updated = denominaciones.map((den, i) => 
      i === index ? { ...den, [field]: value } : den
    );
    onUpdate(updated);
  }, [denominaciones, onUpdate]);

  const incompleteDenominaciones = useMemo(() => 
    denominaciones.filter(den => !den.tipoMantenimiento || den.tipoMantenimiento === ''),
    [denominaciones]
  );

  const completeDenominaciones = useMemo(() => 
    denominaciones.filter(den => den.tipoMantenimiento && den.tipoMantenimiento !== ''),
    [denominaciones]
  );

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Denominaciones Homogéneas</span>
            <div className="flex gap-2">
              {incompleteDenominaciones.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetSuggestions}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Obtener Sugerencias IA ({incompleteDenominaciones.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={addNewDenominacion}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {denominaciones.map((denominacion, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label>Denominación</Label>
                  <Input
                    value={denominacion.denominacion}
                    onChange={(e) => updateDenominacion(index, 'denominacion', e.target.value)}
                    placeholder="Nombre de la denominación"
                  />
                </div>
                
                <div className="col-span-3">
                  <Label>Tipo de Mantenimiento</Label>
                  <Select
                    value={denominacion.tipoMantenimiento}
                    onValueChange={(value) => updateDenominacion(index, 'tipoMantenimiento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoOptions.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3">
                  <Label>Frecuencia</Label>
                  <Select
                    value={denominacion.frecuencia}
                    onValueChange={(value) => updateDenominacion(index, 'frecuencia', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {frecuenciaOptions.map((frecuencia) => (
                        <SelectItem key={frecuencia} value={frecuencia}>
                          {frecuencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDenominacion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {denominaciones.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No hay denominaciones configuradas. Haz clic en "Agregar" para comenzar.
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total: {denominaciones.length} | Completas: {completeDenominaciones.length} | Incompletas: {incompleteDenominaciones.length}
            </div>
            
            <Button
              onClick={onGenerate}
              disabled={isGenerating || denominaciones.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? 'Generando...' : 'Generar Calendario'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSuggestions && (
        <SuggestionsReviewModal
          suggestions={suggestions}
          denominaciones={denominaciones}
          onApply={handleApplySuggestions}
          onClose={() => setShowSuggestions(false)}
          language={language}
        />
      )}
    </>
  );
};

export default EditableDenominationsForm;
