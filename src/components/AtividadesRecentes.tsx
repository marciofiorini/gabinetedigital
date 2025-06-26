
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, FileText, Calendar } from 'lucide-react';

export const AtividadesRecentes = () => {
  const atividades = [
    {
      id: 1,
      tipo: 'contato',
      titulo: 'Novo contato adicionado',
      descricao: 'Maria Silva foi adicionada aos contatos',
      tempo: '2 horas atrás',
      icon: User
    },
    {
      id: 2,
      tipo: 'demanda',
      titulo: 'Demanda atualizada',
      descricao: 'Pavimentação da Rua A - Status: Em andamento',
      tempo: '4 horas atrás',
      icon: FileText
    },
    {
      id: 3,
      tipo: 'evento',
      titulo: 'Evento agendado',
      descricao: 'Reunião pública - Centro Comunitário',
      tempo: '1 dia atrás',
      icon: Calendar
    }
  ];

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'contato': return 'bg-blue-100 text-blue-800';
      case 'demanda': return 'bg-green-100 text-green-800';
      case 'evento': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Atividades Recentes
        </CardTitle>
        <CardDescription>
          Últimas ações realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atividades.map((atividade) => {
            const IconComponent = atividade.icon;
            return (
              <div key={atividade.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-gray-100 rounded-full">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{atividade.titulo}</h4>
                    <Badge variant="outline" className={getTypeColor(atividade.tipo)}>
                      {atividade.tipo}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {atividade.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {atividade.tempo}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
