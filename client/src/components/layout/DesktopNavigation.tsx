
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MoneyToggle } from "@/components/MoneyToggle";
import { UserDropdown } from "./UserDropdown";
import { DialogTrigger } from "@/components/ui/dialog";
import { Home, BarChart2, PlusCircle, Wallet } from "lucide-react";

export const DesktopNavigation = () => {
  const { pathname } = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Button asChild variant={pathname === '/' ? 'secondary' : 'ghost'}>
        <Link to="/"><Home className="mr-2 h-4 w-4" /> Principal</Link>
      </Button>
      <Button asChild variant={pathname === '/budgets' ? 'secondary' : 'ghost'}>
        <Link to="/budgets"><Wallet className="mr-2 h-4 w-4" />Presupuestos</Link>
      </Button>
      <Button asChild variant={pathname === '/reports' ? 'secondary' : 'ghost'}>
        <Link to="/reports"><BarChart2 className="mr-2 h-4 w-4" />Reportes</Link>
      </Button>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" />Añadir Transacción</Button>
      </DialogTrigger>
      <MoneyToggle />
      <ThemeToggle />
      <UserDropdown />
    </nav>
  );
};
