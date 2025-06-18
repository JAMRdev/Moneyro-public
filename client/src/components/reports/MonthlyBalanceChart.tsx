import { useMemo } from 'react';
import { Bar, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Transaction } from '@/types';
import { format, parse, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MonthlyBalanceChartProps = {
  transactions: Transaction[] | undefined;
  projections: Record<string, { income: number; expense: number }>;
  onProjectionsChange: (projections: Record<string, { income: number; expense: number }>) => void;
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "#82ca9d",
  },
  egresos: {
    label: "Egresos",
    color: "#ff6b6b",
  },
  balance: {
    label: "Balance",
    color: "#8884d8",
  }
};

export function MonthlyBalanceChart({ transactions, projections, onProjectionsChange }: MonthlyBalanceChartProps) {
  const numberOfMonthsToProject = 6;

  const { chartData, futureMonths } = useMemo(() => {
    const monthlySummary = transactions?.reduce((acc, t) => {
      // The date string from DB is like 'YYYY-MM-DD'. new Date() can treat it as UTC.
      // To avoid timezone issues where e.g. June 1st becomes May 31st,
      // we parse it as a local date by taking only the date part.
      const date = parse(t.transaction_date.split('T')[0], 'yyyy-MM-dd', new Date());
      const month = format(date, 'yyyy-MM');
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'ingreso') {
        acc[month].income += t.amount;
      } else {
        acc[month].expense += t.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>) || {};

    const historicalData = Object.entries(monthlySummary)
      .map(([month, { income, expense }]) => ({
        month,
        ingresos: income,
        egresos: expense,
        balance: income - expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const now = new Date();
    const futureMonths: string[] = [];
    for (let i = 1; i <= numberOfMonthsToProject; i++) {
        const futureMonthDate = addMonths(now, i);
        futureMonths.push(format(futureMonthDate, 'yyyy-MM'));
    }

    const projectionData = futureMonths.map(month => {
        const projection = projections[month] || { income: 0, expense: 0 };
        return {
            month,
            ingresos: projection.income,
            egresos: projection.expense,
            balance: projection.income - projection.expense,
            isProjection: true,
        };
    });

    const combined = [...historicalData, ...projectionData];

    return { chartData: combined, futureMonths };
  }, [transactions, projections]);

  const handleProjectionChange = (month: string, type: 'income' | 'expense', value: string) => {
    const numericValue = parseFloat(value) || 0;
    onProjectionsChange({
      ...projections,
      [month]: {
        ...(projections[month] || { income: 0, expense: 0 }),
        [type]: numericValue,
      },
    });
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Balance Mensual y Proyecciones</CardTitle>
        <CardDescription>
          Evolución de tus ingresos, egresos y balance, incluyendo proyecciones futuras editables.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ComposedChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = parse(value, 'yyyy-MM', new Date());
                return format(date, 'MMM yy', { locale: es });
              }}
            />
            <YAxis
              tickFormatter={(value) => currencyFormatter.format(value as number).split(',')[0]}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    if (typeof label !== 'string' || !label.match(/^\d{4}-\d{2}$/)) return label;
                    const date = parse(label, 'yyyy-MM', new Date());
                    return format(date, 'MMMM yyyy', { locale: es });
                  }}
                  formatter={(value, name, item) => {
                    const itemConfig = chartConfig[name as keyof typeof chartConfig];
                    if (!itemConfig) return null;
                    return (
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{itemConfig.label}</span>
                        </div>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {currencyFormatter.format(value as number)}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Legend />
            <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
            <Bar dataKey="egresos" fill="var(--color-egresos)" radius={4} />
            <Line type="monotone" dataKey="balance" stroke="var(--color-balance)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ChartContainer>
        
        <div className="mt-8 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Editar Proyecciones Futuras</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Modifica los valores de ingresos y egresos para los próximos meses. Los cambios se guardan automáticamente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureMonths.map(month => (
              <div key={month} className="p-4 border rounded-lg bg-card-foreground/5 space-y-3">
                <p className="font-medium text-center capitalize">
                  {format(parse(month, 'yyyy-MM', new Date()), 'MMMM yyyy', { locale: es })}
                </p>
                <div className="space-y-1">
                  <Label htmlFor={`income-${month}`} className="text-sm">Ingresos Proyectados</Label>
                  <Input
                    id={`income-${month}`}
                    type="number"
                    placeholder="0"
                    className="bg-background"
                    value={projections[month]?.income || ''}
                    onChange={(e) => handleProjectionChange(month, 'income', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`expense-${month}`} className="text-sm">Egresos Proyectados</Label>
                  <Input
                    id={`expense-${month}`}
                    type="number"
                    placeholder="0"
                    className="bg-background"
                    value={projections[month]?.expense || ''}
                    onChange={(e) => handleProjectionChange(month, 'expense', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
