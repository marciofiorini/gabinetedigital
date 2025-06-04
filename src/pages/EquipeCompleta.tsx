import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Calendar,
  Star,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Target,
  Award
} from 'lucide-react';
import { useDashboardEquipe } from '@/hooks/useDashboardEquipe';
import { useAvaliacoes } from '@/hooks/useAvaliacoes';
import { useFolhaPagamento } from '@/hooks/useFolhaPagamento';
import { useAgendaFuncionario } from '@/hooks/useAgendaFuncionario';
import { useEquipe } from '@/hooks/useEquipe';
import { useTarefasEquipe } from '@/hooks/useTarefasEquipe';
import { usePontoEletronico } from '@/hooks/usePontoEletronico';
import { GestaoTarefasAvancada } from '@/components/equipe/GestaoTarefasAvancada';
import { AvaliacaoDesempenho } from '@/components/equipe/AvaliacaoDesempenho';
import { ControlePonto } from '@/components/equipe/ControlePonto';

export default function EquipeCompleta() {
  const { metricas, produtividade, loading: loadingDashboard } = useDashboardEquipe();
  const { avaliacoes } = useAvaliacoes();
  const { folhas } = useFolhaPagamento();
  const { agenda } = useAgendaFuncionario();
  const { funcionarios } = useEquipe();
  const { tarefas } = useTarefasEquipe();
  const { registros } = usePontoEletronico();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central de Gestão de Equipe</h1>
          <p className="text-gray-600">Visão completa da sua equipe e recursos humanos</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="funcionarios" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="tarefas" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Tarefas
          </TabsTrigger>
          <TabsTrigger value="ponto" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ponto
          </TabsTrigger>
          <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Avaliações
          </TabsTrigger>
          <TabsTrigger value="folha" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Folha
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Dashboard da Equipe */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas?.total_funcionarios || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metricas?.funcionarios_ativos || 0} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas?.horas_trabalhadas_mes || 0}h</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricas?.tarefas_concluidas || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metricas?.tarefas_pendentes || 0} pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Salários</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metricas?.total_salarios || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Folha atual</p>
              </CardContent>
            </Card>
          </div>

          {/* Produtividade da Equipe */}
          <Card>
            <CardHeader>
              <CardTitle>Produtividade da Equipe</CardTitle>
              <CardDescription>Ranking de performance dos funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {produtividade.map((func, index) => (
                  <div key={func.funcionario_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <h3 className="font-semibold">{func.funcionario_nome}</h3>
                        <p className="text-sm text-gray-600">
                          {func.tarefas_concluidas} tarefas • {func.horas_trabalhadas}h trabalhadas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {func.produtividade_score}
                      </div>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funcionários */}
        <TabsContent value="funcionarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Funcionários</CardTitle>
              <CardDescription>Lista completa da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funcionarios.map((funcionario) => (
                  <div key={funcionario.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{funcionario.nome}</h3>
                        <p className="text-sm text-gray-600">{funcionario.cargo}</p>
                        <p className="text-xs text-gray-500">
                          Admissão: {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant={funcionario.status === 'ativo' ? 'default' : 'secondary'}>
                        {funcionario.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova aba de Tarefas Avançadas */}
        <TabsContent value="tarefas" className="space-y-4">
          <GestaoTarefasAvancada />
        </TabsContent>

        {/* Nova aba de Controle de Ponto */}
        <TabsContent value="ponto" className="space-y-4">
          <ControlePonto />
        </TabsContent>

        {/* Nova aba de Avaliações */}
        <TabsContent value="avaliacoes" className="space-y-4">
          <AvaliacaoDesempenho />
        </TabsContent>

        {/* Folha de Pagamento */}
        <TabsContent value="folha" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Folha de Pagamento</CardTitle>
              <CardDescription>Controle de salários e benefícios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {folhas.map((folha) => (
                  <div key={folha.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{folha.funcionario?.nome}</h3>
                      <Badge variant={folha.status === 'paga' ? 'default' : 'secondary'}>
                        {folha.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Salário Base:</strong> {formatCurrency(folha.salario_base)}</p>
                        <p><strong>Horas Extras:</strong> {folha.horas_extras}h</p>
                      </div>
                      <div>
                        <p><strong>Salário Líquido:</strong> {formatCurrency(folha.salario_liquido || 0)}</p>
                        <p><strong>Mês:</strong> {new Date(folha.mes_referencia).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agenda */}
        <TabsContent value="agenda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agenda da Equipe</CardTitle>
              <CardDescription>Calendário e compromissos dos funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agenda.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{item.titulo}</h3>
                      <Badge variant="outline">{item.tipo}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.funcionario?.nome}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.data_inicio).toLocaleString('pt-BR')} - {new Date(item.data_fim).toLocaleString('pt-BR')}
                    </p>
                    {item.local && (
                      <p className="text-sm text-gray-500">Local: {item.local}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Ponto</CardTitle>
                <CardDescription>Controle de frequência da equipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {registros.slice(0, 5).map((registro) => (
                    <div key={registro.id} className="flex justify-between items-center text-sm">
                      <span>{registro.funcionario?.nome}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {registro.tipo}
                        </Badge>
                        <span className="text-gray-500">
                          {new Date(registro.data_hora).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver Relatório Completo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance de Tarefas</CardTitle>
                <CardDescription>Análise de produtividade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Conclusão</span>
                    <span className="font-semibold">
                      {metricas ? Math.round((metricas.tarefas_concluidas / (metricas.tarefas_concluidas + metricas.tarefas_pendentes)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tarefas em Andamento</span>
                    <span className="font-semibold">{tarefas.filter(t => t.status === 'em_andamento').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Média de Horas/Tarefa</span>
                    <span className="font-semibold">
                      {metricas && metricas.tarefas_concluidas > 0 
                        ? Math.round(metricas.horas_trabalhadas_mes / metricas.tarefas_concluidas) 
                        : 0}h
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Gerar Relatório Detalhado
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
