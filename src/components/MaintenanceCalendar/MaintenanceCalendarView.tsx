
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { useMaintenanceCalendar } from '../../hooks/useMaintenanceCalendar';
import MaintenanceFileUploader from './MaintenanceFileUploader';
import MaintenanceInventoryTable from './MaintenanceInventoryTable';
import MaintenanceCalendarGrid from './MaintenanceCalendarGrid';

interface MaintenanceCalendarViewProps {
  language: Language;
}

const MaintenanceCalendarView: React.FC<MaintenanceCalendarViewProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('upload');
  
  const {
    inventoryData,
    maintenanceData,
    uploadInventoryFile,
    uploadMaintenanceFile,
    isLoading,
    error
  } = useMaintenanceCalendar();

  const hasData = inventoryData.length > 0 || maintenanceData.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Calendario de Mantenimiento</h1>
        <p className="text-emerald-100 text-lg">
          Gestiona el inventario hospitalario y programa el mantenimiento de equipos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">📁 Subir Archivos</TabsTrigger>
          <TabsTrigger value="inventory" disabled={inventoryData.length === 0}>
            📋 Inventario
          </TabsTrigger>
          <TabsTrigger value="calendar" disabled={maintenanceData.length === 0}>
            📅 Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📦 Inventario Hospitalario</CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceFileUploader
                  type="inventory"
                  onFileUpload={uploadInventoryFile}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Calendario de Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceFileUploader
                  type="maintenance"
                  onFileUpload={uploadMaintenanceFile}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {hasData && (
            <Card>
              <CardHeader>
                <CardTitle>✅ Estado de los Archivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${inventoryData.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Inventario: {inventoryData.length} elementos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${maintenanceData.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Mantenimiento: {maintenanceData.length} programaciones</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          <MaintenanceInventoryTable data={inventoryData} />
        </TabsContent>

        <TabsContent value="calendar">
          <MaintenanceCalendarGrid data={maintenanceData} />
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceCalendarView;
