
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
          0%, 100% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
          50% { transform: scale(1.03); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.08); }
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
          50% { transform: rotate(180deg); border-left-color: var(--primary-color); border-right-color: var(--primary-color); }
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

        :root {
          --primary-color: #6366f1;
        }
        .dark {
          --primary-color: #8b5cf6;
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
                    bg-gradient-to-br from-blue-500 to-purple-600 
                    dark:from-gray-900 dark:to-black
                    font-sans text-gray-900 dark:text-white">
      
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5"
             style={{
               backgroundImage: 'radial-gradient(#ffffff33 1px, transparent 1px), radial-gradient(#ffffff33 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 20px 20px',
             }}
        />

        <Card className="relative z-10 w-full max-w-md p-6 rounded-2xl 
                         shadow-2xl border border-white/20 dark:border-gray-700/50 
                         bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg backdrop-saturate-150
                         transform transition-all duration-500 ease-out 
                         hover:scale-[1.01] hover:shadow-3xl">

          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto mb-6 w-24 h-24 rounded-full 
                            bg-gradient-to-br from-primary/30 to-primary/10 
                            flex items-center justify-center 
                            shadow-lg dark:shadow-xl dark:shadow-primary/20
                            animate-pulse-slow">
              <img 
                src="/lovable-uploads/4a540878-1ca7-4aac-b819-248b4edd1230.png" 
                alt="GEESTOR Logo" 
                className="w-14 h-14 object-contain animate-bounce-subtle"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-white dark:text-white mb-2 
                           animate-fade-in-up animate-delay-200ms">
              GEESTOR
            </h1>
          </CardHeader>
          <CardContent className="text-center pb-12">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-primary/50 border-gray-300/20 dark:border-gray-600/20 animate-spin-fast" />
                <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-primary border-transparent animate-spin-arc" />
              </div>
              
              <span className="text-xl font-semibold text-white dark:text-white 
                               animate-fade-in-up animate-delay-400ms">
                {t('verifyingAccount')}
              </span>
              <p className="text-sm text-gray-200 dark:text-gray-300 mt-1
                            animate-fade-in-up animate-delay-600ms">
                Por favor, espera un momento mientras procesamos tu solicitud.
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-600/30 dark:bg-gray-700/40 relative overflow-hidden mb-4">
              <div className="absolute inset-0 rounded-full bg-primary/70 dark:bg-primary/50 
                              animate-progress-shine" style={{ width: '100%' }}></div>
            </div>
            <p className="text-xs text-gray-300 dark:text-gray-400 
                          animate-fade-in-up animate-delay-800ms">
              Esto puede tardar unos segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VerificationScreen;
