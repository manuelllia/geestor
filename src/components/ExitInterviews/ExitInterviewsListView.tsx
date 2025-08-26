
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, UserMinus, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getExitInterviews, ExitInterviewData } from '../../services/exitInterviewService';
import ExitInterviewDetailView from './ExitInterviewDetailView';
import { toast } from 'sonner';

interface ExitInterviewsListViewProps {
  language: Language;
}

const ExitInterviewsListView: React.FC<ExitInterviewsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [interviews, setInterviews] = useState<ExitInterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const data = await getExitInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Error loading exit interviews:', error);
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInterviews();
    setRefreshing(false);
  };

  const handleView = (id: string) => {
    setSelectedInterviewId(id);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedInterviewId(null);
  };

  if (currentView === 'detail' && selectedInterviewId) {
    return (
      <ExitInterviewDetailView
        interviewId={selectedInterviewId}
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
              {t('exitInterviews')}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gestionar entrevistas de salida
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
            Actualizar
          </Button>
        </div>

        <Card className="border-blue-200 dark:border-blue-800 w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <span className="flex items-center gap-2">
                <UserMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                Lista de entrevistas
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
                {interviews.length} entrevistas
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
                      <TableHead className="text-xs sm:text-sm min-w-[150px]">{t('name')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden sm:table-cell">{t('department')}</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden lg:table-cell">Fecha salida</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden md:table-cell">Motivo salida</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px]">Entrevistador</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">{t('status')}</TableHead>
                      <TableHead className="w-[50px] text-xs sm:text-sm">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[150px] sm:max-w-[200px]">
                            {interview.employeeName || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[120px]">
                            {interview.department || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {interview.exitDate || 'Sin datos'}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <div className="truncate max-w-[120px]">
                            {interview.reasonForLeaving || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="truncate max-w-[100px]">
                            {interview.interviewer || 'Sin datos'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {interview.status || t('pending')}
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
                              <DropdownMenuItem onClick={() => handleView(interview.id!)} className="cursor-pointer text-xs sm:text-sm">
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

export default ExitInterviewsListView;
