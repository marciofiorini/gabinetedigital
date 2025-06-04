
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAvaliacoes } from '@/hooks/useAvaliacoes';
import { useEquipe } from '@/hooks/useEquipe';
import { useDesempenhoEquipe } from '@/hooks/useDesempenhoEquipe';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  TrendingUp, 
  Target, 
  Award,
  Calendar,
  User,
  BarChart3,
  Plus
} from 'lucide-react';

export const AvaliacaoDesempenho = () => {
  const { avaliacoes } = useAvaliacoes();
  const { funcionarios } = useEquipe();
  const { metricas } = useDesempenhoEquipe();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getNotaColor = (nota: number) => {
    if (nota >= 9) return 'text-green-600';
    if (nota >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calcularMediaGeral = () => {
    if (avaliacoes.length === 0) return 0;
    const somaNotas = avaliacoes.reduce((acc, av) => acc + (av.nota_geral || 0), 0);
    return Math.round((somaNotas / avaliacoes.length) * 10) / 10;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Avaliação de Desempenho</h2>
          <p className="text-gray-600">Acompanhe o desempenho da equipe</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Avaliação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Funcionário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((func) => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.nome} - {func.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Período Início</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Período Fim</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="w-full">
                Criar Avaliação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Média Geral</p>
                <p className={`text-xl font-bold ${getNotaColor(calcularMediaGeral())}`}>
                  {calcularMediaGeral()}/10
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avaliações</p>
                <p className="text-xl font-bold">{avaliacoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-xl font-bold">
                  {avaliacoes.filter(a => a.status === 'concluida').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-xl font-bold">
                  {avaliacoes.filter(a => a.status === 'pendente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="avaliacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacoes" className="space-y-4">
          {avaliacoes.map((avaliacao) => (
            <Card key={avaliacao.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{avaliacao.funcionario?.nome}</CardTitle>
                    <CardDescription>
                      {new Date(avaliacao.periodo_inicio).toLocaleDateString('pt-BR')} - {new Date(avaliacao.periodo_fim).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {avaliacao.nota_geral && (
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getNotaColor(avaliacao.nota_geral)}`}>
                          {avaliacao.nota_geral}/10
                        </div>
                        <p className="text-xs text-gray-500">Nota Geral</p>
                      </div>
                    )}
                    <Badge variant={avaliacao.status === 'concluida' ? 'default' : 'secondary'}>
                      {avaliacao.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {avaliacao.status === 'concluida' && (
                  <div className="space-y-4">
                    {avaliacao.pontos_fortes && (
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Pontos Fortes</h4>
                        <p className="text-sm">{avaliacao.pontos_fortes}</p>
                      </div>
                    )}
                    {avaliacao.pontos_melhoria && (
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">Pontos de Melhoria</h4>
                        <p className="text-sm">{avaliacao.pontos_melhoria}</p>
                      </div>
                    )}
                    {avaliacao.objetivos_proximos && (
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2">Objetivos Próximos</h4>
                        <p className="text-sm">{avaliacao.objetivos_proximos}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="metricas" className="space-y-4">
          {metricas.map((metrica) => (
            <Card key={metrica.id}>
              <CardHeader>
                <CardTitle>Métricas de Desempenho</CardTitle>
                <CardDescription>Período: {metrica.periodo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{metrica.tarefas_concluidas}</p>
                    <p className="text-sm text-gray-600">Tarefas Concluídas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{metrica.tarefas_atrasadas}</p>
                    <p className="text-sm text-gray-600">Tarefas Atrasadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{metrica.horas_trabalhadas}h</p>
                    <p className="text-sm text-gray-600">Horas Trabalhadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{metrica.avaliacao_media}/10</p>
                    <p className="text-sm text-gray-600">Avaliação Média</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Produtividade</span>
                    <span className="text-sm text-gray-600">{metrica.produtividade_atual}%</span>
                  </div>
                  <Progress value={metrica.produtividade_atual} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">Meta: {metrica.meta_produtividade}%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Pontos Fortes</h4>
                    <div className="space-y-1">
                      {metrica.pontos_fortes.map((ponto, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {ponto}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Áreas de Melhoria</h4>
                    <div className="space-y-1">
                      {metrica.areas_melhoria.map((area, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Ranking de Performance
              </CardTitle>
              <CardDescription>Classificação baseada nas métricas de desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metricas
                  .sort((a, b) => b.produtividade_atual - a.produtividade_atual)
                  .map((metrica, index) => (
                    <div key={metrica.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <span className="font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{metrica.funcionario_id}</h3>
                          <p className="text-sm text-gray-600">
                            {metrica.tarefas_concluidas} tarefas • {metrica.horas_trabalhadas}h trabalhadas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {metrica.produtividade_atual}%
                        </div>
                        <p className="text-xs text-gray-500">Produtividade</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
