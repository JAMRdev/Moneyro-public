
import { useState } from 'react';
import { SortableKeys, SortConfig } from '@/hooks/useFilteredAndSortedExpenses';

export const useSort = (initialConfig: SortConfig | null = null) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialConfig);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            setSortConfig(null);
            return;
        }
        setSortConfig({ key, direction });
    };
    
    return { sortConfig, requestSort };
};
