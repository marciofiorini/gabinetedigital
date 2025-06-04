
import { useState } from 'react';
import { Plus, Search, Filter, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrcamentoPublico, StatusOrcamento, TipoOrcamento } from '@/hooks/useOrcamentoPublico';

const OrcamentoPublico = () => {
  const { orcamentos, loading } = useOrcamentoPublico();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusOrcamento | 'todos'>('todos');
  const [tipoFilter, setTipoFilter] = useState<TipoOrcamento | 'todos'>('todos');

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const matchesSearch = orcamento.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          orcamento.numero_emenda?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || orcamento.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || orcamento.tipo === tipoFilter;
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalGeral = orcamentos.reduce((acc, orc) => acc + orc.valor_total, 0);
  const totalExecutado = orcamentos.reduce((acc, orc) => acc + orc.valor_executado, 0);
  const totalPendente = totalGeral - totalExecutado;

  const getStatusColor = (status: StatusOrcamento) => {
    switch (status) {
      case 'executado': return 'bg-green-100 text-green-800';
      case 'em_execucao': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: StatusOrcamento) => {
    switch (status) {
      case 'executado': return 'Executado';
      case 'em_execucao': return 'Em Execução';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          <h1 className="text-3xl font-bold text-gray-900">Orçamento Público</h1>
          <p className="text-gray-600 mt-1">Acompanhamento de emendas e recursos destinados</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Emenda/Recurso
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Aprovado</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGeral)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Executado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalExecutado)}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPendente)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">% Execução</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalGeral > 0 ? ((totalExecutado / totalGeral) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
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
                  placeholder="Buscar por descrição ou número da emenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusOrcamento | 'todos')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_execucao">Em Execução</SelectItem>
                <SelectItem value="executado">Executado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={(value) => setTipoFilter(value as TipoOrcamento | 'todos')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="emenda">Emenda</SelectItem>
                <SelectItem value="recurso">Recurso</SelectItem>
                <SelectItem value="verba">Verba</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Orçamentos */}
      <div className="space-y-4">
        {filteredOrcamentos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum orçamento encontrado com os filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrcamentos.map((orcamento) => (
            <Card key={orcamento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{orcamento.descricao}</h3>
                      {orcamento.numero_emenda && (
                        <Badge variant="outline" className="text-xs">
                          {orcamento.numero_emenda}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span>Tipo: <strong>{orcamento.tipo}</strong></span>
                      {orcamento.origem && (
                        <span>• Origem: <strong>{orcamento.origem}</strong></span>
                      )}
                      {orcamento.destino && (
                        <span>• Destino: <strong>{orcamento.destino}</strong></span>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(orcamento.status)}>
                    {getStatusLabel(orcamento.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(orcamento.valor_total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Executado</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(orcamento.valor_executado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Pendente</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {formatCurrency(orcamento.valor_total - orcamento.valor_executado)}
                    </p>
                  </div>
                </div>

                {orcamento.data_limite && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Data limite: {new Date(orcamento.data_limite).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {orcamento.observacoes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <strong>Observações:</strong> {orcamento.observacoes}
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

export default OrcamentoPublico;
