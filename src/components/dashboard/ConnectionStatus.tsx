
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isOnline: boolean;
  pendingActions: number;
}

export const ConnectionStatus = ({ isOnline, pendingActions }: ConnectionStatusProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Wifi className="h-3 w-3 mr-1" />
            En línea
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <WifiOff className="h-3 w-3 mr-1" />
            Sin conexión
          </Badge>
        )}
        {pendingActions > 0 && (
          <Badge variant="secondary">
            {pendingActions} cambios pendientes
          </Badge>
        )}
      </div>
    </div>
  );
};
