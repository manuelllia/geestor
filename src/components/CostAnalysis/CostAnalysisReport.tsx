
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Calendar, Users, GraduationCap, Euro, FileText, Clock, MapPin, 
  Building, ShieldCheck, Calculator, TrendingUp, AlertTriangle,
  CheckCircle, Target, Briefcase, DollarSign, Award, Settings
} from 'lucide-react';

interface CostAnalysisData {
  licitacionInfo: {
    tipoLicitacion: string;
    objetoContrato: string;
    entidadContratante: string;
    codigoCPV: string;
    fechaInscripcion: string;
    plazoLimite: string;
    fechaAperturaSobres: string;
    plazoAdjudicacion: string;
    fechaInicioEjecucion: string;
    numeroLotes: number;
    valorEstimado: string;
    criteriosSeleccion: string[];
  };
  
  alcanceCondiciones: {
    ambitoGeografico: string;
    serviciosIncluidos: string[];
    productosIncluidos: string[];
    requisitosTecnicos: string[];
    exclusiones: string[];
    duracionBase: string;
    fechaInicio: string;
    fechaFin: string;
    numeroMaximoProrrogas: number;
    duracionCadaProrroga: string;
    condicionesProrroga: string[];
    porcentajeMaximoModificacion: string;
    casosModificacion: string[];
  };

  personalRequerido: {
    totalPersonas: number;
    personalPorLote: { lote: string; personas: number; centro: string }[];
    desglosePorPuesto: Array<{
      puesto: string;
      numero: number;
      perfil: string;
      dedicacion: string;
      costeSalarialEstimado: number;
    }>;
    estudiosRequeridos: string[];
    experienciaMinima: string;
    estimacionCostePorPersona: number;
    costoTotalEstimado: number;
  };

  analisisEconomico: {
    presupuestoBaseLicitacion: string;
    desgloseCostes: {
      personal: {
        totalCostePersonal: number;
        desglosePorPuesto: Array<{
          puesto: string;
          numero: number;
          costeMensual: number;
          costeAnual: number;
        }>;
      };
      compras: {
        equipamiento: number;
        consumibles: number;
        repuestos: number;
        totalCompras: number;
      };
      subcontrataciones: {
        serviciosExternalizables: string[];
        limiteSubcontratacion: string;
        costeEstimadoSubcontratacion: number;
      };
      otrosGastos: {
        seguros: number;
        gastosGenerales: number;
        costesIndirectos: number;
        totalOtrosGastos: number;
      };
    };
    costoTotalProyecto: number;
    rentabilidadEstimada: number;
  };

  criteriosAdjudicacion: {
    puntuacionMaximaEconomica: number;
    puntuacionMaximaTecnica: number;
    puntuacionTotal: number;
    
    formulasDetectadas: Array<{
      nombre: string;
      tipo: 'economica' | 'tecnica' | 'mejora' | 'penalizacion' | 'umbral';
      formulaOriginal: string;
      representacionLatex: string;
      descripcionVariables: string;
      condicionesLogicas: string;
      ejemploAplicacion: string;
    }>;
    
    variablesDinamicas: Array<{
      nombre: string;
      descripcion: string;
      mapeo: 'price' | 'tenderBudget' | 'maxScore' | 'lowestPrice' | 'averagePrice';
      valorEjemplo: string;
    }>;
    
    formulaEconomicaAST: string;
    
    bajaTemeraria: {
      descripcion: string;
      umbralPorcentaje: string;
      formulaCalculo: string;
      procedimientoVerificacion: string[];
    };
    
    criteriosAutomaticos: Array<{
      nombre: string;
      descripcion: string;
      puntuacionMaxima: number;
      verificacion: string;
      documentacionRequerida: string[];
    }>;
    
    criteriosSubjetivos: Array<{
      nombre: string;
      descripcion: string;
      puntuacionMaxima: number;
      aspectosEvaluar: string[];
      criteriosCalificacion: string[];
    }>;
    
    mejoras: Array<{
      nombre: string;
      descripcion: string;
      puntuacionMaxima: number;
      valoracionEconomica: string;
      requisitos: string[];
    }>;
  };

  detallesAdicionales: {
    ubicacion: string;
    duracionContrato: string;
    condicionesEspeciales: string[];
    garantias: Array<{
      tipo: string;
      porcentaje: string;
      duracion: string;
    }>;
    penalizaciones: Array<{
      concepto: string;
      importe: string;
      condiciones: string;
    }>;
    documentacionRequerida: string[];
  };
}

interface CostAnalysisReportProps {
  data: CostAnalysisData;
}

const CostAnalysisReport: React.FC<CostAnalysisReportProps> = ({ data }) => {
  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Resumen Ejecutivo */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5 md:w-6 md:h-6" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-blue-100 text-xs md:text-sm font-medium">Valor Estimado</p>
              <p className="text-lg md:text-2xl font-bold">
                {data.licitacionInfo?.valorEstimado || 'No especificado'}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-blue-100 text-xs md:text-sm font-medium">Personal Requerido</p>
              <p className="text-lg md:text-2xl font-bold">
                {data.personalRequerido?.totalPersonas || 0} personas
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 md:p-4">
              <p className="text-blue-100 text-xs md:text-sm font-medium">Duración</p>
              <p className="text-lg md:text-2xl font-bold">
                {data.alcanceCondiciones?.duracionBase || 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información General de la Licitación */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <FileText className="w-5 h-5 md:w-6 md:h-6" />
            1. Información General de la Licitación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 md:p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-2">Tipo de Licitación</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base">
                  {data.licitacionInfo?.tipoLicitacion || 'No especificado'}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 md:p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base mb-2">Entidad Contratante</h4>
                <p className="text-green-800 dark:text-green-200 text-sm md:text-base">
                  {data.licitacionInfo?.entidadContratante || 'No especificado'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 md:p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base mb-2">Código CPV</h4>
                <p className="text-purple-800 dark:text-purple-200 text-sm md:text-base">
                  {data.licitacionInfo?.codigoCPV || 'No especificado'}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 md:p-4">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm md:text-base mb-2">Número de Lotes</h4>
                <p className="text-orange-800 dark:text-orange-200 text-sm md:text-base">
                  {data.licitacionInfo?.numeroLotes || 0} lotes
                </p>
              </div>
            </div>
          </div>

          {/* Objeto del contrato */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              Objeto del Contrato
            </h4>
            <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base">
              {data.licitacionInfo?.objetoContrato || 'No especificado'}
            </p>
          </div>

          {/* Cronograma */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              Cronograma de la Licitación
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Inscripción', date: data.licitacionInfo?.fechaInscripcion, color: 'blue' },
                { label: 'Plazo Límite', date: data.licitacionInfo?.plazoLimite, color: 'red' },
                { label: 'Apertura Sobres', date: data.licitacionInfo?.fechaAperturaSobres, color: 'green' },
                { label: 'Adjudicación', date: data.licitacionInfo?.plazoAdjudicacion, color: 'purple' },
                { label: 'Inicio Ejecución', date: data.licitacionInfo?.fechaInicioEjecucion, color: 'orange' }
              ].map((item, index) => (
                item.date && (
                  <div key={index} className={`bg-${item.color}-50 dark:bg-${item.color}-900/30 rounded-lg p-3`}>
                    <p className={`text-${item.color}-600 dark:text-${item.color}-400 font-medium text-xs md:text-sm`}>
                      {item.label}
                    </p>
                    <p className={`text-${item.color}-900 dark:text-${item.color}-100 font-semibold text-sm md:text-base`}>
                      {item.date}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alcance y Condiciones */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
            2. Alcance y Condiciones del Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Ámbito geográfico */}
          {data.alcanceCondiciones?.ambitoGeografico && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                Ámbito Geográfico
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base">
                {data.alcanceCondiciones.ambitoGeografico}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Servicios incluidos */}
            {data.alcanceCondiciones?.serviciosIncluidos?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3">
                  Servicios Incluidos
                </h4>
                <div className="space-y-2">
                  {data.alcanceCondiciones.serviciosIncluidos.map((servicio, index) => (
                    <div key={index} className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-green-800 dark:text-green-200 text-xs md:text-sm">{servicio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Productos incluidos */}
            {data.alcanceCondiciones?.productosIncluidos?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3">
                  Productos Incluidos
                </h4>
                <div className="space-y-2">
                  {data.alcanceCondiciones.productosIncluidos.map((producto, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-blue-800 dark:text-blue-200 text-xs md:text-sm">{producto}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Duración y prórrogas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base mb-2">
                Duración Base
              </h4>
              <p className="text-purple-800 dark:text-purple-200 text-sm md:text-base">
                {data.alcanceCondiciones?.duracionBase || 'No especificado'}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm md:text-base mb-2">
                Prórrogas Máximas
              </h4>
              <p className="text-orange-800 dark:text-orange-200 text-sm md:text-base">
                {data.alcanceCondiciones?.numeroMaximoProrrogas || 0}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm md:text-base mb-2">
                % Máx. Modificación
              </h4>
              <p className="text-red-800 dark:text-red-200 text-sm md:text-base">
                {data.alcanceCondiciones?.porcentajeMaximoModificacion || 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis Económico Detallado */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
            4. Análisis Económico Detallado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Presupuesto base */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-4 md:p-6">
            <h4 className="font-semibold text-lg md:text-xl mb-2">
              Presupuesto Base de Licitación
            </h4>
            <p className="text-2xl md:text-3xl font-bold">
              {data.analisisEconomico?.presupuestoBaseLicitacion || data.licitacionInfo?.valorEstimado || 'No especificado'}
            </p>
          </div>

          {/* Desglose de costes */}
          {data.analisisEconomico?.desgloseCostes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Costes de personal */}
              {data.analisisEconomico.desgloseCostes.personal && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                    Costes de Personal
                  </h5>
                  <p className="text-xl md:text-2xl font-bold text-blue-800 dark:text-blue-200 mb-3">
                    {data.analisisEconomico.desgloseCostes.personal.totalCostePersonal?.toLocaleString('es-ES')} €
                  </p>
                  {data.analisisEconomico.desgloseCostes.personal.desglosePorPuesto?.map((puesto, index) => (
                    <div key={index} className="bg-white/50 dark:bg-gray-700/50 rounded p-2 mb-2">
                      <p className="font-medium text-xs md:text-sm">{puesto.puesto}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {puesto.numero} personas - {puesto.costeAnual?.toLocaleString('es-ES')} €/año
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Costes de compras */}
              {data.analisisEconomico.desgloseCostes.compras && (
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                  <h5 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base mb-3">
                    Costes de Compras
                  </h5>
                  <p className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-200 mb-3">
                    {data.analisisEconomico.desgloseCostes.compras.totalCompras?.toLocaleString('es-ES')} €
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Equipamiento:</span>
                      <span className="font-medium">
                        {data.analisisEconomico.desgloseCostes.compras.equipamiento?.toLocaleString('es-ES')} €
                      </span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Consumibles:</span>
                      <span className="font-medium">
                        {data.analisisEconomico.desgloseCostes.compras.consumibles?.toLocaleString('es-ES')} €
                      </span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Repuestos:</span>
                      <span className="font-medium">
                        {data.analisisEconomico.desgloseCostes.compras.repuestos?.toLocaleString('es-ES')} €
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rentabilidad estimada */}
          {data.analisisEconomico?.rentabilidadEstimada && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4 md:p-6">
              <h4 className="font-semibold text-lg md:text-xl mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                Rentabilidad Estimada
              </h4>
              <p className="text-2xl md:text-3xl font-bold">
                {data.analisisEconomico.rentabilidadEstimada}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Criterios de Adjudicación */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Target className="w-5 h-5 md:w-6 md:h-6" />
            5. Criterios de Adjudicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Sistema de puntuación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 md:p-4 text-center">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-2">
                Puntuación Económica
              </h4>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {data.criteriosAdjudicacion?.puntuacionMaximaEconomica || 0}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 md:p-4 text-center">
              <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base mb-2">
                Puntuación Técnica
              </h4>
              <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                {data.criteriosAdjudicacion?.puntuacionMaximaTecnica || 0}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 md:p-4 text-center">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base mb-2">
                Puntuación Total
              </h4>
              <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                {data.criteriosAdjudicacion?.puntuacionTotal || 100}
              </p>
            </div>
          </div>

          {/* Fórmulas detectadas */}
          {data.criteriosAdjudicacion?.formulasDetectadas?.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 md:w-5 md:h-5" />
                Fórmulas Matemáticas Detectadas
              </h4>
              <div className="space-y-3">
                {data.criteriosAdjudicacion.formulasDetectadas.map((formula, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 md:p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                        {formula.nombre}
                      </h5>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {formula.tipo}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Fórmula Original:
                        </p>
                        <code className="text-xs md:text-sm font-mono">{formula.formulaOriginal}</code>
                      </div>
                      {formula.descripcionVariables && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Variables:
                          </p>
                          <p className="text-xs md:text-sm text-gray-800 dark:text-gray-200">
                            {formula.descripcionVariables}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Baja temeraria */}
          {data.criteriosAdjudicacion?.bajaTemeraria && (
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm md:text-base mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                Baja Temeraria
              </h4>
              <div className="space-y-2">
                <p className="text-red-800 dark:text-red-200 text-xs md:text-sm">
                  <strong>Umbral:</strong> {data.criteriosAdjudicacion.bajaTemeraria.umbralPorcentaje}
                </p>
                <p className="text-red-800 dark:text-red-200 text-xs md:text-sm">
                  <strong>Descripción:</strong> {data.criteriosAdjudicacion.bajaTemeraria.descripcion}
                </p>
              </div>
            </div>
          )}

          {/* Criterios automáticos */}
          {data.criteriosAdjudicacion?.criteriosAutomaticos?.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                Criterios Automáticos
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {data.criteriosAdjudicacion.criteriosAutomaticos.map((criterio, index) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-green-900 dark:text-green-100 text-xs md:text-sm">
                        {criterio.nombre}
                      </h5>
                      <Badge variant="secondary" className="text-xs">
                        {criterio.puntuacionMaxima} pts
                      </Badge>
                    </div>
                    <p className="text-green-800 dark:text-green-200 text-xs">
                      {criterio.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Criterios subjetivos */}
          {data.criteriosAdjudicacion?.criteriosSubjetivos?.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3">
                Criterios Subjetivos
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {data.criteriosAdjudicacion.criteriosSubjetivos.map((criterio, index) => (
                  <div key={index} className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-orange-900 dark:text-orange-100 text-xs md:text-sm">
                        {criterio.nombre}
                      </h5>
                      <Badge variant="secondary" className="text-xs">
                        {criterio.puntuacionMaxima} pts
                      </Badge>
                    </div>
                    <p className="text-orange-800 dark:text-orange-200 text-xs">
                      {criterio.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalles Adicionales */}
      {data.detallesAdicionales && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Garantías */}
            {data.detallesAdicionales.garantias?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3">
                  Garantías Requeridas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.detallesAdicionales.garantias.map((garantia, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                      <p className="font-medium text-blue-900 dark:text-blue-100 text-xs md:text-sm">
                        {garantia.tipo}
                      </p>
                      <p className="text-blue-800 dark:text-blue-200 text-xs">
                        {garantia.porcentaje} - {garantia.duracion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Condiciones especiales */}
            {data.detallesAdicionales.condicionesEspeciales?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base mb-3">
                  Condiciones Especiales
                </h4>
                <div className="space-y-2">
                  {data.detallesAdicionales.condicionesEspeciales.map((condicion, index) => (
                    <div key={index} className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-yellow-800 dark:text-yellow-200 text-xs md:text-sm">{condicion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostAnalysisReport;
