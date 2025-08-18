
import React from 'react';
import { ProvinceActivityData } from '../../services/realEstateService';

interface SpainProvinceMapSVGProps {
  provinceActivity: ProvinceActivityData;
  hasData: boolean;
}

const SpainProvinceMapSVG: React.FC<SpainProvinceMapSVGProps> = ({ provinceActivity, hasData }) => {
  if (!hasData) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
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

  const getProvinceColor = (provinceName: string) => {
    const data = provinceActivity[provinceName];
    if (!data) return '#e5e7eb';
    
    const intensity = data.count / maxCount;
    const opacity = 0.3 + (intensity * 0.7);
    return `rgba(59, 130, 246, ${opacity})`;
  };

  const getTextColor = (provinceName: string) => {
    const data = provinceActivity[provinceName];
    if (!data) return '#6b7280';
    
    const intensity = data.count / maxCount;
    return intensity > 0.5 ? '#ffffff' : '#1f2937';
  };

  return (
    <div className="h-[400px] bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 relative overflow-hidden">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Galicia */}
        <g id="galicia">
          <path
            d="M50 120 L140 110 L150 140 L130 180 L80 190 L40 160 Z"
            fill={getProvinceColor('A Coruña')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="95" y="145" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('A Coruña')}>
            A Coruña: {provinceActivity['A Coruña']?.count || 0}
          </text>
          
          <path
            d="M150 140 L200 135 L210 165 L180 185 L130 180 Z"
            fill={getProvinceColor('Lugo')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="170" y="160" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Lugo')}>
            Lugo: {provinceActivity['Lugo']?.count || 0}
          </text>
          
          <path
            d="M80 190 L130 180 L180 185 L170 220 L90 230 Z"
            fill={getProvinceColor('Pontevedra')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="125" y="205" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Pontevedra')}>
            Pontevedra: {provinceActivity['Pontevedra']?.count || 0}
          </text>
          
          <path
            d="M170 220 L180 185 L210 165 L240 180 L230 215 Z"
            fill={getProvinceColor('Ourense')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="205" y="190" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Ourense')}>
            Ourense: {provinceActivity['Ourense']?.count || 0}
          </text>
        </g>

        {/* Asturias */}
        <path
          d="M150 140 L280 130 L290 160 L210 165 Z"
          fill={getProvinceColor('Asturias')}
          stroke="#374151"
          strokeWidth="1"
        />
        <text x="220" y="150" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Asturias')}>
          Asturias: {provinceActivity['Asturias']?.count || 0}
        </text>

        {/* Cantabria */}
        <path
          d="M280 130 L340 125 L345 155 L290 160 Z"
          fill={getProvinceColor('Cantabria')}
          stroke="#374151"
          strokeWidth="1"
        />
        <text x="315" y="145" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Cantabria')}>
          Cantabria: {provinceActivity['Cantabria']?.count || 0}
        </text>

        {/* País Vasco */}
        <g id="pais-vasco">
          <path
            d="M340 125 L380 120 L385 145 L345 155 Z"
            fill={getProvinceColor('Vizcaya')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="365" y="135" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Vizcaya')}>
            Vizcaya: {provinceActivity['Vizcaya']?.count || 0}
          </text>
          
          <path
            d="M380 120 L420 118 L425 143 L385 145 Z"
            fill={getProvinceColor('Guipúzcoa')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="403" y="130" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Guipúzcoa')}>
            Guipúzcoa: {provinceActivity['Guipúzcoa']?.count || 0}
          </text>
          
          <path
            d="M345 155 L385 145 L425 143 L430 173 L380 175 Z"
            fill={getProvinceColor('Álava')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="390" y="160" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Álava')}>
            Álava: {provinceActivity['Álava']?.count || 0}
          </text>
        </g>

        {/* Navarra */}
        <path
          d="M425 143 L480 140 L485 190 L430 173 Z"
          fill={getProvinceColor('Navarra')}
          stroke="#374151"
          strokeWidth="1"
        />
        <text x="455" y="165" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Navarra')}>
          Navarra: {provinceActivity['Navarra']?.count || 0}
        </text>

        {/* La Rioja */}
        <path
          d="M430 173 L485 190 L480 220 L425 205 Z"
          fill={getProvinceColor('La Rioja')}
          stroke="#374151"
          strokeWidth="1"
        />
        <text x="455" y="200" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('La Rioja')}>
          La Rioja: {provinceActivity['La Rioja']?.count || 0}
        </text>

        {/* Aragón */}
        <g id="aragon">
          <path
            d="M480 140 L560 135 L565 175 L485 190 Z"
            fill={getProvinceColor('Huesca')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="523" y="160" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Huesca')}>
            Huesca: {provinceActivity['Huesca']?.count || 0}
          </text>
          
          <path
            d="M480 220 L485 190 L565 175 L570 235 L540 250 Z"
            fill={getProvinceColor('Zaragoza')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="525" y="210" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Zaragoza')}>
            Zaragoza: {provinceActivity['Zaragoza']?.count || 0}
          </text>
          
          <path
            d="M540 250 L570 235 L575 285 L545 300 Z"
            fill={getProvinceColor('Teruel')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="558" y="270" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Teruel')}>
            Teruel: {provinceActivity['Teruel']?.count || 0}
          </text>
        </g>

        {/* Cataluña */}
        <g id="cataluna">
          <path
            d="M560 135 L620 130 L625 165 L565 175 Z"
            fill={getProvinceColor('Lleida')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="593" y="150" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Lleida')}>
            Lleida: {provinceActivity['Lleida']?.count || 0}
          </text>
          
          <path
            d="M620 130 L680 125 L685 160 L625 165 Z"
            fill={getProvinceColor('Girona')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="653" y="145" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Girona')}>
            Girona: {provinceActivity['Girona']?.count || 0}
          </text>
          
          <path
            d="M625 165 L685 160 L690 210 L630 215 Z"
            fill={getProvinceColor('Barcelona')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="658" y="188" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Barcelona')}>
            Barcelona: {provinceActivity['Barcelona']?.count || 0}
          </text>
          
          <path
            d="M565 175 L625 165 L630 215 L570 235 Z"
            fill={getProvinceColor('Tarragona')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="598" y="200" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Tarragona')}>
            Tarragona: {provinceActivity['Tarragona']?.count || 0}
          </text>
        </g>

        {/* Castilla y León */}
        <g id="castilla-leon">
          <path
            d="M210 165 L240 180 L270 200 L290 160 Z"
            fill={getProvinceColor('León')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="253" y="180" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('León')}>
            León: {provinceActivity['León']?.count || 0}
          </text>
          
          <path
            d="M240 180 L270 200 L300 235 L270 250 L230 215 Z"
            fill={getProvinceColor('Zamora')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="260" y="225" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Zamora')}>
            Zamora: {provinceActivity['Zamora']?.count || 0}
          </text>
          
          <path
            d="M230 215 L270 250 L280 290 L240 305 L200 270 Z"
            fill={getProvinceColor('Salamanca')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="240" y="270" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Salamanca')}>
            Salamanca: {provinceActivity['Salamanca']?.count || 0}
          </text>
          
          <path
            d="M270 200 L345 195 L350 235 L300 235 Z"
            fill={getProvinceColor('Palencia')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="310" y="215" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Palencia')}>
            Palencia: {provinceActivity['Palencia']?.count || 0}
          </text>
          
          <path
            d="M300 235 L350 235 L355 275 L320 290 L270 250 Z"
            fill={getProvinceColor('Valladolid')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="315" y="260" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Valladolid')}>
            Valladolid: {provinceActivity['Valladolid']?.count || 0}
          </text>
          
          <path
            d="M345 195 L425 190 L430 235 L350 235 Z"
            fill={getProvinceColor('Burgos')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="388" y="215" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Burgos')}>
            Burgos: {provinceActivity['Burgos']?.count || 0}
          </text>
          
          <path
            d="M430 235 L480 235 L485 275 L435 290 L350 275 Z"
            fill={getProvinceColor('Soria')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="418" y="255" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Soria')}>
            Soria: {provinceActivity['Soria']?.count || 0}
          </text>
          
          <path
            d="M320 290 L355 275 L435 290 L430 330 L325 335 L280 290 Z"
            fill={getProvinceColor('Segovia')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="365" y="315" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Segovia')}>
            Segovia: {provinceActivity['Segovia']?.count || 0}
          </text>
          
          <path
            d="M240 305 L280 290 L325 335 L290 370 L245 355 Z"
            fill={getProvinceColor('Ávila')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="276" y="335" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Ávila')}>
            Ávila: {provinceActivity['Ávila']?.count || 0}
          </text>
        </g>

        {/* Madrid */}
        <path
          d="M325 335 L430 330 L435 375 L340 380 L290 370 Z"
          fill={getProvinceColor('Madrid')}
          stroke="#374151"
          strokeWidth="1"
        />
        <text x="375" y="355" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Madrid')}>
          Madrid: {provinceActivity['Madrid']?.count || 0}
        </text>

        {/* Castilla-La Mancha */}
        <g id="castilla-la-mansha">
          <path
            d="M430 330 L485 275 L540 290 L535 340 L435 375 Z"
            fill={getProvinceColor('Guadalajara')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="480" y="325" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Guadalajara')}>
            Guadalajara: {provinceActivity['Guadalajara']?.count || 0}
          </text>
          
          <path
            d="M540 290 L575 285 L580 340 L535 340 Z"
            fill={getProvinceColor('Cuenca')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="558" y="315" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Cuenca')}>
            Cuenca: {provinceActivity['Cuenca']?.count || 0}
          </text>
          
          <path
            d="M340 380 L435 375 L535 340 L530 395 L345 400 Z"
            fill={getProvinceColor('Toledo')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="438" y="388" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Toledo')}>
            Toledo: {provinceActivity['Toledo']?.count || 0}
          </text>
          
          <path
            d="M345 400 L530 395 L535 450 L350 455 Z"
            fill={getProvinceColor('Ciudad Real')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="443" y="425" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Ciudad Real')}>
            Ciudad Real: {provinceActivity['Ciudad Real']?.count || 0}
          </text>
          
          <path
            d="M535 340 L580 340 L585 420 L535 450 Z"
            fill={getProvinceColor('Albacete')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="560" y="395" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Albacete')}>
            Albacete: {provinceActivity['Albacete']?.count || 0}
          </text>
        </g>

        {/* Comunidad Valenciana */}
        <g id="comunidad-valenciana">
          <path
            d="M575 285 L630 280 L635 325 L580 340 Z"
            fill={getProvinceColor('Castellón')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="605" y="310" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Castellón')}>
            Castellón: {provinceActivity['Castellón']?.count || 0}
          </text>
          
          <path
            d="M580 340 L635 325 L640 380 L585 420 Z"
            fill={getProvinceColor('Valencia')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="613" y="365" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Valencia')}>
            Valencia: {provinceActivity['Valencia']?.count || 0}
          </text>
          
          <path
            d="L585 420 L640 380 L645 440 L590 475 Z"
            fill={getProvinceColor('Alicante')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="618" y="430" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Alicante')}>
            Alicante: {provinceActivity['Alicante']?.count || 0}
          </text>
        </g>

        {/* Murcia */}
        <path
          d="M535 450 L585 420 L590 475 L540 495 Z"
          fill={getProvinceColor('Murcia')}
          stroke="#374151"
          strokeWidth="1"
        />
        <text x="563" y="460" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Murcia')}>
          Murcia: {provinceActivity['Murcia']?.count || 0}
        </text>

        {/* Extremadura */}
        <g id="extremadura">
          <path
            d="M200 270 L240 305 L245 355 L205 370 L160 340 Z"
            fill={getProvinceColor('Cáceres')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="218" y="330" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Cáceres')}>
            Cáceres: {provinceActivity['Cáceres']?.count || 0}
          </text>
          
          <path
            d="M160 340 L205 370 L290 370 L350 455 L300 485 L155 470 Z"
            fill={getProvinceColor('Badajoz')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="228" y="428" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Badajoz')}>
            Badajoz: {provinceActivity['Badajoz']?.count || 0}
          </text>
        </g>

        {/* Andalucía */}
        <g id="andalucia">
          <path
            d="L300 485 L350 455 L535 450 L540 495 L520 530 L305 535 Z"
            fill={getProvinceColor('Córdoba')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="420" y="500" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Córdoba')}>
            Córdoba: {provinceActivity['Córdoba']?.count || 0}
          </text>
          
          <path
            d="M540 495 L590 475 L595 520 L520 530 Z"
            fill={getProvinceColor('Jaén')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="565" y="505" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Jaén')}>
            Jaén: {provinceActivity['Jaén']?.count || 0}
          </text>
          
          <path
            d="M520 530 L595 520 L600 570 L525 575 Z"
            fill={getProvinceColor('Granada')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="563" y="548" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Granada')}>
            Granada: {provinceActivity['Granada']?.count || 0}
          </text>
          
          <path
            d="M595 520 L645 440 L650 505 L600 570 Z"
            fill={getProvinceColor('Almería')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="623" y="508" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Almería')}>
            Almería: {provinceActivity['Almería']?.count || 0}
          </text>
          
          <path
            d="M305 535 L520 530 L525 575 L310 580 Z"
            fill={getProvinceColor('Sevilla')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="413" y="555" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Sevilla')}>
            Sevilla: {provinceActivity['Sevilla']?.count || 0}
          </text>
          
          <path
            d="M310 580 L525 575 L530 620 L315 625 Z"
            fill={getProvinceColor('Málaga')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="423" y="600" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Málaga')}>
            Málaga: {provinceActivity['Málaga']?.count || 0}
          </text>
          
          <path
            d="M155 470 L300 485 L305 535 L160 540 Z"
            fill={getProvinceColor('Huelva')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="230" y="510" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Huelva')}>
            Huelva: {provinceActivity['Huelva']?.count || 0}
          </text>
          
          <path
            d="M160 540 L305 535 L315 625 L165 630 Z"
            fill={getProvinceColor('Cádiz')}
            stroke="#374151"
            strokeWidth="1"
          />
          <text x="240" y="585" textAnchor="middle" className="text-xs font-medium" fill={getTextColor('Cádiz')}>
            Cádiz: {provinceActivity['Cádiz']?.count || 0}
          </text>
        </g>
      </svg>
      
      {/* Leyenda */}
      <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-3 rounded shadow-lg">
        <h4 className="font-medium text-sm mb-2">Propiedades por Provincia</h4>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span>Pocas</span>
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Muchas</span>
        </div>
      </div>
    </div>
  );
};

export default SpainProvinceMapSVG;
