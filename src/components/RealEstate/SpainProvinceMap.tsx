
import React from 'react';
import { ProvinceActivityData } from '../../services/realEstateService';

interface SpainProvinceMapProps {
  provinceActivity: ProvinceActivityData;
  hasData: boolean;
}

const SpainProvinceMap: React.FC<SpainProvinceMapProps> = ({ provinceActivity, hasData }) => {
  // Coordenadas aproximadas de las provincias españolas (simplificadas)
  const provinceCoordinates: { [key: string]: { x: number; y: number } } = {
    'MADRID': { x: 250, y: 180 },
    'Barcelona': { x: 320, y: 150 },
    'Valencia': { x: 300, y: 200 },
    'Sevilla': { x: 150, y: 280 },
    'Málaga': { x: 130, y: 320 },
    'Cádiz': { x: 100, y: 320 },
    'Córdoba': { x: 150, y: 250 },
    'Granada': { x: 170, y: 300 },
    'Jaén': { x: 180, y: 260 },
    'Almería': { x: 200, y: 320 },
    'Huelva': { x: 80, y: 290 },
    'Murcia': { x: 250, y: 240 },
    'Alicante': { x: 280, y: 220 },
    'Castellón': { x: 300, y: 170 },
    'Tarragona': { x: 320, y: 140 },
    'Lleida': { x: 300, y: 120 },
    'Girona': { x: 340, y: 100 },
    'Zaragoza': { x: 280, y: 120 },
    'Huesca': { x: 270, y: 90 },
    'Teruel': { x: 270, y: 150 },
    'Toledo': { x: 220, y: 200 },
    'Ciudad Real': { x: 200, y: 220 },
    'Cuenca': { x: 250, y: 180 },
    'Guadalajara': { x: 260, y: 160 },
    'Albacete': { x: 240, y: 220 },
    'Cáceres': { x: 150, y: 180 },
    'Badajoz': { x: 120, y: 220 },
    'Salamanca': { x: 180, y: 120 },
    'Zamora': { x: 180, y: 100 },
    'León': { x: 180, y: 80 },
    'Palencia': { x: 200, y: 80 },
    'Valladolid': { x: 200, y: 100 },
    'Segovia': { x: 220, y: 140 },
    'Ávila': { x: 200, y: 140 },
    'Soria': { x: 240, y: 100 },
    'Burgos': { x: 220, y: 80 },
    'La Rioja': { x: 250, y: 70 },
    'Álava': { x: 240, y: 60 },
    'Vizcaya': { x: 220, y: 50 },
    'Guipúzcoa': { x: 250, y: 50 },
    'Navarra': { x: 270, y: 70 },
    'Asturias': { x: 180, y: 40 },
    'Cantabria': { x: 200, y: 50 },
    'Lugo': { x: 140, y: 50 },
    'La Coruña': { x: 100, y: 60 },
    'Pontevedra': { x: 120, y: 100 },
    'Ourense': { x: 140, y: 100 }
  };

  const getCircleSize = (count: number, maxCount: number) => {
    const minSize = 4;
    const maxSize = 20;
    return minSize + (count / maxCount) * (maxSize - minSize);
  };

  const getOpacity = (count: number, maxCount: number) => {
    return 0.6 + (count / maxCount) * 0.4;
  };

  if (!hasData) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <p className="text-gray-500 text-lg font-medium">DATA NOT FOUND</p>
          <p className="text-gray-400 text-sm">Importa datos para ver ubicaciones</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(provinceActivity).map(data => data.count));

  return (
    <div className="h-[300px] bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 relative overflow-hidden">
      {/* Mapa base de España (simplificado) */}
      <svg viewBox="0 0 400 350" className="w-full h-full">
        {/* Contorno simplificado de España */}
        <path
          d="M50 100 L100 50 L150 40 L200 30 L250 35 L300 40 L350 60 L380 100 L370 150 L350 200 L320 250 L280 300 L200 330 L150 320 L100 300 L80 250 L60 200 L50 150 Z"
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="1"
        />
        
        {/* Círculos para cada provincia */}
        {Object.entries(provinceActivity).map(([province, data]) => {
          const coords = provinceCoordinates[province] || { x: 200, y: 175 }; // Centro por defecto
          const size = getCircleSize(data.count, maxCount);
          const opacity = getOpacity(data.count, maxCount);
          
          return (
            <g key={province}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r={size}
                fill="#3B82F6"
                opacity={opacity}
                className="transition-all duration-200 hover:opacity-100"
              />
              <text
                x={coords.x}
                y={coords.y + size + 12}
                textAnchor="middle"
                className="text-xs fill-blue-700 dark:fill-blue-300 font-medium"
                style={{ fontSize: '10px' }}
              >
                {province.length > 8 ? province.substring(0, 8) + '...' : province}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Leyenda */}
      <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-60"></div>
          <span>Menos propiedades</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Más propiedades</span>
        </div>
      </div>
    </div>
  );
};

export default SpainProvinceMap;
