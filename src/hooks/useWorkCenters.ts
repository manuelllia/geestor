
// src/hooks/useWorkCenters.ts
import { useState, useEffect } from 'react';
// Asegúrate de importar WorkCenter y getWorkCenters desde el servicio
import { getWorkCenters, WorkCenter } from '../services/workCentersService';

// Exportamos el tipo WorkCenter para que pueda ser usado en otros archivos
export type { WorkCenter };

export const useWorkCenters = () => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkCenters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const centers = await getWorkCenters(); // Llama a la función del servicio
        setWorkCenters(centers);
      } catch (err: any) { // Captura el error para TS
        console.error('Error al cargar centros de trabajo:', err);
        setError(err.message || 'Error desconocido al cargar los centros de trabajo'); // Usa el mensaje del error lanzado por el servicio
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkCenters();
  }, []);

  return {
    workCenters,
    isLoading,
    error,
    // La función refetch es buena, la mantenemos
    refetch: () => {
      setIsLoading(true);
      setError(null);
      getWorkCenters()
        .then(setWorkCenters)
        .catch((err: any) => { // Captura el error para TS
          console.error('Error al recargar centros de trabajo:', err);
          setError(err.message || 'Error desconocido al recargar los centros de trabajo');
        })
        .finally(() => setIsLoading(false));
    }
  };
};
