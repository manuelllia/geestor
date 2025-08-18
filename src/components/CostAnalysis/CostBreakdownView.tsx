import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../utils/translations';

interface CostBreakdownViewProps {
  data: any;
  language: Language;
  onBack: () => void;
}

const CostBreakdownView: React.FC<CostBreakdownViewProps> = ({ data, language, onBack }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos de costes disponibles</p>
      </div>
    );
  }

  const presupuestoTotal = Number(data.presupuestoGeneral || 0);
  const costesRecomendados = data.costesDetalladosRecomendados || {};

  // Calcular distribución de costes estimada
  const distribucionCostes = {
    personal: presupuestoTotal * 0.6, // 60% para personal
    equipamiento: presupuestoTotal * 0.25, // 25% para equipamiento
    servicios: presupuestoTotal * 0.1, // 10% para servicios
    overhead: presupuestoTotal * 0.05 // 5% para gastos generales
  };

  const renderCostItem = (titulo: string, valor: number, color: string) => {
    const porcentaje = presupuestoTotal > 0 ? (valor / presupuestoTotal) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base font-medium">{titulo}</span>
          <span className="text-sm md:text-lg font-semibold" style={{ color }}>
            €{valor.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-gray-500">
          <span>{porcentaje.toFixed(1)}% del total</span>
        </div>
        <Progress value={porcentaje} className="h-2" />
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header with back button */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Desglose de Costes
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Resumen del Presupuesto */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">💰 Resumen del Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-4xl font-bold">
                  €{presupuestoTotal.toLocaleString()}
                </div>
                <p className="text-indigo-100 text-sm md:text-base">Presupuesto Total (Sin IVA)</p>
              </div>
            </CardContent>
          </Card>

          {/* Desglose por Lotes */}
          {data.esPorLotes && data.lotes && data.lotes.length > 0 && (
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">📦 Desglose por Lotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.lotes.map((lote: any, index: number) => {
                    const presupuestoLote = Number(lote.presupuesto || 0);
                    const porcentajeLote = presupuestoTotal > 0 ? (presupuestoLote / presupuestoTotal) * 100 : 0;
                    
                    return (
                      <div key={index} className="border rounded-lg p-3 md:p-4 bg-gray-50 dark:bg-gray-700">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                          <h4 className="font-semibold text-sm md:text-base">{lote.nombre}</h4>
                          <div className="text-right">
                            <div className="text-lg md:text-xl font-bold text-blue-600">
                              €{presupuestoLote.toLocaleString()}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {porcentajeLote.toFixed(1)}% del total
                            </div>
                          </div>
                        </div>
                        <Progress value={porcentajeLote} className="h-2 mb-2" />
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {lote.descripcion}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distribución Estimada de Costes */}
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">📊 Distribución Estimada de Costes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {renderCostItem("Personal y Recursos Humanos", distribucionCostes.personal, "#3B82F6")}
              {renderCostItem("Equipamiento y Tecnología", distribucionCostes.equipamiento, "#10B981")}
              {renderCostItem("Servicios y Subcontratación", distribucionCostes.servicios, "#F59E0B")}
              {renderCostItem("Gastos Generales y Overhead", distribucionCostes.overhead, "#EF4444")}
            </CardContent>
          </Card>

          {/* Costes Detallados Recomendados */}
          {Object.keys(costesRecomendados).length > 0 && (
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">🎯 Costes Detallados Recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(costesRecomendados).map(([categoria, valor]: [string, any]) => (
                    <div key={categoria} className="border rounded-lg p-3 md:p-4 bg-blue-50 dark:bg-blue-900/30">
                      <h5 className="font-semibold text-sm md:text-base mb-2 capitalize">
                        {categoria.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h5>
                      {typeof valor === 'object' ? (
                        <div className="space-y-1">
                          {Object.entries(valor).map(([subcat, subvalor]: [string, any]) => (
                            <div key={subcat} className="flex justify-between text-xs md:text-sm">
                              <span className="text-gray-600 dark:text-gray-400 capitalize">
                                {subcat.replace(/([A-Z])/g, ' $1')}:
                              </span>
                              <span className="font-medium">
                                {typeof subvalor === 'number' ? `€${subvalor.toLocaleString()}` : String(subvalor)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm md:text-base font-medium text-blue-600">
                          {typeof valor === 'number' ? `€${valor.toLocaleString()}` : String(valor)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recomendaciones */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">💡 Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm md:text-base">
                <div className="flex items-start gap-2">
                  <span className="text-green-200 text-lg">•</span>
                  <p className="text-green-100">
                    Considera un margen de seguridad del 5-10% sobre los costes estimados
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 text-lg">•</span>
                  <p className="text-green-100">
                    Revisa los requisitos técnicos para ajustar la distribución de costes
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 text-lg">•</span>
                  <p className="text-green-100">
                    Incluye costes de formación y mantenimiento en tu propuesta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownView;
