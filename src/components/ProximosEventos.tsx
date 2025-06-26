
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const ProximosEventos = () => {
  const eventos = [
    {
      id: 1,
      titulo: 'Reunião Pública',
      descricao: 'Discussão sobre mobilidade urbana',
      data: '2024-06-28',
      hora: '14:00',
      local: 'Centro Cívico',
      tipo: 'reuniao'
    },
    {
      id: 2,
      titulo: 'Audiência Pública',
      descricao: 'Orçamento participativo 2025',
      data: '2024-06-30',
      hora: '19:00',
      local: 'Câmara Municipal',
      tipo: 'audiencia'
    },
    {
      id: 3,
      titulo: 'Visita Técnica',
      descricao: 'Acompanhamento de obras',
      data: '2024-07-02',
      hora: '09:00',
      local: 'Bairro Jardim das Flores',
      tipo: 'visita'
    }
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'reuniao': return 'bg-blue-100 text-blue-800';
      case 'audiencia': return 'bg-green-100 text-green-800';
      case 'visita': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Próximos Eventos
        </CardTitle>
        <CardDescription>
          Agenda dos próximos compromissos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{evento.titulo}</h4>
                <Badge variant="outline" className={getTipoColor(evento.tipo)}>
                  {evento.tipo}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {evento.descricao}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {evento.data}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {evento.hora}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {evento.local}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
