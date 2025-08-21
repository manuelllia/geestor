
import { useState, useCallback } from 'react';
import { OptimizedSchedulingEngine, ScheduledMaintenance, WorkingConstraints, GenerationProgress } from '../utils/maintenance/OptimizedSchedulingEngine';
import { MaintenanceTaskProcessor } from '../utils/maintenance/MaintenanceTaskProcessor';
import { addDays } from 'date-fns';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

interface MaintenanceEvent {
  id: string;
  denominacion: string;
  codigo: string;
  tipoMantenimiento: string;
  fecha: Date;
  tiempo: number;
  cantidad: number;
  equipos: string[];
  tecnico?: string;
  estado: 'programado' | 'en-progreso' | 'completado' | 'pendiente';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  notas?: string;
}

export const useOptimizedMaintenanceCalendar = (initialDenominaciones: DenominacionHomogeneaData[]) => {
  const [denominaciones, setDenominaciones] = useState<DenominacionHomogeneaData[]>(initialDenominaciones);
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const [constraints, setConstraints] = useState<WorkingConstraints>({
    horasPorDia: 7,
    tecnicos: 2,
    eventosMaxPorDia: 3,
    trabajarSabados: false,
    horasEmergencia: 1,
  });

  const handleProgress = useCallback((progress: GenerationProgress) => {
    setGenerationProgress(progress);
  }, []);

  const generateOptimizedCalendar = useCallback(async () => {
    console.log('🚀 Iniciando generación de calendario optimizado');
    setIsGenerating(true);
    setEvents([]);
    setGenerationProgress(null);

    try {
      // Filtrar denominaciones válidas
      const validDenominaciones = denominaciones.filter(d => 
        d.frecuencia && 
        d.tipoMantenimiento && 
        !d.frecuencia.toLowerCase().includes('no especificada') &&
        !d.tipoMantenimiento.toLowerCase().includes('no especificado')
      );

      if (validDenominaciones.length === 0) {
        console.log('⚠️ No hay denominaciones válidas para programar');
        setIsGenerating(false);
        return;
      }

      const startDate = new Date();
      const endDate = addDays(startDate, 365);
      
      const schedulingEngine = new OptimizedSchedulingEngine(
        startDate, 
        endDate, 
        constraints,
        handleProgress
      );
      
      const maintenanceTasks = MaintenanceTaskProcessor.convertToMaintenanceTasks(validDenominaciones);
      
      // Generar calendario de forma optimizada
      const scheduledMaintenances = await schedulingEngine.generateOptimizedSchedule(maintenanceTasks);
      
      // Convertir a eventos del calendario
      const calendarEvents: MaintenanceEvent[] = scheduledMaintenances.map((scheduled, index) => ({
        id: scheduled.id || `maintenance-${index}`,
        denominacion: scheduled.denominacion,
        codigo: scheduled.codigo,
        tipoMantenimiento: scheduled.tipoMantenimiento,
        fecha: scheduled.fechaProgramada,
        tiempo: scheduled.tiempoHoras,
        cantidad: scheduled.cantidad,
        equipos: scheduled.equipos,
        tecnico: scheduled.tecnicoAsignado,
        estado: scheduled.estado,
        prioridad: scheduled.prioridad,
        notas: scheduled.notas
      }));

      setEvents(calendarEvents);
      console.log(`✅ Calendario optimizado generado: ${calendarEvents.length} eventos`);
      
    } catch (error) {
      console.error('❌ Error generando calendario optimizado:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  }, [denominaciones, constraints, handleProgress]);

  const updateDenominaciones = useCallback((updated: DenominacionHomogeneaData[]) => {
    setDenominaciones(updated);
  }, []);

  // Estadísticas útiles
  const stats = {
    totalEvents: events.length,
    totalDenominaciones: denominaciones.length,
    validDenominaciones: denominaciones.filter(d => 
      d.frecuencia && 
      d.tipoMantenimiento && 
      !d.frecuencia.toLowerCase().includes('no especificada') &&
      !d.tipoMantenimiento.toLowerCase().includes('no especificado')
    ).length,
    totalHours: events.reduce((sum, event) => sum + (event.tiempo * event.cantidad), 0),
    completionPercentage: denominaciones.length > 0 
      ? Math.round((events.length / denominaciones.length) * 100)
      : 0
  };

  return {
    denominaciones,
    events,
    setEvents,
    isGenerating,
    generationProgress,
    selectedEvent,
    setSelectedEvent,
    constraints,
    setConstraints,
    generateOptimizedCalendar,
    updateDenominaciones,
    stats
  };
};
