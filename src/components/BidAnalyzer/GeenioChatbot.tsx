
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageCircle, X } from 'lucide-react';

// --- IMPORTA TUS TRADUCCIONES Y EL HOOK ---
import { Language } from '../../utils/translations'; // Ajusta la ruta a tu archivo de translations.ts
import { useTranslation } from '../../hooks/useTranslation'; // Ajusta la ruta a tu hook useTranslation

interface GeenioChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: any;
  language: Language; // Agrega la prop language
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const GeenioChatbot: React.FC<GeenioChatbotProps> = ({ isOpen, onToggle, context, language }) => {
  const { t } = useTranslation(language); // Inicializa el hook de traducción
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showThinkingIndicator, setShowThinkingIndicator] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      scrollToBottom();
    }
  }, [isOpen, messages, showThinkingIndicator]);

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

    setShowThinkingIndicator(true);

    try {
      const botResponse = await generateResponse(userMessage);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: t('botErrorResponse') }]); // Traducido
    } finally {
      setShowThinkingIndicator(false);
    }
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('🤖 Generando respuesta para:', userMessage);
      
      // Respuestas a saludos y mensajes básicos, ahora usando las traducciones
      // Las claves de coincidencia siguen siendo universales (hola, hello, etc.)
      // pero las respuestas provienen de `t()`
      const basicResponses: { [key: string]: string } = {
        'hola': t('greetingHello'),
        'hello': t('greetingHello'),
        'buenos días': t('greetingGoodMorning'),
        'good morning': t('greetingGoodMorning'),
        'buenas tardes': t('greetingGoodAfternoon'),
        'good afternoon': t('greetingGoodAfternoon'),
        'buenas noches': t('greetingGoodEvening'),
        'good evening': t('greetingGoodEvening'),
        'que tal': t('greetingHowAreYou'),
        'how are you': t('greetingHowAreYou'),
        'como estas': t('greetingIAmFine'),
        'gracias': t('greetingThanks'),
        'thank you': t('greetingThanks'),
        'de nada': t('greetingYouAreWelcome'),
        'you are welcome': t('greetingYouAreWelcome'),
        'ayuda': t('helpMessage'),
        'help': t('helpMessage'),
      };

      const lowerMessage = userMessage.toLowerCase().trim();
      for (const [key, response] of Object.entries(basicResponses)) {
        if (lowerMessage.includes(key)) {
          console.log('✅ Respuesta básica encontrada para:', key);
          await new Promise(resolve => setTimeout(resolve, 500)); 
          return response;
        }
      }

      // El prompt del sistema ahora se traduce
      let systemPrompt = t('aiSystemPrompt');

      if (context) {
        systemPrompt += `\n\n${language === 'es' ? 'Tienes acceso al siguiente contexto de análisis:' : 'You have access to the following analysis context:'}
        - ${language === 'es' ? 'Presupuesto' : 'Budget'}: ${context.presupuestoGeneral}
        - ${language === 'es' ? 'Por lotes' : 'By lots'}: ${context.esPorLotes ? (language === 'es' ? 'Sí' : 'Yes') : (language === 'es' ? 'No' : 'No')}
        - ${language === 'es' ? 'Fórmula económica' : 'Economic formula'}: ${context.formulaEconomica}
        - ${language === 'es' ? 'Criterios automáticos' : 'Automatic criteria'}: ${context.criteriosAutomaticos?.length || 0}
        - ${language === 'es' ? 'Criterios subjetivos' : 'Subjective criteria'}: ${context.criteriosSubjetivos?.length || 0}
        - ${language === 'es' ? 'Lotes' : 'Lots'}: ${context.lotes?.length || 0}`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
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
        throw new Error(`${language === 'es' ? 'Error en la API:' : 'API error:'} ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || t('botErrorResponse');
      
      console.log('✅ Respuesta generada exitosamente');
      return botResponse;

    } catch (error) {
      console.error('❌ Error generando respuesta:', error);
      return t('processingErrorMessage'); // Traducido
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
          <span className="sr-only">{t('openGeenioChatbot')}</span>
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
              <p className="text-xs text-blue-100">{t('asistChat')}</p>
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
          {messages.length === 0 && !showThinkingIndicator && (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">G</span>
              </div>
              <p>{t('bienvenidaChat')}</p>
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

          {/* Indicador de "Pensando..." */}
          {showThinkingIndicator && (
            <div className="flex justify-start">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div className="rounded-2xl px-3 py-2 text-sm max-w-[85%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="whitespace-pre-wrap break-words">
                  {t('thinking')}<span className="typing-dots"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={t('typeYourMessage')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              disabled={showThinkingIndicator}
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || showThinkingIndicator}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">{t('send')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeenioChatbot;
