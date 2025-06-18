
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

interface TransactionFormSubmitProps {
  isPending: boolean;
  transactionToEdit?: Transaction | null;
}

export const TransactionFormSubmit = ({ isPending, transactionToEdit }: TransactionFormSubmitProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full hover-scale transition-all duration-200" 
      disabled={isPending}
    >
      {isPending ? "Guardando..." : (transactionToEdit ? "Actualizar Transacción" : "Guardar Transacción")}
    </Button>
  );
};
