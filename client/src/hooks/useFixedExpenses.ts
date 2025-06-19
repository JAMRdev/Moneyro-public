import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FixedMonthlyExpense } from '@/types';
import { format, startOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { logActivity } from '@/lib/logger';
import { useAuth } from './useAuth';

const fetchExpenses = async (month: Date): Promise<FixedMonthlyExpense[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Usuario no autenticado");

  const monthStart = format(startOfMonth(month), 'yyyy-MM-01');

  const { data, error } = await supabase
    .from('fixed_monthly_expenses')
    .select(`
      *,
      expense_groups (
        id,
        name
      )
    `)
    .eq('month', monthStart)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching fixed expenses:", error);
    throw new Error(error.message);
  }
  return (data || []) as FixedMonthlyExpense[];
};

export const useFixedExpenses = (currentMonth: Date) => {
    const queryClient = useQueryClient();
    const { session, loading } = useAuth();
    const monthKey = format(currentMonth, 'yyyy-MM');

    useEffect(() => {
        const channelName = `realtime-fixed-expenses-${Math.random()}`;
        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'fixed_monthly_expenses' },
            () => {
              queryClient.invalidateQueries({ queryKey: ['fixedMonthlyExpenses'] });
            }
          )
          .subscribe();
    
        return () => {
          supabase.removeChannel(channel);
        };
      }, [queryClient]);

    const { data: expenses = [], isLoading, error } = useQuery({
        queryKey: ['fixedMonthlyExpenses', monthKey],
        queryFn: () => fetchExpenses(currentMonth),
        enabled: !!session && !loading,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnMount: true,
    });

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fixedMonthlyExpenses', monthKey] });
        },
    };

    const updateExpenseMutation = useMutation({
        mutationFn: async ({ id, ...updatedField }: Partial<FixedMonthlyExpense> & {id: string}) => {
            const { error } = await supabase
                .from('fixed_monthly_expenses')
                .update(updatedField)
                .eq('id', id);
            if (error) throw error;
            logActivity({
                action: 'Actualizar Gasto Fijo',
                location: 'Tabla de Gastos Fijos',
                details: { expense_id: id, updates: updatedField }
            });
        },
        ...mutationOptions,
        onError: (error) => {
            toast.error("Error al actualizar el gasto", { description: error.message });
        },
    });

    const { mutate: addExpense } = useMutation({
        mutationFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-01');
            
            const { data, error } = await supabase
                .from('fixed_monthly_expenses')
                .insert([{ 
                    user_id: session.user.id, 
                    month: monthStart, 
                    name: 'Nuevo Gasto', 
                    amount: 0,
                    paid: false
                }])
                .select();

            if (error) throw error;
            
            if(data?.[0]) {
                logActivity({
                    action: 'Crear Gasto Fijo',
                    location: 'Tabla de Gastos Fijos',
                    details: { new_expense: data[0] }
                });
            }

            return data;
        },
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast.success("Nuevo gasto añadido");
        },
        onError: (error) => {
            toast.error("Error al añadir gasto", { description: error.message });
        }
    });

    const { mutate: deleteExpense } = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('fixed_monthly_expenses').delete().eq('id', id);
            if (error) throw error;
            logActivity({
                action: 'Eliminar Gasto Fijo',
                location: 'Tabla de Gastos Fijos',
                details: { expense_id: id }
            });
        },
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast.success("Gasto eliminado");
        },
        onError: (error) => {
            toast.error("Error al eliminar gasto", { description: error.message });
        }
    });

    const { mutate: duplicateMonth, isPending: isDuplicating } = useMutation({
        mutationFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No autenticado");
            
            const currentMonthExpenses = await fetchExpenses(currentMonth);
            const nextMonth = addMonths(currentMonth, 1);
            const nextMonthStart = format(startOfMonth(nextMonth), 'yyyy-MM-01');

            if(currentMonthExpenses.length === 0) {
                toast.info("No hay gastos para duplicar en el mes actual.");
                return { nextMonth: null, duplicated: false };
            }

            const newExpenses = currentMonthExpenses.map((exp) => ({
                user_id: exp.user_id,
                month: nextMonthStart,
                paid: false,
                name: exp.name,
                amount: exp.amount,
                due_date: exp.due_date,
                notes: exp.notes,
                payment_source: exp.payment_source,
                expense_group_id: exp.expense_group_id
            }));

            const { error } = await supabase.from('fixed_monthly_expenses').insert(newExpenses);
            if (error) throw error;
            
            logActivity({
                action: 'Duplicar Mes',
                location: 'Tabla de Gastos Fijos',
                details: { 
                    from_month: format(currentMonth, 'yyyy-MM'),
                    to_month: format(nextMonth, 'yyyy-MM'),
                    expense_count: newExpenses.length
                }
            });

            return { nextMonth, duplicated: true };
        },
        onSuccess: ({ nextMonth, duplicated }) => {
            if(nextMonth && duplicated){
                queryClient.invalidateQueries({ queryKey: ['fixedMonthlyExpenses'] });
                toast.success(`Gastos de ${format(subMonths(nextMonth, 1), 'MMMM', {locale: es})} duplicados a ${format(nextMonth, 'MMMM', {locale: es})}.`);
            }
        },
        onError: (error) => {
            toast.error("Error al duplicar el mes", { description: error.message });
        }
    });

    return { expenses, isLoading, error, updateExpenseMutation, addExpense, deleteExpense, duplicateMonth, isDuplicating };
}
