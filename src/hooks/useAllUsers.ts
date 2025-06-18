
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AppUser {
  user_id: string;
  user_email: string; // Now matches CHARACTER VARYING(255) from SQL
  username: string;
  role: string;
  created_at: string;
  last_transaction_date: string | null;
  hours_since_last_transaction: number | null;
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: async (): Promise<AppUser[]> => {
      console.log("🔍 Fetching all users...");
      
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        console.error("❌ Error fetching all users:", error);
        throw error;
      }
      
      console.log("✅ All users fetched:", data?.length || 0);
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSendManualEmail = () => {
  const sendManualEmail = async (userEmail: string, userName: string) => {
    console.log(`📤 Sending manual email to ${userEmail}...`);
    
    const { data, error } = await supabase.functions.invoke('send-manual-email', {
      body: { userEmail, userName }
    });

    if (error) {
      console.error("❌ Error sending manual email:", error);
      throw error;
    }

    console.log("✅ Manual email sent successfully:", data);
    return data;
  };

  return { sendManualEmail };
};
