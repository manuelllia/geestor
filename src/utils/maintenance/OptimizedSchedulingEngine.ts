
import { differenceInDays, addDays, format, startOfDay, startOfYear, endOfYear } from 'date-fns';

interface MaintenanceTask {
  id: string;
  denominacion: string;
  codigo: string;
  tipoMantenimiento: string;
  frecuenciaDias: number;
  tiempoHoras: number;
  cantidad: number;
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  equipos: string[];
  isSeasonalSensitive?: boolean;
  preferredMonths?: number[]; // 0-11 (enero-diciembre)
}

interface ScheduledMaintenance extends MaintenanceTask {
  fechaProgramada: Date;
  tecnicoAsignado?: string;
  estado: 'programado' | 'en-progreso' | 'completado' | 'pendiente';
  notas?: string;
}

interface WorkingConstraints {
  horasPorDia: number;
  tecnicos: number;
  eventosMaxPorDia: number;
  trabajarSabados: boolean;
  horasEmergencia: number;
}

/**
 * Motor de programación optimizado por lotes
 * Procesa múltiples tareas simultáneamente para mayor eficiencia
 */
export class OptimizedSchedulingEngine {
  private constraints: WorkingConstraints;
  private startDate: Date;
  private endDate: Date;
  private workingDays: Date[] = [];
  private scheduledTasks: ScheduledMaintenance[] = [];
  private dailyWorkload: Map<string, { horas: number; eventos: number }> = new Map();

  constructor(
    startDate: Date = startOfYear(new Date()),
    endDate: Date = endOfYear(new Date()),
    constraints: WorkingConstraints = {
      horasPorDia: 7,
      tecnicos: 3,
      eventosMaxPorDia: 4,
      trabajarSabados: false,
      horasEmergencia: 1
    }
  ) {
    this.startDate = startOfDay(startDate);
    this.endDate = startOfDay(endDate);
    this.constraints = constraints;
    this.calculateWorkingDays();
    this.initializeDailyWorkload();
    
    console.log('🚀 Motor optimizado inicializado:', {
      periodo: `${format(this.startDate, 'dd/MM/yyyy')} - ${format(this.endDate, 'dd/MM/yyyy')}`,
      diasLaborables: this.workingDays.length,
      capacidadDiaria: `${this.constraints.horasPorDia}h con ${this.constraints.tecnicos} técnicos`,
      restricciones: this.constraints
    });
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
    
    console.log(`📅 ${this.workingDays.length} días laborables calculados`);
  }

  private initializeDailyWorkload(): void {
    this.dailyWorkload.clear();
    this.workingDays.forEach(day => {
      this.dailyWorkload.set(format(day, 'yyyy-MM-dd'), { horas: 0, eventos: 0 });
    });
  }

  /**
   * Determina meses preferidos para equipos estacionales
   */
  private getPreferredMonths(denominacion: string, tipoMantenimiento: string): number[] {
    const denomLower = denominacion.toLowerCase();
    
    // Equipos de frío - mantenimiento pre-verano
    if (denomLower.includes('frigorífico') || 
        denomLower.includes('refrigerador') || 
        denomLower.includes('aire acondicionado') ||
        denomLower.includes('climatizador')) {
      return [3, 4, 5]; // Abril, mayo, junio
    }
    
    // Equipos de quirófano - mantenimiento en verano
    if (denomLower.includes('quirófano') ||
        denomLower.includes('cirugía') ||
        denomLower.includes('quirúrgico')) {
      return [6, 7, 8]; // Julio, agosto, septiembre
    }
    
    // Sin preferencia específica
    return [];
  }

  /**
   * Busca fechas óptimas considerando estacionalidad y carga
   */
  private findOptimalDatesBatch(
    tasks: MaintenanceTask[], 
    instancesPerTask: number
  ): Map<string, Date[]> {
    
    const results = new Map<string, Date[]>();
    const availableDays = [...this.workingDays];
    
    console.log(`🔍 Búsqueda por lotes para ${tasks.length} tareas`);
    
    // Agrupar tareas por preferencia estacional
    const seasonalTasks = tasks.filter(task => {
      const preferredMonths = this.getPreferredMonths(task.denominacion, task.tipoMantenimiento);
      return preferredMonths.length > 0;
    });
    
    const regularTasks = tasks.filter(task => {
      const preferredMonths = this.getPreferredMonths(task.denominacion, task.tipoMantenimiento);
      return preferredMonths.length === 0;
    });
    
    // Procesar primero tareas estacionales
    seasonalTasks.forEach(task => {
      const preferredMonths = this.getPreferredMonths(task.denominacion, task.tipoMantenimiento);
      const taskDates = this.scheduleTaskInPreferredMonths(task, instancesPerTask, preferredMonths);
      results.set(task.id, taskDates);
    });
    
    // Luego tareas regulares
    regularTasks.forEach(task => {
      const taskDates = this.scheduleTaskUniformly(task, instancesPerTask);
      results.set(task.id, taskDates);
    });
    
    return results;
  }

  private scheduleTaskInPreferredMonths(
    task: MaintenanceTask, 
    instances: number, 
    preferredMonths: number[]
  ): Date[] {
    
    const scheduledDates: Date[] = [];
    const candidateDays = this.workingDays.filter(day => 
      preferredMonths.includes(day.getMonth())
    );
    
    if (candidateDays.length === 0) {
      console.warn(`⚠️ No hay días disponibles en meses preferidos para ${task.denominacion}`);
      return this.scheduleTaskUniformly(task, instances);
    }
    
    const intervalDays = Math.max(1, Math.floor(candidateDays.length / instances));
    
    for (let i = 0; i < instances; i++) {
      const targetIndex = Math.min(i * intervalDays, candidateDays.length - 1);
      const optimalDate = this.findBestDateNear(candidateDays[targetIndex], task, candidateDays);
      
      if (optimalDate) {
        scheduledDates.push(optimalDate);
        this.updateWorkload(optimalDate, task);
      }
    }
    
    console.log(`   📅 ${task.denominacion}: ${scheduledDates.length}/${instances} en meses preferidos`);
    return scheduledDates;
  }

  private scheduleTaskUniformly(task: MaintenanceTask, instances: number): Date[] {
    const scheduledDates: Date[] = [];
    const intervalDays = Math.max(1, Math.floor(this.workingDays.length / instances));
    
    for (let i = 0; i < instances; i++) {
      const targetIndex = Math.min(i * intervalDays, this.workingDays.length - 1);
      const optimalDate = this.findBestDateNear(this.workingDays[targetIndex], task, this.workingDays);
      
      if (optimalDate) {
        scheduledDates.push(optimalDate);
        this.updateWorkload(optimalDate, task);
      }
    }
    
    return scheduledDates;
  }

  private findBestDateNear(targetDate: Date, task: MaintenanceTask, candidateDays: Date[]): Date | null {
    const targetIndex = candidateDays.findIndex(day => 
      format(day, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
    );
    
    if (targetIndex === -1) return null;
    
    const searchWindow = 10; // Ventana de búsqueda de ±10 días
    const startIndex = Math.max(0, targetIndex - searchWindow);
    const endIndex = Math.min(candidateDays.length - 1, targetIndex + searchWindow);
    
    let bestDate: Date | null = null;
    let bestScore = Infinity;
    
    for (let i = startIndex; i <= endIndex; i++) {
      const date = candidateDays[i];
      const dateKey = format(date, 'yyyy-MM-dd');
      const workload = this.dailyWorkload.get(dateKey) || { horas: 0, eventos: 0 };
      
      const horasNecesarias = task.tiempoHoras * task.cantidad;
      const availableHours = this.constraints.horasPorDia - this.constraints.horasEmergencia;
      
      // Verificar si cabe
      if (workload.horas + horasNecesarias <= availableHours && 
          workload.eventos < this.constraints.eventosMaxPorDia) {
        
        const utilizacion = (workload.horas + horasNecesarias) / availableHours;
        const distanceFromTarget = Math.abs(i - targetIndex);
        const score = utilizacion + (distanceFromTarget * 0.1);
        
        if (score < bestScore) {
          bestScore = score;
          bestDate = date;
        }
      }
    }
    
    return bestDate;
  }

  private updateWorkload(date: Date, task: MaintenanceTask): void {
    const dateKey = format(date, 'yyyy-MM-dd');
    const currentWorkload = this.dailyWorkload.get(dateKey) || { horas: 0, eventos: 0 };
    
    currentWorkload.horas += task.tiempoHoras * task.cantidad;
    currentWorkload.eventos += 1;
    
    this.dailyWorkload.set(dateKey, currentWorkload);
  }

  /**
   * Genera calendario completo optimizado por lotes
   */
  public async generateOptimizedSchedule(tasks: MaintenanceTask[]): Promise<ScheduledMaintenance[]> {
    console.log('🚀 GENERANDO CALENDARIO OPTIMIZADO POR LOTES');
    console.log(`📋 Procesando ${tasks.length} tipos de mantenimiento...`);
    
    // Reiniciar estado
    this.scheduledTasks = [];
    this.initializeDailyWorkload();
    
    if (tasks.length === 0) return [];
    
    // Calcular instancias necesarias por tarea
    const instancesPerTask = tasks.map(task => {
      const periodDays = differenceInDays(this.endDate, this.startDate);
      return Math.max(1, Math.floor(periodDays / task.frecuenciaDias));
    });
    
    // Procesar por lotes para optimizar rendimiento
    const batchSize = 10; // Procesar 10 tareas a la vez
    const batches = [];
    
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    console.log(`📦 Procesando en ${batches.length} lotes de máximo ${batchSize} tareas`);
    
    // Procesar cada lote
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`🔄 Procesando lote ${batchIndex + 1}/${batches.length}...`);
      
      const batchResults = this.findOptimalDatesBatch(batch, 4); // Máximo 4 instancias por tarea
      
      // Convertir resultados a ScheduledMaintenance
      batch.forEach((task, taskIndex) => {
        const taskDates = batchResults.get(task.id) || [];
        
        taskDates.forEach((date, instanceIndex) => {
          const scheduledTask: ScheduledMaintenance = {
            ...task,
            id: `${task.id}-${instanceIndex + 1}`,
            fechaProgramada: date,
            estado: 'programado',
            notas: `Instancia ${instanceIndex + 1}/${taskDates.length} - Optimizado`,
            tecnicoAsignado: `Técnico ${(instanceIndex % this.constraints.tecnicos) + 1}`
          };
          
          this.scheduledTasks.push(scheduledTask);
        });
        
        console.log(`   ✅ ${task.denominacion}: ${taskDates.length} mantenimientos programados`);
      });
      
      // Simular progreso para UI responsiva
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Ordenar por fecha
    this.scheduledTasks.sort((a, b) => 
      a.fechaProgramada.getTime() - b.fechaProgramada.getTime()
    );
    
    console.log(`✅ CALENDARIO OPTIMIZADO GENERADO: ${this.scheduledTasks.length} mantenimientos`);
    this.printOptimizedAnalysis();
    
    return [...this.scheduledTasks];
  }

  private printOptimizedAnalysis(): void {
    console.log('\n📊 ANÁLISIS DEL CALENDARIO OPTIMIZADO:');
    
    const totalHours = this.scheduledTasks.reduce((sum, task) => 
      sum + (task.tiempoHoras * task.cantidad), 0
    );
    
    const activeDays = new Set(this.scheduledTasks.map(task => 
      format(task.fechaProgramada, 'yyyy-MM-dd')
    )).size;
    
    const availableCapacity = this.workingDays.length * 
      (this.constraints.horasPorDia - this.constraints.horasEmergencia);
    
    const utilization = (totalHours / availableCapacity) * 100;
    
    console.log(`⚡ Estadísticas globales:`);
    console.log(`   Total mantenimientos: ${this.scheduledTasks.length}`);
    console.log(`   Días con actividad: ${activeDays}/${this.workingDays.length} (${((activeDays/this.workingDays.length)*100).toFixed(1)}%)`);
    console.log(`   Horas totales programadas: ${totalHours}h`);
    console.log(`   Capacidad anual disponible: ${availableCapacity}h`);
    console.log(`   Utilización de recursos: ${utilization.toFixed(1)}%`);
    
    // Análisis de carga máxima diaria
    const dailyLoads = Array.from(this.dailyWorkload.values());
    const maxDailyHours = Math.max(...dailyLoads.map(d => d.horas));
    const avgDailyHours = dailyLoads.reduce((sum, d) => sum + d.horas, 0) / dailyLoads.length;
    
    console.log(`📈 Distribución de carga:`);
    console.log(`   Máximo horas/día: ${maxDailyHours.toFixed(1)}h`);
    console.log(`   Promedio horas/día: ${avgDailyHours.toFixed(1)}h`);
    console.log(`   Capacidad diaria: ${this.constraints.horasPorDia}h`);
  }

  public getScheduledTasks(): ScheduledMaintenance[] {
    return [...this.scheduledTasks];
  }

  public getWorkingDaysCount(): number {
    return this.workingDays.length;
  }

  public getDailyWorkloadStats() {
    const dailyLoads = Array.from(this.dailyWorkload.values());
    return {
      maxHours: Math.max(...dailyLoads.map(d => d.horas)),
      avgHours: dailyLoads.reduce((sum, d) => sum + d.horas, 0) / dailyLoads.length,
      totalHours: dailyLoads.reduce((sum, d) => sum + d.horas, 0),
      activeDays: dailyLoads.filter(d => d.horas > 0).length
    };
  }
}
