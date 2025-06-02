
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Evento {
  id: string;
  user_id: string;
  titulo: string;
  descricao?: string;
  data_hora: string;
  tipo: string;
  google_event_id?: string;
  sincronizado: boolean;
  created_at: string;
  updated_at: string;
}

export const useEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEventos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_hora', { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvento = async (evento: Omit<Evento, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'sincronizado'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('eventos')
        .insert({
          ...evento,
          user_id: user.id,
          sincronizado: false
        })
        .select()
        .single();

      if (error) throw error;
      await fetchEventos();
      return data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return null;
    }
  };

  const updateEvento = async (id: string, updates: Partial<Evento>) => {
    try {
      const { error } = await supabase
        .from('eventos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchEventos();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return false;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEventos();
      return true;
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [user]);

  return {
    eventos,
    loading,
    fetchEventos,
    createEvento,
    updateEvento,
    deleteEvento
  };
};
