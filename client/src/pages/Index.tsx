
import { Transaction } from "@/types";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { TransactionFiltersState } from "@/hooks/useTransactions";
import { useFixedExpenses } from "@/hooks/useFixedExpenses";
import { useTransactionSearch } from "@/hooks/useTransactionSearch";
import { useOptimizedTransactions } from "@/hooks/useOptimizedTransactions";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { DashboardFixedExpenses } from "@/components/dashboard/DashboardFixedExpenses";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardTransactions } from "@/components/dashboard/DashboardTransactions";
import usePersistentState from "@/hooks/usePersistentState";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const Index = () => {
  const [filters, setFilters] = usePersistentState<TransactionFiltersState>('transactionFilters', {
    type: 'all',
    category_id: 'all',
  });
  const [chartOpen, setChartOpen] = usePersistentState('chartOpen', true);
  const [fixedExpensesOpen, setFixedExpensesOpen] = usePersistentState('fixedExpensesOpen', true);
  const [transactionListOpen, setTransactionListOpen] = usePersistentState('transactionListOpen', true);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthString, setMonthString] = usePersistentState('dashboardMonth', new Date().toISOString());
  const currentMonth = new Date(monthString);

  // Estados de error para mejor debugging
  const [dataError, setDataError] = useState<string | null>(null);

  // Usar las queries optimizadas con mejor manejo de errores
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useOptimizedTransactions(filters);
  
  const { 
    expenses: fixedExpenses, 
    isLoading: isLoadingFixedExpenses
  } = useFixedExpenses(currentMonth);
  
  // Hook para manejo offline
  const { isOnline, pendingActions } = useOfflineSync();

  const isLoading = isLoadingTransactions || isLoadingFixedExpenses;
  const hasError = transactionsError;

  // Log de errores para debugging
  useEffect(() => {
    if (transactionsError) {
      console.error("❌ Error cargando transacciones:", transactionsError);
      setDataError("Error cargando transacciones");
    } else {
      setDataError(null);
    }
  }, [transactionsError]);

  // Log de carga exitosa
  useEffect(() => {
    if (transactions) {
      console.log("✅ Transacciones cargadas:", transactions.length);
    }
    if (fixedExpenses) {
      console.log("✅ Gastos fijos cargados:", fixedExpenses.length);
    }
  }, [transactions, fixedExpenses]);

  const filteredTransactions = useTransactionSearch(transactions || [], searchQuery);

  const fixedExpensesAsTransactions: Transaction[] = (fixedExpenses || []).map((exp) => ({
    id: `fixed-${exp.id}`,
    transaction_date: exp.month,
    description: exp.name,
    amount: exp.amount,
    type: 'egreso',
    categories: exp.expense_groups
      ? { id: exp.expense_groups.id, name: exp.expense_groups.name }
      : { id: 'fixed-expense', name: 'Gasto Fijo Mensual' },
  }));

  const transactionsForSummary = [...(transactions || []), ...fixedExpensesAsTransactions];

  // Estado de carga mejorado
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">Cargando datos...</div>
        </div>
        <LoadingSkeleton variant="summary-cards" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <LoadingSkeleton variant="table" />
          </div>
          <div className="lg:col-span-3">
            <LoadingSkeleton variant="chart" />
          </div>
        </div>
      </div>
    );
  }

  // Estado de error mejorado
  if (hasError || dataError) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-destructive text-xl">⚠️</div>
        <h2 className="text-xl font-semibold">Error cargando datos</h2>
        <p className="text-muted-foreground">
          {dataError || hasError?.message || "Ha ocurrido un error inesperado"}
        </p>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => refetchTransactions()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <ErrorBoundary fallback={
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Error cargando header</p>
        </div>
      }>
        <DashboardHeader isOnline={isOnline} pendingActions={pendingActions} />
      </ErrorBoundary>

      <ErrorBoundary fallback={
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Error cargando resumen</p>
        </div>
      }>
        <DashboardSummary transactions={transactionsForSummary} />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Error cargando gastos fijos</p>
        </div>
      }>
        <DashboardFixedExpenses
          fixedExpensesOpen={fixedExpensesOpen}
          setFixedExpensesOpen={setFixedExpensesOpen}
          currentMonth={currentMonth}
          setMonthString={setMonthString}
        />
      </ErrorBoundary>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ErrorBoundary fallback={
          <div className="lg:col-span-4 text-center py-4">
            <p className="text-sm text-muted-foreground">Error cargando transacciones</p>
          </div>
        }>
          <DashboardTransactions
            filteredTransactions={filteredTransactions}
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            transactionListOpen={transactionListOpen}
            setTransactionListOpen={setTransactionListOpen}
          />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={
          <div className="lg:col-span-3 text-center py-4">
            <p className="text-sm text-muted-foreground">Error cargando gráficos</p>
          </div>
        }>
          <DashboardCharts
            transactions={transactions || []}
            chartOpen={chartOpen}
            setChartOpen={setChartOpen}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Index;
