
import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseGroup } from '@shared/schema';

export interface FixedExpensesFiltersState {
  groupId: string;
  paidStatus: 'all' | 'paid' | 'unpaid';
  paymentSource: string;
}

interface ExpensesTableFiltersProps {
  filters: FixedExpensesFiltersState;
  onFiltersChange: (filters: FixedExpensesFiltersState) => void;
  expenseGroups: ExpenseGroup[];
}

export const ExpensesTableFilters: FC<ExpensesTableFiltersProps> = ({
  filters,
  onFiltersChange,
  expenseGroups,
}) => {
  const handleFilterChange = (key: keyof FixedExpensesFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value as any });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-4">
      <Select value={filters.groupId} onValueChange={(value) => handleFilterChange('groupId', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por grupo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {expenseGroups.map(group => (
              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Select value={filters.paidStatus} onValueChange={(value) => handleFilterChange('paidStatus', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por estado de pago..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="paid">Pagado</SelectItem>
            <SelectItem value="unpaid">No Pagado</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Input
        placeholder="Filtrar por origen de pago..."
        value={filters.paymentSource}
        onChange={(e) => handleFilterChange('paymentSource', e.target.value)}
      />
    </div>
  );
};

