import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface CostAnalysisReportProps {
  data: any;
}

const CostAnalysisReport: React.FC<CostAnalysisReportProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos de análisis disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Información General */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">📊 Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Presupuesto General:</label>
              <p className="text-lg md:text-xl font-semibold text-blue-600">
                €{Number(data.presupuestoGeneral || 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dividida por Lotes:</label>
              <Badge variant={data.esPorLotes ? "default" : "secondary"} className="text-xs md:text-sm">
                {data.esPorLotes ? "Sí" : "No"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Umbral Baja Temeraria:</label>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {data.umbralBajaTemeraria}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lotes */}
      {data.esPorLotes && data.lotes && data.lotes.length > 0 && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">📦 Lotes Identificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.lotes.map((lote: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 md:p-4 bg-gray-50 dark:bg-gray-700">
                  <h4 className="font-semibold text-sm md:text-lg mb-2">{lote.nombre}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                    <div>
                      <span className="font-medium">Centro:</span> {lote.centroAsociado}
                    </div>
                    <div>
                      <span className="font-medium">Presupuesto:</span> €{Number(lote.presupuesto || 0).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2">{lote.descripcion}</p>
                  {lote.requisitosClave && lote.requisitosClave.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium text-xs md:text-sm">Requisitos:</span>
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

      {/* Variables Dinámicas */}
      {data.variablesDinamicas && data.variablesDinamicas.length > 0 && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">🔢 Variables Dinámicas Identificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {data.variablesDinamicas.map((variable: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/30">
                  <h5 className="font-semibold text-sm md:text-base">{variable.nombre}</h5>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{variable.descripcion}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded mt-2 inline-block">
                    {variable.mapeo}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fórmulas Detectadas */}
      {data.formulasDetectadas && data.formulasDetectadas.length > 0 && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">🧮 Fórmulas Matemáticas Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {data.formulasDetectadas.map((formula: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 md:p-4 bg-purple-50 dark:bg-purple-900/30">
                  <h5 className="font-semibold mb-3 text-sm md:text-base">Fórmula {index + 1}</h5>
                  <div className="space-y-2 md:space-y-3">
                    <div>
                      <span className="font-medium text-xs md:text-sm">Original:</span>
                      <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs md:text-sm break-all">
                        {formula.formulaOriginal}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium text-xs md:text-sm">LaTeX:</span>
                      <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs md:text-sm break-all">
                        {formula.representacionLatex}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium text-xs md:text-sm">Variables:</span>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        {formula.descripcionVariables}
                      </p>
                    </div>
                    {formula.condicionesLogicas && (
                      <div>
                        <span className="font-medium text-xs md:text-sm">Condiciones:</span>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          {formula.condicionesLogicas}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
  );
};

export default CostAnalysisReport;
