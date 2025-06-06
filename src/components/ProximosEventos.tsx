
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export const ProximosEventos = () => {
  const eventos = [
    {
      titulo: 'Audiência Pública',
      data: 'Hoje, 14:00',
      status: 'hoje',
      cor: 'bg-blue-500'
    },
    {
      titulo: 'Reunião com Prefeitos',
      data: 'Amanhã, 09:00',
      status: 'proximo',
      cor: 'bg-green-500'
    },
    {
      titulo: 'Live Instagram',
      data: 'Sexta, 18:00',
      status: 'agendado',
      cor: 'bg-purple-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hoje': return 'bg-blue-100 text-blue-800';
      case 'proximo': return 'bg-green-100 text-green-800';
      case 'agendado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Calendar className="w-5 h-5" />
          Próximos Eventos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {eventos.map((evento, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${evento.cor}`}></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {evento.titulo}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {evento.data}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(evento.status)}>
              {evento.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
