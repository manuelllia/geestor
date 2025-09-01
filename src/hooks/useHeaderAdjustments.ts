
import { useEffect } from 'react';

export const useHeaderAdjustments = () => {
  useEffect(() => {
    // Función para ocultar el título GEESTOR V.2.0 y ajustar la alineación
    const adjustHeader = () => {
      // Buscar el elemento que contiene "GEESTOR V.2.0"
      const titleElements = document.querySelectorAll('h1, h2, h3, .title, [data-title]');
      
      titleElements.forEach((element) => {
        const textContent = element.textContent || '';
        if (textContent.includes('GEESTOR V.2.0') || textContent.includes('GEESTOR')) {
          // Ocultar el elemento
          (element as HTMLElement).style.display = 'none';
        }
      });

      // Ajustar la alineación del header con el menú lateral
      const header = document.querySelector('header');
      const sidebar = document.querySelector('[data-sidebar]');
      
      if (header && sidebar) {
        // Asegurar que estén a la misma altura
        header.style.position = 'relative';
        header.style.zIndex = '50';
        
        // Si hay un contenedor del sidebar, ajustar el header para que coincida
        const sidebarContainer = document.querySelector('.sidebar-container');
        if (sidebarContainer) {
          const sidebarWidth = sidebarContainer.getBoundingClientRect().width;
          header.style.paddingLeft = `${sidebarWidth}px`;
        }
      }

      // Buscar cualquier texto que contenga "GEESTOR V.2.0" y ocultarlo
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodesToHide: Node[] = [];
      let node;

      while (node = walker.nextNode()) {
        if (node.textContent && node.textContent.includes('GEESTOR V.2.0')) {
          textNodesToHide.push(node);
        }
      }

      textNodesToHide.forEach(textNode => {
        if (textNode.parentElement) {
          textNode.parentElement.style.display = 'none';
        }
      });
    };

    // Ejecutar inmediatamente
    adjustHeader();

    // Crear un observer para cambios en el DOM
    const observer = new MutationObserver(adjustHeader);
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Ejecutar también en intervalos para asegurar que se aplique
    const interval = setInterval(adjustHeader, 1000);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
};
