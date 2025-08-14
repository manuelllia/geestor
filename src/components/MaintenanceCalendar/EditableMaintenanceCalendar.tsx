
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, parseISO, isValid } from 'date-fns';
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

  // Generar eventos iniciales basados en las denominaciones
  useEffect(() => {
    const generateInitialEvents = () => {
      const initialEvents: MaintenanceEvent[] = [];
      const currentMonth = startOfMonth(currentDate);
      
      denominaciones.forEach((denominacion, index) => {
        const frecuencia = denominacion.frecuencia.toLowerCase();
        let diasEntreMant = 30; // Por defecto mensual
        
        if (frecuencia.includes('semanal')) diasEntreMant = 7;
        else if (frecuencia.includes('mensual')) diasEntreMant = 30;
        else if (frecuencia.includes('trimestral')) diasEntreMant = 90;
        else if (frecuencia.includes('semestral')) diasEntreMant = 180;
        else if (frecuencia.includes('anual')) diasEntreMant = 365;

        // Parsear tiempo de mantenimiento
        let tiempoHoras = 2; // Por defecto 2 horas
        if (denominacion.tiempo) {
          const tiempoMatch = denominacion.tiempo.match(/(\d+)/);
          if (tiempoMatch) {
            tiempoHoras = parseInt(tiempoMatch[1]);
          }
        }

        // Distribuir eventos a lo largo del mes de manera óptima
        const fechaInicial = new Date(currentMonth);
        fechaInicial.setDate(Math.floor(Math.random() * 28) + 1); // Día aleatorio del mes

        const event: MaintenanceEvent = {
          id: `event-${index}-${Date.now()}`,
          denominacion: denominacion.denominacion,
          codigo: denominacion.codigo,
          tipoMantenimiento: denominacion.tipoMantenimiento,
          fecha: fechaInicial,
          tiempo: tiempoHoras,
          cantidad: denominacion.cantidad,
          equipos: Array.from({ length: denominacion.cantidad }, (_, i) => 
            `${denominacion.denominacion} #${i + 1}`
          ),
          estado: 'programado',
          prioridad: denominacion.tipoMantenimiento.toLowerCase().includes('correctivo') ? 'alta' : 'media'
        };

        initialEvents.push(event);
      });

      return initialEvents;
    };

    if (denominaciones.length > 0 && events.length === 0) {
      setEvents(generateInitialEvents());
    }
  }, [denominaciones, currentDate, events.length]);

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

  const totalHoursMonth = events.reduce((total, event) => 
    total + (event.tiempo * event.cantidad), 0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              📅 Calendario de Mantenimiento Modificable
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Arrastra eventos para cambiar fechas • Haz clic para editar • Usa + para agregar nuevos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalHoursMonth}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total del mes
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
                          <span className="text-xs opacity-80">{event.tiempo}h</span>
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
