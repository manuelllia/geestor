
import React from 'react';
import { Language } from '../utils/translations';

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-blue-100">
          Welcome to the main dashboard
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
