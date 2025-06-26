
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useRecomendacoesPersonalizadas } from '@/hooks/useRecomendacoesPersonalizadas';

export const RecomendacoesDashboard = () => {
  const { recomendacoes, loading } = useRecomendacoesPersonalizadas();

  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case 'campanha': return <MessageSquare className="w-4 h-4" />;
      case 'contato': return <Users className="w-4 h-4" />;
      case 'acao': return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Recomendações Personalizadas
        </CardTitle>
        <CardDescription>
          Sugestões baseadas no seu histórico e padrões de uso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recomendacoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma recomendação disponível no momento</p>
            </div>
          ) : (
            recomendacoes.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getIconForTipo(rec.tipo)}
                    <h4 className="font-semibold">{rec.titulo}</h4>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(rec.prioridade)}>
                      {rec.prioridade}
                    </Badge>
                    <Badge variant="outline">
                      {rec.confianca}% confiança
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {rec.descricao}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Baseado em: {rec.baseado_em.join(', ')}
                  </div>
                  <Button size="sm" variant="outline">
                    Aplicar Sugestão
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
