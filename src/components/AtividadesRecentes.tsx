
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, Calendar, MessageSquare } from "lucide-react";

export const AtividadesRecentes = () => {
  const atividades = [
    {
      tipo: 'demanda',
      titulo: 'Nova demanda: Iluminação Pública',
      subtitulo: 'Rua das Flores, Centro',
      tempo: '2 horas atrás',
      status: 'pendente',
      icon: AlertCircle,
      iconColor: 'text-orange-500'
    },
    {
      tipo: 'evento',
      titulo: 'Reunião com lideranças',
      subtitulo: 'Sala de reuniões - 14:00',
      tempo: 'Hoje',
      status: 'agendado',
      icon: Calendar,
      iconColor: 'text-blue-500'
    },
    {
      tipo: 'mensagem',
      titulo: 'Mensagem enviada: Grupo Zona Norte',
      subtitulo: 'Relatório semanal das atividades',
      tempo: '1 dia atrás',
      status: 'enviado',
      icon: MessageSquare,
      iconColor: 'text-green-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-orange-100 text-orange-800';
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'enviado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Atividades Recentes
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Últimas ações e atualizações do sistema
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {atividades.map((atividade, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center ${atividade.iconColor}`}>
              <atividade.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {atividade.titulo}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {atividade.subtitulo}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {atividade.tempo}
              </span>
              <Badge className={getStatusColor(atividade.status)}>
                {atividade.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
