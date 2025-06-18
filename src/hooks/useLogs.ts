
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Log } from '@/types';

const fetchLogs = async (): Promise<Log[]> => {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Log[];
};

export const useLogs = () => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: fetchLogs,
  });
};
