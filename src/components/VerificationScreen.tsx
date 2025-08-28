
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../utils/translations';

interface VerificationScreenProps {
  language: Language;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ language }) => {
  const { t } = useTranslation(language);

  return (
    <>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05); }
          50% { transform: scale(1.03); box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.08); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-arc {
          0% { transform: rotate(0deg); border-left-color: transparent; border-right-color: transparent; }
          25% { transform: rotate(90deg); border-left-color: transparent; border-right-color: transparent; }
          50% { transform: rotate(180deg); border-left-color: #3b82f6; border-right-color: #3b82f6; }
          75% { transform: rotate(270deg); border-left-color: transparent; border-right-color: transparent; }
          100% { transform: rotate(360deg); border-left-color: transparent; border-right-color: transparent; }
        }

        @keyframes progress-shine {
          0% { transform: translateX(-100%) skewX(-30deg); }
          100% { transform: translateX(100%) skewX(-30deg); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-delay-200ms { animation-delay: 200ms; }
        .animate-delay-400ms { animation-delay: 400ms; }
        .animate-delay-600ms { animation-delay: 600ms; }
        .animate-delay-800ms { animation-delay: 800ms; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-progress-shine { animation: progress-shine 2s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
        .animate-spin-fast { animation: spin-fast 1s linear infinite; }
        .animate-spin-arc { animation: spin-arc 1.5s linear infinite; }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden
                    bg-gradient-to-br from-slate-50 via-blue-50 to-white 
                    dark:from-slate-900 dark:via-slate-800 dark:to-black
                    font-sans text-slate-900 dark:text-slate-100">
      
        <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10"
             style={{
               backgroundImage: 'radial-gradient(#1e40af33 1px, transparent 1px), radial-gradient(#1e40af33 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 20px 20px',
             }}
        />

        <Card className="relative z-10 w-full max-w-md p-6 rounded-2xl 
                         shadow-2xl border border-blue-200/50 dark:border-slate-600/50 
                         bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg backdrop-saturate-150
                         transform transition-all duration-500 ease-out 
                         hover:scale-[1.01] hover:shadow-3xl">

          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto mb-6 w-24 h-24 rounded-full 
                            bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20
                            flex items-center justify-center 
                            shadow-lg dark:shadow-xl dark:shadow-blue-500/10
                            animate-pulse-slow border border-blue-200 dark:border-blue-700">
              <img 
                src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
                alt="GEESTOR Logo" 
                className="w-14 h-14 object-contain animate-bounce-subtle"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 
                           animate-fade-in-up animate-delay-200ms">
              GEESTOR V.2.0
            </h1>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium animate-fade-in-up animate-delay-300ms">
              Sistema de Gestión Empresarial
            </p>
          </CardHeader>
          <CardContent className="text-center pb-12">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-blue-200 border-slate-200 dark:border-slate-600 animate-spin-fast" />
                <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-blue-600 border-transparent animate-spin-arc" />
              </div>
              
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-100 
                               animate-fade-in-up animate-delay-400ms">
                {t('verifyingAccount')}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1
                            animate-fade-in-up animate-delay-600ms max-w-xs">
                Verificando credenciales y cargando permisos de usuario. Este proceso es seguro y automático.
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                              animate-progress-shine" style={{ width: '100%' }}></div>
            </div>
            
            <div className="space-y-2 animate-fade-in-up animate-delay-800ms">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Autenticación segura con Firebase
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                <span>Conexión segura establecida</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VerificationScreen;
