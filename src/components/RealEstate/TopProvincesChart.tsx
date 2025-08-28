import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProvinceActivityData } from '../../services/realEstateService';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface TopProvincesChartProps {
  provinceActivity: ProvinceActivityData;
  hasData: boolean;
  language: Language;
}

const TopProvincesChart: React.FC<TopProvincesChartProps> = ({ 
  provinceActivity, 
  hasData,
  language 
}) => {
  const { t } = useTranslation(language);

  const topProvinces = Object.entries(provinceActivity)
    .map(([provincia, data]) => ({
      provincia,
      total: data.activeProperties + data.inactiveProperties,
      active: data.activeProperties,
      inactive: data.inactiveProperties
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!hasData) {
    return (
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            Top Provincias por Actividad
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          Top Provincias por Actividad
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topProvinces} 
              margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="provincia" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={10}
                stroke="#666"
                interval={0}
              />
              <YAxis 
                fontSize={10}
                stroke="#666"
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const label = name === 'active' ? t('activeProperties') : 
                               name === 'inactive' ? t('inactiveProperties') : 
                               name;
                  return [value.toLocaleString(language), label];
                }}
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
                dataKey="active" 
                stackId="a"
                fill="#3B82F6" 
                radius={[0, 0, 0, 0]}
                name="active"
              />
              <Bar 
                dataKey="inactive" 
                stackId="a"
                fill="#EF4444" 
                radius={[4, 4, 0, 0]}
                name="inactive"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-3 sm:space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {t('activeProperties')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {t('inactiveProperties')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProvincesChart;
