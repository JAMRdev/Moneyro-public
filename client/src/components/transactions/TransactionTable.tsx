
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transaction } from "@/types";
import { TransactionActions } from "./TransactionActions";
import { MoneyDisplay } from "@/components/MoneyDisplay";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionTable = ({ transactions, onEdit, onDelete }: TransactionTableProps) => {
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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead className="hidden sm:table-cell">Tipo</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead><span className="sr-only">Acciones</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow 
              key={transaction.id} 
              className="transition-all duration-200 hover:bg-muted/50 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TableCell className="hidden sm:table-cell">{formatDate(transaction.transaction_date)}</TableCell>
              <TableCell>
                <div className="font-medium">{transaction.description || "Sin descripción"}</div>
                <div className="text-sm text-muted-foreground md:hidden">
                  {transaction.categories?.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {transaction.categories?.name ? (
                  <Badge variant="outline">{transaction.categories.name}</Badge>
                ) : null}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={transaction.type === 'ingreso' ? 'default' : 'destructive'} className="capitalize">
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-medium ${transaction.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                <MoneyDisplay amount={transaction.amount} prefix="$" />
              </TableCell>
              <TableCell className="text-right">
                {!transaction.id.startsWith('fixed-') && (
                  <div className="flex justify-end items-center">
                    <TransactionActions 
                      transaction={transaction}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
