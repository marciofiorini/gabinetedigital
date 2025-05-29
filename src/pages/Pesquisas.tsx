
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Share2
} from "lucide-react";

// Mock data para as pesquisas
const mockPesquisas = [
  {
    id: 1,
    titulo: "Intenção de Voto - Prefeito 2024",
    tipo: "Eleitoral",
    status: "Concluída",
    dataInicio: "2024-01-15",
    dataFim: "2024-01-22",
    amostra: 1200,
    margem: 3.2,
    resultados: [
      { nome: "João Silva", porcentagem: 35.2 },
      { nome: "Maria Santos", porcentagem: 28.7 },
      { nome: "Pedro Costa", porcentagem: 18.3 },
      { nome: "Ana Oliveira", porcentagem: 12.8 },
      { nome: "Indecisos", porcentagem: 5.0 }
    ]
  },
  {
    id: 2,
    titulo: "Aprovação Governo Municipal",
    tipo: "Opinião",
    status: "Em Andamento",
    dataInicio: "2024-02-01",
    dataFim: "2024-02-08",
    amostra: 800,
    margem: 3.5,
    resultados: [
      { nome: "Aprova", porcentagem: 42.3 },
      { nome: "Desaprova", porcentagem: 38.7 },
      { nome: "Não sabe", porcentagem: 19.0 }
    ]
  },
  {
    id: 3,
    titulo: "Prioridades para Educação",
    tipo: "Temática",
    status: "Planejada",
    dataInicio: "2024-03-01",
    dataFim: "2024-03-08",
    amostra: 1000,
    margem: 3.1,
    resultados: []
  }
];

const mockEvoluçaoIntencao = [
  { mes: "Jan", joao: 32, maria: 31, pedro: 20, ana: 17 },
  { mes: "Fev", joao: 34, maria: 30, pedro: 19, ana: 17 },
  { mes: "Mar", joao: 35, maria: 29, pedro: 18, ana: 18 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Pesquisas = () => {
  const [pesquisas] = useState(mockPesquisas);
  const [selectedPesquisa, setSelectedPesquisa] = useState<typeof mockPesquisas[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date>();

  const pesquisasFiltradas = pesquisas.filter(pesquisa => {
    const matchTipo = filtroTipo === 'todos' || pesquisa.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || pesquisa.status === filtroStatus;
    const matchSearch = pesquisa.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipo && matchStatus && matchSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída': return 'bg-green-500';
      case 'Em Andamento': return 'bg-blue-500';
      case 'Planejada': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Eleitoral': return 'bg-purple-100 text-purple-800';
      case 'Opinião': return 'bg-blue-100 text-blue-800';
      case 'Temática': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const estatisticas = {
    total: pesquisas.length,
    concluidas: pesquisas.filter(p => p.status === 'Concluída').length,
    emAndamento: pesquisas.filter(p => p.status === 'Em Andamento').length,
    planejadas: pesquisas.filter(p => p.status === 'Planejada').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pesquisas</h1>
          <p className="text-gray-600 mt-1">Gerencie e analise suas pesquisas eleitorais e de opinião</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Pesquisa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Pesquisa</DialogTitle>
              <DialogDescription>
                Configure uma nova pesquisa eleitoral ou de opinião
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Pesquisa</Label>
                <Input id="titulo" placeholder="Ex: Intenção de Voto Prefeito 2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eleitoral">Eleitoral</SelectItem>
                    <SelectItem value="opiniao">Opinião</SelectItem>
                    <SelectItem value="tematica">Temática</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amostra">Tamanho da Amostra</Label>
                <Input id="amostra" type="number" placeholder="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margem">Margem de Erro (%)</Label>
                <Input id="margem" type="number" step="0.1" placeholder="3.2" />
              </div>
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal text-muted-foreground"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Selecionar data
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Descreva os objetivos desta pesquisa..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Criar Pesquisa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{estatisticas.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{estatisticas.concluidas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planejadas</p>
                <p className="text-2xl font-bold text-yellow-600">{estatisticas.planejadas}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar pesquisas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Eleitoral">Eleitoral</SelectItem>
                <SelectItem value="Opinião">Opinião</SelectItem>
                <SelectItem value="Temática">Temática</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Planejada">Planejada</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pesquisas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pesquisasFiltradas.map((pesquisa) => (
          <Card key={pesquisa.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{pesquisa.titulo}</CardTitle>
                  <CardDescription>
                    {pesquisa.dataInicio} - {pesquisa.dataFim}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTipoColor(pesquisa.tipo)}>
                    {pesquisa.tipo}
                  </Badge>
                  <Badge className={`text-white ${getStatusColor(pesquisa.status)}`}>
                    {pesquisa.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Amostra: {pesquisa.amostra.toLocaleString()}</span>
                  <span>Margem: ±{pesquisa.margem}%</span>
                </div>
                
                {pesquisa.resultados.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Resultados Principais:</h4>
                    {pesquisa.resultados.slice(0, 3).map((resultado, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{resultado.nome}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={resultado.porcentagem} 
                            className="w-20 h-2" 
                          />
                          <span className="text-sm font-medium">{resultado.porcentagem}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPesquisa(pesquisa)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Detalhes da Pesquisa */}
      {selectedPesquisa && (
        <Dialog open={!!selectedPesquisa} onOpenChange={() => setSelectedPesquisa(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPesquisa.titulo}</DialogTitle>
              <DialogDescription>
                Resultados detalhados da pesquisa
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="resultados" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="resultados">Resultados</TabsTrigger>
                <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                <TabsTrigger value="evolucao">Evolução</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resultados" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Período:</span>
                          <span>{selectedPesquisa.dataInicio} - {selectedPesquisa.dataFim}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amostra:</span>
                          <span>{selectedPesquisa.amostra.toLocaleString()} entrevistados</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margem de Erro:</span>
                          <span>±{selectedPesquisa.margem}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tipo:</span>
                          <Badge className={getTipoColor(selectedPesquisa.tipo)}>
                            {selectedPesquisa.tipo}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resultados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPesquisa.resultados.map((resultado, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{resultado.nome}</span>
                              <span className="text-lg font-bold">{resultado.porcentagem}%</span>
                            </div>
                            <Progress value={resultado.porcentagem} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="graficos" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição em Barras</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={selectedPesquisa.resultados}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="porcentagem" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição em Pizza</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={selectedPesquisa.resultados}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ nome, porcentagem }) => `${nome}: ${porcentagem}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="porcentagem"
                          >
                            {selectedPesquisa.resultados.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="evolucao" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução da Intenção de Voto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={mockEvoluçaoIntencao}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="joao" stroke="#3B82F6" name="João Silva" />
                        <Line type="monotone" dataKey="maria" stroke="#10B981" name="Maria Santos" />
                        <Line type="monotone" dataKey="pedro" stroke="#F59E0B" name="Pedro Costa" />
                        <Line type="monotone" dataKey="ana" stroke="#EF4444" name="Ana Oliveira" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Pesquisas;
