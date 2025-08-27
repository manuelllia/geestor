
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent } from '../ui/card';
import { CheckCircle, Clock, Wrench, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface MaintenanceSuggestion {
  denominacion: string;
  tipoMantenimiento: string;
  frecuencia: string;
  tiempoEstimado: string;
  descripcion?: string;
}

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
  maintenanceTasks?: Array<{
    id: string;
    tipoMantenimiento: string;
    frecuencia: string;
    tiempo: string;
  }>;
}

interface SuggestionsReviewModalProps {
  suggestions: MaintenanceSuggestion[];
  denominaciones: DenominacionHomogeneaData[];
  onApply: (selectedSuggestions: MaintenanceSuggestion[]) => void;
  onClose: () => void;
  language: Language;
}

const SuggestionsReviewModal: React.FC<SuggestionsReviewModalProps> = ({
  suggestions,
  denominaciones,
  onApply,
  onClose,
  language
}) => {
  const { t } = useTranslation(language);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  // Agrupar sugerencias por denominación
  const suggestionsByDenominacion = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.denominacion]) {
      acc[suggestion.denominacion] = [];
    }
    acc[suggestion.denominacion].push(suggestion);
    return acc;
  }, {} as Record<string, MaintenanceSuggestion[]>);

  const handleToggleSuggestion = (suggestionKey: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionKey)) {
      newSelected.delete(suggestionKey);
    } else {
      newSelected.add(suggestionKey);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSuggestions.size === suggestions.length) {
      setSelectedSuggestions(new Set());
    } else {
      setSelectedSuggestions(new Set(suggestions.map((_, index) => `suggestion-${index}`)));
    }
  };

  const handleApplySelected = () => {
    const selectedSuggestionsList = suggestions.filter((_, index) => 
      selectedSuggestions.has(`suggestion-${index}`)
    );
    onApply(selectedSuggestionsList);
  };

  const getExistingMaintenanceForDenominacion = (denominacionName: string) => {
    const denominacion = denominaciones.find(d => 
      d.denominacion.toLowerCase() === denominacionName.toLowerCase()
    );
    return denominacion?.maintenanceTasks || [];
  };

  const isMaintenanceAlreadyExists = (suggestion: MaintenanceSuggestion) => {
    const existingTasks = getExistingMaintenanceForDenominacion(suggestion.denominacion);
    return existingTasks.some(task => 
      task.tipoMantenimiento.toLowerCase() === suggestion.tipoMantenimiento.toLowerCase() &&
      task.frecuencia.toLowerCase() === suggestion.frecuencia.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">
            Sugerencias Encontradas
          </h3>
        </div>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          Se encontraron {suggestions.length} sugerencias de mantenimiento para {Object.keys(suggestionsByDenominacion).length} denominaciones.
          Revisa y selecciona las que desees aplicar.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={handleSelectAll}
          variant="outline"
          size="sm"
        >
          {selectedSuggestions.size === suggestions.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
        </Button>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {selectedSuggestions.size} de {suggestions.length} seleccionadas
        </Badge>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(suggestionsByDenominacion).map(([denominacion, denominacionSuggestions]) => (
          <Card key={denominacion} className="border-2">
            <CardContent className="p-4">
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {denominacion}
              </h4>
              
              <div className="space-y-3">
                {denominacionSuggestions.map((suggestion, suggestionIndex) => {
                  const globalIndex = suggestions.findIndex(s => s === suggestion);
                  const suggestionKey = `suggestion-${globalIndex}`;
                  const isSelected = selectedSuggestions.has(suggestionKey);
                  const alreadyExists = isMaintenanceAlreadyExists(suggestion);

                  return (
                    <div
                      key={suggestionKey}
                      className={`p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : alreadyExists
                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSuggestion(suggestionKey)}
                          disabled={alreadyExists}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{suggestion.tipoMantenimiento}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{suggestion.frecuencia}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.tiempoEstimado}
                            </Badge>
                          </div>

                          {suggestion.descripcion && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {suggestion.descripcion}
                            </p>
                          )}

                          {alreadyExists && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CheckCircle className="h-4 w-4" />
                              <span>Ya existe este mantenimiento</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={handleApplySelected}
          disabled={selectedSuggestions.size === 0}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Aplicar {selectedSuggestions.size} Sugerencias
        </Button>
        <Button onClick={onClose} variant="outline">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default SuggestionsReviewModal;
