
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Clock, MessageSquare, Calendar, Settings, Plus } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';

interface FollowUpRule {
  id: string;
  name: string;
  trigger: 'status_change' | 'time_based' | 'interaction';
  condition: string;
  delay: number;
  delayUnit: 'hours' | 'days' | 'weeks';
  action: 'email' | 'whatsapp' | 'call_reminder' | 'task';
  template: string;
  active: boolean;
}

interface ScheduledFollowUp {
  id: string;
  leadId: string;
  leadName: string;
  ruleId: string;
  ruleName: string;
  scheduledFor: Date;
  status: 'pending' | 'sent' | 'failed';
  action: string;
}

export const AutoFollowUpSystem = () => {
  const { leads } = useLeads();
  const [rules, setRules] = useState<FollowUpRule[]>([
    {
      id: '1',
      name: 'Primeiro contato - novo lead',
      trigger: 'status_change',
      condition: 'status = novo',
      delay: 1,
      delayUnit: 'hours',
      action: 'whatsapp',
      template: 'Olá {nome}! Obrigado pelo seu interesse. Em que posso ajudá-lo?',
      active: true
    },
    {
      id: '2',
      name: 'Follow-up após 3 dias sem resposta',
      trigger: 'time_based',
      condition: 'last_contact > 3 days',
      delay: 3,
      delayUnit: 'days',
      action: 'email',
      template: 'Olá {nome}, gostaria de saber se ainda tem interesse em nossos serviços.',
      active: true
    }
  ]);

  const [scheduledFollowUps, setScheduledFollowUps] = useState<ScheduledFollowUp[]>([]);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<FollowUpRule>>({
    name: '',
    trigger: 'status_change',
    condition: '',
    delay: 1,
    delayUnit: 'hours',
    action: 'whatsapp',
    template: '',
    active: true
  });

  useEffect(() => {
    // Simulate scheduled follow-ups based on leads and rules
    const scheduled: ScheduledFollowUp[] = [];
    
    leads.forEach(lead => {
      rules.filter(rule => rule.active).forEach(rule => {
        const shouldSchedule = checkRuleCondition(lead, rule);
        if (shouldSchedule) {
          const scheduledFor = new Date();
          scheduledFor.setHours(scheduledFor.getHours() + 
            (rule.delayUnit === 'hours' ? rule.delay :
             rule.delayUnit === 'days' ? rule.delay * 24 :
             rule.delay * 24 * 7));

          scheduled.push({
            id: `${lead.id}-${rule.id}`,
            leadId: lead.id,
            leadName: lead.nome,
            ruleId: rule.id,
            ruleName: rule.name,
            scheduledFor,
            status: 'pending',
            action: rule.action
          });
        }
      });
    });

    setScheduledFollowUps(scheduled);
  }, [leads, rules]);

  const checkRuleCondition = (lead: any, rule: FollowUpRule): boolean => {
    switch (rule.trigger) {
      case 'status_change':
        return rule.condition.includes(lead.status);
      case 'time_based':
        const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceCreated >= 3;
      default:
        return false;
    }
  };

  const addRule = () => {
    if (!newRule.name || !newRule.template) {
      toast.error('Nome e template são obrigatórios');
      return;
    }

    const rule: FollowUpRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      trigger: newRule.trigger!,
      condition: newRule.condition!,
      delay: newRule.delay!,
      delayUnit: newRule.delayUnit!,
      action: newRule.action!,
      template: newRule.template!,
      active: newRule.active!
    };

    setRules([...rules, rule]);
    setNewRule({
      name: '',
      trigger: 'status_change',
      condition: '',
      delay: 1,
      delayUnit: 'hours',
      action: 'whatsapp',
      template: '',
      active: true
    });
    setShowNewRule(false);
    toast.success('Regra de follow-up criada com sucesso!');
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
  };

  const executeFollowUp = (followUpId: string) => {
    setScheduledFollowUps(followUps => 
      followUps.map(fu => 
        fu.id === followUpId ? { ...fu, status: 'sent' } : fu
      )
    );
    toast.success('Follow-up executado com sucesso!');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'whatsapp': return '💬';
      case 'email': return '📧';
      case 'call_reminder': return '📞';
      case 'task': return '📋';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Follow-ups Automáticos
            </CardTitle>
            <Button onClick={() => setShowNewRule(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map(rule => (
              <Card key={rule.id} className={`border-l-4 ${rule.active ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rule.name}</h4>
                        <Badge variant="outline">{getActionIcon(rule.action)} {rule.action}</Badge>
                        <Badge variant="outline">
                          {rule.delay} {rule.delayUnit}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Condição: {rule.condition}
                      </p>
                      <p className="text-sm text-gray-500">
                        Template: {rule.template.substring(0, 100)}...
                      </p>
                    </div>
                    <Switch
                      checked={rule.active}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {showNewRule && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Regra de Follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ruleName">Nome da Regra</Label>
              <Input
                id="ruleName"
                value={newRule.name || ''}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                placeholder="Ex: Follow-up para leads interessados"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trigger">Gatilho</Label>
                <Select value={newRule.trigger} onValueChange={(value) => setNewRule({...newRule, trigger: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status_change">Mudança de Status</SelectItem>
                    <SelectItem value="time_based">Baseado em Tempo</SelectItem>
                    <SelectItem value="interaction">Interação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="action">Ação</Label>
                <Select value={newRule.action} onValueChange={(value) => setNewRule({...newRule, action: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="call_reminder">Lembrete de Ligação</SelectItem>
                    <SelectItem value="task">Criar Tarefa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delay">Atraso</Label>
                <Input
                  id="delay"
                  type="number"
                  value={newRule.delay || 1}
                  onChange={(e) => setNewRule({...newRule, delay: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="delayUnit">Unidade</Label>
                <Select value={newRule.delayUnit} onValueChange={(value) => setNewRule({...newRule, delayUnit: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Horas</SelectItem>
                    <SelectItem value="days">Dias</SelectItem>
                    <SelectItem value="weeks">Semanas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Condição</Label>
              <Input
                id="condition"
                value={newRule.condition || ''}
                onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                placeholder="Ex: status = interesse"
              />
            </div>

            <div>
              <Label htmlFor="template">Template da Mensagem</Label>
              <Textarea
                id="template"
                value={newRule.template || ''}
                onChange={(e) => setNewRule({...newRule, template: e.target.value})}
                placeholder="Use {nome} para personalizar com o nome do lead"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addRule}>Criar Regra</Button>
              <Button variant="outline" onClick={() => setShowNewRule(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Follow-ups Agendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledFollowUps.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum follow-up agendado no momento
              </p>
            ) : (
              scheduledFollowUps.map(followUp => (
                <div key={followUp.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{followUp.leadName}</div>
                    <div className="text-sm text-gray-600">{followUp.ruleName}</div>
                    <div className="text-xs text-gray-500">
                      Agendado para: {followUp.scheduledFor.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(followUp.status)}>
                      {followUp.status === 'pending' ? 'Pendente' :
                       followUp.status === 'sent' ? 'Enviado' : 'Falhou'}
                    </Badge>
                    {followUp.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => executeFollowUp(followUp.id)}
                      >
                        Executar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
