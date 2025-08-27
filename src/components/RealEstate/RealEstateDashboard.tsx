import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Upload, Table, Plus } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { getPropertyCounts } from '../../services/realEstateService';

interface PropertyCounts {
  active: number;
  inactive: number;
  total: number;
  totalRooms: number;
}

interface RealEstateDashboardProps {
  language: Language;
  onImportData: () => void;
  onViewTables: () => void;
  onAddProperty?: () => void;
}

const RealEstateDashboard: React.FC<RealEstateDashboardProps> = ({ 
  language, 
  onImportData, 
  onViewTables,
  onAddProperty 
}) => {
  const { t } = useTranslation(language);
  const [propertyCounts, setPropertyCounts] = useState<PropertyCounts>({
    active: 0,
    inactive: 0,
    total: 0,
    totalRooms: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const counts = await getPropertyCounts();
      setPropertyCounts(counts);
    } catch (error) {
      console.error('Error al cargar los conteos de propiedades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        {/* Header Card */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-blue-800 dark:text-blue-200">
                  {t('realEstate.title')}
                </CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {onAddProperty && (
                  <Button
                    onClick={onAddProperty}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Agregar Inmueble
                  </Button>
                )}
                <Button
                  onClick={onImportData}
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t('realEstate.importData')}
                </Button>
                <Button
                  onClick={onViewTables}
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <Table className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t('realEstate.viewTables')}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Active Properties Card */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-300">
                {t('realEstate.activeProperties')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLoading ? 'Cargando...' : propertyCounts.active}
              </div>
            </CardContent>
          </Card>

          {/* Inactive Properties Card */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold text-red-700 dark:text-red-300">
                {t('realEstate.inactiveProperties')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLoading ? 'Cargando...' : propertyCounts.inactive}
              </div>
            </CardContent>
          </Card>

          {/* Total Properties Card */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300">
                {t('realEstate.totalProperties')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLoading ? 'Cargando...' : propertyCounts.total}
              </div>
            </CardContent>
          </Card>

           {/* Total Rooms Card */}
           <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base font-semibold text-yellow-700 dark:text-yellow-300">
                {t('realEstate.totalRooms')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLoading ? 'Cargando...' : propertyCounts.totalRooms}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDashboard;
