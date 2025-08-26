
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
    <div className="w-full max-w-full overflow-hidden">
      <div className="p-2 sm:p-4 lg:p-6">
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-900 dark:text-blue-100">
              Inventario de Equipos ({inventory.length} elementos)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6">
            {/* Contenedor con scroll horizontal solo para la tabla */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm min-w-[120px]">Equipo</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">Modelo</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden lg:table-cell">Nº Serie</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden md:table-cell">Ubicación</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[120px] hidden lg:table-cell">Departamento</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden xl:table-cell">Adquisición</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px] hidden lg:table-cell">Último Mant.</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[100px]">Próximo Mant.</TableHead>
                      <TableHead className="text-xs sm:text-sm min-w-[80px]">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div className="truncate max-w-[120px] sm:max-w-[150px]">
                            {item.equipment}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="truncate max-w-[100px]">
                            {item.model}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs hidden lg:table-cell">
                          <div className="truncate max-w-[120px]">
                            {item.serialNumber}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <div className="truncate max-w-[100px]">
                            {item.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <div className="truncate max-w-[120px]">
                            {item.department}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden xl:table-cell">
                          {item.acquisitionDate}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {item.lastMaintenance}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {item.nextMaintenance}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(item.status)} text-xs`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceInventoryTable;
