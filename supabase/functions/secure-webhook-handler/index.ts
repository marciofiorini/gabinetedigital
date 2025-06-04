
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { createHash, createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

interface WebhookData {
  type: 'lead' | 'contato' | 'demanda' | 'evento';
  action: 'created' | 'updated' | 'deleted';
  data: any;
  user_id: string;
  timestamp?: string;
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (clientId: string, maxRequests = 100, windowMs = 60000): boolean => {
  const now = Date.now();
  const current = rateLimitStore.get(clientId);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

const validateWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  if (!signature || !secret) return false;
  
  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
};

const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS chars
      .substring(0, 1000); // Limit length
  }
  
  if (Array.isArray(input)) {
    return input.slice(0, 100).map(sanitizeInput); // Limit array size
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      if (typeof key === 'string' && key.length <= 100) {
        sanitized[key] = sanitizeInput(value);
      }
    }
    return sanitized;
  }
  
  return input;
};

const validateWebhookData = (data: any): WebhookData => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid webhook data format');
  }
  
  const { type, action, data: payload, user_id } = data;
  
  if (!['lead', 'contato', 'demanda', 'evento'].includes(type)) {
    throw new Error('Invalid webhook type');
  }
  
  if (!['created', 'updated', 'deleted'].includes(action)) {
    throw new Error('Invalid webhook action');
  }
  
  if (!user_id || typeof user_id !== 'string') {
    throw new Error('Invalid user_id');
  }
  
  return {
    type,
    action,
    data: sanitizeInput(payload),
    user_id,
    timestamp: new Date().toISOString()
  };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  const clientId = req.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limiting
  if (!checkRateLimit(clientId)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: corsHeaders
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
    const bodyText = await req.text();
    
    // Validate webhook signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers.get('x-webhook-signature');
      if (!validateWebhookSignature(bodyText, signature || '', webhookSecret)) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: corsHeaders
        });
      }
    }

    let rawWebhookData;
    try {
      rawWebhookData = JSON.parse(bodyText);
    } catch (error) {
      throw new Error('Invalid JSON payload');
    }

    const webhookData = validateWebhookData(rawWebhookData);
    console.log('Valid webhook received:', { type: webhookData.type, action: webhookData.action, user_id: webhookData.user_id });

    // Send to Zapier if configured
    const zapierUrl = Deno.env.get('ZAPIER_WEBHOOK_URL');
    if (zapierUrl) {
      try {
        const zapierResponse = await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...webhookData,
            source: 'gabinete-digital'
          }),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (!zapierResponse.ok) {
          console.warn('Zapier webhook failed:', zapierResponse.status);
        } else {
          console.log('Webhook sent to Zapier successfully');
        }
      } catch (error) {
        console.error('Error sending to Zapier:', error);
      }
    }

    // Send email notification for high-priority events
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey && webhookData.type === 'demanda' && webhookData.action === 'created') {
      try {
        const { Resend } = await import('npm:resend@2.0.0');
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: 'Gabinete Digital <noreply@gabinetedigital.com>',
          to: ['admin@gabinetedigital.com'],
          subject: `Nova Demanda: ${webhookData.data.titulo || 'Sem título'}`,
          html: `
            <h2>Nova Demanda Recebida</h2>
            <p><strong>Título:</strong> ${webhookData.data.titulo || 'N/A'}</p>
            <p><strong>Descrição:</strong> ${webhookData.data.descricao || 'N/A'}</p>
            <p><strong>Categoria:</strong> ${webhookData.data.categoria || 'N/A'}</p>
            <p><strong>Prioridade:</strong> ${webhookData.data.prioridade || 'N/A'}</p>
            <p><strong>Solicitante:</strong> ${webhookData.data.solicitante || 'N/A'}</p>
            <p><strong>Timestamp:</strong> ${webhookData.timestamp}</p>
          `
        });
        console.log('Email notification sent');
      } catch (error) {
        console.error('Error sending email notification:', error);
      }
    }

    // Log webhook with additional security info
    await supabase.from('webhook_logs').insert({
      type: webhookData.type,
      action: webhookData.action,
      data: webhookData.data,
      user_id: webhookData.user_id,
      processed_at: webhookData.timestamp,
      client_ip: clientId,
      user_agent: req.headers.get('user-agent')?.substring(0, 500) || null
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        timestamp: webhookData.timestamp
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    
    // Don't expose internal error details
    const publicError = error.message?.includes('Invalid') ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ error: publicError }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('Invalid') ? 400 : 500
      }
    );
  }
};

serve(handler);
