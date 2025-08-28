
interface MaintenanceSuggestion {
  denominacion: string;
  tipoMantenimiento: string;
  frecuencia: string;
  tiempoEstimado: string;
  descripcion?: string;
}

interface GeminiMaintenanceResponse {
  suggestions: MaintenanceSuggestion[];
}

export class MaintenanceSuggestionsService {
  private static readonly GEMINI_API_KEY = 'AIzaSyANIWvIMRvCW7f0meHRk4SobRz4s0pnxtg';
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  static async suggestMaintenanceSchedules(
    denominaciones: string[],
    tiposMantenimientoInteres: string[]
  ): Promise<MaintenanceSuggestion[]> {
    console.log('🤖 Iniciando búsqueda de sugerencias de mantenimiento con Gemini...');
    
    const prompt = this.generateMaintenancePrompt(denominaciones, tiposMantenimientoInteres);
    
    try {
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 4096, // Reducido para evitar respuestas muy largas
            responseMimeType: "application/json"
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error de Gemini API:', errorData);
        throw new Error(`Error de Gemini API: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta completa de Gemini recibida');

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Estructura de respuesta inválida:', data);
        throw new Error('Respuesta inválida de Gemini API - estructura incorrecta');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 Texto de respuesta recibido de Gemini (primeros 500 chars):', responseText.substring(0, 500));

      return this.parseGeminiResponse(responseText);

    } catch (error) {
      console.error('❌ Error en llamada a Gemini API:', error);
      if (error instanceof Error) {
        throw new Error(`Error en sugerencias de mantenimiento con Gemini: ${error.message}`);
      }
      throw new Error('Error desconocido en sugerencias de mantenimiento con Gemini');
    }
  }

  private static generateMaintenancePrompt(
    denominaciones: string[],
    tiposMantenimientoInteres: string[]
  ): string {
    // Limitar denominaciones a 20 para evitar prompts muy largos
    const limitedDenominaciones = denominaciones.slice(0, 20);
    
    return `
**Rol del Agente IA:**
Actúa como un ingeniero biomédico experto especializado en equipos de electromedicina. Analiza los equipos proporcionados y sugiere mantenimientos necesarios.

**Objetivo de la Tarea:**
Para los equipos de electromedicina que se te proporcionarán, identifica mantenimientos preventivos que podrían estar faltando, su frecuencia recomendada y el tiempo estimado para su ejecución.

**LISTA_DENOMINACIONES (Limitada a ${limitedDenominaciones.length} equipos):**
${JSON.stringify(limitedDenominaciones, null, 2)}

**LISTA_MANTENIMIENTOS_INTERES:**
${JSON.stringify(tiposMantenimientoInteres, null, 2)}

**Instrucciones de Análisis:**

1. **Análisis por Equipo:** Para cada denominación de equipo, sugiere 1-3 mantenimientos preventivos importantes.

2. **Criterios de Sugerencia:**
   - Prioriza mantenimientos críticos para la seguridad del paciente
   - Enfócate en mantenimientos que coincidan con LISTA_MANTENIMIENTOS_INTERES
   - Sugiere mantenimientos comunes en el sector sanitario

3. **Detalles Requeridos:** Para cada mantenimiento:
   - Frecuencia: EXACTAMENTE uno de estos valores: "Mensual", "Bimensual", "Trimestral", "Cuatrimestral", "Semestral", "Anual", "Cada 15 días", "Cada 3 meses"
   - Tiempo: EXACTAMENTE en formato "X horas" o "X minutos" (ej: "2 horas", "30 minutos")

**FORMATO DE RESPUESTA OBLIGATORIO:**
Responde ÚNICAMENTE con un objeto JSON válido. MÁXIMO 50 sugerencias total:

{
  "suggestions": [
    {
      "denominacion": "Nombre exacto del equipo de la lista",
      "tipoMantenimiento": "Tipo de mantenimiento sugerido",
      "frecuencia": "Una de las frecuencias válidas exactas",
      "tiempoEstimado": "Tiempo en formato exacto",
      "descripcion": "Descripción breve del mantenimiento"
    }
  ]
}

**INSTRUCCIONES CRÍTICAS:**
- Responde SOLO con el JSON, sin texto adicional
- MÁXIMO 50 sugerencias para evitar respuestas muy largas
- Usa EXACTAMENTE las frecuencias y formatos de tiempo especificados
- Asegúrate de que el JSON sea válido y parseable
- No incluyas caracteres especiales que rompan el JSON

Genera las sugerencias más importantes ahora:
`;
  }

  private static parseGeminiResponse(responseText: string): MaintenanceSuggestion[] {
    try {
      console.log('🔍 Iniciando parsing de respuesta de Gemini...');
      
      // Limpiar la respuesta de forma más robusta
      let cleanedResponse = responseText.trim();
      
      // Remover bloques de código markdown si existen
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Buscar el JSON válido en la respuesta
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEndBrace = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEndBrace === -1 || jsonEndBrace <= jsonStart) {
        console.error('❌ No se encontró JSON válido en la respuesta');
        throw new Error('No se encontró estructura JSON válida en la respuesta');
      }
      
      // Extraer solo la parte del JSON
      let jsonString = cleanedResponse.substring(jsonStart, jsonEndBrace + 1);
      
      // Intentar reparar JSON común malformado
      jsonString = this.repairCommonJsonIssues(jsonString);
      
      console.log('📝 JSON extraído (primeros 1000 chars):', jsonString.substring(0, 1000));
      
      // Intentar parsear el JSON
      const parsedResult: GeminiMaintenanceResponse = JSON.parse(jsonString);
      
      if (!parsedResult.suggestions || !Array.isArray(parsedResult.suggestions)) {
        throw new Error('La respuesta no contiene un array de sugerencias válido');
      }
      
      console.log('✅ JSON parseado exitosamente, procesando sugerencias...');
      
      // Procesar y validar cada sugerencia
      const validSuggestions = parsedResult.suggestions
        .slice(0, 50) // Limitar a 50 sugerencias máximo
        .map((suggestion, index) => {
          try {
            return this.normalizeSuggestion(suggestion);
          } catch (error) {
            console.warn(`⚠️ Sugerencia ${index + 1} inválida, omitiendo:`, error);
            return null;
          }
        })
        .filter((suggestion): suggestion is MaintenanceSuggestion => suggestion !== null);
      
      console.log(`✅ ${validSuggestions.length} sugerencias válidas procesadas`);
      return validSuggestions;
      
    } catch (parseError) {
      console.error('❌ Error parseando respuesta de Gemini:', parseError);
      console.error('📝 Respuesta completa:', responseText.substring(0, 1000) + '...');
      
      // Intentar parseo de emergencia con regex
      return this.emergencyParseResponse(responseText);
    }
  }

  private static repairCommonJsonIssues(jsonString: string): string {
    // Reparar comas finales en objetos y arrays
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
    
    // Reparar comillas faltantes en claves
    jsonString = jsonString.replace(/(\w+):/g, '"$1":');
    
    // Reparar comillas simples por dobles
    jsonString = jsonString.replace(/'/g, '"');
    
    // Reparar caracteres de escape problemáticos
    jsonString = jsonString.replace(/\\n/g, '\\n').replace(/\\t/g, '\\t');
    
    // Si el JSON está truncado, intentar cerrarlo
    const openBraces = (jsonString.match(/\{/g) || []).length;
    const closeBraces = (jsonString.match(/\}/g) || []).length;
    const openBrackets = (jsonString.match(/\[/g) || []).length;
    const closeBrackets = (jsonString.match(/\]/g) || []).length;
    
    // Cerrar arrays abiertos
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      jsonString += ']';
    }
    
    // Cerrar objetos abiertos
    for (let i = 0; i < openBraces - closeBraces; i++) {
      jsonString += '}';
    }
    
    return jsonString;
  }

  private static emergencyParseResponse(responseText: string): MaintenanceSuggestion[] {
    console.log('🚨 Intentando parseo de emergencia con regex...');
    
    try {
      const suggestions: MaintenanceSuggestion[] = [];
      
      // Buscar patrones de sugerencias con regex
      const suggestionPattern = /"denominacion":\s*"([^"]+)"[^}]*"tipoMantenimiento":\s*"([^"]+)"[^}]*"frecuencia":\s*"([^"]+)"[^}]*"tiempoEstimado":\s*"([^"]+)"/g;
      
      let match;
      while ((match = suggestionPattern.exec(responseText)) !== null && suggestions.length < 20) {
        try {
          const suggestion = this.normalizeSuggestion({
            denominacion: match[1],
            tipoMantenimiento: match[2],
            frecuencia: match[3],
            tiempoEstimado: match[4],
            descripcion: "Mantenimiento sugerido por IA"
          });
          
          suggestions.push(suggestion);
        } catch (error) {
          console.warn('⚠️ Sugerencia de emergencia inválida:', error);
        }
      }
      
      console.log(`🆘 Parseo de emergencia completado: ${suggestions.length} sugerencias`);
      return suggestions;
      
    } catch (error) {
      console.error('❌ Fallo total en parseo de emergencia:', error);
      throw new Error('No se pudo extraer ninguna sugerencia válida de la respuesta');
    }
  }

  private static normalizeSuggestion(suggestion: any): MaintenanceSuggestion {
    // Validar campos obligatorios
    if (!suggestion.denominacion || !suggestion.tipoMantenimiento) {
      throw new Error('Sugerencia incompleta - faltan campos obligatorios');
    }

    // Normalizar frecuencia
    let normalizedFrecuencia = String(suggestion.frecuencia || 'Trimestral').trim();
    const validFrecuencias = ['Mensual', 'Bimensual', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual', 'Cada 15 días', 'Cada 3 meses'];
    
    if (!validFrecuencias.includes(normalizedFrecuencia)) {
      const frecLower = normalizedFrecuencia.toLowerCase();
      if (frecLower.includes('mes') || frecLower.includes('month')) normalizedFrecuencia = 'Mensual';
      else if (frecLower.includes('trimest') || frecLower.includes('quarter') || frecLower.includes('3 mes')) normalizedFrecuencia = 'Trimestral';
      else if (frecLower.includes('semest') || frecLower.includes('6 mes')) normalizedFrecuencia = 'Semestral';
      else if (frecLower.includes('año') || frecLower.includes('anual') || frecLower.includes('year')) normalizedFrecuencia = 'Anual';
      else if (frecLower.includes('15') || frecLower.includes('quince')) normalizedFrecuencia = 'Cada 15 días';
      else normalizedFrecuencia = 'Trimestral';
    }

    // Normalizar tiempo estimado
    let normalizedTiempo = String(suggestion.tiempoEstimado || '2 horas').trim();
    if (!normalizedTiempo.match(/\d+\s*(hora|minuto)/)) {
      const numMatch = normalizedTiempo.match(/\d+/);
      if (numMatch) {
        const num = parseInt(numMatch[0]);
        normalizedTiempo = num > 10 ? `${num} minutos` : `${num} horas`;
      } else {
        normalizedTiempo = '2 horas';
      }
    }

    return {
      denominacion: String(suggestion.denominacion).trim(),
      tipoMantenimiento: String(suggestion.tipoMantenimiento).trim(),
      frecuencia: normalizedFrecuencia,
      tiempoEstimado: normalizedTiempo,
      descripcion: suggestion.descripcion ? String(suggestion.descripcion).trim() : undefined
    };
  }
}
