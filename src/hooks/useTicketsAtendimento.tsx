
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TicketAtendimento {
  id: string;
  user_id: string;
  contato_id?: string;
  numero_ticket: string;
  assunto: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  status: string;
  responsavel_id?: string;
  canal: string;
  tempo_resposta_sla?: number;
  data_resolucao?: string;
  satisfacao_nota?: number;
  satisfacao_comentario?: string;
  tags: string[];
  anexos: any[];
  created_at: string;
  updated_at: string;
}

interface MensagemTicket {
  id: string;
  ticket_id: string;
  autor_id: string;
  autor_tipo: string;
  mensagem: string;
  tipo: string;
  anexos: any[];
  created_at: string;
}

export const useTicketsAtendimento = () => {
  const [tickets, setTickets] = useState<TicketAtendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTickets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets_atendimento')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformar dados para o formato esperado
      const ticketsFormatados = data?.map(ticket => ({
        ...ticket,
        anexos: Array.isArray(ticket.anexos) ? ticket.anexos : [],
        tags: Array.isArray(ticket.tags) ? ticket.tags : []
      })) || [];
      
      setTickets(ticketsFormatados);
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const criarTicket = async (dados: { assunto: string; descricao: string; [key: string]: any }) => {
    if (!user) return;

    try {
      const ticket = {
        assunto: dados.assunto,
        descricao: dados.descricao,
        numero_ticket: '', // Será gerado automaticamente pelo trigger
        user_id: user.id,
        categoria: dados.categoria || 'geral',
        prioridade: dados.prioridade || 'media',
        status: dados.status || 'aberto',
        canal: dados.canal || 'sistema',
        ...dados
      };

      const { data, error } = await supabase
        .from('tickets_atendimento')
        .insert(ticket)
        .select()
        .single();

      if (error) throw error;

      const ticketFormatado = {
        ...data,
        anexos: Array.isArray(data.anexos) ? data.anexos : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };

      setTickets(prev => [ticketFormatado, ...prev]);
      toast({
        title: "Sucesso",
        description: "Ticket criado com sucesso!"
      });

      return ticketFormatado;
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ticket",
        variant: "destructive"
      });
    }
  };

  const atualizarTicket = async (id: string, updates: Partial<TicketAtendimento>) => {
    try {
      const { data, error } = await supabase
        .from('tickets_atendimento')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const ticketFormatado = {
        ...data,
        anexos: Array.isArray(data.anexos) ? data.anexos : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };

      setTickets(prev => prev.map(t => t.id === id ? ticketFormatado : t));
      toast({
        title: "Sucesso",
        description: "Ticket atualizado com sucesso!"
      });

      return ticketFormatado;
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ticket",
        variant: "destructive"
      });
    }
  };

  const buscarMensagensTicket = async (ticketId: string): Promise<MensagemTicket[]> => {
    try {
      const { data, error } = await supabase
        .from('mensagens_ticket')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return data?.map(msg => ({
        ...msg,
        anexos: Array.isArray(msg.anexos) ? msg.anexos : []
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar mensagens do ticket:', error);
      return [];
    }
  };

  const adicionarMensagemTicket = async (ticketId: string, mensagem: string, tipo: string = 'mensagem') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mensagens_ticket')
        .insert({
          ticket_id: ticketId,
          autor_id: user.id,
          autor_tipo: 'usuario',
          mensagem,
          tipo
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar mensagem",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    loading,
    criarTicket,
    atualizarTicket,
    buscarMensagensTicket,
    adicionarMensagemTicket,
    refetch: fetchTickets
  };
};
