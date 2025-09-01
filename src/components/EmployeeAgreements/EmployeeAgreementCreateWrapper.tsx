
import React from 'react';
import EmployeeAgreementCreateForm from './EmployeeAgreementCreateForm';
import { Language } from '../../utils/translations';
import { EmployeeAgreementRecord } from '../../services/employeeAgreementsService';

interface EmployeeAgreementCreateWrapperProps {
  language: Language;
  onBack: () => void;
  onSave: () => void;
}

const EmployeeAgreementCreateWrapper: React.FC<EmployeeAgreementCreateWrapperProps> = ({
  language,
  onBack,
  onSave
}) => {
  const handleSubmit = (record: EmployeeAgreementRecord) => {
    console.log('Agreement created:', record);
    onSave();
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="w-full">
      <div className="p-4">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ← Volver
        </button>
      </div>
      <EmployeeAgreementCreateForm
        language={language}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EmployeeAgreementCreateWrapper;
