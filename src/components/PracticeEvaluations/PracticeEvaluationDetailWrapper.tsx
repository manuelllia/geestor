
import React from 'react';
import PracticeEvaluationDetailView from './PracticeEvaluationDetailView';
import { Language } from '../../utils/translations';
import { PracticeEvaluationRecord } from '../../services/practiceEvaluationService';

interface PracticeEvaluationDetailWrapperProps {
  evaluation: PracticeEvaluationRecord;
  language: Language;
  onBack: () => void;
  onDelete: () => void;
}

const PracticeEvaluationDetailWrapper: React.FC<PracticeEvaluationDetailWrapperProps> = ({
  evaluation,
  language,
  onBack,
  onDelete
}) => {
  const handleClose = () => {
    onBack();
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ← Volver
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
      <PracticeEvaluationDetailView
        evaluation={evaluation}
        language={language}
        onClose={handleClose}
      />
    </div>
  );
};

export default PracticeEvaluationDetailWrapper;
