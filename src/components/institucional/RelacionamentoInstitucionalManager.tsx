
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
import { Building, Plus, Edit, Trash2, Search, Calendar, Globe } from 'lucide-react';
import { useRelacionamentoInstitucional } from '@/hooks/useRelacionamentoInstitucional';

export const RelacionamentoInstitucionalManager = () => {
  const { relacionamentos, loading, createRelacionamento, updateRelacionamento, deleteRelacionamento } = useRelacionamentoInstitucional();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRelacionamento, setEditingRelacionamento] = useState<any>(null);

  const [novoRelacionamento, setNovoRelacionamento] = useState({
    nome_instituicao: '',
    tipo_instituicao: '',
    responsavel_nome: '',
    responsavel_cargo: '',
    email: '',
    telefone: '',
    endereco: '',
    website: '',
    nivel_relacionamento: 'inicial',
    area_atuacao: '',
    observacoes: '',
    ultima_interacao: '',
    proximo_contato: '',
    status: 'ativo'
  });

  const resetForm = () => {
    setNovoRelacionamento({
      nome_instituicao: '',
      tipo_instituicao: '',
      responsavel_nome: '',
      responsavel_cargo: '',
      email: '',
      telefone: '',
      endereco: '',
      website: '',
      nivel_relacionamento: 'inicial',
      area_atuacao: '',
      observacoes: '',
      ultima_interacao: '',
      proximo_contato: '',
      status: 'ativo'
    });
    setEditingRelacionamento(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRelacionamento) {
        await updateRelacionamento(editingRelacionamento.id, novoRelacionamento);
      } else {
        await createRelacionamento(novoRelacionamento);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar relacionamento:', error);
    }
  };

  const handleEdit = (relacionamento: any) => {
    setEditingRelacionamento(relacionamento);
    setNovoRelacionamento(relacionamento);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relacionamento?')) {
      await deleteRelacionamento(id);
    }
  };

  const filteredRelacionamentos = relacionamentos.filter(rel => {
    const matchesSearch = rel.nome_instituicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rel.responsavel_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFilter || rel.tipo_instituicao === tipoFilter;
    const matchesNivel = !nivelFilter || rel.nivel_relacionamento === nivelFilter;
    
    return matchesSearch && matchesTipo && matchesNivel;
  });

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'estrategico': return 'bg-green-100 text-green-800';
      case 'colaborativo': return 'bg-blue-100 text-blue-800';
      case 'operacional': return 'bg-yellow-100 text-yellow-800';
      case 'inicial': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Carregando relacionamentos institucionais...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Relacionamento Institucional
          </CardTitle>
          <CardDescription>
            Mapeamento e gestão de contatos institucionais para fortalecimento de parcerias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por instituição ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="prefeitura">Prefeitura</SelectItem>
                <SelectItem value="camara">Câmara Municipal</SelectItem>
                <SelectItem value="assembleia">Assembleia Legislativa</SelectItem>
                <SelectItem value="governo_estadual">Governo Estadual</SelectItem>
                <SelectItem value="governo_federal">Governo Federal</SelectItem>
                <SelectItem value="ong">ONG</SelectItem>
                <SelectItem value="empresa_privada">Empresa Privada</SelectItem>
                <SelectItem value="sindicato">Sindicato</SelectItem>
                <SelectItem value="universidade">Universidade</SelectItem>
              </SelectContent>
            </Select>
            <Select value={nivelFilter} onValueChange={setNivelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="estrategico">Estratégico</SelectItem>
                <SelectItem value="colaborativo">Colaborativo</SelectItem>
                <SelectItem value="operacional">Operacional</SelectItem>
                <SelectItem value="inicial">Inicial</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Instituição
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingRelacionamento ? 'Editar Relacionamento' : 'Nova Instituição'}
                  </DialogTitle>
                  <DialogDescription>
                    Cadastre ou edite informações do relacionamento institucional
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome_instituicao">Nome da Instituição *</Label>
                      <Input
                        id="nome_instituicao"
                        value={novoRelacionamento.nome_instituicao}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, nome_instituicao: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo_instituicao">Tipo de Instituição *</Label>
                      <Select
                        value={novoRelacionamento.tipo_instituicao}
                        onValueChange={(value) => setNovoRelacionamento({ ...novoRelacionamento, tipo_instituicao: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prefeitura">Prefeitura</SelectItem>
                          <SelectItem value="camara">Câmara Municipal</SelectItem>
                          <SelectItem value="assembleia">Assembleia Legislativa</SelectItem>
                          <SelectItem value="governo_estadual">Governo Estadual</SelectItem>
                          <SelectItem value="governo_federal">Governo Federal</SelectItem>
                          <SelectItem value="ong">ONG</SelectItem>
                          <SelectItem value="empresa_privada">Empresa Privada</SelectItem>
                          <SelectItem value="sindicato">Sindicato</SelectItem>
                          <SelectItem value="universidade">Universidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="responsavel_nome">Nome do Responsável</Label>
                      <Input
                        id="responsavel_nome"
                        value={novoRelacionamento.responsavel_nome}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, responsavel_nome: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="responsavel_cargo">Cargo do Responsável</Label>
                      <Input
                        id="responsavel_cargo"
                        value={novoRelacionamento.responsavel_cargo}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, responsavel_cargo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={novoRelacionamento.email}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={novoRelacionamento.telefone}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, telefone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={novoRelacionamento.endereco}
                      onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, endereco: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={novoRelacionamento.website}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, website: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nivel_relacionamento">Nível de Relacionamento</Label>
                      <Select
                        value={novoRelacionamento.nivel_relacionamento}
                        onValueChange={(value) => setNovoRelacionamento({ ...novoRelacionamento, nivel_relacionamento: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inicial">Inicial</SelectItem>
                          <SelectItem value="operacional">Operacional</SelectItem>
                          <SelectItem value="colaborativo">Colaborativo</SelectItem>
                          <SelectItem value="estrategico">Estratégico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="area_atuacao">Área de Atuação</Label>
                    <Input
                      id="area_atuacao"
                      value={novoRelacionamento.area_atuacao}
                      onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, area_atuacao: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ultima_interacao">Última Interação</Label>
                      <Input
                        id="ultima_interacao"
                        type="date"
                        value={novoRelacionamento.ultima_interacao}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, ultima_interacao: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proximo_contato">Próximo Contato</Label>
                      <Input
                        id="proximo_contato"
                        type="date"
                        value={novoRelacionamento.proximo_contato}
                        onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, proximo_contato: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novoRelacionamento.observacoes}
                      onChange={(e) => setNovoRelacionamento({ ...novoRelacionamento, observacoes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingRelacionamento ? 'Atualizar' : 'Criar'} Relacionamento
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
                  <TableHead>Instituição</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Próximo Contato</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRelacionamentos.map((rel) => (
                  <TableRow key={rel.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rel.nome_instituicao}</div>
                        <div className="text-sm text-gray-500">{rel.tipo_instituicao}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rel.responsavel_nome}</div>
                        <div className="text-sm text-gray-500">{rel.responsavel_cargo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {rel.email && <div>{rel.email}</div>}
                        {rel.telefone && <div>{rel.telefone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getNivelColor(rel.nivel_relacionamento)}>
                        {rel.nivel_relacionamento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rel.proximo_contato && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(rel.proximo_contato).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(rel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rel.id)}
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

          {filteredRelacionamentos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum relacionamento institucional encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
