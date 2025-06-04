
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Contato {
  id: string;
  user_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  zona?: string;
  data_nascimento?: string;
  observacoes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useContatos = () => {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContatos = async () => {
    try {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatos(data as Contato[] || []);
    } catch (error: any) {
      console.error('Erro ao buscar contatos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar contatos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createContato = async (contato: Omit<Contato, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('contatos')
        .insert([{ ...contato, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setContatos(prev => [data as Contato, ...prev]);
      return data as Contato;
    } catch (error: any) {
      console.error('Erro ao criar contato:', error);
      throw error;
    }
  };

  const updateContato = async (id: string, updates: Partial<Contato>) => {
    try {
      const { data, error } = await supabase
        .from('contatos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setContatos(prev => prev.map(c => c.id === id ? data as Contato : c));
      return data as Contato;
    } catch (error: any) {
      console.error('Erro ao atualizar contato:', error);
      throw error;
    }
  };

  const deleteContato = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContatos(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar contato:', error);
      return false;
    }
  };

  const refetch = fetchContatos;

  useEffect(() => {
    fetchContatos();
  }, []);

  return {
    contatos,
    loading,
    fetchContatos,
    createContato,
    updateContato,
    deleteContato,
    refetch
  };
};
