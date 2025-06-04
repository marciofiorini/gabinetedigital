
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnaliseSentimento {
  id: string;
  texto_analisado: string;
  fonte: string;
  url_origem: string | null;
  sentimento: string;
  score_sentimento: number;
  confianca: number;
  palavras_chave: string[];
  mencoes_encontradas: string[];
  data_publicacao: string | null;
  processed_at: string;
  created_at: string;
}

export const useAnaliseSegmento = () => {
  const [analises, setAnalises] = useState<AnaliseSentimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalises = async () => {
    try {
      const { data, error } = await supabase
        .from('analise_sentimento')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAnalises(data || []);
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar análises de sentimento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analisarTexto = async (texto: string, fonte: string, urlOrigem?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Simulação de análise de sentimento
      // Em produção, isso seria integrado com uma API de IA real
      const sentimentoResult = simularAnaliseIA(texto);

      const { data, error } = await supabase
        .from('analise_sentimento')
        .insert([{
          user_id: user.id,
          texto_analisado: texto,
          fonte,
          url_origem: urlOrigem || null,
          sentimento: sentimentoResult.sentimento,
          score_sentimento: sentimentoResult.score,
          confianca: sentimentoResult.confianca,
          palavras_chave: sentimentoResult.palavrasChave,
          mencoes_encontradas: sentimentoResult.mencoes,
          data_publicacao: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setAnalises(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Análise de sentimento realizada com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao analisar texto:', error);
      toast({
        title: "Erro",
        description: "Erro ao realizar análise de sentimento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const simularAnaliseIA = (texto: string) => {
    // Simulação simples de análise de sentimento
    const palavrasPositivas = ['bom', 'ótimo', 'excelente', 'maravilhoso', 'incrível', 'perfeito'];
    const palavrasNegativas = ['ruim', 'péssimo', 'horrível', 'terrível', 'lixo', 'nojento'];
    
    const textoLower = texto.toLowerCase();
    let scorePositivo = 0;
    let scoreNegativo = 0;
    const palavrasEncontradas: string[] = [];
    
    palavrasPositivas.forEach(palavra => {
      if (textoLower.includes(palavra)) {
        scorePositivo++;
        palavrasEncontradas.push(palavra);
      }
    });
    
    palavrasNegativas.forEach(palavra => {
      if (textoLower.includes(palavra)) {
        scoreNegativo++;
        palavrasEncontradas.push(palavra);
      }
    });
    
    const scoreFinal = (scorePositivo - scoreNegativo) / Math.max(scorePositivo + scoreNegativo, 1);
    let sentimento: string;
    
    if (scoreFinal > 0.1) {
      sentimento = 'positivo';
    } else if (scoreFinal < -0.1) {
      sentimento = 'negativo';
    } else {
      sentimento = 'neutro';
    }
    
    return {
      sentimento,
      score: Math.max(-1, Math.min(1, scoreFinal)),
      confianca: Math.min(0.9, 0.3 + (Math.abs(scoreFinal) * 0.6)),
      palavrasChave: palavrasEncontradas,
      mencoes: [] // Simples implementação não detecta menções
    };
  };

  const getResumoSentimentos = () => {
    const total = analises.length;
    if (total === 0) return { positivo: 0, negativo: 0, neutro: 0 };

    const positivo = analises.filter(a => a.sentimento === 'positivo').length;
    const negativo = analises.filter(a => a.sentimento === 'negativo').length;
    const neutro = analises.filter(a => a.sentimento === 'neutro').length;

    return {
      positivo: (positivo / total) * 100,
      negativo: (negativo / total) * 100,
      neutro: (neutro / total) * 100
    };
  };

  const getAnalisesPorFonte = () => {
    const analisesPorFonte: { [key: string]: number } = {};
    
    analises.forEach(analise => {
      analisesPorFonte[analise.fonte] = (analisesPorFonte[analise.fonte] || 0) + 1;
    });
    
    return analisesPorFonte;
  };

  useEffect(() => {
    fetchAnalises();
  }, []);

  return {
    analises,
    loading,
    analisarTexto,
    getResumoSentimentos,
    getAnalisesPorFonte,
    refetch: fetchAnalises
  };
};
