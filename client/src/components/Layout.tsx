
import { Link, Outlet } from "react-router-dom";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import { PiggyBank, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DesktopNavigation } from "./layout/DesktopNavigation";
import { MobileNavigation } from "./layout/MobileNavigation";
import { ErrorBoundary } from "./ui/error-boundary";
import { Suspense } from "react";

/**
 * Componente de Loading para las páginas
 */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-sm text-muted-foreground">Cargando página...</p>
    </div>
  </div>
);

/**
 * Componente Layout Principal con mejor manejo de errores y carga
 */
export default function Layout() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  /**
   * Maneja el éxito al crear una transacción
   */
  const handleTransactionSuccess = React.useCallback(() => {
    setIsTransactionModalOpen(false);
    setIsSheetOpen(false);
  }, []);

  return (
    <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header con mejor manejo de errores */}
        <ErrorBoundary fallback={
          <div className="h-16 border-b bg-background/95 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Error cargando navegación</p>
          </div>
        }>
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              {/* Logo de la aplicación */}
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity"
                aria-label="Ir al inicio"
              >
                <PiggyBank className="h-8 w-8 text-violet-600 dark:text-lime-400" />
                <span>Carle's Finance</span>
              </Link>
              
              {/* Navegación desktop */}
              <ErrorBoundary fallback={
                <div className="text-sm text-muted-foreground">Error en navegación</div>
              }>
                <DesktopNavigation />
              </ErrorBoundary>
              
              {/* Navegación mobile */}
              <ErrorBoundary fallback={
                <Button variant="outline" size="icon" disabled>
                  <span className="sr-only">Menú no disponible</span>
                </Button>
              }>
                <MobileNavigation 
                  isSheetOpen={isSheetOpen}
                  setIsSheetOpen={setIsSheetOpen}
                  setIsTransactionModalOpen={setIsTransactionModalOpen}
                />
              </ErrorBoundary>
            </div>
          </header>
        </ErrorBoundary>
        
        {/* Contenido principal con Suspense y Error Boundary */}
        <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary
            fallback={
              <div className="text-center py-12 space-y-4">
                <h2 className="text-xl font-semibold text-destructive">Error cargando página</h2>
                <p className="text-muted-foreground">Ha ocurrido un error inesperado.</p>
                <Button onClick={() => window.location.reload()}>
                  Recargar página
                </Button>
              </div>
            }
          >
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        
        {/* FAB - Floating Action Button */}
        <ErrorBoundary fallback={null}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-violet-600 text-white hover:bg-violet-700 dark:bg-lime-400 dark:text-black dark:hover:bg-lime-500 transition-all duration-200 hover:scale-105 focus:scale-105"
              aria-label="Añadir transacción"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </DialogTrigger>
        </ErrorBoundary>
      </div>

      {/* Modal para el formulario de transacciones */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Transacción</DialogTitle>
          <DialogDescription>
            Registra un nuevo ingreso o egreso para llevar el control de tus finanzas.
          </DialogDescription>
        </DialogHeader>
        <ErrorBoundary
          fallback={
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Error cargando formulario</p>
            </div>
          }
        >
          <TransactionForm onSuccess={handleTransactionSuccess} />
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
