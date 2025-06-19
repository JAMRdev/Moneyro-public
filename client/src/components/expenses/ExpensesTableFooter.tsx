
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell, TableFooter as ShadcnTableFooter } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import { MoneyDisplay } from '@/components/MoneyDisplay';

interface ExpensesTableFooterProps {
    addExpense: () => void;
    isLocked: boolean;
    totalAmount: number;
    unpaidAmount: number;
    unpaidAmountColor: string;
    currencyFormatter: Intl.NumberFormat;
}

export const ExpensesTableFooter: FC<ExpensesTableFooterProps> = ({
    addExpense,
    isLocked,
    totalAmount,
    unpaidAmount,
    unpaidAmountColor,
    currencyFormatter
}) => {
    return (
        <>
            <ShadcnTableFooter className="hidden md:table-footer-group">
                <TableRow>
                  <TableCell colSpan={2} className="align-middle">
                    <Button onClick={() => addExpense()} disabled={isLocked}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Añadir Gasto
                    </Button>
                  </TableCell>
                  <TableCell className="text-right font-bold text-base align-middle">
                    Total gastos mes:
                  </TableCell>
                  <TableCell className="text-right font-bold text-base align-middle">
                    <MoneyDisplay amount={totalAmount} prefix="$" />
                  </TableCell>
                  <TableCell colSpan={4} className={`text-right font-bold text-base align-middle ${unpaidAmountColor}`}>
                    Falta pagar: <MoneyDisplay amount={unpaidAmount} prefix="$" />
                  </TableCell>
                </TableRow>
            </ShadcnTableFooter>
            <div className="mt-4 flex flex-col gap-4 md:hidden">
                <Button onClick={() => addExpense()} disabled={isLocked} className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Añadir Gasto</Button>
                <div className="text-center font-bold text-base">
                    <div>Total gastos mes: <MoneyDisplay amount={totalAmount} prefix="$" /></div>
                    <div className={unpaidAmountColor}>Falta pagar: <MoneyDisplay amount={unpaidAmount} prefix="$" /></div>
                </div>
            </div>
        </>
    );
}
