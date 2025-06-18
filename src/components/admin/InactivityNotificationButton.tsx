
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Users, Clock, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useInactiveUsers, useSendInactivityNotifications } from "@/hooks/useInactiveUsers";
import { toast } from "sonner";

export const InactivityNotificationButton = () => {
  const [isSending, setIsSending] = useState(false);
  const [lastSentResult, setLastSentResult] = useState<any>(null);
  
  const { data: inactiveUsers, isLoading, refetch } = useInactiveUsers();
  const { sendNotifications } = useSendInactivityNotifications();

  const handleSendNotifications = async () => {
    try {
      setIsSending(true);
      console.log("🚀 Starting notification process...");
      
      const result = await sendNotifications();
      setLastSentResult(result);
      
      toast.success("Notificaciones enviadas exitosamente", {
        description: `Se enviaron ${result.emailsSent} correos a usuarios inactivos`,
      });
      
      // Refresh the inactive users list
      refetch();
      
    } catch (error: any) {
      console.error("❌ Error sending notifications:", error);
      toast.error("Error al enviar notificaciones", {
        description: error.message || "Ocurrió un error inesperado",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando usuarios inactivos...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Notificaciones de Inactividad
        </CardTitle>
        <CardDescription>
          Envía correos automáticos a usuarios que no han registrado transacciones en más de 24 horas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Usuarios inactivos detectados:</span>
          </div>
          <Badge variant={inactiveUsers && inactiveUsers.length > 0 ? "destructive" : "secondary"}>
            {inactiveUsers?.length || 0}
          </Badge>
        </div>

        {inactiveUsers && inactiveUsers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Usuarios inactivos:
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {inactiveUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 bg-background border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{user.username || 'Usuario sin nombre'}</p>
                    <p className="text-xs text-muted-foreground">{user.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.floor(user.hours_since_last_transaction / 24)} días
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.last_transaction_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lastSentResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Última ejecución: Se enviaron {lastSentResult.emailsSent} correos exitosamente.
              {lastSentResult.emailsFaile > 0 && ` ${lastSentResult.emailsFaile} correos fallaron.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSendNotifications}
            disabled={isSending || !inactiveUsers || inactiveUsers.length === 0}
            className="flex-1"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Notificaciones
              </>
            )}
          </Button>
        </div>

        {inactiveUsers && inactiveUsers.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ¡Excelente! No hay usuarios inactivos en este momento.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
