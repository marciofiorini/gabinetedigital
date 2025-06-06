
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
  campanha_id?: string;
  destinatarios?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: NotificationRequest = await req.json();
    console.log('Sending notification:', notification);

    let sucessCount = 0;
    let errorCount = 0;
    const results = [];

    // Se for uma campanha com múltiplos destinatários
    const recipients = notification.destinatarios || [notification.recipient];

    for (const recipient of recipients) {
      try {
        if (notification.type === 'email') {
          await sendEmailNotification(recipient, notification);
          sucessCount++;
        } else if (notification.type === 'whatsapp') {
          await sendWhatsAppNotification(recipient, notification);
          sucessCount++;
        }
        
        results.push({ recipient, status: 'sent' });
      } catch (error) {
        errorCount++;
        results.push({ recipient, status: 'error', error: error.message });
        console.error(`Error sending to ${recipient}:`, error);
      }
    }

    // Atualizar estatísticas da campanha se for uma campanha
    if (notification.campanha_id && notification.user_id) {
      await updateCampaignStats(notification.campanha_id, sucessCount, errorCount);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notifications processed: ${sucessCount} sent, ${errorCount} failed`,
        details: results,
        stats: { sent: sucessCount, failed: errorCount }
      }),
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

async function sendEmailNotification(recipient: string, notification: NotificationRequest) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const { Resend } = await import('npm:resend@2.0.0');
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: 'Gabinete Digital <noreply@gabinetedigital.com>',
    to: [recipient],
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
}

async function sendWhatsAppNotification(recipient: string, notification: NotificationRequest) {
  const whatsappToken = Deno.env.get('WHATSAPP_API_TOKEN');
  const whatsappPhone = Deno.env.get('WHATSAPP_PHONE_NUMBER');
  
  if (!whatsappToken || !whatsappPhone) {
    throw new Error('WhatsApp credentials not configured');
  }

  const whatsappResponse = await fetch(`https://graph.facebook.com/v17.0/${whatsappPhone}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: recipient,
      text: {
        body: `${notification.title}\n\n${notification.message}`
      }
    })
  });

  if (!whatsappResponse.ok) {
    const error = await whatsappResponse.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }
}

async function updateCampaignStats(campanhaId: string, sentCount: number, errorCount: number) {
  try {
    // Aqui você atualizaria as estatísticas da campanha no Supabase
    console.log(`Updating campaign ${campanhaId}: ${sentCount} sent, ${errorCount} errors`);
    
    // Exemplo de como seria a atualização:
    // await supabase
    //   .from('campanhas_marketing')
    //   .update({
    //     total_enviados: sentCount,
    //     ultima_execucao: new Date().toISOString()
    //   })
    //   .eq('id', campanhaId);
  } catch (error) {
    console.error('Error updating campaign stats:', error);
  }
}

serve(handler);
