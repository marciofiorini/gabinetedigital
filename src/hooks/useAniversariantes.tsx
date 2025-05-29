
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Aniversariante {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  zona?: string;
  data_nascimento?: string;
}

export const useAniversariantes = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAniversariantes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const hoje = new Date();
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
      const diaHoje = String(hoje.getDate()).padStart(2, '0');

      console.log('Buscando aniversariantes para:', `${mesHoje}-${diaHoje}`);

      // Buscar aniversariantes usando extract para comparar mês e dia
      const { data, error } = await supabase
        .from('contatos')
        .select('id, nome, telefone, email, zona, data_nascimento')
        .eq('user_id', user.id)
        .not('data_nascimento', 'is', null)
        .filter('data_nascimento', 'not.is', null);

      if (error) {
        console.error('Erro ao buscar aniversariantes:', error);
        return;
      }

      // Filtrar aniversariantes do dia no frontend
      const aniversariantesHoje = data?.filter(contato => {
        if (!contato.data_nascimento) return false;
        
        const dataNascimento = new Date(contato.data_nascimento);
        const mesNascimento = String(dataNascimento.getMonth() + 1).padStart(2, '0');
        const diaNascimento = String(dataNascimento.getDate()).padStart(2, '0');
        
        return mesNascimento === mesHoje && diaNascimento === diaHoje;
      }) || [];

      console.log('Aniversariantes encontrados:', aniversariantesHoje);
      setAniversariantes(aniversariantesHoje);
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
