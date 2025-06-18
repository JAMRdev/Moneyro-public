
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Budget } from "@/types/budget";
import { toast } from "sonner";

const fetchBudgets = async (): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from("budgets")
    .select("*, categories(id, name, type)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error('Error fetching budgets:', error);
    throw new Error(error.message);
  }

  return data || [];
};

const createBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'categories'>) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      ...budget,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating budget:', error);
    throw new Error(error.message);
  }

  return data;
};

const updateBudget = async ({ id, ...updates }: Partial<Budget> & { id: string }) => {
  const { data, error } = await supabase
    .from("budgets")
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating budget:', error);
    throw new Error(error.message);
  }

  return data;
};

const deleteBudget = async (id: string) => {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting budget:', error);
    throw new Error(error.message);
  }
};

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    retry: (failureCount, error: any) => {
      console.error('Budget query error:', error);
      // No reintentar si es un error de autenticación
      if (error?.code === 'PGRST301') return false;
      return failureCount < 2;
    },
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Presupuesto creado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Create budget error:', error);
      toast.error('Error al crear presupuesto', { description: error.message });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Presupuesto actualizado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Update budget error:', error);
      toast.error('Error al actualizar presupuesto', { description: error.message });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Presupuesto eliminado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Delete budget error:', error);
      toast.error('Error al eliminar presupuesto', { description: error.message });
    },
  });
};
