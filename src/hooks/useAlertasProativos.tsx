
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AlertaProativo {
  id: string;
  tipo: 'meta' | 'prazo' | 'anomalia' | 'oportunidade';
  titulo: string;
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  metrica_monitorada: string;
  valor_atual: number;
  valor_limite: number;
  ativo: boolean;
  data_criacao: string;
  data_ultima_verificacao: string;
}

export const useAlertasProativos = () => {
  const [alertas, setAlertas] = useState<AlertaProativo[]>([]);
  const [alertasAtivos, setAlertasAtivos] = useState<AlertaProativo[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const configurarAlertasPadrao = async () => {
    if (!user) return;

    const alertasPadrao: AlertaProativo[] = [
      {
        id: 'alerta-contatos-meta',
        tipo: 'meta',
        titulo: 'Meta de Contatos Mensais',
        descricao: 'Monitorar se a meta de novos contatos mensais está sendo atingida',
        severidade: 'media',
        metrica_monitorada: 'novos_contatos_mes',
        valor_atual: 0,
        valor_limite: 100,
        ativo: true,
        data_criacao: new Date().toISOString(),
        data_ultima_verificacao: new Date().toISOString()
      },
      {
        id: 'alerta-demandas-prazo',
        tipo: 'prazo',
        titulo: 'Demandas Próximas ao Vencimento',
        descricao: 'Alertar sobre demandas que vencem em 24 horas',
        severidade: 'alta',
        metrica_monitorada: 'demandas_vencimento_24h',
        valor_atual: 0,
        valor_limite: 0,
        ativo: true,
        data_criacao: new Date().toISOString(),
        data_ultima_verificacao: new Date().toISOString()
      },
      {
        id: 'alerta-engajamento-queda',
        tipo: 'anomalia',
        titulo: 'Queda no Engajamento',
        descricao: 'Detectar quedas significativas no engajamento das redes sociais',
        severidade: 'media',
        metrica_monitorada: 'engajamento_redes_sociais',
        valor_atual: 0,
        valor_limite: -20, // 20% de queda
        ativo: true,
        data_criacao: new Date().toISOString(),
        data_ultima_verificacao: new Date().toISOString()
      },
      {
        id: 'alerta-campanha-oportunidade',
        tipo: 'oportunidade',
        titulo: 'Oportunidade de Campanha',
        descricao: 'Identificar momentos ideais para lançar campanhas',
        severidade: 'baixa',
        metrica_monitorada: 'taxa_abertura_campanhas',
        valor_atual: 0,
        valor_limite: 25, // Taxa de abertura acima de 25%
        ativo: true,
        data_criacao: new Date().toISOString(),
        data_ultima_verificacao: new Date().toISOString()
      }
    ];

    setAlertas(alertasPadrao);
  };

  const verificarAlertas = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const novosAlertasAtivos: AlertaProativo[] = [];

      for (const alerta of alertas) {
        if (!alerta.ativo) continue;

        const valorAtual = await obterValorMetrica(alerta.metrica_monitorada);
        const alertaAtualizado = { ...alerta, valor_atual: valorAtual };

        let disparar = false;
        
        switch (alerta.tipo) {
          case 'meta':
            disparar = valorAtual < alerta.valor_limite;
            break;
          case 'prazo':
            disparar = valorAtual > alerta.valor_limite;
            break;
          case 'anomalia':
            disparar = valorAtual <= alerta.valor_limite;
            break;
          case 'oportunidade':
            disparar = valorAtual >= alerta.valor_limite;
            break;
        }

        if (disparar) {
          novosAlertasAtivos.push(alertaAtualizado);
          
          // Mostrar notificação
          toast({
            title: `🚨 ${alerta.titulo}`,
            description: alerta.descricao,
            variant: alerta.severidade === 'critica' || alerta.severidade === 'alta' ? 'destructive' : 'default'
          });

          // Salvar no banco de dados
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: alerta.titulo,
            message: alerta.descricao,
            type: alerta.severidade === 'critica' || alerta.severidade === 'alta' ? 'error' : 'warning'
          });
        }
      }

      setAlertasAtivos(novosAlertasAtivos);
      
      // Atualizar data da última verificação
      setAlertas(prev => prev.map(a => ({
        ...a,
        data_ultima_verificacao: new Date().toISOString()
      })));

    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const obterValorMetrica = async (metrica: string): Promise<number> => {
    switch (metrica) {
      case 'novos_contatos_mes':
        const { data: contatos } = await supabase
          .from('contatos')
          .select('id')
          .eq('user_id', user?.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
        return contatos?.length || 0;

      case 'demandas_vencimento_24h':
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        const { data: demandas } = await supabase
          .from('demandas')
          .select('id')
          .eq('user_id', user?.id)
          .eq('status', 'pendente')
          .lte('data_limite', amanha.toISOString());
        return demandas?.length || 0;

      case 'engajamento_redes_sociais':
        const { data: redesAtual } = await supabase
          .from('dados_redes_sociais')
          .select('engajamento_medio')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        const { data: redesAnterior } = await supabase
          .from('dados_redes_sociais')
          .select('engajamento_medio')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .range(1, 1);

        if (redesAtual?.[0] && redesAnterior?.[0]) {
          const engajamentoAtual = redesAtual[0].engajamento_medio || 0;
          const engajamentoAnterior = redesAnterior[0].engajamento_medio || 1;
          return ((engajamentoAtual - engajamentoAnterior) / engajamentoAnterior) * 100;
        }
        return 0;

      case 'taxa_abertura_campanhas':
        const { data: campanhas } = await supabase
          .from('campanhas_marketing')
          .select('total_enviados, total_abertos')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (campanhas && campanhas.length > 0) {
          const totalEnviados = campanhas.reduce((sum, c) => sum + (c.total_enviados || 0), 0);
          const totalAbertos = campanhas.reduce((sum, c) => sum + (c.total_abertos || 0), 0);
          return totalEnviados > 0 ? (totalAbertos / totalEnviados) * 100 : 0;
        }
        return 0;

      default:
        return 0;
    }
  };

  useEffect(() => {
    if (user) {
      configurarAlertasPadrao();
    }
  }, [user]);

  useEffect(() => {
    if (alertas.length > 0) {
      // Verificar alertas imediatamente
      verificarAlertas();
      
      // Configurar verificação automática a cada 15 minutos
      const interval = setInterval(verificarAlertas, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [alertas, user]);

  return { alertas, alertasAtivos, loading, verificarAlertas };
};
