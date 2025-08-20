
interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

import { MaintenanceTask } from './MaintenanceSchedulingEngine';

/**
 * Procesador de tareas de mantenimiento
 * Convierte datos de denominaciones en tareas programables
 */
export class MaintenanceTaskProcessor {
  
  /**
   * Parsea la frecuencia de mantenimiento a días exactos
   * Aplica lógica ingenieril para interpretar frecuencias
   */
  static parseFrequencyToDays(frecuencia: string): number {
    const freq = frecuencia.toLowerCase().trim();
    
    console.log(`🔍 Procesando frecuencia: "${frecuencia}"`);
    
    // Patrones específicos más comunes en mantenimiento hospitalario
    const patterns = [
      { regex: /diario|daily|diaria/i, days: 1 },
      { regex: /semanal|weekly/i, days: 7 },
      { regex: /quincenal|biweekly/i, days: 15 },
      { regex: /mensual|monthly/i, days: 30 },
      { regex: /bimensual|bimonthly/i, days: 60 },
      { regex: /trimestral|quarterly/i, days: 90 },
      { regex: /cuatrimestral/i, days: 120 },
      { regex: /semestral|biannual/i, days: 180 },
      { regex: /anual|yearly|annual/i, days: 365 },
      
      // Patrones numéricos
      { regex: /cada\s+(\d+)\s+días?/i, multiplier: 1 },
      { regex: /(\d+)\s+días?/i, multiplier: 1 },
      { regex: /cada\s+(\d+)\s+semanas?/i, multiplier: 7 },
      { regex: /(\d+)\s+semanas?/i, multiplier: 7 },
      { regex: /cada\s+(\d+)\s+meses?/i, multiplier: 30 },
      { regex: /(\d+)\s+meses?/i, multiplier: 30 },
      { regex: /(\d+)\s*h/i, multiplier: 1/24 }, // horas operativas a días
    ];
    
    // Verificar patrones fijos
    for (const pattern of patterns) {
      if ('days' in pattern && pattern.regex.test(freq)) {
        console.log(`✅ Patrón fijo encontrado: ${pattern.days} días`);
        return pattern.days;
      }
    }
    
    // Verificar patrones con multiplicador
    for (const pattern of patterns) {
      if ('multiplier' in pattern) {
        const match = freq.match(pattern.regex);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > 0) {
            const result = Math.max(1, Math.round(num * pattern.multiplier));
            console.log(`✅ Patrón calculado: ${num} × ${pattern.multiplier} = ${result} días`);
            return result;
          }
        }
      }
    }
    
    // Fallback: buscar cualquier número y aplicar lógica contextual
    const numberMatch = freq.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1], 10);
      if (!isNaN(num) && num > 0) {
        // Lógica contextual basada en rangos típicos
        if (num <= 7) return num; // Probablemente días
        if (num <= 52) return num * 7; // Probablemente semanas
        if (num <= 12) return num * 30; // Probablemente meses
        if (num <= 365) return num; // Probablemente días
        return 365; // Máximo un año
      }
    }
    
    console.log(`⚠️ Frecuencia no reconocida: "${frecuencia}" - usando 90 días (trimestral)`);
    return 90; // Trimestral por defecto (estándar hospitalario)
  }

  /**
   * Parsea el tiempo de mantenimiento a horas
   */
  static parseMaintenanceTime(tiempo?: string): number {
    if (!tiempo) return 2; // Por defecto 2 horas
    
    const tiempoStr = tiempo.toLowerCase().trim();
    const numberMatch = tiempoStr.match(/(\d+(?:\.\d+)?)/);
    
    if (numberMatch) {
      const num = parseFloat(numberMatch[1]);
      if (!isNaN(num)) {
        if (tiempoStr.includes('min')) return Math.max(0.5, num / 60); // Mínimo 30 min
        if (tiempoStr.includes('hora') || tiempoStr.includes('hour') || tiempoStr.includes('h')) {
          return Math.min(8, Math.max(0.5, num)); // Entre 30 min y 8 horas
        }
        return Math.min(8, Math.max(0.5, num)); // Por defecto asumir horas
      }
    }
    
    return 2; // Por defecto 2 horas
  }

  /**
   * Determina la prioridad basada en el tipo de mantenimiento
   */
  static getPriorityFromType(tipoMantenimiento: string): 'baja' | 'media' | 'alta' | 'critica' {
    const tipo = tipoMantenimiento.toLowerCase();
    
    // Mantenimiento crítico
    if (tipo.includes('correctivo') || tipo.includes('emergencia') || tipo.includes('urgente') || 
        tipo.includes('reparacion') || tipo.includes('reparación') || tipo.includes('averia') || 
        tipo.includes('avería') || tipo.includes('fallo')) {
      return 'critica';
    }
    
    // Mantenimiento de alta prioridad
    if (tipo.includes('calibracion') || tipo.includes('calibración') || tipo.includes('metrologia') || 
        tipo.includes('metrología') || tipo.includes('verificacion') || tipo.includes('verificación') ||
        tipo.includes('seguridad') || tipo.includes('certificacion') || tipo.includes('certificación')) {
      return 'alta';
    }
    
    // Mantenimiento de prioridad media
    if (tipo.includes('preventivo') || tipo.includes('predictivo') || tipo.includes('programado') ||
        tipo.includes('revision') || tipo.includes('revisión') || tipo.includes('inspeccion') ||
        tipo.includes('inspección')) {
      return 'media';
    }
    
    // Mantenimiento de baja prioridad
    return 'baja';
  }

  /**
   * Convierte denominaciones homogéneas en tareas de mantenimiento
   */
  static convertToMaintenanceTasks(denominaciones: DenominacionHomogeneaData[]): MaintenanceTask[] {
    console.log('🔄 Convirtiendo denominaciones a tareas de mantenimiento...');
    
    return denominaciones.map((denom, index) => {
      const frecuenciaDias = this.parseFrequencyToDays(denom.frecuencia);
      const tiempoHoras = this.parseMaintenanceTime(denom.tiempo);
      const prioridad = this.getPriorityFromType(denom.tipoMantenimiento);
      
      // Limitar cantidad de equipos por sesión para ser más realista
      const cantidadOptima = Math.min(5, Math.max(1, Math.ceil(denom.cantidad / 4)));
      
      const task: MaintenanceTask = {
        id: `task-${denom.codigo}-${index}`,
        denominacion: denom.denominacion,
        codigo: denom.codigo,
        tipoMantenimiento: denom.tipoMantenimiento,
        frecuenciaDias,
        tiempoHoras,
        cantidad: cantidadOptima,
        prioridad,
        equipos: Array.from({ length: cantidadOptima }, (_, i) => 
          `${denom.denominacion} #${i + 1}`
        )
      };
      
      console.log(`   ✅ ${denom.denominacion}: ${frecuenciaDias}d, ${tiempoHoras}h, prioridad ${prioridad}`);
      
      return task;
    });
  }
}
