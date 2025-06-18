
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCreateBudget, useUpdateBudget } from "@/hooks/useBudgets";
import { Budget } from "@/types/budget";

interface BudgetFormProps {
  budget?: Budget;
  onSuccess?: () => void;
}

export const BudgetForm = ({ budget, onSuccess }: BudgetFormProps) => {
  const [name, setName] = useState(budget?.name || "");
  const [amount, setAmount] = useState(budget?.amount?.toString() || "");
  const [categoryId, setCategoryId] = useState<string>(budget?.category_id || "none");
  const [period, setPeriod] = useState(budget?.period || "monthly");
  const [startDate, setStartDate] = useState(budget?.start_date || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(budget?.end_date || "");

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      return data || [];
    },
    retry: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    const budgetData = {
      name: name.trim(),
      amount: parseFloat(amount) || 0,
      category_id: categoryId === "none" ? null : categoryId,
      period,
      start_date: startDate,
      end_date: endDate || null,
      is_active: true,
    };

    if (budget) {
      updateBudget.mutate({ id: budget.id, ...budgetData }, {
        onSuccess: () => onSuccess?.(),
      });
    } else {
      createBudget.mutate(budgetData, {
        onSuccess: () => {
          // Limpiar formulario
          setName("");
          setAmount("");
          setCategoryId("none");
          setPeriod("monthly");
          setStartDate(new Date().toISOString().split('T')[0]);
          setEndDate("");
          onSuccess?.();
        },
      });
    }
  };

  const isLoading = createBudget.isPending || updateBudget.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Presupuesto</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Gastos de Casa"
          required
        />
      </div>

      <div>
        <Label htmlFor="amount">Monto</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoría (Opcional)</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder={categoriesLoading ? "Cargando..." : "Seleccionar categoría"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin categoría</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="period">Período</Label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="startDate">Fecha de Inicio</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="endDate">Fecha de Fin (Opcional)</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Guardando...' : budget ? 'Actualizar Presupuesto' : 'Crear Presupuesto'}
      </Button>
    </form>
  );
};
