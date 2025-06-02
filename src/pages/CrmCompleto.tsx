
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Phone, Mail, TrendingUp, Users, Target, CheckCircle } from "lucide-react";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, leadSchema } from "@/hooks/useFormValidation";
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from "@/components/ValidatedForm";
import { AdvancedFilters, type FilterOptions } from "@/components/AdvancedFilters";
import { useRealTimeData } from "@/hooks/useRealTimeData";

const CrmCompleto = () => {
  const { leads, loading, createLead, updateLead, deleteLead, refetch } = useLeads();
  const { toast } = useToast();
  useRealTimeData('leads', refetch);
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    status: "novo",
    fonte: "",
    interesse: "",
    observacoes: ""
  });

  const { validate, errors, getFieldError, clearErrors } = useFormValidation(leadSchema);

  const statusOptions = [
    { value: "novo", label: "Novo", color: "bg-blue-100 text-blue-800" },
    { value: "contatado", label: "Contatado", color: "bg-yellow-100 text-yellow-800" },
    { value: "interesse", label: "Interesse", color: "bg-orange-100 text-orange-800" },
    { value: "proposta", label: "Proposta", color: "bg-purple-100 text-purple-800" },
    { value: "fechado", label: "Fechado", color: "bg-green-100 text-green-800" },
    { value: "perdido", label: "Perdido", color: "bg-red-100 text-red-800" }
  ];

  const filteredLeads = leads.filter(lead => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        lead.nome.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.fonte?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && lead.status !== filters.status) {
      return false;
    }

    // Source filter
    if (filters.fonte && lead.fonte !== filters.fonte) {
      return false;
    }

    // Date filters
    if (filters.dataInicio && lead.created_at) {
      const leadDate = new Date(lead.created_at);
      if (leadDate < filters.dataInicio) return false;
    }

    if (filters.dataFim && lead.created_at) {
      const leadDate = new Date(lead.created_at);
      if (leadDate > filters.dataFim) return false;
    }

    return true;
  });

  const getStatusConfig = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

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
      if (editingLead) {
        await updateLead(editingLead.id, formData);
        toast({
          title: "Sucesso",
          description: "Lead atualizado com sucesso!"
        });
      } else {
        await createLead(formData);
        toast({
          title: "Sucesso",
          description: "Lead criado com sucesso!"
        });
      }
      
      setIsDialogOpen(false);
      setEditingLead(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar lead",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      status: "novo",
      fonte: "",
      interesse: "",
      observacoes: ""
    });
    clearErrors();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      nome: lead.nome,
      email: lead.email || "",
      telefone: lead.telefone || "",
      status: lead.status,
      fonte: lead.fonte || "",
      interesse: lead.interesse || "",
      observacoes: lead.observacoes || ""
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este lead?")) {
      const success = await deleteLead(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Lead deletado com sucesso!"
        });
      }
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CRM - Gestão de Leads</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seu pipeline de vendas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingLead(null);
              resetForm();
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
              <DialogDescription>
                {editingLead ? 'Edite as informações do lead' : 'Adicione um novo lead ao pipeline'}
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
              
              <ValidatedSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                error={getFieldError('status')}
                options={statusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                required
              />
              
              <ValidatedSelect
                label="Fonte"
                name="fonte"
                value={formData.fonte}
                onChange={(value) => setFormData(prev => ({ ...prev, fonte: value }))}
                error={getFieldError('fonte')}
                options={[
                  { value: "site", label: "Site" },
                  { value: "redes_sociais", label: "Redes Sociais" },
                  { value: "indicacao", label: "Indicação" },
                  { value: "evento", label: "Evento" },
                  { value: "campanha", label: "Campanha" },
                  { value: "outros", label: "Outros" }
                ]}
              />
              
              <ValidatedInput
                label="Interesse"
                name="interesse"
                value={formData.interesse}
                onChange={(value) => setFormData(prev => ({ ...prev, interesse: value }))}
                error={getFieldError('interesse')}
                placeholder="Ex: Saúde, Educação, Infraestrutura"
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
                  {editingLead ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        type="leads"
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{getLeadsByStatus("novo").length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Novos Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{getLeadsByStatus("contatado").length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contatados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{getLeadsByStatus("proposta").length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Propostas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{getLeadsByStatus("fechado").length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fechados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => {
          const statusConfig = getStatusConfig(lead.status);
          return (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{lead.nome}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(lead)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.telefone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{lead.telefone}</span>
                  </div>
                )}
                {lead.fonte && (
                  <div className="text-sm">
                    <span className="font-medium">Fonte:</span> {lead.fonte}
                  </div>
                )}
                {lead.interesse && (
                  <div className="text-sm">
                    <span className="font-medium">Interesse:</span> {lead.interesse}
                  </div>
                )}
                {lead.observacoes && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {lead.observacoes}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {Object.keys(filters).length > 0 
                ? 'Nenhum lead encontrado com os filtros aplicados.' 
                : 'Nenhum lead cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrmCompleto;
