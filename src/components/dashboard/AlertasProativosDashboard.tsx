
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Target, Clock, Zap } from 'lucide-react';
import { useAlertasProativos } from '@/hooks/useAlertasProativos';

export const AlertasProativosDashboard = () => {
  const { alertasAtivos, loading } = useAlertasProativos();

  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case 'meta': return <Target className="w-4 h-4" />;
      case 'prazo': return <Clock className="w-4 h-4" />;
      case 'oportunidade': return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case 'critica': return 'destructive';
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
          <CardTitle>Alertas Proativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <AlertTriangle className="w-5 h-5" />
          Alertas Proativos
          {alertasAtivos.length > 0 && (
            <Badge variant="destructive">{alertasAtivos.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Monitoramento em tempo real de métricas importantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertasAtivos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum alerta ativo no momento</p>
              <p className="text-sm">Tudo funcionando dentro dos parâmetros!</p>
            </div>
          ) : (
            alertasAtivos.map((alerta) => (
              <div key={alerta.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getIconForTipo(alerta.tipo)}
                    <h4 className="font-semibold">{alerta.titulo}</h4>
                  </div>
                  <Badge variant={getSeverityColor(alerta.severidade)}>
                    {alerta.severidade}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {alerta.descricao}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Valor atual:</span> {alerta.valor_atual}
                    {alerta.tipo === 'meta' && ` / ${alerta.valor_limite} (meta)`}
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Detalhes
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
