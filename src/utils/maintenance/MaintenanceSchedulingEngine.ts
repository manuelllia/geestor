
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

/**
 * Motor de programación de mantenimiento profesional
 * Basado en principios de ingeniería de confiabilidad y gestión técnica hospitalaria
 */
export class MaintenanceSchedulingEngine {
  private constraints: WorkingConstraints;
  private startDate: Date;
  private endDate: Date;
  private workingDays: Date[] = [];
  private scheduledTasks: ScheduledMaintenance[] = [];

  constructor(
    startDate: Date,
    endDate: Date,
    constraints: WorkingConstraints = {
      horasPorDia: 7,
      tecnicos: 3,
      eventosMaxPorDia: 4,
      trabajarSabados: false, // Por defecto solo L-V
      horasEmergencia: 1
    }
  ) {
    this.startDate = startOfDay(startDate);
    this.endDate = startOfDay(endDate);
    this.constraints = constraints;
    this.calculateWorkingDays();
    
    console.log('🏗️ Motor de programación inicializado:', {
      periodo: `${format(this.startDate, 'dd/MM/yyyy')} - ${format(this.endDate, 'dd/MM/yyyy')}`,
      diasLaborables: this.workingDays.length,
      restricciones: this.constraints
    });
  }

  /**
   * Calcula todos los días laborables en el período (L-V, opcionalmente sábados)
   */
  private calculateWorkingDays(): void {
    const totalDays = differenceInDays(this.endDate, this.startDate);
    this.workingDays = [];
    
    for (let i = 0; i <= totalDays; i++) {
      const currentDay = addDays(this.startDate, i);
      const dayOfWeek = currentDay.getDay();
      
      // Lunes a viernes (1-5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        this.workingDays.push(currentDay);
      }
      // Sábados solo si está habilitado (6)
      else if (dayOfWeek === 6 && this.constraints.trabajarSabados) {
        this.workingDays.push(currentDay);
      }
    }
    
    console.log(`📅 Días laborables calculados: ${this.workingDays.length} días (${this.constraints.trabajarSabados ? 'L-S' : 'L-V'})`);
  }

  /**
   * Programa una tarea de mantenimiento distribuyendo uniformemente las instancias
   */
  public scheduleMaintenanceTask(task: MaintenanceTask): ScheduledMaintenance[] {
    console.log(`🔧 Programando tarea: ${task.denominacion}`);
    console.log(`   - Frecuencia: cada ${task.frecuenciaDias} días`);
    console.log(`   - Tiempo: ${task.tiempoHoras}h × ${task.cantidad} equipos`);
    
    const scheduledInstances: ScheduledMaintenance[] = [];
    const periodDays = differenceInDays(this.endDate, this.startDate);
    
    // Calcular cuántas veces debe ejecutarse la tarea en el período
    const instancesNeeded = Math.max(1, Math.floor(periodDays / task.frecuenciaDias));
    console.log(`   - Instancias necesarias: ${instancesNeeded}`);
    
    if (instancesNeeded === 0) {
      console.warn(`⚠️ No se pueden programar instancias para ${task.denominacion}`);
      return [];
    }
    
    // Distribuir uniformemente a lo largo del período
    const intervalBetweenInstances = Math.floor(this.workingDays.length / instancesNeeded);
    let lastScheduledIndex = -1;
    
    for (let i = 0; i < instancesNeeded; i++) {
      // Calcular posición ideal
      const idealPosition = Math.floor((i * this.workingDays.length) / instancesNeeded);
      
      // Buscar el mejor día disponible
      const optimalDate = this.findOptimalDate(idealPosition, task, lastScheduledIndex + Math.max(1, Math.floor(intervalBetweenInstances * 0.5)));
      
      if (optimalDate) {
        const scheduledTask: ScheduledMaintenance = {
          ...task,
          id: `${task.id}-${i + 1}`,
          fechaProgramada: optimalDate,
          estado: 'programado',
          notas: `Mantenimiento ${i + 1}/${instancesNeeded} - Distribución optimizada`,
          tecnicoAsignado: `Técnico ${(i % this.constraints.tecnicos) + 1}`
        };
        
        scheduledInstances.push(scheduledTask);
        this.scheduledTasks.push(scheduledTask);
        lastScheduledIndex = this.workingDays.indexOf(optimalDate);
        
        console.log(`   ✅ Instancia ${i + 1}: ${format(optimalDate, 'dd/MM/yyyy')} - ${scheduledTask.tecnicoAsignado}`);
      } else {
        console.warn(`   ⚠️ No se pudo programar instancia ${i + 1} de ${task.denominacion}`);
      }
    }
    
    console.log(`   📊 Total programado: ${scheduledInstances.length}/${instancesNeeded} instancias`);
    return scheduledInstances;
  }

  /**
   * Encuentra la fecha óptima considerando carga de trabajo y disponibilidad
   */
  private findOptimalDate(idealPosition: number, task: MaintenanceTask, minPosition: number = 0): Date | null {
    const searchWindow = Math.min(15, Math.floor(this.workingDays.length / 20));
    
    const startPos = Math.max(minPosition, idealPosition - searchWindow);
    const endPos = Math.min(this.workingDays.length - 1, idealPosition + searchWindow);
    
    console.log(`   🔍 Buscando fecha óptima entre posiciones ${startPos}-${endPos} (ideal: ${idealPosition})`);
    
    let bestDate: Date | null = null;
    let bestScore = Infinity;
    
    for (let pos = startPos; pos <= endPos; pos++) {
      const date = this.workingDays[pos];
      const workload = this.calculateDayWorkload(date);
      const hoursNeeded = task.tiempoHoras * task.cantidad;
      const availableHours = this.constraints.horasPorDia - this.constraints.horasEmergencia;
      
      // Verificar si el día puede acomodar esta tarea
      const canFit = (
        workload.horas + hoursNeeded <= availableHours &&
        workload.eventos < this.constraints.eventosMaxPorDia
      );
      
      if (canFit) {
        // Puntuación basada en carga actual y distancia a posición ideal
        const distanceFromIdeal = Math.abs(pos - idealPosition);
        const utilizationScore = workload.utilizacion;
        const distanceScore = distanceFromIdeal / searchWindow;
        
        const totalScore = utilizationScore + (distanceScore * 0.3);
        
        if (totalScore < bestScore) {
          bestScore = totalScore;
          bestDate = date;
        }
      }
    }
    
    // Si no encontramos en la ventana, buscar hacia adelante
    if (!bestDate && endPos < this.workingDays.length - 1) {
      console.log(`   🔍 Expandiendo búsqueda hacia adelante...`);
      for (let pos = endPos + 1; pos < this.workingDays.length; pos++) {
        const date = this.workingDays[pos];
        const workload = this.calculateDayWorkload(date);
        const hoursNeeded = task.tiempoHoras * task.cantidad;
        const availableHours = this.constraints.horasPorDia - this.constraints.horasEmergencia;
        
        if (workload.horas + hoursNeeded <= availableHours && 
            workload.eventos < this.constraints.eventosMaxPorDia) {
          bestDate = date;
          break;
        }
      }
    }
    
    if (bestDate) {
      console.log(`   ✅ Fecha óptima encontrada: ${format(bestDate, 'dd/MM/yyyy')}`);
    } else {
      console.warn(`   ❌ No se encontró fecha disponible para la tarea`);
    }
    
    return bestDate;
  }

  /**
   * Calcula la carga de trabajo de un día específico
   */
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

  /**
   * Obtiene todas las tareas programadas para un día específico
   */
  private getTasksForDay(date: Date): ScheduledMaintenance[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.scheduledTasks.filter(task => 
      format(task.fechaProgramada, 'yyyy-MM-dd') === dateStr
    );
  }

  /**
   * Genera el calendario completo para todas las tareas
   */
  public generateFullSchedule(tasks: MaintenanceTask[]): ScheduledMaintenance[] {
    console.log('🚀 INICIANDO GENERACIÓN DE CALENDARIO PROFESIONAL');
    console.log(`📅 Período: ${format(this.startDate, 'dd/MM/yyyy')} - ${format(this.endDate, 'dd/MM/yyyy')}`);
    console.log(`📋 Tareas a programar: ${tasks.length}`);
    console.log(`👥 Equipo técnico: ${this.constraints.tecnicos} técnicos`);
    console.log(`⏰ Capacidad: ${this.constraints.horasPorDia}h/día (${this.constraints.horasEmergencia}h reservadas)`);
    console.log(`📆 Días laborables: ${this.workingDays.length} días`);
    
    // Reiniciar programación
    this.scheduledTasks = [];
    
    if (tasks.length === 0) {
      console.warn('⚠️ No hay tareas para programar');
      return [];
    }
    
    // Ordenar tareas por prioridad y frecuencia
    const prioritizedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
      const priorityDiff = priorityOrder[b.prioridad] - priorityOrder[a.prioridad];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Si tienen la misma prioridad, ordenar por frecuencia (más frecuente primero)
      return a.frecuenciaDias - b.frecuenciaDias;
    });
    
    console.log('📊 Orden de programación por prioridad:');
    prioritizedTasks.slice(0, 5).forEach((task, index) => {
      console.log(`   ${index + 1}. ${task.denominacion} (${task.prioridad}, cada ${task.frecuenciaDias}d)`);
    });
    
    // Programar cada tarea
    let totalScheduled = 0;
    prioritizedTasks.forEach((task, index) => {
      console.log(`\n🔧 [${index + 1}/${prioritizedTasks.length}] Procesando: ${task.denominacion}`);
      const scheduled = this.scheduleMaintenanceTask(task);
      totalScheduled += scheduled.length;
    });
    
    console.log(`\n✅ CALENDARIO GENERADO EXITOSAMENTE`);
    console.log(`📊 Total mantenimientos programados: ${totalScheduled}`);
    console.log(`📈 Promedio por día laborable: ${(totalScheduled / this.workingDays.length).toFixed(1)}`);
    
    // Análisis final
    this.printScheduleAnalysis();
    
    return [...this.scheduledTasks].sort((a, b) => 
      a.fechaProgramada.getTime() - b.fechaProgramada.getTime()
    );
  }

  /**
   * Análisis detallado del calendario generado
   */
  private printScheduleAnalysis(): void {
    console.log('\n📈 ANÁLISIS DETALLADO DEL CALENDARIO:');
    
    // Distribución mensual
    const monthlyDistribution: { [key: string]: { eventos: number; horas: number } } = {};
    
    this.scheduledTasks.forEach(task => {
      const month = format(task.fechaProgramada, 'yyyy-MM');
      if (!monthlyDistribution[month]) {
        monthlyDistribution[month] = { eventos: 0, horas: 0 };
      }
      monthlyDistribution[month].eventos++;
      monthlyDistribution[month].horas += task.tiempoHoras * task.cantidad;
    });
    
    console.log('\n📊 Distribución mensual:');
    Object.entries(monthlyDistribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, data]) => {
        console.log(`   ${month}: ${data.eventos} eventos, ${data.horas}h`);
      });
    
    // Utilización de recursos
    const activeDays = new Set(this.scheduledTasks.map(task => 
      format(task.fechaProgramada, 'yyyy-MM-dd')
    )).size;
    
    const totalHours = this.scheduledTasks.reduce((sum, task) => 
      sum + (task.tiempoHoras * task.cantidad), 0
    );
    
    const availableCapacity = this.workingDays.length * (this.constraints.horasPorDia - this.constraints.horasEmergencia);
    const utilization = (totalHours / availableCapacity) * 100;
    
    console.log(`\n⚡ Utilización de recursos:`);
    console.log(`   Días con actividad: ${activeDays}/${this.workingDays.length} (${((activeDays/this.workingDays.length)*100).toFixed(1)}%)`);
    console.log(`   Horas totales: ${totalHours}h`);
    console.log(`   Capacidad disponible: ${availableCapacity}h`);
    console.log(`   Utilización global: ${utilization.toFixed(1)}%`);
  }

  public getWorkingDaysCount(): number {
    return this.workingDays.length;
  }

  public getScheduledTasks(): ScheduledMaintenance[] {
    return [...this.scheduledTasks];
  }
}
