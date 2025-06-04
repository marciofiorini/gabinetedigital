
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PrevisaoIA {
  id: string;
  tipo_previsao: string;
  periodo_analise: string;
  dados_entrada: any;
  previsao_resultado: any;
  confianca_previsao: number;
  metodologia: string;
  status: string;
  erro_detalhes: string | null;
  valida_ate: string | null;
  created_at: string;
  updated_at: string;
}

export const usePrevisoes = () => {
  const [previsoes, setPrevisoes] = useState<PrevisaoIA[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrevisoes = async () => {
    try {
      const { data, error } = await supabase
        .from('previsoes_ia')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrevisoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar previsões:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar previsões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const criarPrevisao = async (
    tipoPrevisao: string,
    periodoAnalise: string,
    dadosEntrada: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Simular processamento de IA
      const resultado = await simularPrevisaoIA(tipoPrevisao, periodoAnalise, dadosEntrada);

      const { data, error } = await supabase
        .from('previsoes_ia')
        .insert([{
          user_id: user.id,
          tipo_previsao: tipoPrevisao,
          periodo_analise: periodoAnalise,
          dados_entrada: dadosEntrada,
          previsao_resultado: resultado.previsao,
          confianca_previsao: resultado.confianca,
          metodologia: resultado.metodologia,
          status: 'concluido',
          valida_ate: resultado.validaAte
        }])
        .select()
        .single();

      if (error) throw error;

      setPrevisoes(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Previsão criada com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar previsão:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar previsão",
        variant: "destructive",
      });
      throw error;
    }
  };

  const simularPrevisaoIA = async (tipo: string, periodo: string, dados: any) => {
    // Simulação de diferentes tipos de previsão
    const agora = new Date();
    const validaAte = new Date();
    
    // Definir validade baseada no período
    switch (periodo) {
      case '30d':
        validaAte.setDate(agora.getDate() + 30);
        break;
      case '90d':
        validaAte.setDate(agora.getDate() + 90);
        break;
      case '6m':
        validaAte.setMonth(agora.getMonth() + 6);
        break;
      case '1y':
        validaAte.setFullYear(agora.getFullYear() + 1);
        break;
    }

    let previsao: any = {};
    let confianca = 0.75;
    let metodologia = 'regressao_linear';

    switch (tipo) {
      case 'eleitoral':
        previsao = {
          votos_estimados: Math.floor(Math.random() * 50000) + 10000,
          percentual_estimado: (Math.random() * 20 + 10).toFixed(2),
          tendencia: Math.random() > 0.5 ? 'crescimento' : 'declinio',
          fatores_influencia: ['economia', 'saude_publica', 'seguranca'],
          cenarios: {
            otimista: '25.5%',
            realista: '20.3%',
            pessimista: '15.8%'
          }
        };
        confianca = 0.68;
        metodologia = 'random_forest';
        break;
        
      case 'engajamento':
        previsao = {
          crescimento_seguidores: Math.floor(Math.random() * 5000) + 500,
          taxa_engajamento: (Math.random() * 5 + 2).toFixed(2) + '%',
          alcance_estimado: Math.floor(Math.random() * 100000) + 20000,
          melhores_horarios: ['18:00-20:00', '12:00-14:00'],
          conteudo_recomendado: ['politicas_publicas', 'eventos_comunidade']
        };
        confianca = 0.82;
        metodologia = 'neural_network';
        break;
        
      case 'crescimento':
        previsao = {
          novos_contatos: Math.floor(Math.random() * 1000) + 200,
          conversao_leads: (Math.random() * 15 + 5).toFixed(2) + '%',
          eventos_sugeridos: Math.floor(Math.random() * 20) + 5,
          areas_expansao: ['zona_norte', 'centro'],
          investimento_sugerido: 'R$ ' + (Math.random() * 50000 + 10000).toLocaleString('pt-BR')
        };
        confianca = 0.71;
        break;
    }

    return {
      previsao,
      confianca,
      metodologia,
      validaAte: validaAte.toISOString()
    };
  };

  const atualizarPrevisao = async (id: string, updates: Partial<PrevisaoIA>) => {
    try {
      const { data, error } = await supabase
        .from('previsoes_ia')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPrevisoes(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Sucesso",
        description: "Previsão atualizada com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar previsão:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar previsão",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletarPrevisao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('previsoes_ia')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrevisoes(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Previsão removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar previsão:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover previsão",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPrevisoes();
  }, []);

  return {
    previsoes,
    loading,
    criarPrevisao,
    atualizarPrevisao,
    deletarPrevisao,
    refetch: fetchPrevisoes
  };
};
