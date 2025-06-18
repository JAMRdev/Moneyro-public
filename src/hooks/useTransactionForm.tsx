
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const transactionSchema = z.object({
  type: z.enum(["ingreso", "egreso", "ahorro"], {
    required_error: "Debes seleccionar un tipo.",
  }),
  amount: z.coerce.number().positive({ message: "El monto debe ser positivo." }),
  category_id: z.string({ required_error: "Debes seleccionar una categoría." }).uuid(),
  transaction_date: z.date({ required_error: "La fecha es requerida." }),
  description: z.string().optional(),
});

type NewTransactionPayload = {
  amount: number;
  category_id: string;
  description: string | null;
  transaction_date: string;
  type: 'ingreso' | 'egreso' | 'ahorro';
};

export const useTransactionForm = (
  onSuccess?: () => void, 
  transactionToEdit?: Transaction | null
) => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
  });

  React.useEffect(() => {
    if (transactionToEdit) {
      const date = new Date(transactionToEdit.transaction_date);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const dateInUserTimezone = new Date(date.valueOf() + userTimezoneOffset);

      form.reset({
        type: transactionToEdit.type,
        amount: transactionToEdit.amount,
        category_id: transactionToEdit.categories?.id || "",
        transaction_date: dateInUserTimezone,
        description: transactionToEdit.description || "",
      });
    } else {
      form.reset({
        type: "egreso",
        amount: 0,
        transaction_date: new Date(),
        description: "",
        category_id: "",
      });
    }
  }, [transactionToEdit, form]);

  const mutation = useMutation({
    mutationFn: async (transactionData: NewTransactionPayload) => {
      if (transactionToEdit) {
        const { data, error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transactionToEdit.id)
          .select('*, categories(id, name)')
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado para realizar esta acción.");

        const { data, error } = await supabase
          .from('transactions')
          .insert([{ ...transactionData, user_id: user.id }])
          .select('*, user_id, categories(id, name)')
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (newOrUpdatedTransaction) => {
      toast.success(transactionToEdit ? "Transacción actualizada" : "Transacción guardada con éxito");
      queryClient.invalidateQueries({ queryKey: ['transactions']});
      queryClient.invalidateQueries({ queryKey: ['transaction-descriptions']});

      if (!transactionToEdit && newOrUpdatedTransaction && profile && newOrUpdatedTransaction.categories) {
        supabase.functions.invoke('send-push-notification', {
          body: {
            user_id: newOrUpdatedTransaction.user_id,
            amount: newOrUpdatedTransaction.amount,
            category_name: newOrUpdatedTransaction.categories.name,
            user_avatar_url: profile.avatar_url,
            user_name: profile.username,
          }
        }).catch(console.error);
      }

      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(transactionToEdit ? "Error al actualizar" : "Error al guardar la transacción", {
        description: error.message,
      });
    }
  });

  const onSubmit = (values: z.infer<typeof transactionSchema>) => {
    const payload: NewTransactionPayload = {
      type: values.type,
      amount: values.amount,
      category_id: values.category_id,
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
      description: values.description || null,
    };
    mutation.mutate(payload);
  };

  return {
    form,
    mutation,
    onSubmit: form.handleSubmit(onSubmit),
    transactionSchema
  };
};
