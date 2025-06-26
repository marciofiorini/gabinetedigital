
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, User, AlertCircle } from 'lucide-react';

export const FollowUpNotifications = () => {
  const followUps = [
    {
      id: 1,
      tipo: 'contato',
      titulo: 'Retornar ligação',
      descricao: 'João Silva - Demanda sobre iluminação',
      prazo: '2 horas',
      prioridade: 'alta',
      status: 'pendente'
    },
    {
      id: 2,
      tipo: 'reuniao',
      titulo: 'Preparar apresentação',
      descricao: 'Reunião com lideranças - Projeto de mobilidade',
      prazo: '1 dia',
      prioridade: 'media',
      status: 'pendente'
    },
    {
      id: 3,
      tipo: 'demanda',
      titulo: 'Atualizar status',
      descricao: 'Pavimentação Rua das Flores - Informar progresso',
      prazo: '3 dias',
      prioridade: 'baixa',
      status: 'pendente'
    }
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'contato': return User;
      case 'reuniao': return Clock;
      case 'demanda': return AlertCircle;
      default: return Bell;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Follow-ups Pendentes
        </CardTitle>
        <CardDescription>
          Ações que precisam de acompanhamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followUps.map((item) => {
            const IconComponent = getTipoIcon(item.tipo);
            return (
              <div key={item.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <h4 className="font-semibold">{item.titulo}</h4>
                  </div>
                  <Badge variant="outline" className={getPrioridadeColor(item.prioridade)}>
                    {item.prioridade}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {item.descricao}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Prazo: {item.prazo}
                  </div>
                  <Button size="sm" variant="outline">
                    Marcar como Feito
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
