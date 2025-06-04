
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RegistroPresenca {
  id: string;
  funcionario_id: string;
  data: string;
  entrada: string;
  saida?: string;
  horas_trabalhadas?: number;
  status: 'presente' | 'ausente' | 'atrasado' | 'falta_justificada';
  observacoes?: string;
  funcionario?: {
    nome: string;
    cargo: string;
  };
}

export const usePresencaEquipe = () => {
  const [registros, setRegistros] = useState<RegistroPresenca[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistros = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar registros de ponto com informações do funcionário
      const { data, error } = await supabase
        .from('ponto_eletronico')
        .select(`
          *,
          funcionario:funcionarios(nome, cargo)
        `)
        .eq('user_id', user.id)
        .order('data_hora', { ascending: false });

      if (error) throw error;

      // Processar dados para formato de presença
      const registrosPresenca = processarRegistrosPonto(data || []);
      setRegistros(registrosPresenca);
    } catch (error: any) {
      console.error('Erro ao buscar registros de presença:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar registros de presença",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processarRegistrosPonto = (registrosPonto: any[]): RegistroPresenca[] => {
    const registrosPorDia = new Map();

    registrosPonto.forEach(registro => {
      const data = new Date(registro.data_hora).toDateString();
      if (!registrosPorDia.has(data)) {
        registrosPorDia.set(data, {
          funcionario_id: registro.funcionario_id,
          data,
          entradas: [],
          saidas: [],
          funcionario: registro.funcionario
        });
      }

      if (registro.tipo === 'entrada') {
        registrosPorDia.get(data).entradas.push(registro.data_hora);
      } else {
        registrosPorDia.get(data).saidas.push(registro.data_hora);
      }
    });

    return Array.from(registrosPorDia.values()).map((dia, index) => ({
      id: `presenca-${index}`,
      funcionario_id: dia.funcionario_id,
      data: dia.data,
      entrada: dia.entradas[0] || '',
      saida: dia.saidas[0] || undefined,
      horas_trabalhadas: dia.entradas[0] && dia.saidas[0] 
        ? Math.round((new Date(dia.saidas[0]).getTime() - new Date(dia.entradas[0]).getTime()) / (1000 * 60 * 60) * 100) / 100
        : undefined,
      status: dia.entradas.length > 0 ? 'presente' : 'ausente',
      funcionario: dia.funcionario
    })) as RegistroPresenca[];
  };

  const marcarPresenca = async (funcionarioId: string, tipo: 'entrada' | 'saida') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('ponto_eletronico')
        .insert([{
          user_id: user.id,
          funcionario_id: funcionarioId,
          tipo,
          data_hora: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso`
      });

      fetchRegistros();
    } catch (error: any) {
      console.error('Erro ao marcar presença:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  return {
    registros,
    loading,
    fetchRegistros,
    marcarPresenca,
    refetch: fetchRegistros
  };
};
