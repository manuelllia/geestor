
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error al cargar las propiedades: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-semibold">
                Gestión de Inmuebles
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RealEstateTableManager 
            onBack={onBack}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateListView;
