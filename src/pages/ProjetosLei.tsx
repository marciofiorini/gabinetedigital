
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

const ProjetosLei = () => {
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
    console.log('Salvando projeto:', novoProjeto);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (projeto: any) => {
    setEditingProjeto(projeto);
    setNovoProjeto(projeto);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto do monitoramento?')) {
      console.log('Deletando projeto:', id);
    }
  };

  const handleViewTramitacoes = (projetoId: string) => {
    setViewingTramitacoes(projetoId);
  };

  // Mock data for demonstration
  const projetos = [
    {
      id: '1',
      numero_projeto: 'PL 1234/2024',
      tipo_projeto: 'Projeto de Lei',
      titulo: 'Lei de Proteção de Dados Municipais',
      autor: 'Dep. João Silva',
      casa_legislativa: 'Câmara Municipal',
      urgencia: 'alta',
      situacao_atual: 'Em tramitação'
    }
  ];

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.numero_projeto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCasa = !casaFilter || projeto.casa_legislativa === casaFilter;
    const matchesUrgencia = !urgenciaFilter || projeto.urgencia === urgenciaFilter;
    
    return matchesSearch && matchesCasa && matchesUrgencia;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Projetos de Lei</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitoramento Legislativo</CardTitle>
          <CardDescription>
            Acompanhe projetos de lei e proposições legislativas relevantes
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
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="Câmara Municipal">Câmara Municipal</SelectItem>
                <SelectItem value="Assembleia Legislativa">Assembleia Legislativa</SelectItem>
                <SelectItem value="Câmara dos Deputados">Câmara dos Deputados</SelectItem>
                <SelectItem value="Senado Federal">Senado Federal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgenciaFilter} onValueChange={setUrgenciaFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
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
                    {editingProjeto ? 'Editar Projeto' : 'Novo Projeto de Monitoramento'}
                  </DialogTitle>
                  <DialogDescription>
                    Cadastre um novo projeto de lei para monitoramento
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
                        placeholder="Ex: PL 1234/2024"
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
                          <SelectItem value="projeto-lei">Projeto de Lei</SelectItem>
                          <SelectItem value="lei-complementar">Lei Complementar</SelectItem>
                          <SelectItem value="emenda-constitucional">Emenda Constitucional</SelectItem>
                          <SelectItem value="decreto-legislativo">Decreto Legislativo</SelectItem>
                          <SelectItem value="resolucao">Resolução</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="titulo">Título/Ementa *</Label>
                    <Input
                      id="titulo"
                      value={novoProjeto.titulo}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, titulo: e.target.value })}
                      placeholder="Título ou ementa do projeto"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="autor">Autor(es)</Label>
                    <Input
                      id="autor"
                      value={novoProjeto.autor}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, autor: e.target.value })}
                      placeholder="Nome do(s) autor(es)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="camara-municipal">Câmara Municipal</SelectItem>
                          <SelectItem value="assembleia-legislativa">Assembleia Legislativa</SelectItem>
                          <SelectItem value="camara-deputados">Câmara dos Deputados</SelectItem>
                          <SelectItem value="senado-federal">Senado Federal</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="critica">Crítica</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novoProjeto.observacoes}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, observacoes: e.target.value })}
                      placeholder="Observações sobre o projeto..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingProjeto ? 'Atualizar' : 'Criar'} Projeto
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
                  <TableHead>Autor</TableHead>
                  <TableHead>Casa</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.map((projeto) => (
                  <TableRow key={projeto.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{projeto.numero_projeto}</div>
                        <div className="text-sm text-gray-500">{projeto.titulo}</div>
                      </div>
                    </TableCell>
                    <TableCell>{projeto.autor}</TableCell>
                    <TableCell>{projeto.casa_legislativa}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={projeto.urgencia === 'alta' ? 'destructive' : 'secondary'}
                      >
                        {projeto.urgencia}
                      </Badge>
                    </TableCell>
                    <TableCell>{projeto.situacao_atual}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTramitacoes(projeto.id)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
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
              Nenhum projeto encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjetosLei;
