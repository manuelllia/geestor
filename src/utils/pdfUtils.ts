// src/utils/pdf-utils.ts
import * as pdfjsLib from 'pdfjs-dist';

// Importa el worker de pdfjs-dist directamente desde node_modules
// Esto requiere que tu bundler (Vite) lo maneje correctamente.
// Normalmente, Vite debería ser capaz de resolver esto y servirlo.
// Si esto da problemas, la opción del CDN con una versión fija es el siguiente paso.
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'; // Usa 'url' para que Vite copie el archivo y te dé la URL

let pdfWorkerInitialized = false;

export const initializePDFWorker = () => {
  if (!pdfWorkerInitialized) {
    try {
      // Usar el worker importado directamente
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      console.log('📄 PDF.js worker configurado desde el paquete local');
      pdfWorkerInitialized = true;
    } catch (error) {
      console.warn('⚠️ No se pudo configurar worker de pdfjs-dist local, intentando CDN de fallback:', error);
      // Fallback a un CDN con una versión específica y estable
      // Es crucial que esta versión exista y sea compatible con tu 'pdfjs-dist' instalado.
      // Revisa package.json qué versión de 'pdfjs-dist' tienes.
      // Si en tu package.json tienes "pdfjs-dist": "^4.0.379", usa esa versión.
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
      console.log('📄 PDF.js worker configurado desde CDN público (fallback)');
      pdfWorkerInitialized = true;
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
    // Asegúrate de que estas opciones son compatibles con la versión de pdfjs-dist que tienes.
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      // useWorkerFetch: false, // Puedes intentar quitar esto si tienes problemas, a veces es necesario
      // isEvalSupported: false, // Puede causar problemas con algunos PDFs, considera quitar
      // useSystemFonts: true, // A menudo útil para mejor renderizado
      // verbosity: 0, // Reducir logs internos
      // cMapUrl: undefined, // Si tienes problemas con caracteres especiales, podrías necesitar un cMap.
      // standardFontDataUrl: undefined // Similar a cMapUrl
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