
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLogs } from '@/hooks/useLogs';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Log } from '@/types';
import { InactivityNotificationButton } from "@/components/admin/InactivityNotificationButton";
import { AllUsersTable } from "@/components/admin/AllUsersTable";

export default function Logs() {
  const { data: logs, isLoading, error } = useLogs();
  const queryClient = useQueryClient();
  
  const [date, setDate] = useState<DateRange | undefined>();
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const channel = supabase
      .channel('realtime-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'logs',
        },
        (payload) => {
          const newLog = payload.new as Log;
          queryClient.setQueryData(['logs'], (oldData: Log[] | undefined) => {
            if (!oldData) return [newLog];
            return [newLog, ...oldData];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filteredLogs = logs?.filter((log) => {
    if (date?.from && new Date(log.created_at) < date.from) return false;
    
    if (date?.to) {
        const toDate = new Date(date.to);
        toDate.setHours(23, 59, 59, 999);
        if (new Date(log.created_at) > toDate) return false;
    }
    
    if (userFilter && !log.user_email?.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (actionFilter && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    if (locationFilter && !log.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registros de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
      </div>

      <InactivityNotificationButton />
      
      <AllUsersTable />

      <Card>
        <CardHeader>
          <CardTitle>Registros de Actividad</CardTitle>
          <CardDescription>
            Aquí puedes ver todas las acciones realizadas en la aplicación. La tabla se actualiza en tiempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                        {format(date.to, "LLL dd, y", { locale: es })}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y", { locale: es })
                    )
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>

            <Input placeholder="Filtrar por usuario..." value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
            <Input placeholder="Filtrar por acción..." value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} />
            <Input placeholder="Filtrar por ubicación..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}</TableCell>
                  <TableCell className="break-all">{log.user_email}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell>
                    {log.details && (
                      <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-w-xs md:max-w-sm">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
