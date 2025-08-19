
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileUp, Download, RefreshCw, Plus, Calendar } from 'lucide-react';
import { getPracticeEvaluations } from '../../services/practiceEvaluationService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import PracticeEvaluationLinkModal from './PracticeEvaluationLinkModal';

interface PracticeEvaluationsListViewProps {
  language: Language;
}

export default function PracticeEvaluationsListView({ language }: PracticeEvaluationsListViewProps) {
  const { t } = useTranslation(language);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  const { data: evaluations = [], isLoading, refetch } = useQuery({
    queryKey: ['practice-evaluations'],
    queryFn: getPracticeEvaluations,
  });

  const handleGenerateLink = () => {
    setIsLinkModalOpen(true);
  };

  const handleExport = () => {
    // TODO: Implementar exportación
  };

  const handleImport = () => {
    // TODO: Implementar importación
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-300">
            {t('practiceEvaluations')}
          </CardTitle>
          <CardDescription>
            {t('managePracticeEvaluations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button onClick={handleGenerateLink} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              {t('generateEvaluationLink')}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <FileUp className="w-4 h-4 mr-2" />
              {t('import')}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('refresh')}
            </Button>
          </div>

          {evaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('noPracticeEvaluations')}</p>
              <p className="text-sm">{t('generateLinkToStart')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('student')}</TableHead>
                    <TableHead>{t('tutor')}</TableHead>
                    <TableHead>{t('workCenter')}</TableHead>
                    <TableHead>{t('formation')}</TableHead>
                    <TableHead>{t('finalEvaluation')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('rating')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {evaluation.studentName} {evaluation.studentLastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {evaluation.institute}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {evaluation.tutorName} {evaluation.tutorLastName}
                      </TableCell>
                      <TableCell>{evaluation.workCenter}</TableCell>
                      <TableCell>{evaluation.formation}</TableCell>
                      <TableCell>
                        <Badge variant={evaluation.finalEvaluation === 'Apto' ? 'default' : 'destructive'}>
                          {evaluation.finalEvaluation}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(evaluation.evaluationDate, 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-300">
                            {evaluation.performanceRating}/10
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <PracticeEvaluationLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onLinkGenerated={() => refetch()}
      />
    </div>
  );
}
