
import React from 'react';

export interface RealEstateTableManagerProps {
  onBack: () => void;
}

export const RealEstateTableManager: React.FC<RealEstateTableManagerProps> = ({ onBack }) => {
  return (
    <div>
      <h2>Real Estate Table Manager</h2>
      <button onClick={onBack}>Back to Dashboard</button>
    </div>
  );
};

export default RealEstateTableManager;
