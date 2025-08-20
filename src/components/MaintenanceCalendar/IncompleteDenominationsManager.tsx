
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertTriangle, Plus, Edit3, Clock, Wrench } from 'lucide-react';

interface IncompleteDenominacion {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  missingFields: string[];
  reason: string;
}

interface IncompleteDenominationsManagerProps {
  incompleteDenominaciones: IncompleteDenominacion[];
  onAddToCalendar: (incomplete: IncompleteDenominacion, updatedData: any) => void;
}

const IncompleteDenominationsManager: React.FC<IncompleteDenominationsManagerProps> = ({
  incompleteDenominaciones,
  onAddToCalendar
}) => {
  const [selectedItem, setSelectedItem] = useState<IncompleteDenominacion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    frecuencia: '',
    tipoMantenimiento: '',
    tiempo: '2'
  });

  const handleEditItem = (item: IncompleteDenominacion) => {
    setSelectedItem(item);
    setFormData({
      frecuencia: item.frecuencia || '',
      tipoMantenimiento: item.tipoMantenimiento || '',
      tiempo: '2'
    });
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!selectedItem) return;

    const updatedData = {
      frecuencia: formData.frecuencia,
      tipoMantenimiento: formData.tipoMantenimiento,
      tiempo: formData.tiempo
    };

    onAddToCalendar(selectedItem, updatedData);
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const frequencyOptions = [
    { value: 'mensual', label: 'Mensual (30 días)' },
    { value: 'trimestral', label: 'Trimestral (90 días)' },
    { value: 'semestral', label: 'Semestral (180 días)' },
    { value: 'anual', label: 'Anual (365 días)' },
    { value: 'semanal', label: 'Semanal (7 días)' },
    { value: 'quincenal', label: 'Quincenal (15 días)' }
  ];

  const maintenanceTypes = [
    { value: 'preventivo', label: 'Mantenimiento Preventivo' },
    { value: 'correctivo', label: 'Mantenimiento Correctivo' },
    { value: 'predictivo', label: 'Mantenimiento Predictivo' },
    { value: 'calibracion', label: 'Calibración' },
    { value: 'verificacion', label: 'Verificación' },
    { value: 'inspeccion', label: 'Inspección' }
  ];

  if (incompleteDenominaciones.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5" />
            Denominaciones Pendientes ({incompleteDenominaciones.length})
          </CardTitle>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Estas denominaciones necesitan información adicional antes de ser programadas
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incompleteDenominaciones.map((item) => (
              <div
                key={item.codigo}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.denominacion}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {item.cantidad} equipos
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Código: {item.codigo}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span className={item.missingFields.includes('Frecuencia') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                        {item.frecuencia || 'Sin frecuencia'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wrench className="h-3 w-3 text-amber-500" />
                      <span className={item.missingFields.includes('Tipo de Mantenimiento') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                        {item.tipoMantenimiento || 'Sin tipo'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleEditItem(item)}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Completar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Completar Información
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-1">{selectedItem.denominacion}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedItem.cantidad} equipos • Código: {selectedItem.codigo}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Frecuencia de Mantenimiento *
                  </label>
                  <Select value={formData.frecuencia} onValueChange={(value) => setFormData(prev => ({ ...prev, frecuencia: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo de Mantenimiento *
                  </label>
                  <Select value={formData.tipoMantenimiento} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoMantenimiento: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {maintenanceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tiempo Estimado (horas)
                  </label>
                  <Input
                    type="number"
                    value={formData.tiempo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiempo: e.target.value }))}
                    min="0.5"
                    max="8"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSaveItem}
                  disabled={!formData.frecuencia || !formData.tipoMantenimiento}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar al Calendario
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncompleteDenominationsManager;
