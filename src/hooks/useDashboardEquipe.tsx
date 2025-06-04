
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MetricasEquipe {
  total_funcionarios: number;
  funcionarios_ativos: number;
  horas_trabalhadas_mes: number;
  tarefas_pendentes: number;
  tarefas_concluidas: number;
  avaliacoes_pendentes: number;
  folhas_processadas: number;
  total_salarios: number;
}

export interface ProdutividadeFuncionario {
  funcionario_id: string;
  funcionario_nome: string;
  tarefas_concluidas: number;
  horas_trabalhadas: number;
  nota_media_avaliacoes: number;
  produtividade_score: number;
}

export const useDashboardEquipe = () => {
  const [metricas, setMetricas] = useState<MetricasEquipe | null>(null);
  const [produtividade, setProdutividade] = useState<ProdutividadeFuncionario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetricas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar métricas básicas
      const [
        funcionariosResult,
        tarefasResult,
        avaliacoesResult,
        folhasResult,
        pontoResult
      ] = await Promise.all([
        // Total de funcionários
        supabase
          .from('funcionarios')
          .select('id, status')
          .eq('user_id', user.id),
        
        // Tarefas
        supabase
          .from('tarefas_equipe')
          .select('status')
          .eq('user_id', user.id),
        
        // Avaliações
        supabase
          .from('avaliacoes_desempenho')
          .select('status')
          .eq('user_id', user.id),
        
        // Folhas de pagamento
        supabase
          .from('folha_pagamento')
          .select('status, salario_liquido')
          .eq('user_id', user.id)
          .gte('mes_referencia', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
        
        // Ponto eletrônico (horas do mês)
        supabase
          .from('ponto_eletronico')
          .select('data_hora, tipo')
          .eq('user_id', user.id)
          .gte('data_hora', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      if (funcionariosResult.error) throw funcionariosResult.error;
      if (tarefasResult.error) throw tarefasResult.error;
      if (avaliacoesResult.error) throw avaliacoesResult.error;
      if (folhasResult.error) throw folhasResult.error;
      if (pontoResult.error) throw pontoResult.error;

      const funcionarios = funcionariosResult.data || [];
      const tarefas = tarefasResult.data || [];
      const avaliacoes = avaliacoesResult.data || [];
      const folhas = folhasResult.data || [];

      // Calcular horas trabalhadas (simplificado)
      const horasTrabalhadas = Math.round(Math.random() * 200 + 100); // Simulado por enquanto

      const metrics: MetricasEquipe = {
        total_funcionarios: funcionarios.length,
        funcionarios_ativos: funcionarios.filter(f => f.status === 'ativo').length,
        horas_trabalhadas_mes: horasTrabalhadas,
        tarefas_pendentes: tarefas.filter(t => t.status === 'pendente').length,
        tarefas_concluidas: tarefas.filter(t => t.status === 'concluida').length,
        avaliacoes_pendentes: avaliacoes.filter(a => a.status === 'pendente').length,
        folhas_processadas: folhas.filter(f => f.status === 'processada' || f.status === 'paga').length,
        total_salarios: folhas.reduce((sum, f) => sum + (f.salario_liquido || 0), 0)
      };

      setMetricas(metrics);
    } catch (error: any) {
      console.error('Erro ao buscar métricas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar métricas da equipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutividade = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar produtividade por funcionário
      const { data: funcionarios, error } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          tarefas_equipe(status),
          avaliacoes_desempenho(nota_geral)
        `)
        .eq('user_id', user.id)
        .eq('status', 'ativo');

      if (error) throw error;

      const produtividadeData = funcionarios?.map(func => {
        const tarefasConcluidas = func.tarefas_equipe?.filter((t: any) => t.status === 'concluida').length || 0;
        const horasSimuladas = Math.round(Math.random() * 50 + 20);
        const notaMedia = func.avaliacoes_desempenho?.reduce((sum: number, a: any) => sum + (a.nota_geral || 0), 0) / (func.avaliacoes_desempenho?.length || 1) || 0;
        
        return {
          funcionario_id: func.id,
          funcionario_nome: func.nome,
          tarefas_concluidas: tarefasConcluidas,
          horas_trabalhadas: horasSimuladas,
          nota_media_avaliacoes: notaMedia,
          produtividade_score: Math.round((tarefasConcluidas * 0.4 + horasSimuladas * 0.3 + notaMedia * 0.3) * 10) / 10
        };
      }) || [];

      setProdutividade(produtividadeData);
    } catch (error: any) {
      console.error('Erro ao buscar produtividade:', error);
    }
  };

  useEffect(() => {
    fetchMetricas();
    fetchProdutividade();
  }, []);

  return {
    metricas,
    produtividade,
    loading,
    fetchMetricas,
    fetchProdutividade,
    refetch: () => {
      fetchMetricas();
      fetchProdutividade();
    }
  };
};
