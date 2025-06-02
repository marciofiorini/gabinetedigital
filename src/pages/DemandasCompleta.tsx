
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Calendar, User, AlertTriangle } from "lucide-react";
import { useDemandas, type Demanda } from "@/hooks/useDemandas";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, demandaSchema } from "@/hooks/useFormValidation";
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from "@/components/ValidatedForm";
import { AdvancedFilters, type FilterOptions } from "@/components/AdvancedFilters";
import { useRealTimeData } from "@/hooks/useRealTimeData";

const DemandasCompleta = () => {
  const { demandas, loading, createDemanda, updateDemanda, deleteDemanda, refetch } = useDemandas();
  const { toast } = useToast();
  useRealTimeData('demandas', refetch);
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDemanda, setEditingDemanda] = useState<Demanda | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    prioridade: "media",
    status: "pendente",
    solicitante: "",
    zona: "",
    data_limite: ""
  });

  const { validate, errors, getFieldError, clearErrors } = useFormValidation(demandaSchema);

  const filteredDemandas = demandas.filter(demanda => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        demanda.titulo.toLowerCase().includes(searchLower) ||
        demanda.descricao?.toLowerCase().includes(searchLower) ||
        demanda.solicitante?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && demanda.status !== filters.status) {
      return false;
    }

    // Category filter
    if (filters.categoria && demanda.categoria !== filters.categoria) {
      return false;
    }

    // Priority filter
    if (filters.prioridade && demanda.prioridade !== filters.prioridade) {
      return false;
    }

    // Zone filter
    if (filters.zona && demanda.zona !== filters.zona) {
      return false;
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
      if (editingDemanda) {
        await updateDemanda(editingDemanda.id, formData);
        toast({
          title: "Sucesso",
          description: "Demanda atualizada com sucesso!"
        });
      } else {
        await createDemanda(formData);
        toast({
          title: "Sucesso",
          description: "Demanda criada com sucesso!"
        });
      }
      
      setIsDialogOpen(false);
      setEditingDemanda(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar demanda",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "",
      prioridade: "media",
      status: "pendente",
      solicitante: "",
      zona: "",
      data_limite: ""
    });
    clearErrors();
  };

  const handleEdit = (demanda: Demanda) => {
    setEditingDemanda(demanda);
    setFormData({
      titulo: demanda.titulo,
      descricao: demanda.descricao || "",
      categoria: demanda.categoria || "",
      prioridade: demanda.prioridade || "media",
      status: demanda.status || "pendente",
      solicitante: demanda.solicitante || "",
      zona: demanda.zona || "",
      data_limite: demanda.data_limite || ""
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta demanda?")) {
      const success = await deleteDemanda(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Demanda deletada com sucesso!"
        });
      }
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "baixa": return "bg-gray-100 text-gray-800";
      case "media": return "bg-blue-100 text-blue-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "urgente": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em_andamento": return "bg-blue-100 text-blue-800";
      case "concluida": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

  const demandasPendentes = demandas.filter(d => d.status === 'pendente');
  const demandasUrgentes = demandas.filter(d => d.prioridade === 'urgente');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Demandas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie as demandas dos cidadãos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingDemanda(null);
              resetForm();
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Demanda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDemanda ? 'Editar Demanda' : 'Nova Demanda'}</DialogTitle>
              <DialogDescription>
                {editingDemanda ? 'Edite as informações da demanda' : 'Adicione uma nova demanda'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ValidatedInput
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={(value) => setFormData(prev => ({ ...prev, titulo: value }))}
                error={getFieldError('titulo')}
                required
              />
              
              <ValidatedTextarea
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={(value) => setFormData(prev => ({ ...prev, descricao: value }))}
                error={getFieldError('descricao')}
              />
              
              <ValidatedSelect
                label="Categoria"
                name="categoria"
                value={formData.categoria}
                onChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                error={getFieldError('categoria')}
                options={[
                  { value: "saude", label: "Saúde" },
                  { value: "educacao", label: "Educação" },
                  { value: "infraestrutura", label: "Infraestrutura" },
                  { value: "seguranca", label: "Segurança" },
                  { value: "meio_ambiente", label: "Meio Ambiente" },
                  { value: "social", label: "Social" },
                  { value: "economia", label: "Economia" },
                  { value: "outros", label: "Outros" }
                ]}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <ValidatedSelect
                  label="Prioridade"
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}
                  error={getFieldError('prioridade')}
                  options={[
                    { value: "baixa", label: "Baixa" },
                    { value: "media", label: "Média" },
                    { value: "alta", label: "Alta" },
                    { value: "urgente", label: "Urgente" }
                  ]}
                  required
                />
                
                <ValidatedSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  error={getFieldError('status')}
                  options={[
                    { value: "pendente", label: "Pendente" },
                    { value: "em_andamento", label: "Em Andamento" },
                    { value: "concluida", label: "Concluída" },
                    { value: "cancelada", label: "Cancelada" }
                  ]}
                  required
                />
              </div>
              
              <ValidatedInput
                label="Solicitante"
                name="solicitante"
                value={formData.solicitante}
                onChange={(value) => setFormData(prev => ({ ...prev, solicitante: value }))}
                error={getFieldError('solicitante')}
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
                label="Data Limite"
                name="data_limite"
                type="date"
                value={formData.data_limite}
                onChange={(value) => setFormData(prev => ({ ...prev, data_limite: value }))}
                error={getFieldError('data_limite')}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingDemanda ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        type="demandas"
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{demandasPendentes.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{demandasUrgentes.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{filteredDemandas.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Filtradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demandas List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDemandas.map((demanda) => (
          <Card key={demanda.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{demanda.titulo}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getPrioridadeColor(demanda.prioridade || 'media')}>
                      {demanda.prioridade}
                    </Badge>
                    <Badge className={getStatusColor(demanda.status || 'pendente')}>
                      {demanda.status}
                    </Badge>
                    {demanda.categoria && (
                      <Badge variant="outline">{demanda.categoria}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(demanda)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(demanda.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {demanda.descricao && (
                <p className="text-gray-600 dark:text-gray-400">{demanda.descricao}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                {demanda.solicitante && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{demanda.solicitante}</span>
                  </div>
                )}
                {demanda.zona && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Zona:</span>
                    <span>{demanda.zona}</span>
                  </div>
                )}
                {demanda.data_limite && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(demanda.data_limite).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDemandas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {Object.keys(filters).length > 0 ? 'Nenhuma demanda encontrada com os filtros aplicados.' : 'Nenhuma demanda cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemandasCompleta;
