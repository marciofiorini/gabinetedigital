
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { usePrevisaoEleitoral } from '@/hooks/usePrevisaoEleitoral';

export const PrevisaoEleitoralCard = () => {
  const { previsoes, loading } = usePrevisaoEleitoral();

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'crescimento': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'queda': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getCenarioColor = (cenario: string) => {
    switch (cenario) {
      case 'otimista': return 'text-green-600';
      case 'pessimista': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previsão Eleitoral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão Eleitoral IA</CardTitle>
        <CardDescription>
          Projeções baseadas em dados históricos e tendências atuais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {previsoes.map((previsao) => (
            <div key={previsao.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold capitalize ${getCenarioColor(previsao.cenario)}`}>
                    {previsao.cenario}
                  </span>
                  {getTendenciaIcon(previsao.tendencia)}
                </div>
                <Badge variant="outline">
                  {previsao.confiabilidade}% confiança
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Previsão de Votos</span>
                  <span className="font-semibold">
                    {previsao.percentual_votos.toFixed(1)}% ± {previsao.margem_erro}%
                  </span>
                </div>
                <Progress value={previsao.percentual_votos} className="h-2" />
              </div>
              
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Fatores de influência:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {previsao.fatores_influencia.map((fator, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {fator.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
