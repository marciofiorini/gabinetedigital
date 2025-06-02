
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useContatos, type Contato } from "@/hooks/useContatos";
import { useToast } from "@/hooks/use-toast";

const Contatos = () => {
  const { contatos, loading, createContato, updateContato, deleteContato } = useContatos();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContato, setEditingContato] = useState<Contato | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    zona: "",
    data_nascimento: "",
    observacoes: ""
  });

  const filteredContatos = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.telefone?.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingContato) {
        await updateContato(editingContato.id, formData);
        toast({
          title: "Sucesso",
          description: "Contato atualizado com sucesso!"
        });
      } else {
        await createContato(formData);
        toast({
          title: "Sucesso",
          description: "Contato criado com sucesso!"
        });
      }
      
      setIsDialogOpen(false);
      setEditingContato(null);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        zona: "",
        data_nascimento: "",
        observacoes: ""
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar contato",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (contato: Contato) => {
    setEditingContato(contato);
    setFormData({
      nome: contato.nome,
      email: contato.email || "",
      telefone: contato.telefone || "",
      endereco: contato.endereco || "",
      zona: contato.zona || "",
      data_nascimento: contato.data_nascimento || "",
      observacoes: contato.observacoes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este contato?")) {
      const success = await deleteContato(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Contato deletado com sucesso!"
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contatos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie sua base de contatos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingContato(null);
              setFormData({
                nome: "",
                email: "",
                telefone: "",
                endereco: "",
                zona: "",
                data_nascimento: "",
                observacoes: ""
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingContato ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
              <DialogDescription>
                {editingContato ? 'Edite as informações do contato' : 'Adicione um novo contato à sua base'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zona">Zona</Label>
                <Input
                  id="zona"
                  value={formData.zona}
                  onChange={(e) => setFormData(prev => ({ ...prev, zona: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingContato ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            <Input
              placeholder="Buscar contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{contatos.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Contatos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {contatos.filter(c => c.data_nascimento && 
                new Date(c.data_nascimento).getMonth() === new Date().getMonth()
              ).length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Aniversariantes este Mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {contatos.filter(c => c.email).length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Com Email</p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContatos.map((contato) => (
          <Card key={contato.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{contato.nome}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contato)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contato.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {contato.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{contato.email}</span>
                </div>
              )}
              {contato.telefone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{contato.telefone}</span>
                </div>
              )}
              {contato.endereco && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{contato.endereco}</span>
                </div>
              )}
              {contato.data_nascimento && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(contato.data_nascimento)}</span>
                </div>
              )}
              {contato.zona && (
                <Badge variant="secondary" className="mt-2">
                  {contato.zona}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContatos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Nenhum contato encontrado com este termo de busca.' : 'Nenhum contato cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contatos;
