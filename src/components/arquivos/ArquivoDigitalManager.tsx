
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
import { FileText, Plus, Edit, Trash2, Download, Search, Filter } from 'lucide-react';
import { useArquivoDigital } from '@/hooks/useArquivoDigital';

export const ArquivoDigitalManager = () => {
  const { arquivos, loading, createArquivo, updateArquivo, deleteArquivo } = useArquivoDigital();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArquivo, setEditingArquivo] = useState<any>(null);

  const [novoArquivo, setNovoArquivo] = useState({
    titulo: '',
    descricao: '',
    tipo_documento: '',
    categoria: '',
    arquivo_url: '',
    arquivo_nome: '',
    arquivo_tamanho: 0,
    numero_protocolo: '',
    data_documento: '',
    origem: '',
    destino: '',
    status: 'ativo',
    tags: []
  });

  const resetForm = () => {
    setNovoArquivo({
      titulo: '',
      descricao: '',
      tipo_documento: '',
      categoria: '',
      arquivo_url: '',
      arquivo_nome: '',
      arquivo_tamanho: 0,
      numero_protocolo: '',
      data_documento: '',
      origem: '',
      destino: '',
      status: 'ativo',
      tags: []
    });
    setEditingArquivo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArquivo) {
        await updateArquivo(editingArquivo.id, novoArquivo);
      } else {
        await createArquivo(novoArquivo);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
    }
  };

  const handleEdit = (arquivo: any) => {
    setEditingArquivo(arquivo);
    setNovoArquivo(arquivo);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este arquivo?')) {
      await deleteArquivo(id);
    }
  };

  const filteredArquivos = arquivos.filter(arquivo => {
    const matchesSearch = arquivo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         arquivo.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || arquivo.status === statusFilter;
    const matchesTipo = !tipoFilter || arquivo.tipo_documento === tipoFilter;
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Carregando arquivos digitais...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Arquivo Digital
          </CardTitle>
          <CardDescription>
            Sistema de gestão documental para organização e controle de documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou descrição..."
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
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="oficio">Ofício</SelectItem>
                <SelectItem value="memorando">Memorando</SelectItem>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="lei">Lei</SelectItem>
                <SelectItem value="decreto">Decreto</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Arquivo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingArquivo ? 'Editar Arquivo' : 'Novo Arquivo Digital'}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha as informações do documento digital
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titulo">Título *</Label>
                      <Input
                        id="titulo"
                        value={novoArquivo.titulo}
                        onChange={(e) => setNovoArquivo({ ...novoArquivo, titulo: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                      <Select
                        value={novoArquivo.tipo_documento}
                        onValueChange={(value) => setNovoArquivo({ ...novoArquivo, tipo_documento: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oficio">Ofício</SelectItem>
                          <SelectItem value="memorando">Memorando</SelectItem>
                          <SelectItem value="contrato">Contrato</SelectItem>
                          <SelectItem value="lei">Lei</SelectItem>
                          <SelectItem value="decreto">Decreto</SelectItem>
                          <SelectItem value="portaria">Portaria</SelectItem>
                          <SelectItem value="ata">Ata</SelectItem>
                          <SelectItem value="relatorio">Relatório</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={novoArquivo.descricao}
                      onChange={(e) => setNovoArquivo({ ...novoArquivo, descricao: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        value={novoArquivo.categoria}
                        onChange={(e) => setNovoArquivo({ ...novoArquivo, categoria: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero_protocolo">Nº Protocolo</Label>
                      <Input
                        id="numero_protocolo"
                        value={novoArquivo.numero_protocolo}
                        onChange={(e) => setNovoArquivo({ ...novoArquivo, numero_protocolo: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="data_documento">Data do Documento</Label>
                      <Input
                        id="data_documento"
                        type="date"
                        value={novoArquivo.data_documento}
                        onChange={(e) => setNovoArquivo({ ...novoArquivo, data_documento: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origem">Origem</Label>
                      <Input
                        id="origem"
                        value={novoArquivo.origem}
                        onChange={(e) => setNovoArquivo({ ...novoArquivo, origem: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="destino">Destino</Label>
                      <Input
                        id="destino"
                        value={novoArquivo.destino}
                        onChange={(e) => setNovoArquivo({ ...novoArquivo, destino: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingArquivo ? 'Atualizar' : 'Criar'} Arquivo
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
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArquivos.map((arquivo) => (
                  <TableRow key={arquivo.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{arquivo.titulo}</div>
                        {arquivo.numero_protocolo && (
                          <div className="text-sm text-gray-500">
                            Protocolo: {arquivo.numero_protocolo}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {arquivo.tipo_documento}
                      </Badge>
                    </TableCell>
                    <TableCell>{arquivo.categoria}</TableCell>
                    <TableCell>
                      {arquivo.data_documento && new Date(arquivo.data_documento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(arquivo.status)}>
                        {arquivo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(arquivo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(arquivo.id)}
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

          {filteredArquivos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum arquivo encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
