
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseGroup } from '@/types';
import { toast } from 'sonner';
import { useEffect } from 'react';

const fetchExpenseGroups = async (): Promise<ExpenseGroup[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Usuario no autenticado");

  const { data, error } = await supabase
    .from('expense_groups')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    toast.error("Error al cargar los grupos de gastos", { description: error.message });
    throw error;
  }
  return data;
};

export const useExpenseGroups = () => {
    const queryClient = useQueryClient();

    const { data: groups = [], refetch, isLoading } = useQuery({
        queryKey: ['expenseGroups'],
        queryFn: fetchExpenseGroups,
    });

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseGroups'] });
        },
    };

    const { mutate: addGroup } = useMutation({
        mutationFn: async (name: string) => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No autenticado");
            const { error } = await supabase.from('expense_groups').insert({ name, user_id: session.user.id });
            if (error) throw error;
        },
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast.success("Grupo añadido");
        },
        onError: (error) => toast.error("Error al añadir grupo", { description: error.message })
    });

    const { mutate: updateGroup } = useMutation({
        mutationFn: async (group: {id: string, name: string}) => {
            const { error } = await supabase.from('expense_groups').update({ name: group.name }).eq('id', group.id);
            if (error) throw error;
        },
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast.success("Grupo actualizado");
        },
        onError: (error) => toast.error("Error al actualizar grupo", { description: error.message })
    });

    const { mutate: deleteGroup } = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('expense_groups').delete().eq('id', id);
            if (error) throw error;
        },
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast.success("Grupo eliminado");
        },
        onError: (error) => toast.error("Error al eliminar grupo", { description: error.message })
    });
    
    const seedInitialGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { count } = await supabase.from('expense_groups').select('*', { count: 'exact', head: true });

      if (count === 0) {
        const initialGroups = [
            { name: 'Vivienda', user_id: user.id },
            { name: 'Tarjetas de crédito', user_id: user.id },
            { name: 'Préstamos', user_id: user.id },
            { name: 'Gastos personales fijos', user_id: user.id },
            { name: 'Auto', user_id: user.id },
            { name: 'Mascotas', user_id: user.id },
            { name: 'Alimentación fija', user_id: user.id },
        ];
        await supabase.from('expense_groups').insert(initialGroups);
        refetch();
      }
    };

    useEffect(() => {
        seedInitialGroups();
    }, []);


    return { groups, isLoading, addGroup, updateGroup, deleteGroup };
}
