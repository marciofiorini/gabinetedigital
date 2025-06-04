
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEquipe, CargoEquipe, StatusFuncionario } from '@/hooks/useEquipe';
import { useTarefasEquipe } from '@/hooks/useTarefasEquipe';
import { usePontoEletronico } from '@/hooks/usePontoEletronico';
import { 
  Users, 
  UserPlus, 
  Clock, 
  ClipboardList, 
  Search,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Equipe() {
  const { funcionarios, loading: loadingFuncionarios, createFuncionario, updateFuncionario, deleteFuncionario } = useEquipe();
  const { tarefas, createTarefa, updateTarefa, deleteTarefa } = useTarefasEquipe();
  const { registros, registrarPonto } = usePontoEletronico();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<any>(null);

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: 'assessor' as CargoEquipe,
    status: 'ativo' as StatusFuncionario,
    data_admissao: '',
    salario: 0,
    carga_horaria: 40,
    observacoes: ''
  });

  const handleCreateFuncionario = async () => {
    try {
      await createFuncionario(novoFuncionario);
      setIsDialogOpen(false);
      setNovoFuncionario({
        nome: '',
        email: '',
        telefone: '',
        cargo: 'assessor',
        status: 'ativo',
        data_admissao: '',
        salario: 0,
        carga_horaria: 40,
        observacoes: ''
      });
      toast({
        title: "Sucesso",
        description: "Funcionário adicionado com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getCargoLabel = (cargo: string) => {
    const labels: Record<string, string> = {
      'assessor': 'Assessor',
      'estagiario': 'Estagiário',
      'coordenador': 'Coordenador',
      'secretario': 'Secretário',
      'chefe_gabinete': 'Chefe de Gabinete'
    };
    return labels[cargo] || cargo;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'licenca': return 'bg-yellow-100 text-yellow-800';
      case 'ferias': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFuncionarios = funcionarios.filter(f => 
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Equipe</h1>
          <p className="text-gray-600">Gerencie sua equipe, tarefas e controle de ponto</p>
        </div>
        <div className="flex gap-2">
          <Link to="/equipe-completa">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Central Completa
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Funcionário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={novoFuncionario.nome}
                    onChange={(e) => setNovoFuncionario(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={novoFuncionario.email}
                    onChange={(e) => setNovoFuncionario(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label>Cargo</Label>
                  <Select value={novoFuncionario.cargo} onValueChange={(value: CargoEquipe) => setNovoFuncionario(prev => ({ ...prev, cargo: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessor">Assessor</SelectItem>
                      <SelectItem value="estagiario">Estagiário</SelectItem>
                      <SelectItem value="coordenador">Coordenador</SelectItem>
                      <SelectItem value="secretario">Secretário</SelectItem>
                      <SelectItem value="chefe_gabinete">Chefe de Gabinete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data de Admissão</Label>
                  <Input
                    type="date"
                    value={novoFuncionario.data_admissao}
                    onChange={(e) => setNovoFuncionario(prev => ({ ...prev, data_admissao: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Carga Horária (horas/semana)</Label>
                  <Input
                    type="number"
                    value={novoFuncionario.carga_horaria}
                    onChange={(e) => setNovoFuncionario(prev => ({ ...prev, carga_horaria: parseInt(e.target.value) }))}
                  />
                </div>
                <Button onClick={handleCreateFuncionario} className="w-full">
                  Adicionar Funcionário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{funcionarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-xl font-bold">{funcionarios.filter(f => f.status === 'ativo').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Tarefas</p>
                <p className="text-xl font-bold">{tarefas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Registros</p>
                <p className="text-xl font-bold">{registros.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funcionarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funcionarios" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="tarefas" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Tarefas
          </TabsTrigger>
          <TabsTrigger value="ponto" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ponto Eletrônico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funcionarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipe do Gabinete</CardTitle>
              <CardDescription>
                {funcionarios.length} funcionário(s) cadastrado(s)
              </CardDescription>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar funcionários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingFuncionarios ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <div className="space-y-4">
                  {filteredFuncionarios.map((funcionario) => (
                    <div key={funcionario.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{funcionario.nome}</h3>
                            <Badge className={getStatusColor(funcionario.status)}>
                              {funcionario.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Cargo:</strong> {getCargoLabel(funcionario.cargo)}</p>
                            <p><strong>Email:</strong> {funcionario.email}</p>
                            <p><strong>Admissão:</strong> {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}</p>
                            <p><strong>Carga Horária:</strong> {funcionario.carga_horaria}h/semana</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteFuncionario(funcionario.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tarefas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas da Equipe</CardTitle>
              <CardDescription>
                Distribua e acompanhe tarefas da sua equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tarefas.map((tarefa) => (
                  <div key={tarefa.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{tarefa.titulo}</h3>
                          <Badge variant={tarefa.status === 'concluida' ? 'default' : 'secondary'}>
                            {tarefa.status}
                          </Badge>
                          <Badge variant="outline">
                            {tarefa.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                        <div className="text-xs text-gray-500">
                          <p>Responsável: {tarefa.funcionario?.nome}</p>
                          <p>Prazo: {tarefa.data_limite ? new Date(tarefa.data_limite).toLocaleDateString('pt-BR') : 'Sem prazo'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {tarefa.status === 'concluida' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ponto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Ponto</CardTitle>
              <CardDescription>
                Registros de entrada e saída da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registros.map((registro) => (
                  <div key={registro.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{registro.funcionario?.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {registro.tipo} - {new Date(registro.data_hora).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {registro.tipo}
                      </Badge>
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
}
