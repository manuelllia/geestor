
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

interface MaintenanceEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MaintenanceEvent | null;
  denominaciones: DenominacionHomogeneaData[];
  onSave: (eventData: Partial<MaintenanceEvent>) => void;
  onDelete?: () => void;
}

const MaintenanceEventModal: React.FC<MaintenanceEventModalProps> = ({
  isOpen,
  onClose,
  event,
  denominaciones,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<MaintenanceEvent>>({});
  const [selectedDenominacion, setSelectedDenominacion] = useState<DenominacionHomogeneaData | null>(null);

  useEffect(() => {
    if (event) {
      setFormData(event);
      const denominacion = denominaciones.find(d => d.codigo === event.codigo);
      setSelectedDenominacion(denominacion || null);
    } else {
      setFormData({
        denominacion: '',
        codigo: '',
        tipoMantenimiento: 'Preventivo',
        fecha: new Date(),
        tiempo: 2,
        cantidad: 1,
        equipos: [],
        estado: 'programado',
        prioridad: 'media',
        notas: '',
        tecnico: ''
      });
      setSelectedDenominacion(null);
    }
  }, [event, denominaciones]);

  const handleDenominacionChange = (codigoDenominacion: string) => {
    const denominacion = denominaciones.find(d => d.codigo === codigoDenominacion);
    if (denominacion) {
      setSelectedDenominacion(denominacion);
      
      // Parsear tiempo de mantenimiento
      let tiempoHoras = 2;
      if (denominacion.tiempo) {
        const tiempoMatch = denominacion.tiempo.match(/(\d+)/);
        if (tiempoMatch) {
          tiempoHoras = parseInt(tiempoMatch[1]);
        }
      }

      setFormData(prev => ({
        ...prev,
        denominacion: denominacion.denominacion,
        codigo: denominacion.codigo,
        tipoMantenimiento: denominacion.tipoMantenimiento,
        tiempo: tiempoHoras,
        cantidad: denominacion.cantidad,
        equipos: Array.from({ length: denominacion.cantidad }, (_, i) => 
          `${denominacion.denominacion} #${i + 1}`
        )
      }));
    }
  };

  const handleInputChange = (field: keyof MaintenanceEvent, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquiposChange = (equipos: string) => {
    const equiposArray = equipos.split('\n').filter(equipo => equipo.trim() !== '');
    setFormData(prev => ({
      ...prev,
      equipos: equiposArray,
      cantidad: equiposArray.length
    }));
  };

  const handleSave = () => {
    if (formData.denominacion && formData.fecha) {
      onSave(formData);
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event ? 'Editar Evento de Mantenimiento' : 'Nuevo Evento de Mantenimiento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selección de denominación */}
          <div className="space-y-2">
            <Label htmlFor="denominacion-select">Denominación Homogénea</Label>
            <Select
              value={formData.codigo || ''}
              onValueChange={handleDenominacionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar denominación..." />
              </SelectTrigger>
              <SelectContent>
                {denominaciones.map(denominacion => (
                  <SelectItem key={denominacion.codigo} value={denominacion.codigo}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {denominacion.codigo}
                      </Badge>
                      <span>{denominacion.denominacion}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="denominacion">Denominación</Label>
              <Input
                id="denominacion"
                value={formData.denominacion || ''}
                onChange={(e) => handleInputChange('denominacion', e.target.value)}
                placeholder="Denominación del equipo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo || ''}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Código del equipo"
              />
            </div>
          </div>

          {/* Fecha y tiempo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">📅 Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha ? format(formData.fecha, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleInputChange('fecha', new Date(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiempo" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Tiempo (horas)
              </Label>
              <Input
                id="tiempo"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.tiempo || 2}
                onChange={(e) => handleInputChange('tiempo', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Tipo y prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Mantenimiento</Label>
              <Select
                value={formData.tipoMantenimiento || 'Preventivo'}
                onValueChange={(value) => handleInputChange('tipoMantenimiento', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventivo">Preventivo</SelectItem>
                  <SelectItem value="Correctivo">Correctivo</SelectItem>
                  <SelectItem value="Calibración">Calibración</SelectItem>
                  <SelectItem value="Verificación">Verificación</SelectItem>
                  <SelectItem value="Inspección">Inspección</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select
                value={formData.prioridad || 'media'}
                onValueChange={(value) => handleInputChange('prioridad', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">
                    <Badge className={getPriorityColor('baja')}>Baja</Badge>
                  </SelectItem>
                  <SelectItem value="media">
                    <Badge className={getPriorityColor('media')}>Media</Badge>
                  </SelectItem>
                  <SelectItem value="alta">
                    <Badge className={getPriorityColor('alta')}>Alta</Badge>
                  </SelectItem>
                  <SelectItem value="critica">
                    <Badge className={getPriorityColor('critica')}>Crítica</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estado y técnico */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado || 'programado'}
                onValueChange={(value) => handleInputChange('estado', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programado">
                    <Badge className={getStatusColor('programado')}>Programado</Badge>
                  </SelectItem>
                  <SelectItem value="en-progreso">
                    <Badge className={getStatusColor('en-progreso')}>En Progreso</Badge>
                  </SelectItem>
                  <SelectItem value="completado">
                    <Badge className={getStatusColor('completado')}>Completado</Badge>
                  </SelectItem>
                  <SelectItem value="pendiente">
                    <Badge className={getStatusColor('pendiente')}>Pendiente</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tecnico" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Técnico Asignado
              </Label>
              <Input
                id="tecnico"
                value={formData.tecnico || ''}
                onChange={(e) => handleInputChange('tecnico', e.target.value)}
                placeholder="Nombre del técnico"
              />
            </div>
          </div>

          {/* Equipos */}
          <div className="space-y-2">
            <Label htmlFor="equipos" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Equipos ({formData.equipos?.length || 0})
            </Label>
            <Textarea
              id="equipos"
              rows={4}
              value={formData.equipos?.join('\n') || ''}
              onChange={(e) => handleEquiposChange(e.target.value)}
              placeholder="Un equipo por línea&#10;Ejemplo:&#10;Ventilador Mecánico #1&#10;Ventilador Mecánico #2"
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Textarea
              id="notas"
              rows={3}
              value={formData.notas || ''}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              placeholder="Notas adicionales sobre el mantenimiento..."
            />
          </div>

          {/* Resumen */}
          {formData.tiempo && formData.cantidad && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Resumen de Tiempo
                </span>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p>
                  <strong>Tiempo por equipo:</strong> {formData.tiempo} horas
                </p>
                <p>
                  <strong>Cantidad de equipos:</strong> {formData.equipos?.length || formData.cantidad || 0}
                </p>
                <p>
                  <strong>Tiempo total estimado:</strong> {(formData.tiempo || 0) * (formData.equipos?.length || formData.cantidad || 0)} horas
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {event ? 'Guardar Cambios' : 'Crear Evento'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceEventModal;
