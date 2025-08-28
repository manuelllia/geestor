
interface MaintenanceCSVRow {
  equipo: string;
  numeroEquipo: number;
  tipoMantenimiento: string;
  frecuencia: string;
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
   * Convierte frecuencia en texto a número de veces al año
   */
  private static parseFrequencyToYearlyOccurrences(frecuencia: string): number {
    const frecuenciaLower = frecuencia.toLowerCase().trim();
    
    if (frecuenciaLower.includes('diario') || frecuenciaLower.includes('diaria')) return 365;
    if (frecuenciaLower.includes('semanal')) return 52;
    if (frecuenciaLower.includes('quincenal') || frecuenciaLower.includes('cada 15 días')) return 24;
    if (frecuenciaLower.includes('mensual')) return 12;
    if (frecuenciaLower.includes('bimensual') || frecuenciaLower.includes('cada 2 meses')) return 6;
    if (frecuenciaLower.includes('trimestral') || frecuenciaLower.includes('cada 3 meses')) return 4;
    if (frecuenciaLower.includes('cuatrimestral') || frecuenciaLower.includes('cada 4 meses')) return 3;
    if (frecuenciaLower.includes('semestral') || frecuenciaLower.includes('cada 6 meses')) return 2;
    if (frecuenciaLower.includes('anual') || frecuenciaLower.includes('cada año')) return 1;
    
    // Intentar extraer números de frecuencias específicas
    const match = frecuenciaLower.match(/cada\s+(\d+)\s+mes/);
    if (match) {
      const months = parseInt(match[1]);
      return Math.floor(12 / months);
    }
    
    return 4; // Default trimestral
  }

  /**
   * Calcula la distribución mensual basada en la frecuencia real
   */
  private static calculateMonthlyDistribution(
    frecuencia: string,
    horasPorMantenimiento: number,
    numeroEquipos: number,
    denominacion: string
  ): { [month: string]: number } {
    
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const distribution: { [month: string]: number } = {};
    
    // Inicializar todos los meses en 0
    months.forEach(month => distribution[month] = 0);
    
    const yearlyOccurrences = this.parseFrequencyToYearlyOccurrences(frecuencia);
    const horasPorOcasion = horasPorMantenimiento * numeroEquipos; // Todas las horas van en el mismo mes
    
    console.log(`📊 Calculando distribución para ${denominacion}:`, {
      frecuencia,
      yearlyOccurrences,
      horasPorMantenimiento,
      numeroEquipos,
      horasPorOcasion
    });
    
    // Determinar en qué meses se realizará el mantenimiento
    if (yearlyOccurrences >= 12) {
      // Mantenimiento mensual o más frecuente - todos los meses
      months.forEach(month => {
        distribution[month] = horasPorOcasion;
      });
    } else {
      // Mantenimiento con menor frecuencia - distribuir estratégicamente
      const intervalMonths = Math.floor(12 / yearlyOccurrences);
      
      // Determinar meses preferidos según el tipo de equipo
      const denominacionLower = denominacion.toLowerCase();
      let preferredStartMonth = 0;
      
      if (denominacionLower.includes('frigorífico') || 
          denominacionLower.includes('refrigerador') || 
          denominacionLower.includes('aire acondicionado')) {
        preferredStartMonth = 3; // Empezar en abril (índice 3)
      } else if (denominacionLower.includes('quirófano') ||
                 denominacionLower.includes('cirugía')) {
        preferredStartMonth = 6; // Empezar en julio (índice 6)
      }
      
      // Distribuir las ocurrencias a lo largo del año
      for (let occurrence = 0; occurrence < yearlyOccurrences; occurrence++) {
        const monthIndex = (preferredStartMonth + (occurrence * intervalMonths)) % 12;
        const monthName = months[monthIndex];
        distribution[monthName] = horasPorOcasion;
      }
    }
    
    console.log(`✅ Distribución calculada para ${denominacion}:`, distribution);
    return distribution;
  }
  
  /**
   * Genera los datos para el CSV con distribución mensual REAL
   */
  static generateCSVData(denominaciones: DenominacionHomogeneaData[]): MaintenanceCSVRow[] {
    console.log('🔄 Generando datos CSV con distribución mensual REAL...');
    
    return denominaciones
      .filter(d => d.frecuencia && d.frecuencia !== 'No especificada' &&
                   d.tipoMantenimiento && d.tipoMantenimiento !== 'No especificado' &&
                   d.tiempo && d.tiempo !== 'No especificado')
      .map(denominacion => {
        const horasPorMantenimiento = parseFloat(denominacion.tiempo || '2') || 2;
        const horasTotales = denominacion.cantidad * horasPorMantenimiento;
        
        const monthlyDistribution = this.calculateMonthlyDistribution(
          denominacion.frecuencia,
          horasPorMantenimiento,
          denominacion.cantidad,
          denominacion.denominacion
        );
        
        return {
          equipo: denominacion.denominacion,
          numeroEquipo: denominacion.cantidad,
          tipoMantenimiento: denominacion.tipoMantenimiento,
          frecuencia: denominacion.frecuencia,
          horasPorMantenimiento,
          horasTotales,
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
   * Convierte datos a CSV y descarga el archivo con la columna de frecuencia
   */
  static exportToCSV(denominaciones: DenominacionHomogeneaData[], filename: string = 'plan-mantenimiento-anual.csv') {
    const csvData = this.generateCSVData(denominaciones);
    
    if (csvData.length === 0) {
      console.warn('⚠️ No hay datos completos para exportar');
      return;
    }
    
    // Crear cabeceras del CSV incluyendo frecuencia
    const headers = [
      'EQUIPO (DENOMINACIÓN)',
      'Nº EQUIPO', 
      'TIPO DE MANTENIMIENTO',
      'FRECUENCIA',
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
        `"${row.frecuencia}"`,
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
    
    // Cálculo de totales anuales y verificación de capacidad
    const totalHorasAnuales = csvData.reduce((sum, row) => {
      const horasAnuales = row.ene + row.feb + row.mar + row.abr + row.may + row.jun +
                          row.jul + row.ago + row.sep + row.oct + row.nov + row.dic;
      return sum + horasAnuales;
    }, 0);
    
    // Calcular técnicos necesarios (considerando 7 horas/día, 5 días/semana, 50 semanas/año)
    const horasAnualesPorTecnico = 7 * 5 * 50; // 1750 horas/año/técnico
    const tecnicosNecesarios = Math.ceil(totalHorasAnuales / horasAnualesPorTecnico);
    
    console.log('📊 Análisis de capacidad:', {
      totalHorasAnuales,
      horasAnualesPorTecnico,
      tecnicosNecesarios,
      csvData: csvData.length
    });
    
    return { 
      csvData, 
      totalHorasAnuales, 
      tecnicosNecesarios,
      capacidadActual: horasAnualesPorTecnico
    };
  }
}
