
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  isAdminRoute?: boolean;
};

const ProtectedRoute = ({ isAdminRoute = false }: ProtectedRouteProps) => {
  const { isAdmin, loading, session } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log(`🔐 ProtectedRoute check - Admin required: ${isAdminRoute}, User is admin: ${isAdmin}, Has session: ${!!session}`);
    }
  }, [loading, isAdminRoute, isAdmin, session]);

  // Mostrar skeleton mientras carga
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Si no hay sesión, redirigir a auth
  if (!session) {
    console.log("❌ No session found, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  // Si es ruta de admin y el usuario no es admin, redirigir al inicio
  if (isAdminRoute && !isAdmin) {
    console.log("❌ Admin route access denied, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Todo OK, renderizar el contenido
  return <Outlet />;
};

export default ProtectedRoute;
