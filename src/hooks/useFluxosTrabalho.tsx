
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FluxoTrabalho {
  id: string;
  nome: string;
  trigger: 'nova_demanda' | 'demanda_urgente' | 'prazo_vencendo' | 'manual';
  acoes: FluxoAcao[];
  ativo: boolean;
  estatisticas: {
    executado: number;
    sucesso: number;
    falha: number;
  };
}

interface FluxoAcao {
  id: string;
  tipo: 'atribuir' | 'notificar' | 'mudar_status' | 'agendar_followup' | 'enviar_email';
  parametros: any;
  ordem: number;
}

export const useFluxosTrabalho = () => {
  const [fluxos, setFluxos] = useState<FluxoTrabalho[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const criarFluxoPadrao = async () => {
    if (!user) return;

    const fluxosPadrao: FluxoTrabalho[] = [
      {
        id: 'fluxo-demanda-nova',
        nome: 'Nova Demanda - Triagem Automática',
        trigger: 'nova_demanda',
        acoes: [
          {
            id: 'acao-1',
            tipo: 'atribuir',
            parametros: { responsavel: 'auto', criterio: 'categoria' },
            ordem: 1
          },
          {
            id: 'acao-2',
            tipo: 'notificar',
            parametros: { tipo: 'email', template: 'nova_demanda' },
            ordem: 2
          },
          {
            id: 'acao-3',
            tipo: 'agendar_followup',
            parametros: { dias: 3, tipo: 'verificacao' },
            ordem: 3
          }
        ],
        ativo: true,
        estatisticas: { executado: 0, sucesso: 0, falha: 0 }
      },
      {
        id: 'fluxo-demanda-urgente',
        nome: 'Demanda Urgente - Resposta Imediata',
        trigger: 'demanda_urgente',
        acoes: [
          {
            id: 'acao-1',
            tipo: 'mudar_status',
            parametros: { status: 'em_andamento' },
            ordem: 1
          },
          {
            id: 'acao-2',
            tipo: 'notificar',
            parametros: { tipo: 'push', prioridade: 'alta' },
            ordem: 2
          },
          {
            id: 'acao-3',
            tipo: 'atribuir',
            parametros: { responsavel: 'lider_equipe' },
            ordem: 3
          }
        ],
        ativo: true,
        estatisticas: { executado: 0, sucesso: 0, falha: 0 }
      }
    ];

    setFluxos(fluxosPadrao);
  };

  const executarFluxo = async (fluxoId: string, contexto: any) => {
    const fluxo = fluxos.find(f => f.id === fluxoId);
    if (!fluxo || !fluxo.ativo) return;

    try {
      for (const acao of fluxo.acoes.sort((a, b) => a.ordem - b.ordem)) {
        await executarAcao(acao, contexto);
      }

      // Atualizar estatísticas
      setFluxos(prev => prev.map(f => 
        f.id === fluxoId 
          ? { 
              ...f, 
              estatisticas: { 
                ...f.estatisticas, 
                executado: f.estatisticas.executado + 1,
                sucesso: f.estatisticas.sucesso + 1
              }
            }
          : f
      ));

      toast({
        title: "Fluxo Executado",
        description: `Fluxo "${fluxo.nome}" executado com sucesso`
      });
    } catch (error) {
      console.error('Erro ao executar fluxo:', error);
      
      setFluxos(prev => prev.map(f => 
        f.id === fluxoId 
          ? { 
              ...f, 
              estatisticas: { 
                ...f.estatisticas, 
                executado: f.estatisticas.executado + 1,
                falha: f.estatisticas.falha + 1
              }
            }
          : f
      ));
    }
  };

  const executarAcao = async (acao: FluxoAcao, contexto: any) => {
    switch (acao.tipo) {
      case 'atribuir':
        // Lógica para atribuir responsável automaticamente
        console.log('Atribuindo responsável:', acao.parametros);
        break;
      
      case 'notificar':
        // Lógica para enviar notificação
        console.log('Enviando notificação:', acao.parametros);
        break;
      
      case 'mudar_status':
        // Lógica para mudar status da demanda
        if (contexto.demandaId) {
          await supabase
            .from('demandas')
            .update({ status: acao.parametros.status })
            .eq('id', contexto.demandaId);
        }
        break;
      
      case 'agendar_followup':
        // Lógica para agendar follow-up
        console.log('Agendando follow-up:', acao.parametros);
        break;
      
      case 'enviar_email':
        // Lógica para enviar email
        console.log('Enviando email:', acao.parametros);
        break;
    }
  };

  const monitorarDemandas = async () => {
    if (!user) return;

    // Verificar novas demandas
    const { data: novasDemandas } = await supabase
      .from('demandas')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pendente')
      .gte('created_at', new Date(Date.now() - 60000).toISOString()); // Últimos 60 segundos

    if (novasDemandas && novasDemandas.length > 0) {
      for (const demanda of novasDemandas) {
        const trigger = demanda.prioridade === 'urgente' ? 'demanda_urgente' : 'nova_demanda';
        await executarFluxo(`fluxo-${trigger.replace('_', '-')}`, { demandaId: demanda.id });
      }
    }
  };

  useEffect(() => {
    if (user) {
      criarFluxoPadrao();
      
      // Monitorar demandas a cada 30 segundos
      const interval = setInterval(monitorarDemandas, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return { fluxos, loading, executarFluxo };
};
