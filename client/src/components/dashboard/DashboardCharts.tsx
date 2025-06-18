
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import ExpensesChart from "@/components/ExpensesChart";
import { Transaction } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardChartsProps {
  transactions: Transaction[];
  chartOpen: boolean;
  setChartOpen: (open: boolean) => void;
}

export const DashboardCharts = ({ transactions, chartOpen, setChartOpen }: DashboardChartsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="lg:col-span-3">
      {isMobile ? (
        <Card>
          <Collapsible open={chartOpen} onOpenChange={setChartOpen}>
            <CardHeader className="flex w-full flex-row items-center justify-between p-4">
              <CardTitle>Gastos por Categoría</CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  {chartOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <div className="p-4 pt-0">
                <ExpensesChart transactions={transactions} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ) : (
        <ExpensesChart transactions={transactions} />
      )}
    </div>
  );
};
