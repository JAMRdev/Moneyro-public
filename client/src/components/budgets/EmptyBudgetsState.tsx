
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyBudgetsStateProps {
  onCreateBudget: () => void;
}

export const EmptyBudgetsState = ({ onCreateBudget }: EmptyBudgetsStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">No tienes presupuestos creados</p>
        <Button onClick={onCreateBudget}>
          <Plus className="mr-2 h-4 w-4" />
          Crear tu primer presupuesto
        </Button>
      </CardContent>
    </Card>
  );
};
