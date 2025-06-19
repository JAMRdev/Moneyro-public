
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types';
import { TransactionFiltersState } from './useTransactions';
import { useAuth } from './useAuth';

/**
 * Hook optimizado para cargar transacciones con filtros aplicados en el servidor
 * 
 * Este hook mejora el rendimiento aplicando filtros directamente en la query de Supabase
 * en lugar de cargar todas las transacciones y filtrarlas en el cliente.
 * 
 * Optimizaciones implementadas:
 * - Filtros aplicados en el servidor (reduce transferencia de datos)
 * - Cache inteligente con diferentes tiempos de vida
 * - Ordenamiento optimizado por fecha
 * - Refetch controlado para evitar llamadas innecesarias
 * 
 * @param filters - Estado de filtros para aplicar en la query
 * @returns Query result con transacciones filtradas
 */
export const useOptimizedTransactions = (filters: TransactionFiltersState) => {
  const { session, loading } = useAuth();
  
  return useQuery({
    queryKey: ['transactions', 'optimized', filters],
    queryFn: async (): Promise<Transaction[]> => {
      // Construir query base con joins necesarios
      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        // Ordenamiento optimizado: primero por fecha, luego por creación
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });

      // Aplicar filtro de tipo solo si no es 'all'
      // Esto reduce significativamente los datos transferidos
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      // Aplicar filtro de categoría solo si no es 'all'
      if (filters.category_id !== 'all') {
        query = query.eq('category_id', filters.category_id);
      }

      // Ejecutar query
      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        category_id: item.category_id || undefined
      })) as Transaction[];
    },
    // Configuración de cache optimizada
    staleTime: 30 * 1000, // Datos considerados frescos por 30 segundos
    gcTime: 5 * 60 * 1000, // Mantener en cache por 5 minutos
    refetchOnWindowFocus: false, // No refetch al cambiar ventana
    refetchOnMount: true, // Refetch al montar para asegurar datos frescos
    enabled: !!session && !loading, // Solo ejecutar si hay sesión válida
    retry: 3, // Reintentar hasta 3 veces en caso de error
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
  });
};
