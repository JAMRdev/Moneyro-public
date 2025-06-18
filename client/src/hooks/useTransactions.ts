
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

/**
 * Estado de filtros para transacciones
 * 
 * @interface TransactionFiltersState
 * @property {DateRange} [date_range] - Rango de fechas para filtrar transacciones
 * @property {"all" | "ingreso" | "egreso"} type - Tipo de transacción a filtrar
 * @property {string} category_id - ID de categoría para filtrar, "all" para todas
 */
export type TransactionFiltersState = {
  date_range?: DateRange;
  type: "all" | "ingreso" | "egreso";
  category_id: string;
};

/**
 * Opciones adicionales para la query de transacciones
 * 
 * @interface TransactionQueryOptions
 * @property {boolean} [enabled] - Si la query debe ejecutarse automáticamente
 * @property {number} [refetchInterval] - Intervalo de refetch en milisegundos
 * @property {boolean} [ignoreDashboardMonth] - Si debe ignorar el filtro de mes del dashboard
 */
type TransactionQueryOptions = {
  enabled?: boolean;
  refetchInterval?: number;
  ignoreDashboardMonth?: boolean;
};

/**
 * Función para obtener transacciones filtradas desde Supabase
 * 
 * @async
 * @function fetchTransactions
 * @param {TransactionFiltersState} filters - Filtros a aplicar
 * @returns {Promise<Transaction[]>} Array de transacciones filtradas
 * @throws {Error} Error si falla la consulta a la base de datos
 */
const fetchTransactions = async (filters: TransactionFiltersState): Promise<Transaction[]> => {
  console.log("Fetching transactions with filters:", filters);
  
  // Construir query base con joins necesarios
  let query = supabase
    .from("transactions")
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  // Aplicar filtro de tipo si no es 'all'
  if (filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  // Aplicar filtro de categoría si no es 'all'
  if (filters.category_id !== "all") {
    query = query.eq("category_id", filters.category_id);
  }

  // Aplicar filtro de rango de fechas si está definido
  if (filters.date_range?.from) {
    query = query.gte('transaction_date', format(filters.date_range.from, 'yyyy-MM-dd'));
  }
  if (filters.date_range?.to) {
    query = query.lte('transaction_date', format(filters.date_range.to, 'yyyy-MM-dd'));
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error);
    throw new Error(error.message);
  }

  console.log(`Fetched ${data?.length || 0} transactions`);
  return (data || []) as Transaction[];
};

/**
 * Hook personalizado para gestión de transacciones con filtros y cache inteligente
 * 
 * Este hook proporciona una interfaz completa para obtener transacciones del usuario
 * con capacidades avanzadas de filtrado y optimización de rendimiento.
 * 
 * Características principales:
 * - Filtrado por tipo (ingreso/egreso)
 * - Filtrado por categoría
 * - Filtrado por rango de fechas
 * - Cache inteligente con React Query
 * - Retry automático en caso de errores
 * - Logging detallado para debugging
 * 
 * @example
 * ```typescript
 * const filters = {
 *   type: 'egreso' as const,
 *   category_id: 'all',
 *   date_range: { from: new Date(), to: new Date() }
 * };
 * 
 * const { data, isLoading, error } = useTransactions(filters);
 * ```
 * 
 * @param {TransactionFiltersState} filters - Estado de filtros para aplicar
 * @param {TransactionQueryOptions} [options] - Opciones adicionales para la query
 * @returns {Object} Objeto con datos, estado de carga y funciones de React Query
 * @returns {Transaction[]} returns.data - Array de transacciones filtradas
 * @returns {boolean} returns.isLoading - Estado de carga
 * @returns {Error | null} returns.error - Error si ocurre algún problema
 * @returns {boolean} returns.isError - Booleano indicando si hay error
 * @returns {Function} returns.refetch - Función para refrescar datos manualmente
 */
export const useTransactions = (
  filters: TransactionFiltersState, 
  options: TransactionQueryOptions = {}
) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 30 * 1000, // Datos frescos por 30 segundos
    gcTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // No reintentar para errores específicos
      if (error?.code === 'PGRST116') return false;
      return failureCount < 3;
    },
    ...options // Permitir sobrescribir opciones
  });
};
