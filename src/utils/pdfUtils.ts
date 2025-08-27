
// src/utils/pdf-utils.ts
import * as pdfjsLib from 'pdfjs-dist';

let pdfWorkerInitialized = false;

export const initializePDFWorker = () => {
  if (!pdfWorkerInitialized) {
    try {
      // Usar CDN público con versión específica y estable
      // Esta versión debe coincidir con la versión de 'pdfjs-dist' en package.json
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
      console.log('📄 PDF.js worker configurado desde CDN público');
      pdfWorkerInitialized = true;
    } catch (error) {
      console.error('❌ Error configurando worker de PDF.js:', error);
      throw new Error('No se pudo inicializar el worker de PDF.js');
    }
  }
};

export const extractPDFText = async (file: File): Promise<string> => {
  // Asegurar que el worker está inicializado SOLO UNA VEZ
  initializePDFWorker();
  
  try {
    console.log(`📄 Procesando PDF: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Configuración optimizada para evitar problemas de CORS y mejorar rendimiento
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
    });
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    console.log(`📖 Extrayendo texto de ${numPages} páginas...`);
    
    let fullText = '';
    const batchSize = 5; // Procesar en lotes para mejor rendimiento
    
    for (let i = 0; i < numPages; i += batchSize) {
      const endPage = Math.min(i + batchSize, numPages);
      const pagePromises = [];
      
      for (let pageNum = i + 1; pageNum <= endPage; pageNum++) {
        pagePromises.push(
          pdf.getPage(pageNum).then(async (page) => {
            try {
              const textContent = await page.getTextContent();
              // Unir el texto de forma más inteligente para mantener párrafos
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ')
                .replace(/\s+/g, ' ') // Normalizar múltiples espacios a uno solo
                .trim();
              
              return {
                pageNum,
                text: pageText
              };
            } catch (error) {
              console.warn(`⚠️ Error en página ${pageNum} de ${file.name}:`, error);
              return { pageNum, text: '' };
            }
          })
        );
      }
      
      const pageResults = await Promise.all(pagePromises);
      pageResults
        .sort((a, b) => a.pageNum - b.pageNum)
        .forEach(result => {
          if (result.text) {
            fullText += result.text + '\n\n'; // Añadir saltos de línea dobles entre páginas para mejor separación
          }
        });
      
      console.log(`📄 Procesadas páginas ${i + 1}-${endPage} de ${numPages}`);
    }
    
    const textLength = fullText.trim().length;
    console.log(`✅ Extracción completada para ${file.name}: ${textLength} caracteres`);
    
    if (textLength === 0) {
      throw new Error('No se pudo extraer texto del PDF. El archivo puede estar protegido, escaneado o corrupto.');
    }
    
    return fullText.trim();
    
  } catch (error) {
    console.error(`❌ Error CRÍTICO procesando PDF ${file.name}:`, error);
    throw new Error(`Error al procesar ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};
