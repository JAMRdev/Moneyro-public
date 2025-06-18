
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { UserInactivityEmail } from "../send-inactivity-notifications/_templates/user-inactivity-email.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ManualEmailRequest {
  userEmail: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Starting manual email process");
    
    const { userEmail, userName }: ManualEmailRequest = await req.json();
    
    if (!userEmail || !userName) {
      throw new Error("userEmail and userName are required");
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const appUrl = "https://lhbafbeoiafmpnedqtjm.supabase.co";

    console.log(`📤 Preparing manual email for user: ${userEmail}`);

    const userEmailHtml = await renderAsync(
      React.createElement(UserInactivityEmail, {
        userName: userName,
        daysSinceLastTransaction: 0, // Manual email, no specific days
        lastTransactionDate: 'Manual',
        appUrl,
      })
    );

    const emailResult = await resend.emails.send({
      from: 'Carle\'s Finance <noreply@resend.dev>',
      to: [userEmail],
      subject: `💰 ¡Hola ${userName}! - Recordatorio de Carle's Finance`,
      html: userEmailHtml,
    });

    console.log("✅ Manual email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Manual email sent successfully",
        userEmail,
        userName,
        emailId: emailResult.data?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("💥 Error in send-manual-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Check function logs for more information"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
