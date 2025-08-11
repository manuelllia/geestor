
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { Language } from '../../utils/translations';

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

interface MaintenanceCalendarGridProps {
  calendar: MaintenanceEvent[];
  language: Language;
}

const MaintenanceCalendarGrid: React.FC<MaintenanceCalendarGridProps> = ({
  calendar,
  language
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'media':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'baja':
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'programado':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'en progreso':
      case 'in progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'completado':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelado':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendario de Mantenimiento ({calendar.length} eventos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendar.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {event.equipmentName}
                    </h4>
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.maintenanceType}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.scheduledDate}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.duration}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    {event.technician}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    {event.notes && (
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                  </div>
                  
                  {event.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {event.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceCalendarGrid;
