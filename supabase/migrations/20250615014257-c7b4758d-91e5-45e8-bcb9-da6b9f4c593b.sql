
-- Habilitar la identidad de réplica completa para la tabla de logs,
-- lo que es necesario para que las actualizaciones en tiempo real funcionen correctamente.
ALTER TABLE public.logs REPLICA IDENTITY FULL;

-- Añadir la tabla de logs a la publicación de Supabase para tiempo real.
ALTER PUBLICATION supabase_realtime ADD TABLE public.logs;
