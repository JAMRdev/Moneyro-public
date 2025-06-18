
import { RefObject } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { IncomeExpenseSummaryChart } from "@/components/reports/IncomeExpenseSummaryChart";
import { CategoryExpenseChart } from "@/components/reports/CategoryExpenseChart";
import { MonthlyBalanceChart } from "@/components/reports/MonthlyBalanceChart";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types";

type ReportContentProps = {
  isLoading: boolean;
  combinedData: Transaction[] | undefined;
  projections: Record<string, { income: number; expense: number }>;
  onProjectionsChange: (projections: Record<string, { income: number; expense: number }>) => void;
  reportContentRef: RefObject<HTMLDivElement>;
};

export const ReportContent = ({ isLoading, combinedData, projections, onProjectionsChange, reportContentRef }: ReportContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-[108px] w-full" />
          <Skeleton className="h-[108px] w-full" />
          <Skeleton className="h-[108px] w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-[450px] w-full" />
          <Skeleton className="h-[450px] w-full" />
          <Skeleton className="h-[450px] w-full md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div ref={reportContentRef} className="space-y-4 rounded-lg bg-card p-4">
      <ReportSummaryCards transactions={combinedData} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IncomeExpenseSummaryChart transactions={combinedData} />
        <CategoryExpenseChart transactions={combinedData} />
        <MonthlyBalanceChart
          transactions={combinedData}
          projections={projections}
          onProjectionsChange={onProjectionsChange}
        />
      </div>
      {combinedData && combinedData.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Detalle de Transacciones</h3>
            <p className="text-sm text-muted-foreground">
              Un listado detallado de las transacciones que coinciden con los filtros aplicados.
            </p>
          </div>
          <TransactionList transactions={combinedData} />
        </div>
      )}
    </div>
  );
};
