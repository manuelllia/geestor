
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Calendar, Users, GraduationCap, Euro, FileText, Clock, MapPin } from 'lucide-react';

interface CostAnalysisData {
  licitacionInfo?: {
    fechaInscripcion?: string;
    plazoLimite?: string;
    numeroLotes?: number;
    valorEstimado?: string;
    criteriosSeleccion?: string[];
  };
  personalRequerido?: {
    totalPersonas?: number;
    personalPorLote?: { lote: string; personas: number }[];
    estudiosRequeridos?: string[];
    experienciaMinima?: string;
    estimacionCostePorPersona?: number;
    costoTotalEstimado?: number;
  };
  formulas?: {
    puntuacionTecnica?: string;
    puntuacionEconomica?: string;
    puntuacionTotal?: string;
  };
  detallesAdicionales?: {
    ubicacion?: string;
    duracionContrato?: string;
    condicionesEspeciales?: string[];
  };
}

interface CostAnalysisReportProps {
  data: CostAnalysisData;
}

const CostAnalysisReport: React.FC<CostAnalysisReportProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Información General de la Licitación */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Información General de la Licitación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.licitacionInfo?.fechaInscripcion && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Fecha de Inscripción</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {data.licitacionInfo.fechaInscripcion}
                  </p>
                </div>
              </div>
            )}
            
            {data.licitacionInfo?.plazoLimite && (
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Plazo Límite</p>
                  <p className="text-lg font-semibold text-red-900 dark:text-red-100">
                    {data.licitacionInfo.plazoLimite}
                  </p>
                </div>
              </div>
            )}
          </div>

          {data.licitacionInfo?.numeroLotes && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="w-5 h-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{data.licitacionInfo.numeroLotes}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Número de Lotes</p>
                <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                  {data.licitacionInfo.numeroLotes} lotes identificados
                </p>
              </div>
            </div>
          )}

          {data.licitacionInfo?.valorEstimado && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <Euro className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Valor Estimado</p>
                <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                  {data.licitacionInfo.valorEstimado}
                </p>
              </div>
            </div>
          )}

          {data.detallesAdicionales?.ubicacion && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ubicación</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {data.detallesAdicionales.ubicacion}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Requerido */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Personal Requerido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.personalRequerido?.totalPersonas && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Total de Personas</h4>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {data.personalRequerido.totalPersonas}
                </p>
              </div>
              
              {data.personalRequerido.costoTotalEstimado && (
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Costo Total Estimado</h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.personalRequerido.costoTotalEstimado.toLocaleString('es-ES')} €
                  </p>
                </div>
              )}
            </div>
          )}

          {data.personalRequerido?.personalPorLote && data.personalRequerido.personalPorLote.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Personal por Lote</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.personalRequerido.personalPorLote.map((lote, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <p className="font-medium text-blue-900 dark:text-blue-100">{lote.lote}</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {lote.personas} personas
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {data.personalRequerido?.estudiosRequeridos && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Estudios Requeridos
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.personalRequerido.estudiosRequeridos.map((estudio, index) => (
                  <Badge key={index} variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100">
                    {estudio}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.personalRequerido?.experienciaMinima && (
            <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Experiencia Mínima</h4>
              <p className="text-orange-800 dark:text-orange-200">{data.personalRequerido.experienciaMinima}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fórmulas de Puntuación */}
      {data.formulas && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Fórmulas de Puntuación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.formulas.puntuacionTecnica && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Puntuación Técnica</h4>
                <code className="bg-white dark:bg-gray-700 p-2 rounded text-sm block">
                  {data.formulas.puntuacionTecnica}
                </code>
              </div>
            )}

            {data.formulas.puntuacionEconomica && (
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Puntuación Económica</h4>
                <code className="bg-white dark:bg-gray-700 p-2 rounded text-sm block">
                  {data.formulas.puntuacionEconomica}
                </code>
              </div>
            )}

            {data.formulas.puntuacionTotal && (
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Puntuación Total</h4>
                <code className="bg-white dark:bg-gray-700 p-2 rounded text-sm block">
                  {data.formulas.puntuacionTotal}
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Criterios de Selección */}
      {data.licitacionInfo?.criteriosSeleccion && data.licitacionInfo.criteriosSeleccion.length > 0 && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Criterios de Selección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.licitacionInfo.criteriosSeleccion.map((criterio, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{criterio}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Condiciones Especiales */}
      {data.detallesAdicionales?.condicionesEspeciales && data.detallesAdicionales.condicionesEspeciales.length > 0 && (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
              Condiciones Especiales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.detallesAdicionales.condicionesEspeciales.map((condicion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p className="text-yellow-800 dark:text-yellow-200">{condicion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostAnalysisReport;
