
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { TransactionFilters } from "@/components/TransactionFilters";
import { TransactionSearch } from "@/components/TransactionSearch";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types";
import { TransactionFiltersState } from "@/hooks/useTransactions";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardTransactionsProps {
  filteredTransactions: Transaction[];
  filters: TransactionFiltersState;
  onFiltersChange: (filters: TransactionFiltersState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  transactionListOpen: boolean;
  setTransactionListOpen: (open: boolean) => void;
}

export const DashboardTransactions = ({
  filteredTransactions,
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  transactionListOpen,
  setTransactionListOpen
}: DashboardTransactionsProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="lg:col-span-4 flex flex-col">
      <Collapsible
        open={!isMobile || transactionListOpen}
        onOpenChange={isMobile ? setTransactionListOpen : undefined}
      >
        <CardHeader className="flex w-full flex-row items-center justify-between p-4">
          <CardTitle>Listado de gastos</CardTitle>
          {isMobile && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                {transactionListOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="flex-grow space-y-4 p-4 pt-0">
            <TransactionFilters filters={filters} onFiltersChange={onFiltersChange} />
            <TransactionSearch 
              onSearch={onSearchChange}
              placeholder="Buscar transacciones..."
            />
            {filteredTransactions && filteredTransactions.length > 0 ? (
              <TransactionList transactions={filteredTransactions} />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {searchQuery ? 
                  "No se encontraron transacciones que coincidan con tu búsqueda." :
                  "No se encontraron transacciones con los filtros actuales."
                }
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
