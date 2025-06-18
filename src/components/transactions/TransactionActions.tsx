
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Transaction } from "@/types";

interface TransactionActionsProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionActions = ({ transaction, onEdit, onDelete }: TransactionActionsProps) => {
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEdit(transaction)}
        className="hover-scale transition-all duration-200"
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(transaction)}
        className="hover-scale transition-all duration-200"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
        <span className="sr-only">Eliminar</span>
      </Button>
    </div>
  );
};
