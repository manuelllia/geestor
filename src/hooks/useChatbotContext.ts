
import { useState, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AnalysisContext {
  pcapData?: any;
  pptData?: any;
  analysisResults?: any;
  reportData?: any;
}

export const useChatbotContext = () => {
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext>({});

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string) => {
    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: new Date()
    };
    setConversationHistory(prev => [...prev, newMessage]);
  }, []);

  const updateAnalysisContext = useCallback((newContext: Partial<AnalysisContext>) => {
    setAnalysisContext(prev => ({
      ...prev,
      ...newContext
    }));

    // Agregar contexto del análisis a la conversación
    if (newContext.analysisResults || newContext.reportData) {
      const contextMessage = `Se ha completado un nuevo análisis de costes. Datos disponibles: ${
        Object.keys(newContext).join(', ')
      }`;
      
      addMessage('system', contextMessage);
    }
  }, [addMessage]);

  const getContextForPrompt = useCallback(() => {
    const contextParts = [];
    
    if (analysisContext.pcapData) {
      contextParts.push('Datos PCAP disponibles para consulta');
    }
    
    if (analysisContext.pptData) {
      contextParts.push('Datos PPT disponibles para consulta');
    }
    
    if (analysisContext.analysisResults) {
      contextParts.push(`Resultados del análisis: ${JSON.stringify(analysisContext.analysisResults, null, 2)}`);
    }
    
    if (analysisContext.reportData) {
      contextParts.push(`Datos del reporte: ${JSON.stringify(analysisContext.reportData, null, 2)}`);
    }

    // Incluir historial de conversación relevante (últimos 5 mensajes)
    const recentHistory = conversationHistory.slice(-5).map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');

    if (recentHistory) {
      contextParts.push(`Historial de conversación reciente:\n${recentHistory}`);
    }

    return contextParts.join('\n\n');
  }, [analysisContext, conversationHistory]);

  const clearContext = useCallback(() => {
    setConversationHistory([]);
    setAnalysisContext({});
  }, []);

  const getConversationSummary = useCallback(() => {
    return {
      totalMessages: conversationHistory.length,
      hasAnalysisData: Object.keys(analysisContext).length > 0,
      lastUpdate: conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1].timestamp : null
    };
  }, [conversationHistory, analysisContext]);

  return {
    conversationHistory,
    analysisContext,
    addMessage,
    updateAnalysisContext,
    getContextForPrompt,
    clearContext,
    getConversationSummary
  };
};
