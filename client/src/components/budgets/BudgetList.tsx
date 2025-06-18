
import { Budget } from "@/types/budget";
import { Transaction } from "@/types";
import { BudgetCard } from "./BudgetCard";
import { calculateBudgetProgress } from "./BudgetProgress";

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[] | undefined;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

export const BudgetList = ({ budgets, transactions, onEdit, onDelete }: BudgetListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => {
        const { spent, percentage } = calculateBudgetProgress(budget, transactions);

        return (
          <BudgetCard
            key={budget.id}
            budget={budget}
            spent={spent}
            percentage={percentage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
