import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { CostAnalysisData } from '../../hooks/useCostAnalysis';
import { 
  FileText, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Calendar,
  MapPin,
  Award,
  Calculator,
  AlertTriangle,
  TrendingUp,
  Clock,
  Building,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface ImprovedCostAnalysisReportProps {
  analysisData: CostAnalysisData;
  language: Language;
}

const ImprovedCostAnalysisReport: React.FC<ImprovedCostAnalysisReportProps> = ({
  analysisData,
  language
}) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('general');

  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto w-12 h-12 text-yellow-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'es' ? 'No hay datos de análisis disponibles' : 'No analysis data available'}
        </p>
      </div>
    );
  }

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
    if (isNaN(numValue)) return value;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(numValue);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'No especificado') return dateStr;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Informe */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">{t('analysisReport')}</h1>
            <p className="text-blue-100">
              {analysisData.informacionGeneral?.objetoContrato || 'Análisis de Licitación'}
            </p>
          </div>
        </div>
        
        {/* Datos clave en header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Building className="w-4 h-4" />
              <span className="text-sm">{t('contractingEntity')}</span>
            </div>
            <span className="font-semibold">
              {analysisData.informacionGeneral?.entidadContratante || 'No especificado'}
            </span>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{t('baseBudget')}</span>
            </div>
            <span className="font-semibold">
              {formatCurrency(analysisData.analisisEconomico?.presupuestoBaseLicitacion || '0')}
            </span>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{t('contractDuration')}</span>
            </div>
            <span className="font-semibold">
              {analysisData.alcanceCondiciones?.duracionBase || 'No especificado'}
            </span>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">{t('generalInformation')}</TabsTrigger>
          <TabsTrigger value="economic">{t('economicAnalysis')}</TabsTrigger>
          <TabsTrigger value="criteria">{t('awardCriteria')}</TabsTrigger>
          <TabsTrigger value="scope">{t('scopeConditions')}</TabsTrigger>
          <TabsTrigger value="schedule">{t('scheduleDeadlines')}</TabsTrigger>
          <TabsTrigger value="formulas">Fórmulas</TabsTrigger>
        </TabsList>

        {/* Información General */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Detalles del Contrato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('contractType')}</label>
                  <p className="text-sm">{analysisData.informacionGeneral?.tipoLicitacion || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('cpvCode')}</label>
                  <p className="text-sm">{analysisData.informacionGeneral?.codigoCPV || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('contractObject')}</label>
                  <p className="text-sm">{analysisData.informacionGeneral?.objetoContrato || 'No especificado'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Lotes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Lotes del Contrato
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.informacionGeneral?.lotes && analysisData.informacionGeneral.lotes.length > 0 ? (
                  <div className="space-y-3">
                    {analysisData.informacionGeneral.lotes.map((lote, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{lote.nombre}</h4>
                          <Badge variant="outline">{formatCurrency(lote.presupuesto)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{lote.descripcion}</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{lote.centroAsociado}</span>
                        </div>
                        {lote.requisitosClaves && lote.requisitosClaves.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium">Requisitos clave:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {lote.requisitosClaves.map((req, reqIndex) => (
                                <Badge key={reqIndex} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Licitación sin división en lotes</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análisis Económico */}
        <TabsContent value="economic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Análisis de Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('personnelAnalysis')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.analisisEconomico?.personal ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total trabajadores:</span>
                        <Badge variant="outline">
                          {analysisData.analisisEconomico.personal.numeroTrabajadores || 0}
                        </Badge>
                      </div>
                    </div>
                    
                    {analysisData.analisisEconomico.personal.desglosePorPuesto && 
                     analysisData.analisisEconomico.personal.desglosePorPuesto.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Desglose por puesto:</h4>
                        {analysisData.analisisEconomico.personal.desglosePorPuesto.map((puesto, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-semibold">{puesto.puesto}</h5>
                                <p className="text-sm text-gray-600">{puesto.perfilRequerido}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{puesto.numero} personas</Badge>
                                <p className="text-sm mt-1">{puesto.dedicacion}</p>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Coste estimado: </span>
                              {formatCurrency(puesto.costeSalarialEstimado)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay datos de personal disponibles</p>
                )}
              </CardContent>
            </Card>

            {/* Análisis de Compras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('purchaseAnalysis')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.analisisEconomico?.compras ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{t('equipment')}</span>
                          <Badge variant="outline">
                            {formatCurrency(analysisData.analisisEconomico.compras.equipamiento?.costeEstimado || 0)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {analysisData.analisisEconomico.compras.equipamiento?.descripcion || 'No especificado'}
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{t('consumables')}</span>
                          <Badge variant="outline">
                            {formatCurrency(analysisData.analisisEconomico.compras.consumibles?.costeEstimado || 0)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {analysisData.analisisEconomico.compras.consumibles?.descripcion || 'No especificado'}
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{t('spareParts')}</span>
                          <Badge variant="outline">
                            {formatCurrency(analysisData.analisisEconomico.compras.repuestos?.costeEstimado || 0)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {analysisData.analisisEconomico.compras.repuestos?.descripcion || 'No especificado'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay datos de compras disponibles</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subcontrataciones y Otros Gastos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {t('subcontractingAnalysis')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.analisisEconomico?.subcontrataciones ? (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Coste estimado:</span>
                        <Badge variant="outline">
                          {formatCurrency(analysisData.analisisEconomico.subcontrataciones.costeEstimado || 0)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {analysisData.analisisEconomico.subcontrataciones.limites}
                      </p>
                    </div>
                    
                    {analysisData.analisisEconomico.subcontrataciones.serviciosExternalizables && 
                     analysisData.analisisEconomico.subcontrataciones.serviciosExternalizables.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Servicios externalizables:</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisData.analisisEconomico.subcontrataciones.serviciosExternalizables.map((servicio, index) => (
                            <Badge key={index} variant="secondary">{servicio}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay datos de subcontratación</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('otherExpenses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisData.analisisEconomico?.otrosGastos ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>{t('insurance')}</span>
                      <Badge variant="outline">
                        {formatCurrency(analysisData.analisisEconomico.otrosGastos.seguros || 0)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>{t('generalExpenses')}</span>
                      <Badge variant="outline">
                        {formatCurrency(analysisData.analisisEconomico.otrosGastos.gastosGenerales || 0)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>{t('indirectCosts')}</span>
                      <Badge variant="outline">
                        {formatCurrency(analysisData.analisisEconomico.otrosGastos.costesIndirectos || 0)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay datos de otros gastos</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Criterios de Adjudicación */}
        <TabsContent value="criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t('awardCriteria')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.criteriosAdjudicacion ? (
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Puntuación Máxima Económica:</span> {analysisData.criteriosAdjudicacion.puntuacionMaximaEconomica || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Puntuación Máxima Técnica:</span> {analysisData.criteriosAdjudicacion.puntuacionMaximaTecnica || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Umbral de Baja Temeraria:</span> {analysisData.criteriosAdjudicacion.bajaTemeraria?.descripcion || 'No especificado'}
                  </div>

                  {/* Criterios Automáticos */}
                  {analysisData.criteriosAdjudicacion.criteriosAutomaticos && analysisData.criteriosAdjudicacion.criteriosAutomaticos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Criterios Automáticos</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisData.criteriosAdjudicacion.criteriosAutomaticos.map((criterio, index) => (
                          <li key={index}>
                            <strong>{criterio.nombre}</strong>: {criterio.descripcion} (Puntuación máxima: {criterio.puntuacionMaxima})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Criterios Subjetivos */}
                  {analysisData.criteriosAdjudicacion.criteriosSubjetivos && analysisData.criteriosAdjudicacion.criteriosSubjetivos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Criterios Subjetivos</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisData.criteriosAdjudicacion.criteriosSubjetivos.map((criterio, index) => (
                          <li key={index}>
                            <strong>{criterio.nombre}</strong>: {criterio.descripcion} (Puntuación máxima: {criterio.puntuacionMaxima})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Otros Criterios */}
                  {analysisData.criteriosAdjudicacion.otrosCriterios && analysisData.criteriosAdjudicacion.otrosCriterios.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Otros Criterios</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisData.criteriosAdjudicacion.otrosCriterios.map((criterio, index) => (
                          <li key={index}>
                            <strong>{criterio.nombre}</strong>: {criterio.descripcion} (Puntuación máxima: {criterio.puntuacionMaxima})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de criterios de adjudicación</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alcance y Condiciones */}
        <TabsContent value="scope" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t('scopeConditions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.alcanceCondiciones ? (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Ámbito Geográfico:</span> {analysisData.alcanceCondiciones.ambitoGeografico || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Servicios Incluidos:</span> {analysisData.alcanceCondiciones.serviciosIncluidos?.join(', ') || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Productos Incluidos:</span> {analysisData.alcanceCondiciones.productosIncluidos?.join(', ') || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Requisitos Técnicos:</span> {analysisData.alcanceCondiciones.requisitosTecnicos?.join(', ') || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Exclusiones:</span> {analysisData.alcanceCondiciones.exclusiones?.join(', ') || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Prórrogas:</span> {analysisData.alcanceCondiciones.numeroMaximoProrrogas || 0} veces, duración cada prórroga: {analysisData.alcanceCondiciones.duracionCadaProrroga || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Modificaciones:</span> {analysisData.alcanceCondiciones.porcentajeMaximoModificacion || 'No especificado'}, casos: {analysisData.alcanceCondiciones.casosModificacion?.join(', ') || 'No especificado'}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de alcance y condiciones</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cronograma y Plazos */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('scheduleDeadlines')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.cronogramaPlazos ? (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Fecha límite para presentar ofertas:</span> {formatDate(analysisData.cronogramaPlazos.fechaLimiteOfertas)}
                  </div>
                  <div>
                    <span className="font-medium">Fecha de apertura de sobres:</span> {formatDate(analysisData.cronogramaPlazos.fechaAperturaSobres)}
                  </div>
                  <div>
                    <span className="font-medium">Plazo de adjudicación:</span> {analysisData.cronogramaPlazos.plazoAdjudicacion || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium">Fecha de inicio de ejecución:</span> {formatDate(analysisData.cronogramaPlazos.fechaInicioEjecucion)}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de cronograma y plazos</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nueva pestaña de Fórmulas mejorada */}
        <TabsContent value="formulas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {t('formulasDetected')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisData.criteriosAdjudicacion?.formulasMatematicas && 
               analysisData.criteriosAdjudicacion.formulasMatematicas.length > 0 ? (
                <div className="space-y-4">
                  {analysisData.criteriosAdjudicacion.formulasMatematicas.map((formula, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{formula.nombre}</h4>
                        <Badge variant={formula.tipo === 'economica' ? 'default' : 'secondary'}>
                          {formula.tipo}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Fórmula original:</span>
                          <code className="block bg-white dark:bg-gray-900 p-2 rounded text-sm mt-1 border">
                            {formula.formulaOriginal}
                          </code>
                        </div>
                        
                        {formula.representacionLatex && (
                          <div>
                            <span className="text-sm font-medium">Representación LaTeX:</span>
                            <code className="block bg-white dark:bg-gray-900 p-2 rounded text-sm mt-1 border">
                              {formula.representacionLatex}
                            </code>
                          </div>
                        )}
                        
                        {formula.descripcionVariables && (
                          <div>
                            <span className="text-sm font-medium">Variables:</span>
                            <p className="text-sm text-gray-600 mt-1">{formula.descripcionVariables}</p>
                          </div>
                        )}
                        
                        {formula.condicionesLogicas && (
                          <div>
                            <span className="text-sm font-medium">Condiciones:</span>
                            <p className="text-sm text-gray-600 mt-1">{formula.condicionesLogicas}</p>
                          </div>
                        )}
                        
                        {formula.ejemploAplicacion && (
                          <div>
                            <span className="text-sm font-medium">Ejemplo:</span>
                            <p className="text-sm text-gray-600 mt-1">{formula.ejemploAplicacion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No se detectaron fórmulas en el análisis</p>
              )}
            </CardContent>
          </Card>

          {/* Variables de Fórmula */}
          {analysisData.criteriosAdjudicacion?.variablesFormula && 
           analysisData.criteriosAdjudicacion.variablesFormula.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variables de Fórmula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisData.criteriosAdjudicacion.variablesFormula.map((variable, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold">{variable.nombre}</h5>
                        <Badge variant="outline">{variable.mapeo}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{variable.descripcion}</p>
                      {variable.valorEjemplo && (
                        <div className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          <span className="font-medium">Ejemplo: </span>
                          {variable.valorEjemplo}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImprovedCostAnalysisReport;
