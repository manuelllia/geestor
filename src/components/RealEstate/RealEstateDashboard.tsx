
// src/components/RealEstate/RealEstateDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, Building2, Home, DollarSign, Activity, Bed, Plus } from 'lucide-react'; // Importa Plus icon
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getPropertyCounts, getAnnualCostData, getProvinceActivityData, ProvinceActivityData } from '../../services/realEstateService';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { Button } from '@/components/ui/button';
import TopProvincesChart from './TopProvincesChart';

interface RealEstateDashboardProps {
  language: Language;
  onImportData: () => void;
  onViewTables: () => void;
  onAddProperty?: () => void; // ¡NUEVO PROP! Opcional
}

const RealEstateDashboard: React.FC<RealEstateDashboardProps> = ({ 
  language, 
  onImportData, 
  onViewTables,
  onAddProperty // ¡DESESTRUCTURAR EL NUEVO PROP!
}) => {
  const { t } = useTranslation(language);
  const [propertyCounts, setPropertyCounts] = useState({ active: 0, inactive: 0, total: 0, totalRooms: 0 });
  const [costData, setCostData] = useState({ totalCost: 0, byProvince: {} });
  const [provinceActivity, setProvinceActivity] = useState<ProvinceActivityData>({});
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar datos en paralelo
        const [counts, costs, activity] = await Promise.all([
          getPropertyCounts(),
          getAnnualCostData(),
          getProvinceActivityData()
        ]);

        console.log('📊 Datos cargados del dashboard:', { counts, costs, activity });

        setPropertyCounts(counts);
        setCostData(costs);
        setProvinceActivity(activity);
        setHasData(Object.keys(activity).length > 0 || counts.total > 0);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const costChartData = Object.entries(costData.byProvince).map(([provincia, coste]) => ({
    provincia,
    coste: Math.round(Number(coste))
  }));

  const propertyStatusData = [
    { name: t('activeProperties'), value: propertyCounts.active, color: '#3B82F6' },
    { name: t('inactiveProperties'), value: propertyCounts.inactive, color: '#EF4444' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, { // Usar 'language' para formato correcto
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    const suffix = language === 'es' ? '€' : '€'; // Puedes cambiar esto si tienes más monedas
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k${suffix}`;
    }
    return `${value}${suffix}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 min-h-screen p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="animate-pulse">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 min-h-screen p-2 sm:p-4 lg:p-6">
      {/* Header responsive */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {t('realEstateDashboard')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Gestión completa de propiedades inmobiliarias
          </p>
        </div>
        {/* Contenedor de botones - adaptado para 3 botones */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          {/* NUEVO BOTÓN: Agregar Inmueble */}
          {onAddProperty && (
            <Button
              onClick={onAddProperty}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 lg:px-6 py-2 rounded-lg shadow-lg text-sm sm:text-base flex items-center justify-center"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Agregar Inmueble
            </Button>
          )}

          <Button 
            onClick={onImportData} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 lg:px-6 py-2 rounded-lg shadow-lg text-sm sm:text-base flex items-center justify-center"
          >
            Importar Datos
          </Button>
          <Button 
            onClick={onViewTables}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 sm:px-4 lg:px-6 py-2 rounded-lg text-sm sm:text-base flex items-center justify-center"
          >
            {t('viewTables')}
          </Button>
        </div>
      </div>

      {/* KPI Cards responsive - 2x3 en mobile, 2x3 en tablet, 3x2 en desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1 truncate">
                  {t('activeProperties')}
                </p>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                  {propertyCounts.active.toLocaleString(language)}
                </div>
                <p className="text-blue-200 text-xs mt-1 truncate">
                  Propiedades operativas
                </p>
              </div>
              <div className="bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-full ml-2 flex-shrink-0">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-red-100 text-xs sm:text-sm font-medium mb-1 truncate">
                  {t('inactiveProperties')}
                </p>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                  {propertyCounts.inactive.toLocaleString(language)}
                </div>
                <p className="text-red-200 text-xs mt-1 truncate">
                  Propiedades pausadas
                </p>
              </div>
              <div className="bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-full ml-2 flex-shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white col-span-2 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-green-100 text-xs sm:text-sm font-medium mb-1 truncate">
                  {t('totalProperties')}
                </p>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                  {propertyCounts.total.toLocaleString(language)}
                </div>
                <p className="text-green-200 text-xs mt-1 truncate">
                  Total del portafolio
                </p>
              </div>
              <div className="bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-full ml-2 flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-orange-100 text-xs sm:text-sm font-medium mb-1 truncate">
                  Total Habitaciones
                </p>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                  {propertyCounts.totalRooms.toLocaleString(language)}
                </div>
                <p className="text-orange-200 text-xs mt-1 truncate">
                  Habitaciones disponibles
                </p>
              </div>
              <div className="bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-full ml-2 flex-shrink-0">
                <Bed className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1 truncate">
                  Coste Anual Total
                </p>
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold leading-tight break-words">
                  {formatCurrencyCompact(costData.totalCost)}
                </div>
                <p className="text-purple-200 text-xs mt-1 truncate">
                  Gastos operativos
                </p>
              </div>
              <div className="bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-full ml-2 flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-teal-100 text-xs sm:text-sm font-medium mb-1 truncate">
                  Coste Promedio
                </p>
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold leading-tight break-words">
                  {propertyCounts.total > 0 ? formatCurrencyCompact(costData.totalCost / propertyCounts.total) : '0€'}
                </div>
                <p className="text-teal-200 text-xs mt-1 truncate">
                  Por propiedad
                </p>
              </div>
              <div className="bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-full ml-2 flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Coste Anual por Provincia */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <BarChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Coste Anual por Provincia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costChartData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="provincia" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={8}
                    stroke="#666"
                    interval={0}
                  />
                  <YAxis 
                    fontSize={8}
                    stroke="#666"
                    tickFormatter={(value) => formatCurrencyCompact(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), t('annualCost')]}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="coste" 
                    fill="url(#blueGradient)" 
                    radius={[4, 4, 0, 0]}
                    stroke="#3B82F6"
                    strokeWidth={1}
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Estado de Propiedades */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              Estado de Propiedades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="h-[250px] sm:h-[300px] lg:h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(language), 'Propiedades']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-3 sm:space-x-6 mt-4">
              {propertyStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {item.name}: {item.value.toLocaleString(language)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Top Provincias */}
      <TopProvincesChart 
        provinceActivity={provinceActivity}
        hasData={hasData}
      />
    </div>
  );
};

export default RealEstateDashboard;
