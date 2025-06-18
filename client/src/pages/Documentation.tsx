import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeBlock } from "@/components/documentation/CodeBlock";
import { FeatureCard } from "@/components/documentation/FeatureCard";
import { 
  BookOpen, 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Settings,
  FileText,
  GitBranch,
  Cloud,
  Palette,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Bell,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  TrendingUp,
  PieChart,
  Target,
  Layers,
  Workflow,
  Monitor,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Link,
  Home,
  Wallet
} from "lucide-react";

/**
 * Página de Documentación Completa - Versión 2.0
 * 
 * Esta página proporciona documentación técnica completa y actualizada sobre 
 * Carle's Finance App, incluyendo guías de uso, referencias técnicas y ejemplos.
 * 
 * Estructura actualizada:
 * 1. Introducción y características principales
 * 2. Arquitectura técnica y patrones
 * 3. Guías de funcionalidades principales
 * 4. Referencia de componentes y hooks
 * 5. Guías de mantenimiento y deployment
 * 6. Recursos y contacto
 * 
 * @returns {JSX.Element} Página de documentación completa
 */
export default function Documentation() {
  return (
    <div className="space-y-8 max-w-none">
      {/* Header Principal Actualizado */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-r from-violet-50 to-lime-50 dark:from-violet-950/20 dark:to-lime-950/20 rounded-lg">
        <div className="flex justify-center">
          <BookOpen className="h-16 w-16 text-violet-600 dark:text-lime-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-lime-600 bg-clip-text text-transparent">
          Documentación Técnica v2.0
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Guía completa y actualizada para entender, usar y mantener Carle's Finance App
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">Versión 2.0</Badge>
          <Badge variant="outline">React 18 + TypeScript</Badge>
          <Badge variant="outline">Supabase</Badge>
          <Badge variant="outline">Shadcn/ui</Badge>
          <Badge variant="outline">{new Date().toLocaleDateString('es-ES')}</Badge>
        </div>
      </div>

      {/* Navegación por Tabs Mejorada */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview">Inicio</TabsTrigger>
          <TabsTrigger value="architecture">Arquitectura</TabsTrigger>
          <TabsTrigger value="features">Funciones</TabsTrigger>
          <TabsTrigger value="api">API/Hooks</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview Actualizado */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Carle's Finance App - Aplicación de Gestión Financiera Personal
              </CardTitle>
              <CardDescription>
                Aplicación web moderna construida con React, TypeScript y Supabase para el control financiero personal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen Ejecutivo */}
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Estado Actual:</strong> Aplicación completamente funcional con todas las características principales implementadas.
                  Incluye gestión de transacciones, gastos fijos mensuales, reportes avanzados, sistema de presupuestos y funciones de administración.
                </AlertDescription>
              </Alert>

              {/* Características Principales */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Características Principales
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FeatureCard
                    title="Gestión de Transacciones"
                    description="Sistema completo para registrar ingresos y egresos"
                    icon={DollarSign}
                    features={[
                      'Creación rápida con formularios inteligentes',
                      'Búsqueda y filtrado en tiempo real',
                      'Autocompletado de descripciones',
                      'Paginación optimizada',
                      'Edición inline'
                    ]}
                  />
                  
                  <FeatureCard
                    title="Gastos Fijos Mensuales"
                    description="Control de gastos recurrentes con seguimiento"
                    icon={Calendar}
                    features={[
                      'Navegación por meses',
                      'Control de estados de pago',
                      'Agrupación por categorías',
                      'Sistema de bloqueo',
                      'Duplicación entre meses'
                    ]}
                  />
                  
                  <FeatureCard
                    title="Sistema de Reportes"
                    description="Análisis avanzado con visualizaciones"
                    icon={BarChart3}
                    features={[
                      'Gráficos interactivos',
                      'Filtros avanzados',
                      'Exportación a PDF',
                      'Proyecciones financieras',
                      'Comparativas mensuales'
                    ]}
                  />
                  
                  <FeatureCard
                    title="Gestión de Presupuestos"
                    description="Control y seguimiento de presupuestos"
                    icon={Wallet}
                    features={[
                      'Presupuestos por categoría',
                      'Seguimiento de progreso',
                      'Alertas de límites',
                      'Comparativas históricas'
                    ]}
                  />
                  
                  <FeatureCard
                    title="Autenticación y Seguridad"
                    description="Sistema robusto de autenticación"
                    icon={Shield}
                    features={[
                      'Row Level Security (RLS)',
                      'Roles de usuario (admin/member)',
                      'Sesiones persistentes',
                      'Logging de actividad'
                    ]}
                  />
                  
                  <FeatureCard
                    title="Experiencia de Usuario"
                    description="Interface moderna y responsive"
                    icon={Monitor}
                    features={[
                      'Diseño responsive',
                      'Tema oscuro/claro',
                      'Notificaciones push',
                      'Estados de carga optimizados',
                      'Feedback visual completo'
                    ]}
                  />
                </div>
              </div>

              {/* Stack Tecnológico Actualizado */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Stack Tecnológico</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Frontend
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>React 18:</strong> Framework con Concurrent Features</li>
                      <li><strong>TypeScript:</strong> Tipado estático completo</li>
                      <li><strong>Vite:</strong> Build tool moderno y rápido</li>
                      <li><strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
                      <li><strong>Shadcn/ui:</strong> Componentes accesibles</li>
                      <li><strong>React Router v6:</strong> Enrutamiento SPA</li>
                      <li><strong>React Hook Form:</strong> Gestión de formularios</li>
                      <li><strong>Recharts:</strong> Visualización de datos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Backend & Servicios
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Supabase:</strong> Backend-as-a-Service</li>
                      <li><strong>PostgreSQL:</strong> Base de datos relacional</li>
                      <li><strong>Row Level Security:</strong> Seguridad a nivel de fila</li>
                      <li><strong>Realtime:</strong> Actualizaciones en tiempo real</li>
                      <li><strong>TanStack Query:</strong> Gestión de estado del servidor</li>
                      <li><strong>Web Push API:</strong> Notificaciones push</li>
                      <li><strong>Edge Functions:</strong> Funciones serverless</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Arquitectura Actualizada */}
        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Arquitectura del Sistema v2.0
              </CardTitle>
              <CardDescription>
                Diseño técnico actualizado y patrones implementados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Estructura de Carpetas Actualizada */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Estructura del Proyecto</h3>
                <CodeBlock
                  title="Estructura de Carpetas"
                  language="bash"
                  code={`src/
├── components/          # Componentes React reutilizables
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── layout/         # Componentes de navegación y layout
│   ├── forms/          # Componentes de formularios
│   ├── transactions/   # Componentes específicos de transacciones
│   ├── reports/        # Componentes de reportes y gráficos
│   ├── expenses/       # Componentes de gastos fijos
│   ├── budgets/        # Componentes de presupuestos
│   └── documentation/  # Componentes de documentación
├── hooks/              # Custom hooks para lógica reutilizable
├── pages/              # Componentes de páginas principales
├── types/              # Definiciones de tipos TypeScript
├── lib/                # Utilidades y configuraciones
│   ├── utils.ts        # Utilidades generales
│   ├── logger.ts       # Sistema de logging
│   ├── constants.ts    # Constantes de la aplicación
│   └── formatters.ts   # Utilidades de formateo
└── integrations/       # Configuración de servicios externos
    └── supabase/       # Cliente y tipos de Supabase`}
                />
              </div>

              {/* Patrones de Diseño */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Patrones de Diseño Implementados</h3>
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Custom Hooks Pattern</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Separación de lógica de negocio de la presentación mediante hooks personalizados.
                      </p>
                      <CodeBlock
                        language="typescript"
                        code={`// Ejemplo: Hook para gestión de transacciones
const useTransactions = (filters: TransactionFiltersState) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};`}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Component Composition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Componentes pequeños y enfocados que se componen para crear funcionalidades complejas.
                      </p>
                      <CodeBlock
                        language="typescript"
                        code={`// Composición de componentes de transacciones
<TransactionList>
  <TransactionFilters />
  <TransactionSearch />
  <TransactionTable />
  <TransactionPagination />
</TransactionList>`}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Funcionalidades Principales */}
        <TabsContent value="features" className="space-y-6">
          {/* Gestión de Transacciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Sistema de Transacciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Flujo de Creación</h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Click en botón "Añadir Transacción"</li>
                    <li>Completar formulario con validación</li>
                    <li>Autocompletado de descripciones</li>
                    <li>Selección de categoría opcional</li>
                    <li>Confirmación y actualización automática</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Características Avanzadas</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Búsqueda instantánea multi-campo</li>
                    <li>• Filtros por fecha, tipo y categoría</li>
                    <li>• Edición inline con validación</li>
                    <li>• Eliminación con confirmación</li>
                    <li>• Paginación optimizada (20 items/página)</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tip:</strong> El sistema aprende de tus transacciones anteriores para sugerir 
                  descripciones automáticamente, ahorrando tiempo en el registro.
                </AlertDescription>
              </Alert>

              <CodeBlock
                title="Ejemplo de uso del hook useTransactions"
                code={`const TransactionsPage = () => {
  const [filters, setFilters] = useState({
    date_range: undefined,
    type: 'all' as const,
    category_id: 'all'
  });
  
  const { data: transactions, isLoading } = useTransactions(filters);
  const searchedResults = useTransactionSearch(transactions || [], searchQuery);
  const { paginatedTransactions } = useTransactionPagination(searchedResults);
  
  return (
    <div>
      <TransactionFilters filters={filters} onFiltersChange={setFilters} />
      <TransactionList transactions={paginatedTransactions} />
    </div>
  );
};`}
              />
            </CardContent>
          </Card>

          {/* Sistema de Reportes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sistema de Reportes y Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <PieChart className="h-8 w-8 mb-2 text-purple-500" />
                  <h4 className="font-medium">Gráficos Interactivos</h4>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Gastos por categoría (Pie Chart)</li>
                    <li>• Tendencias mensuales (Line Chart)</li>
                    <li>• Comparativas de ingresos vs gastos</li>
                    <li>• Balance acumulado en el tiempo</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Filter className="h-8 w-8 mb-2 text-blue-500" />
                  <h4 className="font-medium">Filtros Avanzados</h4>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Rango de fechas personalizable</li>
                    <li>• Filtro por tipo de transacción</li>
                    <li>• Selección múltiple de categorías</li>
                    <li>• Combinaciones complejas de filtros</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Download className="h-8 w-8 mb-2 text-green-500" />
                  <h4 className="font-medium">Exportación</h4>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• PDF de alta calidad</li>
                    <li>• Captura de pantalla automática</li>
                    <li>• Impresión directa</li>
                    <li>• Datos en formato exportable</li>
                  </ul>
                </div>
              </div>

              <CodeBlock
                title="Ejemplo de componente de reporte"
                code={`const ReportsPage = () => {
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data: transactions } = useTransactions(filters);
  const { data: fixedExpenses } = useFixedExpensesForReport(filters);
  
  return (
    <div className="space-y-6">
      <ReportFilters filters={filters} onFiltersChange={setFilters} />
      <ReportSummaryCards data={transactions} />
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryExpenseChart data={transactions} />
        <MonthlyBalanceChart data={transactions} />
      </div>
      <ReportActions />
    </div>
  );
};`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: API y Hooks */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Referencia de API - Hooks Personalizados
              </CardTitle>
              <CardDescription>
                Documentación detallada de todos los custom hooks disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Hooks de Datos */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Hooks de Gestión de Datos</h3>
                <div className="space-y-4">
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-green-600">useTransactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Hook principal para obtener transacciones con filtros avanzados y cache optimizado.
                      </p>
                      <CodeBlock
                        code={`// Definición del hook
const useTransactions = (
  filters: TransactionFiltersState, 
  options?: TransactionQueryOptions
) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options
  });
};

// Ejemplo de uso
const { 
  data: transactions, 
  isLoading, 
  error, 
  refetch 
} = useTransactions({
  type: 'expense',
  category_id: 'all',
  date_range: { from: startDate, to: endDate }
});`}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-blue-600">useTransactionSearch</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Búsqueda en tiempo real optimizada para transacciones.
                      </p>
                      <CodeBlock
                        code={`// Hook de búsqueda
const useTransactionSearch = (
  transactions: Transaction[], 
  searchQuery: string
) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    
    const query = searchQuery.toLowerCase().trim();
    return transactions.filter(transaction => {
      const description = (transaction.description || '').toLowerCase();
      const category = (transaction.categories?.name || '').toLowerCase();
      const amount = transaction.amount.toString();
      
      return description.includes(query) || 
             category.includes(query) || 
             amount.includes(query);
    });
  }, [transactions, searchQuery]);
};

// Uso típico
const filteredTransactions = useTransactionSearch(allTransactions, searchTerm);`}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-600">useTransactionPagination</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Paginación optimizada para listas grandes de transacciones.
                      </p>
                      <CodeBlock
                        code={`// Hook de paginación
const useTransactionPagination = (transactions: Transaction[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [transactions, currentPage]);
  
  return {
    paginatedTransactions,
    currentPage,
    totalPages,
    goToPage: (page: number) => setCurrentPage(page),
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};`}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Hooks de UI */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Hooks de Utilidades</h3>
                <div className="space-y-4">
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-orange-600">useDescriptionAutoComplete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Autocompletado inteligente basado en transacciones previas.
                      </p>
                      <CodeBlock
                        code={`const useDescriptionAutoComplete = () => {
  const { data: suggestions = [] } = useQuery({
    queryKey: ['transaction-descriptions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('transactions')
        .select('description')
        .not('description', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100);
      
      const uniqueDescriptions = [...new Set(data?.map(t => t.description) || [])];
      return uniqueDescriptions.slice(0, 20);
    },
    staleTime: 5 * 60 * 1000,
  });

  return { suggestions };
};`}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-indigo-600">useAuth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Gestión completa de autenticación y perfiles de usuario.
                      </p>
                      <CodeBlock
                        code={`const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Configuración de listeners y fetch de datos...
  
  return { 
    session, 
    user, 
    profile, 
    loading, 
    isAdmin: profile?.role === 'admin' 
  };
};`}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Deployment y Mantenimiento */}
        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Guía de Deployment y Mantenimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Proceso de Deploy */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Proceso de Deployment</h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">1. Preparación Local</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        title="Comandos de preparación"
                        language="bash"
                        code={`# Instalar dependencias
npm install

# Ejecutar tests (si existen)
npm run test

# Verificar build
npm run build

# Preview del build
npm run preview`}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">2. Deploy via Lovable</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Hacer commit de todos los cambios</li>
                        <li>Verificar que no hay errores en consola</li>
                        <li>Click en "Publish" en Lovable</li>
                        <li>Configurar dominio personalizado si es necesario</li>
                        <li>Verificar deployment en URL proporcionada</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Mantenimiento */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tareas de Mantenimiento</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Actualizaciones Regulares</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Revisar dependencias desactualizadas mensualmente</li>
                        <li>• Actualizar Supabase client cuando sea necesario</li>
                        <li>• Monitorear logs de errores en producción</li>
                        <li>• Revisar métricas de rendimiento</li>
                        <li>• Backup de base de datos regulares</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Optimizaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Análisis de bundle size con Vite Bundle Analyzer</li>
                        <li>• Optimización de queries de Supabase</li>
                        <li>• Implementación de lazy loading donde sea apropiado</li>
                        <li>• Cache strategies para React Query</li>
                        <li>• Performance monitoring con Core Web Vitals</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Troubleshooting */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Troubleshooting Común</h3>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Problema:</strong> Build falla con errores de TypeScript<br/>
                      <strong>Solución:</strong> Verificar tipos en /types/index.ts y /integrations/supabase/types.ts
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Problema:</strong> Queries de Supabase fallan en producción<br/>
                      <strong>Solución:</strong> Revisar RLS policies y permisos en Supabase Dashboard
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Problema:</strong> Aplicación no carga (pantalla blanca)<br/>
                      <strong>Solución:</strong> Verificar console errors, problema típico con ErrorBoundary o autenticación
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Recursos */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Recursos y Referencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Documentación Oficial */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Documentación Oficial</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Tecnologías Principales</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                            React 18 Documentation
                          </a>
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">
                            TypeScript Handbook
                          </a>
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                            Vite Documentation
                          </a>
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                            Shadcn/ui Components
                          </a>
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Backend & Herramientas</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                            Supabase Documentation
                          </a>
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://tanstack.com/query/latest" target="_blank" rel="noopener noreferrer">
                            TanStack Query v5
                          </a>
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://recharts.org" target="_blank" rel="noopener noreferrer">
                            Recharts Documentation
                          </a>
                        </Button>
                      </li>
                      <li>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://react-hook-form.com" target="_blank" rel="noopener noreferrer">
                            React Hook Form
                          </a>
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Changelog */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Historial de Cambios</h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default">v2.0.0</Badge>
                        <span className="text-sm text-muted-foreground">Versión actual - {new Date().toLocaleDateString('es-ES')}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">✅ Nuevas Características</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Sistema de presupuestos completo</li>
                            <li>• Documentación técnica completa</li>
                            <li>• Hooks optimizados con JSDoc</li>
                            <li>• Componentes de documentación</li>
                            <li>• Utilidades de formateo centralizadas</li>
                            <li>• Constantes de aplicación organizadas</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-600 mb-2">🔧 Mejoras</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Performance de hooks mejorada</li>
                            <li>• Mejor manejo de errores</li>
                            <li>• Cache estratégico optimizado</li>
                            <li>• Tipado TypeScript más estricto</li>
                            <li>• Arquitectura más modular</li>
                            <li>• Logging mejorado</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">v1.0.0</Badge>
                        <span className="text-sm text-muted-foreground">Release inicial</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>✅ Gestión completa de transacciones</li>
                        <li>✅ Sistema de gastos fijos mensuales</li>
                        <li>✅ Reportes avanzados con gráficos</li>
                        <li>✅ Autenticación y autorización</li>
                        <li>✅ Notificaciones push</li>
                        <li>✅ Tema oscuro/claro</li>
                        <li>✅ Responsive design</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contacto y Soporte</h3>
                <Card className="bg-gradient-to-r from-violet-50 to-lime-50 dark:from-violet-950/20 dark:to-lime-950/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-violet-600 dark:text-lime-400" />
                        <div>
                          <p className="font-medium">Desarrollado para Carla Maffione</p>
                          <p className="text-sm text-muted-foreground">Aplicación de gestión financiera personal</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          📧 carla.maffione@gmail.com
                        </Badge>
                        <Badge variant="outline">
                          👨‍💻 alejandromonsalver@gmail.com (Admin)
                        </Badge>
                        <Badge variant="outline">
                          🤖 Construido con Lovable AI
                        </Badge>
                      </div>
                      
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          Para modificaciones o nuevas funcionalidades, puedes continuar la conversación 
                          con Lovable AI o contactar directamente al administrador técnico.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
