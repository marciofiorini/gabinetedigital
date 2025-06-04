
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Edit, Trash2, Search, Eye, ExternalLink, History } from 'lucide-react';
import { useMonitoramentoLegislativo } from '@/hooks/useMonitoramentoLegislativo';

const ProjetosLei = () => {
  const { projetos, tramitacoes, loading, createProjeto, updateProjeto, deleteProjeto, addTramitacao, fetchTramitacoes } = useMonitoramentoLegislativo();
  const [searchTerm, setSearchTerm] = useState('');
  const [casaFilter, setCasaFilter] = useState('');
  const [urgenciaFilter, setUrgenciaFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<any>(null);
  const [viewingTramitacoes, setViewingTramitacoes] = useState<string | null>(null);

  const [novoProjeto, setNovoProjeto] = useState({
    numero_projeto: '',
    tipo_projeto: '',
    titulo: '',
    ementa: '',
    autor: '',
    casa_legislativa: '',
    data_apresentacao: '',
    situacao_atual: '',
    tramitacao_atual: '',
    urgencia: 'normal',
    tema_relacionado: '',
    impacto_estimado: '',
    observacoes: '',
    link_projeto: '',
    status_monitoramento: 'ativo',
    alertas_configurados: []
  });

  const resetForm = () => {
    setNovoProjeto({
      numero_projeto: '',
      tipo_projeto: '',
      titulo: '',
      ementa: '',
      autor: '',
      casa_legislativa: '',
      data_apresentacao: '',
      situacao_atual: '',
      tramitacao_atual: '',
      urgencia: 'normal',
      tema_relacionado: '',
      impacto_estimado: '',
      observacoes: '',
      link_projeto: '',
      status_monitoramento: 'ativo',
      alertas_configurados: []
    });
    setEditingProjeto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjeto) {
        await updateProjeto(editingProjeto.id, novoProjeto);
      } else {
        await createProjeto(novoProjeto);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const handleEdit = (projeto: any) => {
    setEditingProjeto(projeto);
    setNovoProjeto(projeto);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto do monitoramento?')) {
      await deleteProjeto(id);
    }
  };

  const handleViewTramitacoes = (projetoId: string) => {
    setViewingTramitacoes(projetoId);
    fetchTramitacoes(projetoId);
  };

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.numero_projeto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCasa = !casaFilter || projeto.casa_legislativa === casaFilter;
    const matchesUrgencia = !urgenciaFilter || projeto.urgencia === urgenciaFilter;
    
    return matchesSearch && matchesCasa && matchesUrgencia;
  });

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Carregando monitoramento legislativo...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projetos de Lei</h1>
        <p className="text-gray-600">Monitoramento de projetos em tramitação nas casas legislativas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Monitoramento Legislativo
          </CardTitle>
          <CardDescription>
            Acompanhe projetos de lei e sua tramitação nas casas legislativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={casaFilter} onValueChange={setCasaFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Casa Legislativa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="camara_municipal">Câmara Municipal</SelectItem>
                <SelectItem value="assembleia_legislativa">Assembleia Legislativa</SelectItem>
                <SelectItem value="camara_deputados">Câmara dos Deputados</SelectItem>
                <SelectItem value="senado_federal">Senado Federal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgenciaFilter} onValueChange={setUrgenciaFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProjeto ? 'Editar Projeto' : 'Novo Projeto Legislativo'}
                  </DialogTitle>
                  <DialogDescription>
                    Adicione um projeto para monitoramento
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numero_projeto">Número do Projeto *</Label>
                      <Input
                        id="numero_projeto"
                        value={novoProjeto.numero_projeto}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, numero_projeto: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo_projeto">Tipo de Projeto *</Label>
                      <Select
                        value={novoProjeto.tipo_projeto}
                        onValueChange={(value) => setNovoProjeto({ ...novoProjeto, tipo_projeto: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="projeto_lei">Projeto de Lei</SelectItem>
                          <SelectItem value="projeto_lei_complementar">Projeto de Lei Complementar</SelectItem>
                          <SelectItem value="medida_provisoria">Medida Provisória</SelectItem>
                          <SelectItem value="proposta_emenda_constitucional">Proposta de Emenda Constitucional</SelectItem>
                          <SelectItem value="decreto_legislativo">Decreto Legislativo</SelectItem>
                          <SelectItem value="resolucao">Resolução</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={novoProjeto.titulo}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ementa">Ementa</Label>
                    <Textarea
                      id="ementa"
                      value={novoProjeto.ementa}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, ementa: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="autor">Autor</Label>
                      <Input
                        id="autor"
                        value={novoProjeto.autor}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, autor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="casa_legislativa">Casa Legislativa *</Label>
                      <Select
                        value={novoProjeto.casa_legislativa}
                        onValueChange={(value) => setNovoProjeto({ ...novoProjeto, casa_legislativa: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a casa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="camara_municipal">Câmara Municipal</SelectItem>
                          <SelectItem value="assembleia_legislativa">Assembleia Legislativa</SelectItem>
                          <SelectItem value="camara_deputados">Câmara dos Deputados</SelectItem>
                          <SelectItem value="senado_federal">Senado Federal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_apresentacao">Data de Apresentação</Label>
                      <Input
                        id="data_apresentacao"
                        type="date"
                        value={novoProjeto.data_apresentacao}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, data_apresentacao: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="urgencia">Urgência</Label>
                      <Select
                        value={novoProjeto.urgencia}
                        onValueChange={(value) => setNovoProjeto({ ...novoProjeto, urgencia: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="situacao_atual">Situação Atual</Label>
                      <Input
                        id="situacao_atual"
                        value={novoProjeto.situacao_atual}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, situacao_atual: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tema_relacionado">Tema Relacionado</Label>
                      <Input
                        id="tema_relacionado"
                        value={novoProjeto.tema_relacionado}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, tema_relacionado: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="link_projeto">Link do Projeto</Label>
                    <Input
                      id="link_projeto"
                      value={novoProjeto.link_projeto}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, link_projeto: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="impacto_estimado">Impacto Estimado</Label>
                    <Textarea
                      id="impacto_estimado"
                      value={novoProjeto.impacto_estimado}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, impacto_estimado: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novoProjeto.observacoes}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, observacoes: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingProjeto ? 'Atualizar' : 'Adicionar'} Projeto
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Casa</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.map((projeto) => (
                  <TableRow key={projeto.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{projeto.numero_projeto}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {projeto.titulo}
                        </div>
                        <div className="text-xs text-gray-500">{projeto.autor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {projeto.casa_legislativa}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {projeto.situacao_atual}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getUrgenciaColor(projeto.urgencia)}>
                        {projeto.urgencia}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(projeto.status_monitoramento)}>
                        {projeto.status_monitoramento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTramitacoes(projeto.id)}
                          title="Ver tramitações"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        {projeto.link_projeto && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(projeto.link_projeto, '_blank')}
                            title="Abrir link do projeto"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(projeto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(projeto.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjetos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum projeto encontrado para monitoramento
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar tramitações */}
      <Dialog open={!!viewingTramitacoes} onOpenChange={() => setViewingTramitacoes(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Tramitação</DialogTitle>
            <DialogDescription>
              Acompanhe o histórico de tramitação do projeto
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Despacho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tramitacoes.map((tramitacao) => (
                  <TableRow key={tramitacao.id}>
                    <TableCell>
                      {new Date(tramitacao.data_tramitacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {tramitacao.orgao}
                    </TableCell>
                    <TableCell>
                      {tramitacao.situacao}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {tramitacao.despacho}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjetosLei;
