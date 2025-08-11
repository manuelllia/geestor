
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface BidAnalysisResultsProps {
  analysisData: any;
}

const BidAnalysisResults: React.FC<BidAnalysisResultsProps> = ({ analysisData }) => {
  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos de análisis disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Análisis de Licitación Completado</h1>
        <p className="text-green-100 text-lg">
          Resultados del análisis automático con IA
        </p>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Presupuesto General:</label>
              <p className="text-lg font-semibold text-blue-600">€{Number(analysisData.presupuestoGeneral || 0).toLocaleString()}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Dividida por Lotes:</label>
              <Badge variant={analysisData.esPorLotes ? "default" : "secondary"}>
                {analysisData.esPorLotes ? "Sí" : "No"}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300">Umbral Baja Temeraria:</label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{analysisData.umbralBajaTemeraria}</p>
          </div>
        </CardContent>
      </Card>

      {/* Lotes */}
      {analysisData.esPorLotes && analysisData.lotes && analysisData.lotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📦 Lotes Identificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.lotes.map((lote: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold text-lg mb-2">{lote.nombre}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Centro:</span> {lote.centroAsociado}
                    </div>
                    <div>
                      <span className="font-medium">Presupuesto:</span> €{Number(lote.presupuesto || 0).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{lote.descripcion}</p>
                  {lote.requisitosClave && lote.requisitosClave.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium text-sm">Requisitos:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lote.requisitosClave.map((req: string, reqIndex: number) => (
                          <Badge key={reqIndex} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fórmulas Detectadas */}
      {analysisData.formulasDetectadas && analysisData.formulasDetectadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🧮 Fórmulas Matemáticas Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysisData.formulasDetectadas.map((formula: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/30">
                  <h5 className="font-semibold mb-3">Fórmula {index + 1}</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Original:</span>
                      <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        {formula.formulaOriginal}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">LaTeX:</span>
                      <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        {formula.representacionLatex}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Variables:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formula.descripcionVariables}</p>
                    </div>
                    {formula.condicionesLogicas && (
                      <div>
                        <span className="font-medium">Condiciones:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formula.condicionesLogicas}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Criterios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Criterios Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚙️ Criterios Automáticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisData.criteriosAutomaticos && analysisData.criteriosAutomaticos.length > 0 ? (
                analysisData.criteriosAutomaticos.map((criterio: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <h6 className="font-medium">{criterio.nombre}</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{criterio.descripcion}</p>
                    <p className="text-sm font-semibold text-blue-600">{criterio.puntuacionMaxima} puntos</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No especificados</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Criterios Subjetivos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">👥 Criterios Subjetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisData.criteriosSubjetivos && analysisData.criteriosSubjetivos.length > 0 ? (
                analysisData.criteriosSubjetivos.map((criterio: any, index: number) => (
                  <div key={index} className="border-l-4 border-green-500 pl-3">
                    <h6 className="font-medium">{criterio.nombre}</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{criterio.descripcion}</p>
                    <p className="text-sm font-semibold text-green-600">{criterio.puntuacionMaxima} puntos</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No especificados</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Otros Criterios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 Otros Criterios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisData.otrosCriterios && analysisData.otrosCriterios.length > 0 ? (
                analysisData.otrosCriterios.map((criterio: any, index: number) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-3">
                    <h6 className="font-medium">{criterio.nombre}</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{criterio.descripcion}</p>
                    <p className="text-sm font-semibold text-purple-600">{criterio.puntuacionMaxima} puntos</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No especificados</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BidAnalysisResults;
