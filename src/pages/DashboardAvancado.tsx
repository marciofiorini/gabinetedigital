
import React from 'react';
import { RecomendacoesDashboard } from '@/components/dashboard/RecomendacoesDashboard';
import { PrevisaoEleitoralCard } from '@/components/dashboard/PrevisaoEleitoralCard';
import { AlertasProativosDashboard } from '@/components/dashboard/AlertasProativosDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp } from 'lucide-react';
import { useFluxosTrabalho } from '@/hooks/useFluxosTrabalho';
import { useRelatoriosAutomaticos } from '@/hooks/useRelatoriosAutomaticos';

const DashboardAvancado = () => {
  const { fluxos } = useFluxosTrabalho();
  const { relatorios } = useRelatoriosAutomaticos();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8" />
            Dashboard Avançado com IA
          </h1>
          <p className="text-gray-600 mt-2">
            Inteligência artificial aplicada à gestão política estratégica
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recomendações Personalizadas */}
          <div className="lg:col-span-2">
            <RecomendacoesDashboard />
          </div>

          {/* Alertas Proativos */}
          <div>
            <AlertasProativosDashboard />
          </div>

          {/* Previsão Eleitoral */}
          <div>
            <PrevisaoEleitoralCard />
          </div>

          {/* Fluxos de Trabalho Automatizados */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Fluxos Automatizados
                </CardTitle>
                <CardDescription>
                  Automações ativas para demandas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fluxos.map((fluxo) => (
                    <div key={fluxo.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{fluxo.nome}</h4>
                        <Badge variant={fluxo.ativo ? "default" : "secondary"}>
                          {fluxo.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Executado: {fluxo.estatisticas.executado} vezes
                        <br />
                        Sucesso: {fluxo.estatisticas.sucesso} | Falha: {fluxo.estatisticas.falha}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Relatórios Automáticos */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Relatórios Automáticos
                </CardTitle>
                <CardDescription>
                  Relatórios gerados automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatorios.slice(0, 3).map((relatorio) => (
                    <div key={relatorio.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{relatorio.nome}</h4>
                        <Badge variant={relatorio.ativo ? "default" : "secondary"}>
                          {relatorio.frequencia}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Próxima execução: {new Date(relatorio.proxima_execucao).toLocaleDateString('pt-BR')}
                        <br />
                        Histórico: {relatorio.historico_execucoes} execuções
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {fluxos.filter(f => f.ativo).length}
              </div>
              <div className="text-sm text-muted-foreground">Fluxos Ativos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {relatorios.filter(r => r.ativo).length}
              </div>
              <div className="text-sm text-muted-foreground">Relatórios Automáticos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {fluxos.reduce((sum, f) => sum + f.estatisticas.executado, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Automações Executadas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {relatorios.reduce((sum, r) => sum + r.historico_execucoes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Relatórios Gerados</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAvancado;
