
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface GoogleMapProps {
  height?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  height = '500px', 
  className = '' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('googleMapsApiKey') || '');
  const [isApiKeySet, setIsApiKeySet] = useState(!!localStorage.getItem('googleMapsApiKey'));
  const [isLoading, setIsLoading] = useState(false);

  const loadMap = async (key: string) => {
    if (!mapRef.current) return;

    setIsLoading(true);
    try {
      const loader = new Loader({
        apiKey: key,
        version: 'weekly',
        libraries: ['places']
      });

      await loader.load();

      // Coordenadas del centro de España
      const spainCenter = { lat: 40.4637, lng: -3.7492 };

      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: spainCenter,
        zoom: 6,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Agregar un marcador en Madrid como ejemplo
      new google.maps.Marker({
        position: spainCenter,
        map: mapInstance.current,
        title: 'Madrid, España'
      });

    } catch (error) {
      console.error('Error loading Google Maps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('googleMapsApiKey', apiKey);
      setIsApiKeySet(true);
      loadMap(apiKey);
    }
  };

  useEffect(() => {
    if (isApiKeySet && apiKey) {
      loadMap(apiKey);
    }
  }, [isApiKeySet]);

  if (!isApiKeySet) {
    return (
      <div className={`${className} bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6`}>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Configurar Google Maps
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Para mostrar el mapa, necesitas proporcionar una API Key de Google Maps.
          </p>
          <div className="max-w-md mx-auto space-y-3">
            <div>
              <Label htmlFor="apiKey" className="text-sm font-medium">
                Google Maps API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa tu API Key de Google Maps"
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="w-full"
            >
              Configurar Mapa
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Puedes obtener tu API Key en{' '}
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      />
    </div>
  );
};

export default GoogleMap;
