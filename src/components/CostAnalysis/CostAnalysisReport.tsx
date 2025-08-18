
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { BarChart3, Calculator, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import CostBreakdownView from './CostBreakdownView';
import ScoreAnalysisView from './ScoreAnalysisView';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';

interface ReportData {
  presupuestoGeneral: string;
  esPorLotes: boolean;
  lotes: any[];
  variablesDinamicas: any[];
  formulaEconomica: string;
  formulasDetectadas: any[];
  umbralBajaTemeraria: string;
  criteriosAutomaticos: any[];
  criteriosSubjetivos: any[];
  otrosCriterios: any[];
  costesDetalladosRecomendados: any[];
}

interface CostAnalysisReportProps {
  analysis: ReportData | null;
  language: Language;
}

export default function CostAnalysisReport({ analysis, language }: CostAnalysisReportProps) {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'scores'>('overview');

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 sm:p-8">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            No hay análisis disponible
          </p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Presupuesto General
                </p>
                <p className="text-sm sm:text-lg font-bold text-blue-900 dark:text-blue-100 truncate">
                  {analysis.presupuestoGeneral}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                  Tipo de Licitación
                </p>
                <p className="text-sm sm:text-lg font-bold text-green-900 dark:text-green-100">
                  {analysis.esPorLotes ? 'Por Lotes' : 'Único'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-600 rounded-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Criterios Totales
                </p>
                <p className="text-sm sm:text-lg font-bold text-purple-900 dark:text-purple-100">
                  {analysis.criteriosAutomaticos.length + analysis.criteriosSubjetivos.length + analysis.otrosCriterios.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-600 rounded-lg">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium">
                  Fórmulas Detectadas
                </p>
                <p className="text-sm sm:text-lg font-bold text-orange-900 dark:text-orange-100">
                  {analysis.formulasDetectadas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lotes section - responsive */}
      {analysis.esPorLotes && analysis.lotes.length > 0 && (
        <Card>
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Lotes Identificados</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {analysis.lotes.map((lote: any, index: number) => (
                <Card key={index} className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {lote.nombre}
                        </h4>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {lote.presupuesto}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Centro:</span> {lote.centroAsociado}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {lote.descripcion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variables Dinámicas - responsive table to cards */}
      {analysis.variablesDinamicas.length > 0 && (
        <Card>
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Variables Dinámicas</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Variable</th>
                      <th className="text-left p-2 font-medium">Descripción</th>
                      <th className="text-left p-2 font-medium">Mapeo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.variablesDinamicas.map((variable: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-mono text-blue-600 dark:text-blue-400">
                          {variable.nombre}
                        </td>
                        <td className="p-2">{variable.descripcion}</td>
                        <td className="p-2">
                          <Badge variant="outline">{variable.mapeo}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="md:hidden space-y-3">
              {analysis.variablesDinamicas.map((variable: any, index: number) => (
                <Card key={index} className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                          {variable.nombre}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {variable.mapeo}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {variable.descripcion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Reporte de Análisis de Costes
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Análisis completo de la licitación procesada
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'breakdown' | 'scores')} className="h-full flex flex-col">
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex m-3 sm:m-4 lg:m-6">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="text-xs sm:text-sm">
                Desglose
              </TabsTrigger>
              <TabsTrigger value="scores" className="text-xs sm:text-sm">
                Puntuaciones
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="overview" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 sm:p-4 lg:p-6">
                  {renderOverview()}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="breakdown" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 sm:p-4 lg:p-6">
                  <CostBreakdownView analysis={analysis} language={language} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="scores" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 sm:p-4 lg:p-6">
                  <ScoreAnalysisView analysis={analysis} language={language} />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
