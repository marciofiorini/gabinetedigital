
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KpiPersonalizado {
  id: string;
  nome: string;
  descricao: string;
  tipo_metrica: string;
  fonte_dados: string;
  configuracao: any;
  meta_valor: number | null;
  cor_display: string;
  ativo: boolean;
  ordem_exibicao: number;
  created_at: string;
  updated_at: string;
}

interface HistoricoKpi {
  id: string;
  kpi_id: string;
  data_coleta: string;
  valor: number;
  valor_anterior: number | null;
  variacao_absoluta: number | null;
  variacao_percentual: number | null;
  created_at: string;
}

export const useKpisPersonalizados = () => {
  const [kpis, setKpis] = useState<KpiPersonalizado[]>([]);
  const [historico, setHistorico] = useState<HistoricoKpi[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchKpis = async () => {
    try {
      const { data, error } = await supabase
        .from('kpis_personalizados')
        .select('*')
        .eq('ativo', true)
        .order('ordem_exibicao', { ascending: true });

      if (error) throw error;
      setKpis(data || []);
    } catch (error) {
      console.error('Erro ao buscar KPIs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar KPIs personalizados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorico = async (kpiId: string) => {
    try {
      const { data, error } = await supabase
        .from('historico_kpis')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('data_coleta', { ascending: false })
        .limit(30);

      if (error) throw error;
      setHistorico(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico do KPI",
        variant: "destructive",
      });
    }
  };

  const createKpi = async (kpi: Omit<KpiPersonalizado, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('kpis_personalizados')
        .insert([{ ...kpi, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setKpis(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "KPI criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar KPI:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar KPI",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateKpi = async (id: string, updates: Partial<KpiPersonalizado>) => {
    try {
      const { data, error } = await supabase
        .from('kpis_personalizados')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setKpis(prev => prev.map(kpi => kpi.id === id ? data : kpi));
      toast({
        title: "Sucesso",
        description: "KPI atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar KPI:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar KPI",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteKpi = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kpis_personalizados')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKpis(prev => prev.filter(kpi => kpi.id !== id));
      toast({
        title: "Sucesso",
        description: "KPI removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar KPI:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover KPI",
        variant: "destructive",
      });
      throw error;
    }
  };

  const calcularValorKpi = async (kpi: KpiPersonalizado): Promise<number> => {
    try {
      // Lógica para calcular o valor do KPI baseado na fonte de dados
      const hoje = new Date().toISOString().split('T')[0];
      
      switch (kpi.fonte_dados) {
        case 'contatos':
          const { count: totalContatos } = await supabase
            .from('contatos')
            .select('*', { count: 'exact', head: true });
          return totalContatos || 0;
          
        case 'leads':
          const { count: totalLeads } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });
          return totalLeads || 0;
          
        case 'eventos':
          const { count: totalEventos } = await supabase
            .from('eventos')
            .select('*', { count: 'exact', head: true })
            .gte('data_hora', hoje);
          return totalEventos || 0;
          
        case 'demandas':
          const { count: totalDemandas } = await supabase
            .from('demandas')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente');
          return totalDemandas || 0;
          
        default:
          return 0;
      }
    } catch (error) {
      console.error('Erro ao calcular valor do KPI:', error);
      return 0;
    }
  };

  const coletarDadosKpi = async (kpiId: string) => {
    try {
      const kpi = kpis.find(k => k.id === kpiId);
      if (!kpi) return;

      const valor = await calcularValorKpi(kpi);
      const hoje = new Date().toISOString().split('T')[0];

      // Buscar valor anterior
      const { data: ultimoHistorico } = await supabase
        .from('historico_kpis')
        .select('valor')
        .eq('kpi_id', kpiId)
        .order('data_coleta', { ascending: false })
        .limit(1)
        .single();

      const valorAnterior = ultimoHistorico?.valor || 0;
      const variacaoAbsoluta = valor - valorAnterior;
      const variacaoPercentual = valorAnterior > 0 ? (variacaoAbsoluta / valorAnterior) * 100 : 0;

      const { error } = await supabase
        .from('historico_kpis')
        .insert([{
          kpi_id: kpiId,
          data_coleta: hoje,
          valor,
          valor_anterior: valorAnterior,
          variacao_absoluta: variacaoAbsoluta,
          variacao_percentual: variacaoPercentual
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dados do KPI coletados com sucesso",
      });
    } catch (error) {
      console.error('Erro ao coletar dados do KPI:', error);
      toast({
        title: "Erro",
        description: "Erro ao coletar dados do KPI",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return {
    kpis,
    historico,
    loading,
    createKpi,
    updateKpi,
    deleteKpi,
    fetchHistorico,
    calcularValorKpi,
    coletarDadosKpi,
    refetch: fetchKpis
  };
};
