
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Transaction } from '@/types';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type ExpenseTrendChartProps = {
  transactions: Transaction[] | undefined;
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

export function ExpenseTrendChart({ transactions }: ExpenseTrendChartProps) {
  const chartData = useMemo(() => {
    if (!transactions) {
      return [];
    }

    const expenseTransactions = transactions
      .filter(t => t.type === 'egreso')
      .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime());

    const expensesByDay = expenseTransactions.reduce((acc, transaction) => {
      const date = transaction.transaction_date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expensesByDay).map(([date, total]) => ({
      date: format(parseISO(date), 'dd MMM', { locale: es }),
      fullDate: date,
      Egresos: total,
    }));
  }, [transactions]);

  const chartConfig = {
    Egresos: {
      label: "Egresos",
      color: "#ff6b6b",
    },
  };

  if (chartData.length === 0) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Tendencia de Egresos</CardTitle>
          <CardDescription>
            Este gráfico muestra la evolución de tus egresos en el tiempo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[358px] items-center justify-center">
          <p className="text-muted-foreground">No hay datos de egresos para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Tendencia de Egresos</CardTitle>
        <CardDescription>
          Evolución de egresos para el período seleccionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(value) => currencyFormatter.format(value as number)}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value) => currencyFormatter.format(value as number)}
              />}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Egresos"
              stroke="var(--color-Egresos)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
