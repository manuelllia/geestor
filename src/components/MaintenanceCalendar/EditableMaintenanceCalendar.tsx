import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, CheckCircle, Settings } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import MaintenanceEventModal from './MaintenanceEventModal';
import HospitalConfirmationModal from './HospitalConfirmationModal';
import { MaintenanceSchedulingEngine, ScheduledMaintenance, WorkingConstraints } from '../../utils/maintenance/MaintenanceSchedulingEngine';
import { MaintenanceTaskProcessor } from '../../utils/maintenance/MaintenanceTaskProcessor';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConstraintsConfig, setShowConstraintsConfig] = useState(false);

  // Configuración CORREGIDA: 2-3 técnicos, L-V, parámetros realistas
  const [constraints, setConstraints] = useState<WorkingConstraints>({
    horasPorDia: 6, // 6 horas efectivas de trabajo técnico
    tecnicos: 2, // 2 técnicos (ajustable a 3)
    eventosMaxPorDia: 3, // Máximo 3 intervenciones por día
    trabajarSabados: false, // SOLO lunes a viernes
    horasEmergencia: 1, // 1 hora reservada para emergencias
  });

  /**
   * Genera el calendario usando el motor profesional CORREGIDO
   */
  const generateProfessionalMaintenanceCalendar = (): MaintenanceEvent[] => {
    console.log('🏗️ GENERANDO CALENDARIO PROFESIONAL - VERSIÓN CORREGIDA');
    console.log('📋 Denominaciones a procesar:', denominaciones?.length || 0);
    
    if (!denominaciones || denominaciones.length === 0) {
      console.warn('⚠️ No hay denominaciones disponibles');
      return [];
    }
    
    try {
      // Período exacto: desde hoy hasta un año
      const startDate = new Date();
      const endDate = addDays(startDate, 365);
      
      console.log(`📅 Período: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`);
      console.log(`⚙️ Configuración:`, constraints);
      
      // Inicializar motor con configuración corregida
      const schedulingEngine = new MaintenanceSchedulingEngine(startDate, endDate, constraints);
      
      // Convertir denominaciones a tareas
      console.log('🔄 Convirtiendo denominaciones...');
      const maintenanceTasks = MaintenanceTaskProcessor.convertToMaintenanceTasks(denominaciones);
      
      console.log(`✅ Tareas generadas: ${maintenanceTasks.length}`);
      
      if (maintenanceTasks.length === 0) {
        console.warn('⚠️ No se generaron tareas de mantenimiento');
        return [];
      }
      
      // Log de muestra
      console.log('📋 Muestra de tareas:');
      maintenanceTasks.slice(0, 3).forEach(task => {
        console.log(`   - ${task.denominacion}: cada ${task.frecuenciaDias}d, ${task.tiempoHoras}h, prioridad ${task.prioridad}`);
      });
      
      // Generar calendario
      console.log('🚀 Ejecutando programación...');
      const scheduledMaintenances = schedulingEngine.generateFullSchedule(maintenanceTasks);
      
      console.log(`✅ Mantenimientos programados: ${scheduledMaintenances.length}`);
      
      if (scheduledMaintenances.length === 0) {
        console.warn('⚠️ No se programaron mantenimientos');
        return [];
      }
      
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
      
      console.log(`🎯 Eventos del calendario: ${calendarEvents.length}`);
      
      // Verificar distribución
      const eventsByMonth = calendarEvents.reduce((acc, event) => {
        const month = format(event.fecha, 'yyyy-MM');
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Distribución mensual:', eventsByMonth);
      
      return calendarEvents;
      
    } catch (error) {
      console.error('❌ Error generando calendario:', error);
      return [];
    }
  };

  // Efecto para generación automática MEJORADO
  useEffect(() => {
    console.log('🔄 useEffect - Estado actual:', {
      denominacionesCount: denominaciones?.length || 0,
      eventsCount: events.length,
      isGenerating
    });
    
    // Solo generar si hay denominaciones y no hay eventos
    if (denominaciones && denominaciones.length > 0 && events.length === 0 && !isGenerating) {
      console.log('🚀 Iniciando generación automática...');
      setIsGenerating(true);
      
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        const calendar = generateProfessionalMaintenanceCalendar();
        
        if (calendar.length > 0) {
          console.log('✅ Calendario generado, actualizando eventos...');
          setEvents(calendar);
        } else {
          console.warn('⚠️ Calendario vacío generado');
        }
        
        setIsGenerating(false);
      }, 500);
    }
  }, [denominaciones, events.length, isGenerating]);

  // Función para regenerar manualmente
  const handleRegenerateCalendar = () => {
    console.log('🔄 Regeneración manual iniciada...');
    setIsGenerating(true);
    setEvents([]); // Limpiar eventos
    
    setTimeout(() => {
      const newCalendar = generateProfessionalMaintenanceCalendar();
      
      if (newCalendar.length > 0) {
        setEvents(newCalendar);
        setShowConstraintsConfig(false);
        console.log('✅ Calendario regenerado exitosamente');
      } else {
        console.error('❌ Error en regeneración - calendario vacío');
      }
      
      setIsGenerating(false);
    }, 1000);
  };

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

  const getDayWorkloadColor = (day: Date): string => {
    const totalHours = getTotalHoursForDay(day);
    const utilization = totalHours / constraints.horasPorDia;
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    if (isWeekend && !constraints.trabajarSabados) {
      return 'bg-gray-100 dark:bg-gray-700';
    }
    
    if (utilization === 0) {
      return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700';
    } else if (utilization <= 0.5) {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30';
    } else if (utilization <= 0.8) {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
    } else {
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30';
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

  const handleConfirmCalendar = (hospitalName: string) => {
    console.log(`✅ Calendario profesional confirmado para: ${hospitalName}`);
    console.log(`📅 Eventos totales: ${events.length}`);
    console.log(`⏱️ Total horas anuales: ${getTotalHoursForYear()}h`);
    
    setIsHospitalModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              🏥 Calendario Profesional de Mantenimiento - Gestión Técnica
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              📋 Programación L-V • {constraints.tecnicos} técnicos • {constraints.horasPorDia}h/día • 
              {events.length} mantenimientos programados
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
              onClick={() => setShowConstraintsConfig(!showConstraintsConfig)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurar
            </Button>
            <Button 
              onClick={() => setIsHospitalModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isGenerating || events.length === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Calendario
            </Button>
            <Button onClick={onBack} variant="outline">
              Volver al Análisis
            </Button>
          </div>
        </CardHeader>
        
        {/* Panel de configuración MEJORADO */}
        {showConstraintsConfig && (
          <CardContent className="border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium">Horas/día</label>
                <input
                  type="number"
                  value={constraints.horasPorDia}
                  onChange={(e) => setConstraints(prev => ({ ...prev, horasPorDia: Number(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  min="4"
                  max="8"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Técnicos (2-3)</label>
                <input
                  type="number"
                  value={constraints.tecnicos}
                  onChange={(e) => setConstraints(prev => ({ ...prev, tecnicos: Number(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  min="2"
                  max="3"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max eventos/día</label>
                <input
                  type="number"
                  value={constraints.eventosMaxPorDia}
                  onChange={(e) => setConstraints(prev => ({ ...prev, eventosMaxPorDia: Number(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  min="2"
                  max="5"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={constraints.trabajarSabados}
                    onChange={(e) => setConstraints(prev => ({ ...prev, trabajarSabados: e.target.checked }))}
                  />
                  Sábados
                </label>
                <p className="text-xs text-gray-500">Por defecto L-V</p>
              </div>
              <div>
                <Button 
                  onClick={handleRegenerateCalendar} 
                  className="w-full" 
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generando...' : 'Regenerar'}
                </Button>
              </div>
            </div>
          </CardContent>
        )}

        <CardContent>
          {/* Estado de carga MEJORADO */}
          {isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-xl font-semibold text-blue-600 mb-2">Generando calendario profesional...</p>
              <p className="text-gray-600 dark:text-gray-300">Aplicando algoritmos de distribución óptima</p>
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ⚙️ Procesando {denominaciones?.length || 0} denominaciones homogéneas
                </p>
              </div>
            </div>
          )}

          {/* Calendario vacío con debugging */}
          {!isGenerating && events.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-lg mx-auto">
                <p className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">
                  ⚠️ Calendario vacío
                </p>
                <div className="text-left bg-white dark:bg-gray-800 rounded p-4 mb-4">
                  <p className="font-medium mb-2">Estado del sistema:</p>
                  <ul className="text-sm space-y-1">
                    <li>📋 Denominaciones: {denominaciones?.length || 0}</li>
                    <li>🔧 Técnicos: {constraints.tecnicos}</li>
                    <li>📅 Días: {constraints.trabajarSabados ? 'L-S' : 'L-V'}</li>
                    <li>⏰ Horas/día: {constraints.horasPorDia}h</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleRegenerateCalendar} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  size="lg"
                >
                  🚀 Generar Calendario Ahora
                </Button>
              </div>
            </div>
          )}

          {/* Calendario principal - solo si hay eventos */}
          {!isGenerating && events.length > 0 && (
            <>
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

              {/* Leyenda mejorada */}
              <div className="flex items-center gap-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm">Carga baja (≤50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span className="text-sm">Carga media (≤80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-sm">Carga alta ({'>'}80%)</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Recursos profesionales optimizados</span>
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
                  const dayColor = getDayWorkloadColor(day);
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const utilization = totalHours / constraints.horasPorDia;

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-32 p-2 border rounded-lg relative transition-colors group
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
                            utilization <= 0.5 ? 'bg-green-200 text-green-800' :
                            utilization <= 0.8 ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {Math.round(utilization * 100)}%
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

                      {isWeekend && !constraints.trabajarSabados && (
                        <div className="absolute bottom-1 right-1">
                          <div className="text-xs text-gray-400">🏖️</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
