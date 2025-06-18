
import { useMemo } from 'react';
import { Transaction } from '@/types';

/**
 * Hook personalizado para buscar transacciones en tiempo real
 * 
 * Este hook implementa la lógica de filtrado de transacciones basada en un término de búsqueda.
 * Busca en múltiples campos: descripción, categoría y monto.
 * 
 * Características:
 * - Búsqueda case-insensitive (no distingue mayúsculas/minúsculas)
 * - Busca en descripción, categoría y monto
 * - Optimizado con useMemo para evitar recálculos innecesarios
 * - Retorna todas las transacciones si no hay término de búsqueda
 * 
 * @param transactions - Array de transacciones donde buscar
 * @param searchQuery - Término de búsqueda
 * @returns Array filtrado de transacciones que coinciden con la búsqueda
 */
export const useTransactionSearch = (transactions: Transaction[], searchQuery: string) => {
  return useMemo(() => {
    // Si no hay término de búsqueda, retornar todas las transacciones
    if (!searchQuery.trim()) {
      return transactions;
    }

    // Normalizar el término de búsqueda (minúsculas y sin espacios extra)
    const query = searchQuery.toLowerCase().trim();
    
    // Filtrar transacciones que coincidan en cualquiera de estos campos:
    return transactions.filter(transaction => {
      // Buscar en descripción (manejar valores null/undefined)
      const description = (transaction.description || '').toLowerCase();
      
      // Buscar en nombre de categoría (manejar valores null/undefined)
      const category = (transaction.categories?.name || '').toLowerCase();
      
      // Buscar en monto (convertir número a string)
      const amount = transaction.amount.toString();
      
      // Retornar true si el término de búsqueda se encuentra en cualquier campo
      return description.includes(query) || 
             category.includes(query) || 
             amount.includes(query);
    });
  }, [transactions, searchQuery]); // Dependencias del memo: recalcular solo si cambian las transacciones o la búsqueda
};
