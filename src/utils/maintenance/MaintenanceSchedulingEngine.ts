
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
 * Motor de programación de mantenimiento basado en principios de ingeniería de confiabilidad
 * Inspirado en metodologías RCM (Reliability Centered Maintenance)
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
      horasPorDia: 6,
      tecnicos: 2,
      eventosMaxPorDia: 3,
      trabajarSabados: true,
      horasEmergencia: 1
    }
  ) {
    this.startDate = startOfDay(startDate);
    this.endDate = startOfDay(endDate);
    this.constraints = constraints;
    this.calculateWorkingDays();
  }

  /**
   * Calcula todos los días laborables en el período
   * Considera lunes-viernes + sábados opcionales
   */
  private calculateWorkingDays(): void {
    const totalDays = differenceInDays(this.endDate, this.startDate);
    
    for (let i = 0; i <= totalDays; i++) {
      const currentDay = addDays(this.startDate, i);
      const dayOfWeek = currentDay.getDay();
      
      // Lunes a viernes siempre
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        this.workingDays.push(currentDay);
      }
      // Sábados si está habilitado
      else if (dayOfWeek === 6 && this.constraints.trabajarSabados) {
        this.workingDays.push(currentDay);
      }
    }
    
    console.log(`📅 Días laborables calculados: ${this.workingDays.length} días`);
  }

  /**
   * Programa una tarea de mantenimiento aplicando algoritmo de distribución óptima
   * Basado en la teoría de colas y programación de recursos limitados
   */
  public scheduleMaintenanceTask(task: MaintenanceTask): ScheduledMaintenance[] {
    const scheduledInstances: ScheduledMaintenance[] = [];
    const totalDaysAvailable = this.workingDays.length;
    
    // Calcular cuántas veces debe ejecutarse en el período
    const periodDays = differenceInDays(this.endDate, this.startDate);
    const instancesNeeded = Math.max(1, Math.floor(periodDays / task.frecuenciaDias));
    
    console.log(`🔧 Programando: ${task.denominacion}`);
    console.log(`   Frecuencia: cada ${task.frecuenciaDias} días`);
    console.log(`   Instancias necesarias: ${instancesNeeded}`);
    
    // Distribución uniforme con separación mínima
    const separacionMinima = Math.floor(totalDaysAvailable / instancesNeeded);
    let ultimaFechaProgramada = -1;
    
    for (let i = 0; i < instancesNeeded; i++) {
      // Calcular posición ideal con distribución uniforme
      const posicionIdeal = Math.floor((i * totalDaysAvailable) / instancesNeeded);
      
      // Buscar el mejor día disponible cerca de la posición ideal
      const fechaOptima = this.findOptimalDate(posicionIdeal, task, ultimaFechaProgramada + separacionMinima);
      
      if (fechaOptima) {
        const scheduledTask: ScheduledMaintenance = {
          ...task,
          id: `${task.id}-instance-${i + 1}`,
          fechaProgramada: fechaOptima,
          estado: fechaOptima < new Date() ? 'completado' : 'programado',
          notas: `Mantenimiento ${i + 1}/${instancesNeeded} - Programación optimizada`,
        };
        
        scheduledInstances.push(scheduledTask);
        this.scheduledTasks.push(scheduledTask);
        ultimaFechaProgramada = this.workingDays.indexOf(fechaOptima);
        
        console.log(`   ✅ Instancia ${i + 1}: ${format(fechaOptima, 'dd/MM/yyyy')}`);
      }
    }
    
    return scheduledInstances;
  }

  /**
   * Encuentra la fecha óptima aplicando algoritmos de optimización de recursos
   * Considera carga de trabajo, disponibilidad de técnicos y prioridades
   */
  private findOptimalDate(posicionIdeal: number, task: MaintenanceTask, posicionMinima: number = 0): Date | null {
    const ventanaBusqueda = Math.min(30, Math.floor(this.workingDays.length / 10)); // Ventana del 10% o máximo 30 días
    
    // Definir rango de búsqueda alrededor de la posición ideal
    const inicio = Math.max(posicionMinima, posicionIdeal - ventanaBusqueda);
    const fin = Math.min(this.workingDays.length - 1, posicionIdeal + ventanaBusqueda);
    
    let mejorFecha: Date | null = null;
    let menorCarga = Infinity;
    
    for (let pos = inicio; pos <= fin; pos++) {
      const fecha = this.workingDays[pos];
      const cargaActual = this.calculateDayWorkload(fecha);
      const capacidadDisponible = this.constraints.horasPorDia - this.constraints.horasEmergencia;
      
      // Verificar si el día puede acomodar esta tarea
      const horasNecesarias = task.tiempoHoras * task.cantidad;
      const eventosActuales = this.getTasksForDay(fecha).length;
      
      const puedeAcomodar = (
        cargaActual.horas + horasNecesarias <= capacidadDisponible &&
        eventosActuales < this.constraints.eventosMaxPorDia
      );
      
      if (puedeAcomodar) {
        // Calcular puntuación basada en carga actual y distancia a la posición ideal
        const distanciaIdeal = Math.abs(pos - posicionIdeal);
        const factorDistancia = 1 + (distanciaIdeal / ventanaBusqueda);
        const puntuacion = cargaActual.utilizacion * factorDistancia;
        
        if (puntuacion < menorCarga) {
          menorCarga = puntuacion;
          mejorFecha = fecha;
        }
      }
    }
    
    // Si no encontramos fecha en la ventana, buscar la primera disponible después
    if (!mejorFecha && fin < this.workingDays.length - 1) {
      for (let pos = fin + 1; pos < this.workingDays.length; pos++) {
        const fecha = this.workingDays[pos];
        const cargaActual = this.calculateDayWorkload(fecha);
        const capacidadDisponible = this.constraints.horasPorDia - this.constraints.horasEmergencia;
        const horasNecesarias = task.tiempoHoras * task.cantidad;
        const eventosActuales = this.getTasksForDay(fecha).length;
        
        if (cargaActual.horas + horasNecesarias <= capacidadDisponible && 
            eventosActuales < this.constraints.eventosMaxPorDia) {
          mejorFecha = fecha;
          break;
        }
      }
    }
    
    return mejorFecha;
  }

  /**
   * Calcula la carga de trabajo de un día específico
   */
  private calculateDayWorkload(fecha: Date): { horas: number; eventos: number; utilizacion: number } {
    const tareasDelDia = this.getTasksForDay(fecha);
    const horasTotales = tareasDelDia.reduce((sum, task) => sum + (task.tiempoHoras * task.cantidad), 0);
    const capacidadTotal = this.constraints.horasPorDia - this.constraints.horasEmergencia;
    
    return {
      horas: horasTotales,
      eventos: tareasDelDia.length,
      utilizacion: capacidadTotal > 0 ? horasTotales / capacidadTotal : 0
    };
  }

  /**
   * Obtiene todas las tareas programadas para un día específico
   */
  private getTasksForDay(fecha: Date): ScheduledMaintenance[] {
    const fechaStr = format(fecha, 'yyyy-MM-dd');
    return this.scheduledTasks.filter(task => 
      format(task.fechaProgramada, 'yyyy-MM-dd') === fechaStr
    );
  }

  /**
   * Genera el calendario completo para todas las tareas
   */
  public generateFullSchedule(tasks: MaintenanceTask[]): ScheduledMaintenance[] {
    console.log('🏗️ Iniciando generación de calendario profesional...');
    console.log(`📊 Período: ${format(this.startDate, 'dd/MM/yyyy')} - ${format(this.endDate, 'dd/MM/yyyy')}`);
    console.log(`📋 Tareas a programar: ${tasks.length}`);
    console.log(`⚙️ Restricciones: ${this.constraints.horasPorDia}h/día, ${this.constraints.tecnicos} técnicos, max ${this.constraints.eventosMaxPorDia} eventos/día`);
    
    // Reiniciar programación
    this.scheduledTasks = [];
    
    // Ordenar tareas por prioridad y frecuencia
    const tasksPriorizadas = [...tasks].sort((a, b) => {
      const prioridadOrder = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
      const prioridadDiff = prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      if (prioridadDiff !== 0) return prioridadDiff;
      
      // Si tienen la misma prioridad, ordenar por frecuencia (más frecuente primero)
      return a.frecuenciaDias - b.frecuenciaDias;
    });
    
    // Programar cada tarea
    tasksPriorizadas.forEach(task => {
      this.scheduleMaintenanceTask(task);
    });
    
    // Análisis final
    this.printScheduleAnalysis();
    
    return [...this.scheduledTasks].sort((a, b) => 
      a.fechaProgramada.getTime() - b.fechaProgramada.getTime()
    );
  }

  /**
   * Imprime análisis detallado del calendario generado
   */
  private printScheduleAnalysis(): void {
    console.log('\n📈 ANÁLISIS DEL CALENDARIO GENERADO:');
    console.log(`📅 Total de mantenimientos programados: ${this.scheduledTasks.length}`);
    
    // Análisis por mes
    const distribucionMensual: { [key: string]: { eventos: number; horas: number } } = {};
    
    this.scheduledTasks.forEach(task => {
      const mes = format(task.fechaProgramada, 'yyyy-MM');
      if (!distribucionMensual[mes]) {
        distribucionMensual[mes] = { eventos: 0, horas: 0 };
      }
      distribucionMensual[mes].eventos++;
      distribucionMensual[mes].horas += task.tiempoHoras * task.cantidad;
    });
    
    console.log('\n📊 Distribución mensual:');
    Object.entries(distribucionMensual).forEach(([mes, data]) => {
      const fecha = new Date(mes + '-01');
      const nombreMes = format(fecha, 'MMMM yyyy');
      console.log(`   ${nombreMes}: ${data.eventos} eventos, ${data.horas.toFixed(1)} horas`);
    });
    
    // Análisis de carga de trabajo
    const diasConCarga = new Set(this.scheduledTasks.map(task => 
      format(task.fechaProgramada, 'yyyy-MM-dd')
    )).size;
    
    const utilizacionPromedio = diasConCarga > 0 ? 
      (this.scheduledTasks.reduce((sum, task) => sum + (task.tiempoHoras * task.cantidad), 0) / diasConCarga) / 
      (this.constraints.horasPorDia - this.constraints.horasEmergencia) : 0;
    
    console.log(`\n⚡ Utilización de recursos:`);
    console.log(`   Días con actividad: ${diasConCarga}/${this.workingDays.length} (${((diasConCarga/this.workingDays.length)*100).toFixed(1)}%)`);
    console.log(`   Utilización promedio: ${(utilizacionPromedio*100).toFixed(1)}%`);
  }

  public getWorkingDaysCount(): number {
    return this.workingDays.length;
  }

  public getScheduledTasks(): ScheduledMaintenance[] {
    return [...this.scheduledTasks];
  }
}
