
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cake, Gift, Phone } from 'lucide-react';

export const AniversariantesSection = () => {
  const aniversariantes = [
    {
      id: 1,
      nome: 'João Silva',
      idade: 45,
      telefone: '(11) 99999-9999',
      categoria: 'Líder Comunitário',
      data: 'Hoje'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      idade: 38,
      telefone: '(11) 88888-8888',
      categoria: 'Comerciante',
      data: 'Amanhã'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      idade: 52,
      telefone: '(11) 77777-7777',
      categoria: 'Apoiador',
      data: '29/06'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cake className="w-5 h-5" />
          Aniversariantes
        </CardTitle>
        <CardDescription>
          Contatos que fazem aniversário próximo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aniversariantes.map((pessoa) => (
            <div key={pessoa.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{pessoa.nome}</h4>
                  <p className="text-sm text-muted-foreground">
                    {pessoa.idade} anos • {pessoa.categoria}
                  </p>
                </div>
                <Badge 
                  variant={pessoa.data === 'Hoje' ? 'default' : 'outline'}
                  className={pessoa.data === 'Hoje' ? 'bg-pink-100 text-pink-800' : ''}
                >
                  {pessoa.data}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Ligar
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  Parabenizar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
