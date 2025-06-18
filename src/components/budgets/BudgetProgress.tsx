
import { Budget } from "@/types/budget";
import { Transaction } from "@/types";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from "date-fns";

interface BudgetProgressCalculation {
  spent: number;
  percentage: number;
}

export const calculateBudgetProgress = (
  budget: Budget, 
  transactions: Transaction[] | undefined
): BudgetProgressCalculation => {
  if (!transactions) return { spent: 0, percentage: 0 };

  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  // Calcular el rango de fechas según el período
  switch (budget.period) {
    case 'weekly':
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'monthly':
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      break;
    case 'yearly':
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    default:
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
  }

  // Filtrar transacciones por categoría y período
  const relevantTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    const isInPeriod = transactionDate >= startDate && transactionDate <= endDate;
    const isRelevantCategory = !budget.category_id || transaction.categories?.id === budget.category_id;
    const isExpense = transaction.type === 'egreso';
    
    return isInPeriod && isRelevantCategory && isExpense;
  });

  const spent = relevantTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  return { spent, percentage: Math.min(percentage, 100) };
};
