
import { useState, useEffect } from 'react';
import { MaintenanceSchedulingEngine, ScheduledMaintenance, WorkingConstraints } from '../utils/maintenance/MaintenanceSchedulingEngine';
import { MaintenanceTaskProcessor } from '../utils/maintenance/MaintenanceTaskProcessor';
import { addDays, format } from 'date-fns';

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

interface IncompleteDenominacion {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  missingFields: string[];
  reason: string;
}

export const useEnhancedMaintenanceCalendar = (denominaciones: DenominacionHomogeneaData[]) => {
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [incompleteDenominaciones, setIncompleteDenominaciones] = useState<IncompleteDenominacion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const [constraints, setConstraints] = useState<WorkingConstraints>({
    horasPorDia: 6,
    tecnicos: 2,
    eventosMaxPorDia: 3,
    trabajarSabados: false,
    horasEmergencia: 1,
  });

  // Función para validar si una denominación es completa
  const validateDenominacion = (denom: DenominacionHomogeneaData): { isValid: boolean; missingFields: string[]; reason: string } => {
    const missingFields: string[] = [];
    let reason = '';

    // Verificar frecuencia
    if (!denom.frecuencia || 
        denom.frecuencia.toLowerCase().includes('no especificada') ||
        denom.frecuencia.toLowerCase().includes('sin datos') ||
        denom.frecuencia.trim() === '') {
      missingFields.push('Frecuencia');
    }

    // Verificar tipo de mantenimiento
    if (!denom.tipoMantenimiento || 
        denom.tipoMantenimiento.toLowerCase().includes('no especificado') ||
        denom.tipoMantenimiento.toLowerCase().includes('sin datos') ||
        denom.tipoMantenimiento.trim() === '') {
      missingFields.push('Tipo de Mantenimiento');
    }

    // Generar razón descriptiva
    if (missingFields.length > 0) {
      reason = `Faltan datos: ${missingFields.join(', ')}`;
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      reason
    };
  };

  // Función para separar denominaciones válidas e incompletas
  const processDenominaciones = (denominaciones: DenominacionHomogeneaData[]) => {
    console.log('🔍 Procesando denominaciones para validación...');
    
    const valid: DenominacionHomogeneaData[] = [];
    const incomplete: IncompleteDenominacion[] = [];

    denominaciones.forEach(denom => {
      const validation = validateDenominacion(denom);
      
      if (validation.isValid) {
        valid.push(denom);
        console.log(`✅ Válida: ${denom.denominacion}`);
      } else {
        incomplete.push({
          ...denom,
          missingFields: validation.missingFields,
          reason: validation.reason
        });
        console.log(`⚠️ Incompleta: ${denom.denominacion} - ${validation.reason}`);
      }
    });

    console.log(`📊 Resumen: ${valid.length} válidas, ${incomplete.length} incompletas`);
    return { valid, incomplete };
  };

  // Función principal para generar el calendario
  const generateEnhancedCalendar = () => {
    console.log('🚀 INICIANDO GENERACIÓN DE CALENDARIO MEJORADO');
    setIsGenerating(true);
    setEvents([]);
    setGenerationComplete(false);

    try {
      // Separar denominaciones válidas e incompletas
      const { valid, incomplete } = processDenominaciones(denominaciones);
      setIncompleteDenominaciones(incomplete);

      if (valid.length === 0) {
        console.log('⚠️ No hay denominaciones válidas para programar');
        setIsGenerating(false);
        setGenerationComplete(true);
        return;
      }

      // Generar calendario solo con denominaciones válidas
      const startDate = new Date();
      const endDate = addDays(startDate, 365);
      
      const schedulingEngine = new MaintenanceSchedulingEngine(startDate, endDate, constraints);
      const maintenanceTasks = MaintenanceTaskProcessor.convertToMaintenanceTasks(valid);
      
      console.log(`📋 Procesando ${maintenanceTasks.length} tareas válidas`);
      
      const scheduledMaintenances = schedulingEngine.generateFullSchedule(maintenanceTasks);
      
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
      setGenerationComplete(true);
      
      console.log(`✅ Calendario generado: ${calendarEvents.length} eventos programados`);
      console.log(`⚠️ Denominaciones pendientes: ${incomplete.length}`);
      
    } catch (error) {
      console.error('❌ Error generando calendario:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para agregar manualmente una denominación incompleta
  const addIncompleteToCalendar = (incomplete: IncompleteDenominacion, updatedData: Partial<DenominacionHomogeneaData>) => {
    console.log(`📝 Agregando manualmente: ${incomplete.denominacion}`);
    
    // Crear denominación completa
    const completeDenominacion: DenominacionHomogeneaData = {
      ...incomplete,
      ...updatedData
    };

    // Validar que ahora esté completa
    const validation = validateDenominacion(completeDenominacion);
    if (!validation.isValid) {
      console.error('❌ Los datos siguen siendo incompletos:', validation.reason);
      return false;
    }

    // Generar tarea individual
    const task = MaintenanceTaskProcessor.convertToMaintenanceTasks([completeDenominacion])[0];
    
    // Programar en fechas disponibles
    const startDate = new Date();
    const endDate = addDays(startDate, 365);
    const schedulingEngine = new MaintenanceSchedulingEngine(startDate, endDate, constraints);
    
    const scheduledTasks = schedulingEngine.scheduleMaintenanceTask(task);
    
    // Convertir a eventos y agregar
    const newEvents: MaintenanceEvent[] = scheduledTasks.map((scheduled, index) => ({
      id: `manual-${incomplete.codigo}-${index}`,
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
      notas: `${scheduled.notas} - Agregado manualmente`
    }));

    setEvents(prev => [...prev, ...newEvents]);
    
    // Remover de incompletas
    setIncompleteDenominaciones(prev => 
      prev.filter(item => item.codigo !== incomplete.codigo)
    );

    console.log(`✅ Agregado ${newEvents.length} eventos para ${incomplete.denominacion}`);
    return true;
  };

  // Verificar si el calendario está completo para confirmar
  const isCalendarComplete = () => {
    return incompleteDenominaciones.length === 0 && events.length > 0;
  };

  // Generar automáticamente cuando cambian las denominaciones
  useEffect(() => {
    if (denominaciones && denominaciones.length > 0 && !generationComplete) {
      generateEnhancedCalendar();
    }
  }, [denominaciones]);

  return {
    events,
    setEvents,
    incompleteDenominaciones,
    isGenerating,
    generationComplete,
    selectedEvent,
    setSelectedEvent,
    constraints,
    setConstraints,
    generateEnhancedCalendar,
    addIncompleteToCalendar,
    isCalendarComplete,
    // Estadísticas útiles
    stats: {
      totalEvents: events.length,
      totalIncomplete: incompleteDenominaciones.length,
      totalHours: events.reduce((sum, event) => sum + (event.tiempo * event.cantidad), 0),
      completionPercentage: denominaciones.length > 0 
        ? Math.round((events.length / (events.length + incompleteDenominaciones.length)) * 100)
        : 0
    }
  };
};
