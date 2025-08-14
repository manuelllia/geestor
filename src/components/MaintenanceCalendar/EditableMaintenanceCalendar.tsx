import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, parseISO, isValid, addDays, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import MaintenanceEventModal from './MaintenanceEventModal';

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

  // Función para parsear frecuencia y obtener días entre mantenimientos
  const parseFrequency = (frecuencia: string): number => {
    const freq = frecuencia.toLowerCase().trim();
    
    if (freq.includes('diario') || freq.includes('daily')) return 1;
    if (freq.includes('semanal') || freq.includes('weekly')) return 7;
    if (freq.includes('quincenal') || freq.includes('biweekly')) return 15;
    if (freq.includes('mensual') || freq.includes('monthly')) return 30;
    if (freq.includes('bimensual') || freq.includes('bimonthly')) return 60;
    if (freq.includes('trimestral') || freq.includes('quarterly')) return 90;
    if (freq.includes('cuatrimestral')) return 120;
    if (freq.includes('semestral') || freq.includes('biannual')) return 180;
    if (freq.includes('anual') || freq.includes('yearly') || freq.includes('annual')) return 365;
    
    // Buscar números en la frecuencia (ej: "cada 3 meses", "90 días")
    const numberMatch = freq.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1]);
      if (freq.includes('mes') || freq.includes('month')) return num * 30;
      if (freq.includes('día') || freq.includes('day')) return num;
      if (freq.includes('semana') || freq.includes('week')) return num * 7;
      return num; // Por defecto asumir días
    }
    
    return 90; // Por defecto trimestral
  };

  // Función para parsear tiempo de mantenimiento
  const parseMaintenanceTime = (tiempo?: string): number => {
    if (!tiempo) return 2; // Por defecto 2 horas
    
    const tiempoStr = tiempo.toLowerCase().trim();
    const numberMatch = tiempoStr.match(/(\d+(?:\.\d+)?)/);
    
    if (numberMatch) {
      const num = parseFloat(numberMatch[1]);
      if (tiempoStr.includes('min')) return num / 60; // Convertir minutos a horas
      if (tiempoStr.includes('hora') || tiempoStr.includes('hour') || tiempoStr.includes('h')) return num;
      return num; // Por defecto asumir horas
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

  // Generar eventos para todo el año
  useEffect(() => {
    const generateYearlyEvents = () => {
      const yearStart = startOfYear(new Date());
      const yearEnd = endOfYear(new Date());
      const allEvents: MaintenanceEvent[] = [];
      
      denominaciones.forEach((denominacion, denomIndex) => {
        const diasEntreMant = parseFrequency(denominacion.frecuencia);
        const tiempoHoras = parseMaintenanceTime(denominacion.tiempo);
        const prioridad = getPriorityFromType(denominacion.tipoMantenimiento);
        
        // Calcular cuántos mantenimientos hay en el año para esta denominación
        const mantenimientosPorAno = Math.floor(365 / diasEntreMant);
        
        console.log(`📋 ${denominacion.denominacion}: ${mantenimientosPorAno} mantenimientos/año, cada ${diasEntreMant} días`);
        
        // Generar múltiples eventos a lo largo del año
        for (let mantIndex = 0; mantIndex < mantenimientosPorAno; mantIndex++) {
          // Distribuir eventos de manera uniforme a lo largo del año
          const dayOffset = (mantIndex * diasEntreMant) + Math.floor(Math.random() * 7); // Pequeña variación aleatoria
          const fechaEvento = addDays(yearStart, dayOffset);
          
          // Solo crear eventos que estén dentro del año
          if (fechaEvento <= yearEnd) {
            const event: MaintenanceEvent = {
              id: `event-${denomIndex}-${mantIndex}-${Date.now()}`,
              denominacion: denominacion.denominacion,
              codigo: denominacion.codigo,
              tipoMantenimiento: denominacion.tipoMantenimiento,
              fecha: fechaEvento,
              tiempo: tiempoHoras,
              cantidad: denominacion.cantidad,
              equipos: Array.from({ length: denominacion.cantidad }, (_, i) => 
                `${denominacion.denominacion} #${i + 1}`
              ),
              estado: fechaEvento < new Date() ? 'completado' : 'programado',
              prioridad,
              notas: `Mantenimiento ${mantIndex + 1}/${mantenimientosPorAno} del año - Frecuencia: ${denominacion.frecuencia}`
            };
            
            allEvents.push(event);
          }
        }
      });
      
      // Ordenar eventos por fecha
      allEvents.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
      
      console.log(`✅ Generados ${allEvents.length} eventos para todo el año`);
      return allEvents;
    };

    if (denominaciones.length > 0 && events.length === 0) {
      setEvents(generateYearlyEvents());
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

  // Calcular horas totales del año
  const getTotalHoursForYear = () => {
    return events.reduce((total, event) => total + (event.tiempo * event.cantidad), 0);
  };

  // Calcular horas totales del mes actual
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
      // Editar evento existente
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
    } else {
      // Crear nuevo evento
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
              📅 Calendario de Mantenimiento Anual
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Arrastra eventos para cambiar fechas • Haz clic para editar • Usa + para agregar nuevos
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
            <Button onClick={onBack} variant="outline">
              Volver al Análisis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Navegación del calendario */}
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

          {/* Grid del calendario */}
          <div className="grid grid-cols-7 gap-2">
            {/* Headers de días */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300">
                {day}
              </div>
            ))}

            {/* Días del calendario */}
            {monthDays.map(day => {
              const dayEvents = getEventsForDay(day);
              const totalHours = getTotalHoursForDay(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 p-2 border border-gray-200 dark:border-gray-700 rounded-lg relative
                    ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : 'bg-white dark:bg-gray-800'}
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
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {totalHours}h
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

      {/* Modal para editar/crear eventos */}
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
    </div>
  );
};

export default EditableMaintenanceCalendar;
