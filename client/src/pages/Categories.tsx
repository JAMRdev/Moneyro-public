
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CategoryForm, { formSchema } from "@/components/CategoryForm";
import * as z from "zod";
import { useCategoryMutations } from "@/hooks/useCategoryMutations";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Función para obtener todas las categorías desde Supabase
 * Realiza una consulta simple a la tabla categories
 * 
 * @returns Promise<Category[]> - Array de categorías
 * @throws Error si hay problemas con la consulta
 */
const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw new Error(error.message);
  return data;
};

/**
 * Página de Gestión de Categorías
 * 
 * Permite administrar todas las categorías de transacciones del usuario.
 * 
 * Funcionalidades principales:
 * 1. **Listado de categorías**: Tabla con todas las categorías existentes
 * 2. **Crear categorías**: Modal con formulario para nuevas categorías
 * 3. **Editar categorías**: Modificar categorías existentes
 * 4. **Eliminar categorías**: Con confirmación de seguridad
 * 5. **Indicadores visuales**: Badges de color según el tipo
 * 6. **Estados de carga**: Feedback durante operaciones
 * 
 * Características técnicas:
 * - React Query para gestión de estado servidor
 * - Hook personalizado para mutaciones CRUD
 * - Formulario reutilizable con validación
 * - Confirmación de eliminación con AlertDialog
 * - Diseño responsivo con tabla adaptativa
 * 
 * Componentes utilizados:
 * - CategoryForm: Formulario reutilizable
 * - Dialog: Modal para crear/editar
 * - AlertDialog: Confirmación de eliminación
 * - Table: Listado de categorías
 * - Card: Contenedor principal
 * 
 * Estados manejados:
 * - isFormOpen: Controla visibilidad del modal
 * - selectedCategory: Categoría en edición (null para crear)
 * - Loading states: Durante operaciones CRUD
 * 
 * Flujo de trabajo:
 * 1. Cargar categorías existentes
 * 2. Mostrar en tabla con acciones
 * 3. Permitir crear/editar via modal
 * 4. Confirmar eliminaciones
 * 5. Actualizar lista automáticamente
 */
const Categories = () => {
  // Estado para controlar la visibilidad del modal de formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Estado para la categoría seleccionada (null = crear nueva)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  /**
   * Query para obtener todas las categorías
   * Se actualiza automáticamente cuando hay cambios
   */
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  /**
   * Hook personalizado que proporciona mutaciones para CRUD de categorías
   * Incluye callbacks de éxito para cerrar modales y limpiar estado
   */
  const { createMutation, updateMutation, deleteMutation } = useCategoryMutations(() => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  });

  /**
   * Maneja el envío del formulario tanto para crear como para editar
   * Determina la acción basándose en si hay una categoría seleccionada
   * 
   * @param values - Datos validados del formulario
   */
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedCategory) {
      // Modo edición - actualizar categoría existente
      updateMutation.mutate({ id: selectedCategory.id, values });
    } else {
      // Modo creación - crear nueva categoría
      createMutation.mutate(values);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header de la página con botón de acción principal */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorías</h1>
        
        {/* Modal para crear nueva categoría */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCategory(null)}>Añadir Categoría</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCategory ? "Editar" : "Añadir"} Categoría</DialogTitle>
              <DialogDescription>
                {selectedCategory ? "Modifica los detalles de tu categoría." : "Crea una nueva categoría para tus transacciones."}
              </DialogDescription>
            </DialogHeader>
            {/* Formulario reutilizable con estado de loading */}
            <CategoryForm
              onSubmit={handleFormSubmit}
              defaultValues={selectedCategory || undefined}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla principal de categorías */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Estado de carga */}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Cargando categorías...
                  </TableCell>
                </TableRow>
              ) : categories?.length === 0 ? (
                /* Estado vacío - sin categorías */
                 <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No has creado ninguna categoría todavía.
                  </TableCell>
                </TableRow>
              ) : (
                /* Renderizar filas de categorías */
                categories?.map((category) => (
                  <TableRow key={category.id}>
                    {/* Nombre de la categoría */}
                    <TableCell>{category.name}</TableCell>
                    
                    {/* Badge con color según el tipo */}
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.type === 'ingreso' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {category.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                      </span>
                    </TableCell>
                    
                    {/* Acciones: Editar y Eliminar */}
                    <TableCell className="text-right">
                      {/* Botón de editar */}
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSelectedCategory(category);
                        setIsFormOpen(true);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      {/* Botón de eliminar con confirmación */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(category.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
