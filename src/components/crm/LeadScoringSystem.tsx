
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, User, Phone, Mail, Calendar } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';

interface LeadScore {
  leadId: string;
  score: number;
  factors: {
    engagement: number;
    demographic: number;
    interaction: number;
    timing: number;
  };
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export const LeadScoringSystem = () => {
  const { leads } = useLeads();
  const [leadScores, setLeadScores] = useState<LeadScore[]>([]);

  const calculateLeadScore = (lead: any): LeadScore => {
    let score = 0;
    const factors = { engagement: 0, demographic: 0, interaction: 0, timing: 0 };
    const recommendations: string[] = [];

    // Engagement scoring
    if (lead.email) {
      factors.engagement += 20;
      score += 20;
    } else {
      recommendations.push('Obter email para melhor comunicação');
    }

    if (lead.telefone) {
      factors.engagement += 15;
      score += 15;
    } else {
      recommendations.push('Solicitar telefone para contato direto');
    }

    // Demographic scoring
    if (lead.interesse) {
      factors.demographic += 25;
      score += 25;
    } else {
      recommendations.push('Identificar área de interesse específica');
    }

    // Interaction scoring based on status
    switch (lead.status) {
      case 'interesse':
        factors.interaction += 30;
        score += 30;
        break;
      case 'contatado':
        factors.interaction += 20;
        score += 20;
        break;
      case 'proposta':
        factors.interaction += 40;
        score += 40;
        break;
      case 'novo':
        recommendations.push('Realizar primeiro contato');
        break;
    }

    // Timing scoring (recent leads get higher score)
    const daysOld = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysOld <= 3) {
      factors.timing += 10;
      score += 10;
    } else if (daysOld > 30) {
      recommendations.push('Lead antigo - priorizar reativação');
    }

    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (score >= 70) priority = 'high';
    else if (score >= 40) priority = 'medium';

    return {
      leadId: lead.id,
      score,
      factors,
      priority,
      recommendations
    };
  };

  useEffect(() => {
    if (leads.length > 0) {
      const scores = leads.map(calculateLeadScore);
      setLeadScores(scores.sort((a, b) => b.score - a.score));
    }
  }, [leads]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Sistema de Pontuação de Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {leadScores.map((leadScore) => {
              const lead = leads.find(l => l.id === leadScore.leadId);
              if (!lead) return null;

              return (
                <Card key={leadScore.leadId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{lead.nome}</h4>
                        <p className="text-sm text-gray-600">{lead.interesse || 'Interesse não informado'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(leadScore.priority)}>
                          {leadScore.priority === 'high' ? 'Alta' : 
                           leadScore.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(leadScore.score)}`}>
                            {leadScore.score}
                          </div>
                          <div className="text-xs text-gray-500">pontos</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Engajamento</div>
                        <Progress value={leadScore.factors.engagement} className="h-2" />
                        <div className="text-xs">{leadScore.factors.engagement}pts</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Demografia</div>
                        <Progress value={leadScore.factors.demographic} className="h-2" />
                        <div className="text-xs">{leadScore.factors.demographic}pts</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Interação</div>
                        <Progress value={leadScore.factors.interaction} className="h-2" />
                        <div className="text-xs">{leadScore.factors.interaction}pts</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Timing</div>
                        <Progress value={leadScore.factors.timing} className="h-2" />
                        <div className="text-xs">{leadScore.factors.timing}pts</div>
                      </div>
                    </div>

                    {leadScore.recommendations.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Recomendações:</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {leadScore.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Ligar
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Agendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
