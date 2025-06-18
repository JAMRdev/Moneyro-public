
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExpenseGroupManager } from './ExpenseGroupManager';

interface ExpensesTableActionsProps {
    currentMonth: Date;
    handleMonthChange: (direction: 'next' | 'prev') => void;
    duplicateMonth: () => void;
    isDuplicating: boolean;
    isLocked: boolean;
    setIsLocked: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export const ExpensesTableActions: FC<ExpensesTableActionsProps> = ({
    currentMonth,
    handleMonthChange,
    duplicateMonth,
    isDuplicating,
    isLocked,
    setIsLocked
}) => {
    const isMobile = useIsMobile();
    
    return (
        <div className="flex flex-col gap-2 px-6 pb-4 md:flex-row md:flex-wrap md:items-center md:justify-end">
            <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="font-semibold text-center w-32 capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</span>
                <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => duplicateMonth()} disabled={isDuplicating || isLocked} className="w-full md:w-auto">
                <Copy className="mr-2 h-4 w-4" /> Duplicar Mes
            </Button>
            <ExpenseGroupManager className="w-full md:w-auto" />
            {isMobile ? (
              <Button variant="outline" size="sm" className="w-full" onClick={() => setIsLocked(prev => !prev)}>
                {isLocked ? <Lock className="mr-2" /> : <Unlock className="mr-2" />}
                {isLocked ? 'Desbloquear edición' : 'Bloquear edición'}
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsLocked(prev => !prev)}>
                      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLocked ? 'Desbloquear para editar' : 'Bloquear edición'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>
    );
};
