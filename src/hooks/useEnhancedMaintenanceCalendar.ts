import { useState, useEffect } from 'react';
import { MaintenanceTaskProcessor } from '../utils/maintenance/MaintenanceTaskProcessor';
import { OptimizedSchedulingEngine } from '../utils/maintenance/OptimizedSchedulingEngine';
import { MaintenanceCSVExporter } from '../utils/maintenance/CSVExporter';

interface MaintenanceTask {
  id: string;
  tipoMantenimiento: string;
  frecuencia: string;
  tiempo: string;
}

export interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
  maintenanceTasks?: MaintenanceTask[];
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
  const frecuenciaOptions = [...new Set([
    ...denominaciones
      .map(d => d.frecuencia)
      .filter(f => f && f !== 'No especificada'),
    ...denominaciones
      .flatMap(d => d.maintenanceTasks || [])
      .map(t => t.frecuencia)
      .filter(f => f && f !== 'No especificada')
  ])].concat([
    'Mensual', 'Bimensual', 'Trimestral', 'Cuatrimestral', 
    'Semestral', 'Anual', 'Cada 15 días', 'Cada 3 meses'
  ]);

  const tipoOptions = [...new Set([
    ...denominaciones
      .map(d => d.tipoMantenimiento)
      .filter(t => t && t !== 'No especificado'),
    ...denominaciones
      .flatMap(d => d.maintenanceTasks || [])
      .map(t => t.tipoMantenimiento)
      .filter(t => t && t !== 'No especificado')
  ])].concat([
    'Preventivo', 'Correctivo', 'Calibración', 'Verificación',
    'Limpieza', 'Inspección', 'Revisión técnica'
  ]);

  // Identificar denominaciones incompletas
  const incompleteDenominaciones = denominaciones.filter(d => {
    const hasTasks = d.maintenanceTasks && d.maintenanceTasks.length > 0;
    const hasBasicMaintenance = d.frecuencia && d.frecuencia !== 'No especificada' && 
                               d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado' &&
                               d.tiempo && d.tiempo !== 'No especificado';
    return !hasTasks && !hasBasicMaintenance;
  });

  const generateEnhancedCalendar = async () => {
    setIsGenerating(true);
    console.log('🚀 Iniciando generación de calendario mejorado...');
    
    try {
      // Expandir denominaciones con múltiples tareas de mantenimiento
      const expandedMaintenanceTasks: any[] = [];
      
      denominaciones.forEach(denominacion => {
        // Si tiene tareas específicas, usar esas
        if (denominacion.maintenanceTasks && denominacion.maintenanceTasks.length > 0) {
          denominacion.maintenanceTasks.forEach(task => {
            expandedMaintenanceTasks.push({
              codigo: denominacion.codigo,
              denominacion: denominacion.denominacion,
              cantidad: denominacion.cantidad,
              frecuencia: task.frecuencia,
              tipoMantenimiento: task.tipoMantenimiento,
              tiempo: task.tiempo
            });
          });
        } 
        // Si no tiene tareas específicas pero tiene mantenimiento básico
        else if (
          denominacion.frecuencia && denominacion.frecuencia !== 'No especificada' && 
          denominacion.tipoMantenimiento && denominacion.tipoMantenimiento !== 'No especificado'
        ) {
          expandedMaintenanceTasks.push({
            codigo: denominacion.codigo,
            denominacion: denominacion.denominacion,
            cantidad: denominacion.cantidad,
            frecuencia: denominacion.frecuencia,
            tipoMantenimiento: denominacion.tipoMantenimiento,
            tiempo: denominacion.tiempo || '2'
          });
        }
        // Si no tiene nada, crear mantenimiento básico con valores por defecto
        else {
          expandedMaintenanceTasks.push({
            codigo: denominacion.codigo,
            denominacion: denominacion.denominacion,
            cantidad: denominacion.cantidad,
            frecuencia: 'Trimestral',
            tipoMantenimiento: 'Preventivo',
            tiempo: '2'
          });
        }
      });

      console.log(`📋 Procesando ${expandedMaintenanceTasks.length} tareas de mantenimiento expandidas`);
      
      // Convertir a tareas de mantenimiento
      const maintenanceTasks = MaintenanceTaskProcessor.convertToMaintenanceTasks(expandedMaintenanceTasks);
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

  const isCalendarComplete = () => {
    return incompleteDenominaciones.length === 0;
  };

  const exportCalendarToCSV = () => {
    try {
      // Usar el nuevo exportador CSV con las columnas especificadas
      const result = MaintenanceCSVExporter.exportToCSV(denominaciones);
      
      if (result) {
        console.log('📊 CSV exportado exitosamente con distribución mensual');
        return true;
      } else {
        console.warn('⚠️ No se pudo exportar el CSV - datos insuficientes');
        return false;
      }
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
    isCalendarComplete,
    exportCalendarToCSV,
    stats
  };
};
