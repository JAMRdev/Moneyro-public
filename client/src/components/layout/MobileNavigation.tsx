
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  Layers,
  PlusCircle,
  History,
  LogOut as LogOutIcon,
  BarChart2,
  Wallet
} from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logActivity } from "@/lib/logger";

interface MobileNavigationProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  setIsTransactionModalOpen: (open: boolean) => void;
}

export const MobileNavigation = ({ 
  isSheetOpen, 
  setIsSheetOpen, 
  setIsTransactionModalOpen 
}: MobileNavigationProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLogout = async () => {
    await logActivity({
      action: 'Cierre de Sesión',
      location: 'Layout'
    });
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión", { description: error.message });
    } else {
      toast.success("Has cerrado sesión");
      navigate("/");
    }
    setIsSheetOpen(false);
  };

  const handleTransactionClick = () => {
    setIsTransactionModalOpen(true);
    setIsSheetOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-background">
          <nav className="flex flex-col space-y-4 pt-6">
            <SheetClose asChild>
              <Button asChild variant={pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
                <Link to="/"><Home className="mr-2 h-4 w-4" />Principal</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild variant={pathname === '/budgets' ? 'secondary' : 'ghost'} className="w-full justify-start">
                <Link to="/budgets"><Wallet className="mr-2 h-4 w-4" />Presupuestos</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild variant={pathname === '/reports' ? 'secondary' : 'ghost'} className="w-full justify-start">
                <Link to="/reports"><BarChart2 className="mr-2 h-4 w-4" />Reportes</Link>
              </Button>
            </SheetClose>
            
            <Button onClick={handleTransactionClick} className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />Añadir Transacción
            </Button>
            
            <DropdownMenuSeparator />

            <SheetClose asChild>
              <Button asChild variant={pathname === '/categories' ? 'secondary' : 'ghost'} className="w-full justify-start">
                <Link to="/categories"><Layers className="mr-2 h-4 w-4" />Categorías</Link>
              </Button>
            </SheetClose>

            {isAdmin && (
              <SheetClose asChild>
                <Button asChild variant={pathname === '/logs' ? 'secondary' : 'ghost'} className="w-full justify-start">
                  <Link to="/logs"><History className="mr-2 h-4 w-4" />Logs</Link>
                </Button>
              </SheetClose>
            )}

            <div className="flex items-center justify-between w-full px-4 py-2">
              <span className="text-sm font-medium">Tema</span>
              <ThemeToggle />
            </div>

            <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
              <LogOutIcon className="mr-2 h-4 w-4" />Cerrar Sesión
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
