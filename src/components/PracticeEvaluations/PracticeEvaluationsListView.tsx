
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, GraduationCap, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getPracticeEvaluations, PracticeEvaluation } from '../../services/practiceEvaluationService';
import PracticeEvaluationDetailView from './PracticeEvaluationDetailView';
import { toast } from 'sonner';

interface PracticeEvaluationsListViewProps {
  language: Language;
}

const PracticeEvaluationsListView: React.FC<PracticeEvaluationsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [evaluations, setEvaluations] = useState<PracticeEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const data = await getPracticeEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error('Error loading practice evaluations:', error);
      toast.error(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvaluations();
    setRefreshing(false);
  };

  const handleView = (id: string) => {
    setSelectedEvaluationId(id);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedEvaluationId(null);
  };

  if (currentView === 'detail' && selectedEvaluationId) {
    return (
      <PracticeEvaluationDetailView
        evaluationId={selectedEvaluationId}
        language={language}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {t('practiceEvaluations')}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              {t('managePracticeEvaluations')}
            </p>
          </div>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
            disabled={refreshing}
            size="sm"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
        </div>

        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('evaluationsList')}
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {evaluations.length} {t('evaluations')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[150px]">{t('studentName')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden sm:table-cell">{t('practiceCenter')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden lg:table-cell">{t('evaluationDate')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px] hidden md:table-cell">{t('overallScore')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px]">{t('supervisor')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">{t('status')}</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[150px] sm:max-w-[200px]">
                            {evaluation.studentName || t('noData')}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[120px]">
                            {evaluation.practiceCenter || t('noData')}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {evaluation.evaluationDate || t('noData')}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {evaluation.overallScore || 'N/A'}/10
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="truncate max-w-[100px]">
                            {evaluation.supervisor || t('noData')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {evaluation.status || t('pending')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                              <DropdownMenuItem onClick={() => handleView(evaluation.id!)} className="cursor-pointer text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                {t('view')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticeEvaluationsListView;
