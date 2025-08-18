import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, Users, Check } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, parseISO, isValid, addDays, startOfYear, endOfYear, addWeeks, differenceInDays, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import MaintenanceEventModal from './MaintenanceEventModal';
import AcceptCalendarModal from './AcceptCalendarModal';

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

// Constantes realistas para recursos
const MAX_DAILY_HOURS = 8; // 8 horas de trabajo por día
const MAX_TECHNICIANS = 3; // 3 técnicos disponibles
const MAX_DAILY_CAPACITY = MAX_DAILY_HOURS * MAX_TECHNICIANS; // 24 horas máximo por día
const WORKING_DAYS_PER_WEEK = 5; // Lunes a viernes
const WORKING_DAYS_PER_MONTH = 22; // Aproximadamente 22 días laborables por mes
const HOURS_PER_MONTH_TARGET = MAX_DAILY_CAPACITY * WORKING_DAYS_PER_MONTH; // ~528h por mes

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
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  // Función para parsear frecuencia y obtener días exactos entre mantenimientos
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
      { regex: /(\d+)\s+semanas/i, multiplier: 7 }
    ];
    
    for (const pattern of patterns) {
      const match = freq.match(pattern.regex);
      if (match) {
        const num = parseInt(match[1]);
        const result = num * pattern.multiplier;
        console.log(`✅ Patrón encontrado: ${match[0]} = ${result} días`);
        return Math.max(1, Math.round(result));
      }
    }
    
    // Buscar solo números
    const numberMatch = freq.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1]);
      if (freq.includes('h') || freq.includes('hora')) {
        return Math.max(1, Math.round(num / 24));
      }
      const result = num > 365 ? 365 : num;
      console.log(`⚠️ Número sin contexto: ${num} -> ${result} días`);
      return result;
    }
    
    console.log(`❌ No se pudo parsear frecuencia: "${frecuencia}" - usando 90 días por defecto`);
    return 90;
  };

  // Función para parsear tiempo de mantenimiento
  const parseMaintenanceTime = (tiempo?: string): number => {
    if (!tiempo) return 2;
    
    const tiempoStr = tiempo.toLowerCase().trim();
    const numberMatch = tiempoStr.match(/(\d+(?:\.\d+)?)/);
    
    if (numberMatch) {
      const num = parseFloat(numberMatch[1]);
      if (tiempoStr.includes('min')) return num / 60;
      if (tiempoStr.includes('hora') || tiempoStr.includes('hour') || tiempoStr.includes('h')) return num;
      return num;
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

  // Función para calcular la capacidad disponible en una fecha
  const getAvailableCapacity = (date: Date, existingEvents: MaintenanceEvent[]): number => {
    const dayEvents = existingEvents.filter(event => 
      format(event.fecha, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const usedHours = dayEvents.reduce((total, event) => {
      return total + (event.tiempo * event.cantidad);
    }, 0);
    
    return Math.max(0, MAX_DAILY_CAPACITY - usedHours);
  };

  // Función para encontrar la mejor fecha disponible
  const findBestAvailableDate = (startDate: Date, existingEvents: MaintenanceEvent[], requiredHours: number): Date => {
    let candidateDate = new Date(startDate);
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      const dayOfWeek = candidateDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // No domingo ni sábado
        const availableCapacity = getAvailableCapacity(candidateDate, existingEvents);
        
        if (availableCapacity >= requiredHours) {
          return new Date(candidateDate);
        }
      }
      
      candidateDate = addDays(candidateDate, 1);
      attempts++;
    }
    
    return new Date(startDate);
  };

  // Función NUEVA: Distribución equitativa de horas por mes
  const distributeEventsEquitatively = (denominaciones: DenominacionHomogeneaData[]): MaintenanceEvent[] => {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    const allEvents: MaintenanceEvent[] = [];
    
    console.log(`📅 Generando calendario EQUITATIVO desde ${format(today, 'dd/MM/yyyy')} hasta ${format(nextYear, 'dd/MM/yyyy')}`);
    
    // Calcular horas totales anuales necesarias
    const totalAnnualHours = denominaciones.reduce((total, denominacion) => {
      const diasEntreMant = parseFrequencyToDays(denominacion.frecuencia);
      const tiempoHoras = parseMaintenanceTime(denominacion.tiempo);
      const mantenimientosPorAno = Math.floor(365 / diasEntreMant);
      const horasAnuales = mantenimientosPorAno * tiempoHoras * denominacion.cantidad;
      
      console.log(`📊 ${denominacion.denominacion}: ${horasAnuales}h/año (${mantenimientosPorAno} mant. × ${tiempoHoras}h × ${denominacion.cantidad} equipos)`);
      
      return total + horasAnuales;
    }, 0);
    
    console.log(`🎯 Total horas anuales: ${totalAnnualHours}h`);
    console.log(`📈 Objetivo mensual: ${Math.round(totalAnnualHours / 12)}h/mes`);
    
    // Obtener todos los meses del período
    const months = eachMonthOfInterval({ start: today, end: nextYear });
    const targetHoursPerMonth = totalAnnualHours / 12;
    
    // Crear estructura para rastrear horas por mes
    const monthlyHours: { [key: string]: number } = {};
    months.forEach(month => {
      monthlyHours[format(month, 'yyyy-MM')] = 0;
    });
    
    // Distribuir eventos equitativamente mes a mes
    denominaciones.forEach((denominacion, denomIndex) => {
      const diasEntreMant = parseFrequencyToDays(denominacion.frecuencia);
      const tiempoHoras = parseMaintenanceTime(denominacion.tiempo);
      const prioridad = getPriorityFromType(denominacion.tipoMantenimiento);
      
      console.log(`🔧 Distribuyendo: ${denominacion.denominacion}`);
      console.log(`   - Frecuencia: cada ${diasEntreMant} días`);
      console.log(`   - Tiempo: ${tiempoHoras}h × ${denominacion.cantidad} equipos`);
      
      // Calcular cuántas veces se debe mantener en el año
      let fechaActual = addDays(today, denomIndex * 2); // Offset inicial pequeño
      let contadorMantenimientos = 0;
      
      while (fechaActual <= nextYear && contadorMantenimientos < 15) {
        const monthKey = format(fechaActual, 'yyyy-MM');
        
        // Verificar si este mes ya tiene suficientes horas
        const currentMonthHours = monthlyHours[monthKey] || 0;
        const hoursNeeded = tiempoHoras * denominacion.cantidad;
        
        // Si agregar este mantenimiento no sobrepasa mucho el objetivo mensual, agregarlo
        if (currentMonthHours + hoursNeeded <= targetHoursPerMonth * 1.2) {
          const fechaOptima = findBestAvailableDate(fechaActual, allEvents, hoursNeeded);
          
          const event: MaintenanceEvent = {
            id: `event-${denomIndex}-${contadorMantenimientos}-${Date.now()}-${Math.random()}`,
            denominacion: denominacion.denominacion,
            codigo: denominacion.codigo,
            tipoMantenimiento: denominacion.tipoMantenimiento,
            fecha: fechaOptima,
            tiempo: tiempoHoras,
            cantidad: denominacion.cantidad,
            equipos: Array.from({ length: denominacion.cantidad }, (_, i) => 
              `${denominacion.denominacion} #${i + 1}`
            ),
            estado: fechaOptima < today ? 'completado' : 'programado',
            prioridad,
            notas: `Mantenimiento ${contadorMantenimientos + 1} - Frecuencia: cada ${diasEntreMant} días`
          };
          
          allEvents.push(event);
          monthlyHours[monthKey] = currentMonthHours + hoursNeeded;
          
          console.log(`   ✅ ${format(fechaOptima, 'dd/MM/yyyy')}: ${hoursNeeded}h (Total mes: ${monthlyHours[monthKey]}h)`);
        } else {
          console.log(`   ⚠️ ${format(fechaActual, 'dd/MM/yyyy')}: Mes sobrecargado (${currentMonthHours + hoursNeeded}h > ${Math.round(targetHoursPerMonth * 1.2)}h)`);
        }
        
        // Avanzar a la siguiente fecha programada
        fechaActual = addDays(fechaActual, diasEntreMant);
        contadorMantenimientos++;
      }
    });
    
    // Mostrar distribución final por mes
    console.log(`📊 Distribución final por mes:`);
    months.forEach(month => {
      const monthKey = format(month, 'yyyy-MM');
      const hours = monthlyHours[monthKey] || 0;
      const percentage = ((hours / targetHoursPerMonth) * 100).toFixed(1);
      console.log(`   - ${format(month, 'MMM yyyy', { locale: es })}: ${hours}h (${percentage}% del objetivo)`);
    });
    
    // Ordenar eventos por fecha
    allEvents.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    
    console.log(`✅ Calendario EQUITATIVO generado: ${allEvents.length} eventos`);
    
    return allEvents;
  };

  // Generar eventos distribuidos equitativamente
  useEffect(() => {
    if (denominaciones.length > 0 && events.length === 0) {
      setEvents(distributeEventsEquitatively(denominaciones));
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

  const getDayCapacityStatus = (day: Date) => {
    const totalHours = getTotalHoursForDay(day);
    if (totalHours === 0) return 'empty';
    if (totalHours <= MAX_DAILY_CAPACITY * 0.7) return 'normal';
    if (totalHours <= MAX_DAILY_CAPACITY) return 'busy';
    return 'overloaded';
  };

  const getDayCapacityColor = (status: string) => {
    switch (status) {
      case 'empty': return '';
      case 'normal': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'busy': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case 'overloaded': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      default: return '';
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

  const handleAcceptCalendar = (hospitalName: string) => {
    console.log('Calendar accepted for hospital:', hospitalName);
    setIsAcceptModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              📅 Calendario de Mantenimiento Anual - Distribución Equitativa
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Calendario optimizado con distribución equitativa de carga de trabajo mensual
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
                <span>Normal (≤{Math.round(MAX_DAILY_CAPACITY * 0.7)}h)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
                <span>Ocupado (≤{MAX_DAILY_CAPACITY}h)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                <span>Sobrecargado ({`>${MAX_DAILY_CAPACITY}h`})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{MAX_TECHNICIANS} técnicos • {MAX_DAILY_HOURS}h/día • {WORKING_DAYS_PER_MONTH} días/mes</span>
              </div>
            </div>
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
              onClick={() => setIsAcceptModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Aceptar Calendario
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

          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300">
                {day}
              </div>
            ))}

            {monthDays.map(day => {
              const dayEvents = getEventsForDay(day);
              const totalHours = getTotalHoursForDay(day);
              const capacityStatus = getDayCapacityStatus(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 p-2 border rounded-lg relative group
                    ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : getDayCapacityColor(capacityStatus) || 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
                    ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
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
                    <div className="flex items-center gap-1 mb-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className={`text-xs ${
                        capacityStatus === 'overloaded' ? 'text-red-600 font-semibold' :
                        capacityStatus === 'busy' ? 'text-yellow-600 font-medium' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {totalHours}h{totalHours > MAX_DAILY_CAPACITY ? ` (${`>${MAX_DAILY_CAPACITY}h`})` : ''}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
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
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} más
                      </div>
                    )}
                  </div>
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

      <AcceptCalendarModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onAccept={handleAcceptCalendar}
      />
    </div>
  );
};

export default EditableMaintenanceCalendar;
