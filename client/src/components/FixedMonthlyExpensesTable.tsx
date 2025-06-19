
import { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFixedExpenses } from '@/hooks/useFixedExpenses';
import { useExpenseGroups } from '@/hooks/useExpenseGroups';
import { ExpensesTableActions } from './expenses/ExpensesTableActions';
import { FixedExpensesProvider } from '@/contexts/FixedExpensesContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ExpensesTableFilters, FixedExpensesFiltersState } from './expenses/ExpensesTableFilters';
import { useFilteredAndSortedExpenses } from '@/hooks/useFilteredAndSortedExpenses';
import usePersistentState from '@/hooks/usePersistentState';
import { useSort } from '@/hooks/useSort';
import { useExpenseCalculations } from '@/hooks/useExpenseCalculations';
import { ExpensesTableContent } from './expenses/ExpensesTableContent';

/**
 * Props para el componente FixedMonthlyExpensesTable
 */
interface FixedMonthlyExpensesTableProps {
  /** Mes actual seleccionado para mostrar gastos */
  currentMonth: Date;
  /** Función para cambiar el mes seleccionado */
  setMonthString: (monthString: string) => void;
}

/**
 * Componente FixedMonthlyExpensesTable
 * 
 * Tabla principal para gestionar gastos fijos mensuales del usuario.
 * 
 * Funcionalidades principales:
 * 1. **Navegación mensual**: Cambiar entre diferentes meses
 * 2. **Gestión de gastos**: Crear, editar, eliminar gastos fijos
 * 3. **Sistema de bloqueo**: Proteger gastos ya pagados/finalizados
 * 4. **Filtrado avanzado**: Por grupo, estado de pago, fuente de pago
 * 5. **Ordenamiento**: Por cualquier columna (monto, fecha, nombre, etc.)
 * 6. **Duplicación mensual**: Copiar gastos de un mes a otro
 * 7. **Cálculos automáticos**: Totales y pendientes de pago
 * 8. **Estados de carga**: Skeletons durante las operaciones
 * 
 * Características técnicas:
 * - Estado persistente para filtros (localStorage)
 * - Context API para compartir estado entre componentes
 * - Hooks personalizados para lógica compleja
 * - Componentes modulares para mejor mantenimiento
 * - Responsive design para mobile y desktop
 * 
 * Arquitectura de componentes:
 * - ExpensesTableActions: Navegación y acciones globales
 * - ExpensesTableFilters: Sistema de filtrado
 * - ExpensesTableContent: Tabla principal con datos
 * - FixedExpensesProvider: Context para compartir estado
 * 
 * Estados manejados:
 * - isLocked: Controla si se pueden editar los gastos
 * - filters: Filtros aplicados (grupo, estado pago, fuente)
 * - sortConfig: Configuración de ordenamiento actual
 * 
 * @param currentMonth - Mes para el cual mostrar los gastos
 * @param setMonthString - Callback para cambiar el mes seleccionado
 */
export default function FixedMonthlyExpensesTable({ currentMonth, setMonthString }: FixedMonthlyExpensesTableProps) {
  // Estado de bloqueo - cuando está true, no se pueden editar gastos
  const [isLocked, setIsLocked] = useState(true);
  
  /**
   * Estado persistente para filtros de gastos fijos
   * Se mantiene en localStorage para mejorar UX
   */
  const [filters, setFilters] = usePersistentState<FixedExpensesFiltersState>('fixedExpensesFilters', {
    groupId: 'all',        // ID del grupo de gastos o 'all'
    paidStatus: 'all',     // Estado de pago: 'all', 'paid', 'unpaid'
    paymentSource: '',     // Fuente de pago (texto libre)
  });

  // Hook para manejar ordenamiento de columnas
  const { sortConfig, requestSort } = useSort(null);

  /**
   * Hook principal para gestión de gastos fijos
   * Proporciona: datos, mutaciones, estados de carga
   */
  const { expenses, isLoading, updateExpenseMutation, addExpense, deleteExpense, duplicateMonth, isDuplicating } = useFixedExpenses(currentMonth);
  
  // Hook para obtener grupos de gastos (categorías)
  const { groups: expenseGroups } = useExpenseGroups();

  // Hook que aplica filtros y ordenamiento a los gastos
  const filteredAndSortedExpenses = useFilteredAndSortedExpenses(expenses, filters, sortConfig);
  
  // Hook para cálculos financieros (totales, pendientes)
  const { totalAmount, unpaidAmount, unpaidAmountColor } = useExpenseCalculations(filteredAndSortedExpenses);
  
  /**
   * Maneja la navegación entre meses
   * Actualiza el estado del componente padre
   * 
   * @param direction - 'next' para mes siguiente, 'prev' para anterior
   */
  const handleMonthChange = (direction: 'next' | 'prev') => {
    const newMonth = direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1);
    setMonthString(newMonth.toISOString());
  };

  /**
   * Maneja la duplicación de gastos del mes anterior
   * Cambia automáticamente al mes siguiente después de duplicar
   */
  const handleDuplicateMonth = () => {
    duplicateMonth(undefined, {
      onSuccess: (data) => {
        if (data && data.nextMonth) {
          setMonthString(data.nextMonth.toISOString());
        }
      }
    });
  };

  /**
   * Valor del contexto que se comparte con componentes hijos
   * Incluye mutaciones, estado de bloqueo y utilidades
   */
  const contextValue = {
    updateExpenseMutation,
    deleteExpense,
    isLocked,
  };

  // Estado de carga - mostrar skeletons
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
            <div className="space-y-1.5">
                <CardTitle>Listado de gastos</CardTitle>
            </div>
        </CardHeader>
        
        {/* Skeleton para los filtros */}
        <div className="px-6 pb-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        
        <CardContent>
          {/* Skeletons para las filas de la tabla */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg md:h-12" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizado principal con Context Provider
  return (
    <FixedExpensesProvider value={contextValue}>
      <Card>
        <CardHeader>
            <div className="space-y-1.5">
                <CardTitle>Listado de gastos</CardTitle>
            </div>
        </CardHeader>

        {/* Acciones de la tabla (navegación, duplicar, bloquear) */}
        <ExpensesTableActions 
            currentMonth={currentMonth}
            handleMonthChange={handleMonthChange}
            duplicateMonth={handleDuplicateMonth}
            isDuplicating={isDuplicating}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
        />

        {/* Sistema de filtros */}
        <ExpensesTableFilters 
            filters={filters}
            onFiltersChange={setFilters}
            expenseGroups={expenseGroups}
        />

        <CardContent>
          {/* Estado vacío - sin gastos para el mes */}
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center text-muted-foreground">
              <p>No hay gastos para este mes.</p>
              <Button onClick={() => addExpense()} disabled={isLocked}>
                Añadir el primero
              </Button>
            </div>
          ) : (
            /* Tabla principal con datos */
            <ExpensesTableContent
                expenses={filteredAndSortedExpenses}
                expenseGroups={expenseGroups}
                addExpense={addExpense}
                isLocked={isLocked}
                totalAmount={totalAmount}
                unpaidAmount={unpaidAmount}
                unpaidAmountColor={unpaidAmountColor}

                sortConfig={sortConfig}
                requestSort={requestSort}
              />
          )}
        </CardContent>
      </Card>
    </FixedExpensesProvider>
  );
}
