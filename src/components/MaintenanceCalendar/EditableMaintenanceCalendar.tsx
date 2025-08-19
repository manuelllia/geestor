import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, parseISO, isValid, addDays, startOfYear, endOfYear, addWeeks, getWeeksInMonth, startOfWeek, endOfWeek, eachWeekOfInterval, getDay } from 'date-fns';
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
        const num = parseInt(match[1]);
        const result = num * pattern.multiplier;
        console.log(`✅ Patrón encontrado: ${match[0]} = ${result} días`);
        return Math.max(1, Math.round(result)); // Mínimo 1 día
      }
    }
    
    // Buscar solo números
    const numberMatch = freq.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1]);
      // Si hay contexto de tiempo, aplicar lógica
      if (freq.includes('h') || freq.includes('hora')) {
        return Math.max(1, Math.round(num / 24)); // Convertir horas a días
      }
      // Si es un número sin contexto, asumir días por defecto
      const result = num > 365 ? 365 : num; // Máximo un año
      console.log(`⚠️ Número sin contexto: ${num} -> ${result} días`);
      return result;
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

  // ALGORITMO MEJORADO: Distribución equitativa de mantenimientos
  const generateOptimizedMaintenanceCalendar = () => {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    console.log(`🔧 GENERANDO CALENDARIO OPTIMIZADO - Distribución Equitativa`);
    console.log(`📅 Período: ${format(today, 'dd/MM/yyyy')} hasta ${format(nextYear, 'dd/MM/yyyy')}`);
    
    // Paso 1: Calcular todos los mantenimientos necesarios en el año
    const allMaintenanceNeeds: Array<{
      denominacion: string;
      codigo: string;
      tipoMantenimiento: string;
      tiempo: number;
      cantidad: number;
      frecuenciaDias: number;
      prioridad: 'baja' | 'media' | 'alta' | 'critica';
      mantenimientosAnuales: number;
      horasTotalesAnuales: number;
    }> = [];

    denominaciones.forEach(denom => {
      const diasEntreMant = parseFrequencyToDays(denom.frecuencia);
      const tiempoHoras = parseMaintenanceTime(denom.tiempo);
      const prioridad = getPriorityFromType(denom.tipoMantenimiento);
      
      // Calcular cuántos mantenimientos se necesitan en el año
      const mantenimientosAnuales = Math.ceil(365 / diasEntreMant);
      const horasTotalesAnuales = mantenimientosAnuales * tiempoHoras * denom.cantidad;
      
      allMaintenanceNeeds.push({
        denominacion: denom.denominacion,
        codigo: denom.codigo,
        tipoMantenimiento: denom.tipoMantenimiento,
        tiempo: tiempoHoras,
        cantidad: denom.cantidad,
        frecuenciaDias: diasEntreMant,
        prioridad,
        mantenimientosAnuales,
        horasTotalesAnuales
      });
      
      console.log(`📊 ${denom.denominacion}: ${mantenimientosAnuales} mant/año, ${horasTotalesAnuales}h/año`);
    });

    // Paso 2: Calcular distribución mensual objetivo
    const horasTotalesAnuales = allMaintenanceNeeds.reduce((sum, item) => sum + item.horasTotalesAnuales, 0);
    const horasObjetivoMensual = horasTotalesAnuales / 12;
    
    console.log(`🎯 Objetivo: ${horasObjetivoMensual.toFixed(1)} horas por mes`);
    
    // Paso 3: Crear estructura mensual para distribución
    const monthlyDistribution: { [key: string]: number } = {};
    const monthlyEvents: { [key: string]: MaintenanceEvent[] } = {};
    
    for (let i = 0; i < 12; i++) {
      const monthKey = format(addMonths(today, i), 'yyyy-MM');
      monthlyDistribution[monthKey] = 0;
      monthlyEvents[monthKey] = [];
    }

    // Paso 4: Distribuir mantenimientos de forma equitativa
    const allEvents: MaintenanceEvent[] = [];
    let eventCounter = 0;

    allMaintenanceNeeds.forEach(maintenance => {
      const fechasMantenimiento: Date[] = [];
      
      // Generar fechas base según frecuencia
      if (maintenance.frecuenciaDias <= 7) {
        // Mantenimientos frecuentes (diarios/semanales) - distribuir uniformemente
        const intervalo = Math.floor(365 / maintenance.mantenimientosAnuales);
        for (let i = 0; i < maintenance.mantenimientosAnuales; i++) {
          fechasMantenimiento.push(addDays(today, i * intervalo));
        }
      } else if (maintenance.frecuenciaDias <= 30) {
        // Mantenimientos mensuales - uno por mes, balanceando carga
        for (let month = 0; month < 12; month++) {
          const monthStart = startOfMonth(addMonths(today, month));
          const monthEnd = endOfMonth(addMonths(today, month));
          
          // Buscar el día con menos carga en el mes
          let bestDay = monthStart;
          let minHours = Infinity;
          
          for (let day = monthStart; day <= monthEnd; day = addDays(day, 1)) {
            // Evitar fines de semana para mantenimientos programados
            const dayOfWeek = getDay(day);
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;
            
            const dayKey = format(day, 'yyyy-MM-dd');
            const currentDayHours = allEvents
              .filter(e => format(e.fecha, 'yyyy-MM-dd') === dayKey)
              .reduce((sum, e) => sum + (e.tiempo * e.cantidad), 0);
            
            if (currentDayHours < minHours) {
              minHours = currentDayHours;
              bestDay = day;
            }
          }
          
          fechasMantenimiento.push(bestDay);
        }
      } else {
        // Mantenimientos menos frecuentes - distribuir según frecuencia real
        let fechaActual = new Date(today);
        while (fechaActual <= nextYear && fechasMantenimiento.length < maintenance.mantenimientosAnuales) {
          fechasMantenimiento.push(new Date(fechaActual));
          fechaActual = addDays(fechaActual, maintenance.frecuenciaDias);
        }
      }

      // Crear eventos para cada fecha
      fechasMantenimiento.forEach((fecha, index) => {
        if (fecha <= nextYear) {
          const monthKey = format(fecha, 'yyyy-MM');
          const horasEvento = maintenance.tiempo * maintenance.cantidad;
          
          // Verificar si añadir este evento excede mucho el objetivo mensual
          if (monthlyDistribution[monthKey] + horasEvento > horasObjetivoMensual * 1.5) {
            // Buscar un mes alternativo con menos carga
            const mesesAlternativos = Object.keys(monthlyDistribution)
              .map(key => ({ key, horas: monthlyDistribution[key] }))
              .sort((a, b) => a.horas - b.horas)
              .slice(0, 3);
            
            const mejorMes = mesesAlternativos[0];
            if (mejorMes && mejorMes.horas < horasObjetivoMensual * 1.2) {
              // Mover al mes con menos carga
              const [year, month] = mejorMes.key.split('-');
              fecha = new Date(parseInt(year), parseInt(month) - 1, fecha.getDate());
            }
          }

          const event: MaintenanceEvent = {
            id: `opt-event-${eventCounter++}-${Date.now()}`,
            denominacion: maintenance.denominacion,
            codigo: maintenance.codigo,
            tipoMantenimiento: maintenance.tipoMantenimiento,
            fecha: fecha,
            tiempo: maintenance.tiempo,
            cantidad: maintenance.cantidad,
            equipos: Array.from({ length: maintenance.cantidad }, (_, i) => 
              `${maintenance.denominacion} #${i + 1}`
            ),
            estado: fecha < today ? 'completado' : 'programado',
            prioridad: maintenance.prioridad,
            notas: `Mantenimiento optimizado ${index + 1}/${fechasMantenimiento.length} - Distribución equitativa`
          };

          allEvents.push(event);
          
          const finalMonthKey = format(fecha, 'yyyy-MM');
          monthlyDistribution[finalMonthKey] += horasEvento;
          monthlyEvents[finalMonthKey].push(event);
        }
      });
    });

    // Paso 5: Reporte de distribución
    console.log(`✅ CALENDARIO OPTIMIZADO GENERADO:`);
    console.log(`📊 Total eventos: ${allEvents.length}`);
    console.log(`⏱️ Total horas anuales: ${horasTotalesAnuales.toFixed(1)}h`);
    console.log(`📈 Distribución mensual:`);
    
    Object.entries(monthlyDistribution).forEach(([month, hours]) => {
      const percentage = ((hours / horasObjetivoMensual) * 100).toFixed(1);
      console.log(`   ${month}: ${hours.toFixed(1)}h (${percentage}% del objetivo)`);
    });

    // Calcular desviación estándar para medir equidad
    const horasMensuales = Object.values(monthlyDistribution);
    const promedio = horasMensuales.reduce((sum, h) => sum + h, 0) / horasMensuales.length;
    const varianza = horasMensuales.reduce((sum, h) => sum + Math.pow(h - promedio, 2), 0) / horasMensuales.length;
    const desviacionEstandar = Math.sqrt(varianza);
    
    console.log(`📏 Desviación estándar: ${desviacionEstandar.toFixed(2)}h (menor = más equitativo)`);

    return allEvents.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  };

  // Generar calendario optimizado al cargar el componente
  useEffect(() => {
    if (denominaciones.length > 0 && events.length === 0) {
      console.log('🚀 Iniciando generación de calendario optimizado...');
      const optimizedEvents = generateOptimizedMaintenanceCalendar();
      setEvents(optimizedEvents);
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
              📅 Calendario de Mantenimiento Optimizado
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Distribución equitativa de horas • Optimizado para eficiencia operacional • Arrastra eventos para reprogramar
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getTotalHoursForCurrentMonth().toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Este mes
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {getTotalHoursForYear().toFixed(1)}h
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
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-32 p-2 border border-gray-200 dark:border-gray-700 rounded-lg relative group
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
                        {totalHours.toFixed(1)}h
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
    </div>
  );
};

export default EditableMaintenanceCalendar;
