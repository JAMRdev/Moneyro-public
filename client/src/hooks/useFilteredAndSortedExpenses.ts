
import { useMemo } from 'react';
import { parse } from 'date-fns';
import { FixedMonthlyExpense } from '@/types';
import { FixedExpensesFiltersState } from '@/components/expenses/ExpensesTableFilters';

export type SortableKeys = keyof FixedMonthlyExpense | 'group';
export type SortConfig = { key: SortableKeys; direction: 'asc' | 'desc' };

export const useFilteredAndSortedExpenses = (
  expenses: FixedMonthlyExpense[],
  filters: FixedExpensesFiltersState,
  sortConfig: SortConfig | null
) => {
  return useMemo(() => {
    let filtered = [...expenses];
    
    if (filters.groupId !== 'all') {
      filtered = filtered.filter(exp => exp.expense_group_id === filters.groupId);
    }
    if (filters.paidStatus !== 'all') {
      const isPaid = filters.paidStatus === 'paid';
      filtered = filtered.filter(exp => !!exp.paid === isPaid);
    }
    if (filters.paymentSource) {
      filtered = filtered.filter(exp => 
        exp.payment_source?.toLowerCase().includes(filters.paymentSource.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
            case 'group':
                aValue = a.expense_groups?.name || '';
                bValue = b.expense_groups?.name || '';
                break;
            case 'due_date':
                const parseDate = (dateStr: string | null | undefined): Date | null => {
                    if (!dateStr) return null;
                    try { return parse(dateStr, 'dd/MM/yyyy', new Date()); } catch (e) { return null; }
                }
                aValue = parseDate(a.due_date)?.getTime();
                bValue = parseDate(b.due_date)?.getTime();
                break;
            case 'amount':
                aValue = Number(a.amount);
                bValue = Number(b.amount);
                break;
            case 'name':
            case 'paid':
            case 'payment_source':
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
                break;
            default:
                aValue = a[sortConfig.key as keyof FixedMonthlyExpense];
                bValue = b[sortConfig.key as keyof FixedMonthlyExpense];
        }

        if (aValue === null || aValue === undefined || (typeof aValue === 'number' && isNaN(aValue))) aValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;
        if (bValue === null || bValue === undefined || (typeof bValue === 'number' && isNaN(bValue))) bValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [expenses, filters, sortConfig]);
};
