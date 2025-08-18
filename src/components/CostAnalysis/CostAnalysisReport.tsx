import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Award, Download, Eye } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import CostBreakdownView from './CostBreakdownView';
import ScoreAnalysisView from './ScoreAnalysisView';

interface CostAnalysisReportProps {
  analysis: any;
  language: Language;
}

export function CostAnalysisReport({ analysis, language }: CostAnalysisReportProps) {
  const { t } = useTranslation(language);
  const [currentView, setCurrentView] = React.useState<'overview' | 'breakdown' | 'scores'>('overview');

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 sm:p-8">
          <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay análisis disponible
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Sube un archivo para comenzar el análisis de costes
          </p>
        </div>
      </div>
    );
  }

  const mockData = {
    totalOffers: 5,
    averageCost: 125000,
    bestOffer: { provider: 'Proveedor A', cost: 98000, savings: 27000 },
    worstOffer: { provider: 'Proveedor E', cost: 155000 },
    offers: [
      { id: 1, provider: 'Proveedor A', cost: 98000, score: 92, status: 'recommended' },
      { id: 2, provider: 'Proveedor B', cost: 112000, score: 85, status: 'good' },
      { id: 3, provider: 'Proveedor C', cost: 128000, score: 78, status: 'average' },
      { id: 4, provider: 'Proveedor D', cost: 145000, score: 65, status: 'below_average' },
      { id: 5, provider: 'Proveedor E', cost: 155000, score: 58, status: 'poor' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'below_average': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recommended': return 'Recomendado';
      case 'good': return 'Bueno';
      case 'average': return 'Promedio';
      case 'below_average': return 'Por debajo';
      case 'poor': return 'Deficiente';
      default: return 'N/A';
    }
  };

  if (currentView === 'breakdown') {
    return <CostBreakdownView data={mockData} language={language} onBack={() => setCurrentView('overview')} />;
  }

  if (currentView === 'scores') {
    return <ScoreAnalysisView data={mockData} language={language} onBack={() => setCurrentView('overview')} />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header con navegación - responsive */}
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b border-blue-200 dark:border-blue-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-shrink-0 p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Análisis Completado
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                Resultados del análisis de {mockData.totalOffers} ofertas
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={() => setCurrentView('breakdown')}
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Ver Detalles
            </Button>
          </div>
        </div>

        {/* Navigation tabs - responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant={currentView === 'overview' ? 'default' : 'outline'}
            onClick={() => setCurrentView('overview')}
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Resumen General
          </Button>
          <Button
            variant={currentView === 'breakdown' ? 'default' : 'outline'}
            onClick={() => setCurrentView('breakdown')}
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Desglose de Costes
          </Button>
          <Button
            variant={currentView === 'scores' ? 'default' : 'outline'}
            onClick={() => setCurrentView('scores')}
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Análisis de Puntuación
          </Button>
        </div>
      </div>

      {/* Main content - scrollable */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Summary cards - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                      Total Ofertas
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {mockData.totalOffers}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                      Coste Promedio
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      €{mockData.averageCost.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                      Mejor Oferta
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                      €{mockData.bestOffer.cost.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                      Ahorro Potencial
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      €{mockData.bestOffer.savings.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Offers table - responsive */}
          <Card className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white">
                Comparativa de Ofertas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile view - cards */}
              <div className="block sm:hidden">
                <div className="space-y-3 p-3">
                  {mockData.offers.map((offer) => (
                    <Card key={offer.id} className="border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {offer.provider}
                          </h4>
                          <Badge className={`text-xs ${getStatusColor(offer.status)}`}>
                            {getStatusText(offer.status)}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Coste:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              €{offer.cost.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Puntuación:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {offer.score}/100
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop view - table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Proveedor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Coste
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Puntuación
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockData.offers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {offer.provider}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          €{offer.cost.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <span className="mr-2">{offer.score}/100</span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${offer.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge className={`text-xs ${getStatusColor(offer.status)}`}>
                            {getStatusText(offer.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
