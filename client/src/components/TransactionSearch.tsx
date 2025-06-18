
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props para el componente TransactionSearch
 */
interface TransactionSearchProps {
  /** Función callback que se ejecuta cuando se realiza una búsqueda */
  onSearch: (query: string) => void;
  /** Texto placeholder para el input de búsqueda */
  placeholder?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Componente de búsqueda de transacciones en tiempo real
 * 
 * Funcionalidades:
 * - Búsqueda en tiempo real mientras se escribe
 * - Botón para limpiar la búsqueda
 * - Indicador visual de foco
 * - Soporte para Enter para buscar
 * - Animaciones sutiles
 * 
 * @param onSearch - Callback que recibe el término de búsqueda
 * @param placeholder - Texto de ayuda en el input
 * @param className - Clases CSS adicionales
 */
export const TransactionSearch = ({ 
  onSearch, 
  placeholder = "Buscar por descripción...",
  className 
}: TransactionSearchProps) => {
  // Estado local para el valor del input de búsqueda
  const [query, setQuery] = useState('');
  // Estado para controlar el estilo visual cuando el input tiene foco
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Maneja la búsqueda manual (al hacer clic en el botón de búsqueda)
   */
  const handleSearch = () => {
    onSearch(query);
  };

  /**
   * Limpia el campo de búsqueda y ejecuta búsqueda vacía
   */
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  /**
   * Maneja el evento de presionar Enter para buscar
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Maneja cambios en el input y ejecuta búsqueda en tiempo real
   * Cada vez que el usuario escribe, automáticamente filtra los resultados
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Búsqueda en tiempo real - filtra resultados inmediatamente
    onSearch(newQuery);
  };

  return (
    <div className={cn("flex gap-2 animate-fade-in", className)}>
      <div className="relative flex-1">
        {/* Icono de búsqueda dentro del input */}
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200",
          isFocused ? "text-primary" : "text-muted-foreground"
        )} />
        
        {/* Input principal de búsqueda */}
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isFocused && "border-primary/50 shadow-sm scale-[1.02]",
            "hover:border-primary/30"
          )}
        />
        
        {/* Botón para limpiar búsqueda (solo aparece cuando hay texto) */}
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover-scale transition-all duration-200"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Botón de búsqueda manual (opcional, ya que la búsqueda es en tiempo real) */}
      <Button 
        onClick={handleSearch} 
        variant="outline" 
        size="icon"
        className="hover-scale transition-all duration-200"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};
