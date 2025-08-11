import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

interface TotalScoreCalculatorProps {
  analysisData: any;
}

const TotalScoreCalculator: React.FC<TotalScoreCalculatorProps> = ({ analysisData }) => {
  const [economicScore, setEconomicScore] = useState('');
  const [subjectiveScores, setSubjectiveScores] = useState<Record<string, string>>({});
  const [otherScores, setOtherScores] = useState<Record<string, string>>({});
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [maxPossibleScore, setMaxPossibleScore] = useState<number>(0);

  // Calculate max possible score
  React.useEffect(() => {
    let max = 0;
    
    // Economic criteria
    if (analysisData?.criteriosAutomaticos) {
      analysisData.criteriosAutomaticos.forEach((criterio: any) => {
        max += criterio.puntuacionMaxima || 0;
      });
    }
    
    // Subjective criteria
    if (analysisData?.criteriosSubjetivos) {
      analysisData.criteriosSubjetivos.forEach((criterio: any) => {
        max += criterio.puntuacionMaxima || 0;
      });
    }
    
    // Other criteria
    if (analysisData?.otrosCriterios) {
      analysisData.otrosCriterios.forEach((criterio: any) => {
        max += criterio.puntuacionMaxima || 0;
      });
    }
    
    setMaxPossibleScore(max);
  }, [analysisData]);

  const handleSubjectiveScoreChange = (criterio: string, value: string) => {
    setSubjectiveScores(prev => ({
      ...prev,
      [criterio]: value
    }));
  };

  const handleOtherScoreChange = (criterio: string, value: string) => {
    setOtherScores(prev => ({
      ...prev,
      [criterio]: value
    }));
  };

  const calculateTotalScore = () => {
    let total = 0;
    
    // Economic score
    total += parseFloat(economicScore) || 0;
    
    // Subjective scores
    Object.values(subjectiveScores).forEach(score => {
      total += parseFloat(score) || 0;
    });
    
    // Other scores
    Object.values(otherScores).forEach(score => {
      total += parseFloat(score) || 0;
    });
    
    setTotalScore(Math.round(total * 100) / 100);
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Calculadora de Puntuación Total</h1>
        <p className="text-indigo-100 text-lg">
          Calcula tu puntuación total combinando todos los criterios
        </p>
      </div>

      {/* Resumen de Criterios */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Resumen de Criterios de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Criterios Automáticos */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Criterios Automáticos</h4>
              {analysisData?.criteriosAutomaticos?.map((criterio: any, index: number) => (
                <div key={index} className="text-sm mb-1">
                  {criterio.nombre}: <span className="font-medium">{criterio.puntuacionMaxima} pts</span>
                </div>
              ))}
            </div>

            {/* Criterios Subjetivos */}
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Criterios Subjetivos</h4>
              {analysisData?.criteriosSubjetivos?.map((criterio: any, index: number) => (
                <div key={index} className="text-sm mb-1">
                  {criterio.nombre}: <span className="font-medium">{criterio.puntuacionMaxima} pts</span>
                </div>
              ))}
            </div>

            {/* Otros Criterios */}
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Otros Criterios</h4>
              {analysisData?.otrosCriterios && analysisData.otrosCriterios.length > 0 ? (
                analysisData.otrosCriterios.map((criterio: any, index: number) => (
                  <div key={index} className="text-sm mb-1">
                    {criterio.nombre}: <span className="font-medium">{criterio.puntuacionMaxima} pts</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No hay otros criterios</div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Puntuación Máxima Posible:</span>
              <span className="text-xl font-bold text-indigo-600">{maxPossibleScore} puntos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Introducir Puntuaciones */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Introduce tus Puntuaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Puntuación Económica */}
          <div>
            <Label htmlFor="economicScore">Puntuación Económica</Label>
            <Input
              id="economicScore"
              type="number"
              value={economicScore}
              onChange={(e) => setEconomicScore(e.target.value)}
              placeholder="Puntos económicos obtenidos"
              max={analysisData?.criteriosAutomaticos?.[0]?.puntuacionMaxima || 100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo: {analysisData?.criteriosAutomaticos?.[0]?.puntuacionMaxima || 0} puntos
            </p>
          </div>

          {/* Criterios Subjetivos */}
          {analysisData?.criteriosSubjetivos && analysisData.criteriosSubjetivos.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Criterios Subjetivos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.criteriosSubjetivos.map((criterio: any, index: number) => (
                  <div key={index}>
                    <Label htmlFor={`subjective-${index}`}>{criterio.nombre}</Label>
                    <Input
                      id={`subjective-${index}`}
                      type="number"
                      value={subjectiveScores[criterio.nombre] || ''}
                      onChange={(e) => handleSubjectiveScoreChange(criterio.nombre, e.target.value)}
                      placeholder={`Max: ${criterio.puntuacionMaxima} pts`}
                      max={criterio.puntuacionMaxima}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Otros Criterios */}
          {analysisData?.otrosCriterios && analysisData.otrosCriterios.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Otros Criterios</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.otrosCriterios.map((criterio: any, index: number) => (
                  <div key={index}>
                    <Label htmlFor={`other-${index}`}>{criterio.nombre}</Label>
                    <Input
                      id={`other-${index}`}
                      type="number"
                      value={otherScores[criterio.nombre] || ''}
                      onChange={(e) => handleOtherScoreChange(criterio.nombre, e.target.value)}
                      placeholder={`Max: ${criterio.puntuacionMaxima} pts`}
                      max={criterio.puntuacionMaxima}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={calculateTotalScore}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Calcular Puntuación Total
          </Button>
        </CardContent>
      </Card>

      {/* Resultado */}
      {totalScore !== null && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 Resultado Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(totalScore, maxPossibleScore)}`}>
                  {totalScore} / {maxPossibleScore}
                </div>
                <p className="text-gray-600 dark:text-gray-400">puntos totales</p>
              </div>

              <Progress 
                value={(totalScore / maxPossibleScore) * 100} 
                className="w-full h-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-blue-600">
                    {Math.round((totalScore / maxPossibleScore) * 100)}%
                  </div>
                  <p className="text-sm text-gray-500">Porcentaje Total</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-green-600">
                    {totalScore >= maxPossibleScore * 0.8 ? 'Excelente' : 
                     totalScore >= maxPossibleScore * 0.6 ? 'Buena' : 'Mejorable'}
                  </div>
                  <p className="text-sm text-gray-500">Evaluación</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-purple-600">
                    {maxPossibleScore - totalScore}
                  </div>
                  <p className="text-sm text-gray-500">Puntos Perdidos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TotalScoreCalculator;
