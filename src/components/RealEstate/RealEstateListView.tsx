
import React from 'react';
import RealEstateTableManager from './RealEstateTableManager';

export interface RealEstateListViewProps {
  onBack: () => void;
}

const RealEstateListView: React.FC<RealEstateListViewProps> = ({ onBack }) => {
  return (
    <div className="container mx-auto p-6">
      <RealEstateTableManager onBack={onBack} />
    </div>
  );
};

export default RealEstateListView;
