
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { useMemo } from "react";
import { ArrowDownCircle, ArrowUpCircle, Banknote } from "lucide-react";

type ReportSummaryCardsProps = {
  transactions: Transaction[] | undefined;
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

export function ReportSummaryCards({ transactions }: ReportSummaryCardsProps) {
  const summary = useMemo(() => {
    if (!transactions) {
      return { income: 0, expense: 0, balance: 0 };
    }
    const { income, expense } = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'ingreso') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {currencyFormatter.format(summary.income)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {currencyFormatter.format(summary.expense)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {currencyFormatter.format(summary.balance)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
