
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Layers, History, LogOut as LogOutIcon, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logActivity } from "@/lib/logger";

export const UserDropdown = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();

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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url} alt={profile?.username ?? "Avatar"} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.username ?? "Usuario"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/categories')}>
          <Layers className="mr-2 h-4 w-4" />
          <span>Categorías</span>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/documentation')}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Documentación</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/logs')}>
              <History className="mr-2 h-4 w-4" />
              <span>Logs</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
