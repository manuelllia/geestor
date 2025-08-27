
interface MaintenanceCSVRow {
  equipo: string;
  numeroEquipo: number;
  tipoMantenimiento: string;
  horasPorMantenimiento: number;
  horasTotales: number;
  ene: number;
  feb: number;
  mar: number;
  abr: number;
  may: number;
  jun: number;
  jul: number;
  ago: number;
  sep: number;
  oct: number;
  nov: number;
  dic: number;
}

interface DenominacionHomogeneaData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo?: string;
}

export class MaintenanceCSVExporter {
  
  /**
   * Determina la distribución mensual considerando factores estacionales
   */
  private static getSeasonalDistribution(
    denominacion: string, 
    tipoMantenimiento: string,
    frecuencia: string,
    totalHours: number
  ): { [month: string]: number } {
    
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const distribution: { [month: string]: number } = {};
    
    // Inicializar todos los meses en 0
    months.forEach(month => distribution[month] = 0);
    
    const denominacionLower = denominacion.toLowerCase();
    const tipoLower = tipoMantenimiento.toLowerCase();
    const frecuenciaLower = frecuencia.toLowerCase();
    
    // Determinar frecuencia en número de veces al año
    let frecuenciaAnual = 1;
    if (frecuenciaLower.includes('diario') || frecuenciaLower.includes('diaria')) frecuenciaAnual = 365;
    else if (frecuenciaLower.includes('semanal')) frecuenciaAnual = 52;
    else if (frecuenciaLower.includes('quincenal')) frecuenciaAnual = 24;
    else if (frecuenciaLower.includes('mensual')) frecuenciaAnual = 12;
    else if (frecuenciaLower.includes('bimensual')) frecuenciaAnual = 6;
    else if (frecuenciaLower.includes('trimestral')) frecuenciaAnual = 4;
    else if (frecuenciaLower.includes('cuatrimestral')) frecuenciaAnual = 3;
    else if (frecuenciaLower.includes('semestral')) frecuenciaAnual = 2;
    else if (frecuenciaLower.includes('anual')) frecuenciaAnual = 1;
    
    // Calcular horas por instancia de mantenimiento
    const horasPorInstancia = totalHours / frecuenciaAnual;
    
    // Lógica estacional para equipos específicos
    if (denominacionLower.includes('frigorífico') || 
        denominacionLower.includes('refrigerador') || 
        denominacionLower.includes('congelador') ||
        denominacionLower.includes('aire acondicionado') ||
        denominacionLower.includes('climatizador')) {
      
      // Mantenimiento de equipos de frío - mayor intensidad antes del verano
      if (frecuenciaAnual === 1) {
        distribution['may'] = totalHours; // Una vez al año en mayo
      } else if (frecuenciaAnual === 2) {
        distribution['may'] = horasPorInstancia;
        distribution['oct'] = horasPorInstancia; // Semestral: mayo y octubre
      } else if (frecuenciaAnual >= 12) {
        // Mensual o mayor frecuencia - distribución uniforme con énfasis pre-verano
        const baseHoursPerMonth = totalHours / 12;
        months.forEach((month, index) => {
          // Mayor intensidad en abril, mayo, junio (pre-verano) y septiembre, octubre (pre-invierno)
          const multiplier = ['abr', 'may', 'jun', 'sep', 'oct'].includes(month) ? 1.3 : 0.8;
          distribution[month] = baseHoursPerMonth * multiplier;
        });
      } else {
        // Distribución estacional con énfasis en meses clave
        const mesesPreferidos = ['abr', 'may', 'jun', 'sep', 'oct', 'nov'];
        this.distributeHoursInMonths(distribution, horasPorInstancia, frecuenciaAnual, mesesPreferidos);
      }
      
    } else if (denominacionLower.includes('quirófano') ||
               denominacionLower.includes('cirugía') ||
               denominacionLower.includes('quirúrgico') ||
               denominacionLower.includes('mesa de operaciones')) {
      
      // Mantenimiento de quirófanos - intensidad en períodos de menor actividad (verano)
      if (frecuenciaAnual === 1) {
        distribution['jul'] = totalHours; // Una vez al año en julio
      } else if (frecuenciaAnual === 2) {
        distribution['jul'] = horasPorInstancia;
        distribution['dic'] = horasPorInstancia; // Semestral: julio y diciembre
      } else if (frecuenciaAnual >= 12) {
        // Mensual - distribución uniforme con énfasis en verano y fin de año
        const baseHoursPerMonth = totalHours / 12;
        months.forEach((month, index) => {
          const multiplier = ['jul', 'ago', 'dic'].includes(month) ? 1.4 : 0.9;
          distribution[month] = baseHoursPerMonth * multiplier;
        });
      } else {
        const mesesPreferidos = ['jun', 'jul', 'ago', 'dic'];
        this.distributeHoursInMonths(distribution, horasPorInstancia, frecuenciaAnual, mesesPreferidos);
      }
      
    } else if (denominacionLower.includes('ventilador') ||
               denominacionLower.includes('respirador') ||
               denominacionLower.includes('monitor') ||
               denominacionLower.includes('desfibrilador')) {
      
      // Equipos críticos - mantenimiento distribuido uniformemente todo el año
      if (frecuenciaAnual >= 12) {
        const horasPerMonth = totalHours / 12;
        months.forEach(month => distribution[month] = horasPerMonth);
      } else {
        this.distributeHoursUniformly(distribution, horasPorInstancia, frecuenciaAnual, months);
      }
      
    } else if (denominacionLower.includes('rayos x') ||
               denominacionLower.includes('radiología') ||
               denominacionLower.includes('tomógrafo') ||
               denominacionLower.includes('resonancia') ||
               denominacionLower.includes('ecógrafo')) {
      
      // Equipos de diagnóstico por imagen - mantenimiento planificado
      if (frecuenciaAnual >= 12) {
        const baseHoursPerMonth = totalHours / 12;
        months.forEach((month, index) => {
          // Evitar meses de mayor demanda (enero, septiembre)
          const multiplier = ['ene', 'sep'].includes(month) ? 0.7 : 1.1;
          distribution[month] = baseHoursPerMonth * multiplier;
        });
      } else {
        const mesesPreferidos = ['feb', 'mar', 'may', 'jun', 'oct', 'nov'];
        this.distributeHoursInMonths(distribution, horasPorInstancia, frecuenciaAnual, mesesPreferidos);
      }
      
    } else {
      // Distribución uniforme para otros equipos
      if (frecuenciaAnual >= 12) {
        const horasPerMonth = totalHours / 12;
        months.forEach(month => distribution[month] = horasPerMonth);
      } else {
        this.distributeHoursUniformly(distribution, horasPorInstancia, frecuenciaAnual, months);
      }
    }
    
    return distribution;
  }
  
  /**
   * Distribuye horas uniformemente a lo largo del año
   */
  private static distributeHoursUniformly(
    distribution: { [month: string]: number },
    horasPorInstancia: number,
    frecuenciaAnual: number,
    months: string[]
  ) {
    if (frecuenciaAnual >= 12) {
      // Mensual o más frecuente - cada mes
      months.forEach(month => distribution[month] = horasPorInstancia);
    } else {
      // Distribuir equitativamente
      const intervalMonths = Math.floor(12 / frecuenciaAnual);
      for (let i = 0; i < frecuenciaAnual; i++) {
        const monthIndex = (i * intervalMonths) % 12;
        distribution[months[monthIndex]] += horasPorInstancia;
      }
      
      // Si sobran instancias, distribuir en meses restantes
      const remaining = frecuenciaAnual - Math.floor(frecuenciaAnual / intervalMonths) * intervalMonths;
      for (let i = 0; i < remaining; i++) {
        const monthIndex = (Math.floor(frecuenciaAnual / intervalMonths) * intervalMonths + i) % 12;
        distribution[months[monthIndex]] += horasPorInstancia;
      }
    }
  }
  
  /**
   * Distribuye horas en meses preferidos
   */
  private static distributeHoursInMonths(
    distribution: { [month: string]: number },
    horasPorInstancia: number,
    frecuenciaAnual: number,
    mesesPreferidos: string[]
  ) {
    // Calcular cuántas instancias por mes preferido
    const instancesPerPreferredMonth = Math.floor(frecuenciaAnual / mesesPreferidos.length);
    const remainingInstances = frecuenciaAnual % mesesPreferidos.length;
    
    // Distribuir en meses preferidos
    mesesPreferidos.forEach((month, index) => {
      let instances = instancesPerPreferredMonth;
      if (index < remainingInstances) instances += 1;
      distribution[month] += instances * horasPorInstancia;
    });
    
    // Si necesitamos más meses, usar los restantes
    if (frecuenciaAnual > mesesPreferidos.length) {
      const mesesRestantes = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
        .filter(m => !mesesPreferidos.includes(m));
      
      const mesesExtra = frecuenciaAnual - mesesPreferidos.length;
      for (let i = 0; i < mesesExtra && i < mesesRestantes.length; i++) {
        distribution[mesesRestantes[i]] += horasPorInstancia;
      }
    }
  }
  
  /**
   * Genera los datos para el CSV con todas las columnas especificadas
   */
  static generateCSVData(denominaciones: DenominacionHomogeneaData[]): MaintenanceCSVRow[] {
    console.log('🔄 Generando datos CSV con distribución mensual completa...');
    
    return denominaciones
      .filter(d => d.frecuencia && d.frecuencia !== 'No especificada' &&
                   d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado' &&
                   d.tiempo && d.tiempo !== 'No especificado')
      .map(denominacion => {
        const horasPorMantenimiento = parseFloat(denominacion.tiempo || '2') || 2;
        const horasTotales = denominacion.cantidad * horasPorMantenimiento;
        
        const monthlyDistribution = this.getSeasonalDistribution(
          denominacion.denominacion,
          denominacion.tipoMantenimiento,
          denominacion.frecuencia,
          horasTotales
        );
        
        return {
          equipo: denominacion.denominacion,
          numeroEquipo: denominacion.cantidad,
          tipoMantenimiento: denominacion.tipoMantenimiento,
          horasPorMantenimiento,
          horasTotales,
          ene: Math.round(monthlyDistribution.ene || 0),
          feb: Math.round(monthlyDistribution.feb || 0),
          mar: Math.round(monthlyDistribution.mar || 0),
          abr: Math.round(monthlyDistribution.abr || 0),
          may: Math.round(monthlyDistribution.may || 0),
          jun: Math.round(monthlyDistribution.jun || 0),
          jul: Math.round(monthlyDistribution.jul || 0),
          ago: Math.round(monthlyDistribution.ago || 0),
          sep: Math.round(monthlyDistribution.sep || 0),
          oct: Math.round(monthlyDistribution.oct || 0),
          nov: Math.round(monthlyDistribution.nov || 0),
          dic: Math.round(monthlyDistribution.dic || 0)
        };
      });
  }
  
  /**
   * Convierte datos a CSV y descarga el archivo con las columnas especificadas
   */
  static exportToCSV(denominaciones: DenominacionHomogeneaData[], filename: string = 'plan-mantenimiento-anual.csv') {
    const csvData = this.generateCSVData(denominaciones);
    
    if (csvData.length === 0) {
      console.warn('⚠️ No hay datos completos para exportar');
      return;
    }
    
    // Crear cabeceras del CSV según las especificaciones
    const headers = [
      'EQUIPO (DENOMINACIÓN)',
      'Nº EQUIPO', 
      'TIPO DE MANTENIMIENTO',
      'HORAS POR MANTENIMIENTO (H)',
      'HORAS TOTALES',
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];
    
    // Convertir datos a filas CSV
    const csvRows = [
      headers.join(','),
      ...csvData.map(row => [
        `"${row.equipo}"`,
        row.numeroEquipo,
        `"${row.tipoMantenimiento}"`,
        row.horasPorMantenimiento,
        row.horasTotales,
        row.ene, row.feb, row.mar, row.abr, row.may, row.jun,
        row.jul, row.ago, row.sep, row.oct, row.nov, row.dic
      ].join(','))
    ];
    
    // Crear y descargar archivo
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    console.log('✅ CSV exportado:', filename, 'con', csvData.length, 'equipos');
    
    // Mostrar resumen detallado
    const totalHoras = csvData.reduce((sum, row) => sum + row.horasTotales, 0);
    const resumenMensual = csvData.reduce((acc, row) => {
      acc.ene += row.ene; acc.feb += row.feb; acc.mar += row.mar;
      acc.abr += row.abr; acc.may += row.may; acc.jun += row.jun;
      acc.jul += row.jul; acc.ago += row.ago; acc.sep += row.sep;
      acc.oct += row.oct; acc.nov += row.nov; acc.dic += row.dic;
      return acc;
    }, { ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 });
    
    console.log('📊 Resumen del plan anual mejorado:', {
      totalHoras,
      distribMensual: resumenMensual,
      equiposTotales: csvData.reduce((sum, row) => sum + row.numeroEquipo, 0),
      tiposMantenimiento: new Set(csvData.map(row => row.tipoMantenimiento)).size
    });
    
    // Mostrar distribución mensual en consola
    console.log('📅 Distribución mensual de horas:');
    Object.entries(resumenMensual).forEach(([mes, horas]) => {
      console.log(`   ${mes.toUpperCase()}: ${horas} horas`);
    });
    
    return { csvData, totalHoras, resumenMensual };
  }
}
