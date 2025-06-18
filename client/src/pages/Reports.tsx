
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TransactionFilters, Filters } from "@/components/TransactionFilters";
import { useTransactions } from "@/hooks/useTransactions";
import usePersistentState from "@/hooks/usePersistentState";
import { useFixedExpensesForReport } from "@/hooks/useFixedExpensesForReport";
import { Transaction } from "@/types";
import { useRef, useMemo } from "react";
import { ReportActions } from "@/components/reports/ReportActions";
import { ReportContent } from "@/components/reports/ReportContent";

/**
 * Página de Reportes
 * 
 * Esta página permite generar reportes detallados de las finanzas del usuario.
 * 
 * Funcionalidades principales:
 * 1. Filtrado avanzado de transacciones (fecha, tipo, categoría)
 * 2. Combinación de transacciones regulares y gastos fijos
 * 3. Visualización de datos con gráficos y tablas
 * 4. Proyecciones financieras
 * 5. Exportación de reportes (PDF, impresión)
 * 6. Persistencia de filtros y proyecciones
 * 
 * Fuentes de datos:
 * - Transacciones regulares (tabla transactions)
 * - Gastos fijos mensuales (tabla fixed_monthly_expenses)
 * 
 * Estados persistentes:
 * - Filtros de reportes (se guardan en localStorage)
 * - Proyecciones financieras (se guardan en localStorage)
 * 
 * Características técnicas:
 * - Ignoramos el filtro de mes del dashboard (ignoreDashboardMonth: true)
 * - Los gastos fijos se mapean a formato Transaction para unificar datos
 * - Ordenamiento por fecha descendente
 * - Filtrado inteligente por tipo de transacción
 */
const Reports = () => {
  /**
   * Estado persistente para los filtros del reporte
   * Se guarda en localStorage con clave 'reports_filters'
   */
  const [filters, setFilters] = usePersistentState<Filters>(
    'reports_filters',
    {
      date_range: undefined,  // Rango de fechas (opcional)
      type: 'all',           // Tipo: 'all', 'ingreso', 'egreso'
      category_id: 'all',    // Categoría específica o 'all'
    }
  );
  
  /**
   * Estado persistente para proyecciones financieras
   * Se guarda en localStorage con clave 'reports_projections'
   * Estructura: { [categoryId: string]: { income: number, expense: number } }
   */
  const [projections, setProjections] = usePersistentState<Record<string, { income: number, expense: number }>>(
    'reports_projections',
    {}
  );

  // Referencia para el contenido del reporte (usado para exportar)
  const reportContentRef = useRef<HTMLDivElement>(null);

  /**
   * Hook para obtener transacciones regulares con filtros aplicados
   * ignoreDashboardMonth: true - No aplica el filtro de mes del dashboard
   */
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactions(filters, { ignoreDashboardMonth: true });

  /**
   * Hook para obtener gastos fijos que coincidan con los filtros
   * Solo se obtienen si el tipo no es específicamente 'ingreso'
   */
  const { data: fixedExpenses, isLoading: isLoadingFixed } = useFixedExpensesForReport({ 
    date_range: filters.date_range,
    category_id: filters.category_id,
  });

  // Estado de carga general
  const isLoading = isLoadingTransactions || isLoadingFixed;

  /**
   * Combina transacciones regulares y gastos fijos en un solo array
   * Los gastos fijos se mapean al formato Transaction para consistencia
   */
  const combinedData = useMemo(() => {
    /**
     * Mapea gastos fijos al formato Transaction
     * Características del mapeo:
     * - ID único con prefijo 'fme-' (Fixed Monthly Expense)
     * - Descripción prefijada con '(Gasto Fijo)'
     * - Tipo siempre 'egreso'
     * - Categoría mapeada desde expense_groups
     * - Fecha del mes del gasto fijo
     */
    const mappedFixedExpenses: Transaction[] = (fixedExpenses ?? []).map(fme => ({
        id: `fme-${fme.id}`,
        transaction_date: fme.month,
        description: `(Gasto Fijo) ${fme.name}`,
        amount: fme.amount,
        type: 'egreso',
        categories: fme.expense_groups
            ? { id: fme.expense_groups.id, name: fme.expense_groups.name }
            : { id: 'sin_grupo', name: 'Sin Grupo' },
        category_id: fme.expense_group_id ?? undefined,
    }));

    const allTransactions = transactions ?? [];

    // Si el filtro es solo ingresos, no incluir gastos fijos
    if (filters.type === 'ingreso') {
        return allTransactions;
    }

    // Combinar y ordenar por fecha (más recientes primero)
    return [...allTransactions, ...mappedFixedExpenses]
        .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
  }, [transactions, fixedExpenses, filters.type]);

  return (
    <div className="space-y-4 pt-4 md:space-y-8 md:pt-8">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Reportes</CardTitle>
          <CardDescription>
            Aquí podrás generar reportes detallados de tus finanzas. Filtra tus transacciones y visualiza los resultados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Componente de filtros con estado controlado */}
            <TransactionFilters filters={filters} onFiltersChange={setFilters} />
            
            {/* Contenido principal del reporte */}
            <ReportContent
              isLoading={isLoading}
              combinedData={combinedData}
              projections={projections}
              onProjectionsChange={setProjections}
              reportContentRef={reportContentRef}
            />
          </div>

          {/* Acciones del reporte (exportar, imprimir) - solo si hay datos */}
          {!isLoading && combinedData && combinedData.length > 0 && (
            <ReportActions 
              combinedData={combinedData}
              reportContentRef={reportContentRef}
            />
          )}

          {/* Nota sobre funcionalidades futuras */}
          <p className="text-muted-foreground mt-4 text-sm">
            Próximamente: exportación a Excel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
