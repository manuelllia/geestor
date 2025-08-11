
import { useState } from 'react';
import * as XLSX from 'xlsx';

interface InventoryItem {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  location: string;
  department: string;
  acquisitionDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: string;
}

interface MaintenanceEvent {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: string;
  scheduledDate: string;
  duration: string;
  technician: string;
  priority: string;
  status: string;
  notes: string;
}

export const useMaintenanceCalendar = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [maintenanceCalendar, setMaintenanceCalendar] = useState<MaintenanceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processInventoryFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip header row and process data
      const processedData = jsonData.slice(1).map((row: any, index: number) => ({
        id: `inv_${index + 1}`,
        equipment: row[0] || '',
        model: row[1] || '',
        serialNumber: row[2] || '',
        location: row[3] || '',
        department: row[4] || '',
        acquisitionDate: row[5] || '',
        lastMaintenance: row[6] || '',
        nextMaintenance: row[7] || '',
        status: row[8] || 'Activo'
      }));

      setInventory(processedData);
    } catch (err) {
      setError('Error al procesar el archivo de inventario');
      console.error('Error processing inventory file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processMaintenanceFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip header row and process data
      const processedData = jsonData.slice(1).map((row: any, index: number) => ({
        id: `maint_${index + 1}`,
        equipmentId: row[0] || '',
        equipmentName: row[1] || '',
        maintenanceType: row[2] || '',
        scheduledDate: row[3] || '',
        duration: row[4] || '',
        technician: row[5] || '',
        priority: row[6] || 'Media',
        status: row[7] || 'Programado',
        notes: row[8] || ''
      }));

      setMaintenanceCalendar(processedData);
    } catch (err) {
      setError('Error al procesar el archivo de calendario');
      console.error('Error processing maintenance file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inventory,
    maintenanceCalendar,
    isLoading,
    error,
    processInventoryFile,
    processMaintenanceFile
  };
};
