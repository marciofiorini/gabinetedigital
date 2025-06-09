
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useContatos, type Contato } from '@/hooks/useContatos';
import { Search, Plus, Phone, Mail, MapPin, Calendar, Filter, Users } from 'lucide-react';
import { toast } from 'sonner';

export const ContatosPage = () => {
  const { contatos, loading, createContato, updateContato, deleteContato } = useContatos();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const filteredContatos = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.telefone?.includes(searchTerm) ||
    contato.zona?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Gerencie sua base de contatos políticos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto">
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

      {/* Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total:</span>
              <Badge variant="secondary">{filteredContatos.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredContatos.map((contato) => (
          <Card key={contato.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-1">{contato.nome}</CardTitle>
              {contato.zona && (
                <Badge variant="outline" className="w-fit">
                  Zona {contato.zona}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {contato.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{contato.email}</span>
                </div>
              )}
              {contato.telefone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-3 h-3" />
                  <span>{contato.telefone}</span>
                </div>
              )}
              {contato.endereco && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{contato.endereco}</span>
                </div>
              )}
              {contato.data_nascimento && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(contato.data_nascimento).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(contato)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(contato.id)}
                  className="flex-1"
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContatos.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};
