
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RelatorioAutomatico {
  id: string;
  nome: string;
  tipo: 'dashboard' | 'kpi' | 'financeiro' | 'contatos' | 'campanhas';
  frequencia: 'diario' | 'semanal' | 'mensal' | 'trimestral';
  destinatarios: string[];
  formato: 'pdf' | 'excel' | 'email' | 'dashboard';
  configuracao: any;
  ativo: boolean;
  proxima_execucao: string;
  historico_execucoes: number;
}

export const useRelatoriosAutomaticos = () => {
  const [relatorios, setRelatorios] = useState<RelatorioAutomatico[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const criarRelatoriosPadrao = async () => {
    if (!user) return;

    const relatoriosPadrao: RelatorioAutomatico[] = [
      {
        id: 'rel-kpi-semanal',
        nome: 'Relatório de KPIs - Semanal',
        tipo: 'kpi',
        frequencia: 'semanal',
        destinatarios: [user.email || ''],
        formato: 'email',
        configuracao: {
          metricas: ['novos_contatos', 'demandas_resolvidas', 'engajamento_redes'],
          periodo: 7,
          comparativo: true
        },
        ativo: true,
        proxima_execucao: calcularProximaExecucao('semanal'),
        historico_execucoes: 0
      },
      {
        id: 'rel-dashboard-mensal',
        nome: 'Dashboard Executivo - Mensal',
        tipo: 'dashboard',
        frequencia: 'mensal',
        destinatarios: [user.email || ''],
        formato: 'pdf',
        configuracao: {
          secoes: ['overview', 'contatos', 'campanhas', 'financeiro'],
          graficos: true,
          detalhamento: 'alto'
        },
        ativo: true,
        proxima_execucao: calcularProximaExecucao('mensal'),
        historico_execucoes: 0
      },
      {
        id: 'rel-campanhas-mensal',
        nome: 'Performance de Campanhas - Mensal',
        tipo: 'campanhas',
        frequencia: 'mensal',
        destinatarios: [user.email || ''],
        formato: 'excel',
        configuracao: {
          metricas: ['taxa_abertura', 'taxa_clique', 'conversoes', 'roi'],
          comparativo_mes_anterior: true,
          segmentacao: true
        },
        ativo: true,
        proxima_execucao: calcularProximaExecucao('mensal'),
        historico_execucoes: 0
      }
    ];

    setRelatorios(relatoriosPadrao);
  };

  const calcularProximaExecucao = (frequencia: string): string => {
    const agora = new Date();
    switch (frequencia) {
      case 'diario':
        agora.setDate(agora.getDate() + 1);
        agora.setHours(8, 0, 0, 0);
        break;
      case 'semanal':
        agora.setDate(agora.getDate() + (7 - agora.getDay()) + 1); // Próxima segunda
        agora.setHours(8, 0, 0, 0);
        break;
      case 'mensal':
        agora.setMonth(agora.getMonth() + 1, 1);
        agora.setHours(8, 0, 0, 0);
        break;
      case 'trimestral':
        agora.setMonth(agora.getMonth() + 3, 1);
        agora.setHours(8, 0, 0, 0);
        break;
    }
    return agora.toISOString();
  };

  const gerarRelatorio = async (relatorio: RelatorioAutomatico) => {
    try {
      setLoading(true);
      
      // Buscar dados baseados no tipo de relatório
      let dados: any = {};
      
      switch (relatorio.tipo) {
        case 'kpi':
          dados = await buscarDadosKPI();
          break;
        case 'campanhas':
          dados = await buscarDadosCampanhas();
          break;
        case 'contatos':
          dados = await buscarDadosContatos();
          break;
        case 'financeiro':
          dados = await buscarDadosFinanceiro();
          break;
        default:
          dados = await buscarDadosDashboard();
      }

      // Simular geração do relatório
      const relatorioGerado = {
        id: `${relatorio.id}-${Date.now()}`,
        nome: relatorio.nome,
        data_geracao: new Date().toISOString(),
        dados: dados,
        formato: relatorio.formato
      };

      // Atualizar histórico
      setRelatorios(prev => prev.map(r => 
        r.id === relatorio.id 
          ? {
              ...r,
              historico_execucoes: r.historico_execucoes + 1,
              proxima_execucao: calcularProximaExecucao(r.frequencia)
            }
          : r
      ));

      toast({
        title: "Relatório Gerado",
        description: `${relatorio.nome} foi gerado com sucesso`
      });

      return relatorioGerado;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar relatório",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarDadosKPI = async () => {
    const { data: contatos } = await supabase
      .from('contatos')
      .select('*')
      .eq('user_id', user?.id);

    const { data: demandas } = await supabase
      .from('demandas')
      .select('*')
      .eq('user_id', user?.id);

    return {
      total_contatos: contatos?.length || 0,
      novos_contatos_semana: contatos?.filter(c => 
        new Date(c.created_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
      ).length || 0,
      demandas_pendentes: demandas?.filter(d => d.status === 'pendente').length || 0,
      demandas_resolvidas_semana: demandas?.filter(d => 
        d.status === 'concluida' && 
        new Date(d.updated_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
      ).length || 0
    };
  };

  const buscarDadosCampanhas = async () => {
    const { data: campanhas } = await supabase
      .from('campanhas_marketing')
      .select('*')
      .eq('user_id', user?.id);

    return {
      total_campanhas: campanhas?.length || 0,
      campanhas_ativas: campanhas?.filter(c => c.status === 'ativa').length || 0,
      total_enviados: campanhas?.reduce((sum, c) => sum + (c.total_enviados || 0), 0) || 0,
      total_abertos: campanhas?.reduce((sum, c) => sum + (c.total_abertos || 0), 0) || 0,
      taxa_abertura_media: campanhas?.length > 0 
        ? (campanhas.reduce((sum, c) => sum + ((c.total_abertos || 0) / Math.max(c.total_enviados || 1, 1)), 0) / campanhas.length * 100).toFixed(2)
        : 0
    };
  };

  const buscarDadosContatos = async () => {
    const { data: contatos } = await supabase
      .from('contatos')
      .select('*')
      .eq('user_id', user?.id);

    return {
      total_contatos: contatos?.length || 0,
      por_zona: contatos?.reduce((acc, c) => {
        const zona = c.zona || 'Não informado';
        acc[zona] = (acc[zona] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {}
    };
  };

  const buscarDadosFinanceiro = async () => {
    const { data: prestacaoContas } = await supabase
      .from('prestacao_contas')
      .select('*')
      .eq('user_id', user?.id);

    return {
      total_gastos: prestacaoContas?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0,
      gastos_mes_atual: prestacaoContas?.filter(p => 
        new Date(p.created_at).getMonth() === new Date().getMonth()
      ).reduce((sum, p) => sum + (p.valor || 0), 0) || 0
    };
  };

  const buscarDadosDashboard = async () => {
    const kpi = await buscarDadosKPI();
    const campanhas = await buscarDadosCampanhas();
    const contatos = await buscarDadosContatos();
    const financeiro = await buscarDadosFinanceiro();

    return { kpi, campanhas, contatos, financeiro };
  };

  const verificarExecucoesPendentes = async () => {
    const agora = new Date();
    
    for (const relatorio of relatorios) {
      if (relatorio.ativo && new Date(relatorio.proxima_execucao) <= agora) {
        await gerarRelatorio(relatorio);
      }
    }
  };

  useEffect(() => {
    if (user) {
      criarRelatoriosPadrao();
      
      // Verificar execuções pendentes a cada hora
      const interval = setInterval(verificarExecucoesPendentes, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return { relatorios, loading, gerarRelatorio };
};
