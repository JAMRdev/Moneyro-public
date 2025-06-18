
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { Category } from "@/types";
import { useEffect } from "react";

/**
 * Schema de validación para el formulario de categorías
 * Define las reglas de validación usando Zod
 */
export const formSchema = z.object({
  // Nombre de la categoría - mínimo 2 caracteres
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  // Tipo de categoría - solo acepta "ingreso" o "egreso"
  type: z.enum(["ingreso", "egreso"], {
    required_error: "Debes seleccionar un tipo.",
  }),
});

/**
 * Props para el componente CategoryForm
 */
type CategoryFormProps = {
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  /** Valores por defecto para edición de categorías */
  defaultValues?: Partial<Omit<Category, "id">>;
  /** Indica si el formulario está enviándose */
  isSubmitting?: boolean;
};

/**
 * Componente CategoryForm
 * 
 * Formulario para crear y editar categorías de transacciones.
 * 
 * Características:
 * - Validación en tiempo real con Zod y React Hook Form
 * - Soporte para crear nuevas categorías o editar existentes
 * - Campos: nombre y tipo (ingreso/egreso)
 * - Reseteo automático del formulario
 * - Estados de carga durante el envío
 * - Mensajes de error integrados
 * 
 * Validaciones implementadas:
 * - Nombre: mínimo 2 caracteres, requerido
 * - Tipo: debe ser "ingreso" o "egreso", requerido
 * 
 * @param onSubmit - Callback que recibe los datos validados del formulario
 * @param defaultValues - Valores iniciales para modo edición
 * @param isSubmitting - Estado de carga para deshabilitar el botón
 */
const CategoryForm = ({ onSubmit, defaultValues, isSubmitting }: CategoryFormProps) => {
  /**
   * Configuración del formulario con React Hook Form
   * - Usa zodResolver para integrar validación con Zod
   * - Establece valores por defecto
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      type: defaultValues?.type || undefined,
    },
  });

  /**
   * Efecto para resetear el formulario cuando cambian los valores por defecto
   * Útil para alternar entre modo crear/editar
   */
  useEffect(() => {
    if (defaultValues) {
      // Modo edición - llenar con valores existentes
      form.reset({
        name: defaultValues.name || "",
        type: defaultValues.type || undefined,
      });
    } else {
      // Modo creación - limpiar formulario
      form.reset({
        name: "",
        type: undefined,
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Campo de Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Supermercado" {...field} />
              </FormControl>
              {/* Mensaje de error automático */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Tipo */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="egreso">Egreso</SelectItem>
                </SelectContent>
              </Select>
              {/* Mensaje de error automático */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío con estado de carga */}
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Categoría"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
