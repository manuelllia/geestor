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
   * Determina la distribución mensual EQUILIBRADA considerando factores estacionales
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
    
    // NUEVA LÓGICA: Distribución equilibrada con preferencias estacionales suaves
    if (frecuenciaAnual >= 12) {
      // Mensual o mayor frecuencia - distribución casi uniforme con ligeras variaciones estacionales
      const baseHoursPerMonth = totalHours / 12;
      
      if (denominacionLower.includes('frigorífico') || 
          denominacionLower.includes('refrigerador') || 
          denominacionLower.includes('congelador') ||
          denominacionLower.includes('aire acondicionado') ||
          denominacionLower.includes('climatizador')) {
        
        // Equipos de frío - ligero énfasis en preparación para temporadas críticas
        months.forEach((month, index) => {
          let multiplier = 1.0;
          if (['abr', 'may', 'oct', 'nov'].includes(month)) multiplier = 1.15; // Preparación
          else if (['jul', 'ago', 'ene', 'feb'].includes(month)) multiplier = 0.9; // Temporada crítica, menos mantenimiento
          distribution[month] = Math.round(baseHoursPerMonth * multiplier);
        });
        
      } else if (denominacionLower.includes('quirófano') ||
                 denominacionLower.includes('cirugía') ||
                 denominacionLower.includes('quirúrgico') ||
                 denominacionLower.includes('mesa de operaciones')) {
        
        // Quirófanos - ligero énfasis en períodos de menor actividad
        months.forEach((month, index) => {
          let multiplier = 1.0;
          if (['jul', 'ago', 'dic'].includes(month)) multiplier = 1.2; // Períodos tradicionalmente más tranquilos
          else if (['ene', 'sep'].includes(month)) multiplier = 0.85; // Inicio de año y curso, más actividad
          distribution[month] = Math.round(baseHoursPerMonth * multiplier);
        });
        
      } else {
        // Otros equipos - distribución completamente uniforme
        months.forEach(month => {
          distribution[month] = Math.round(baseHoursPerMonth);
        });
      }
      
    } else {
      // Frecuencia menor a mensual - distribución equilibrada con preferencias estacionales
      this.distributeHoursEquitably(distribution, horasPorInstancia, frecuenciaAnual, months, denominacionLower);
    }
    
    // VERIFICACIÓN Y AJUSTE FINAL para garantizar equilibrio
    const totalDistributed = Object.values(distribution).reduce((sum, hours) => sum + hours, 0);
    const difference = totalHours - totalDistributed;
    
    if (Math.abs(difference) > 0.1) {
      // Ajustar la diferencia distribuyéndola equitativamente
      const adjustment = difference / 12;
      months.forEach(month => {
        distribution[month] = Math.round(distribution[month] + adjustment);
      });
    }
    
    // Verificación final: asegurar que ningún mes esté vacío si hay horas totales
    if (totalHours > 0) {
      const monthsWithZeroHours = months.filter(month => distribution[month] === 0);
      const monthsWithHours = months.filter(month => distribution[month] > 0);
      
      if (monthsWithZeroHours.length > 0 && monthsWithHours.length > 0) {
        // Redistribuir para que todos los meses tengan al menos algo
        const minHoursPerMonth = Math.max(1, Math.floor(totalHours / 24)); // Al menos 1 hora o totalHours/24
        
        monthsWithZeroHours.forEach(month => {
          distribution[month] = minHoursPerMonth;
        });
        
        // Reajustar el total
        const newTotal = Object.values(distribution).reduce((sum, hours) => sum + hours, 0);
        const excessHours = newTotal - totalHours;
        
        if (excessHours > 0) {
          // Quitar el exceso de los meses con más horas
          const sortedMonths = months.sort((a, b) => distribution[b] - distribution[a]);
          let remaining = excessHours;
          
          for (const month of sortedMonths) {
            if (remaining <= 0) break;
            const canReduce = Math.min(remaining, distribution[month] - minHoursPerMonth);
            distribution[month] -= canReduce;
            remaining -= canReduce;
          }
        }
      }
    }
    
    return distribution;
  }
  
  /**
   * Distribuye horas de manera equitativa con ligeras preferencias estacionales
   */
  private static distributeHoursEquitably(
    distribution: { [month: string]: number },
    horasPorInstancia: number,
    frecuenciaAnual: number,
    months: string[],
    denominacionLower: string
  ) {
    // Crear un plan de distribución equilibrado
    const intervalMonths = Math.floor(12 / frecuenciaAnual);
    const remainingInstances = frecuenciaAnual % Math.floor(12 / intervalMonths);
    
    // Definir meses preferidos según el tipo de equipo
    let preferredMonths: string[] = [];
    
    if (denominacionLower.includes('frigorífico') || 
        denominacionLower.includes('refrigerador') || 
        denominacionLower.includes('congelador') ||
        denominacionLower.includes('aire acondicionado')) {
      preferredMonths = ['abr', 'may', 'jun', 'sep', 'oct', 'nov'];
    } else if (denominacionLower.includes('quirófano') ||
               denominacionLower.includes('cirugía') ||
               denominacionLower.includes('quirúrgico')) {
      preferredMonths = ['jul', 'ago', 'dic', 'jun'];
    } else {
      // Distribución completamente uniforme para otros equipos
      preferredMonths = months.slice();
    }
    
    // Distribución base equitativa
    for (let i = 0; i < frecuenciaAnual; i++) {
      let targetMonth: string;
      
      if (i < preferredMonths.length) {
        targetMonth = preferredMonths[i];
      } else {
        // Si necesitamos más instancias, usar distribución uniforme
        const monthIndex = (i * intervalMonths) % 12;
        targetMonth = months[monthIndex];
      }
      
      distribution[targetMonth] += horasPorInstancia;
    }
    
    // Si quedan instancias por distribuir, usar los meses restantes
    if (remainingInstances > 0) {
      const unusedMonths = months.filter(month => distribution[month] === 0);
      for (let i = 0; i < Math.min(remainingInstances, unusedMonths.length); i++) {
        distribution[unusedMonths[i]] += horasPorInstancia;
      }
    }
  }
  
  /**
   * Genera los datos para el CSV con distribución mensual EQUILIBRADA
   */
  static generateCSVData(denominaciones: DenominacionHomogeneaData[]): MaintenanceCSVRow[] {
    console.log('🔄 Generando datos CSV con distribución mensual EQUILIBRADA...');
    
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
        
        const result = {
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
        
        // Verificar equilibrio para logging
        const monthlyHours = [result.ene, result.feb, result.mar, result.abr, result.may, result.jun,
                             result.jul, result.ago, result.sep, result.oct, result.nov, result.dic];
        const maxHours = Math.max(...monthlyHours);
        const minHours = Math.min(...monthlyHours.filter(h => h > 0));
        const variance = maxHours - minHours;
        
        if (variance > horasTotales * 0.3) { // Si la variación es mayor al 30% del total
          console.log(`⚠️ Distribución con alta variación para ${denominacion.denominacion}:`, {
            max: maxHours,
            min: minHours,
            variance,
            distribution: monthlyHours
          });
        }
        
        return result;
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
    
    // Mostrar resumen detallado CON ANÁLISIS DE EQUILIBRIO
    const totalHoras = csvData.reduce((sum, row) => sum + row.horasTotales, 0);
    const resumenMensual = csvData.reduce((acc, row) => {
      acc.ene += row.ene; acc.feb += row.feb; acc.mar += row.mar;
      acc.abr += row.abr; acc.may += row.may; acc.jun += row.jun;
      acc.jul += row.jul; acc.ago += row.ago; acc.sep += row.sep;
      acc.oct += row.oct; acc.nov += row.nov; acc.dic += row.dic;
      return acc;
    }, { ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 });
    
    // Análisis de equilibrio
    const monthlyTotals = Object.values(resumenMensual);
    const maxMonth = Math.max(...monthlyTotals);
    const minMonth = Math.min(...monthlyTotals);
    const avgMonth = monthlyTotals.reduce((sum, val) => sum + val, 0) / 12;
    const variance = maxMonth - minMonth;
    const equilibriumRatio = ((avgMonth - variance/2) / avgMonth) * 100;
    
    console.log('📊 Resumen del plan anual EQUILIBRADO:', {
      totalHoras,
      distribMensual: resumenMensual,
      equilibrio: {
        mesMaximo: maxMonth,
        mesMinimo: minMonth,
        promedio: Math.round(avgMonth),
        variacion: variance,
        ratioEquilibrio: `${equilibriumRatio.toFixed(1)}%`
      },
      equiposTotales: csvData.reduce((sum, row) => sum + row.numeroEquipo, 0),
      tiposMantenimiento: new Set(csvData.map(row => row.tipoMantenimiento)).size
    });
    
    // Mostrar distribución mensual en consola
    console.log('📅 Distribución mensual EQUILIBRADA:');
    Object.entries(resumenMensual).forEach(([mes, horas]) => {
      const porcentaje = ((horas / totalHoras) * 100).toFixed(1);
      console.log(`   ${mes.toUpperCase()}: ${horas} horas (${porcentaje}%)`);
    });
    
    return { csvData, totalHoras, resumenMensual };
  }
}
