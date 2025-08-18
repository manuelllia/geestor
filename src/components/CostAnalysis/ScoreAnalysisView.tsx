
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface ScoreAnalysisViewProps {
  data: any;
}

const ScoreAnalysisView: React.FC<ScoreAnalysisViewProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos de puntuación disponibles</p>
      </div>
    );
  }

  // Calculate total scores
  const criteriosAutomaticos = data.criteriosAutomaticos || [];
  const criteriosSubjetivos = data.criteriosSubjetivos || [];
  const otrosCriterios = data.otrosCriterios || [];

  const totalAutomaticos = criteriosAutomaticos.reduce((sum: number, criterio: any) => sum + (criterio.puntuacionMaxima || 0), 0);
  const totalSubjetivos = criteriosSubjetivos.reduce((sum: number, criterio: any) => sum + (criterio.puntuacionMaxima || 0), 0);
  const totalOtros = otrosCriterios.reduce((sum: number, criterio: any) => sum + (criterio.puntuacionMaxima || 0), 0);
  const totalGeneral = totalAutomaticos + totalSubjetivos + totalOtros;

  const renderScoreSection = (title: string, criterios: any[], total: number, color: string) => (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center justify-between">
          {title}
          <Badge variant="outline" className="text-base font-bold" style={{ color }}>
            {total} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criterios.length > 0 ? (
            criterios.map((criterio: any, index: number) => {
              const porcentaje = totalGeneral > 0 ? (criterio.puntuacionMaxima / totalGeneral) * 100 : 0;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <h4 className="font-semibold text-sm md:text-base">{criterio.nombre}</h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {criterio.descripcion}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color }}>
                        {criterio.puntuacionMaxima} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {porcentaje.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress value={porcentaje} className="h-2" />
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No hay criterios especificados</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Resumen de Puntuación */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">🎯 Resumen de Puntuación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold">{totalAutomaticos}</div>
              <p className="text-blue-100">Automáticos</p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">{totalSubjetivos}</div>
              <p className="text-blue-100">Subjetivos</p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">{totalOtros}</div>
              <p className="text-blue-100">Otros</p>
            </div>
            <div className="border-l border-blue-300 md:border-l-0 md:border-t md:pt-4">
              <div className="text-3xl md:text-4xl font-bold">{totalGeneral}</div>
              <p className="text-blue-100">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución por Tipo de Criterio */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">📊 Distribución de Puntuación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Criterios Automáticos</span>
              <span className="text-blue-600 font-semibold">
                {totalAutomaticos} pts ({totalGeneral > 0 ? ((totalAutomaticos / totalGeneral) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <Progress value={totalGeneral > 0 ? (totalAutomaticos / totalGeneral) * 100 : 0} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Criterios Subjetivos</span>
              <span className="text-green-600 font-semibold">
                {totalSubjetivos} pts ({totalGeneral > 0 ? ((totalSubjetivos / totalGeneral) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <Progress value={totalGeneral > 0 ? (totalSubjetivos / totalGeneral) * 100 : 0} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Otros Criterios</span>
              <span className="text-purple-600 font-semibold">
                {totalOtros} pts ({totalGeneral > 0 ? ((totalOtros / totalGeneral) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <Progress value={totalGeneral > 0 ? (totalOtros / totalGeneral) * 100 : 0} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Secciones Detalladas */}
      <div className="space-y-6">
        {renderScoreSection("⚙️ Criterios Automáticos", criteriosAutomaticos, totalAutomaticos, "#3B82F6")}
        {renderScoreSection("👥 Criterios Subjetivos", criteriosSubjetivos, totalSubjetivos, "#10B981")}
        {renderScoreSection("📋 Otros Criterios", otrosCriterios, totalOtros, "#8B5CF6")}
      </div>

      {/* Recomendaciones */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">💡 Estrategia de Puntuación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-green-200 text-lg">•</span>
              <p className="text-green-100">
                Prioriza los criterios automáticos ({totalAutomaticos} pts) ya que son objetivos y controlables
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-200 text-lg">•</span>
              <p className="text-green-100">
                Prepara una estrategia sólida para los criterios subjetivos ({totalSubjetivos} pts)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-200 text-lg">•</span>
              <p className="text-green-100">
                El precio representa un factor clave en la puntuación total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreAnalysisView;
