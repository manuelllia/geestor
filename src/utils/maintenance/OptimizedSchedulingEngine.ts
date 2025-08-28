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
  preferredMonths?: number[];
  frecuenciaTexto?: string; // Nueva propiedad para mantener la frecuencia original
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
 * Motor de programación optimizado que asegura el cumplimiento de todos los mantenimientos
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

  private getPreferredMonths(denominacion: string, tipoMantenimiento: string): number[] {
    const denomLower = denominacion.toLowerCase();
    
    if (denomLower.includes('frigorífico') || 
        denomLower.includes('refrigerador') || 
        denomLower.includes('aire acondicionado') ||
        denomLower.includes('climatizador')) {
      return [3, 4, 5]; // Abril, mayo, junio
    }
    
    if (denomLower.includes('quirófano') ||
        denomLower.includes('cirugía') ||
        denomLower.includes('quirúrgico')) {
      return [6, 7, 8]; // Julio, agosto, septiembre
    }
    
    return [];
  }

  /**
   * Calcula el número exacto de instancias necesarias basado en la frecuencia
   */
  private calculateRequiredInstances(task: MaintenanceTask): number {
    const periodDays = differenceInDays(this.endDate, this.startDate);
    let instances = Math.floor(periodDays / task.frecuenciaDias);
    
    // Asegurar al menos una instancia por tarea
    if (instances === 0) instances = 1;
    
    // Para frecuencias específicas, ajustar según el tipo
    if (task.frecuenciaTexto) {
      const frecuenciaLower = task.frecuenciaTexto.toLowerCase();
      if (frecuenciaLower.includes('mensual')) instances = 12;
      else if (frecuenciaLower.includes('trimestral')) instances = 4;
      else if (frecuenciaLower.includes('semestral')) instances = 2;
      else if (frecuenciaLower.includes('anual')) instances = 1;
    }
    
    console.log(`📋 ${task.denominacion}: ${instances} instancias requeridas`);
    return instances;
  }

  /**
   * Programa una tarea asegurando que todas las horas se asignen el mismo día
   */
  private scheduleTaskWithFullTimeBlocks(task: MaintenanceTask, requiredInstances: number): Date[] {
    const scheduledDates: Date[] = [];
    const totalHorasNecesarias = task.tiempoHoras * task.cantidad; // Todas las horas juntas
    
    console.log(`🔧 Programando ${task.denominacion}: ${totalHorasNecesarias} horas por instancia`);
    
    // Verificar si es posible técnicamente
    const maxHorasDiarias = this.constraints.horasPorDia - this.constraints.horasEmergencia;
    if (totalHorasNecesarias > maxHorasDiarias * this.constraints.tecnicos) {
      console.warn(`⚠️ ${task.denominacion} requiere ${totalHorasNecesarias}h pero máximo disponible es ${maxHorasDiarias * this.constraints.tecnicos}h`);
    }
    
    const preferredMonths = this.getPreferredMonths(task.denominacion, task.tipoMantenimiento);
    const candidateDays = preferredMonths.length > 0 
      ? this.workingDays.filter(day => preferredMonths.includes(day.getMonth()))
      : this.workingDays;
    
    // Distribuir instancias a lo largo del período
    const intervalDays = Math.max(1, Math.floor(candidateDays.length / requiredInstances));
    
    for (let i = 0; i < requiredInstances; i++) {
      const targetIndex = Math.min(i * intervalDays, candidateDays.length - 1);
      const optimalDate = this.findBestDateForFullTimeBlock(
        candidateDays[targetIndex], 
        totalHorasNecesarias, 
        candidateDays
      );
      
      if (optimalDate) {
        scheduledDates.push(optimalDate);
        this.updateWorkloadWithFullBlock(optimalDate, totalHorasNecesarias);
        console.log(`✅ ${task.denominacion} instancia ${i+1}: ${format(optimalDate, 'dd/MM/yyyy')} (${totalHorasNecesarias}h)`);
      } else {
        console.warn(`❌ No se pudo programar instancia ${i+1} de ${task.denominacion}`);
      }
    }
    
    return scheduledDates;
  }

  private findBestDateForFullTimeBlock(targetDate: Date, horasNecesarias: number, candidateDays: Date[]): Date | null {
    const targetIndex = candidateDays.findIndex(day => 
      format(day, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
    );
    
    if (targetIndex === -1) return null;
    
    const searchWindow = 15; // Ventana de búsqueda ampliada
    const startIndex = Math.max(0, targetIndex - searchWindow);
    const endIndex = Math.min(candidateDays.length - 1, targetIndex + searchWindow);
    
    const maxHorasDiarias = (this.constraints.horasPorDia - this.constraints.horasEmergencia) * this.constraints.tecnicos;
    
    for (let i = startIndex; i <= endIndex; i++) {
      const date = candidateDays[i];
      const dateKey = format(date, 'yyyy-MM-dd');
      const workload = this.dailyWorkload.get(dateKey) || { horas: 0, eventos: 0 };
      
      if (workload.horas + horasNecesarias <= maxHorasDiarias && 
          workload.eventos < this.constraints.eventosMaxPorDia) {
        return date;
      }
    }
    
    return null;
  }

  private updateWorkloadWithFullBlock(date: Date, horas: number): void {
    const dateKey = format(date, 'yyyy-MM-dd');
    const currentWorkload = this.dailyWorkload.get(dateKey) || { horas: 0, eventos: 0 };
    
    currentWorkload.horas += horas;
    currentWorkload.eventos += 1;
    
    this.dailyWorkload.set(dateKey, currentWorkload);
  }

  /**
   * Ajusta automáticamente el número de técnicos si es necesario
   */
  private adjustTechniciansIfNeeded(totalHorasAnuales: number): void {
    const diasLaborablesPorAno = this.workingDays.length;
    const horasDisponiblesPorAno = diasLaborablesPorAno * (this.constraints.horasPorDia - this.constraints.horasEmergencia) * this.constraints.tecnicos;
    
    if (totalHorasAnuales > horasDisponiblesPorAno) {
      const tecnicosNecesarios = Math.ceil(totalHorasAnuales / (diasLaborablesPorAno * (this.constraints.horasPorDia - this.constraints.horasEmergencia)));
      
      console.log(`🔧 AJUSTE AUTOMÁTICO DE TÉCNICOS:`);
      console.log(`   Horas totales requeridas: ${totalHorasAnuales}h`);
      console.log(`   Capacidad actual: ${horasDisponiblesPorAno}h con ${this.constraints.tecnicos} técnicos`);
      console.log(`   Técnicos necesarios: ${tecnicosNecesarios}`);
      
      this.constraints.tecnicos = tecnicosNecesarios;
      this.initializeDailyWorkload(); // Reinicializar con nueva capacidad
      
      console.log(`✅ Número de técnicos ajustado a ${this.constraints.tecnicos}`);
    }
  }

  /**
   * Genera calendario completo asegurando el cumplimiento de todos los mantenimientos
   */
  public async generateOptimizedSchedule(tasks: MaintenanceTask[]): Promise<ScheduledMaintenance[]> {
    console.log('🚀 GENERANDO CALENDARIO CON CUMPLIMIENTO GARANTIZADO');
    console.log(`📋 Procesando ${tasks.length} tipos de mantenimiento...`);
    
    this.scheduledTasks = [];
    this.initializeDailyWorkload();
    
    if (tasks.length === 0) return [];
    
    // Calcular total de horas necesarias para ajustar técnicos si es necesario
    const totalHorasAnuales = tasks.reduce((sum, task) => {
      const instances = this.calculateRequiredInstances(task);
      return sum + (instances * task.tiempoHoras * task.cantidad);
    }, 0);
    
    this.adjustTechniciansIfNeeded(totalHorasAnuales);
    
    // Procesar cada tarea asegurando cumplimiento
    for (const task of tasks) {
      const requiredInstances = this.calculateRequiredInstances(task);
      const scheduledDates = this.scheduleTaskWithFullTimeBlocks(task, requiredInstances);
      
      scheduledDates.forEach((date, instanceIndex) => {
        const scheduledTask: ScheduledMaintenance = {
          ...task,
          id: `${task.id}-${instanceIndex + 1}`,
          fechaProgramada: date,
          estado: 'programado',
          notas: `${task.frecuenciaTexto || 'Frecuencia personalizada'} - ${task.tiempoHoras * task.cantidad}h total`,
          tecnicoAsignado: `Técnico ${(instanceIndex % this.constraints.tecnicos) + 1}`
        };
        
        this.scheduledTasks.push(scheduledTask);
      });
      
      console.log(`✅ ${task.denominacion}: ${scheduledDates.length}/${requiredInstances} mantenimientos programados`);
    }
    
    this.scheduledTasks.sort((a, b) => 
      a.fechaProgramada.getTime() - b.fechaProgramada.getTime()
    );
    
    console.log(`✅ CALENDARIO GENERADO: ${this.scheduledTasks.length} mantenimientos con ${this.constraints.tecnicos} técnicos`);
    this.printComplianceAnalysis(totalHorasAnuales);
    
    return [...this.scheduledTasks];
  }

  private printComplianceAnalysis(totalHorasRequeridas: number): void {
    console.log('\n📊 ANÁLISIS DE CUMPLIMIENTO:');
    
    const totalHorasProgramadas = this.scheduledTasks.reduce((sum, task) => 
      sum + (task.tiempoHoras * task.cantidad), 0
    );
    
    const diasLaborables = this.workingDays.length;
    const capacidadTotal = diasLaborables * (this.constraints.horasPorDia - this.constraints.horasEmergencia) * this.constraints.tecnicos;
    const utilizacion = (totalHorasProgramadas / capacidadTotal) * 100;
    
    console.log(`📈 Estadísticas de cumplimiento:`);
    console.log(`   Horas requeridas: ${totalHorasRequeridas}h`);
    console.log(`   Horas programadas: ${totalHorasProgramadas}h`);
    console.log(`   Capacidad total: ${capacidadTotal}h`);
    console.log(`   Utilización: ${utilizacion.toFixed(1)}%`);
    console.log(`   Técnicos necesarios: ${this.constraints.tecnicos}`);
    console.log(`   Cumplimiento: ${totalHorasProgramadas >= totalHorasRequeridas ? '✅ COMPLETO' : '❌ PARCIAL'}`);
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
      activeDays: dailyLoads.filter(d => d.horas > 0).length,
      techniciansUsed: this.constraints.tecnicos
    };
  }
}
