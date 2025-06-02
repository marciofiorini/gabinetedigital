
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  title: string;
  message: string;
  type: 'email' | 'whatsapp' | 'push';
  recipient: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: NotificationRequest = await req.json();
    console.log('Sending notification:', notification);

    if (notification.type === 'email') {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      if (!resendKey) {
        throw new Error('RESEND_API_KEY not configured');
      }

      const { Resend } = await import('npm:resend@2.0.0');
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: 'Gabinete Digital <noreply@gabinetedigital.com>',
        to: [notification.recipient],
        subject: notification.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${notification.title}</h2>
            <p style="color: #666; line-height: 1.6;">${notification.message}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Enviado pelo Gabinete Digital
            </p>
          </div>
        `
      });

    } else if (notification.type === 'whatsapp') {
      const whatsappToken = Deno.env.get('WHATSAPP_API_TOKEN');
      const whatsappPhone = Deno.env.get('WHATSAPP_PHONE_NUMBER');
      
      if (!whatsappToken || !whatsappPhone) {
        throw new Error('WhatsApp credentials not configured');
      }

      // Simulated WhatsApp API call - replace with actual API
      const whatsappResponse = await fetch(`https://graph.facebook.com/v17.0/${whatsappPhone}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: notification.recipient,
          text: {
            body: `${notification.title}\n\n${notification.message}`
          }
        })
      });

      if (!whatsappResponse.ok) {
        throw new Error('Failed to send WhatsApp message');
      }

    } else if (notification.type === 'push') {
      // Implementar notificações push (Web Push API)
      console.log('Push notification would be sent here');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
};

serve(handler);
