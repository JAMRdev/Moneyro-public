import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Transaction } from "@/types"
import { PieChartIcon } from "lucide-react"
import { useMoneyVisibility } from "@/contexts/MoneyVisibilityContext"

/**
 * Props para el componente ExpensesChart
 */
type ExpensesChartProps = {
  /** Array de transacciones para analizar y mostrar en el gráfico */
  transactions: Transaction[]
}

/**
 * Componente ExpensesChart
 * 
 * Muestra un gráfico de torta (pie chart) con la distribución de gastos por categoría.
 * 
 * Funcionalidades:
 * 1. Filtra automáticamente solo las transacciones de tipo "egreso"
 * 2. Agrupa gastos por categoría y calcula totales
 * 3. Genera colores automáticos para cada categoría
 * 4. Muestra tooltips con montos formateados en ARS
 * 5. Incluye leyenda visual con colores de cada categoría
 * 6. Maneja el estado vacío con mensaje informativo
 * 
 * Características técnicas:
 * - Usa recharts para la visualización
 * - Formato de moneda argentino (ARS)
 * - Colores automáticos usando variables CSS personalizadas
 * - Diseño responsivo y accesible
 * - Memoria optimizada con useMemo para cálculos pesados
 * 
 * Estados manejados:
 * - Sin datos: Muestra mensaje e icono informativo
 * - Con datos: Renderiza gráfico interactivo con leyenda
 * 
 * @param transactions - Array de transacciones a procesar
 */
const ExpensesChart = ({ transactions }: ExpensesChartProps) => {
  const { isMoneyVisible } = useMoneyVisibility();
  
  /**
   * Formatea números como moneda argentina (ARS)
   * Utiliza la API de Internacionalización para formateo consistente
   * 
   * @param amount - Monto numérico a formatear  
   * @returns String formateado como "$X.XXX,XX ARS"
   */
  const formatCurrency = (amount: number) => {
    if (!isMoneyVisible) return "****";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  /**
   * Procesa las transacciones para generar datos del gráfico
   * 
   * Proceso:
   * 1. Filtra solo transacciones de tipo "egreso"
   * 2. Agrupa por nombre de categoría
   * 3. Suma los montos por cada categoría
   * 4. Convierte a formato requerido por recharts
   * 
   * Optimización: useMemo evita recálculos innecesarios
   */
  const chartData = React.useMemo(() => {
    const expensesByCategory = transactions
      .filter((t) => t.type === "egreso")
      .reduce((acc, transaction) => {
        // Usar nombre de categoría o "Sin categoría" como fallback
        const categoryName = transaction.categories?.name || "Sin categoría"
        if (!acc[categoryName]) {
          acc[categoryName] = 0
        }
        acc[categoryName] += transaction.amount
        return acc
      }, {} as Record<string, number>)

    // Convertir objeto a array de objetos para recharts
    return Object.entries(expensesByCategory).map(([name, amount]) => ({
      name,
      amount,
    }))
  }, [transactions])

  /**
   * Configuración de colores y etiquetas para el gráfico
   * Genera automáticamente colores usando variables CSS personalizadas
   * 
   * Cada categoría recibe:
   * - label: Nombre legible
   * - color: Color único basado en --chart-{index}
   */
  const chartConfig = React.useMemo(() => {
    return chartData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: `hsl(var(--chart-${index + 1}))`,
      }
      return acc
    }, {} as ChartConfig)
  }, [chartData])

  /**
   * Datos del gráfico enriquecidos con información de color
   * Combina los datos calculados con la configuración de colores
   */
  const chartDataWithFill = React.useMemo(() => {
    return chartData.map((item) => ({
      ...item,
      fill: chartConfig[item.name]?.color,
    }));
  }, [chartData, chartConfig]);

  // Estado vacío - sin gastos para mostrar
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
          <CardDescription>
            Distribución de tus gastos en el período seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            {/* Icono informativo */}
            <PieChartIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">
              No hay gastos para mostrar en el gráfico.
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-6" />
      </Card>
    )
  }

  // Estado con datos - renderizar gráfico completo
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gastos por Categoría</CardTitle>
        <CardDescription>
          Distribución de tus gastos en el período seleccionado
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-0">
        {/* Contenedor del gráfico con configuración responsiva */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            {/* Tooltip personalizado con formato de moneda */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                  hideLabel
                />
              }
            />
            {/* Gráfico de torta principal */}
            <Pie
              data={chartDataWithFill}
              dataKey="amount"      // Campo que determina el tamaño de cada segmento
              nameKey="name"        // Campo que determina las etiquetas
              innerRadius={60}      // Radio interno (hace un donut chart)
              strokeWidth={5}       // Grosor del borde entre segmentos
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Leyenda con colores y nombres de categorías */}
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap">
          {chartDataWithFill.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              {/* Indicador de color */}
              <span
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.fill,
                }}
              />
              {/* Nombre de la categoría */}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ExpensesChart
