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
import { useTarefasEquipe } from '@/hooks/useTarefasEquipe';
import { useEquipe } from '@/hooks/useEquipe';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export const GestaoTarefasAvancada = () => {
  const { tarefas, createTarefa, updateTarefa } = useTarefasEquipe();
  const { funcionarios } = useEquipe();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    funcionario_id: '',
    prioridade: 'media' as const,
    status: 'pendente' as const,
    data_inicio: '',
    data_limite: ''
  });

  const handleCreateTarefa = async () => {
    try {
      await createTarefa(novaTarefa);
      setIsDialogOpen(false);
      setNovaTarefa({
        titulo: '',
        descricao: '',
        funcionario_id: '',
        prioridade: 'media',
        status: 'pendente',
        data_inicio: '',
        data_limite: ''
      });
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'em_andamento': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pendente': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calcularProgresso = () => {
    if (tarefas.length === 0) return 0;
    const concluidas = tarefas.filter(t => t.status === 'concluida').length;
    return Math.round((concluidas / tarefas.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Tarefas</h2>
          <p className="text-gray-600">Controle avançado de tarefas da equipe</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={novaTarefa.titulo}
                  onChange={(e) => setNovaTarefa(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título da tarefa"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={novaTarefa.descricao}
                  onChange={(e) => setNovaTarefa(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição detalhada"
                />
              </div>
              <div>
                <Label>Responsável</Label>
                <Select value={novaTarefa.funcionario_id} onValueChange={(value) => setNovaTarefa(prev => ({ ...prev, funcionario_id: value }))}>
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
                  <Label>Prioridade</Label>
                  <Select value={novaTarefa.prioridade} onValueChange={(value: any) => setNovaTarefa(prev => ({ ...prev, prioridade: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data Limite</Label>
                  <Input
                    type="date"
                    value={novaTarefa.data_limite}
                    onChange={(e) => setNovaTarefa(prev => ({ ...prev, data_limite: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleCreateTarefa} className="w-full">
                Criar Tarefa
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
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{tarefas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-xl font-bold">{tarefas.filter(t => t.status === 'concluida').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-xl font-bold">{tarefas.filter(t => t.status === 'em_andamento').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-xl font-bold">{calcularProgresso()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Geral da Equipe</CardTitle>
          <CardDescription>Acompanhamento do progresso das tarefas</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={calcularProgresso()} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            {tarefas.filter(t => t.status === 'concluida').length} de {tarefas.length} tarefas concluídas
          </p>
        </CardContent>
      </Card>

      {/* Lista de Tarefas */}
      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {tarefas.map((tarefa) => (
            <Card key={tarefa.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(tarefa.status)}
                      <h3 className="font-semibold">{tarefa.titulo}</h3>
                      <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                        {tarefa.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {tarefa.funcionario?.nome}
                      </div>
                      {tarefa.data_limite && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tarefa.data_limite).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={tarefa.status === 'concluida' ? 'default' : 'secondary'}>
                    {tarefa.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-4">
          {tarefas.filter(t => t.status === 'pendente').map((tarefa) => (
            <Card key={tarefa.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(tarefa.status)}
                      <h3 className="font-semibold">{tarefa.titulo}</h3>
                      <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                        {tarefa.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {tarefa.funcionario?.nome}
                      </div>
                      {tarefa.data_limite && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tarefa.data_limite).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => updateTarefa(tarefa.id, { status: 'em_andamento' })}
                  >
                    Iniciar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="andamento" className="space-y-4">
          {tarefas.filter(t => t.status === 'em_andamento').map((tarefa) => (
            <Card key={tarefa.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(tarefa.status)}
                      <h3 className="font-semibold">{tarefa.titulo}</h3>
                      <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                        {tarefa.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {tarefa.funcionario?.nome}
                      </div>
                      {tarefa.data_limite && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tarefa.data_limite).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => updateTarefa(tarefa.id, { 
                      status: 'concluida',
                      data_conclusao: new Date().toISOString().split('T')[0]
                    })}
                  >
                    Concluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="concluidas" className="space-y-4">
          {tarefas.filter(t => t.status === 'concluida').map((tarefa) => (
            <Card key={tarefa.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(tarefa.status)}
                      <h3 className="font-semibold">{tarefa.titulo}</h3>
                      <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                        {tarefa.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {tarefa.funcionario?.nome}
                      </div>
                      {tarefa.data_conclusao && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Concluída em {new Date(tarefa.data_conclusao).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="default">
                    Concluída
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
