
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageCircle, X } from 'lucide-react';

interface GeenioChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: any;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const GeenioChatbot: React.FC<GeenioChatbotProps> = ({ isOpen, onToggle, context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage = newMessage.trim();
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);
    setNewMessage('');

    try {
      const botResponse = await generateResponse(userMessage);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Lo siento, no pude generar una respuesta.' }]);
    }
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('🤖 Generando respuesta para:', userMessage);
      
      // Respuestas a saludos y mensajes básicos
      const basicResponses: { [key: string]: string } = {
        'hola': '¡Hola! 👋 Soy Geenio, tu asistente de análisis de licitaciones. ¿En qué puedo ayudarte hoy?',
        'hello': 'Hello! 👋 I\'m Geenio, your tender analysis assistant. How can I help you today?',
        'buenos días': '¡Buenos días! 🌅 ¿Cómo puedo asistirte con el análisis de licitaciones?',
        'buenas tardes': '¡Buenas tardes! 🌇 ¿En qué puedo ayudarte con tu análisis?',
        'buenas noches': '¡Buenas noches! 🌙 ¿Necesitas ayuda con algún análisis?',
        'que tal': '¡Todo bien por aquí! 😊 Listo para ayudarte con cualquier análisis de licitaciones.',
        'como estas': '¡Muy bien, gracias! 🤖 Preparado para analizar documentos y responder tus preguntas.',
        'gracias': '¡De nada! 😊 Siempre estoy aquí para ayudarte con tus análisis.',
        'thank you': 'You\'re welcome! 😊 I\'m always here to help with your analysis.',
        'ayuda': '¡Por supuesto! 🆘 Puedo ayudarte a:\n• Analizar documentos de licitación\n• Explicar criterios de evaluación\n• Calcular puntuaciones\n• Interpretar resultados\n\n¿Qué necesitas específicamente?'
      };

      // Verificar si es un saludo o mensaje básico
      const lowerMessage = userMessage.toLowerCase().trim();
      for (const [key, response] of Object.entries(basicResponses)) {
        if (lowerMessage.includes(key)) {
          console.log('✅ Respuesta básica encontrada para:', key);
          return response;
        }
      }

      // Si no es un saludo, proceder con el análisis normal
      let systemPrompt = `Eres Geenio, un asistente especializado en análisis de licitaciones públicas españolas. 
      
      Características:
      - Eres amigable, profesional y experto en licitaciones
      - Puedes responder saludos de manera cordial
      - Tu especialidad es analizar documentos PCAP y PPT
      - Ayudas a interpretar criterios de evaluación, calcular puntuaciones y entender resultados
      - Siempre respondes en español, de manera clara y concisa
      - Puedes mantener conversaciones casuales pero siempre volviendo al tema de licitaciones`;

      if (context) {
        systemPrompt += `\n\nTienes acceso al siguiente contexto de análisis:
        - Presupuesto: ${context.presupuestoGeneral}
        - Por lotes: ${context.esPorLotes ? 'Sí' : 'No'}
        - Fórmula económica: ${context.formulaEconomica}
        - Criterios automáticos: ${context.criteriosAutomaticos?.length || 0}
        - Criterios subjetivos: ${context.criteriosSubjetivos?.length || 0}
        - Lotes: ${context.lotes?.length || 0}`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUsuario: ${userMessage}` }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topK: 20,
            topP: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude generar una respuesta.';
      
      console.log('✅ Respuesta generada exitosamente');
      return botResponse;

    } catch (error) {
      console.error('❌ Error generando respuesta:', error);
      return 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="sr-only">Abrir Geenio Chatbot</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-80 sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">G</span>
            </div>
            <div>
              <h5 className="text-sm font-semibold">Geenio</h5>
              <p className="text-xs text-blue-100">Asistente de Análisis</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 w-8 h-8" 
            onClick={onToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef} 
          className="p-3 sm:p-4 h-64 sm:h-80 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-900 space-y-3"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">G</span>
              </div>
              <p>¡Hola! Soy Geenio, tu asistente para análisis de licitaciones.</p>
              <p className="mt-1">¿En qué puedo ayudarte?</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'bot' && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
              )}
              <div className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white ml-auto' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="whitespace-pre-wrap break-words">{message.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeenioChatbot;
