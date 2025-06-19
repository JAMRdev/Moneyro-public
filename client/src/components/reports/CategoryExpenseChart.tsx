
import { Pie, PieChart, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Transaction } from '@/types';
import { useMemo } from 'react';
import { useMoneyVisibility } from "@/contexts/MoneyVisibilityContext";

type CategoryExpenseChartProps = {
  transactions: Transaction[] | undefined;
};

const COLORS = [ "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#ff7300", "#0088FE", "#00C49F", "#FFBB28" ];

export function CategoryExpenseChart({ transactions }: CategoryExpenseChartProps) {
  const { isMoneyVisible } = useMoneyVisibility();
  
  const formatCurrency = (amount: number) => {
    if (!isMoneyVisible) return "****";
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const { chartData, chartConfig } = useMemo(() => {
    if (!transactions) {
      return { chartData: [], chartConfig: {} };
    }

    const expenseTransactions = transactions.filter(t => t.type === 'egreso');
    const expensesByCategory = expenseTransactions.reduce((acc, transaction) => {
      const categoryName = transaction.categories?.name || 'Sin Categoría';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(expensesByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        key: `category-${index}`,
      }))
      .sort((a, b) => b.value - a.value);

    const config = data.reduce((acc, entry, index) => {
      acc[entry.key] = {
        label: entry.name,
        color: COLORS[index % COLORS.length],
      };
      return acc;
    }, {} as any);

    return { chartData: data, chartConfig: config };
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Egresos por Categoría</CardTitle>
          <CardDescription>
            Este gráfico muestra la distribución de tus egresos por categoría.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[358px] items-center justify-center">
          <p className="text-muted-foreground">No hay datos de egresos para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Egresos por Categoría</CardTitle>
        <CardDescription>
          Distribución de egresos por categoría para el período seleccionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                  nameKey="key"
                />
              }
            />
            <Legend />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={`var(--color-${entry.key})`} className="stroke-background" />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
