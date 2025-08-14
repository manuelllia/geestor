
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, Edit, Save, X, Download } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, addYears, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
}

interface MaintenanceEvent {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  maintenanceType: string;
  date: Date;
  duration: number; // horas
  technician?: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'programado' | 'completado' | 'en_progreso' | 'cancelado';
  notes?: string;
}

interface EditableMaintenanceCalendarProps {
  denominacionesData: DenominacionHomogeneaData[];
  frecTipoData: any[];
  onBack: () => void;
}

const EditableMaintenanceCalendar: React.FC<EditableMaintenanceCalendarProps> = ({
  denominacionesData,
  frecTipoData,
  onBack
}) => {
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<MaintenanceEvent | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const getFrequencyInDays = (frequency: string): number => {
    const freq = frequency.toLowerCase().trim();
    
    if (freq.includes('diario') || freq.includes('daily')) return 1;
    if (freq.includes('semanal') || freq.includes('weekly')) return 7;
    if (freq.includes('quincenal') || freq.includes('biweekly')) return 14;
    if (freq.includes('mensual') || freq.includes('monthly')) return 30;
    if (freq.includes('bimestral')) return 60;
    if (freq.includes('trimestral') || freq.includes('quarterly')) return 90;
    if (freq.includes('semestral') || freq.includes('biannual')) return 180;
    if (freq.includes('anual') || freq.includes('yearly') || freq.includes('annual')) return 365;
    
    // Extraer números si hay patrones como "3 meses", "6 semanas", etc.
    const numberMatch = freq.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1]);
      if (freq.includes('mes') || freq.includes('month')) return num * 30;
      if (freq.includes('semana') || freq.includes('week')) return num * 7;
      if (freq.includes('día') || freq.includes('day')) return num;
    }
    
    return 30; // Default mensual
  };

  const getDurationFromFrecTipo = (denominacion: string): number => {
    const match = frecTipoData.find(item => {
      const itemDenominacion = item.denominacion?.toLowerCase().trim() || '';
      const searchDenominacion = denominacion.toLowerCase().trim();
      return itemDenominacion.includes(searchDenominacion) || searchDenominacion.includes(itemDenominacion);
    });
    
    if (match && match.tiempo) {
      const timeStr = String(match.tiempo).trim();
      const hoursMatch = timeStr.match(/(\d+(?:\.\d+)?)/);
      if (hoursMatch) {
        return parseFloat(hoursMatch[1]);
      }
    }
    
    return 2; // Default 2 horas
  };

  const generateOptimalSchedule = () => {
    setIsGenerating(true);
    
    try {
      const newEvents: MaintenanceEvent[] = [];
      const startDate = new Date();
      let eventId = 1;
      
      // Agrupar por frecuencia para optimizar la distribución
      const frequencyGroups: { [key: number]: DenominacionHomogeneaData[] } = {};
      
      denominacionesData.forEach(item => {
        const frequencyDays = getFrequencyInDays(item.frecuencia);
        if (!frequencyGroups[frequencyDays]) {
          frequencyGroups[frequencyDays] = [];
        }
        frequencyGroups[frequencyDays].push(item);
      });

      // Generar eventos para los próximos 12 meses
      Object.entries(frequencyGroups).forEach(([freqDays, items]) => {
        const frequency = parseInt(freqDays);
        
        items.forEach((item, itemIndex) => {
          const duration = getDurationFromFrecTipo(item.denominacion);
          
          // Crear múltiples eventos según la cantidad de equipos
          for (let equipmentIndex = 0; equipmentIndex < item.cantidad; equipmentIndex++) {
            let currentDate = new Date(startDate);
            
            // Distribuir las fechas iniciales para evitar sobrecargas
            const offsetDays = (itemIndex * 2 + equipmentIndex) % frequency;
            currentDate = addDays(currentDate, offsetDays);
            
            // Generar eventos recurrentes
            for (let occurrence = 0; occurrence < Math.floor(365 / frequency); occurrence++) {
              const eventDate = addDays(currentDate, occurrence * frequency);
              
              if (eventDate <= addYears(startDate, 1)) {
                newEvents.push({
                  id: `event_${eventId++}`,
                  equipmentCode: item.codigo,
                  equipmentName: `${item.denominacion} #${equipmentIndex + 1}`,
                  maintenanceType: item.tipoMantenimiento,
                  date: eventDate,
                  duration,
                  priority: frequency <= 7 ? 'alta' : frequency <= 30 ? 'media' : 'baja',
                  status: 'programado',
                  notes: `Mantenimiento ${item.frecuencia.toLowerCase()}`
                });
              }
            }
          }
        });
      });

      // Ordenar eventos por fecha
      newEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      setEvents(newEvents);
      
      // Calcular horas totales
      const totalHrs = newEvents.reduce((sum, event) => sum + event.duration, 0);
      setTotalHours(totalHrs);
      
      console.log(`✅ Calendario generado: ${newEvents.length} eventos, ${totalHrs} horas totales`);
      
    } catch (error) {
      console.error('Error generando calendario:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateOptimalSchedule();
  }, [denominacionesData, frecTipoData]);

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getMonthEvents = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    return events.filter(event => 
      event.date >= start && event.date <= end
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'baja': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'programado': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'en_progreso': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'completado': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelado': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleSaveEvent = (eventData: Partial<MaintenanceEvent>) => {
    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setEditingEvent(null);
  };

  const monthEvents = getMonthEvents();
  const dailyHours = monthEvents.reduce((sum, event) => sum + event.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Calendario de Mantenimiento Modificable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {events.length} eventos programados • {totalHours.toFixed(1)} horas totales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generateOptimalSchedule()} disabled={isGenerating}>
            {isGenerating ? 'Generando...' : 'Regenerar Calendario'}
          </Button>
          <Button variant="outline" onClick={onBack}>
            Volver
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {monthEvents.length} eventos este mes • {dailyHours.toFixed(1)} horas
            </p>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={es}
              components={{
                Day: ({ date, ...props }) => {
                  const dayEvents = getDayEvents(date);
                  return (
                    <div {...props} className="relative">
                      <span>{date.getDate()}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full text-xs">
                            {dayEvents.length > 1 && (
                              <span className="text-white text-xs">{dayEvents.length}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Lista de eventos del día seleccionado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Eventos - {format(selectedDate, 'dd MMM yyyy', { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {getDayEvents(selectedDate).map((event) => (
              <div key={event.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.equipmentName}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.maintenanceType}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Evento de Mantenimiento</DialogTitle>
                      </DialogHeader>
                      <EventEditForm 
                        event={event}
                        onSave={handleSaveEvent}
                        onDelete={() => handleDeleteEvent(event.id)}
                        onCancel={() => setEditingEvent(null)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{event.duration}h</span>
                  <Badge className={getPriorityColor(event.priority)}>
                    {event.priority}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
            
            {getDayEvents(selectedDate).length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay eventos programados para este día
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente para editar eventos
const EventEditForm: React.FC<{
  event: MaintenanceEvent;
  onSave: (data: Partial<MaintenanceEvent>) => void;
  onDelete: () => void;
  onCancel: () => void;
}> = ({ event, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    technician: event.technician || '',
    duration: event.duration,
    priority: event.priority,
    status: event.status,
    notes: event.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Técnico Asignado</label>
        <Input
          value={formData.technician}
          onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
          placeholder="Nombre del técnico"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Duración (horas)</label>
        <Input
          type="number"
          step="0.5"
          min="0.5"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prioridad</label>
        <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="programado">Programado</SelectItem>
            <SelectItem value="en_progreso">En Progreso</SelectItem>
            <SelectItem value="completado">Completado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Notas adicionales"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="destructive" onClick={onDelete}>
          <X className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditableMaintenanceCalendar;
