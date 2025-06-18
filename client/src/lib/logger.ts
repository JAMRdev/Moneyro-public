
import { supabase } from '@/integrations/supabase/client';

type LogDetails = {
    action: string;
    location: string;
    details?: Record<string, any>;
};

export const logActivity = async (logDetails: LogDetails) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { action, location, details } = logDetails;

    // Simple device info. Could be expanded.
    const deviceInfo = navigator.userAgent;

    const { error } = await supabase.from('logs').insert({
        user_id: session.user.id,
        user_email: session.user.email,
        action,
        location,
        details,
        device_info: deviceInfo,
    });

    if (error) {
        console.error('Error logging activity:', error);
    }
};
