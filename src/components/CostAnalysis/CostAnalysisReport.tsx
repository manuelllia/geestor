
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Building2, 
  Calendar, 
  Euro, 
  Users, 
  Calculator, 
  Award,
  FileText,
  MapPin,
  Clock,
  ShoppingCart,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';
import type { CostAnalysisData } from '../../hooks/useCostAnalysis';

interface CostAnalysisReportProps {
  data: CostAnalysisData;
}

const CostAnalysisReport: React.FC<CostAnalysisReportProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No hay datos de análisis disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto p-2 md:p-4">
      {/* Header del informe */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-bold">
            <FileText className="w-6 h-6 md:w-8 md:h-8" />
            Informe de Análisis de Costes
          </CardTitle>
          <p className="text-blue-100 text-sm md:text-base mt-2">
            Análisis profesional de licitación de electromedicina
          </p>
        </CardHeader>
      </Card>

      {/* 1. Información General */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-blue-900 dark:text-blue-100">
            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
            1. Información General de la Licitación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">Tipo de Licitación</h4>
                <Badge variant="outline" className="mt-1">
                  {data.informacionGeneral?.tipoLicitacion || 'No especificado'}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">Entidad Contratante</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-1">
                  {data.informacionGeneral?.entidadContratante || 'No especificado'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">Código CPV</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-1 font-mono">
                  {data.informacionGeneral?.codigoCPV || 'No especificado'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Objeto del Contrato</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                {data.informacionGeneral?.objetoContrato || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Detalle de Lotes */}
          {data.informacionGeneral?.lotes && data.informacionGeneral.lotes.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Detalle de Lotes ({data.informacionGeneral.lotes.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.informacionGeneral.lotes.map((lote, index) => (
                    <Card key={index} className="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-3 md:p-4">
                        <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-2">
                          {lote.nombre}
                        </h5>
                        <div className="space-y-2 text-xs md:text-sm">
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>Centro:</strong> {lote.centroAsociado}
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>Presupuesto:</strong> {lote.presupuesto}
                          </p>
                          <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                            {lote.descripcion}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 2. Alcance y Condiciones */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-blue-900 dark:text-blue-100">
            <MapPin className="w-5 h-5 md:w-6 md:h-6" />
            2. Alcance y Condiciones del Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Ámbito Geográfico</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  {data.alcanceCondiciones?.ambitoGeografico || 'No especificado'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Duración del Contrato</h4>
                <div className="space-y-1">
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    <strong>Plazo base:</strong> {data.alcanceCondiciones?.duracionBase || 'No especificado'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    <strong>Inicio:</strong> {data.alcanceCondiciones?.fechaInicio || 'No especificado'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    <strong>Fin:</strong> {data.alcanceCondiciones?.fechaFin || 'No especificado'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Prórrogas</h4>
                <div className="space-y-1">
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    <strong>Máximo:</strong> {data.alcanceCondiciones?.numeroMaximoProrrogas ?? 'No especificado'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    <strong>Duración c/u:</strong> {data.alcanceCondiciones?.duracionCadaProrroga || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {data.alcanceCondiciones?.serviciosIncluidos && data.alcanceCondiciones.serviciosIncluidos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Servicios Incluidos</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {data.alcanceCondiciones.serviciosIncluidos.slice(0, 10).map((servicio, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.alcanceCondiciones?.productosIncluidos && data.alcanceCondiciones.productosIncluidos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Productos Incluidos</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {data.alcanceCondiciones.productosIncluidos.slice(0, 10).map((producto, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {producto}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.alcanceCondiciones?.requisitosTecnicos && data.alcanceCondiciones.requisitosTecnicos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2">Requisitos Técnicos</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                    {data.alcanceCondiciones.requisitosTecnicos.slice(0, 5).map((requisito, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">
                        {requisito}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Cronograma y Plazos */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-blue-900 dark:text-blue-100">
            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            3. Cronograma y Plazos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-2">Límite Ofertas</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm md:text-base">
                {data.cronogramaPlazos?.fechaLimiteOfertas || 'No especificado'}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base mb-2">Apertura Sobres</h4>
              <p className="text-green-700 dark:text-green-300 text-sm md:text-base">
                {data.cronogramaPlazos?.fechaAperturaSobres || 'No especificado'}
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm md:text-base mb-2">Adjudicación</h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm md:text-base">
                {data.cronogramaPlazos?.plazoAdjudicacion || 'No especificado'}
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 md:p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base mb-2">Inicio Ejecución</h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm md:text-base">
                {data.cronogramaPlazos?.fechaInicioEjecucion || 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Análisis Económico */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-blue-900 dark:text-blue-100">
            <Euro className="w-5 h-5 md:w-6 md:h-6" />
            4. Análisis Económico Detallado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Presupuesto Base */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 md:p-6 rounded-xl border border-green-200 dark:border-green-700">
            <h4 className="text-lg md:text-xl font-bold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
              <Euro className="w-5 h-5" />
              Presupuesto Base de Licitación
            </h4>
            <p className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300">
              {data.analisisEconomico?.presupuestoBaseLicitacion || 'No especificado'}
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">(Sin IVA)</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Personal */}
            {data.analisisEconomico?.personal && (
              <Card className="border border-blue-200 dark:border-blue-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg text-blue-900 dark:text-blue-100">
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                    Personal Requerido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg md:text-xl font-semibold text-blue-700 dark:text-blue-300">
                    {data.analisisEconomico.personal.numeroTrabajadores || 0} trabajadores
                  </p>
                  
                  {data.analisisEconomico.personal.desglosePorPuesto && 
                   data.analisisEconomico.personal.desglosePorPuesto.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">Desglose por puesto:</h5>
                      <div className="space-y-2">
                        {data.analisisEconomico.personal.desglosePorPuesto.slice(0, 5).map((puesto, index) => (
                          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-2 md:p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-blue-900 dark:text-blue-100 text-sm md:text-base">
                                  {puesto.puesto}
                                </p>
                                <p className="text-blue-700 dark:text-blue-300 text-xs md:text-sm">
                                  {puesto.perfilRequerido} • {puesto.dedicacion}
                                </p>
                              </div>
                              <div className="text-right ml-2">
                                <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base">
                                  x{puesto.numero}
                                </p>
                                {puesto.costeSalarialEstimado > 0 && (
                                  <p className="text-blue-600 dark:text-blue-400 text-xs md:text-sm">
                                    €{puesto.costeSalarialEstimado.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Compras y Otros Gastos */}
            <Card className="border border-green-200 dark:border-green-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg text-green-900 dark:text-green-100">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  Otros Costes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.analisisEconomico?.compras && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">Compras:</h5>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 md:p-3 rounded-lg space-y-1">
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-green-700 dark:text-green-300">Equipamiento:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">
                          €{data.analisisEconomico.compras.equipamiento?.costeEstimado?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-green-700 dark:text-green-300">Consumibles:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">
                          €{data.analisisEconomico.compras.consumibles?.costeEstimado?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-green-700 dark:text-green-300">Repuestos:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">
                          €{data.analisisEconomico.compras.repuestos?.costeEstimado?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {data.analisisEconomico?.otrosGastos && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">Otros gastos:</h5>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 md:p-3 rounded-lg space-y-1">
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-yellow-700 dark:text-yellow-300">Seguros:</span>
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">
                          €{data.analisisEconomico.otrosGastos.seguros?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-yellow-700 dark:text-yellow-300">Gastos generales:</span>
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">
                          €{data.analisisEconomico.otrosGastos.gastosGenerales?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-yellow-700 dark:text-yellow-300">Costes indirectos:</span>
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">
                          €{data.analisisEconomico.otrosGastos.costesIndirectos?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 5. Criterios de Adjudicación */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-blue-900 dark:text-blue-100">
            <Award className="w-5 h-5 md:w-6 md:h-6" />
            5. Criterios de Adjudicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Puntuaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-2">Puntuación Económica</h4>
              <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">
                {data.criteriosAdjudicacion?.puntuacionMaximaEconomica || 0} puntos
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base mb-2">Puntuación Técnica</h4>
              <p className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300">
                {data.criteriosAdjudicacion?.puntuacionMaximaTecnica || 0} puntos
              </p>
            </div>
          </div>

          {/* Fórmulas Matemáticas */}
          {data.criteriosAdjudicacion?.formulasMatematicas && 
           data.criteriosAdjudicacion.formulasMatematicas.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 md:w-5 md:h-5" />
                Fórmulas Matemáticas Detectadas ({data.criteriosAdjudicacion.formulasMatematicas.length})
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {data.criteriosAdjudicacion.formulasMatematicas.slice(0, 6).map((formula, index) => (
                  <Card key={index} className="border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base">
                          {formula.nombre}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {formula.tipo}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded font-mono text-xs md:text-sm overflow-x-auto">
                          {formula.formulaOriginal}
                        </div>
                        <p className="text-purple-700 dark:text-purple-300 text-xs md:text-sm">
                          {formula.descripcionVariables}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Baja Temeraria */}
          {data.criteriosAdjudicacion?.bajaTemeraria && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
              <h4 className="font-semibold text-red-900 dark:text-red-100 text-base md:text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                Baja Temeraria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-red-700 dark:text-red-300 text-sm md:text-base mb-2">
                    <strong>Umbral:</strong> {data.criteriosAdjudicacion.bajaTemeraria.umbralPorcentaje}
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm md:text-base">
                    {data.criteriosAdjudicacion.bajaTemeraria.descripcion}
                  </p>
                </div>
                {data.criteriosAdjudicacion.bajaTemeraria.formulaCalculo && (
                  <div className="bg-red-100 dark:bg-red-800/30 p-2 md:p-3 rounded">
                    <p className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">Fórmula:</p>
                    <code className="text-red-700 dark:text-red-300 text-xs md:text-sm">
                      {data.criteriosAdjudicacion.bajaTemeraria.formulaCalculo}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Criterios de Evaluación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Criterios Automáticos */}
            {data.criteriosAdjudicacion?.criteriosAutomaticos && 
             data.criteriosAdjudicacion.criteriosAutomaticos.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  Criterios Automáticos ({data.criteriosAdjudicacion.criteriosAutomaticos.length})
                </h4>
                <div className="space-y-2 md:space-y-3 max-h-64 md:max-h-80 overflow-y-auto">
                  {data.criteriosAdjudicacion.criteriosAutomaticos.slice(0, 8).map((criterio, index) => (
                    <Card key={index} className="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-green-900 dark:text-green-100 text-sm md:text-base">
                            {criterio.nombre}
                          </h5>
                          <Badge variant="secondary" className="text-xs">
                            {criterio.puntuacionMaxima} pts
                          </Badge>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-xs md:text-sm">
                          {criterio.descripcion}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Criterios Subjetivos */}
            {data.criteriosAdjudicacion?.criteriosSubjetivos && 
             data.criteriosAdjudicacion.criteriosSubjetivos.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                  Criterios Subjetivos ({data.criteriosAdjudicacion.criteriosSubjetivos.length})
                </h4>
                <div className="space-y-2 md:space-y-3 max-h-64 md:max-h-80 overflow-y-auto">
                  {data.criteriosAdjudicacion.criteriosSubjetivos.slice(0, 8).map((criterio, index) => (
                    <Card key={index} className="border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-orange-900 dark:text-orange-100 text-sm md:text-base">
                            {criterio.nombre}
                          </h5>
                          <Badge variant="secondary" className="text-xs">
                            {criterio.puntuacionMaxima} pts
                          </Badge>
                        </div>
                        <p className="text-orange-700 dark:text-orange-300 text-xs md:text-sm">
                          {criterio.descripcion}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Otros Criterios */}
          {data.criteriosAdjudicacion?.otrosCriterios && 
           data.criteriosAdjudicacion.otrosCriterios.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                Otros Criterios ({data.criteriosAdjudicacion.otrosCriterios.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.criteriosAdjudicacion.otrosCriterios.slice(0, 6).map((criterio, index) => (
                  <Card key={index} className="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 text-sm md:text-base">
                          {criterio.nombre}
                        </h5>
                        <Badge variant="secondary" className="text-xs">
                          {criterio.puntuacionMaxima} pts
                        </Badge>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-xs md:text-sm">
                        {criterio.descripcion}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer del informe */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-0">
        <CardContent className="p-4 md:p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
            📊 Informe generado por GEESTOR V.2.0 - Sistema de Análisis de Licitaciones con IA
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
            Análisis realizado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostAnalysisReport;
