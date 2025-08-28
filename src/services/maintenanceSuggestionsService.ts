
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
            maxOutputTokens: 8192,
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
      console.log('📝 Texto de respuesta recibido de Gemini');

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
    return `
**Rol del Agente IA:**
Actúa como un ingeniero biomédico experto y/o un técnico de mantenimiento especializado en equipos de electromedicina, con acceso ilimitado y capacidad para realizar búsquedas exhaustivas en internet. Tu misión es investigar, compilar y estructurar información crítica sobre los requisitos de mantenimiento y preventivos para equipos médicos específicos.

**Objetivo de la Tarea:**
Para una lista de equipos de electromedicina que se te proporcionará, y basándote en un conjunto de tipos de mantenimiento de interés, deberás realizar una búsqueda exhaustiva en fuentes fiables para identificar los mantenimientos/preventivos adicionales que podrían estar faltando, su frecuencia recomendada y el tiempo estimado para su ejecución.

**LISTA_DENOMINACIONES:**
${JSON.stringify(denominaciones, null, 2)}

**LISTA_MANTENIMIENTOS_INTERES:**
${JSON.stringify(tiposMantenimientoInteres, null, 2)}

**Proceso de Búsqueda y Análisis:**

1. **Iteración por Equipo:** Para cada denominación de equipo en LISTA_DENOMINACIONES, realizarás una búsqueda individual.

2. **Fuentes de Información Prioritarias y Fiables:**
   - Manuales de Servicio y Documentación Técnica del Fabricante
   - Normativas y Estándares Internacionales (ISO 13485, IEC 60601, AAMI, HTM 08-01, etc.)
   - Guías de Mantenimiento de Asociaciones Profesionales o Sanitarias
   - Bases de Datos de Mantenimiento Hospitalario o Servicios Técnicos Certificados
   - Publicaciones Técnicas Especializadas y Artículos Científicos

3. **Extracción de Mantenimientos:**
   - Identifica todos los mantenimientos preventivos y tareas recomendadas que podrían faltar
   - Presta especial atención a los que coincidan con LISTA_MANTENIMIENTOS_INTERES
   - Un mismo equipo puede tener múltiples mantenimientos (regístrarlos por separado)
   - Sugiere mantenimientos adicionales aunque ya existan algunos básicos

4. **Extracción de Detalles:** Para cada mantenimiento identificado:
   - Descripción del Mantenimiento: Descripción clara y concisa
   - Frecuencia Recomendada: EXACTAMENTE uno de estos valores: "Mensual", "Bimensual", "Trimestral", "Cuatrimestral", "Semestral", "Anual", "Cada 15 días", "Cada 3 meses"
   - Tiempo Estimado: EXACTAMENTE en formato "X horas" o "X minutos" (ej: "2 horas", "30 minutos")

**FORMATO DE RESPUESTA REQUERIDO:**
Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura EXACTA:

{
  "suggestions": [
    {
      "denominacion": "Nombre exacto del equipo de la lista",
      "tipoMantenimiento": "Tipo de mantenimiento identificado",
      "frecuencia": "Una de las frecuencias válidas mencionadas arriba",
      "tiempoEstimado": "Tiempo en formato horas o minutos",
      "descripcion": "Descripción detallada del mantenimiento"
    }
  ]
}

**INSTRUCCIONES CRÍTICAS:**
- Responde SOLO con el JSON, sin explicaciones adicionales
- Incluye TODOS los mantenimientos sugeridos para cada equipo
- Si no encuentras información específica, usa valores por defecto razonables
- Asegúrate de que el JSON sea válido y parseable
- OBLIGATORIO: Usa EXACTAMENTE las frecuencias listadas arriba
- OBLIGATORIO: Usa EXACTAMENTE el formato de tiempo especificado
- Prioriza la información de fuentes oficiales del fabricante

Inicia la búsqueda exhaustiva ahora:
`;
  }

  private static parseGeminiResponse(responseText: string): MaintenanceSuggestion[] {
    try {
      // Limpiar la respuesta si tiene bloques de código markdown
      let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Buscar el inicio y fin del JSON
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      const parsedResult: GeminiMaintenanceResponse = JSON.parse(cleanedResponse);
      console.log('✅ JSON de sugerencias parseado exitosamente');
      
      // Validar y limpiar la estructura
      if (!parsedResult.suggestions || !Array.isArray(parsedResult.suggestions)) {
        throw new Error('La respuesta no contiene un array de sugerencias válido');
      }
      
      // Validar y normalizar cada sugerencia
      return parsedResult.suggestions.map(suggestion => {
        // Normalizar frecuencia a valores válidos
        let normalizedFrecuencia = String(suggestion.frecuencia || 'Trimestral');
        const validFrecuencias = ['Mensual', 'Bimensual', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual', 'Cada 15 días', 'Cada 3 meses'];
        
        if (!validFrecuencias.includes(normalizedFrecuencia)) {
          // Intentar mapear frecuencias similares
          const frecLower = normalizedFrecuencia.toLowerCase();
          if (frecLower.includes('mes') || frecLower.includes('month')) normalizedFrecuencia = 'Mensual';
          else if (frecLower.includes('trimest') || frecLower.includes('quarter')) normalizedFrecuencia = 'Trimestral';
          else if (frecLower.includes('semest') || frecLower.includes('six')) normalizedFrecuencia = 'Semestral';
          else if (frecLower.includes('año') || frecLower.includes('anual') || frecLower.includes('year')) normalizedFrecuencia = 'Anual';
          else normalizedFrecuencia = 'Trimestral'; // Por defecto
        }

        // Normalizar tiempo estimado
        let normalizedTiempo = String(suggestion.tiempoEstimado || '2 horas');
        if (!normalizedTiempo.includes('hora') && !normalizedTiempo.includes('minuto')) {
          // Si no tiene unidades, asumir horas
          const numMatch = normalizedTiempo.match(/\d+/);
          if (numMatch) {
            normalizedTiempo = `${numMatch[0]} horas`;
          } else {
            normalizedTiempo = '2 horas';
          }
        }

        return {
          denominacion: String(suggestion.denominacion || ''),
          tipoMantenimiento: String(suggestion.tipoMantenimiento || ''),
          frecuencia: normalizedFrecuencia,
          tiempoEstimado: normalizedTiempo,
          descripcion: suggestion.descripcion ? String(suggestion.descripcion) : undefined
        };
      }).filter(suggestion => 
        suggestion.denominacion && 
        suggestion.tipoMantenimiento && 
        suggestion.frecuencia
      );
      
    } catch (parseError) {
      console.error('❌ Error parseando respuesta de Gemini:', parseError);
      console.error('📝 Respuesta recibida:', responseText.substring(0, 500) + '...');
      throw new Error(`La respuesta de Gemini no es un JSON válido: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`);
    }
  }
}
