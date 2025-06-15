
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, TrendingUp, Calendar, MessageSquare, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  fonte?: string;
  status: string;
  interesse?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  lead_score?: number;
}

interface FollowUp {
  id: string;
  lead_id: string;
  tipo: string;
  data_agendada: string;
  status: string;
  descricao: string;
  assunto?: string;
}

export const CrmAdvanced = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [autoFollowUp, setAutoFollowUp] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeads();
      fetchFollowUps();
      setupAutomation();
    }
  }, [user]);

  const fetchLeads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  };

  const fetchFollowUps = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .select('*')
        .eq('user_id', user.id)
        .order('data_agendada', { ascending: true });

      if (error) throw error;
      setFollowUps(data || []);
    } catch (error) {
      console.error('Erro ao buscar follow-ups:', error);
    }
  };

  const calculateLeadScore = (lead: Lead): number => {
    let score = 0;
    
    // Pontuação baseada em dados completos
    if (lead.email) score += 20;
    if (lead.telefone) score += 20;
    if (lead.interesse) score += 30;
    
    // Pontuação baseada na fonte
    switch (lead.fonte) {
      case 'website': score += 15; break;
      case 'indicacao': score += 25; break;
      case 'evento': score += 20; break;
      case 'social_media': score += 10; break;
      default: score += 5;
    }
    
    // Pontuação baseada no tempo (leads recentes são mais valiosos)
    const daysOld = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysOld <= 1) score += 15;
    else if (daysOld <= 7) score += 10;
    else if (daysOld <= 30) score += 5;
    
    return Math.min(score, 100);
  };

  const updateLeadScore = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newScore = calculateLeadScore(lead);
    
    try {
      // Atualizar apenas localmente, pois a coluna lead_score pode não existir na tabela
      setLeads(prev => 
        prev.map(l => l.id === leadId ? { ...l, lead_score: newScore } : l)
      );
      
      toast.success(`Score calculado: ${newScore}`);
    } catch (error) {
      console.error('Erro ao atualizar score:', error);
    }
  };

  const setupAutomation = () => {
    // Automação de follow-ups baseada em regras
    if (autoFollowUp) {
      // Agendar follow-up automático para novos leads
      leads.forEach(lead => {
        if (lead.status === 'novo') {
          scheduleAutoFollowUp(lead);
        }
      });
    }
  };

  const scheduleAutoFollowUp = async (lead: Lead) => {
    if (!user) return;

    // Verifica se já existe um follow-up agendado
    const existingFollowUp = followUps.find(
      f => f.lead_id === lead.id && f.status === 'pendente'
    );
    
    if (existingFollowUp) return;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 1); // Agendar para o próximo dia

    try {
      const { error } = await supabase
        .from('follow_ups')
        .insert({
          user_id: user.id,
          lead_id: lead.id,
          tipo: 'email',
          data_agendada: followUpDate.toISOString(),
          status: 'pendente',
          descricao: 'Follow-up automático para novo lead',
          assunto: `Olá ${lead.nome}, vamos conversar?`
        });

      if (error) throw error;
      
      toast.success('Follow-up automático agendado!');
      fetchFollowUps();
    } catch (error) {
      console.error('Erro ao agendar follow-up:', error);
    }
  };

  const executeFollowUp = async (followUpId: string, tipo: string) => {
    try {
      const { error } = await supabase
        .from('follow_ups')
        .update({ status: 'executado' })
        .eq('id', followUpId);

      if (error) throw error;

      // Simulação de envio baseado no tipo
      switch (tipo) {
        case 'email':
          toast.success('Email enviado com sucesso!');
          break;
        case 'whatsapp':
          toast.success('Mensagem WhatsApp enviada!');
          break;
        case 'ligacao':
          toast.success('Lembrete de ligação criado!');
          break;
      }

      fetchFollowUps();
    } catch (error) {
      console.error('Erro ao executar follow-up:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      novo: 'default',
      qualificado: 'secondary',
      interessado: 'outline',
      negociacao: 'destructive',
      convertido: 'default'
    };
    return variants[status] || 'default';
  };

  const pendingFollowUps = followUps.filter(f => f.status === 'pendente');
  const todayFollowUps = pendingFollowUps.filter(f => 
    new Date(f.data_agendada).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Dashboard de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Follow-ups Hoje</p>
                <p className="text-2xl font-bold">{todayFollowUps.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">
                  {leads.length > 0 ? Math.round(
                    leads.reduce((acc, lead) => acc + (lead.lead_score || calculateLeadScore(lead)), 0) / leads.length
                  ) : 0}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold">
                  {leads.length > 0 ? Math.round(
                    (leads.filter(l => l.status === 'convertido').length / leads.length) * 100
                  ) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRM Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Leads */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>Gerencie seus leads com scoring automático</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead) => {
                const currentScore = lead.lead_score || calculateLeadScore(lead);
                return (
                  <div
                    key={lead.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{lead.nome}</h3>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getStatusBadge(lead.status)}>
                            {lead.status}
                          </Badge>
                          {lead.fonte && (
                            <Badge variant="outline">{lead.fonte}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className={`font-bold ${getScoreColor(currentScore)}`}>
                            {currentScore}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLeadScore(lead.id);
                          }}
                        >
                          Recalcular
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-ups</CardTitle>
            <CardDescription>Automação de relacionamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingFollowUps.slice(0, 10).map((followUp) => {
                const lead = leads.find(l => l.id === followUp.lead_id);
                return (
                  <div key={followUp.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{lead?.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {followUp.descricao}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(followUp.data_agendada).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executeFollowUp(followUp.id, 'email')}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executeFollowUp(followUp.id, 'whatsapp')}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executeFollowUp(followUp.id, 'ligacao')}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
