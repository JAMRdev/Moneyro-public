
import { useState, useMemo } from 'react';
import { Transaction } from '@/types';

// Constante que define cuántos elementos mostrar por página
const ITEMS_PER_PAGE = 20;

/**
 * Hook personalizado para manejar paginación de transacciones
 * 
 * Este hook encapsula toda la lógica de paginación para listas de transacciones:
 * - Calcula páginas totales automáticamente
 * - Proporciona transacciones paginadas para la página actual
 * - Incluye funciones de navegación entre páginas
 * - Optimizado con useMemo para evitar recálculos innecesarios
 * 
 * @param transactions - Array completo de transacciones a paginar
 * @returns Objeto con estado de paginación y funciones de control
 */
export const useTransactionPagination = (transactions: Transaction[]) => {
  // Estado para la página actual (empezando en 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular número total de páginas basado en el total de transacciones
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  
  /**
   * Calcular qué transacciones mostrar en la página actual
   * Usa useMemo para optimizar y evitar recálculos innecesarios
   */
  const paginatedTransactions = useMemo(() => {
    // Calcular índice de inicio para la página actual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    // Calcular índice de fin
    const endIndex = startIndex + ITEMS_PER_PAGE;
    // Retornar slice del array original
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  /**
   * Función para navegar a una página específica
   * Incluye validación para evitar páginas inválidas
   * 
   * @param page - Número de página a la que navegar
   */
  const goToPage = (page: number) => {
    // Asegurar que la página esté dentro del rango válido (1 a totalPages)
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  /**
   * Navegar a la página siguiente
   */
  const nextPage = () => goToPage(currentPage + 1);
  
  /**
   * Navegar a la página anterior
   */
  const prevPage = () => goToPage(currentPage - 1);

  // Retornar objeto con todo el estado y funciones de paginación
  return {
    currentPage,
    totalPages,
    paginatedTransactions, // Solo las transacciones de la página actual
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages, // Booleano para saber si hay página siguiente
    hasPrevPage: currentPage > 1, // Booleano para saber si hay página anterior
  };
};
