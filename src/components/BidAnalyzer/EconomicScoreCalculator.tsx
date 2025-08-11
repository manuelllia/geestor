
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface EconomicScoreCalculatorProps {
  analysisData: any;
}

const EconomicScoreCalculator: React.FC<EconomicScoreCalculatorProps> = ({ analysisData }) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [lowestPrice, setLowestPrice] = useState('');
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const calculateScore = () => {
    if (!analysisData?.formulaEconomica || !offerPrice || !lowestPrice) return;

    try {
      // Parse the economic formula AST
      const ast = JSON.parse(analysisData.formulaEconomica);
      
      // Create variable mapping
      const variables: Record<string, number> = {};
      
      // Map dynamic variables
      if (analysisData.variablesDinamicas) {
        analysisData.variablesDinamicas.forEach((variable: any) => {
          switch (variable.mapeo) {
            case 'price':
              variables[variable.nombre] = parseFloat(offerPrice);
              break;
            case 'tenderBudget':
              variables[variable.nombre] = parseFloat(analysisData.presupuestoGeneral || '0');
              break;
            case 'lowestPrice':
              variables[variable.nombre] = parseFloat(lowestPrice);
              break;
            case 'maxScore':
              variables[variable.nombre] = 70; // Default max score
              break;
            default:
              variables[variable.nombre] = 0;
          }
        });
      }

      // Simple AST evaluator (basic implementation)
      const evaluateAST = (node: any): number => {
        switch (node.type) {
          case 'literal':
            return node.value;
          case 'variable':
            return variables[node.name] || 0;
          case 'binary_operation':
            const left = evaluateAST(node.left);
            const right = evaluateAST(node.right);
            switch (node.operator) {
              case '+': return left + right;
              case '-': return left - right;
              case '*': return left * right;
              case '/': return right !== 0 ? left / right : 0;
              default: return 0;
            }
          default:
            return 0;
        }
      };

      const score = evaluateAST(ast);
      setCalculatedScore(Math.round(score * 100) / 100);
    } catch (error) {
      console.error('Error calculating score:', error);
      setCalculatedScore(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Calculadora de Puntos Económicos</h1>
        <p className="text-purple-100 text-lg">
          Calcula tu puntuación económica basada en la fórmula de la licitación
        </p>
      </div>

      {/* Fórmula Económica */}
      {analysisData?.formulaEconomica && analysisData.formulaEconomica !== '{}' && (
        <Card>
          <CardHeader>
            <CardTitle>🧮 Fórmula Económica</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisData.formulasDetectadas && analysisData.formulasDetectadas.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Fórmula Principal:</h4>
                <code className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm block">
                  {analysisData.formulasDetectadas[0]?.formulaOriginal || 'Fórmula no disponible'}
                </code>
                {analysisData.formulasDetectadas[0]?.descripcionVariables && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Variables:</strong> {analysisData.formulasDetectadas[0].descripcionVariables}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Variables Dinámicas */}
      {analysisData?.variablesDinamicas && analysisData.variablesDinamicas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Variables Identificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.variablesDinamicas.map((variable: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                  <h5 className="font-semibold">{variable.nombre}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{variable.descripcion}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    {variable.mapeo}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculadora */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Cálculo de Puntuación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offerPrice">Precio de tu Oferta (€)</Label>
              <Input
                id="offerPrice"
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="Introduce tu precio"
              />
            </div>
            <div>
              <Label htmlFor="lowestPrice">Precio más Bajo Conocido (€)</Label>
              <Input
                id="lowestPrice"
                type="number"
                value={lowestPrice}
                onChange={(e) => setLowestPrice(e.target.value)}
                placeholder="Precio de la competencia"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Presupuesto Base de Licitación</Label>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                €{Number(analysisData?.presupuestoGeneral || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Puntuación Máxima Económica</Label>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                {analysisData?.criteriosAutomaticos?.find((c: any) => 
                  c.nombre.toLowerCase().includes('precio') || 
                  c.nombre.toLowerCase().includes('económic')
                )?.puntuacionMaxima || 70} puntos
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateScore}
            disabled={!offerPrice || !lowestPrice}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Calcular Puntuación Económica
          </Button>

          {calculatedScore !== null && (
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Resultado del Cálculo
              </h4>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {calculatedScore} puntos
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Puntuación económica estimada para tu oferta
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomicScoreCalculator;
