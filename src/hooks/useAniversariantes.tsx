
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Aniversariante {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  zona: string | null;
  data_nascimento: string;
}

export const useAniversariantes = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAniversariantes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar contatos que fazem aniversário hoje
      const hoje = new Date();
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
      const diaHoje = String(hoje.getDate()).padStart(2, '0');

      const { data, error } = await supabase
        .from('contatos')
        .select('id, nome, telefone, email, zona, data_nascimento')
        .eq('user_id', user.id)
        .not('data_nascimento', 'is', null)
        .like('data_nascimento', `%-${mesHoje}-${diaHoje}`);

      if (error) {
        console.error('Erro ao buscar aniversariantes:', error);
        return;
      }

      const aniversariantesHoje = data || [];
      setAniversariantes(aniversariantesHoje);

      // Se há aniversariantes e é a primeira verificação do dia, criar notificação
      if (aniversariantesHoje.length > 0) {
        const ultimaNotificacao = localStorage.getItem('ultima_notificacao_aniversarios');
        const dataHoje = hoje.toDateString();
        
        if (ultimaNotificacao !== dataHoje) {
          // Criar notificação
          const { error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: user.id,
              title: 'Aniversariantes do Dia',
              message: `Hoje ${aniversariantesHoje.length} ${aniversariantesHoje.length === 1 ? 'pessoa faz' : 'pessoas fazem'} aniversário: ${aniversariantesHoje.map(a => a.nome).join(', ')}`,
              type: 'info'
            });

          if (!notifError) {
            localStorage.setItem('ultima_notificacao_aniversarios', dataHoje);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAniversariantes();
  }, [user]);

  return {
    aniversariantes,
    loading,
    refetch: fetchAniversariantes
  };
};
