
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

  // Configuración de restricciones operativas
  const OPERATIONAL_CONSTRAINTS = {
    maxHoursPerDay: 8, // Horas máximas de trabajo efectivo por día
    maxTechnicians: 3, // Número máximo de técnicos disponibles
    maxEventsPerDay: 5, // Máximo número de eventos por día para evitar sobrecarga
    workingDaysPerWeek: 5, // Días laborables (lun-vie)
    minTimeBetweenEvents: 1, // Horas mínimas entre eventos el mismo día
    emergencyBuffer: 2, // Horas reservadas para emergencias por día
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
        if (!isNaN(num)) {
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
      if (!isNaN(num)) {
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

  // Función para calcular la carga de trabajo de un día específico
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
      utilization: totalHours / availableHours,
      isOverloaded: totalEvents > OPERATIONAL_CONSTRAINTS.maxEventsPerDay || totalHours > availableHours
    };
  };

  // Función para encontrar el mejor día disponible en un rango
  const findBestAvailableDay = (startDate: Date, endDate: Date, allEvents: MaintenanceEvent[], duration: number): Date => {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
      .filter(isWorkingDay); // Solo días laborables
    
    let bestDay = days[0];
    let lowestLoad = Infinity;
    
    for (const day of days) {
      const workload = calculateDayWorkload(day, allEvents);
      
      // Verificar si este día puede acomodar el nuevo evento
      const newTotalHours = workload.hours + duration;
      const newTotalEvents = workload.events + 1;
      
      if (newTotalEvents <= OPERATIONAL_CONSTRAINTS.maxEventsPerDay && 
          newTotalHours <= (OPERATIONAL_CONSTRAINTS.maxHoursPerDay - OPERATIONAL_CONSTRAINTS.emergencyBuffer)) {
        
        // Preferir días con menor carga actual
        if (workload.utilization < lowestLoad) {
          lowestLoad = workload.utilization;
          bestDay = day;
        }
      }
    }
    
    return bestDay;
  };

  // Nueva función súper optimizada para generar calendario realista
  const generateRealisticMaintenanceCalendar = (): MaintenanceEvent[] => {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    console.log('🏥 Generando calendario REALISTA y OPTIMIZADO');
    console.log(`📅 Período: ${format(today, 'dd/MM/yyyy')} - ${format(nextYear, 'dd/MM/yyyy')}`);
    console.log('🔧 Restricciones operativas:', OPERATIONAL_CONSTRAINTS);
    
    // Preparar datos de denominaciones con cálculos
    const denominacionesProcessed = denominaciones.map(denom => {
      const diasEntreMant = parseFrequencyToDays(denom.frecuencia);
      const tiempoHoras = parseMaintenanceTime(denom.tiempo);
      const prioridad = getPriorityFromType(denom.tipoMantenimiento);
      
      // Calcular eventos necesarios en el año de forma más conservadora
      const diasTotales = differenceInDays(nextYear, today);
      const diasLaborables = Math.floor(diasTotales * (OPERATIONAL_CONSTRAINTS.workingDaysPerWeek / 7));
      const eventosIdeal = Math.floor(diasLaborables / diasEntreMant);
      
      // Limitar eventos según capacidad operativa real
      const horasAnualesNecesarias = eventosIdeal * tiempoHoras * denom.cantidad;
      const horasAnualesDisponibles = diasLaborables * (OPERATIONAL_CONSTRAINTS.maxHoursPerDay - OPERATIONAL_CONSTRAINTS.emergencyBuffer);
      
      const factorAjuste = Math.min(1, horasAnualesDisponibles / (horasAnualesNecesarias || 1));
      const eventosReales = Math.max(1, Math.floor(eventosIdeal * factorAjuste));
      
      return {
        ...denom,
        diasEntreMant,
        tiempoHoras,
        prioridad,
        eventosReales,
        eventosIdeal,
        horasAnualesNecesarias
      };
    });
    
    console.log('📊 Análisis de capacidad:');
    denominacionesProcessed.forEach(d => {
      console.log(`   ${d.denominacion}: ${d.eventosIdeal} ideales → ${d.eventosReales} reales`);
    });
    
    // Ordenar por prioridad para asignar primero los más críticos
    const sortedDenominaciones = [...denominacionesProcessed].sort((a, b) => {
      const prioridadOrder = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
      return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
    });
    
    const allEvents: MaintenanceEvent[] = [];
    
    // Generar eventos con distribución inteligente
    sortedDenominaciones.forEach((denominacion, denomIndex) => {
      console.log(`🔧 Programando: ${denominacion.denominacion} (${denominacion.prioridad})`);
      
      for (let i = 0; i < denominacion.eventosReales; i++) {
        // Calcular fecha objetivo distribuyendo uniformemente
        const intervaloIdeal = differenceInDays(nextYear, today) / denominacion.eventosReales;
        const diasOffset = Math.floor(i * intervaloIdeal);
        let fechaObjetivo = addDays(today, diasOffset);
        
        // Añadir variación aleatoria para evitar clusters (+/- 7 días)
        const variacion = Math.floor(Math.random() * 15) - 7;
        fechaObjetivo = addDays(fechaObjetivo, variacion);
        
        // Asegurar que está dentro del rango y es día laborable
        if (fechaObjetivo < today) fechaObjetivo = today;
        if (fechaObjetivo > nextYear) fechaObjetivo = nextYear;
        
        // Buscar el mejor día disponible en una ventana de ±14 días
        const windowStart = addDays(fechaObjetivo, -14);
        const windowEnd = addDays(fechaObjetivo, 14);
        const mejorFecha = findBestAvailableDay(
          windowStart < today ? today : windowStart, 
          windowEnd > nextYear ? nextYear : windowEnd, 
          allEvents, 
          denominacion.tiempoHoras * denominacion.cantidad
        );
        
        const event: MaintenanceEvent = {
          id: `event-realistic-${denomIndex}-${i}-${Date.now()}-${Math.random()}`,
          denominacion: denominacion.denominacion,
          codigo: denominacion.codigo,
          tipoMantenimiento: denominacion.tipoMantenimiento,
          fecha: mejorFecha,
          tiempo: denominacion.tiempoHoras,
          cantidad: denominacion.cantidad,
          equipos: Array.from({ length: denominacion.cantidad }, (_, j) => 
            `${denominacion.denominacion} #${j + 1}`
          ),
          estado: mejorFecha < today ? 'completado' : 'programado',
          prioridad: denominacion.prioridad,
          notas: `Mant. ${i + 1}/${denominacion.eventosReales} • Optimizado por capacidad operativa`
        };
        
        allEvents.push(event);
      }
    });
    
    // Ordenar por fecha
    allEvents.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    
    // Análisis final
    console.log('✅ Calendario realista generado:', allEvents.length, 'eventos');
    console.log('📈 Distribución mensual:');
    
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
      console.log(`   ${nombreMes}: ${data.eventos} eventos, ${data.horas.toFixed(1)}h`);
    });
    
    return allEvents;
  };

  // Función para obtener el color del día según la carga de trabajo
  const getDayWorkloadColor = (day: Date): string => {
    const workload = calculateDayWorkload(day, events);
    
    if (workload.utilization === 0) {
      return 'bg-white dark:bg-gray-800'; // Sin actividad
    } else if (workload.utilization <= 0.4) {
      return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'; // Poco ocupado
    } else if (workload.utilization <= 0.8) {
      return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'; // Con tareas
    } else {
      return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'; // Hasta arriba
    }
  };

  // Función para confirmar y guardar el calendario
  const handleConfirmCalendar = (hospitalName: string) => {
    console.log(`✅ Calendario confirmado para: ${hospitalName}`);
    console.log(`📅 Eventos totales: ${events.length}`);
    console.log(`⏱️ Total horas anuales: ${getTotalHoursForYear()}h`);
    
    // Aquí se podría implementar la lógica para guardar en base de datos
    // Por ahora solo mostramos un mensaje de confirmación
    setIsHospitalModalOpen(false);
    
    // Mostrar toast de confirmación
    // toast.success(`Calendario confirmado para ${hospitalName}`);
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
              📅 Calendario de Mantenimiento INTELIGENTE
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Optimizado por recursos • Máx {OPERATIONAL_CONSTRAINTS.maxEventsPerDay} eventos/día • {OPERATIONAL_CONSTRAINTS.maxHoursPerDay}h laborables
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

          {/* Leyenda de colores */}
          <div className="flex items-center gap-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Poco ocupado (≤40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-sm">Con tareas (≤80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm">Hasta arriba (>80%)</span>
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

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 p-2 border rounded-lg relative transition-colors
                    ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                    ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                    ${dayColor}
                    hover:shadow-md transition-shadow
                  `}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      onClick={() => handleAddEvent(day)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {totalHours > 0 && (
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {totalHours.toFixed(1)}h
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
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

                  {/* Advertencia de sobrecarga */}
                  {workload.isOverloaded && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
