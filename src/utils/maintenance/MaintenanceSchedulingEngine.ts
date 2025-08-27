
import { differenceInDays, addDays, format, isWeekend, startOfDay, endOfYear, startOfYear } from 'date-fns';

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
  trabajarDomingos: boolean;
  horasEmergencia: number;
}

/**
 * Motor de programación de mantenimiento profesional
 * Genera calendario completo de enero a diciembre con cobertura diaria
 */
export class MaintenanceSchedulingEngine {
  private constraints: WorkingConstraints;
  private startDate: Date;
  private endDate: Date;
  private allDays: Date[] = [];
  private workingDays: Date[] = [];
  private scheduledTasks: ScheduledMaintenance[] = [];

  constructor(
    year: number = new Date().getFullYear(),
    constraints: WorkingConstraints = {
      horasPorDia: 8,
      tecnicos: 4,
      eventosMaxPorDia: 6,
      trabajarSabados: true,  // Trabajar sábados para mayor cobertura
      trabajarDomingos: false, // Domingos solo para emergencias
      horasEmergencia: 1
    }
  ) {
    this.startDate = startOfYear(new Date(year, 0, 1));
    this.endDate = endOfYear(new Date(year, 11, 31));
    this.constraints = constraints;
    this.calculateAllDays();
    this.calculateWorkingDays();
    
    console.log('🏗️ Motor de programación ANUAL inicializado:', {
      año: year,
      periodo: `${format(this.startDate, 'dd/MM/yyyy')} - ${format(this.endDate, 'dd/MM/yyyy')}`,
      diasTotales: this.allDays.length,
      diasLaborables: this.workingDays.length,
      restricciones: this.constraints
    });
  }

  /**
   * Calcula todos los días del año
   */
  private calculateAllDays(): void {
    const totalDays = differenceInDays(this.endDate, this.startDate);
    this.allDays = [];
    
    for (let i = 0; i <= totalDays; i++) {
      this.allDays.push(addDays(this.startDate, i));
    }
    
    console.log(`📅 Total días del año: ${this.allDays.length}`);
  }

  /**
   * Calcula todos los días laborables (L-V y opcionalmente sábados)
   */
  private calculateWorkingDays(): void {
    this.workingDays = this.allDays.filter(day => {
      const dayOfWeek = day.getDay();
      
      // Lunes a viernes (1-5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        return true;
      }
      // Sábados si está habilitado (6)
      else if (dayOfWeek === 6 && this.constraints.trabajarSabados) {
        return true;
      }
      // Domingos si está habilitado (0)
      else if (dayOfWeek === 0 && this.constraints.trabajarDomingos) {
        return true;
      }
      
      return false;
    });
    
    console.log(`📅 Días laborables calculados: ${this.workingDays.length} días`);
  }

  /**
   * Programa una tarea de mantenimiento con cobertura completa anual
   */
  public scheduleMaintenanceTask(task: MaintenanceTask): ScheduledMaintenance[] {
    console.log(`🔧 Programando tarea ANUAL: ${task.denominacion}`);
    console.log(`   - Frecuencia: cada ${task.frecuenciaDias} días`);
    console.log(`   - Tiempo: ${task.tiempoHoras}h × ${task.cantidad} equipos`);
    
    const scheduledInstances: ScheduledMaintenance[] = [];
    const periodDays = 365; // Año completo
    
    // Calcular cuántas veces debe ejecutarse la tarea en el año
    const instancesNeeded = Math.max(1, Math.ceil(periodDays / task.frecuenciaDias));
    console.log(`   - Instancias necesarias para cobertura anual: ${instancesNeeded}`);
    
    // Si es mantenimiento muy frecuente (diario, semanal), programar múltiples veces
    let currentDate = new Date(this.startDate);
    let instanceCount = 0;
    let dayIndex = 0;
    
    while (currentDate <= this.endDate && instanceCount < instancesNeeded * 2) { // Factor de seguridad
      // Buscar el próximo día disponible
      const optimalDate = this.findOptimalDate(dayIndex, task);
      
      if (optimalDate) {
        const scheduledTask: ScheduledMaintenance = {
          ...task,
          id: `${task.id}-${instanceCount + 1}`,
          fechaProgramada: optimalDate,
          estado: 'programado',
          notas: `Mantenimiento ${instanceCount + 1} - Cobertura anual completa`,
          tecnicoAsignado: `Técnico ${(instanceCount % this.constraints.tecnicos) + 1}`
        };
        
        scheduledInstances.push(scheduledTask);
        this.scheduledTasks.push(scheduledTask);
        instanceCount++;
        
        // Avanzar a la siguiente fecha según la frecuencia
        const nextDateIndex = this.workingDays.findIndex(d => 
          d.getTime() === optimalDate.getTime()
        ) + Math.max(1, Math.floor(task.frecuenciaDias / 7)); // Convertir días a semanas laborables
        
        dayIndex = Math.min(nextDateIndex, this.workingDays.length - 1);
        
        console.log(`   ✅ Instancia ${instanceCount}: ${format(optimalDate, 'dd/MM/yyyy')} - ${scheduledTask.tecnicoAsignado}`);
      } else {
        dayIndex++;
      }
      
      // Prevenir bucle infinito
      if (dayIndex >= this.workingDays.length) {
        dayIndex = 0;
        currentDate = addDays(currentDate, 7); // Avanzar una semana
      }
      
      if (currentDate > this.endDate) break;
    }
    
    console.log(`   📊 Total programado: ${scheduledInstances.length} instancias para cobertura anual`);
    return scheduledInstances;
  }

  /**
   * Encuentra la fecha óptima considerando carga de trabajo y disponibilidad
   */
  private findOptimalDate(idealPosition: number, task: MaintenanceTask): Date | null {
    const searchWindow = Math.min(20, Math.floor(this.workingDays.length / 15));
    
    const startPos = Math.max(0, idealPosition - searchWindow);
    const endPos = Math.min(this.workingDays.length - 1, idealPosition + searchWindow);
    
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
        // Puntuación basada en carga actual y distribución uniforme
        const utilizationScore = workload.utilizacion;
        const distanceFromIdeal = Math.abs(pos - idealPosition);
        const distanceScore = distanceFromIdeal / searchWindow;
        
        const totalScore = utilizationScore + (distanceScore * 0.2);
        
        if (totalScore < bestScore) {
          bestScore = totalScore;
          bestDate = date;
        }
      }
    }
    
    // Si no encontramos en la ventana, buscar en días con menor carga
    if (!bestDate) {
      for (let pos = 0; pos < this.workingDays.length; pos++) {
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
   * Genera el calendario completo anual con cobertura diaria
   */
  public generateFullSchedule(tasks: MaintenanceTask[]): ScheduledMaintenance[] {
    console.log('🚀 GENERANDO CALENDARIO ANUAL COMPLETO (ENERO-DICIEMBRE)');
    console.log(`📅 Período completo: ${format(this.startDate, 'dd/MM/yyyy')} - ${format(this.endDate, 'dd/MM/yyyy')}`);
    console.log(`📋 Tareas a programar: ${tasks.length}`);
    console.log(`👥 Equipo técnico: ${this.constraints.tecnicos} técnicos`);
    console.log(`⏰ Capacidad diaria: ${this.constraints.horasPorDia}h/día`);
    console.log(`📆 Días laborables disponibles: ${this.workingDays.length} días`);
    
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
    
    console.log('📊 Orden de programación por prioridad y frecuencia:');
    prioritizedTasks.slice(0, 8).forEach((task, index) => {
      console.log(`   ${index + 1}. ${task.denominacion} (${task.prioridad}, cada ${task.frecuenciaDias}d)`);
    });
    
    // Programar cada tarea con cobertura anual
    let totalScheduled = 0;
    prioritizedTasks.forEach((task, index) => {
      console.log(`\n🔧 [${index + 1}/${prioritizedTasks.length}] Procesando: ${task.denominacion}`);
      const scheduled = this.scheduleMaintenanceTask(task);
      totalScheduled += scheduled.length;
    });
    
    console.log(`\n✅ CALENDARIO ANUAL GENERADO EXITOSAMENTE`);
    console.log(`📊 Total mantenimientos programados: ${totalScheduled}`);
    console.log(`📈 Promedio por día laborable: ${(totalScheduled / this.workingDays.length).toFixed(1)}`);
    console.log(`📅 Cobertura: ${this.getDaysWithMaintenance().length}/${this.workingDays.length} días laborables (${((this.getDaysWithMaintenance().length/this.workingDays.length)*100).toFixed(1)}%)`);
    
    // Análisis final
    this.printScheduleAnalysis();
    
    return [...this.scheduledTasks].sort((a, b) => 
      a.fechaProgramada.getTime() - b.fechaProgramada.getTime()
    );
  }

  /**
   * Obtiene los días que tienen mantenimiento programado
   */
  private getDaysWithMaintenance(): Date[] {
    const daysWithTasks = new Set(
      this.scheduledTasks.map(task => format(task.fechaProgramada, 'yyyy-MM-dd'))
    );
    
    return this.workingDays.filter(day => 
      daysWithTasks.has(format(day, 'yyyy-MM-dd'))
    );
  }

  /**
   * Análisis detallado del calendario anual
   */
  private printScheduleAnalysis(): void {
    console.log('\n📈 ANÁLISIS DETALLADO DEL CALENDARIO ANUAL:');
    
    // Distribución mensual
    const monthlyDistribution: { [key: string]: { eventos: number; horas: number; dias: Set<string> } } = {};
    
    this.scheduledTasks.forEach(task => {
      const month = format(task.fechaProgramada, 'yyyy-MM');
      const day = format(task.fechaProgramada, 'yyyy-MM-dd');
      
      if (!monthlyDistribution[month]) {
        monthlyDistribution[month] = { eventos: 0, horas: 0, dias: new Set() };
      }
      monthlyDistribution[month].eventos++;
      monthlyDistribution[month].horas += task.tiempoHoras * task.cantidad;
      monthlyDistribution[month].dias.add(day);
    });
    
    console.log('\n📊 Distribución mensual detallada:');
    Object.entries(monthlyDistribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, data]) => {
        const monthName = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 
                          'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'][parseInt(month.split('-')[1]) - 1];
        console.log(`   ${monthName}: ${data.eventos} eventos, ${data.horas}h, ${data.dias.size} días activos`);
      });
    
    // Utilización de recursos
    const activeDays = this.getDaysWithMaintenance().length;
    const totalHours = this.scheduledTasks.reduce((sum, task) => 
      sum + (task.tiempoHoras * task.cantidad), 0
    );
    
    const availableCapacity = this.workingDays.length * (this.constraints.horasPorDia - this.constraints.horasEmergencia);
    const utilization = (totalHours / availableCapacity) * 100;
    
    console.log(`\n⚡ Utilización de recursos anuales:`);
    console.log(`   Días con actividad: ${activeDays}/${this.workingDays.length} (${((activeDays/this.workingDays.length)*100).toFixed(1)}%)`);
    console.log(`   Horas totales programadas: ${totalHours}h`);
    console.log(`   Capacidad disponible: ${availableCapacity}h`);
    console.log(`   Utilización global: ${utilization.toFixed(1)}%`);
    console.log(`   Técnicos necesarios: ${this.constraints.tecnicos}`);
    
    // Distribución por tipo de mantenimiento
    const maintenanceTypes = new Map<string, number>();
    this.scheduledTasks.forEach(task => {
      maintenanceTypes.set(task.tipoMantenimiento, 
        (maintenanceTypes.get(task.tipoMantenimiento) || 0) + 1
      );
    });
    
    console.log(`\n🔧 Distribución por tipo de mantenimiento:`);
    Array.from(maintenanceTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} mantenimientos programados`);
      });
  }

  public getWorkingDaysCount(): number {
    return this.workingDays.length;
  }

  public getScheduledTasks(): ScheduledMaintenance[] {
    return [...this.scheduledTasks];
  }

  public getAllDays(): Date[] {
    return [...this.allDays];
  }
}
