
import * as React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, FilterX } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

/**
 * Función para obtener todas las categorías disponibles para filtros
 * 
 * Combina datos de dos fuentes:
 * 1. categories: Categorías tradicionales de transacciones
 * 2. expense_groups: Grupos de gastos fijos mensuales
 * 
 * Características:
 * - Elimina duplicados por ID
 * - Ordena alfabéticamente por nombre
 * - Maneja errores de Supabase
 * 
 * @returns Array de categorías únicas ordenadas alfabéticamente
 */
const fetchAllFilterCategories = async () => {
  // Obtener categorías tradicionales
  const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("id, name");
  if (categoriesError) throw new Error(categoriesError.message);

  // Obtener grupos de gastos fijos
  const { data: expenseGroupsData, error: expenseGroupsError } = await supabase.from("expense_groups").select("id, name");
  if (expenseGroupsError) throw new Error(expenseGroupsError.message);

  const categories = categoriesData || [];
  const expenseGroups = expenseGroupsData || [];

  // Combinar ambos tipos de categorías
  const allCategoryItems = [...categories, ...expenseGroups];

  // Eliminar duplicados basándose en el ID
  const uniqueCategories = allCategoryItems.reduce((acc, current) => {
    if (!acc.some(item => item.id === current.id)) {
      acc.push(current);
    }
    return acc;
  }, [] as { id: string; name: string }[]);
  
  // Ordenar alfabéticamente por nombre
  return uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Interfaz que define la estructura de filtros disponibles
 */
export type Filters = {
  /** Rango de fechas opcional para filtrar por período */
  date_range?: DateRange;
  /** Tipo de transacción: ingreso, egreso o todas */
  type: 'ingreso' | 'egreso' | 'all';
  /** ID de categoría específica o 'all' para todas */
  category_id: string;
};

/**
 * Props para el componente TransactionFilters
 */
type TransactionFiltersProps = {
  /** Filtros actuales aplicados */
  filters: Filters;
  /** Función callback que se ejecuta cuando cambian los filtros */
  onFiltersChange: (filters: Filters) => void;
};

/**
 * Componente TransactionFilters
 * 
 * Sistema de filtrado avanzado para transacciones y reportes.
 * 
 * Funcionalidades:
 * 1. **Filtro por fechas**: Selector de rango con calendario visual
 * 2. **Filtro por tipo**: Ingreso, Egreso o Todos
 * 3. **Filtro por categoría**: Todas las categorías disponibles
 * 4. **Reseteo rápido**: Botón para limpiar todos los filtros
 * 5. **Tooltips informativos**: Ayuda contextual para cada filtro
 * 
 * Características técnicas:
 * - Calendario localizado en español
 * - Carga dinámica de categorías desde Supabase
 * - Diseño responsivo (grid adaptativo)
 * - Estados de carga para mejor UX
 * - Manejo de errores graceful
 * 
 * Componentes utilizados:
 * - Popover + Calendar: Selector de fechas
 * - Select: Dropdowns para tipo y categoría
 * - Tooltip: Ayuda contextual
 * - Button: Acción de reseteo
 * 
 * Estados manejados:
 * - Carga de categorías
 * - Valores de filtros controlados
 * - Estado visual de elementos activos
 * 
 * @param filters - Objeto con filtros actuales
 * @param onFiltersChange - Callback para actualizar filtros
 */
export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  /**
   * Query para obtener todas las categorías disponibles
   * Combina categories y expense_groups para filtrado unificado
   */
  const { data: categories, isLoading: isLoadingCategories } = useQuery({ 
    queryKey: ['allFilterCategories'], 
    queryFn: fetchAllFilterCategories 
  });
  
  /**
   * Resetea todos los filtros a sus valores por defecto
   * Útil para limpiar búsquedas complejas rápidamente
   */
  const handleResetFilters = () => {
    onFiltersChange({
      date_range: undefined,
      type: 'all',
      category_id: 'all',
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center">
      {/* Grid responsivo para los filtros */}
      <div className="grid flex-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        
        {/* Filtro de Rango de Fechas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.date_range && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.date_range?.from ? (
                filters.date_range.to ? (
                  // Mostrar rango completo si hay fecha de inicio y fin
                  <>
                    {format(filters.date_range.from, "LLL dd, y", { locale: es })} -{" "}
                    {format(filters.date_range.to, "LLL dd, y", { locale: es })}
                  </>
                ) : (
                  // Mostrar solo fecha de inicio si no hay fecha de fin
                  format(filters.date_range.from, "LLL dd, y", { locale: es })
                )
              ) : (
                // Placeholder cuando no hay fechas seleccionadas
                <span>Fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {/* Calendario con soporte para rangos y localización */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.date_range?.from}
              selected={filters.date_range}
              onSelect={(range) => onFiltersChange({ ...filters, date_range: range })}
              numberOfMonths={2}  // Mostrar 2 meses para mejor UX
            />
          </PopoverContent>
        </Popover>

        {/* Filtro por Tipo de Transacción */}
        <Select
          value={filters.type}
          onValueChange={(value) => onFiltersChange({ ...filters, type: value as Filters['type'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Categoría */}
        <Select
          value={filters.category_id}
          onValueChange={(value) => onFiltersChange({ ...filters, category_id: value })}
          disabled={isLoadingCategories || !categories}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {/* Renderizar dinámicamente todas las categorías disponibles */}
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botón de Reseteo con Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleResetFilters} variant="ghost" size="icon">
              <FilterX className="h-4 w-4" />
              <span className="sr-only">Limpiar filtros</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Limpiar filtros</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
