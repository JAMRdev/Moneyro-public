
import * as React from "react";
import { Form } from "@/components/ui/form";
import { Transaction } from "@/types";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { TransactionFormFields } from "./forms/TransactionFormFields";
import { TransactionFormSubmit } from "./forms/TransactionFormSubmit";

const TransactionForm = ({ onSuccess, transactionToEdit }: { onSuccess?: () => void, transactionToEdit?: Transaction | null }) => {
  const { form, mutation, onSubmit } = useTransactionForm(onSuccess, transactionToEdit);

  return (
    <div className="animate-fade-in">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
          <TransactionFormFields form={form} />
          <TransactionFormSubmit 
            isPending={mutation.isPending} 
            transactionToEdit={transactionToEdit} 
          />
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
