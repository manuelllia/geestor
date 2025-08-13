
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
    <div className="w-full space-y-4 sm:space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-blue-900 dark:text-blue-100 flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base md:text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Calendario de Mantenimiento</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ({calendar.length} eventos)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {calendar.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base break-words flex-1">
                      {event.equipmentName}
                    </h4>
                    <Badge className={`${getPriorityColor(event.priority)} text-xs flex-shrink-0`}>
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                    {event.maintenanceType}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 pt-0">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">{event.scheduledDate}</span>
                  </div>
                  
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">{event.duration}</span>
                  </div>
                  
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 gap-2">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">{event.technician}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 pt-1 sm:pt-2">
                    <Badge className={`${getStatusColor(event.status)} text-xs`}>
                      {event.status}
                    </Badge>
                    {event.notes && (
                      <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                      </div>
                    )}
                  </div>
                  
                  {event.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 break-words bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                      {event.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {calendar.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No hay eventos de mantenimiento programados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceCalendarGrid;
