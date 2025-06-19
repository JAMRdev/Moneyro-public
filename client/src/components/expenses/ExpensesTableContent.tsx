
import { FC } from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ExpenseRow } from './ExpenseRow';
import { ExpensesTableFooter } from './ExpensesTableFooter';
import { SortableTableHeader } from './SortableTableHeader';
import { FixedMonthlyExpense, ExpenseGroup } from '@shared/schema';
import { SortableKeys, SortConfig } from '@/hooks/useFilteredAndSortedExpenses';

interface ExpensesTableContentProps {
  expenses: FixedMonthlyExpense[];
  expenseGroups: ExpenseGroup[];
  addExpense: () => void;
  isLocked: boolean;
  totalAmount: number;
  unpaidAmount: number;
  unpaidAmountColor: string;
  sortConfig: SortConfig | null;
  requestSort: (key: SortableKeys) => void;
}

export const ExpensesTableContent: FC<ExpensesTableContentProps> = ({
  expenses,
  expenseGroups,
  addExpense,
  isLocked,
  totalAmount,
  unpaidAmount,
  unpaidAmountColor,
  sortConfig,
  requestSort
}) => {
  const headerProps = { sortConfig, requestSort };

  return (
    <Table>
      <TableHeader className="hidden md:table-header-group">
        <TableRow>
          <TableHead className="w-[180px]"><SortableTableHeader title="Grupo" sortKey="group" {...headerProps} /></TableHead>
          <TableHead><SortableTableHeader title="Nombre" sortKey="name" {...headerProps} /></TableHead>
          <TableHead className="w-[180px]"><SortableTableHeader title="Vencimiento" sortKey="due_date" {...headerProps} /></TableHead>
          <TableHead className="w-[150px] text-right"><SortableTableHeader title="Monto" sortKey="amount" className="justify-end" {...headerProps} /></TableHead>
          <TableHead className="w-[80px] text-center"><SortableTableHeader title="Pagado" sortKey="paid" className="justify-center" {...headerProps} /></TableHead>
          <TableHead>Notas</TableHead>
          <TableHead><SortableTableHeader title="Origen de Pago" sortKey="payment_source" {...headerProps} /></TableHead>
          <TableHead className="w-[50px] text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length > 0 ? (
            expenses.map((expense) => (
            <ExpenseRow 
              key={expense.id}
              expense={expense}
              expenseGroups={expenseGroups}
            />
          ))
        ) : (
            <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron resultados para los filtros aplicados.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
      <ExpensesTableFooter 
          addExpense={addExpense}
          isLocked={isLocked}
          totalAmount={totalAmount}
          unpaidAmount={unpaidAmount}
          unpaidAmountColor={unpaidAmountColor}
      />
    </Table>
  );
}
