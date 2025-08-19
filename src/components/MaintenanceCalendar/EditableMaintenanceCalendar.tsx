import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, CheckCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, addDays, differenceInDays, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import MaintenanceEventModal from './MaintenanceEventModal';
import HospitalConfirmationModal from './HospitalConfirmationModal';

interface MaintenanceEvent {
  id: string;
  denominacion: string;
  codigo: string;
  tipoMantenimiento: string;
  fecha: Date;
  tiempo: number; // en horas
  cantidad: number;
  equipos: string[];
  tecnico?: string;
  estado: 'programado' | 'en-progreso' | 'completado' | 'pendiente';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  notas?: string;
}

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

interface EditableMaintenanceCalendarProps {
  denominaciones: DenominacionHomogeneaData[];
  onBack: () => void;
}

const EditableMaintenanceCalendar: React.FC<EditableMaintenanceCalendarProps> = ({
  denominaciones,
  onBack
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<MaintenanceEvent | null>(null);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);

  // Configuración de restricciones operativas MEJORADA
  const OPERATIONAL_CONSTRAINTS = {
    maxHoursPerDay: 6, // Reducido de 8 a 6 horas para ser más realista
    maxTechnicians: 2, // Reducido de 3 a 2 técnicos
    maxEventsPerDay: 3, // Reducido de 5 a 3 eventos máximo por día
    workingDaysPerWeek: 5, // Días laborables (lun-vie)
    minTimeBetweenEvents: 2, // Incrementado a 2 horas mínimas entre eventos
    emergencyBuffer: 1, // Reducido a 1 hora para emergencias
    maxEventsPerWeek: 12, // Máximo 12 eventos por semana
    maxHoursPerWeek: 30, // Máximo 30 horas de mantenimiento por semana
  };

  // Función mejorada para parsear frecuencia y obtener días exactos entre mantenimientos
  const parseFrequencyToDays = (frecuencia: string): number => {
    const freq = frecuencia.toLowerCase().trim();
    
    console.log(`🔍 Analizando frecuencia: "${frecuencia}"`);
    
    // Patrones específicos
    if (freq.includes('diario') || freq.includes('daily') || freq === 'diaria') return 1;
    if (freq.includes('semanal') || freq.includes('weekly') || freq === 'semanal') return 7;
    if (freq.includes('quincenal') || freq.includes('biweekly') || freq === 'quincenal') return 15;
    if (freq.includes('mensual') || freq.includes('monthly') || freq === 'mensual') return 30;
    if (freq.includes('bimensual') || freq.includes('bimonthly') || freq === 'bimensual') return 60;
    if (freq.includes('trimestral') || freq.includes('quarterly') || freq === 'trimestral') return 90;
    if (freq.includes('cuatrimestral') || freq === 'cuatrimestral') return 120;
    if (freq.includes('semestral') || freq.includes('biannual') || freq === 'semestral') return 180;
    if (freq.includes('anual') || freq.includes('yearly') || freq.includes('annual') || freq === 'anual') return 365;
    
    // Buscar patrones numéricos específicos
    const patterns = [
      { regex: /cada\s+(\d+)\s+mes/i, multiplier: 30 },
      { regex: /(\d+)\s+mes/i, multiplier: 30 },
      { regex: /cada\s+(\d+)\s+meses/i, multiplier: 30 },
      { regex: /(\d+)\s+meses/i, multiplier: 30 },
      { regex: /cada\s+(\d+)\s+día/i, multiplier: 1 },
      { regex: /(\d+)\s+día/i, multiplier: 1 },
      { regex: /cada\s+(\d+)\s+días/i, multiplier: 1 },
      { regex: /(\d+)\s+días/i, multiplier: 1 },
      { regex: /cada\s+(\d+)\s+semana/i, multiplier: 7 },
      { regex: /(\d+)\s+semana/i, multiplier: 7 },
      { regex: /cada\s+(\d+)\s+semanas/i, multiplier: 7 },
      { regex: /(\d+)\s+semanas/i, multiplier: 7 },
      { regex: /(\d+)\s*h/i, multiplier: 1/24 }, // horas a días
    ];
    
    for (const pattern of patterns) {
      const match = freq.match(pattern.regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > 0) {
          const result = num * pattern.multiplier;
          console.log(`✅ Patrón encontrado: ${match[0]} = ${result} días`);
          return Math.max(1, Math.round(result)); // Mínimo 1 día
        }
      }
    }
    
    // Buscar solo números
    const numberMatch = freq.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1], 10);
      if (!isNaN(num) && num > 0) {
        // Si hay contexto de tiempo, aplicar lógica
        if (freq.includes('h') || freq.includes('hora')) {
          return Math.max(1, Math.round(num / 24)); // Convertir horas a días
        }
        // Si es un número sin contexto, asumir días por defecto
        const result = num > 365 ? 365 : num; // Máximo un año
        console.log(`⚠️ Número sin contexto: ${num} -> ${result} días`);
        return result;
      }
    }
    
    console.log(`❌ No se pudo parsear frecuencia: "${frecuencia}" - usando 90 días por defecto`);
    return 90; // Por defecto trimestral
  };

  // Función para parsear tiempo de mantenimiento
  const parseMaintenanceTime = (tiempo?: string): number => {
    if (!tiempo) return 2; // Por defecto 2 horas
    
    const tiempoStr = tiempo.toLowerCase().trim();
    const numberMatch = tiempoStr.match(/(\d+(?:\.\d+)?)/);
    
    if (numberMatch) {
      const num = parseFloat(numberMatch[1]);
      if (!isNaN(num)) {
        if (tiempoStr.includes('min')) return num / 60; // Convertir minutos a horas
        if (tiempoStr.includes('hora') || tiempoStr.includes('hour') || tiempoStr.includes('h')) return num;
        return num; // Por defecto asumir horas
      }
    }
    
    return 2;
  };

  // Función para obtener prioridad basada en el tipo de mantenimiento
  const getPriorityFromType = (tipoMantenimiento: string): 'baja' | 'media' | 'alta' | 'critica' => {
    const tipo = tipoMantenimiento.toLowerCase();
    
    if (tipo.includes('correctivo') || tipo.includes('emergencia') || tipo.includes('urgente')) return 'critica';
    if (tipo.includes('calibracion') || tipo.includes('calibración') || tipo.includes('metrologia')) return 'alta';
    if (tipo.includes('preventivo') || tipo.includes('predictivo')) return 'media';
    return 'baja';
  };

  // Función para verificar si un día es laborable (lun-vie)
  const isWorkingDay = (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // 1=Lunes, 5=Viernes
  };

  // Función MEJORADA para calcular la carga de trabajo de un día específico
  const calculateDayWorkload = (date: Date, allEvents: MaintenanceEvent[]) => {
    const dayEvents = allEvents.filter(event => 
      format(event.fecha, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const totalHours = dayEvents.reduce((sum, event) => sum + (event.tiempo * event.cantidad), 0);
    const totalEvents = dayEvents.length;
    const availableHours = OPERATIONAL_CONSTRAINTS.maxHoursPerDay - OPERATIONAL_CONSTRAINTS.emergencyBuffer;
    
    return {
      events: totalEvents,
      hours: totalHours,
      utilization: availableHours > 0 ? totalHours / availableHours : 0,
      isOverloaded: totalEvents > OPERATIONAL_CONSTRAINTS.maxEventsPerDay || totalHours > availableHours
    };
  };

  // Función MEJORADA para calcular la carga de trabajo semanal
  const calculateWeekWorkload = (startDate: Date, allEvents: MaintenanceEvent[]) => {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
    const weekEvents = allEvents.filter(event => {
      const eventDateStr = format(event.fecha, 'yyyy-MM-dd');
      return weekDays.some(day => format(day, 'yyyy-MM-dd') === eventDateStr);
    });
    
    const totalHours = weekEvents.reduce((sum, event) => sum + (event.tiempo * event.cantidad), 0);
    const totalEvents = weekEvents.length;
    
    return {
      events: totalEvents,
      hours: totalHours,
      isOverloaded: totalEvents > OPERATIONAL_CONSTRAINTS.maxEventsPerWeek || totalHours > OPERATIONAL_CONSTRAINTS.maxHoursPerWeek
    };
  };

  // Función SÚPER MEJORADA para encontrar el mejor día disponible
  const findBestAvailableDay = (startDate: Date, endDate: Date, allEvents: MaintenanceEvent[], duration: number, quantity: number): Date => {
    const totalTimeNeeded = duration * quantity;
    const days = eachDayOfInterval({ start: startDate, end: endDate })
      .filter(isWorkingDay) // Solo días laborables
      .sort(() => Math.random() - 0.5); // Aleatorizar para mejor distribución
    
    // Buscar días completamente libres primero
    for (const day of days) {
      const workload = calculateDayWorkload(day, allEvents);
      if (workload.events === 0 && workload.hours === 0) {
        return day;
      }
    }
    
    // Buscar días con carga baja
    let bestDay = days[0];
    let lowestLoad = Infinity;
    
    for (const day of days) {
      const workload = calculateDayWorkload(day, allEvents);
      const weekStart = addDays(day, -day.getDay() + 1); // Lunes de esa semana
      const weekWorkload = calculateWeekWorkload(weekStart, allEvents);
      
      // Verificar si este día y semana pueden acomodar el nuevo evento
      const newDayTotalHours = workload.hours + totalTimeNeeded;
      const newDayTotalEvents = workload.events + 1;
      const newWeekTotalHours = weekWorkload.hours + totalTimeNeeded;
      const newWeekTotalEvents = weekWorkload.events + 1;
      
      const dayOk = newDayTotalEvents <= OPERATIONAL_CONSTRAINTS.maxEventsPerDay && 
                   newDayTotalHours <= (OPERATIONAL_CONSTRAINTS.maxHoursPerDay - OPERATIONAL_CONSTRAINTS.emergencyBuffer);
      
      const weekOk = newWeekTotalEvents <= OPERATIONAL_CONSTRAINTS.maxEventsPerWeek &&
                     newWeekTotalHours <= OPERATIONAL_CONSTRAINTS.maxHoursPerWeek;
      
      if (dayOk && weekOk) {
        // Combinar utilización diaria y semanal para encontrar el mejor balance
        const combinedLoad = (workload.utilization * 0.7) + (weekWorkload.hours / OPERATIONAL_CONSTRAINTS.maxHoursPerWeek * 0.3);
        
        if (combinedLoad < lowestLoad) {
          lowestLoad = combinedLoad;
          bestDay = day;
        }
      }
    }
    
    return bestDay;
  };

  // Función SÚPER OPTIMIZADA para generar calendario ULTRA realista
  const generateRealisticMaintenanceCalendar = (): MaintenanceEvent[] => {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    console.log('🏥 Generando calendario SÚPER REALISTA y OPTIMIZADO');
    console.log(`📅 Período: ${format(today, 'dd/MM/yyyy')} - ${format(nextYear, 'dd/MM/yyyy')}`);
    console.log('🔧 Restricciones operativas MEJORADAS:', OPERATIONAL_CONSTRAINTS);
    
    // Preparar datos de denominaciones con cálculos más conservadores
    const denominacionesProcessed = denominaciones.map(denom => {
      const diasEntreMant = Math.max(30, parseFrequencyToDays(denom.frecuencia)); // Mínimo 30 días entre mantenimientos
      const tiempoHoras = Math.min(4, parseMaintenanceTime(denom.tiempo)); // Máximo 4 horas por mantenimiento
      const prioridad = getPriorityFromType(denom.tipoMantenimiento);
      
      // Calcular eventos de forma MUY conservadora
      const diasTotales = differenceInDays(nextYear, today);
      const diasLaborables = Math.floor(diasTotales * (OPERATIONAL_CONSTRAINTS.workingDaysPerWeek / 7));
      
      // Reducir drásticamente el número de eventos
      const eventosIdeal = Math.max(1, Math.floor(diasLaborables / diasEntreMant));
      const eventosMaximos = Math.floor(denom.cantidad / 10); // Solo 1 de cada 10 equipos por año
      const eventosReales = Math.min(eventosIdeal, eventosMaximos, 4); // Máximo 4 eventos por denominación al año
      
      return {
        ...denom,
        diasEntreMant,
        tiempoHoras,
        prioridad,
        eventosReales,
        eventosIdeal,
        eventosMaximos
      };
    });
    
    console.log('📊 Análisis de capacidad SÚPER CONSERVADOR:');
    denominacionesProcessed.forEach(d => {
      console.log(`   ${d.denominacion}: ${d.eventosIdeal} ideales → ${d.eventosReales} reales (máx: ${d.eventosMaximos})`);
    });
    
    // Ordenar por prioridad y limitar aún más
    const sortedDenominaciones = [...denominacionesProcessed]
      .sort((a, b) => {
        const prioridadOrder = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
        return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      })
      .slice(0, 20); // Solo las 20 denominaciones más prioritarias
    
    const allEvents: MaintenanceEvent[] = [];
    
    // Generar eventos con distribución SÚPER espaciada
    sortedDenominaciones.forEach((denominacion, denomIndex) => {
      console.log(`🔧 Programando: ${denominacion.denominacion} (${denominacion.prioridad})`);
      
      for (let i = 0; i < denominacion.eventosReales; i++) {
        // Distribución MUY espaciada - mínimo 3 meses entre eventos
        const intervaloMinimo = Math.max(90, differenceInDays(nextYear, today) / Math.max(1, denominacion.eventosReales));
        const diasOffset = Math.floor(i * intervaloMinimo);
        let fechaObjetivo = addDays(today, diasOffset);
        
        // Añadir variación aleatoria más amplia (+/- 30 días)
        const variacion = Math.floor(Math.random() * 61) - 30;
        fechaObjetivo = addDays(fechaObjetivo, variacion);
        
        // Asegurar que está dentro del rango
        if (fechaObjetivo < today) fechaObjetivo = addDays(today, 7);
        if (fechaObjetivo > nextYear) fechaObjetivo = addDays(nextYear, -30);
        
        // Buscar el mejor día disponible en una ventana MÁS AMPLIA (±60 días)
        const windowStart = addDays(fechaObjetivo, -60);
        const windowEnd = addDays(fechaObjetivo, 60);
        const mejorFecha = findBestAvailableDay(
          windowStart < today ? today : windowStart, 
          windowEnd > nextYear ? nextYear : windowEnd, 
          allEvents, 
          denominacion.tiempoHoras,
          Math.min(3, denominacion.cantidad) // Máximo 3 equipos por evento
        );
        
        const cantidadReducida = Math.min(3, Math.ceil(denominacion.cantidad / 10)); // Reducir cantidad drásticamente
        
        const event: MaintenanceEvent = {
          id: `event-ultra-realistic-${denomIndex}-${i}-${Date.now()}-${Math.random()}`,
          denominacion: denominacion.denominacion,
          codigo: denominacion.codigo,
          tipoMantenimiento: denominacion.tipoMantenimiento,
          fecha: mejorFecha,
          tiempo: denominacion.tiempoHoras,
          cantidad: cantidadReducida,
          equipos: Array.from({ length: cantidadReducida }, (_, j) => 
            `${denominacion.denominacion} #${j + 1}`
          ),
          estado: mejorFecha < today ? 'completado' : 'programado',
          prioridad: denominacion.prioridad,
          notas: `Mant. ${i + 1}/${denominacion.eventosReales} • Optimizado por recursos limitados • ${cantidadReducida} equipos`
        };
        
        allEvents.push(event);
      }
    });
    
    // Ordenar por fecha y verificar distribución final
    allEvents.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    
    // Verificación final de sobrecarga y redistribución si es necesaria
    const eventsToRedistribute: MaintenanceEvent[] = [];
    allEvents.forEach(event => {
      const workload = calculateDayWorkload(event.fecha, allEvents);
      if (workload.isOverloaded) {
        eventsToRedistribute.push(event);
      }
    });
    
    // Redistribuir eventos sobrecargados
    eventsToRedistribute.forEach(event => {
      const originalIndex = allEvents.findIndex(e => e.id === event.id);
      if (originalIndex !== -1) {
        // Buscar nueva fecha en los próximos 3 meses
        const newDate = findBestAvailableDay(
          addDays(event.fecha, 1),
          addDays(event.fecha, 90),
          allEvents.filter(e => e.id !== event.id),
          event.tiempo,
          event.cantidad
        );
        allEvents[originalIndex].fecha = newDate;
        allEvents[originalIndex].notas += ' • Redistribuido por sobrecarga';
      }
    });
    
    // Análisis final
    console.log('✅ Calendario SÚPER realista generado:', allEvents.length, 'eventos');
    console.log('📈 Distribución mensual FINAL:');
    
    const distribucionMensual: { [key: string]: { eventos: number, horas: number } } = {};
    allEvents.forEach(event => {
      const mes = format(event.fecha, 'yyyy-MM');
      if (!distribucionMensual[mes]) {
        distribucionMensual[mes] = { eventos: 0, horas: 0 };
      }
      distribucionMensual[mes].eventos++;
      distribucionMensual[mes].horas += event.tiempo * event.cantidad;
    });
    
    Object.entries(distribucionMensual).forEach(([mes, data]) => {
      const fecha = new Date(mes + '-01');
      const nombreMes = format(fecha, 'MMMM yyyy', { locale: es });
      const promedioDiario = data.horas / 30; // Aproximado por mes
      console.log(`   ${nombreMes}: ${data.eventos} eventos, ${data.horas.toFixed(1)}h (${promedioDiario.toFixed(1)}h/día)`);
    });
    
    return allEvents;
  };

  // Función MEJORADA para obtener el color del día según la carga de trabajo
  const getDayWorkloadColor = (day: Date): string => {
    const workload = calculateDayWorkload(day, events);
    
    if (workload.utilization === 0) {
      return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'; // Sin actividad
    } else if (workload.utilization <= 0.4) {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'; // Poco ocupado
    } else if (workload.utilization <= 0.8) {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'; // Con tareas
    } else {
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'; // Saturado
    }
  };

  // Función para confirmar y guardar el calendario
  const handleConfirmCalendar = (hospitalName: string) => {
    console.log(`✅ Calendario confirmado para: ${hospitalName}`);
    console.log(`📅 Eventos totales: ${events.length}`);
    console.log(`⏱️ Total horas anuales: ${getTotalHoursForYear()}h`);
    
    setIsHospitalModalOpen(false);
  };

  useEffect(() => {
    if (denominaciones.length > 0 && events.length === 0) {
      setEvents(generateRealisticMaintenanceCalendar());
    }
  }, [denominaciones, events.length]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      format(event.fecha, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const getTotalHoursForDay = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    return dayEvents.reduce((total, event) => total + (event.tiempo * event.cantidad), 0);
  };

  const getTotalHoursForYear = () => {
    return events.reduce((total, event) => total + (event.tiempo * event.cantidad), 0);
  };

  const getTotalHoursForCurrentMonth = () => {
    const monthEvents = events.filter(event => 
      event.fecha.getFullYear() === currentDate.getFullYear() &&
      event.fecha.getMonth() === currentDate.getMonth()
    );
    return monthEvents.reduce((total, event) => total + (event.tiempo * event.cantidad), 0);
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-200';
      case 'en-progreso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEventClick = (event: MaintenanceEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<MaintenanceEvent>) => {
    if (selectedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
    } else {
      const newEvent: MaintenanceEvent = {
        id: `event-${Date.now()}`,
        denominacion: eventData.denominacion || 'Nuevo Mantenimiento',
        codigo: eventData.codigo || 'NUEVO',
        tipoMantenimiento: eventData.tipoMantenimiento || 'Preventivo',
        fecha: selectedDate || new Date(),
        tiempo: eventData.tiempo || 2,
        cantidad: eventData.cantidad || 1,
        equipos: eventData.equipos || ['Equipo #1'],
        estado: eventData.estado || 'programado',
        prioridad: eventData.prioridad || 'media',
        notas: eventData.notas,
        tecnico: eventData.tecnico,
        ...eventData
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleDragStart = (event: MaintenanceEvent) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (draggedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === draggedEvent.id 
          ? { ...event, fecha: targetDate }
          : event
      ));
      setDraggedEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              📅 Calendario de Mantenimiento SÚPER OPTIMIZADO
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Recursos limitados • Máx {OPERATIONAL_CONSTRAINTS.maxEventsPerDay} eventos/día • {OPERATIONAL_CONSTRAINTS.maxHoursPerDay}h disponibles/día • 2 técnicos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getTotalHoursForCurrentMonth()}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Este mes
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {getTotalHoursForYear()}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total año
              </div>
            </div>
            <Button 
              onClick={() => setIsHospitalModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Calendario
            </Button>
            <Button onClick={onBack} variant="outline">
              Volver al Análisis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Leyenda de colores MEJORADA */}
          <div className="flex items-center gap-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Poco ocupado (≤40% capacidad)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-sm">Con tareas (≤80% capacidad)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm">Saturado ({'>'}80% capacidad)</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Recursos: {OPERATIONAL_CONSTRAINTS.maxTechnicians} técnicos</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300">
                {day}
              </div>
            ))}

            {monthDays.map(day => {
              const dayEvents = getEventsForDay(day);
              const totalHours = getTotalHoursForDay(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const workload = calculateDayWorkload(day, events);
              const dayColor = getDayWorkloadColor(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 p-2 border rounded-lg relative transition-colors group
                    ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                    ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                    ${isWeekend ? 'bg-gray-100 dark:bg-gray-700' : dayColor}
                    hover:shadow-md transition-shadow
                  `}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {!isWeekend && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        onClick={() => handleAddEvent(day)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {totalHours > 0 && (
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {totalHours.toFixed(1)}h
                        </span>
                      </div>
                      <span className={`text-xs px-1 py-0.5 rounded ${
                        workload.utilization <= 0.4 ? 'bg-green-200 text-green-800' :
                        workload.utilization <= 0.8 ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {Math.round(workload.utilization * 100)}%
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="p-1 rounded text-xs cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all"
                        draggable
                        onDragStart={() => handleDragStart(event)}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.prioridad)}`} />
                          <span className="truncate flex-1">{event.denominacion}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-80">{event.tiempo}h × {event.cantidad}</span>
                          <Badge className={`text-xs px-1 py-0 ${getStatusColor(event.estado)}`}>
                            {event.estado}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>

                  {/* Advertencia de sobrecarga MEJORADA */}
                  {workload.isOverloaded && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Día sobrecargado"></div>
                    </div>
                  )}

                  {/* Indicador de fin de semana */}
                  {isWeekend && (
                    <div className="absolute bottom-1 right-1">
                      <div className="text-xs text-gray-400">🏖️</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <MaintenanceEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        event={selectedEvent}
        denominaciones={denominaciones}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
      />

      <HospitalConfirmationModal
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
        onConfirm={handleConfirmCalendar}
        totalEvents={events.length}
        totalHours={getTotalHoursForYear()}
      />
    </div>
  );
};

export default EditableMaintenanceCalendar;
