
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
          {t('realEstateDashboard')}
        </h2>
        <div className="space-x-2">
          <Button onClick={onImportData}>
            Importar Datos
          </Button>
          <Button onClick={onViewTables}>
            Ver Tablas
          </Button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              {t('activeProperties')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {propertyCounts.active}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              {t('inactiveProperties')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {propertyCounts.inactive}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              {t('totalProperties')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {propertyCounts.total}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              {t('totalRooms')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {propertyCounts.totalRooms}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y Visualizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coste Anual por Provincia */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <BarChartIcon className="w-5 h-5" />
              Coste Anual por Provincia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="provincia" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, 'Coste Anual']}
                    labelStyle={{ color: '#1f2937' }}
                  />
                  <Bar dataKey="coste" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mapa de Actividad por Provincias */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa de Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpainProvinceMapSVG 
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
