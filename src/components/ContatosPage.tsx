
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContatos, type Contato } from '@/hooks/useContatos';
import { ContatoCard } from '@/components/contatos/ContatoCard';
import { ContatoDetailsModal } from '@/components/contatos/ContatoDetailsModal';
import { Search, Plus, Upload, Users, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';

export const ContatosPage = () => {
  const { contatos, loading, createContato, updateContato, deleteContato } = useContatos();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [editingContato, setEditingContato] = useState<Contato | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    zona: '',
    data_nascimento: '',
    observacoes: ''
  });

  const [filterTag, setFilterTag] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredContatos = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.telefone?.includes(searchTerm) ||
    contato.zona?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas
  const totalContatos = contatos.length;
  const leadsAtivos = contatos.filter(c => c.telefone && c.email).length;
  const lideres = contatos.filter(c => c.zona).length;
  const scoreMediaPonderado = Math.round(
    contatos.reduce((acc, contato) => {
      let score = 0;
      if (contato.email) score += 30;
      if (contato.telefone) score += 25;
      if (contato.endereco) score += 15;
      if (contato.tags && contato.tags.length > 0) score += 20;
      if (contato.observacoes) score += 10;
      return acc + Math.min(score, 100);
    }, 0) / (contatos.length || 1)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      if (editingContato) {
        await updateContato(editingContato.id, formData);
        toast.success('Contato atualizado com sucesso!');
      } else {
        await createContato(formData);
        toast.success('Contato criado com sucesso!');
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar contato');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      zona: '',
      data_nascimento: '',
      observacoes: ''
    });
    setEditingContato(null);
  };

  const handleView = (contato: Contato) => {
    setSelectedContato(contato);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (contato: Contato) => {
    setFormData({
      nome: contato.nome,
      email: contato.email || '',
      telefone: contato.telefone || '',
      endereco: contato.endereco || '',
      zona: contato.zona || '',
      data_nascimento: contato.data_nascimento || '',
      observacoes: contato.observacoes || ''
    });
    setEditingContato(contato);
    setIsDialogOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await deleteContato(id);
        toast.success('Contato excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir contato');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Contatos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todos seus contatos com ranking de engajamento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContato ? 'Editar Contato' : 'Novo Contato'}
                </DialogTitle>
                <DialogDescription>
                  {editingContato ? 'Atualize as informações do contato' : 'Adicione um novo contato à sua base'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="zona">Zona Eleitoral</Label>
                  <Input
                    id="zona"
                    value={formData.zona}
                    onChange={(e) => setFormData({...formData, zona: e.target.value})}
                    placeholder="Zona eleitoral"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    placeholder="Endereço completo"
                  />
                </div>
                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    placeholder="Observações adicionais"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingContato ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalContatos}</p>
                <p className="text-sm text-gray-600">Total Contatos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{leadsAtivos}</p>
                <p className="text-sm text-gray-600">Leads Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{lideres}</p>
                <p className="text-sm text-gray-600">Líderes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Star className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600">{scoreMediaPonderado}</p>
                <p className="text-sm text-gray-600">Score Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todas as tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as tags</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Contatos</CardTitle>
          <CardDescription>
            Mostrando {filteredContatos.length} de {totalContatos} contatos (Página 1 de {Math.ceil(filteredContatos.length / 10)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredContatos.map((contato) => (
              <ContatoCard
                key={contato.id}
                contato={contato}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredContatos.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum contato encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro contato'}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Contato
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <ContatoDetailsModal
        contato={selectedContato}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedContato(null);
        }}
      />
    </div>
  );
};
