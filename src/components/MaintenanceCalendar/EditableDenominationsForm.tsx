
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Pencil, Check, X, AlertCircle } from 'lucide-react';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

interface EditableDenominationsFormProps {
  denominaciones: DenominacionHomogeneaData[];
  frecuenciaOptions: string[];
  tipoOptions: string[];
  onUpdate: (updatedDenominaciones: DenominacionHomogeneaData[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const EditableDenominationsForm: React.FC<EditableDenominationsFormProps> = ({
  denominaciones,
  frecuenciaOptions,
  tipoOptions,
  onUpdate,
  onGenerate,
  isGenerating
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<Partial<DenominacionHomogeneaData>>({});

  const incompleteDenominaciones = denominaciones.filter(d => 
    !d.frecuencia || d.frecuencia === 'No especificada' || 
    !d.tipoMantenimiento || d.tipoMantenimiento === 'No especificado' ||
    !d.tiempo || d.tiempo === 'No especificado'
  );

  const completeDenominaciones = denominaciones.filter(d => 
    d.frecuencia && d.frecuencia !== 'No especificada' && 
    d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado' &&
    d.tiempo && d.tiempo !== 'No especificado'
  );

  const startEdit = (index: number, denominacion: DenominacionHomogeneaData) => {
    setEditingIndex(index);
    setTempValues({ ...denominacion });
  };

  const saveEdit = () => {
    if (editingIndex !== null && tempValues) {
      const updated = [...denominaciones];
      updated[editingIndex] = { ...updated[editingIndex], ...tempValues };
      onUpdate(updated);
      setEditingIndex(null);
      setTempValues({});
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setTempValues({});
  };

  const getFrecuenciaColor = (frecuencia: string) => {
    const freq = frecuencia.toLowerCase();
    if (freq.includes('mensual')) return 'bg-red-100 text-red-800 border-red-200';
    if (freq.includes('trimestral')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (freq.includes('semestral')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (freq.includes('anual')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('preventivo')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (tipoLower.includes('correctivo')) return 'bg-red-100 text-red-800 border-red-200';
    if (tipoLower.includes('calibración')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Denominaciones incompletas */}
      {incompleteDenominaciones.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertCircle className="h-5 w-5" />
              Denominaciones Incompletas ({incompleteDenominaciones.length})
            </CardTitle>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Estas denominaciones necesitan completarse manualmente antes de generar el calendario
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Código</th>
                    <th className="text-left p-3">Denominación</th>
                    <th className="text-center p-3">Cantidad</th>
                    <th className="text-center p-3">Frecuencia</th>
                    <th className="text-center p-3">Tipo</th>
                    <th className="text-center p-3">Tiempo (h)</th>
                    <th className="text-center p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {incompleteDenominaciones.map((item, globalIndex) => {
                    const actualIndex = denominaciones.findIndex(d => d.codigo === item.codigo);
                    const isEditing = editingIndex === actualIndex;
                    
                    return (
                      <tr key={item.codigo} className="border-b hover:bg-amber-100/50 dark:hover:bg-amber-900/30">
                        <td className="p-3">
                          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {item.codigo}
                          </span>
                        </td>
                        <td className="p-3">{item.denominacion}</td>
                        <td className="p-3 text-center">{item.cantidad}</td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <Select 
                              value={tempValues.frecuencia || ''} 
                              onValueChange={(value) => setTempValues(prev => ({...prev, frecuencia: value}))}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {frecuenciaOptions.map(option => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getFrecuenciaColor(item.frecuencia)}>
                              {item.frecuencia}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <Select 
                              value={tempValues.tipoMantenimiento || ''} 
                              onValueChange={(value) => setTempValues(prev => ({...prev, tipoMantenimiento: value}))}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {tipoOptions.map(option => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getTipoColor(item.tipoMantenimiento)}>
                              {item.tipoMantenimiento}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <Input
                              type="number"
                              min="1"
                              max="8"
                              value={tempValues.tiempo || ''}
                              onChange={(e) => setTempValues(prev => ({...prev, tiempo: e.target.value}))}
                              className="w-20"
                              placeholder="h"
                            />
                          ) : (
                            <span>{item.tiempo || 'No especificado'}</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex gap-1 justify-center">
                              <Button size="sm" variant="outline" onClick={saveEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => startEdit(actualIndex, item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Denominaciones completas */}
      {completeDenominaciones.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Check className="h-5 w-5" />
              Denominaciones Completas ({completeDenominaciones.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-700 dark:text-green-300 mb-4">
              Estas denominaciones están listas para generar el calendario de mantenimiento
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón para generar calendario */}
      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          disabled={incompleteDenominaciones.length > 0 || isGenerating}
          size="lg"
          className={`${
            incompleteDenominaciones.length === 0 && !isGenerating
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white font-semibold px-8 py-3`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Generando calendario...
            </div>
          ) : incompleteDenominaciones.length > 0 ? (
            `Completa ${incompleteDenominaciones.length} denominaciones pendientes`
          ) : (
            'Generar Calendario Modificable'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditableDenominationsForm;
