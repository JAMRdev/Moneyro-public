
import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import TransactionForm from "./TransactionForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { logActivity } from "@/lib/logger";
import { useTransactionPagination } from "@/hooks/useTransactionPagination";
import { Pagination } from "./ui/pagination";
import { TransactionItem } from "./transactions/TransactionItem";
import { TransactionTable } from "./transactions/TransactionTable";
import { EmptyTransactionsState } from "./transactions/EmptyTransactionsState";

type TransactionListProps = {
  transactions: Transaction[];
};

const TransactionList = ({ transactions }: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = React.useState<Transaction | null>(null);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  const {
    currentPage,
    totalPages,
    paginatedTransactions,
    goToPage,
    hasNextPage,
    hasPrevPage
  } = useTransactionPagination(transactions);

  const deleteMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
      if (error) throw error;
      await logActivity({
        action: 'Eliminar Transacción',
        location: 'Listado de Transacciones',
        details: { transaction_id: transactionId }
      });
    },
    onSuccess: () => {
      toast.success("Transacción eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setTransactionToDelete(null);
    },
    onError: (error) => {
      toast.error("Error al eliminar la transacción", { description: error.message });
      setTransactionToDelete(null);
    }
  });

  const handleDelete = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete.id);
    }
  };

  if (transactions.length === 0) {
    return <EmptyTransactionsState />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {isMobile ? (
        <div className="space-y-3">
          {paginatedTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              index={index}
              onEdit={setEditingTransaction}
              onDelete={setTransactionToDelete}
            />
          ))}
        </div>
      ) : (
        <TransactionTable
          transactions={paginatedTransactions}
          onEdit={setEditingTransaction}
          onDelete={setTransactionToDelete}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          className="mt-4 animate-fade-in"
        />
      )}

      <Dialog open={!!editingTransaction} onOpenChange={(isOpen) => !isOpen && setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[425px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Editar Transacción</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSuccess={() => setEditingTransaction(null)}
            transactionToEdit={editingTransaction}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!transactionToDelete} onOpenChange={(isOpen) => !isOpen && setTransactionToDelete(null)}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la transacción de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-all duration-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending} 
              className="bg-destructive hover:bg-destructive/90 transition-all duration-200"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionList;
