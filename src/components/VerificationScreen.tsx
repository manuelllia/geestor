
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface VerificationScreenProps {
  onVerificationSuccess: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onVerificationSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 1000));

    const correctPassword = 'GEE2025';
    
    if (password === correctPassword) {
      onVerificationSuccess();
    } else {
      setError('Contraseña incorrecta. Contacte con el administrador del sistema.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
          }
        `}
      </style>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center shadow-lg" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <Shield className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Acceso Restringido
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Ingrese la contraseña para acceder al sistema
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña de acceso
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduzca su contraseña"
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
              style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Acceder al Sistema'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Sistema de Gestión Empresarial</p>
            <p className="mt-1">Grupo Empresarial Electromédico</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationScreen;
