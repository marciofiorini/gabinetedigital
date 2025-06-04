
import { useState } from 'react';
import { Plus, Search, Download, Calendar, Receipt as ReceiptIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrestacaoContas, StatusPrestacao, CategoriaPrestacao } from '@/hooks/usePrestacaoContas';

const PrestacaoContas = () => {
  const { prestacoes, loading } = usePrestacaoContas();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusPrestacao | 'todos'>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaPrestacao | 'todos'>('todos');

  const filteredPrestacoes = prestacoes.filter(prestacao => {
    const matchesSearch = prestacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prestacao.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || prestacao.status === statusFilter;
    const matchesCategoria = categoriaFilter === 'todos' || prestacao.categoria === categoriaFilter;
    
    return matchesSearch && matchesStatus && matchesCategoria;
  });

  const totalGastos = prestacoes.reduce((acc, prest) => acc + prest.valor, 0);
  const gastosPorCategoria = prestacoes.reduce((acc, prest) => {
    acc[prest.categoria] = (acc[prest.categoria] || 0) + prest.valor;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: StatusPrestacao) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'revisado': return 'bg-blue-100 text-blue-800';
      case 'lancado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: StatusPrestacao) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'revisado': return 'Revisado';
      case 'lancado': return 'Lançado';
      default: return status;
    }
  };

  const getCategoriaLabel = (categoria: CategoriaPrestacao) => {
    switch (categoria) {
      case 'pessoal': return 'Pessoal';
      case 'material': return 'Material';
      case 'servicos': return 'Serviços';
      case 'viagens': return 'Viagens';
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
          <h1 className="text-3xl font-bold text-gray-900">Prestação de Contas</h1>
          <p className="text-gray-600 mt-1">Relatórios de gastos do gabinete</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Prestação
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Gastos</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGastos)}</p>
              </div>
              <ReceiptIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lançamentos</p>
                <p className="text-2xl font-bold text-gray-600">{prestacoes.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Gastos por Categoria</p>
              <div className="space-y-1">
                {Object.entries(gastosPorCategoria).slice(0, 3).map(([categoria, valor]) => (
                  <div key={categoria} className="flex justify-between text-xs">
                    <span className="capitalize">{getCategoriaLabel(categoria as CategoriaPrestacao)}</span>
                    <span className="font-medium">{formatCurrency(valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Status dos Lançamentos</p>
              <div className="space-y-1">
                {['lancado', 'revisado', 'aprovado'].map(status => {
                  const count = prestacoes.filter(p => p.status === status).length;
                  return (
                    <div key={status} className="flex justify-between text-xs">
                      <span className="capitalize">{getStatusLabel(status as StatusPrestacao)}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
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
                  placeholder="Buscar por descrição ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusPrestacao | 'todos')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="lancado">Lançado</SelectItem>
                <SelectItem value="revisado">Revisado</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoriaFilter} onValueChange={(value) => setCategoriaFilter(value as CategoriaPrestacao | 'todos')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                <SelectItem value="pessoal">Pessoal</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="viagens">Viagens</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Prestações */}
      <div className="space-y-4">
        {filteredPrestacoes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhuma prestação de contas encontrada com os filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPrestacoes.map((prestacao) => (
            <Card key={prestacao.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{prestacao.descricao}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getCategoriaLabel(prestacao.categoria)}
                      </Badge>
                      {prestacao.subcategoria && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          {prestacao.subcategoria}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span>Período: {new Date(prestacao.periodo_inicio).toLocaleDateString('pt-BR')} - {new Date(prestacao.periodo_fim).toLocaleDateString('pt-BR')}</span>
                      {prestacao.fornecedor && (
                        <span>• Fornecedor: <strong>{prestacao.fornecedor}</strong></span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(prestacao.status)}>
                      {getStatusLabel(prestacao.status)}
                    </Badge>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {formatCurrency(prestacao.valor)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {prestacao.numero_nota_fiscal && (
                    <div>
                      <p className="text-gray-600">Nota Fiscal</p>
                      <p className="font-medium">{prestacao.numero_nota_fiscal}</p>
                    </div>
                  )}
                  {prestacao.data_pagamento && (
                    <div>
                      <p className="text-gray-600">Data de Pagamento</p>
                      <p className="font-medium">{new Date(prestacao.data_pagamento).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                  {prestacao.centro_custo && (
                    <div>
                      <p className="text-gray-600">Centro de Custo</p>
                      <p className="font-medium">{prestacao.centro_custo}</p>
                    </div>
                  )}
                </div>

                {prestacao.projeto_relacionado && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                    <strong>Projeto Relacionado:</strong> {prestacao.projeto_relacionado}
                  </div>
                )}

                {prestacao.observacoes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <strong>Observações:</strong> {prestacao.observacoes}
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

export default PrestacaoContas;
