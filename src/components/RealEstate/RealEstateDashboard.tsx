
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, MapPin, Building2, Home, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getPropertyCounts, getAnnualCostData, getProvinceActivityData, ProvinceActivityData } from '../../services/realEstateService';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { Button } from '@/components/ui/button';
import SpainProvinceMapSVG from './SpainProvinceMapSVG';

interface RealEstateDashboardProps {
  language: Language;
  onImportData: () => void;
  onViewTables: () => void;
}

const RealEstateDashboard: React.FC<RealEstateDashboardProps> = ({ language, onImportData, onViewTables }) => {
  const { t } = useTranslation(language);
  const [propertyCounts, setPropertyCounts] = useState({ active: 0, inactive: 0, total: 0, totalRooms: 0 });
  const [costData, setCostData] = useState({ totalCost: 0, byProvince: {} });
  const [provinceActivity, setProvinceActivity] = useState<ProvinceActivityData>({});
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = await getPropertyCounts();
      setPropertyCounts(counts);
    };

    const fetchCostData = async () => {
      const data = await getAnnualCostData();
      setCostData(data);
    };

    const fetchProvinceActivity = async () => {
      const data = await getProvinceActivityData();
      setProvinceActivity(data);
      setHasData(Object.keys(data).length > 0);
    };

    fetchCounts();
    fetchCostData();
    fetchProvinceActivity();
  }, []);

  const costChartData = Object.entries(costData.byProvince).map(([provincia, coste]) => ({
    provincia,
    coste: Math.round(Number(coste))
  }));

  const propertyStatusData = [
    { name: 'Activas', value: propertyCounts.active, color: '#3B82F6' },
    { name: 'Inactivas', value: propertyCounts.inactive, color: '#EF4444' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormatResult('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 min-h-screen p-6">
      {/* Header con estilo Power BI */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('realEstateDashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Panel de control de gestión inmobiliaria
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={onImportData} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            Importar Datos
          </Button>
          <Button 
            onClick={onViewTables}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg"
          >
            Ver Tablas
          </Button>
        </div>
      </div>

      {/* KPI Cards con iconos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  {t('activeProperties')}
                </p>
                <div className="text-3xl font-bold">
                  {propertyCounts.active.toLocaleString()}
                </div>
                <p className="text-blue-200 text-xs mt-1">
                  Propiedades operativas
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Home className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">
                  {t('inactiveProperties')}
                </p>
                <div className="text-3xl font-bold">
                  {propertyCounts.inactive.toLocaleString()}
                </div>
                <p className="text-red-200 text-xs mt-1">
                  Propiedades en pausa
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  {t('totalProperties')}
                </p>
                <div className="text-3xl font-bold">
                  {propertyCounts.total.toLocaleString()}
                </div>
                <p className="text-green-200 text-xs mt-1">
                  Total del portafolio
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Coste Anual Total
                </p>
                <div className="text-3xl font-bold">
                  €{costData.totalCost.toLocaleString()}
                </div>
                <p className="text-purple-200 text-xs mt-1">
                  Gastos operativos
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Coste Anual por Provincia */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-blue-600" />
              Coste Anual por Provincia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="provincia" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                    stroke="#666"
                  />
                  <YAxis 
                    fontSize={12}
                    stroke="#666"
                    tickFormatter={(value) => `€${(value / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, 'Coste Anual']}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Estado de Propiedades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Propiedades']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {propertyStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name}: {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de Actividad */}
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Mapa de Actividad por Provincias
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <SpainProvinceMapSVG 
            provinceActivity={provinceActivity}
            hasData={hasData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateDashboard;
