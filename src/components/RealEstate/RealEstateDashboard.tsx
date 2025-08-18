
import React, { useState, useEffect } from 'react';
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
  FileSpreadsheet,
  Bed,
  List
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  getPropertyCounts, 
  getAnnualCostData, 
  getProvinceActivityData,
  PropertyCounts,
  AnnualCostData,
  ProvinceActivityData 
} from '../../services/realEstateService';
import { useExportToPDF } from '../../hooks/useExportToPDF';
import SpainProvinceMap from './SpainProvinceMap';

interface RealEstateDashboardProps {
  language: Language;
  onImportData: () => void;
  onViewTables: () => void;
}

const RealEstateDashboard: React.FC<RealEstateDashboardProps> = ({ 
  language, 
  onImportData,
  onViewTables 
}) => {
  const { t } = useTranslation(language);
  const { exportDashboardToPDF } = useExportToPDF();
  const [chartView, setChartView] = useState<'total' | 'autonomous'>('total');
  const [loading, setLoading] = useState(true);
  const [propertyCounts, setPropertyCounts] = useState<PropertyCounts>({ active: 0, inactive: 0, total: 0, totalRooms: 0 });
  const [annualCostData, setAnnualCostData] = useState<AnnualCostData>({ totalCost: 0, byProvince: {} });
  const [provinceActivity, setProvinceActivity] = useState<ProvinceActivityData>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [counts, costData, activityData] = await Promise.all([
          getPropertyCounts(),
          getAnnualCostData(),
          getProvinceActivityData()
        ]);

        setPropertyCounts(counts);
        setAnnualCostData(costData);
        setProvinceActivity(activityData);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleExport = () => {
    console.log('Exportando dashboard a PDF...');
    exportDashboardToPDF({
      propertyCounts,
      annualCostData,
      provinceActivity
    });
  };

  const hasData = propertyCounts.total > 0;

  // Preparar datos para la gráfica
  const chartData = React.useMemo(() => {
    if (!hasData) return [];

    if (chartView === 'total') {
      return [{
        name: 'Coste Total',
        value: annualCostData.totalCost
      }];
    } else {
      return Object.entries(annualCostData.byProvince).map(([province, cost]) => ({
        name: province,
        value: cost
      }));
    }
  }, [chartView, annualCostData, hasData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-dashboard="real-estate">
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
            onClick={onViewTables}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <List className="w-4 h-4 mr-2" />
            Ver Tablas
          </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pisos Activos
            </CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {hasData ? propertyCounts.active.toLocaleString() : 'DATA NOT FOUND'}
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
              {hasData ? propertyCounts.inactive.toLocaleString() : 'DATA NOT FOUND'}
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
              {hasData ? propertyCounts.total.toLocaleString() : 'DATA NOT FOUND'}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Inventario completo
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Habitaciones
            </CardTitle>
            <Bed className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {hasData ? propertyCounts.totalRooms.toLocaleString() : 'DATA NOT FOUND'}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Suma de todas las habitaciones
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
                {hasData && (
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                    (€{annualCostData.totalCost.toLocaleString()})
                  </span>
                )}
              </CardTitle>
              <Select value={chartView} onValueChange={(value: 'total' | 'autonomous') => setChartView(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total General</SelectItem>
                  <SelectItem value="autonomous">Por Provincias</SelectItem>
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
                  <Tooltip 
                    formatter={(value) => [`€${Number(value).toLocaleString()}`, 'Coste']}
                  />
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
              Mapa de Actividad por Provincias
              {hasData && (
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  ({Object.keys(provinceActivity).length} provincias)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpainProvinceMap 
              provinceActivity={provinceActivity} 
              hasData={hasData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateDashboard;
