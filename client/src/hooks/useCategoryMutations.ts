import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as z from "zod";
import { formSchema } from "@/components/CategoryForm";
import { logActivity } from "@/lib/logger";

type FormValues = z.infer<typeof formSchema>;

export const useCategoryMutations = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: Error) => {
      toast.error("Error", { description: error.message });
    },
  };

  const createMutation = useMutation<void, Error, FormValues>({
    mutationFn: async (newCategory) => {
      const { name, type } = newCategory;
      const { error } = await supabase.from("categories").insert([{ name, type }]);
      if (error) throw error;
      await logActivity({
        action: 'Crear Categoría',
        location: 'Categorías',
        details: { new_category: newCategory }
      });
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Categoría creada exitosamente");
      mutationOptions.onSuccess();
    },
  });

  const updateMutation = useMutation<void, Error, { id: string; values: FormValues }>({
    mutationFn: async ({ id, values }) => {
      const { name, type } = values;
      const { error } = await supabase
        .from("categories")
        .update({ name, type })
        .eq("id", id);
      if (error) throw error;
      await logActivity({
        action: 'Actualizar Categoría',
        location: 'Categorías',
        details: { category_id: id, updates: values }
      });
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Categoría actualizada exitosamente");
      mutationOptions.onSuccess();
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId);
      if (error) throw error;
      await logActivity({
        action: 'Eliminar Categoría',
        location: 'Categorías',
        details: { category_id: categoryId }
      });
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Categoría eliminada exitosamente");
      mutationOptions.onSuccess();
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
