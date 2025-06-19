
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Wallet } from "lucide-react";
import { Transaction } from "@/types";
import { MoneyDisplay } from "@/components/MoneyDisplay";

/**
 * Props para el componente SummaryCards
 */
type SummaryCardsProps = {
  /** Array de transacciones para calcular los resúmenes */
  transactions: Transaction[];
};

/**
 * Componente SummaryCards
 * 
 * Muestra un resumen financiero en tres tarjetas:
 * 1. Ingresos Totales - Suma de todas las transacciones de tipo "ingreso"
 * 2. Egresos Totales - Suma de todas las transacciones de tipo "egreso"  
 * 3. Balance - Diferencia entre ingresos y egresos
 * 
 * Características:
 * - Cálculo automático basado en las transacciones proporcionadas
 * - Formato de moneda argentino (ARS)
 * - Colores diferenciados (verde para ingresos, rojo para egresos)
 * - Iconos representativos para cada métrica
 * - Diseño responsivo (grid que se adapta a diferentes pantallas)
 * 
 * @param transactions - Array de transacciones para procesar
 */
const SummaryCards = ({ transactions }: SummaryCardsProps) => {
  /**
   * Calcula el resumen financiero procesando todas las transacciones
   * Usa reduce para acumular ingresos y egresos por separado
   */
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "ingreso") {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 } // Valores iniciales del acumulador
  );

  // Calcula el balance restando egresos de ingresos
  const balance = summary.income - summary.expenses;

  /**
   * Formatea números a moneda argentina (ARS)
   * Utiliza la API de Internacionalización de JavaScript
   * 
   * @param amount - Número a formatear
   * @returns String formateado como moneda argentina
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Tarjeta de Ingresos Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          {/* Icono de dólar para representar ingresos */}
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* Monto en verde para indicar valor positivo */}
          <div className="text-2xl font-bold text-green-500">
            <MoneyDisplay amount={summary.income} prefix="$" />
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Egresos Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
          {/* Icono de tarjeta de crédito para representar gastos */}
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* Monto en rojo para indicar gastos */}
          <div className="text-2xl font-bold text-red-500">
            <MoneyDisplay amount={summary.expenses} prefix="$" />
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          {/* Icono de billetera para representar balance total */}
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* Balance sin color específico - puede ser positivo o negativo */}
          <div className="text-2xl font-bold">
            <MoneyDisplay amount={balance} prefix="$" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
