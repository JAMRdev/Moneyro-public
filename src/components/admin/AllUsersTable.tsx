import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

import { Users, Mail, Loader2, Send } from "lucide-react";

import { useAllUsers, useSendManualEmail } from "@/hooks/useAllUsers";

import { toast } from "sonner";

import { format } from "date-fns";

import { es } from "date-fns/locale";



export const AllUsersTable = () => {

  const [sendingTo, setSendingTo] = useState<string | null>(null);

  

  const { data: users, isLoading, refetch } = useAllUsers();

  const { sendManualEmail } = useSendManualEmail();



  const handleSendEmail = async (userEmail: string, userName: string) => {

    try {

      setSendingTo(userEmail);

      console.log(`🚀 Starting manual email to ${userEmail}...`);

      

      await sendManualEmail(userEmail, userName);

      

      toast.success("Correo enviado exitosamente", {

        description: `Correo enviado a ${userEmail}`,

      });

      

      refetch();

      

    } catch (error: any) {

      console.error("❌ Error sending manual email:", error);

      toast.error("Error al enviar correo", {

        description: error.message || "Ocurrió un error inesperado",

      });

    } finally {

      setSendingTo(null);

    }

  };



  if (isLoading) {

    return (

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Users className="h-5 w-5" />

            Todos los Usuarios

          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />

            <Skeleton className="h-10 w-full" />

          </div>

        </CardContent>

      </Card>

    );

  }



  const getStatusBadge = (user: any) => {

    if (!user.hours_since_last_transaction) {

      return <Badge variant="secondary">Sin transacciones</Badge>;

    }

    

    const hoursInactive = user.hours_since_last_transaction;

    if (hoursInactive >= 24) {

      return <Badge variant="destructive">Inactivo ({Math.floor(hoursInactive / 24)}d)</Badge>;

    } else {

      return <Badge variant="default">Activo</Badge>;

    }

  };



  return (

    <Card>

      <CardHeader>

        <CardTitle className="flex items-center gap-2">

          <Users className="h-5 w-5" />

          Todos los Usuarios ({users?.length || 0})

        </CardTitle>

        <CardDescription>

          Lista completa de usuarios registrados con la opción de enviar correos manuales

        </CardDescription>

      </CardHeader>

      <CardContent>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>Usuario</TableHead>

                <TableHead>Email</TableHead>

                <TableHead>Rol</TableHead>

                <TableHead>Estado</TableHead>

                <TableHead>Registrado</TableHead>

                <TableHead>Última Transacción</TableHead>

                <TableHead>Acciones</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {users?.map((user) => (

                <TableRow key={user.user_id}>

                  <TableCell className="font-medium">

                    {user.username || 'Sin nombre'}

                  </TableCell>

                  <TableCell className="break-all">{user.user_email}</TableCell>

                  <TableCell>

                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>

                      {user.role}

                    </Badge>

                  </TableCell>

                  <TableCell>{getStatusBadge(user)}</TableCell>

                  <TableCell>

                    {format(new Date(user.created_at), "dd/MM/yyyy", { locale: es })}

                  </TableCell>

                  <TableCell>

                    {user.last_transaction_date 

                      ? format(new Date(user.last_transaction_date), "dd/MM/yyyy", { locale: es })

                      : 'Nunca'

                    }

                  </TableCell>

                  <TableCell>

                    <Button

                      size="sm"

                      variant="outline"

                      onClick={() => handleSendEmail(user.user_email, user.username || 'Usuario')}

                      disabled={sendingTo === user.user_email}

                    >

                      {sendingTo === user.user_email ? (

                        <>

                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                          Enviando...

                        </>

                      ) : (

                        <>

                          <Send className="h-4 w-4 mr-2" />

                          Enviar Email

                        </>

                      )}

                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>

      </CardContent>

    </Card>

  );

};
