import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, GraduationCap, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Language } from '../../utils/translations';
import { useTranslation } from '../../hooks/useTranslation';
import { getPracticeEvaluations, PracticeEvaluationRecord } from '../../services/practiceEvaluationService';
import PracticeEvaluationDetailModal from './PracticeEvaluationDetailModal';

interface PracticeEvaluationsListViewProps {
  language: Language;
}

const PracticeEvaluationsListView: React.FC<PracticeEvaluationsListViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [evaluations, setEvaluations] = useState<PracticeEvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PracticeEvaluationRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const evaluationsData = await getPracticeEvaluations();
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error('Error loading practice evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvaluation = (evaluation: PracticeEvaluationRecord) => {
    setSelectedEvaluation(evaluation);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              Valoraciones de Prácticas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visualiza las valoraciones de prácticas de los estudiantes
            </p>
          </div>
        </div>
        
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Valoraciones de Prácticas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualiza las valoraciones de prácticas de los estudiantes
          </p>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Lista de Valoraciones de Prácticas
            </span>
            <Badge variant="secondary">
              {evaluations.length} valoraciones
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Centro de Trabajo</TableHead>
                  <TableHead>Formación</TableHead>
                  <TableHead>Evaluación Final</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">
                      {evaluation.studentName} {evaluation.studentLastName}
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
                      {evaluation.evaluationDate.toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700">
                          <DropdownMenuItem onClick={() => handleViewEvaluation(evaluation)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      {selectedEvaluation && (
        <PracticeEvaluationDetailModal
          evaluation={selectedEvaluation}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEvaluation(null);
          }}
        />
      )}
    </div>
  );
};

export default PracticeEvaluationsListView;
