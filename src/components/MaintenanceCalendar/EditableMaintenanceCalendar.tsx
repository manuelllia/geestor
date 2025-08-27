import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, CheckCircle, Settings, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import MaintenanceEventModal from './MaintenanceEventModal';
import HospitalConfirmationModal from './HospitalConfirmationModal';
import { useEnhancedMaintenanceCalendar } from '../../hooks/useEnhancedMaintenanceCalendar';
import EditableDenominationsForm from './EditableDenominationsForm';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface MaintenanceTask {
  id: string;
  tipoMantenimiento: string;
  frecuencia: string;
  tiempo: string;
}

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
  maintenanceTasks?: MaintenanceTask[];
}

interface EditableMaintenanceCalendarProps {
  denominaciones: DenominacionHomogeneaData[];
  onBack: () => void;
  language: Language;
}

const EditableMaintenanceCalendar: React.FC<EditableMaintenanceCalendarProps> = ({
  denominaciones,
  onBack,
  language
}) => {
  const { t } = useTranslation(language);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<any>(null);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [showConstraintsConfig, setShowConstraintsConfig] = useState(false);
  const [updatedDenominaciones, setUpdatedDenominaciones] = useState(denominaciones);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const {
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
  } = useEnhancedMaintenanceCalendar(updatedDenominaciones);

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

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: any) => {
    if (selectedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
    } else {
      const newEvent = {
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

  const handleDragStart = (event: any) => {
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

  const handleUpdateDenominaciones = (updated: DenominacionHomogeneaData[]) => {
    setUpdatedDenominaciones(updated);
  };

  const handleGenerateCalendar = async () => {
    setShowLoadingScreen(true);
    
    // Simular tiempo de carga para mostrar el mensaje al usuario
    setTimeout(async () => {
      await generateEnhancedCalendar();
      setShowLoadingScreen(false);
    }, 1000);
  };

  const handleExportCSV = () => {
    const result = exportCalendarToCSV();
    if (result) {
      console.log('✅ Plan anual exportado correctamente');
      // Aquí podrías agregar una notificación de éxito
    }
  };

  const handleConfirmCalendar = (hospitalName: string) => {
    // Exportar automáticamente al confirmar
    handleExportCSV();
    
    console.log(`✅ Calendario profesional confirmado para: ${hospitalName}`);
    console.log(`📅 Eventos totales: ${events.length}`);
    console.log(`⏱️ Total horas anuales: ${stats.totalHours}h`);
    
    setIsHospitalModalOpen(false);
  };

  const handleRegenerateCalendar = () => {
    generateEnhancedCalendar();
    setShowConstraintsConfig(false);
  };

  // Pantalla de carga
  if (showLoadingScreen || isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                🔄 {t('generateCalendar')} Profesional
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Nuestro sistema está creando un calendario optimizado para tu hospital
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4 text-blue-800 dark:text-blue-200">
                🧠 Proceso de Optimización en Curso:
              </h3>
              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <span>Analizando {updatedDenominaciones.length} tipos de equipos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <span>Aplicando lógica estacional (quirófanos, refrigeración, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                  <span>Optimizando distribución de carga laboral</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                  <span>Balanceando recursos técnicos disponibles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                  <span>Generando calendario final y plan CSV</span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                ⏱️ <strong>Este proceso puede tomar entre 30 segundos y 2 minutos</strong><br />
                Estamos procesando cada denominación de forma inteligente para garantizar 
                una distribución óptima del mantenimiento a lo largo del año.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario editable de denominaciones */}
      <EditableDenominationsForm
        denominaciones={updatedDenominaciones}
        frecuenciaOptions={frecuenciaOptions}
        tipoOptions={tipoOptions}
        onUpdate={handleUpdateDenominaciones}
        onGenerate={handleGenerateCalendar}
        isGenerating={isGenerating}
        language={language}
      />

      {/* Calendario principal */}
      {events.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                🏥 {t('maintenanceCalendar')} - Gestión Técnica
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                📋 Programación L-V • {constraints.tecnicos} técnicos • {constraints.horasPorDia}h/día • 
                {stats.totalEvents} mantenimientos programados • {stats.completionPercentage}% completo
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
                  {stats.totalHours}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total año
                </div>
              </div>
              <Button onClick={handleExportCSV} variant="outline">
                📊 {t('export')} Plan CSV
              </Button>
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
                disabled={!isCalendarComplete() || isGenerating}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('confirm')} {t('calendar')}
              </Button>
              <Button onClick={onBack} variant="outline">
                {t('back')} al {t('analysis')}
              </Button>
            </div>
          </CardHeader>
          
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
                  <label className="text-sm font-medium">Técnicos</label>
                  <input
                    type="number"
                    value={constraints.tecnicos}
                    onChange={(e) => setConstraints(prev => ({ ...prev, tecnicos: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="2"
                    max="5"
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
                    max="6"
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
                <span className="text-sm">Carga alta (&gt;80%)</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Recursos optimizados</span>
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
                      hover:shadow-md transition-shadow cursor-pointer
                    `}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day)}
                    onClick={() => dayEvents.length > 0 && handleEventClick(dayEvents[0])}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {!isWeekend && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddEvent(day);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
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
                        <div className="text-xs text-gray-500 text-center cursor-pointer hover:text-blue-600">
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
          </CardContent>
        </Card>
      )}

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
        totalHours={stats.totalHours}
      />
    </div>
  );
};

export default EditableMaintenanceCalendar;
