
import { useMemo } from 'react';
import { FixedMonthlyExpense } from '@/types';

export const useExpenseCalculations = (expenses: FixedMonthlyExpense[]) => {
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [expenses]);

  const unpaidAmount = useMemo(() => {
    return expenses
      .filter(exp => !exp.paid)
      .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [expenses]);
  
  const unpaidAmountColor = useMemo(() => {
    if (totalAmount <= 0) return 'text-muted-foreground';
    if (unpaidAmount <= 0) return 'text-green-500';
    if (unpaidAmount >= totalAmount) return 'text-red-500';
    return 'text-orange-500';
  }, [unpaidAmount, totalAmount]);

  return { totalAmount, unpaidAmount, unpaidAmountColor };
};
