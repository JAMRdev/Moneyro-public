
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { initializeDatabase, authAPI } from "./lib/api";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import Categories from "./pages/Categories";
import Logs from "./pages/Logs";
import ProtectedRoute from "./components/ProtectedRoute";
import Reports from "./pages/Reports";
import Documentation from "./pages/Documentation";
import Budgets from "./pages/Budgets";
import PushNotificationsManager from "./components/PushNotificationsManager";
import { ErrorBoundary } from "./components/ui/error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.code === 'PGRST116') return false;
        if (error?.message?.includes('fetch')) return failureCount < 2;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🔄 Inicializando autenticación...");
        
        // Initialize database with default categories
        await initializeDatabase();
        
        // Create a demo session for now
        const sessionData = await authAPI.login();
        
        if (mounted) {
          setSession(sessionData);
          setAuthError(null);
          console.log("✅ Sesión demo creada");
        }
      } catch (error: any) {
        console.error("❌ Error inesperado en inicialización:", error);
        if (mounted) {
          setAuthError("Error de conexión. Verifica tu conexión a internet.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Cargando aplicación...</p>
          <p className="text-sm text-muted-foreground">Conectando con el servidor</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl">⚠️</div>
          <h2 className="text-xl font-semibold">Error de Conexión</h2>
          <p className="text-muted-foreground">{authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              {session ? (
                <>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="budgets" element={<Budgets />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="documentation" element={<Documentation />} />
                    
                    <Route element={<ProtectedRoute isAdminRoute />}>
                      <Route path="logs" element={<Logs />} />
                    </Route>
                  </Route>
                  
                  <Route path="/auth" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<NotFound />} />
                </>
              ) : (
                <>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<Navigate to="/auth" replace />} />
                </>
              )}
            </Routes>
            
            {session && (
              <ErrorBoundary>
                <PushNotificationsManager />
              </ErrorBoundary>
            )}
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
