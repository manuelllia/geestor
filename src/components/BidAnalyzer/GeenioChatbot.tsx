
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface GeenioChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const GeenioChatbot: React.FC<GeenioChatbotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy GEEnio, tu experto en licitaciones de electromedicina. Para realizar un análisis completo de la licitación, necesitarás subir tanto el archivo PCAP como el PPT. Una vez que tengas ambos archivos, podremos analizar automáticamente la licitación con IA. ¿En qué puedo ayudarte?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    // Simular tiempo de pensamiento de la IA
    setTimeout(() => {
      setIsThinking(false);
      
      // Agregar mensaje "escribiendo"
      const typingMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Escribiendo...',
        isBot: true,
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, typingMessage]);

      // Simular tiempo de escritura
      setTimeout(() => {
        setMessages(prev => 
          prev.filter(msg => !msg.isTyping).concat({
            id: (Date.now() + 2).toString(),
            text: 'Gracias por tu consulta. Como experto en licitaciones de electromedicina, puedo ayudarte con el análisis una vez que subas los archivos PCAP y PPT. ¿Hay algo específico sobre el proceso de licitación que te gustaría saber?',
            isBot: true,
            timestamp: new Date()
          })
        );
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
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-14 h-14 md:w-16 md:h-16 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />
      
      {/* Chatbot container */}
      <div className="fixed bottom-0 right-0 z-50 w-full h-full md:bottom-4 md:right-4 md:w-96 md:h-[500px] md:max-h-[80vh]">
        <Card className="h-full flex flex-col shadow-2xl rounded-none md:rounded-lg">
          <CardHeader className="bg-blue-600 text-white rounded-none md:rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg">GEEnio</CardTitle>
              </div>
              <Button
                onClick={onToggle}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-blue-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-blue-100 text-sm">
              Experto en licitaciones de electromedicina
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'bg-blue-600 text-white'
                    } ${message.isTyping ? 'animate-pulse' : ''}`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 min-h-[40px] max-h-[80px] resize-none"
                  disabled={isThinking}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isThinking}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GeenioChatbot;
