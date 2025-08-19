
import { useState, useEffect } from 'react';
import { getWorkCenters, WorkCenter } from '../services/workCentersService';

// Re-export WorkCenter for external use
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
        const centers = await getWorkCenters();
        setWorkCenters(centers);
      } catch (err: any) {
        console.error('Error al cargar centros de trabajo:', err);
        setError(err.message || 'Error desconocido al cargar los centros de trabajo');
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
    refetch: () => {
      setIsLoading(true);
      setError(null);
      getWorkCenters()
        .then(setWorkCenters)
        .catch((err: any) => {
          console.error('Error al recargar centros de trabajo:', err);
          setError(err.message || 'Error desconocido al recargar los centros de trabajo');
        })
        .finally(() => setIsLoading(false));
    }
  };
};
