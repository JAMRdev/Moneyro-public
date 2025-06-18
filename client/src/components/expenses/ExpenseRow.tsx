
import { FC, useState, useMemo } from 'react';
import { FixedMonthlyExpense, ExpenseGroup } from '@/types';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Trash2, ChevronDown, CalendarIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { EditableCell } from './EditableCell';
import { useFixedExpensesContext } from '@/contexts/FixedExpensesContext';

interface ExpenseRowProps {
    expense: FixedMonthlyExpense;
    expenseGroups: ExpenseGroup[];
}

export const ExpenseRow: FC<ExpenseRowProps> = ({
    expense,
    expenseGroups,
}) => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const { 
        isLocked, 
        currencyFormatter, 
        updateExpenseMutation, 
        deleteExpense 
    } = useFixedExpensesContext();

    const selectedDate = useMemo(() => {
        if (!expense.due_date) return undefined;
        try {
            return parse(expense.due_date, 'dd/MM/yyyy', new Date());
        } catch {
            return undefined;
        }
    }, [expense.due_date]);
    
    return (
        <Collapsible
            asChild
            key={expense.id}
            open={!isMobile || isOpen}
            onOpenChange={(open) => isMobile && setIsOpen(open)}
        >
            <TableRow 
                className={cn(
                    "block border rounded-lg mb-4 p-0 md:table-row md:rounded-none md:border-0 md:border-b", 
                    expense.paid && "bg-green-500/10 hover:bg-green-500/20"
                )}
            >
                <td className="p-0 md:contents" colSpan={8}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left md:hidden">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{expense.name}</p>
                            <p className="text-sm text-muted-foreground">{currencyFormatter.format(expense.amount || 0)}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 ml-2 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="md:contents">
                        <div className="px-4 pb-4 md:p-0 md:contents">
                            <TableCell className="block md:table-cell md:p-4">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Grupo</label>
                                <Select
                                    value={expense.expense_group_id || ''}
                                    onValueChange={(value) => updateExpenseMutation.mutate({ id: expense.id, expense_group_id: value })}
                                    disabled={isLocked}
                                >
                                    <SelectTrigger className="w-full border-none bg-transparent p-0 focus:ring-0 focus:ring-offset-0 h-8 text-left md:w-auto md:max-w-[160px] truncate">
                                        <SelectValue placeholder="Seleccionar grupo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        {expenseGroups.map(group => (
                                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="block md:table-cell md:p-4">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Nombre</label>
                                <EditableCell expense={expense} field="name" value={expense.name} isLocked={isLocked} />
                            </TableCell>
                            <TableCell className="block md:table-cell md:p-4">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Vencimiento</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal h-9", !expense.due_date && "text-muted-foreground")}
                                        disabled={isLocked}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {expense.due_date ? expense.due_date : <span>Elige fecha</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => updateExpenseMutation.mutate({ id: expense.id, due_date: date ? format(date, 'dd/MM/yyyy') : null })}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                            <TableCell className="block md:table-cell md:p-4 md:text-right">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Monto</label>
                                <EditableCell expense={expense} field="amount" value={expense.amount} currencyFormatter={currencyFormatter} isLocked={isLocked} />
                            </TableCell>
                            <TableCell className="flex items-center justify-between md:table-cell md:p-4 md:text-center">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Pagado</label>
                                <EditableCell expense={expense} field="paid" value={expense.paid} isLocked={isLocked} />
                            </TableCell>
                            <TableCell className="block md:table-cell md:p-4">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Notas</label>
                                <EditableCell expense={expense} field="notes" value={expense.notes} isLocked={isLocked} />
                            </TableCell>
                            <TableCell className="block md:table-cell md:p-4">
                                <label className="text-sm font-medium text-muted-foreground md:hidden">Origen Pago</label>
                                <EditableCell expense={expense} field="payment_source" value={expense.payment_source} isLocked={isLocked} />
                            </TableCell>
                            <TableCell className="block md:table-cell md:p-4 md:text-right">
                                <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)} disabled={isLocked} className="hidden md:inline-flex">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                <Button variant="destructive" className="w-full md:hidden" onClick={() => deleteExpense(expense.id)} disabled={isLocked}>
                                    <Trash2 className="h-4 w-4" />
                                    <span>Eliminar Gasto</span>
                                </Button>
                            </TableCell>
                        </div>
                    </CollapsibleContent>
                </td>
            </TableRow>
        </Collapsible>
    );
}
