
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import FixedMonthlyExpensesTable from "@/components/FixedMonthlyExpensesTable";

interface DashboardFixedExpensesProps {
  fixedExpensesOpen: boolean;
  setFixedExpensesOpen: (open: boolean) => void;
  currentMonth: Date;
  setMonthString: (monthString: string) => void;
}

export const DashboardFixedExpenses = ({ 
  fixedExpensesOpen, 
  setFixedExpensesOpen, 
  currentMonth, 
  setMonthString 
}: DashboardFixedExpensesProps) => {
  return (
    <Card>
      <Collapsible
        open={fixedExpensesOpen}
        onOpenChange={setFixedExpensesOpen}
      >
        <CardHeader className="flex w-full flex-row items-center justify-between p-4">
          <CardTitle>Gastos Fijos Mensuales</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              {fixedExpensesOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            <FixedMonthlyExpensesTable 
              currentMonth={currentMonth}
              setMonthString={setMonthString}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
