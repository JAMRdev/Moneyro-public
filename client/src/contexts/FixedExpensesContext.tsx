
import { createContext, useContext, FC, ReactNode } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { FixedMonthlyExpense } from '@shared/schema';

type FixedExpensesContextType = {
  updateExpenseMutation: UseMutationResult<void, Error, Partial<FixedMonthlyExpense> & { id: string; }, unknown>;
  deleteExpense: (id: string) => void;
  isLocked: boolean;
  currencyFormatter: Intl.NumberFormat;
};

const FixedExpensesContext = createContext<FixedExpensesContextType | undefined>(undefined);

export const useFixedExpensesContext = () => {
  const context = useContext(FixedExpensesContext);
  if (!context) {
    throw new Error('useFixedExpensesContext must be used within a FixedExpensesProvider');
  }
  return context;
};

interface FixedExpensesProviderProps {
  children: ReactNode;
  value: FixedExpensesContextType;
}

export const FixedExpensesProvider: FC<FixedExpensesProviderProps> = ({ children, value }) => {
  return (
    <FixedExpensesContext.Provider value={value}>
      {children}
    </FixedExpensesContext.Provider>
  );
};
