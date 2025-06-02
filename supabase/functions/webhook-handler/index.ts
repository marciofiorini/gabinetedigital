
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookData {
  type: 'lead' | 'contato' | 'demanda' | 'evento';
  action: 'created' | 'updated' | 'deleted';
  data: any;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookData: WebhookData = await req.json();
    console.log('Webhook received:', webhookData);

    // Enviar para Zapier se configurado
    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    if (zapierUrl) {
      await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...webhookData,
          timestamp: new Date().toISOString(),
          source: 'gabinete-digital'
        })
      });
      console.log('Webhook sent to Zapier');
    }

    // Enviar notificação por email se configurado
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey && webhookData.type === 'demanda' && webhookData.action === 'created') {
      const { Resend } = await import('npm:resend@2.0.0');
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: 'Gabinete Digital <noreply@gabinetedigital.com>',
        to: ['admin@gabinetedigital.com'],
        subject: `Nova Demanda: ${webhookData.data.titulo}`,
        html: `
          <h2>Nova Demanda Recebida</h2>
          <p><strong>Título:</strong> ${webhookData.data.titulo}</p>
          <p><strong>Descrição:</strong> ${webhookData.data.descricao || 'N/A'}</p>
          <p><strong>Categoria:</strong> ${webhookData.data.categoria || 'N/A'}</p>
          <p><strong>Prioridade:</strong> ${webhookData.data.prioridade}</p>
          <p><strong>Solicitante:</strong> ${webhookData.data.solicitante || 'N/A'}</p>
        `
      });
      console.log('Email notification sent');
    }

    // Log do webhook no banco
    await supabase.from('webhook_logs').insert({
      type: webhookData.type,
      action: webhookData.action,
      data: webhookData.data,
      user_id: webhookData.user_id,
      processed_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Webhook processing error:', error);
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
