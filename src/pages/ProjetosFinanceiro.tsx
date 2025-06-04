
import { useState } from 'react';
import { Plus, Search, TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjetosFinanceiro, StatusProjeto, PrioridadeProjeto, CategoriaProjeto } from '@/hooks/useProjetosFinanceiro';

const ProjetosFinanceiro = () => {
  const { projetos, loading } = useProjetosFinanceiro();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusProjeto | 'todos'>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaProjeto | 'todos'>('todos');

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.nome_projeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          projeto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || projeto.status === statusFilter;
    const matchesCategoria = categoriaFilter === 'todos' || projeto.categoria === categoriaFilter;
    
    return matchesSearch && matchesStatus && matchesCategoria;
  });

  const totalEstimado = projetos.reduce((acc, proj) => acc + proj.custo_estimado, 0);
  const totalReal = projetos.reduce((acc, proj) => acc + proj.custo_real, 0);
  const totalBeneficiarios = projetos.reduce((acc, proj) => acc + (proj.beneficiarios_estimados || 0), 0);

  const getStatusColor = (status: StatusProjeto) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'execucao': return 'bg-blue-100 text-blue-800';
      case 'aprovacao': return 'bg-yellow-100 text-yellow-800';
      case 'planejamento': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: StatusProjeto) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'execucao': return 'Em Execução';
      case 'aprovacao': return 'Em Aprovação';
      case 'planejamento': return 'Planejamento';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: PrioridadeProjeto) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaLabel = (categoria?: CategoriaProjeto) => {
    if (!categoria) return '';
    switch (categoria) {
      case 'infraestrutura': return 'Infraestrutura';
      case 'social': return 'Social';
      case 'educacao': return 'Educação';
      case 'saude': return 'Saúde';
      case 'outros': return 'Outros';
      default: return categoria;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateProgress = (projeto: any) => {
    if (projeto.custo_estimado === 0) return 0;
    return Math.min((projeto.custo_real / projeto.custo_estimado) * 100, 100);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos com Impacto Financeiro</h1>
          <p className="text-gray-600 mt-1">Acompanhamento de custos e benefícios dos projetos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custo Estimado Total</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalEstimado)}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custo Real</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReal)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beneficiários</p>
                <p className="text-2xl font-bold text-purple-600">{totalBeneficiarios.toLocaleString('pt-BR')}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Projetos</p>
                <p className="text-2xl font-bold text-orange-600">{projetos.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou descrição do projeto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusProjeto | 'todos')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="planejamento">Planejamento</SelectItem>
                <SelectItem value="aprovacao">Em Aprovação</SelectItem>
                <SelectItem value="execucao">Em Execução</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoriaFilter} onValueChange={(value) => setCategoriaFilter(value as CategoriaProjeto | 'todos')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Projetos */}
      <div className="space-y-4">
        {filteredProjetos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum projeto encontrado com os filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjetos.map((projeto) => (
            <Card key={projeto.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{projeto.nome_projeto}</h3>
                      <Badge className={getStatusColor(projeto.status)}>
                        {getStatusLabel(projeto.status)}
                      </Badge>
                      <Badge className={getPrioridadeColor(projeto.prioridade)}>
                        {projeto.prioridade.toUpperCase()}
                      </Badge>
                      {projeto.categoria && (
                        <Badge variant="outline" className="text-xs">
                          {getCategoriaLabel(projeto.categoria)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{projeto.descricao}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Custo Estimado</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(projeto.custo_estimado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Custo Real</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(projeto.custo_real)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Beneficiários</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {projeto.beneficiarios_estimados?.toLocaleString('pt-BR') || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progresso Financeiro</p>
                    <div className="flex items-center gap-2">
                      <Progress value={calculateProgress(projeto)} className="flex-1" />
                      <span className="text-sm font-medium">{calculateProgress(projeto).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {(projeto.data_inicio_prevista || projeto.data_fim_prevista) && (
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    {projeto.data_inicio_prevista && (
                      <span>Início previsto: {new Date(projeto.data_inicio_prevista).toLocaleDateString('pt-BR')}</span>
                    )}
                    {projeto.data_fim_prevista && (
                      <span>Fim previsto: {new Date(projeto.data_fim_prevista).toLocaleDateString('pt-BR')}</span>
                    )}
                    {projeto.fonte_recurso && (
                      <span>• Fonte: <strong>{projeto.fonte_recurso}</strong></span>
                    )}
                  </div>
                )}

                {projeto.impacto_social && (
                  <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                    <strong>Impacto Social:</strong> {projeto.impacto_social}
                  </div>
                )}

                {projeto.riscos_identificados && (
                  <div className="mt-3 p-3 bg-red-50 rounded text-sm">
                    <strong>Riscos Identificados:</strong> {projeto.riscos_identificados}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjetosFinanceiro;
