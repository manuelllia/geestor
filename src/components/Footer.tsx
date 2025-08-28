
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 dark:bg-blue-950 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/f7fd6e9d-43a7-47ba-815e-fdaa1b630f6b.png" 
              alt="GEESTOR Logo" 
              className="h-8 w-auto object-contain"
            />
            <span className="text-sm font-medium">GEESTOR</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-blue-200">
              © {currentYear} Grupo Empresarial Electromédico (GEE). Todos los derechos reservados.
            </p>
            <p className="text-xs text-blue-300 mt-1">
              Sistema de Gestión Empresarial - GEESTOR v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
