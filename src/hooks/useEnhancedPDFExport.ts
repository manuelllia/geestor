
import { jsPDF } from 'jspdf';

interface PDFExportOptions {
  title: string;
  data: Record<string, any>;
  sections?: {
    title: string;
    fields: Array<{
      label: string;
      value: any;
      type?: 'text' | 'date' | 'boolean' | 'number' | 'array';
    }>;
  }[];
}

export const useEnhancedPDFExport = () => {
  const exportToPDF = (options: PDFExportOptions) => {
    const { title, data, sections } = options;
    const doc = new jsPDF();
    
    // Configuración de fuentes y colores
    const primaryColor = [41, 98, 168]; // Azul corporativo
    const secondaryColor = [107, 114, 128]; // Gris
    const backgroundColor = [249, 250, 251]; // Gris claro
    
    let yPosition = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header con logo y título
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, 25);
    
    // Subtítulo con fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('es-ES');
    doc.text(`Generado el: ${currentDate}`, margin, 35);
    
    yPosition = 60;
    
    // Procesar secciones
    if (sections && sections.length > 0) {
      sections.forEach((section, sectionIndex) => {
        // Verificar espacio para nueva sección
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Título de sección
        doc.setFillColor(...backgroundColor);
        doc.rect(margin, yPosition - 5, contentWidth, 15, 'F');
        
        doc.setTextColor(...primaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin + 5, yPosition + 5);
        
        yPosition += 25;
        
        // Campos de la sección
        section.fields.forEach((field, fieldIndex) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Etiqueta del campo
          doc.setTextColor(...secondaryColor);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${field.label}:`, margin, yPosition);
          
          // Valor del campo
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          
          let displayValue = '';
          
          switch (field.type) {
            case 'boolean':
              displayValue = field.value ? 'Sí' : 'No';
              break;
            case 'date':
              displayValue = field.value instanceof Date 
                ? field.value.toLocaleDateString('es-ES')
                : field.value || 'No especificado';
              break;
            case 'array':
              displayValue = Array.isArray(field.value) 
                ? field.value.join(', ')
                : field.value || 'No especificado';
              break;
            case 'number':
              displayValue = typeof field.value === 'number' 
                ? field.value.toLocaleString('es-ES')
                : field.value || '0';
              break;
            default:
              displayValue = field.value || 'No especificado';
          }
          
          // Dividir texto largo en múltiples líneas
          const maxWidth = contentWidth - 60;
          const lines = doc.splitTextToSize(displayValue, maxWidth);
          
          doc.text(lines, margin + 50, yPosition);
          yPosition += Math.max(lines.length * 5, 12);
        });
        
        yPosition += 10; // Espacio entre secciones
      });
    } else {
      // Si no hay secciones definidas, mostrar todos los campos
      Object.entries(data).forEach(([key, value]) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${key}:`, margin, yPosition);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        const displayValue = value?.toString() || 'No especificado';
        const lines = doc.splitTextToSize(displayValue, contentWidth - 60);
        doc.text(lines, margin + 50, yPosition);
        
        yPosition += Math.max(lines.length * 5, 12);
      });
    }
    
    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...primaryColor);
      doc.rect(0, doc.internal.pageSize.height - 15, pageWidth, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Grupo Empresarial Electromédico (GEE) - GEESTOR',
        margin,
        doc.internal.pageSize.height - 7
      );
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth - margin - 30,
        doc.internal.pageSize.height - 7
      );
    }
    
    // Generar nombre del archivo
    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Descargar
    doc.save(fileName);
  };
  
  return { exportToPDF };
};
