
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import GoogleMap from '../GoogleMap';

interface BidAnalyzerViewProps {
  language: Language;
}

const BidAnalyzerView: React.FC<BidAnalyzerViewProps> = ({ language }) => {
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{t('bidAnalyzer')}</h1>
        <p className="text-blue-100 text-lg">{t('bidAnalyzerDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {t('analysisTools')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t('costAnalysis')}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('costAnalysisDescription')}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t('riskAssessment')}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('riskAssessmentDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {t('locationMap')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMap 
              height="400px" 
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            {t('detailedAnalysis')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t('analysisFeatureComingSoon')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BidAnalyzerView;
