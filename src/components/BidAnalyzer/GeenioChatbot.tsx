
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface GeenioChatbotProps {
  context?: any;
}

const GeenioChatbot: React.FC<GeenioChatbotProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy Genie, tu asistente inteligente para análisis de licitaciones. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simular respuesta del bot (aquí iría la integración con IA real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `He analizado tu consulta sobre "${userMessage.text}". Basándome en la información disponible, te recomiendo revisar los criterios técnicos y económicos. ¿Te gustaría que profundice en algún aspecto específico?`,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full max-h-[500px] sm:max-h-[600px] flex flex-col rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-700">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <span className="font-semibold">Genie - Asistente IA</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto"></div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-900/20 dark:to-gray-900">
        <ScrollArea className="flex-1 p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-blue-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-500" />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta sobre la licitación..."
              disabled={isLoading}
              className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-3 sm:px-4 shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Genie puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeenioChatbot;
