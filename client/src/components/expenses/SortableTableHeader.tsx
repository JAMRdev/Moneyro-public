
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortableKeys, SortConfig } from '@/hooks/useFilteredAndSortedExpenses';

interface SortableTableHeaderProps {
  title: string;
  sortKey: SortableKeys;
  className?: string;
  sortConfig: SortConfig | null;
  requestSort: (key: SortableKeys) => void;
}

export const SortableTableHeader: FC<SortableTableHeaderProps> = ({
  title,
  sortKey,
  className = "",
  sortConfig,
  requestSort
}) => {
  const getSortIcon = () => {
    if (!sortConfig || sortConfig.key !== sortKey) {
      return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ml-2 h-3 w-3" />;
    }
    return <ArrowDown className="ml-2 h-3 w-3" />;
  };

  return (
    <Button variant="ghost" onClick={() => requestSort(sortKey)} className={`p-0 h-auto hover:bg-transparent font-medium text-muted-foreground ${className}`}>
      {title}
      {getSortIcon()}
    </Button>
  );
};
