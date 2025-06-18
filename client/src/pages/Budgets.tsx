
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { BudgetForm } from "@/components/BudgetForm";
import { useBudgets, useDeleteBudget } from "@/hooks/useBudgets";
import { Budget } from "@/types/budget";
import { useTransactions } from "@/hooks/useTransactions";
import { BudgetList } from "@/components/budgets/BudgetList";
import { EmptyBudgetsState } from "@/components/budgets/EmptyBudgetsState";

export default function Budgets() {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: budgets, isLoading, error } = useBudgets();
  const deleteBudget = useDeleteBudget();

  // Obtener transacciones para calcular gastos actuales
  const { data: transactions } = useTransactions({ 
    type: 'all', 
    category_id: 'all' 
  });

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = (budgetId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      deleteBudget.mutate(budgetId);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedBudget(null);
  };

  const openCreateForm = () => {
    setSelectedBudget(null);
    setIsFormOpen(true);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Presupuestos</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">Error al cargar presupuestos</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Presupuestos</h1>
        </div>
        <div className="text-center py-8">Cargando presupuestos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Presupuesto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm budget={selectedBudget || undefined} onSuccess={closeForm} />
          </DialogContent>
        </Dialog>
      </div>

      {!budgets || budgets.length === 0 ? (
        <EmptyBudgetsState onCreateBudget={openCreateForm} />
      ) : (
        <BudgetList
          budgets={budgets}
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
