
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft, ChevronRight, Calendar, Edit, Save, X, Download } from 'lucide-react';

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

interface EditableDenominacion extends DenominacionHomogeneaData {
  isEditing?: boolean;
  editedFrecuencia?: string;
  editedTipoMantenimiento?: string;
  editedTiempo?: string;
}

interface DenominacionesEditableTableProps {
  denominaciones: DenominacionHomogeneaData[];
  onUpdateDenominaciones: (updated: DenominacionHomogeneaData[]) => void;
  onGenerateCalendar: () => void;
  isGenerating?: boolean;
}

const ITEMS_PER_PAGE = 50;

const DenominacionesEditableTable: React.FC<DenominacionesEditableTableProps> = ({ 
  denominaciones, 
  onUpdateDenominaciones,
  onGenerateCalendar,
  isGenerating = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editableDenominaciones, setEditableDenominaciones] = useState<EditableDenominacion[]>(
    denominaciones.map(d => ({ ...d, isEditing: false }))
  );
  
  const totalPages = Math.ceil(editableDenominaciones.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = editableDenominaciones.slice(startIndex, endIndex);

  const frecuenciaOptions = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'quincenal', label: 'Quincenal' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'bimensual', label: 'Bimensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'cuatrimestral', label: 'Cuatrimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' }
  ];

  const tipoMantenimientoOptions = [
    { value: 'preventivo', label: 'Preventivo' },
    { value: 'correctivo', label: 'Correctivo' },
    { value: 'predictivo', label: 'Predictivo' },
    { value: 'calibracion', label: 'Calibración' },
    { value: 'verificacion', label: 'Verificación' },
    { value: 'inspeccion', label: 'Inspección' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'revision', label: 'Revisión' }
  ];

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEdit = (index: number) => {
    const globalIndex = startIndex + index;
    setEditableDenominaciones(prev => prev.map((item, i) => 
      i === globalIndex 
        ? { 
            ...item, 
            isEditing: true,
            editedFrecuencia: item.frecuencia,
            editedTipoMantenimiento: item.tipoMantenimiento,
            editedTiempo: item.tiempo || '2'
          }
        : item
    ));
  };

  const handleSave = (index: number) => {
    const globalIndex = startIndex + index;
    setEditableDenominaciones(prev => {
      const updated = prev.map((item, i) => 
        i === globalIndex 
          ? { 
              ...item, 
              isEditing: false,
              frecuencia: item.editedFrecuencia || item.frecuencia,
              tipoMantenimiento: item.editedTipoMantenimiento || item.tipoMantenimiento,
              tiempo: item.editedTiempo || item.tiempo
            }
          : item
      );
      
      // Actualizar las denominaciones originales
      const updatedOriginal = updated.map(({ isEditing, editedFrecuencia, editedTipoMantenimiento, editedTiempo, ...rest }) => rest);
      onUpdateDenominaciones(updatedOriginal);
      
      return updated;
    });
  };

  const handleCancel = (index: number) => {
    const globalIndex = startIndex + index;
    setEditableDenominaciones(prev => prev.map((item, i) => 
      i === globalIndex 
        ? { ...item, isEditing: false }
        : item
    ));
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const globalIndex = startIndex + index;
    setEditableDenominaciones(prev => prev.map((item, i) => 
      i === globalIndex 
        ? { ...item, [`edited${field.charAt(0).toUpperCase() + field.slice(1)}`]: value }
        : item
    ));
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plan_mantenimiento_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVContent = () => {
    const headers = [
      'NOMBRE EQUIPO',
      'Nº DE EQUIPOS',
      'TIPO DE MANTENIMIENTO',
      'HORA POR MANTENIMIENTO',
      'TOTAL HORAS',
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];

    const rows = editableDenominaciones.map(denom => {
      const tiempoPorMantenimiento = parseFloat(denom.tiempo || '2');
      const totalHoras = denom.cantidad * tiempoPorMantenimiento;
      
      // Calcular distribución mensual según frecuencia
      const monthlyHours = calculateMonthlyDistribution(denom.frecuencia, totalHoras, denom.denominacion);

      return [
        denom.denominacion,
        denom.cantidad,
        denom.tipoMantenimiento,
        tiempoPorMantenimiento,
        totalHoras,
        ...monthlyHours
      ];
    });

    const csvRows = [headers, ...rows];
    return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const calculateMonthlyDistribution = (frecuencia: string, totalHoras: number, equipoNombre: string) => {
    const months = Array(12).fill(0);
    const freq = frecuencia.toLowerCase();

    if (freq.includes('mensual')) {
      // Distribución uniforme mensual
      const horasPorMes = totalHoras / 12;
      return months.map(() => Math.round(horasPorMes * 100) / 100);
    } else if (freq.includes('trimestral')) {
      // 4 veces al año (cada 3 meses)
      const horasPorTrimestre = totalHoras / 4;
      months[2] = horasPorTrimestre; // Marzo
      months[5] = horasPorTrimestre; // Junio
      months[8] = horasPorTrimestre; // Septiembre
      months[11] = horasPorTrimestre; // Diciembre
    } else if (freq.includes('semestral')) {
      // 2 veces al año
      const horasPorSemestre = totalHoras / 2;
      
      // Lógica inteligente según tipo de equipo
      if (equipoNombre.toLowerCase().includes('frigorifico') || 
          equipoNombre.toLowerCase().includes('frio') ||
          equipoNombre.toLowerCase().includes('refriger')) {
        // Equipos de frío: mantenimiento antes del verano
        months[3] = horasPorSemestre; // Abril
        months[9] = horasPorSemestre; // Octubre
      } else if (equipoNombre.toLowerCase().includes('quirofano') ||
                 equipoNombre.toLowerCase().includes('cirugia') ||
                 equipoNombre.toLowerCase().includes('quirurgic')) {
        // Equipos quirúrgicos: mantenimiento en verano
        months[6] = horasPorSemestre; // Julio
        months[7] = horasPorSemestre; // Agosto
      } else {
        // Distribución estándar
        months[5] = horasPorSemestre; // Junio
        months[11] = horasPorSemestre; // Diciembre
      }
    } else if (freq.includes('anual')) {
      // Una vez al año
      if (equipoNombre.toLowerCase().includes('quirofano') ||
          equipoNombre.toLowerCase().includes('cirugia')) {
        months[7] = totalHoras; // Agosto para quirófanos
      } else if (equipoNombre.toLowerCase().includes('frigorifico') ||
                 equipoNombre.toLowerCase().includes('frio')) {
        months[3] = totalHoras; // Abril para equipos de frío
      } else {
        months[5] = totalHoras; // Junio por defecto
      }
    } else {
      // Distribución uniforme por defecto
      const horasPorMes = totalHoras / 12;
      return months.map(() => Math.round(horasPorMes * 100) / 100);
    }

    return months.map(h => Math.round(h * 100) / 100);
  };

  const getFrecuenciaColor = (frecuencia: string) => {
    const freq = frecuencia.toLowerCase();
    if (freq.includes('mensual')) return 'bg-red-100 text-red-800 border-red-200';
    if (freq.includes('trimestral')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (freq.includes('semestral')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (freq.includes('anual')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTipoMantenimientoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('preventivo')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (tipoLower.includes('correctivo')) return 'bg-red-100 text-red-800 border-red-200';
    if (tipoLower.includes('calibración')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (tipoLower.includes('verificación')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            📊 Análisis de Denominaciones Homogéneas - Editable
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={downloadCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar CSV
            </Button>
            <Button
              onClick={onGenerateCalendar}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              size="lg"
              disabled={isGenerating}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Generar Calendario Modificable'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Mostrando {startIndex + 1}-{Math.min(endIndex, editableDenominaciones.length)} de {editableDenominaciones.length} denominaciones
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Código</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Denominación</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Frecuencia</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Tiempo (h)</th>
                  <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr 
                    key={`${item.codigo}-${index}`}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-3">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {item.codigo}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {item.denominacion}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.cantidad}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {item.isEditing ? (
                        <Select
                          value={item.editedFrecuencia || item.frecuencia}
                          onValueChange={(value) => handleFieldChange(index, 'frecuencia', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {frecuenciaOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
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
                      {item.isEditing ? (
                        <Select
                          value={item.editedTipoMantenimiento || item.tipoMantenimiento}
                          onValueChange={(value) => handleFieldChange(index, 'tipoMantenimiento', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tipoMantenimientoOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getTipoMantenimientoColor(item.tipoMantenimiento)}>
                          {item.tipoMantenimiento}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.isEditing ? (
                        <Input
                          type="number"
                          value={item.editedTiempo || item.tiempo || '2'}
                          onChange={(e) => handleFieldChange(index, 'tiempo', e.target.value)}
                          className="w-16 text-center"
                          min="1"
                          max="8"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.tiempo || '2'}h
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.isEditing ? (
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            onClick={() => handleSave(index)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DenominacionesEditableTable;
