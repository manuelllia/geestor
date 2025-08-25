import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react';

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
    chatContainerRef.current?.scroll({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
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

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-80 flex flex-col">
        <div className="bg-blue-600 dark:bg-blue-900 text-white p-4 flex items-center justify-between">
          <h5 className="text-sm font-semibold">Geenio Chatbot</h5>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500 dark:hover:bg-blue-700" onClick={onToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </Button>
        </div>

        <div ref={chatContainerRef} className="p-4 h-64 overflow-y-auto flex-grow">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'bot' && (
                <Avatar className="mr-2 w-6 h-6">
                  <AvatarImage src="/geenio-logo.png" alt="Geenio" />
                  <AvatarFallback>GE</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-2 text-xs max-w-[70%] ${message.sender === 'user' ? 'bg-blue-100 dark:bg-blue-700 text-gray-800 dark:text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t dark:border-gray-700">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="mr-2 text-xs"
            />
            <Button size="sm" onClick={handleSendMessage} className="h-8 w-8 p-0">
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
