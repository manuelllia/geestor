
import { useState, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  content?: string;
}

interface AnalysisContext {
  pcapData?: any;
  pptData?: any;
  analysisResults?: any;
  reportData?: any;
  uploadedFiles?: UploadedFile[];
}

export const useChatbotContext = () => {
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext>({});

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string, files?: UploadedFile[]) => {
    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: new Date(),
      files
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
      const contextMessage = `Se ha completado un nuevo análisis de costes detallado. Datos disponibles: ${
        Object.keys(newContext).join(', ')
      }. Ahora puedes hacer preguntas específicas sobre criterios de adjudicación, fórmulas económicas, personal necesario, costes desglosados, plazos y cualquier aspecto de la licitación.`;
      
      addMessage('system', contextMessage);
    }

    // Agregar archivos subidos al contexto
    if (newContext.uploadedFiles && newContext.uploadedFiles.length > 0) {
      const fileNames = newContext.uploadedFiles.map(f => f.name).join(', ');
      const contextMessage = `Se han subido nuevos archivos al contexto: ${fileNames}. Estos archivos están disponibles para análisis y consultas.`;
      
      addMessage('system', contextMessage);
    }
  }, [addMessage]);

  const getContextForPrompt = useCallback(() => {
    const contextParts = [];
    
    // Contexto de análisis existente con más detalle
    if (analysisContext.analysisResults) {
      const analysis = analysisContext.analysisResults;
      contextParts.push(`ANÁLISIS DE LICITACIÓN DISPONIBLE:
      
      Información General:
      - Entidad Contratante: ${analysis.informacionGeneral?.entidadContratante || 'No especificado'}
      - Objeto del Contrato: ${analysis.informacionGeneral?.objetoContrato || 'No especificado'}
      - Tipo de Licitación: ${analysis.informacionGeneral?.tipoLicitacion || 'No especificado'}
      - Código CPV: ${analysis.informacionGeneral?.codigoCPV || 'No especificado'}
      - Número de Lotes: ${analysis.informacionGeneral?.lotes?.length || 0}
      
      Análisis Económico:
      - Presupuesto Base: ${analysis.analisisEconomico?.presupuestoBaseLicitacion || 'No especificado'}
      - Trabajadores Necesarios: ${analysis.analisisEconomico?.personal?.numeroTrabajadores || 0}
      - Desglose de Personal: ${analysis.analisisEconomico?.personal?.desglosePorPuesto?.length || 0} puestos identificados
      
      Criterios de Adjudicación:
      - Fórmulas Matemáticas: ${analysis.criteriosAdjudicacion?.formulasMatematicas?.length || 0} detectadas
      - Criterios Automáticos: ${analysis.criteriosAdjudicacion?.criteriosAutomaticos?.length || 0}
      - Criterios Subjetivos: ${analysis.criteriosAdjudicacion?.criteriosSubjetivos?.length || 0}
      - Puntuación Máxima Económica: ${analysis.criteriosAdjudicacion?.puntuacionMaximaEconomica || 'No especificado'}
      - Puntuación Máxima Técnica: ${analysis.criteriosAdjudicacion?.puntuacionMaximaTecnica || 'No especificado'}
      
      Cronograma:
      - Fecha Límite Ofertas: ${analysis.cronogramaPlazos?.fechaLimiteOfertas || 'No especificado'}
      - Fecha Inicio Ejecución: ${analysis.cronogramaPlazos?.fechaInicioEjecucion || 'No especificado'}
      
      Alcance:
      - Duración Base: ${analysis.alcanceCondiciones?.duracionBase || 'No especificado'}
      - Ámbito Geográfico: ${analysis.alcanceCondiciones?.ambitoGeografico || 'No especificado'}
      - Servicios Incluidos: ${analysis.alcanceCondiciones?.serviciosIncluidos?.length || 0} servicios
      - Productos Incluidos: ${analysis.alcanceCondiciones?.productosIncluidos?.length || 0} productos`);
    }
    
    // Archivos subidos
    if (analysisContext.uploadedFiles && analysisContext.uploadedFiles.length > 0) {
      contextParts.push(`ARCHIVOS SUBIDOS DISPONIBLES:
      ${analysisContext.uploadedFiles.map(file => 
        `- ${file.name} (${file.type}) - ${(file.size / 1024).toFixed(1)} KB`
      ).join('\n')}`);
    }

    // Historial de conversación relevante (últimos 10 mensajes)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10).map(msg => 
        `${msg.role}: ${msg.content}${msg.files ? ` [Archivos: ${msg.files.map(f => f.name).join(', ')}]` : ''}`
      ).join('\n');

      contextParts.push(`HISTORIAL DE CONVERSACIÓN RECIENTE:\n${recentHistory}`);
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
      hasUploadedFiles: (analysisContext.uploadedFiles?.length || 0) > 0,
      totalUploadedFiles: analysisContext.uploadedFiles?.length || 0,
      lastUpdate: conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1].timestamp : null
    };
  }, [conversationHistory, analysisContext]);

  const addUploadedFiles = useCallback((files: UploadedFile[]) => {
    setAnalysisContext(prev => ({
      ...prev,
      uploadedFiles: [...(prev.uploadedFiles || []), ...files]
    }));
  }, []);

  const removeUploadedFile = useCallback((fileId: string) => {
    setAnalysisContext(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles?.filter(file => file.id !== fileId) || []
    }));
  }, []);

  return {
    conversationHistory,
    analysisContext,
    addMessage,
    updateAnalysisContext,
    getContextForPrompt,
    clearContext,
    getConversationSummary,
    addUploadedFiles,
    removeUploadedFile
  };
};
