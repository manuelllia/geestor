
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useExportToPDF = () => {
  const exportDashboardToPDF = useCallback(async () => {
    try {
      // Buscar el contenedor del dashboard
      const dashboardElement = document.querySelector('[data-dashboard="real-estate"]');
      
      if (!dashboardElement) {
        console.error('No se encontró el elemento del dashboard');
        return;
      }

      // Configurar opciones para html2canvas
      const canvas = await html2canvas(dashboardElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: dashboardElement.scrollWidth,
        height: dashboardElement.scrollHeight,
      });

      // Crear PDF
      const pdf = new jsPDF('l', 'mm', 'a4'); // Formato horizontal
      const imgWidth = 297; // Ancho A4 horizontal en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Si la imagen es más alta que A4, ajustar
      const maxHeight = 210; // Alto A4 horizontal en mm
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;

      if (imgHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      // Agregar la imagen al PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        (297 - finalWidth) / 2, // Centrar horizontalmente
        (210 - finalHeight) / 2, // Centrar verticalmente
        finalWidth,
        finalHeight
      );

      // Agregar fecha y título
      pdf.setFontSize(12);
      pdf.text(`Dashboard Pisos - ${new Date().toLocaleDateString('es-ES')}`, 15, 15);

      // Descargar el PDF
      pdf.save('Dashboard Pisos.pdf');
      
      console.log('Dashboard exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar dashboard:', error);
    }
  }, []);

  return { exportDashboardToPDF };
};
