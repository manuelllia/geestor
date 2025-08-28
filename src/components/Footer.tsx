
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 dark:bg-blue-950 text-white py-4 mt-auto flex-shrink-0">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
              alt="GEESTOR Logo" 
              className="h-6 w-auto object-contain flex-shrink-0"
            />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">GEESTOR</span>
          </div>
          
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="text-xs text-blue-200 whitespace-nowrap">
              © {currentYear} Grupo Empresarial Electromédico (GEE). Todos los derechos reservados.
            </p>
            <p className="text-xs text-blue-300 mt-1 whitespace-nowrap">
              Sistema de Gestión Empresarial - GEESTOR v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
