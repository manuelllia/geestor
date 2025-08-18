
import React from 'react';
import { ProvinceActivityData } from '../../services/realEstateService';

interface SpainProvinceMapSVGProps {
  provinceActivity: ProvinceActivityData;
  hasData: boolean;
}

const SpainProvinceMapSVG: React.FC<SpainProvinceMapSVGProps> = ({ provinceActivity, hasData }) => {
  if (!hasData) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Datos no disponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Importa datos para visualizar la actividad por provincias
            </p>
          </div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(provinceActivity).map(data => data.count));

  const getProvinceColor = (provinceName: string) => {
    const data = provinceActivity[provinceName];
    if (!data || data.count === 0) return '#f3f4f6';
    
    const intensity = data.count / maxCount;
    if (intensity <= 0.2) return '#dbeafe';
    if (intensity <= 0.4) return '#93c5fd';
    if (intensity <= 0.6) return '#60a5fa';
    if (intensity <= 0.8) return '#3b82f6';
    return '#1d4ed8';
  };

  const getStrokeColor = (provinceName: string) => {
    const data = provinceActivity[provinceName];
    return data && data.count > 0 ? '#1e40af' : '#d1d5db';
  };

  const getTextColor = (provinceName: string) => {
    const data = provinceActivity[provinceName];
    if (!data || data.count === 0) return '#6b7280';
    
    const intensity = data.count / maxCount;
    return intensity > 0.5 ? '#ffffff' : '#1f2937';
  };

  return (
    <div className="h-[500px] bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-800 rounded-xl p-6 relative border border-blue-100 dark:border-blue-800">
      <svg viewBox="0 0 1000 700" className="w-full h-full">
        {/* Definir gradientes y filtros */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#00000020"/>
          </filter>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1"/>
          </linearGradient>
        </defs>

        {/* Fondo oceánico */}
        <rect width="1000" height="700" fill="url(#oceanGradient)" />

        {/* Galicia */}
        <g id="galicia" filter="url(#shadow)">
          {/* A Coruña */}
          <path
            d="M80 150 L180 140 L190 180 L170 220 L120 230 L70 200 Z"
            fill={getProvinceColor('A Coruña')}
            stroke={getStrokeColor('A Coruña')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="125" y="175" textAnchor="middle" className="text-xs font-semibold pointer-events-none" fill={getTextColor('A Coruña')}>
            A Coruña
          </text>
          <text x="125" y="190" textAnchor="middle" className="text-xs font-bold pointer-events-none" fill={getTextColor('A Coruña')}>
            {provinceActivity['A Coruña']?.count || 0}
          </text>
          
          {/* Lugo */}
          <path
            d="M190 180 L250 175 L260 205 L230 225 L170 220 Z"
            fill={getProvinceColor('Lugo')}
            stroke={getStrokeColor('Lugo')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="215" y="195" textAnchor="middle" className="text-xs font-semibold pointer-events-none" fill={getTextColor('Lugo')}>
            Lugo
          </text>
          <text x="215" y="210" textAnchor="middle" className="text-xs font-bold pointer-events-none" fill={getTextColor('Lugo')}>
            {provinceActivity['Lugo']?.count || 0}
          </text>
          
          {/* Pontevedra */}
          <path
            d="M120 230 L170 220 L230 225 L220 270 L130 280 Z"
            fill={getProvinceColor('Pontevedra')}
            stroke={getStrokeColor('Pontevedra')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="175" y="245" textAnchor="middle" className="text-xs font-semibold pointer-events-none" fill={getTextColor('Pontevedra')}>
            Pontevedra
          </text>
          <text x="175" y="260" textAnchor="middle" className="text-xs font-bold pointer-events-none" fill={getTextColor('Pontevedra')}>
            {provinceActivity['Pontevedra']?.count || 0}
          </text>
          
          {/* Ourense */}
          <path
            d="M220 270 L230 225 L260 205 L290 220 L280 265 Z"
            fill={getProvinceColor('Ourense')}
            stroke={getStrokeColor('Ourense')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="255" y="235" textAnchor="middle" className="text-xs font-semibold pointer-events-none" fill={getTextColor('Ourense')}>
            Ourense
          </text>
          <text x="255" y="250" textAnchor="middle" className="text-xs font-bold pointer-events-none" fill={getTextColor('Ourense')}>
            {provinceActivity['Ourense']?.count || 0}
          </text>
        </g>

        {/* Asturias */}
        <path
          d="M260 205 L400 195 L410 220 L370 235 L260 205 Z"
          fill={getProvinceColor('Asturias')}
          stroke={getStrokeColor('Asturias')}
          strokeWidth="2"
          filter="url(#shadow)"
          className="hover:opacity-80 transition-all duration-200 cursor-pointer"
        />
        <text x="335" y="212" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Asturias')}>
          Asturias: {provinceActivity['Asturias']?.count || 0}
        </text>

        {/* Cantabria */}
        <path
          d="M400 195 L480 190 L485 215 L410 220 Z"
          fill={getProvinceColor('Cantabria')}
          stroke={getStrokeColor('Cantabria')}
          strokeWidth="2"
          filter="url(#shadow)"
          className="hover:opacity-80 transition-all duration-200 cursor-pointer"
        />
        <text x="442" y="205" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Cantabria')}>
          Cantabria: {provinceActivity['Cantabria']?.count || 0}
        </text>

        {/* País Vasco */}
        <g id="pais-vasco" filter="url(#shadow)">
          {/* Vizcaya */}
          <path
            d="M480 190 L520 185 L525 210 L485 215 Z"
            fill={getProvinceColor('Vizcaya')}
            stroke={getStrokeColor('Vizcaya')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="502" y="200" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Vizcaya')}>
            Vizcaya: {provinceActivity['Vizcaya']?.count || 0}
          </text>
          
          {/* Guipúzcoa */}
          <path
            d="M520 185 L560 183 L565 208 L525 210 Z"
            fill={getProvinceColor('Guipúzcoa')}
            stroke={getStrokeColor('Guipúzcoa')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="542" y="195" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Guipúzcoa')}>
            Guipúzcoa: {provinceActivity['Guipúzcoa']?.count || 0}
          </text>
          
          {/* Álava */}
          <path
            d="M485 215 L525 210 L565 208 L570 238 L520 240 Z"
            fill={getProvinceColor('Álava')}
            stroke={getStrokeColor('Álava')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="527" y="225" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Álava')}>
            Álava: {provinceActivity['Álava']?.count || 0}
          </text>
        </g>

        {/* Madrid */}
        <path
          d="M450 380 L550 375 L555 425 L460 430 L430 410 Z"
          fill={getProvinceColor('Madrid')}
          stroke={getStrokeColor('Madrid')}
          strokeWidth="3"
          filter="url(#shadow)"
          className="hover:opacity-80 transition-all duration-200 cursor-pointer"
        />
        <text x="500" y="400" textAnchor="middle" className="text-sm font-bold" fill={getTextColor('Madrid')}>
          Madrid
        </text>
        <text x="500" y="415" textAnchor="middle" className="text-sm font-bold" fill={getTextColor('Madrid')}>
          {provinceActivity['Madrid']?.count || 0}
        </text>

        {/* Andalucía */}
        <g id="andalucia" filter="url(#shadow)">
          {/* Sevilla */}
          <path
            d="M250 520 L350 515 L550 510 L555 560 L260 565 Z"
            fill={getProvinceColor('Sevilla')}
            stroke={getStrokeColor('Sevilla')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="402" y="535" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Sevilla')}>
            Sevilla: {provinceActivity['Sevilla']?.count || 0}
          </text>
          
          {/* Málaga */}
          <path
            d="M260 565 L555 560 L560 610 L265 615 Z"
            fill={getProvinceColor('Málaga')}
            stroke={getStrokeColor('Málaga')}
            strokeWidth="2"
            className="hover:opacity-80 transition-all duration-200 cursor-pointer"
          />
          <text x="412" y="590" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Málaga')}>
            Málaga: {provinceActivity['Málaga']?.count || 0}
          </text>
        </g>
        
        {/* Valencia */}
        <path
          d="M600 350 L680 345 L685 395 L605 400 Z"
          fill={getProvinceColor('Valencia')}
          stroke={getStrokeColor('Valencia')}
          strokeWidth="2"
          filter="url(#shadow)"
          className="hover:opacity-80 transition-all duration-200 cursor-pointer"
        />
        <text x="642" y="375" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Valencia')}>
          Valencia: {provinceActivity['Valencia']?.count || 0}
        </text>

        {/* Barcelona */}
        <path
          d="M650 280 L720 275 L725 315 L655 320 Z"
          fill={getProvinceColor('Barcelona')}
          stroke={getStrokeColor('Barcelona')}
          strokeWidth="2"
          filter="url(#shadow)"
          className="hover:opacity-80 transition-all duration-200 cursor-pointer"
        />
        <text x="687" y="297" textAnchor="middle" className="text-xs font-semibold" fill={getTextColor('Barcelona')}>
          Barcelona: {provinceActivity['Barcelona']?.count || 0}
        </text>
      </svg>
      
      {/* Leyenda mejorada estilo Power BI */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
          Densidad de Propiedades
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-4 h-4 bg-gray-200 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-300">Sin datos</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-4 h-4 bg-blue-200 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-300">Baja (1-20%)</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-4 h-4 bg-blue-400 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-300">Media (21-60%)</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-4 h-4 bg-blue-600 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-300">Alta (61-80%)</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-4 h-4 bg-blue-800 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-300">Muy Alta ({'>'}80%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpainProvinceMapSVG;
