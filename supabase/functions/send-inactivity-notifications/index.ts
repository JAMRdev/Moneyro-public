
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { UserInactivityEmail } from "./_templates/user-inactivity-email.tsx";
import { AdminNotificationEmail } from "./_templates/admin-notification-email.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InactiveUser {
  user_id: string;
  user_email: string;
  username: string;
  last_transaction_date: string;
  hours_since_last_transaction: number;
}

interface AdminUser {
  user_id: string;
  user_email: string;
  username: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Starting inactivity notification process");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const appUrl = "https://lhbafbeoiafmpnedqtjm.supabase.co";

    // Get inactive users
    console.log("📊 Fetching inactive users...");
    const { data: inactiveUsers, error: inactiveError } = await supabase.rpc('get_inactive_users');
    
    if (inactiveError) {
      console.error("❌ Error fetching inactive users:", inactiveError);
      throw inactiveError;
    }

    if (!inactiveUsers || inactiveUsers.length === 0) {
      console.log("✅ No inactive users found");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No inactive users found",
          inactiveUsersCount: 0 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`📧 Found ${inactiveUsers.length} inactive users`);

    // Get admin users
    console.log("👑 Fetching admin users...");
    const { data: adminUsers, error: adminError } = await supabase.rpc('get_admin_users');
    
    if (adminError) {
      console.error("❌ Error fetching admin users:", adminError);
      throw adminError;
    }

    const emailPromises: Promise<any>[] = [];
    const notificationRecords: any[] = [];

    // Send emails to inactive users
    for (const user of inactiveUsers as InactiveUser[]) {
      try {
        const daysSinceLastTransaction = Math.floor(user.hours_since_last_transaction / 24);
        const lastTransactionDate = new Date(user.last_transaction_date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        console.log(`📤 Preparing email for user: ${user.user_email}`);

        const userEmailHtml = await renderAsync(
          React.createElement(UserInactivityEmail, {
            userName: user.username || 'Usuario',
            daysSinceLastTransaction,
            lastTransactionDate,
            appUrl,
          })
        );

        const userEmailPromise = resend.emails.send({
          from: 'Carle\'s Finance <noreply@resend.dev>',
          to: [user.user_email],
          subject: `💰 ¡Te echamos de menos! - ${daysSinceLastTransaction} días sin registros`,
          html: userEmailHtml,
        });

        emailPromises.push(userEmailPromise);

        // Prepare notification record
        notificationRecords.push({
          user_id: user.user_id,
          last_transaction_date: user.last_transaction_date,
        });

      } catch (error) {
        console.error(`❌ Error preparing email for user ${user.user_email}:`, error);
      }
    }

    // Send emails to admins
    if (adminUsers && adminUsers.length > 0) {
      const inactiveUsersForAdmin = (inactiveUsers as InactiveUser[]).map(user => ({
        userName: user.username || 'Usuario sin nombre',
        userEmail: user.user_email,
        daysSinceLastTransaction: Math.floor(user.hours_since_last_transaction / 24),
        lastTransactionDate: new Date(user.last_transaction_date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));

      for (const admin of adminUsers as AdminUser[]) {
        try {
          console.log(`👑 Preparing admin email for: ${admin.user_email}`);

          const adminEmailHtml = await renderAsync(
            React.createElement(AdminNotificationEmail, {
              adminName: admin.username || 'Administrador',
              inactiveUsers: inactiveUsersForAdmin,
              appUrl,
            })
          );

          const adminEmailPromise = resend.emails.send({
            from: 'Carle\'s Finance Admin <noreply@resend.dev>',
            to: [admin.user_email],
            subject: `🔔 Reporte de usuarios inactivos - ${inactiveUsers.length} usuarios`,
            html: adminEmailHtml,
          });

          emailPromises.push(adminEmailPromise);

        } catch (error) {
          console.error(`❌ Error preparing admin email for ${admin.user_email}:`, error);
        }
      }
    }

    // Send all emails
    console.log(`📬 Sending ${emailPromises.length} emails...`);
    const emailResults = await Promise.allSettled(emailPromises);
    
    let successCount = 0;
    let errorCount = 0;

    emailResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
        console.log(`✅ Email ${index + 1} sent successfully`);
      } else {
        errorCount++;
        console.error(`❌ Email ${index + 1} failed:`, result.reason);
      }
    });

    // Record notifications in database
    if (notificationRecords.length > 0) {
      console.log("💾 Recording notifications in database...");
      const { error: insertError } = await supabase
        .from('inactivity_notifications')
        .insert(notificationRecords);

      if (insertError) {
        console.error("❌ Error recording notifications:", insertError);
      } else {
        console.log("✅ Notifications recorded successfully");
      }
    }

    console.log(`🎉 Process completed! Success: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inactivity notifications sent successfully",
        inactiveUsersCount: inactiveUsers.length,
        emailsSent: successCount,
        emailsFaile: errorCount,
        adminUsersNotified: adminUsers?.length || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("💥 Fatal error in send-inactivity-notifications function:", error);
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
