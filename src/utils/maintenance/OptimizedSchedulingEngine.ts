
import { differenceInDays, addDays, format, isWeekend, startOfDay } from 'date-fns';

export interface MaintenanceTask {
  id: string;
  denominacion: string;
  codigo: string;
  tipoMantenimiento: string;
  frecuenciaDias: number;
  tiempoHoras: number;
  cantidad: number;
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  equipos: string[];
}

export interface ScheduledMaintenance extends MaintenanceTask {
  fechaProgramada: Date;
  tecnicoAsignado?: string;
  estado: 'programado' | 'en-progreso' | 'completado' | 'pendiente';
  notas?: string;
}

export interface WorkingConstraints {
  horasPorDia: number;
  tecnicos: number;
  eventosMaxPorDia: number;
  trabajarSabados: boolean;
  horasEmergencia: number;
}

export interface GenerationProgress {
  current: number;
  total: number;
  currentTask: string;
}

/**
 * Motor de programación optimizado para grandes volúmenes de mantenimiento
 * Implementa algoritmos de distribución inteligente y procesamiento por lotes
 */
export class OptimizedSchedulingEngine {
  private constraints: WorkingConstraints;
  private startDate: Date;
  private endDate: Date;
  private workingDays: Date[] = [];
  private scheduledTasks: ScheduledMaintenance[] = [];
  private onProgress?: (progress: GenerationProgress) => void;

  constructor(
    startDate: Date,
    endDate: Date,
    constraints: WorkingConstraints = {
      horasPorDia: 7,
      tecnicos: 2,
      eventosMaxPorDia: 3,
      trabajarSabados: false,
      horasEmergencia: 1
    },
    onProgress?: (progress: GenerationProgress) => void
  ) {
    this.startDate = startOfDay(startDate);
    this.endDate = startOfDay(endDate);
    this.constraints = constraints;
    this.onProgress = onProgress;
    this.calculateWorkingDays();
  }

  private calculateWorkingDays(): void {
    const totalDays = differenceInDays(this.endDate, this.startDate);
    this.workingDays = [];
    
    for (let i = 0; i <= totalDays; i++) {
      const currentDay = addDays(this.startDate, i);
      const dayOfWeek = currentDay.getDay();
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        this.workingDays.push(currentDay);
      } else if (dayOfWeek === 6 && this.constraints.trabajarSabados) {
        this.workingDays.push(currentDay);
      }
    }
  }

  /**
   * Genera el calendario completo con procesamiento optimizado por lotes
   */
  public async generateOptimizedSchedule(tasks: MaintenanceTask[]): Promise<ScheduledMaintenance[]> {
    console.log('🚀 Iniciando generación optimizada de calendario');
    
    this.scheduledTasks = [];
    
    if (tasks.length === 0) {
      return [];
    }

    // Procesar por lotes para mejorar rendimiento
    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(tasks.length / BATCH_SIZE);
    
    // Ordenar tareas por prioridad
    const prioritizedTasks = this.prioritizeTasks(tasks);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIdx = batchIndex * BATCH_SIZE;
      const endIdx = Math.min(startIdx + BATCH_SIZE, prioritizedTasks.length);
      const batch = prioritizedTasks.slice(startIdx, endIdx);
      
      // Reportar progreso
      if (this.onProgress) {
        this.onProgress({
          current: startIdx,
          total: prioritizedTasks.length,
          currentTask: `Procesando lote ${batchIndex + 1}/${totalBatches} - ${batch[0]?.denominacion}`
        });
      }
      
      // Procesar lote
      await this.processBatch(batch);
      
      // Pequeña pausa para no bloquear el UI
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log(`✅ Calendario optimizado generado: ${this.scheduledTasks.length} eventos`);
    return [...this.scheduledTasks].sort((a, b) => 
      a.fechaProgramada.getTime() - b.fechaProgramada.getTime()
    );
  }

  private prioritizeTasks(tasks: MaintenanceTask[]): MaintenanceTask[] {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
      const priorityDiff = priorityOrder[b.prioridad] - priorityOrder[a.prioridad];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Ordenar por frecuencia (más frecuente primero)
      return a.frecuenciaDias - b.frecuenciaDias;
    });
  }

  private async processBatch(tasks: MaintenanceTask[]): Promise<void> {
    for (const task of tasks) {
      await this.scheduleOptimizedTask(task);
    }
  }

  private async scheduleOptimizedTask(task: MaintenanceTask): Promise<void> {
    const periodDays = differenceInDays(this.endDate, this.startDate);
    const instancesNeeded = Math.max(1, Math.floor(periodDays / task.frecuenciaDias));
    
    if (instancesNeeded === 0) return;

    // Aplicar lógica estacional inteligente
    const optimalDates = this.calculateOptimalDates(task, instancesNeeded);
    
    let scheduledCount = 0;
    for (const targetDate of optimalDates) {
      const availableDate = this.findNearestAvailableDate(targetDate, task);
      
      if (availableDate) {
        const scheduledTask: ScheduledMaintenance = {
          ...task,
          id: `${task.id}-${scheduledCount + 1}`,
          fechaProgramada: availableDate,
          estado: 'programado',
          notas: `Mantenimiento ${scheduledCount + 1}/${instancesNeeded} - Optimizado`,
          tecnicoAsignado: `Técnico ${(scheduledCount % this.constraints.tecnicos) + 1}`
        };
        
        this.scheduledTasks.push(scheduledTask);
        scheduledCount++;
      }
      
      if (scheduledCount >= instancesNeeded) break;
    }
  }

  private calculateOptimalDates(task: MaintenanceTask, instancesNeeded: number): Date[] {
    const optimalDates: Date[] = [];
    const equipoNombre = task.denominacion.toLowerCase();
    
    // Lógica estacional especializada
    if (equipoNombre.includes('frigorifico') || equipoNombre.includes('frio') || equipoNombre.includes('refriger')) {
      // Equipos de frío: mantenimiento antes del verano
      optimalDates.push(...this.getPreSummerDates(instancesNeeded));
    } else if (equipoNombre.includes('quirofano') || equipoNombre.includes('cirugia') || equipoNombre.includes('quirurgic')) {
      // Equipos quirúrgicos: mantenimiento en período de menor actividad (verano)
      optimalDates.push(...this.getSummerDates(instancesNeeded));
    } else {
      // Distribución uniforme para el resto
      optimalDates.push(...this.getUniformDistribution(instancesNeeded));
    }
    
    return optimalDates;
  }

  private getPreSummerDates(count: number): Date[] {
    const dates: Date[] = [];
    const springStart = new Date(this.startDate.getFullYear(), 2, 1); // Marzo
    const springEnd = new Date(this.startDate.getFullYear(), 4, 31); // Mayo
    
    const springDays = this.workingDays.filter(day => 
      day >= springStart && day <= springEnd
    );
    
    if (springDays.length > 0) {
      const interval = Math.floor(springDays.length / count);
      for (let i = 0; i < count; i++) {
        const index = Math.min(i * interval, springDays.length - 1);
        dates.push(springDays[index]);
      }
    }
    
    return dates;
  }

  private getSummerDates(count: number): Date[] {
    const dates: Date[] = [];
    const summerStart = new Date(this.startDate.getFullYear(), 5, 1); // Junio
    const summerEnd = new Date(this.startDate.getFullYear(), 7, 31); // Agosto
    
    const summerDays = this.workingDays.filter(day => 
      day >= summerStart && day <= summerEnd
    );
    
    if (summerDays.length > 0) {
      const interval = Math.floor(summerDays.length / count);
      for (let i = 0; i < count; i++) {
        const index = Math.min(i * interval, summerDays.length - 1);
        dates.push(summerDays[index]);
      }
    }
    
    return dates;
  }

  private getUniformDistribution(count: number): Date[] {
    const dates: Date[] = [];
    const interval = Math.floor(this.workingDays.length / count);
    
    for (let i = 0; i < count; i++) {
      const index = Math.min(i * interval, this.workingDays.length - 1);
      dates.push(this.workingDays[index]);
    }
    
    return dates;
  }

  private findNearestAvailableDate(targetDate: Date, task: MaintenanceTask): Date | null {
    const searchWindow = 14; // 2 semanas de búsqueda
    const targetIndex = this.workingDays.findIndex(day => 
      format(day, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
    );
    
    if (targetIndex === -1) return null;
    
    // Buscar hacia adelante y hacia atrás
    for (let offset = 0; offset <= searchWindow; offset++) {
      // Probar fecha exacta primero
      if (offset === 0) {
        if (this.canScheduleOnDate(targetDate, task)) {
          return targetDate;
        }
        continue;
      }
      
      // Probar fechas hacia adelante
      const forwardIndex = targetIndex + offset;
      if (forwardIndex < this.workingDays.length) {
        const forwardDate = this.workingDays[forwardIndex];
        if (this.canScheduleOnDate(forwardDate, task)) {
          return forwardDate;
        }
      }
      
      // Probar fechas hacia atrás
      const backwardIndex = targetIndex - offset;
      if (backwardIndex >= 0) {
        const backwardDate = this.workingDays[backwardIndex];
        if (this.canScheduleOnDate(backwardDate, task)) {
          return backwardDate;
        }
      }
    }
    
    return null;
  }

  private canScheduleOnDate(date: Date, task: MaintenanceTask): boolean {
    const workload = this.calculateDayWorkload(date);
    const hoursNeeded = task.tiempoHoras * task.cantidad;
    const availableHours = this.constraints.horasPorDia - this.constraints.horasEmergencia;
    
    return (
      workload.horas + hoursNeeded <= availableHours &&
      workload.eventos < this.constraints.eventosMaxPorDia
    );
  }

  private calculateDayWorkload(date: Date): { horas: number; eventos: number; utilizacion: number } {
    const tasksForDay = this.getTasksForDay(date);
    const totalHours = tasksForDay.reduce((sum, task) => sum + (task.tiempoHoras * task.cantidad), 0);
    const availableHours = this.constraints.horasPorDia - this.constraints.horasEmergencia;
    
    return {
      horas: totalHours,
      eventos: tasksForDay.length,
      utilizacion: availableHours > 0 ? totalHours / availableHours : 0
    };
  }

  private getTasksForDay(date: Date): ScheduledMaintenance[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.scheduledTasks.filter(task => 
      format(task.fechaProgramada, 'yyyy-MM-dd') === dateStr
    );
  }
}
