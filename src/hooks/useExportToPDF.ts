
import { useCallback } from 'react';
import jsPDF from 'jspdf';

interface DashboardData {
  propertyCounts: {
    active: number;
    inactive: number;
    total: number;
    totalRooms: number;
  };
  annualCostData: {
    totalCost: number;
    byProvince: { [province: string]: number };
  };
  provinceActivity: {
    [province: string]: {
      count: number;
      percentage: number;
    };
  };
}

export const useExportToPDF = () => {
  const exportDashboardToPDF = useCallback(async (data: DashboardData) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPosition = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Función auxiliar para añadir nueva página si es necesario
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > 280) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      // Título principal
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dashboard Pisos - Gestión de Inmuebles', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Fecha
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Métricas principales
      checkNewPage(60);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Métricas Principales', margin, yPosition);
      yPosition += 15;

      const metrics = [
        { label: 'Pisos Activos', value: data.propertyCounts.active.toLocaleString(), color: [34, 197, 94] },
        { label: 'Pisos de Baja', value: data.propertyCounts.inactive.toLocaleString(), color: [239, 68, 68] },
        { label: 'Total Propiedades', value: data.propertyCounts.total.toLocaleString(), color: [59, 130, 246] },
        { label: 'Total Habitaciones', value: data.propertyCounts.totalRooms.toLocaleString(), color: [147, 51, 234] }
      ];

      metrics.forEach((metric, index) => {
        const xPos = margin + (index % 2) * (contentWidth / 2);
        const yPos = yPosition + Math.floor(index / 2) * 25;

        pdf.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
        pdf.rect(xPos, yPos - 5, contentWidth / 2 - 10, 20, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(metric.label, xPos + 5, yPos + 3);
        pdf.setFontSize(16);
        pdf.text(metric.value, xPos + 5, yPos + 12);
      });

      yPosition += 60;

      // Costes Anuales - Total
      checkNewPage(50);
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Costes Anuales', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Coste Total Anual: €${data.annualCostData.totalCost.toLocaleString()}`, margin, yPosition);
      yPosition += 20;

      // Costes por Provincia
      if (Object.keys(data.annualCostData.byProvince).length > 0) {
        checkNewPage(20 + Object.keys(data.annualCostData.byProvince).length * 8);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Desglose por Provincias:', margin, yPosition);
        yPosition += 12;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        // Ordenar provincias por coste
        const sortedProvinces = Object.entries(data.annualCostData.byProvince)
          .sort(([,a], [,b]) => b - a);

        sortedProvinces.forEach(([province, cost]) => {
          const percentage = ((cost / data.annualCostData.totalCost) * 100).toFixed(1);
          pdf.text(`• ${province}: €${cost.toLocaleString()} (${percentage}%)`, margin + 5, yPosition);
          yPosition += 6;
        });

        yPosition += 10;
      }

      // Mapa de Actividad por Provincias
      if (Object.keys(data.provinceActivity).length > 0) {
        checkNewPage(20 + Object.keys(data.provinceActivity).length * 8);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Distribución de Propiedades por Provincia', margin, yPosition);
        yPosition += 15;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total de provincias activas: ${Object.keys(data.provinceActivity).length}`, margin, yPosition);
        yPosition += 12;

        // Ordenar provincias por número de propiedades
        const sortedActivity = Object.entries(data.provinceActivity)
          .sort(([,a], [,b]) => b.count - a.count);

        sortedActivity.forEach(([province, data]) => {
          checkNewPage(8);
          pdf.text(
            `• ${province}: ${data.count} propiedades (${data.percentage.toFixed(1)}%)`,
            margin + 5,
            yPosition
          );
          yPosition += 6;
        });
      }

      // Pie de página
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Página ${i} de ${totalPages} - Generado por Gestión de Inmuebles GEE`,
          pageWidth / 2,
          285,
          { align: 'center' }
        );
      }

      // Descargar el PDF
      pdf.save('Dashboard Pisos.pdf');
      
      console.log('Dashboard exportado exitosamente como PDF estructurado');
    } catch (error) {
      console.error('Error al exportar dashboard:', error);
    }
  }, []);

  return { exportDashboardToPDF };
};
