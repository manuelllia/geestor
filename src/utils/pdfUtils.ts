
import * as pdfjsLib from 'pdfjs-dist';

// Configurar PDF.js para funcionar sin worker externo
let pdfWorkerInitialized = false;

export const initializePDFWorker = () => {
  if (!pdfWorkerInitialized) {
    try {
      // Intentar usar el worker del paquete local
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
      ).toString();
      
      console.log('📄 PDF.js worker configurado desde paquete local');
      pdfWorkerInitialized = true;
    } catch (error) {
      console.warn('⚠️ No se pudo configurar worker local, usando modo compatible');
      // Fallback: desactivar worker completamente
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      pdfWorkerInitialized = true;
    }
  }
};

export const extractPDFText = async (file: File): Promise<string> => {
  // Asegurar que el worker está inicializado
  initializePDFWorker();
  
  try {
    console.log(`📄 Procesando PDF: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Configuración optimizada para evitar problemas de CORS
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      verbosity: 0, // Reducir logs internos
      cMapUrl: undefined, // Evitar cargar recursos externos
      standardFontDataUrl: undefined
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
              return {
                pageNum,
                text: textContent.items
                  .map((item: any) => item.str)
                  .join(' ')
              };
            } catch (error) {
              console.warn(`⚠️ Error en página ${pageNum}:`, error);
              return { pageNum, text: '' };
            }
          })
        );
      }
      
      const pageResults = await Promise.all(pagePromises);
      pageResults
        .sort((a, b) => a.pageNum - b.pageNum)
        .forEach(result => {
          fullText += result.text + '\n';
        });
      
      console.log(`📄 Procesadas páginas ${i + 1}-${endPage} de ${numPages}`);
    }
    
    const textLength = fullText.trim().length;
    console.log(`✅ Extracción completada: ${textLength} caracteres de ${file.name}`);
    
    if (textLength === 0) {
      throw new Error('No se pudo extraer texto del PDF. El archivo puede estar protegido o ser una imagen.');
    }
    
    return fullText.trim();
    
  } catch (error) {
    console.error(`❌ Error procesando PDF ${file.name}:`, error);
    throw new Error(`Error al procesar ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};
