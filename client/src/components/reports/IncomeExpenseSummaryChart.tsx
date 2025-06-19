import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Transaction } from '@/types';
import { useMemo } from 'react';
import { useMoneyVisibility } from '@/contexts/MoneyVisibilityContext';

type IncomeExpenseSummaryChartProps = {
  transactions: Transaction[] | undefined;
};

export function IncomeExpenseSummaryChart({ transactions }: IncomeExpenseSummaryChartProps) {
  const { isMoneyVisible } = useMoneyVisibility();
  
  const formatCurrency = (value: number) => {
    if (!isMoneyVisible) return "****";
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

  const summary = useMemo(() => {
    if (!transactions) {
      return { income: 0, expense: 0 };
    }
    return transactions.reduce(
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
  }, [transactions]);

  const chartData = [
    { name: 'Total', ingresos: summary.income, egresos: summary.expense },
  ];

  const chartConfig = {
    ingresos: {
      label: "Ingresos",
      color: "#82ca9d",
    },
    egresos: {
      label: "Egresos",
      color: "#ff6b6b",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Ingresos vs. Egresos</CardTitle>
        <CardDescription>
          Este gráfico muestra el total de ingresos y egresos para el período y filtros seleccionados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
            <Legend />
            <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
            <Bar dataKey="egresos" fill="var(--color-egresos)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
