
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Language } from '../../utils/translations';

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

interface MaintenanceInventoryTableProps {
  inventory: InventoryItem[];
  language: Language;
}

const MaintenanceInventoryTable: React.FC<MaintenanceInventoryTableProps> = ({
  inventory,
  language
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'fuera de servicio':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-900 dark:text-blue-100">
          Inventario de Equipos ({inventory.length} elementos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Nº Serie</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Adquisición</TableHead>
                <TableHead>Último Mant.</TableHead>
                <TableHead>Próximo Mant.</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.equipment}</TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.acquisitionDate}</TableCell>
                  <TableCell>{item.lastMaintenance}</TableCell>
                  <TableCell>{item.nextMaintenance}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceInventoryTable;
