
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../utils/translations';
import { Button } from '../ui/button';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  language: Language;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: language === 'es' 
        ? '¡Hola! Soy GEEorge, tu asistente especializado del Grupo Empresarial Electromedico. Puedo ayudarte con licitaciones públicas, gestión de inmuebles, recursos humanos, matemáticas y mucho más. ¿En qué puedo ayudarte hoy?'
        : 'Hello! I am GEEorge, your specialized assistant from Grupo Empresarial Electromedico. I can help you with public tenders, real estate management, human resources, mathematics, and much more. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGEEorgeResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Especialización en licitaciones públicas
    if (message.includes('licitación') || message.includes('licitacion') || message.includes('tender') || message.includes('concurso')) {
      return language === 'es' 
        ? 'Como especialista en licitaciones públicas de electromedicina, te recomiendo revisar los criterios técnicos específicos, plazos de entrega, y certificaciones requeridas. ¿Necesitas ayuda con algún aspecto específico de la licitación?'
        : 'As a specialist in public electromedical tenders, I recommend reviewing the specific technical criteria, delivery deadlines, and required certifications. Do you need help with any specific aspect of the tender?';
    }
    
    // Especialización en gestión de inmuebles
    if (message.includes('inmueble') || message.includes('propiedad') || message.includes('real estate') || message.includes('property')) {
      return language === 'es' 
        ? 'En gestión de inmuebles del GEE, puedo ayudarte con valoraciones, contratos de arrendamiento, mantenimiento preventivo, y optimización de costos. ¿Qué aspecto específico te interesa?'
        : 'In GEE real estate management, I can help you with valuations, lease contracts, preventive maintenance, and cost optimization. What specific aspect interests you?';
    }
    
    // Especialización en RRHH
    if (message.includes('recursos humanos') || message.includes('rrhh') || message.includes('human resources') || message.includes('empleado')) {
      return language === 'es' 
        ? 'En recursos humanos del GEE, manejo procesos de contratación, evaluaciones de desempeño, capacitación técnica en electromedicina, y gestión del talento. ¿En qué proceso necesitas asistencia?'
        : 'In GEE human resources, I handle recruitment processes, performance evaluations, technical electromedical training, and talent management. Which process do you need assistance with?';
    }
    
    // Especialización en matemáticas
    if (message.includes('matemática') || message.includes('matematica') || message.includes('cálculo') || message.includes('math')) {
      return language === 'es' 
        ? 'Puedo ayudarte con cálculos de costos, análisis financiero, estadísticas de mantenimiento, proyecciones de inversión y optimización de recursos. ¿Qué tipo de cálculo necesitas?'
        : 'I can help you with cost calculations, financial analysis, maintenance statistics, investment projections, and resource optimization. What type of calculation do you need?';
    }
    
    // Especialización en leyes y administración
    if (message.includes('ley') || message.includes('legal') || message.includes('administración') || message.includes('normativa')) {
      return language === 'es' 
        ? 'En el ámbito legal y administrativo del GEE, puedo orientarte sobre normativas de electromedicina, contratos públicos, cumplimiento regulatorio, y procedimientos administrativos. ¿Qué consulta legal tienes?'
        : 'In the legal and administrative field of GEE, I can guide you on electromedical regulations, public contracts, regulatory compliance, and administrative procedures. What legal query do you have?';
    }
    
    // Respuesta general
    return language === 'es' 
      ? 'Como asistente especializado del GEE, puedo ayudarte en diversas áreas: licitaciones públicas de electromedicina, gestión de inmuebles, recursos humanos, matemáticas aplicadas, y aspectos legales-administrativos. ¿Puedes ser más específico sobre tu consulta?'
      : 'As a specialized GEE assistant, I can help you in various areas: public electromedical tenders, real estate management, human resources, applied mathematics, and legal-administrative aspects. Can you be more specific about your query?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simular tiempo de "pensamiento"
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
      
      // Simular tiempo de "escritura"
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: getGEEorgeResponse(inputMessage),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96 md:w-96 md:h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">G</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">GEEorge</h3>
            <p className="text-xs text-blue-100">
              {language === 'es' ? 'Asistente Especializado' : 'Specialized Assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 md:h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-4'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-4'
                  }`}
                >
                  {message.content}
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg mr-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {language === 'es' ? 'Pensando...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg mr-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {language === 'es' ? 'Escribiendo...' : 'Writing...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={language === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'}
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                rows={2}
                disabled={isThinking || isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isThinking || isTyping}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotModal;
