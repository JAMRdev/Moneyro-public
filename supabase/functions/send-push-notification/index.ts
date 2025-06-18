
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id, amount, category_name, user_avatar_url, user_name } =
      await req.json();

    if (!user_id || !amount || !category_name || !user_avatar_url || !user_name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Log: Fetching all subscriptions.
    const { data: subscriptions, error: subsError } = await supabaseAdmin
      .from("push_subscriptions")
      .select("subscription");

    if (subsError) {
      console.error("[Push Function] Error loading subscriptions from DB", subsError);
      throw subsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`[Push Function] No users subscribed for notifications.`);
      return new Response(
        JSON.stringify({ message: "No subscribed users to notify" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    console.log(`[Push Function] Found ${subscriptions.length} subscriptions to notify.`);

    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error("VAPID keys not configured in environment variables.");
      return new Response(
        JSON.stringify({ error: "VAPID keys not configured on server" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    webpush.setVapidDetails(
      "mailto:alejandromonsalver@gmail.com",
      vapidPublicKey,
      vapidPrivateKey
    );

    const siteUrl = Deno.env.get("SITE_URL") || Deno.env.get("SUPABASE_URL")?.replace('supabase.co','lovable.app');

    // Mensaje push
    const payloadData = {
      title: "Nueva Transacción Registrada",
      body: `${user_name} registró un gasto de ${new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(amount)} en ${category_name}.`,
      icon: user_avatar_url,
      data: {
        url: siteUrl,
      },
    };
    const notificationPayload = JSON.stringify(payloadData);

    // Logs previos y validador de formato
    let sendOK = 0, sendFail = 0;
    const sendPromises = subscriptions.map(async (s, idx) => {
      if (!s.subscription || typeof s.subscription !== "object") {
        console.error(`[Push Function] Subscription mal formada en índice ${idx}:`, JSON.stringify(s.subscription));
        sendFail++;
        return;
      }
      try {
        await webpush.sendNotification(s.subscription, notificationPayload);
        sendOK++;
        console.log(`[Push Function] Notificación enviada OK a endpoint:`, s.subscription.endpoint);
      } catch (err) {
        sendFail++;
        if (err.body) {
          console.error(`[Push Function] Error al enviar a endpoint ${s.subscription.endpoint}:`, err.body);
        } else {
          console.error(`[Push Function] Error genérico al enviar push a endpoint ${s.subscription.endpoint}:`, err);
        }
        // Eliminar lógica de borrado para debugging - opcional implementar luego
      }
    });

    await Promise.all(sendPromises);

    console.log(`[Push Function] Resultado: ${sendOK} enviadas | ${sendFail} fallidas`);

    return new Response(
      JSON.stringify({
        message: "Proceso de notificaciones terminado",
        total: subscriptions.length,
        exitosas: sendOK,
        fallidas: sendFail,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[Push Function] Error global:", error?.message || error);
    return new Response(JSON.stringify({ error: error?.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
