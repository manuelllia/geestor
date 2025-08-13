
import { useState, useEffect } from 'react';
import { getWorkCenters, WorkCenter } from '../services/workCentersService';

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
      } catch (err) {
        console.error('Error al cargar centros de trabajo:', err);
        setError('Error al cargar los centros de trabajo');
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
        .catch((err) => {
          console.error('Error al recargar centros de trabajo:', err);
          setError('Error al cargar los centros de trabajo');
        })
        .finally(() => setIsLoading(false));
    }
  };
};
