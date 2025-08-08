
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  Upload, 
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealEstateDashboardProps {
  language: Language;
  onImportData: () => void;
}

const RealEstateDashboard: React.FC<RealEstateDashboardProps> = ({ 
  language, 
  onImportData 
}) => {
  const { t } = useTranslation(language);
  const [chartView, setChartView] = useState<'total' | 'autonomous'>('total');

  // Datos vacíos para mostrar "DATA NOT FOUND"
  const activePisos = 0;
  const bajaPisos = 0;
  const hasData = false;

  const handleExport = () => {
    console.log('Exportando datos...');
    // Implementación futura para exportar datos
  };

  const chartData = hasData ? [] : [
    { name: 'Datos', value: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Gestión de Inmuebles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Dashboard de control de propiedades
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onImportData}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pisos Activos
            </CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {hasData ? activePisos : 'DATA NOT FOUND'}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Propiedades en uso
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pisos de Baja
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {hasData ? bajaPisos : 'DATA NOT FOUND'}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Propiedades desactivadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Propiedades
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {hasData ? (activePisos + bajaPisos) : 'DATA NOT FOUND'}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Inventario completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica y Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de costes */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Costes Anuales
              </CardTitle>
              <Select value={chartView} onValueChange={(value: 'total' | 'autonomous') => setChartView(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total General</SelectItem>
                  <SelectItem value="autonomous">Por Comunidades</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">DATA NOT FOUND</p>
                  <p className="text-gray-400 text-sm">Importa datos para ver gráficas</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mapa de España */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa de Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <div className="h-[300px] bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                {/* Aquí iría el mapa de España con los círculos de actividad */}
                <p className="text-blue-600 dark:text-blue-400">Mapa de España con actividad</p>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">DATA NOT FOUND</p>
                  <p className="text-gray-400 text-sm">Importa datos para ver ubicaciones</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateDashboard;
