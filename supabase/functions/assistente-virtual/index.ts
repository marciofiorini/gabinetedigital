
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const { mensagem, contexto } = await req.json();

    const systemPrompt = `Você é um assistente virtual especializado em consultoria política e gestão pública no Brasil. 

Seu papel é:
- Analisar dados políticos e fornecer insights estratégicos
- Sugerir estratégias de campanha e comunicação
- Ajudar na tomada de decisões baseada em dados
- Fornecer análises sobre engajamento, crescimento e tendências
- Dar recomendações práticas e aplicáveis

Contexto do usuário:
- Político ou gestor público brasileiro
- Tem acesso a dados de contatos, leads, demandas e redes sociais
- Busca insights para melhorar performance e engajamento

Responda de forma concisa, prática e focada em ações. Use dados quando disponíveis no contexto.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Contexto adicional: ${JSON.stringify(contexto || {})}. Pergunta: ${mensagem}` }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API erro: ${response.status}`);
    }

    const data = await response.json();
    const resposta = data.choices[0].message.content;

    // Determinar categoria da resposta
    let categoria = 'geral';
    const respostaLower = resposta.toLowerCase();
    
    if (respostaLower.includes('anális') || respostaLower.includes('dados') || respostaLower.includes('métricas')) {
      categoria = 'analise';
    } else if (respostaLower.includes('estratégia') || respostaLower.includes('recomend') || respostaLower.includes('sugest')) {
      categoria = 'estrategia';
    } else if (respostaLower.includes('crescimento') || respostaLower.includes('expand') || respostaLower.includes('aument')) {
      categoria = 'crescimento';
    }

    return new Response(JSON.stringify({ 
      resposta,
      categoria,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no assistente virtual:', error);
    return new Response(JSON.stringify({ 
      erro: error.message,
      resposta: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
      categoria: 'erro'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
