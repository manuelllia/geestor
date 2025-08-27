
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import RealEstateTableManager from './RealEstateTableManager';
import { useQuery } from '@tanstack/react-query';
import { getRealEstateProperties } from '../../services/realEstateService';

interface RealEstateListViewProps {
  onBack: () => void;
}

const RealEstateListView: React.FC<RealEstateListViewProps> = ({ onBack }) => {
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['realEstateProperties'],
    queryFn: getRealEstateProperties,
  });

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-4">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden p-2 sm:p-4 lg:p-6">
        <Card className="w-full border-red-200 dark:border-red-800">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center text-red-600 text-sm sm:text-base">
              <p>Error al cargar las propiedades:</p>
              <p className="text-xs sm:text-sm mt-2">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        {/* Card principal con header responsive */}
        <Card className="border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2 text-xs sm:text-sm w-fit border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Volver</span>
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0" />
                <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-blue-800 dark:text-blue-200">
                  Gestión de Inmuebles
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Contenedor del table manager con scroll mejorado */}
            <div className="w-full overflow-hidden">
              <RealEstateTableManager 
                onBack={onBack}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateListView;
