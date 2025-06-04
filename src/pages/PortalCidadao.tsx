
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
import { Users, MessageSquare, Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { useConsultasPublicas } from '@/hooks/useConsultasPublicas';

const PortalCidadao = () => {
  const { consultas, loading, createConsulta, updateConsulta, deleteConsulta, fetchParticipacoes, participacoes } = useConsultasPublicas();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConsulta, setEditingConsulta] = useState<any>(null);
  const [viewingParticipacoes, setViewingParticipacoes] = useState<string | null>(null);

  const [novaConsulta, setNovaConsulta] = useState({
    titulo: '',
    descricao: '',
    tipo_consulta: '',
    tema: '',
    data_inicio: '',
    data_fim: '',
    status: 'planejada',
    publico_alvo: '',
    local_realizacao: '',
    modalidade: 'presencial',
    link_participacao: '',
    resultados: null,
    documentos: []
  });

  const resetForm = () => {
    setNovaConsulta({
      titulo: '',
      descricao: '',
      tipo_consulta: '',
      tema: '',
      data_inicio: '',
      data_fim: '',
      status: 'planejada',
      publico_alvo: '',
      local_realizacao: '',
      modalidade: 'presencial',
      link_participacao: '',
      resultados: null,
      documentos: []
    });
    setEditingConsulta(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConsulta) {
        await updateConsulta(editingConsulta.id, novaConsulta);
      } else {
        await createConsulta(novaConsulta);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
    }
  };

  const handleEdit = (consulta: any) => {
    setEditingConsulta(consulta);
    setNovaConsulta(consulta);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta pública?')) {
      await deleteConsulta(id);
    }
  };

  const handleViewParticipacoes = (consultaId: string) => {
    setViewingParticipacoes(consultaId);
    fetchParticipacoes(consultaId);
  };

  const filteredConsultas = consultas.filter(consulta => {
    const matchesSearch = consulta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consulta.tema?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || consulta.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejada': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-green-100 text-green-800';
      case 'finalizada': return 'bg-gray-100 text-gray-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Carregando consultas públicas...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portal do Cidadão</h1>
        <p className="text-gray-600">Consultas públicas para engajamento democrático</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Consultas Públicas
          </CardTitle>
          <CardDescription>
            Gerencie consultas públicas para promover a participação cidadã
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou tema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="planejada">Planejada</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Consulta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingConsulta ? 'Editar Consulta' : 'Nova Consulta Pública'}
                  </DialogTitle>
                  <DialogDescription>
                    Crie uma nova consulta pública para engajamento cidadão
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={novaConsulta.titulo}
                      onChange={(e) => setNovaConsulta({ ...novaConsulta, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                      id="descricao"
                      value={novaConsulta.descricao}
                      onChange={(e) => setNovaConsulta({ ...novaConsulta, descricao: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipo_consulta">Tipo de Consulta *</Label>
                      <Select
                        value={novaConsulta.tipo_consulta}
                        onValueChange={(value) => setNovaConsulta({ ...novaConsulta, tipo_consulta: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="audiencia_publica">Audiência Pública</SelectItem>
                          <SelectItem value="consulta_online">Consulta Online</SelectItem>
                          <SelectItem value="forum_discussao">Fórum de Discussão</SelectItem>
                          <SelectItem value="mesa_redonda">Mesa Redonda</SelectItem>
                          <SelectItem value="reuniao_comunitaria">Reunião Comunitária</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tema">Tema</Label>
                      <Input
                        id="tema"
                        value={novaConsulta.tema}
                        onChange={(e) => setNovaConsulta({ ...novaConsulta, tema: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_inicio">Data de Início *</Label>
                      <Input
                        id="data_inicio"
                        type="date"
                        value={novaConsulta.data_inicio}
                        onChange={(e) => setNovaConsulta({ ...novaConsulta, data_inicio: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="data_fim">Data de Fim *</Label>
                      <Input
                        id="data_fim"
                        type="date"
                        value={novaConsulta.data_fim}
                        onChange={(e) => setNovaConsulta({ ...novaConsulta, data_fim: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="modalidade">Modalidade</Label>
                      <Select
                        value={novaConsulta.modalidade}
                        onValueChange={(value) => setNovaConsulta({ ...novaConsulta, modalidade: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presencial">Presencial</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="hibrida">Híbrida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="publico_alvo">Público Alvo</Label>
                      <Input
                        id="publico_alvo"
                        value={novaConsulta.publico_alvo}
                        onChange={(e) => setNovaConsulta({ ...novaConsulta, publico_alvo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="local_realizacao">Local de Realização</Label>
                    <Input
                      id="local_realizacao"
                      value={novaConsulta.local_realizacao}
                      onChange={(e) => setNovaConsulta({ ...novaConsulta, local_realizacao: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="link_participacao">Link de Participação</Label>
                    <Input
                      id="link_participacao"
                      value={novaConsulta.link_participacao}
                      onChange={(e) => setNovaConsulta({ ...novaConsulta, link_participacao: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingConsulta ? 'Atualizar' : 'Criar'} Consulta
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
                  <TableHead>Consulta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultas.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{consulta.titulo}</div>
                        <div className="text-sm text-gray-500">{consulta.tema}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {consulta.tipo_consulta}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(consulta.data_inicio).toLocaleDateString('pt-BR')}</div>
                        <div className="text-gray-500">até {new Date(consulta.data_fim).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(consulta.status)}>
                        {consulta.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewParticipacoes(consulta.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {consulta.total_participantes || 0}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(consulta)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(consulta.id)}
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

          {filteredConsultas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma consulta pública encontrada
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar participações */}
      <Dialog open={!!viewingParticipacoes} onOpenChange={() => setViewingParticipacoes(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Participações</DialogTitle>
            <DialogDescription>
              Lista de participações na consulta pública
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Contribuição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participacoes.map((participacao) => (
                  <TableRow key={participacao.id}>
                    <TableCell className="font-medium">
                      {participacao.nome_participante}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {participacao.email && <div>{participacao.email}</div>}
                        {participacao.telefone && <div>{participacao.telefone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(participacao.data_participacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {participacao.contribuicao}
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

export default PortalCidadao;
