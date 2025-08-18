
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MapPin } from 'lucide-react';
import { ProvinceActivityData } from '../../services/realEstateService';

interface TopProvincesChartProps {
  provinceActivity: ProvinceActivityData;
  hasData: boolean;
}

const COLORS = [
  '#3B82F6', // blue-500
  '#EF4444', // red-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#6B7280', // gray-500
  '#F97316', // orange-500
  '#06B6D4', // cyan-500
  '#84CC16'  // lime-500
];

const TopProvincesChart: React.FC<TopProvincesChartProps> = ({ provinceActivity, hasData }) => {
  const [topCount, setTopCount] = useState<3 | 5 | 10>(5);

  if (!hasData) {
    return (
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Distribución de Propiedades por Provincia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <MapPin className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Datos no disponibles
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Importa datos para visualizar la distribución por provincias
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar provincias por cantidad total y tomar el top seleccionado
  const sortedProvinces = Object.entries(provinceActivity)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, topCount)
    .map(([province, data], index) => ({
      name: province,
      value: data.count,
      activas: data.activeProperties,
      inactivas: data.inactiveProperties,
      color: COLORS[index % COLORS.length]
    }));

  // Calcular "Otras" si hay más provincias
  const totalShown = sortedProvinces.reduce((sum, p) => sum + p.value, 0);
  const totalAll = Object.values(provinceActivity).reduce((sum, p) => sum + p.count, 0);
  const othersCount = totalAll - totalShown;

  const chartData = [...sortedProvinces];
  if (othersCount > 0) {
    chartData.push({
      name: 'Otras',
      value: othersCount,
      activas: 0,
      inactivas: 0,
      color: '#9CA3AF' // gray-400
    });
  }

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Top {topCount} Provincias por Propiedades
          </CardTitle>
          <div className="flex gap-2">
            {[3, 5, 10].map((count) => (
              <Button
                key={count}
                variant={topCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => setTopCount(count as 3 | 5 | 10)}
                className={`text-xs px-3 py-1 ${
                  topCount === count 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                }`}
              >
                Top {count}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} propiedades`, 
                  name
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {value}: {entry.payload?.value?.toLocaleString()}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Estadísticas adicionales */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              Provincia Líder
            </div>
            <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
              {sortedProvinces[0]?.name || 'N/A'}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              {sortedProvinces[0]?.value || 0} propiedades
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Total Top {topCount}
            </div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {totalShown.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              propiedades
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">
              Porcentaje del Total
            </div>
            <div className="text-lg font-bold text-green-900 dark:text-green-100">
              {totalAll > 0 ? Math.round((totalShown / totalAll) * 100) : 0}%
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              concentración
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProvincesChart;
