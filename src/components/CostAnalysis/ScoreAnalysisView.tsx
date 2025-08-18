import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../utils/translations';

interface ScoreAnalysisViewProps {
  data: any;
  language: Language;
  onBack: () => void;
}

const ScoreAnalysisView: React.FC<ScoreAnalysisViewProps> = ({ data, language, onBack }) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [lowestPrice, setLowestPrice] = useState('');
  const [calculatedScores, setCalculatedScores] = useState<any>(null);

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos de puntuación disponibles</p>
      </div>
    );
  }

  const calculateEconomicScore = () => {
    if (!offerPrice || !lowestPrice) return 0;

    try {
      const price = parseFloat(offerPrice);
      const minPrice = parseFloat(lowestPrice);
      const budget = parseFloat(data.presupuestoGeneral || '0');
      
      const maxScore = data.criteriosAutomaticos?.[0]?.puntuacionMaxima || 70;
      
      if (minPrice === 0 || budget === 0) return 0;
      
      const score = maxScore * (1 - (price - minPrice) / (budget - minPrice));
      
      return Math.max(0, Math.min(maxScore, score));
    } catch (error) {
      console.error('Error calculating economic score:', error);
      return 0;
    }
  };

  const calculateTotalScore = () => {
    const economicScore = calculateEconomicScore();
    
    const subjectiveScore = data.criteriosSubjetivos?.reduce((total: number, criterio: any) => {
      return total + (criterio.puntuacionMaxima * 0.5);
    }, 0) || 0;
    
    const otherScore = data.otrosCriterios?.reduce((total: number, criterio: any) => {
      return total + (criterio.puntuacionMaxima * 0.7);
    }, 0) || 0;
    
    return {
      economicScore: Math.round(economicScore * 100) / 100,
      subjectiveScore: Math.round(subjectiveScore * 100) / 100,
      otherScore: Math.round(otherScore * 100) / 100,
      totalScore: Math.round((economicScore + subjectiveScore + otherScore) * 100) / 100
    };
  };

  const handleCalculate = () => {
    const scores = calculateTotalScore();
    setCalculatedScores(scores);
  };

  const maxPossibleScore = 
    (data.criteriosAutomaticos?.reduce((total: number, c: any) => total + c.puntuacionMaxima, 0) || 0) +
    (data.criteriosSubjetivos?.reduce((total: number, c: any) => total + c.puntuacionMaxima, 0) || 0) +
    (data.otrosCriterios?.reduce((total: number, c: any) => total + c.puntuacionMaxima, 0) || 0);

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
            Análisis de Puntuación
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Calculadora de Puntuación Económica */}
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">💰 Calculadora de Puntuación Económica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offerPrice" className="text-sm md:text-base">Precio de tu Oferta (€)</Label>
                  <Input
                    id="offerPrice"
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Introduce tu precio"
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowestPrice" className="text-sm md:text-base">Precio más Bajo Estimado (€)</Label>
                  <Input
                    id="lowestPrice"
                    type="number"
                    value={lowestPrice}
                    onChange={(e) => setLowestPrice(e.target.value)}
                    placeholder="Precio de la competencia"
                    className="text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm md:text-base">Presupuesto Base de Licitación</Label>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm md:text-base font-medium">
                    €{Number(data.presupuestoGeneral || 0).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm md:text-base">Puntuación Máxima Económica</Label>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm md:text-base font-medium">
                    {data.criteriosAutomaticos?.[0]?.puntuacionMaxima || 70} puntos
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={!offerPrice || !lowestPrice}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm md:text-base py-2 md:py-3"
              >
                Calcular Puntuación
              </Button>
            </CardContent>
          </Card>

          {/* Resultados del Cálculo */}
          {calculatedScores && (
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">🎯 Resultados de Puntuación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Puntuación Total */}
                <div className="text-center p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                  <div className={`text-3xl md:text-5xl font-bold ${getScoreColor(calculatedScores.totalScore, maxPossibleScore)}`}>
                    {calculatedScores.totalScore} / {maxPossibleScore}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">puntos totales</p>
                  <Progress 
                    value={(calculatedScores.totalScore / maxPossibleScore) * 100} 
                    className="w-full h-3 md:h-4 mt-3"
                  />
                </div>

                {/* Desglose por Categorías */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      {calculatedScores.economicScore}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Puntos Económicos</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-green-600">
                      {calculatedScores.subjectiveScore}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Puntos Subjetivos (Est.)</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-purple-600">
                      {calculatedScores.otherScore}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Otros Criterios (Est.)</p>
                  </div>
                </div>

                {/* Evaluación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl md:text-2xl font-semibold text-indigo-600">
                      {Math.round((calculatedScores.totalScore / maxPossibleScore) * 100)}%
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Porcentaje Total</p>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-semibold text-green-600">
                      {calculatedScores.totalScore >= maxPossibleScore * 0.8 ? 'Excelente' : 
                       calculatedScores.totalScore >= maxPossibleScore * 0.6 ? 'Buena' : 'Mejorable'}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Evaluación</p>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-semibold text-orange-600">
                      {maxPossibleScore - calculatedScores.totalScore}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">Puntos Perdidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Criterios de Evaluación */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Criterios Automáticos */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">⚙️ Criterios Automáticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.criteriosAutomaticos && data.criteriosAutomaticos.length > 0 ? (
                    data.criteriosAutomaticos.map((criterio: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-3">
                        <h6 className="font-medium text-xs md:text-sm">{criterio.nombre}</h6>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{criterio.descripcion}</p>
                        <p className="text-xs md:text-sm font-semibold text-blue-600">{criterio.puntuacionMaxima} puntos</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500">No especificados</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Criterios Subjetivos */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">👥 Criterios Subjetivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.criteriosSubjetivos && data.criteriosSubjetivos.length > 0 ? (
                    data.criteriosSubjetivos.map((criterio: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-3">
                        <h6 className="font-medium text-xs md:text-sm">{criterio.nombre}</h6>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{criterio.descripcion}</p>
                        <p className="text-xs md:text-sm font-semibold text-green-600">{criterio.puntuacionMaxima} puntos</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500">No especificados</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Otros Criterios */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">📋 Otros Criterios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.otrosCriterios && data.otrosCriterios.length > 0 ? (
                    data.otrosCriterios.map((criterio: any, index: number) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-3">
                        <h6 className="font-medium text-xs md:text-sm">{criterio.nombre}</h6>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{criterio.descripcion}</p>
                        <p className="text-xs md:text-sm font-semibold text-purple-600">{criterio.puntuacionMaxima} puntos</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500">No especificados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreAnalysisView;
