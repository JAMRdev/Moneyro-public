
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transaction } from "@/types";
import { TransactionActions } from "./TransactionActions";

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionItem = ({ transaction, index, onEdit, onDelete }: TransactionItemProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const dateInUserTimezone = new Date(date.valueOf() + userTimezoneOffset);
    return format(dateInUserTimezone, 'PPP', { locale: es });
  };

  return (
    <div 
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 space-y-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold break-words">{transaction.description || 'Sin descripción'}</p>
          <p className="text-sm text-muted-foreground">
            {transaction.categories?.name || 'Sin categoría'}
          </p>
        </div>
        <p className={`font-medium text-right ml-2 ${transaction.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(transaction.amount)}
        </p>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant={transaction.type === 'ingreso' ? 'default' : 'destructive'} className="capitalize">
            {transaction.type}
          </Badge>
          <span>{formatDate(transaction.transaction_date)}</span>
        </div>
        <div className="-mr-2 -my-2">
          {!transaction.id.startsWith('fixed-') && (
            <TransactionActions 
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
