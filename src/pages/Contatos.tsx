
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useContatos, type Contato } from "@/hooks/useContatos";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, contatoSchema } from "@/hooks/useFormValidation";
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from "@/components/ValidatedForm";
import { AdvancedFilters, type FilterOptions } from "@/components/AdvancedFilters";
import { useRealTimeData } from "@/hooks/useRealTimeData";

const Contatos = () => {
  const { contatos, loading, createContato, updateContato, deleteContato, refetch } = useContatos();
  const { toast } = useToast();
  useRealTimeData('contatos', refetch);
  
  const [filters, setFilters] = useState<FilterOptions>({});
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

  const { validate, errors, getFieldError, clearErrors } = useFormValidation(contatoSchema);

  const filteredContatos = contatos.filter(contato => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        contato.nome.toLowerCase().includes(searchLower) ||
        contato.email?.toLowerCase().includes(searchLower) ||
        contato.telefone?.includes(filters.search);
      if (!matchesSearch) return false;
    }

    // Zone filter
    if (filters.zona && contato.zona !== filters.zona) {
      return false;
    }

    // Date filters
    if (filters.dataInicio && contato.created_at) {
      const contatoDate = new Date(contato.created_at);
      if (contatoDate < filters.dataInicio) return false;
    }

    if (filters.dataFim && contato.created_at) {
      const contatoDate = new Date(contato.created_at);
      if (contatoDate > filters.dataFim) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!contato.tags || !filters.tags.some(tag => contato.tags?.includes(tag))) {
        return false;
      }
    }

    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate(formData)) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário",
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
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar contato",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      zona: "",
      data_nascimento: "",
      observacoes: ""
    });
    clearErrors();
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
    clearErrors();
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

  const clearFilters = () => {
    setFilters({});
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
              resetForm();
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
              <ValidatedInput
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={(value) => setFormData(prev => ({ ...prev, nome: value }))}
                error={getFieldError('nome')}
                required
              />
              
              <ValidatedInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                error={getFieldError('email')}
              />
              
              <ValidatedInput
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={(value) => setFormData(prev => ({ ...prev, telefone: value }))}
                error={getFieldError('telefone')}
              />
              
              <ValidatedInput
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={(value) => setFormData(prev => ({ ...prev, endereco: value }))}
                error={getFieldError('endereco')}
              />
              
              <ValidatedSelect
                label="Zona"
                name="zona"
                value={formData.zona}
                onChange={(value) => setFormData(prev => ({ ...prev, zona: value }))}
                error={getFieldError('zona')}
                options={[
                  { value: "norte", label: "Norte" },
                  { value: "sul", label: "Sul" },
                  { value: "leste", label: "Leste" },
                  { value: "oeste", label: "Oeste" },
                  { value: "centro", label: "Centro" }
                ]}
              />
              
              <ValidatedInput
                label="Data de Nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(value) => setFormData(prev => ({ ...prev, data_nascimento: value }))}
                error={getFieldError('data_nascimento')}
              />
              
              <ValidatedTextarea
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={(value) => setFormData(prev => ({ ...prev, observacoes: value }))}
                error={getFieldError('observacoes')}
              />
              
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

      {/* Advanced Filters */}
      <AdvancedFilters
        type="contatos"
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{filteredContatos.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Contatos Filtrados</p>
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
              {Object.keys(filters).length > 0 ? 'Nenhum contato encontrado com os filtros aplicados.' : 'Nenhum contato cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contatos;
