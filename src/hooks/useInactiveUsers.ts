
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface InactiveUser {
  user_id: string;
  user_email: string; // Now matches CHARACTER VARYING(255) from SQL
  username: string;
  last_transaction_date: string;
  hours_since_last_transaction: number;
}

export const useInactiveUsers = () => {
  return useQuery({
    queryKey: ['inactive-users'],
    queryFn: async (): Promise<InactiveUser[]> => {
      console.log("🔍 Fetching inactive users...");
      
      const { data, error } = await supabase.rpc('get_inactive_users');
      
      if (error) {
        console.error("❌ Error fetching inactive users:", error);
        throw error;
      }
      
      console.log("✅ Inactive users fetched:", data?.length || 0);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};

export const useSendInactivityNotifications = () => {
  const sendNotifications = async () => {
    console.log("📤 Sending inactivity notifications...");
    
    const { data, error } = await supabase.functions.invoke('send-inactivity-notifications', {
      body: {}
    });

    if (error) {
      console.error("❌ Error sending notifications:", error);
      throw error;
    }

    console.log("✅ Notifications sent successfully:", data);
    return data;
  };

  return { sendNotifications };
};
