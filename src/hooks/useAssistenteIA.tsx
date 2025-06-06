
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MensagemIA {
  id: string;
  tipo: 'usuario' | 'assistente';
  conteudo: string;
  timestamp: Date;
  categoria?: string;
}

interface ContextoIA {
  usuario_logado: boolean;
  pagina_atual?: string;
  dados_relevantes?: any;
  timestamp: string;
}

export const useAssistenteIA = () => {
  const [mensagens, setMensagens] = useState<MensagemIA[]>([]);
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  const enviarMensagem = async (mensagem: string, contexto?: ContextoIA) => {
    setCarregando(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('assistente-virtual', {
        body: {
          mensagem,
          contexto: contexto || {
            usuario_logado: true,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      return {
        resposta: data.resposta,
        categoria: data.categoria,
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('Erro ao comunicar com IA:', error);
      toast({
        title: "Erro",
        description: "Erro ao comunicar com o assistente virtual",
        variant: "destructive"
      });
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const obterSugestoes = (categoria: string) => {
    const sugestoesPorCategoria = {
      marketing: [
        'Como melhorar o engajamento no Instagram?',
        'Estratégias para campanhas no WhatsApp',
        'Análise de performance nas redes sociais'
      ],
      gestao: [
        'Análise de demandas por região',
        'Estratégias para eventos comunitários',
        'Otimização da agenda política'
      ],
      crescimento: [
        'Como expandir base de contatos?',
        'Estratégias de conversão de leads',
        'Análise de crescimento mensal'
      ]
    };

    return sugestoesPorCategoria[categoria as keyof typeof sugestoesPorCategoria] || [];
  };

  return {
    mensagens,
    carregando,
    enviarMensagem,
    obterSugestoes,
    setMensagens
  };
};
