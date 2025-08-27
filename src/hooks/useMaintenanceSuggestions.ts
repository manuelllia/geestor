
import { useState } from 'react';
import { MaintenanceSuggestionsService } from '../services/maintenanceSuggestionsService';

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

export const useMaintenanceSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<MaintenanceSuggestion[]>([]);

  const getSuggestions = async (
    denominaciones: DenominacionHomogeneaData[],
    tiposMantenimientoInteres: string[]
  ) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      console.log('🔍 Iniciando proceso de sugerencias de mantenimiento...');
      
      // Extraer solo los nombres de las denominaciones
      const denominacionesNames = denominaciones.map(d => d.denominacion);
      
      console.log('📋 Denominaciones a analizar:', denominacionesNames.length);
      console.log('🔧 Tipos de mantenimiento de interés:', tiposMantenimientoInteres.length);

      // Llamar al servicio de Gemini
      const maintenanceSuggestions = await MaintenanceSuggestionsService.suggestMaintenanceSchedules(
        denominacionesNames,
        tiposMantenimientoInteres
      );

      setSuggestions(maintenanceSuggestions);
      console.log('✅ Sugerencias obtenidas:', maintenanceSuggestions.length);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener sugerencias';
      setError(errorMessage);
      console.error('❌ Error obteniendo sugerencias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestions = (
    currentDenominaciones: DenominacionHomogeneaData[],
    suggestionsToApply: MaintenanceSuggestion[]
  ): DenominacionHomogeneaData[] => {
    console.log('🔄 Aplicando sugerencias a denominaciones...');
    
    return currentDenominaciones.map(denominacion => {
      // Buscar sugerencias para esta denominación
      const denominacionSuggestions = suggestionsToApply.filter(
        suggestion => suggestion.denominacion.toLowerCase() === denominacion.denominacion.toLowerCase()
      );

      if (denominacionSuggestions.length === 0) {
        return denominacion; // Sin cambios si no hay sugerencias
      }

      // Convertir sugerencias a tasks de mantenimiento
      const newMaintenanceTasks = denominacionSuggestions.map((suggestion, index) => ({
        id: `suggested-${Date.now()}-${index}`,
        tipoMantenimiento: suggestion.tipoMantenimiento,
        frecuencia: suggestion.frecuencia,
        tiempo: suggestion.tiempoEstimado.includes('hora') 
          ? suggestion.tiempoEstimado.replace(/[^\d.,]/g, '') 
          : suggestion.tiempoEstimado.includes('min') 
            ? String(Math.ceil(parseFloat(suggestion.tiempoEstimado.replace(/[^\d.,]/g, '')) / 60))
            : '2' // Default 2 horas si no se puede parsear
      }));

      // Combinar con tareas existentes (evitar duplicados)
      const existingTasks = denominacion.maintenanceTasks || [];
      const combinedTasks = [...existingTasks];
      
      newMaintenanceTasks.forEach(newTask => {
        const isDuplicate = existingTasks.some(existing => 
          existing.tipoMantenimiento.toLowerCase() === newTask.tipoMantenimiento.toLowerCase() &&
          existing.frecuencia.toLowerCase() === newTask.frecuencia.toLowerCase()
        );
        
        if (!isDuplicate) {
          combinedTasks.push(newTask);
        }
      });

      return {
        ...denominacion,
        maintenanceTasks: combinedTasks
      };
    });
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setError(null);
  };

  return {
    getSuggestions,
    applySuggestions,
    clearSuggestions,
    suggestions,
    isLoading,
    error
  };
};
