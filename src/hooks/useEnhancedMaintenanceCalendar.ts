import { useState, useEffect } from 'react';
import { MaintenanceTaskProcessor } from '../utils/maintenance/MaintenanceTaskProcessor';
import { OptimizedSchedulingEngine } from '../utils/maintenance/OptimizedSchedulingEngine';
import { MaintenanceCSVExporter } from '../utils/maintenance/CSVExporter';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

interface ScheduledEvent {
  id: string;
  denominacion: string;
  codigo: string;
  tipoMantenimiento: string;
  fecha: Date;
  tiempo: number;
  cantidad: number;
  equipos: string[];
  estado: 'programado' | 'en-progreso' | 'completado' | 'pendiente';
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  notas?: string;
  tecnico?: string;
}

interface WorkingConstraints {
  horasPorDia: number;
  tecnicos: number;
  eventosMaxPorDia: number;
  trabajarSabados: boolean;
  horasEmergencia: number;
}

export const useEnhancedMaintenanceCalendar = (denominaciones: DenominacionHomogeneaData[]) => {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [constraints, setConstraints] = useState<WorkingConstraints>({
    horasPorDia: 7,
    tecnicos: 3,
    eventosMaxPorDia: 4,
    trabajarSabados: false,
    horasEmergencia: 1
  });

  // Extraer opciones únicas de los datos
  const frecuenciaOptions = [...new Set(
    denominaciones
      .map(d => d.frecuencia)
      .filter(f => f && f !== 'No especificada')
  )].concat([
    'Mensual', 'Bimensual', 'Trimestral', 'Cuatrimestral', 
    'Semestral', 'Anual', 'Cada 15 días', 'Cada 3 meses'
  ]);

  const tipoOptions = [...new Set(
    denominaciones
      .map(d => d.tipoMantenimiento)
      .filter(t => t && t !== 'No especificado')
  )].concat([
    'Preventivo', 'Correctivo', 'Calibración', 'Verificación',
    'Limpieza', 'Inspección', 'Revisión técnica'
  ]);

  // Identificar denominaciones incompletas
  const incompleteDenominaciones = denominaciones.filter(d => 
    !d.frecuencia || d.frecuencia === 'No especificada' || 
    !d.tipoMantenimiento || d.tipoMantenimiento === 'No especificado' ||
    !d.tiempo || d.tiempo === 'No especificado'
  );

  const generateEnhancedCalendar = async () => {
    setIsGenerating(true);
    console.log('🚀 Iniciando generación de calendario mejorado...');
    
    try {
      // Filtrar solo denominaciones completas
      const completeDenominaciones = denominaciones.filter(d => 
        d.frecuencia && d.frecuencia !== 'No especificada' && 
        d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado' &&
        d.tiempo && d.tiempo !== 'No especificado'
      );

      if (completeDenominaciones.length === 0) {
        console.warn('⚠️ No hay denominaciones completas para generar calendario');
        setIsGenerating(false);
        return;
      }

      console.log(`📋 Procesando ${completeDenominaciones.length} denominaciones completas`);
      
      // Convertir a tareas de mantenimiento
      const maintenanceTasks = MaintenanceTaskProcessor.convertToMaintenanceTasks(completeDenominaciones);
      console.log(`🔧 ${maintenanceTasks.length} tareas de mantenimiento generadas`);

      // Generar calendario optimizado
      const schedulingEngine = new OptimizedSchedulingEngine(
        new Date(new Date().getFullYear(), 0, 1), // Inicio del año actual
        new Date(new Date().getFullYear(), 11, 31), // Final del año actual
        constraints
      );

      const scheduledMaintenances = await schedulingEngine.generateOptimizedSchedule(maintenanceTasks);
      console.log(`📅 ${scheduledMaintenances.length} mantenimientos programados`);

      // Convertir a formato de eventos para el calendario
      const calendarEvents: ScheduledEvent[] = scheduledMaintenances.map(maintenance => ({
        id: maintenance.id,
        denominacion: maintenance.denominacion,
        codigo: maintenance.codigo,
        tipoMantenimiento: maintenance.tipoMantenimiento,
        fecha: maintenance.fechaProgramada,
        tiempo: maintenance.tiempoHoras,
        cantidad: maintenance.cantidad,
        equipos: maintenance.equipos,
        estado: maintenance.estado,
        prioridad: maintenance.prioridad,
        notas: maintenance.notas,
        tecnico: maintenance.tecnicoAsignado
      }));

      setEvents(calendarEvents);
      console.log('✅ Calendario generado exitosamente');

    } catch (error) {
      console.error('❌ Error generando calendario:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addIncompleteToCalendar = (updatedDenominacion: DenominacionHomogeneaData) => {
    console.log('➕ Agregando denominación completada:', updatedDenominacion.denominacion);
    // Esta función se manejará desde el componente padre
  };

  const isCalendarComplete = () => {
    return incompleteDenominaciones.length === 0;
  };

  const exportCalendarToCSV = () => {
    try {
      const result = MaintenanceCSVExporter.exportToCSV(denominaciones);
      console.log('📊 CSV exportado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error exportando CSV:', error);
      return null;
    }
  };

  // Estadísticas del calendario
  const stats = {
    totalEvents: events.length,
    totalHours: events.reduce((sum, event) => sum + (event.tiempo * event.cantidad), 0),
    completionPercentage: denominaciones.length > 0 ? 
      Math.round(((denominaciones.length - incompleteDenominaciones.length) / denominaciones.length) * 100) : 0,
    monthlyDistribution: events.reduce((acc, event) => {
      const month = event.fecha.getMonth();
      acc[month] = (acc[month] || 0) + (event.tiempo * event.cantidad);
      return acc;
    }, {} as { [key: number]: number })
  };

  return {
    events,
    setEvents,
    incompleteDenominaciones,
    frecuenciaOptions,
    tipoOptions,
    isGenerating,
    selectedEvent,
    setSelectedEvent,
    constraints,
    setConstraints,
    generateEnhancedCalendar,
    addIncompleteToCalendar,
    isCalendarComplete,
    exportCalendarToCSV,
    stats
  };
};
