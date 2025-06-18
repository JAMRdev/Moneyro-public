
import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { useDescriptionAutoComplete } from "@/hooks/useDescriptionAutoComplete";

const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("id, name, type");
  if (error) throw new Error(error.message);
  return data as Category[];
};

interface TransactionFormFieldsProps {
  form: UseFormReturn<any>;
}

export const TransactionFormFields = ({ form }: TransactionFormFieldsProps) => {
  const { suggestions } = useDescriptionAutoComplete();
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const transactionType = form.watch("type");

  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    return categories.filter((c) => c.type === transactionType);
  }, [categories, transactionType]);

  React.useEffect(() => {
    if(!form.formState.isSubmitted) {
      form.resetField("category_id", { defaultValue: '' });
    }
  }, [transactionType, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="egreso">Egreso</SelectItem>
                  <SelectItem value="ahorro">Ahorro</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monto</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value} 
              disabled={isLoadingCategories}
            >
              <FormControl>
                <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="transaction_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Fecha de la transacción</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal transition-all duration-200 hover:border-primary/50",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: es })
                    ) : (
                      <span>Elige una fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 animate-scale-in" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción (Opcional)</FormLabel>
            <FormControl>
              <AutocompleteInput
                suggestions={suggestions}
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Ej: Compra semanal en el supermercado"
                className="transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
