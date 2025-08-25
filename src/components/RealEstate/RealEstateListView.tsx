
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-4">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="w-full">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center text-red-600 text-sm sm:text-base">
              Error al cargar las propiedades: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-xs sm:text-sm w-fit"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl font-semibold">
                Gestión de Inmuebles
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RealEstateTableManager 
            onBack={onBack}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateListView;
