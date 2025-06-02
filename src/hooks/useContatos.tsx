
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Contato {
  id: string;
  user_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  zona?: string;
  data_nascimento?: string;
  tags?: string[];
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useContatos = () => {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchContatos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });

      if (error) throw error;
      setContatos(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContato = async (contato: Omit<Contato, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('contatos')
        .insert({
          ...contato,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      await fetchContatos();
      return data;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      return null;
    }
  };

  const updateContato = async (id: string, updates: Partial<Contato>) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchContatos();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      return false;
    }
  };

  const deleteContato = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchContatos();
      return true;
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchContatos();
  }, [user]);

  return {
    contatos,
    loading,
    fetchContatos,
    createContato,
    updateContato,
    deleteContato
  };
};
