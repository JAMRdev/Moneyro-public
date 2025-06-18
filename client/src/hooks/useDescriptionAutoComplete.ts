
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook personalizado para autocompletado inteligente de descripciones
 * 
 * Este hook proporciona sugerencias de descripción basadas en transacciones previas del usuario.
 * Características:
 * - Obtiene las últimas 100 transacciones del usuario
 * - Filtra descripciones únicas y no nulas
 * - Retorna las 20 sugerencias más recientes
 * - Cache de 5 minutos para optimizar rendimiento
 * - Completamente tree-shakeable
 * 
 * @returns Objeto con array de sugerencias de descripción
 */
export const useDescriptionAutoComplete = () => {
  // Query para obtener descripciones de transacciones previas
  const { data: suggestions = [] } = useQuery({
    queryKey: ['transaction-descriptions'],
    queryFn: async () => {
      // Consultar las últimas 100 transacciones con descripción no nula
      const { data } = await supabase
        .from('transactions')
        .select('description')
        .not('description', 'is', null) // Filtrar descripciones no nulas
        .order('created_at', { ascending: false }) // Más recientes primero
        .limit(100); // Limitar a 100 para optimizar rendimiento
      
      // Crear set de descripciones únicas para eliminar duplicados
      const uniqueDescriptions = [...new Set(data?.map(t => t.description) || [])];
      
      // Retornar las 20 sugerencias más recientes
      return uniqueDescriptions.slice(0, 20);
    },
    staleTime: 5 * 60 * 1000, // Cache válido por 5 minutos
  });

  return { suggestions };
};
