
interface MaintenanceCSVRow {
  nombreEquipo: string;
  numeroEquipos: number;
  tipoMantenimiento: string;
  horasPorMantenimiento: number;
  totalHoras: number;
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

interface DenominacionData {
  codigo: string;
  denominacion: string;
  cantidad: number;
  frecuencia: string;
  tipoMantenimiento: string;
  tiempo: string;
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
    if (frecuenciaLower.includes('mensual')) frecuenciaAnual = 12;
    else if (frecuenciaLower.includes('bimensual')) frecuenciaAnual = 6;
    else if (frecuenciaLower.includes('trimestral')) frecuenciaAnual = 4;
    else if (frecuenciaLower.includes('cuatrimestral')) frecuenciaAnual = 3;
    else if (frecuenciaLower.includes('semestral')) frecuenciaAnual = 2;
    else if (frecuenciaLower.includes('anual')) frecuenciaAnual = 1;
    
    const horasPorMes = totalHours / frecuenciaAnual;
    
    // Lógica estacional para equipos específicos
    if (denominacionLower.includes('frigorífico') || 
        denominacionLower.includes('refrigerador') || 
        denominacionLower.includes('congelador') ||
        denominacionLower.includes('aire acondicionado') ||
        denominacionLower.includes('climatizador')) {
      
      // Mantenimiento de equipos de frío antes del verano
      if (frecuenciaAnual === 1) {
        distribution['may'] = totalHours; // Una vez al año en mayo
      } else if (frecuenciaAnual === 2) {
        distribution['may'] = horasPorMes;
        distribution['nov'] = horasPorMes; // Semestral: mayo y noviembre
      } else {
        // Mensual/trimestral con énfasis pre-verano
        const mesesPreferidos = ['abr', 'may', 'jun', 'sep', 'oct', 'nov'];
        this.distributeHoursInMonths(distribution, horasPorMes, frecuenciaAnual, mesesPreferidos);
      }
      
    } else if (denominacionLower.includes('quirófano') ||
               denominacionLower.includes('cirugía') ||
               denominacionLower.includes('quirúrgico') ||
               denominacionLower.includes('mesa de operaciones')) {
      
      // Mantenimiento de quirófanos en verano
      if (frecuenciaAnual === 1) {
        distribution['jul'] = totalHours; // Una vez al año en julio
      } else if (frecuenciaAnual === 2) {
        distribution['jul'] = horasPorMes;
        distribution['dic'] = horasPorMes; // Semestral: julio y diciembre
      } else {
        // Mensual/trimestral con énfasis en verano
        const mesesPreferidos = ['jun', 'jul', 'ago', 'dic'];
        this.distributeHoursInMonths(distribution, horasPorMes, frecuenciaAnual, mesesPreferidos);
      }
      
    } else {
      // Distribución uniforme para otros equipos
      this.distributeHoursUniformly(distribution, horasPorMes, frecuenciaAnual, months);
    }
    
    return distribution;
  }
  
  /**
   * Distribuye horas uniformemente a lo largo del año
   */
  private static distributeHoursUniformly(
    distribution: { [month: string]: number },
    horasPorMes: number,
    frecuenciaAnual: number,
    months: string[]
  ) {
    if (frecuenciaAnual >= 12) {
      // Mensual - cada mes
      months.forEach(month => distribution[month] = horasPorMes);
    } else {
      // Distribuir equitativamente
      const intervalMonths = Math.floor(12 / frecuenciaAnual);
      for (let i = 0; i < frecuenciaAnual; i++) {
        const monthIndex = (i * intervalMonths) % 12;
        distribution[months[monthIndex]] = horasPorMes;
      }
    }
  }
  
  /**
   * Distribuye horas en meses preferidos
   */
  private static distributeHoursInMonths(
    distribution: { [month: string]: number },
    horasPorMes: number,
    frecuenciaAnual: number,
    mesesPreferidos: string[]
  ) {
    const mesesAUsar = Math.min(frecuenciaAnual, mesesPreferidos.length);
    for (let i = 0; i < mesesAUsar; i++) {
      distribution[mesesPreferidos[i]] = horasPorMes;
    }
    
    // Si necesitamos más meses, distribuir en el resto
    if (frecuenciaAnual > mesesPreferidos.length) {
      const mesesRestantes = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
        .filter(m => !mesesPreferidos.includes(m));
      
      const mesesExtra = frecuenciaAnual - mesesPreferidos.length;
      for (let i = 0; i < mesesExtra && i < mesesRestantes.length; i++) {
        distribution[mesesRestantes[i]] = horasPorMes;
      }
    }
  }
  
  /**
   * Genera los datos para el CSV
   */
  static generateCSVData(denominaciones: DenominacionData[]): MaintenanceCSVRow[] {
    console.log('🔄 Generando datos CSV optimizados...');
    
    return denominaciones
      .filter(d => d.frecuencia && d.frecuencia !== 'No especificada' &&
                   d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado' &&
                   d.tiempo && d.tiempo !== 'No especificado')
      .map(denominacion => {
        const horasPorMantenimiento = parseFloat(denominacion.tiempo) || 2;
        const totalHoras = denominacion.cantidad * horasPorMantenimiento;
        
        const monthlyDistribution = this.getSeasonalDistribution(
          denominacion.denominacion,
          denominacion.tipoMantenimiento,
          denominacion.frecuencia,
          totalHoras
        );
        
        return {
          nombreEquipo: denominacion.denominacion,
          numeroEquipos: denominacion.cantidad,
          tipoMantenimiento: denominacion.tipoMantenimiento,
          horasPorMantenimiento,
          totalHoras,
          ene: monthlyDistribution.ene || 0,
          feb: monthlyDistribution.feb || 0,
          mar: monthlyDistribution.mar || 0,
          abr: monthlyDistribution.abr || 0,
          may: monthlyDistribution.may || 0,
          jun: monthlyDistribution.jun || 0,
          jul: monthlyDistribution.jul || 0,
          ago: monthlyDistribution.ago || 0,
          sep: monthlyDistribution.sep || 0,
          oct: monthlyDistribution.oct || 0,
          nov: monthlyDistribution.nov || 0,
          dic: monthlyDistribution.dic || 0
        };
      });
  }
  
  /**
   * Convierte datos a CSV y descarga el archivo
   */
  static exportToCSV(denominaciones: DenominacionData[], filename: string = 'plan-mantenimiento-anual.csv') {
    const csvData = this.generateCSVData(denominaciones);
    
    if (csvData.length === 0) {
      console.warn('⚠️ No hay datos completos para exportar');
      return;
    }
    
    // Crear cabeceras del CSV
    const headers = [
      'NOMBRE EQUIPO',
      'Nº DE EQUIPOS', 
      'TIPO DE MANTENIMIENTO',
      'HORAS POR MANTENIMIENTO',
      'TOTAL HORAS',
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];
    
    // Convertir datos a filas CSV
    const csvRows = [
      headers.join(','),
      ...csvData.map(row => [
        `"${row.nombreEquipo}"`,
        row.numeroEquipos,
        `"${row.tipoMantenimiento}"`,
        row.horasPorMantenimiento,
        row.totalHoras,
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
    
    // Mostrar resumen
    const totalHoras = csvData.reduce((sum, row) => sum + row.totalHoras, 0);
    const resumenMensual = csvData.reduce((acc, row) => {
      acc.ene += row.ene; acc.feb += row.feb; acc.mar += row.mar;
      acc.abr += row.abr; acc.may += row.may; acc.jun += row.jun;
      acc.jul += row.jul; acc.ago += row.ago; acc.sep += row.sep;
      acc.oct += row.oct; acc.nov += row.nov; acc.dic += row.dic;
      return acc;
    }, { ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 });
    
    console.log('📊 Resumen del plan anual:', {
      totalHoras,
      distribMensual: resumenMensual,
      equiposTotales: csvData.reduce((sum, row) => sum + row.numeroEquipos, 0)
    });
    
    return { csvData, totalHoras, resumenMensual };
  }
}
