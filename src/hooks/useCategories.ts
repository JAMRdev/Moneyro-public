
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";

/**
 * Función para obtener todas las categorías desde Supabase
 * 
 * @async
 * @function fetchCategories
 * @returns {Promise<Category[]>} Array de todas las categorías disponibles
 * @throws {Error} Error si falla la consulta a la base de datos
 */
const fetchCategories = async (): Promise<Category[]> => {
  console.log("Fetching categories from database");
  
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }

  console.log(`Fetched ${data?.length || 0} categories`);
  return data || [];
};

/**
 * Hook personalizado para gestión de categorías
 * 
 * Este hook proporciona acceso a todas las categorías disponibles en la aplicación
 * con cache optimizado y manejo de errores integrado.
 * 
 * Características:
 * - Cache de larga duración para categorías (datos relativamente estáticos)
 * - Ordenamiento alfabético automático
 * - Retry automático en caso de errores de red
 * - Logging detallado para debugging
 * - Refetch controlado para optimizar rendimiento
 * 
 * @example
 * ```typescript
 * const { data: categories, isLoading, error } = useCategories();
 * 
 * if (isLoading) return <div>Cargando categorías...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <select>
 *     {categories?.map(category => (
 *       <option key={category.id} value={category.id}>
 *         {category.name}
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 * 
 * @returns {Object} Objeto con datos y estado de React Query
 * @returns {Category[]} returns.data - Array de categorías ordenadas alfabéticamente
 * @returns {boolean} returns.isLoading - Estado de carga inicial
 * @returns {boolean} returns.isFetching - Estado de fetch (incluye refetch)
 * @returns {Error | null} returns.error - Error si ocurre algún problema
 * @returns {boolean} returns.isError - Booleano indicando si hay error
 * @returns {Function} returns.refetch - Función para refrescar datos manualmente
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // Datos frescos por 10 minutos (categorías cambian poco)
    gcTime: 30 * 60 * 1000, // Cache por 30 minutos
    refetchOnWindowFocus: false, // Las categorías no cambian frecuentemente
    retry: (failureCount, error: any) => {
      // Reintentar hasta 3 veces para errores de red
      if (error?.code === 'PGRST116') return false;
      return failureCount < 3;
    },
  });
};
