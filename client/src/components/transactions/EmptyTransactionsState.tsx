
import { ClipboardX } from "lucide-react";

export const EmptyTransactionsState = () => {
  return (
    <div className="text-center py-10 border rounded-lg flex flex-col items-center gap-4 animate-fade-in">
      <ClipboardX className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">No se encontraron transacciones</h3>
      <p className="text-muted-foreground">Ajusta los filtros o añade nuevos movimientos para ver resultados.</p>
    </div>
  );
};
