
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2 } from "lucide-react";
import { Budget } from "@/types/budget";

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  percentage: number;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

export const BudgetCard = ({ budget, spent, percentage, onEdit, onDelete }: BudgetCardProps) => {
  const remaining = budget.amount - spent;
  const isOverBudget = spent > budget.amount;

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      case 'yearly': return 'Anual';
      default: return period;
    }
  };

  return (
    <Card className={isOverBudget ? 'border-red-500' : ''}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{budget.name}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">
                {getPeriodLabel(budget.period)}
              </Badge>
              {budget.categories && (
                <Badge variant="outline">
                  {budget.categories.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(budget)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(budget.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Gastado: ${spent.toFixed(2)}</span>
            <span>Presupuesto: ${budget.amount.toFixed(2)}</span>
          </div>
          
          <Progress 
            value={percentage} 
            className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
          />
          
          <div className="text-center">
            {isOverBudget ? (
              <span className="text-red-600 font-medium">
                Excedido por ${(spent - budget.amount).toFixed(2)}
              </span>
            ) : (
              <span className="text-green-600 font-medium">
                Restante: ${remaining.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
