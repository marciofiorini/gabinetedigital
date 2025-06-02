
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Phone, Mail, TrendingUp, Users, Target, CheckCircle } from "lucide-react";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

const CrmCompleto = () => {
  const { leads, loading, createLead, updateLead, deleteLead } = useLeads();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
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

  const statusOptions = [
    { value: "novo", label: "Novo", color: "bg-blue-100 text-blue-800" },
    { value: "qualificado", label: "Qualificado", color: "bg-yellow-100 text-yellow-800" },
    { value: "proposta", label: "Proposta Enviada", color: "bg-orange-100 text-orange-800" },
    { value: "fechado", label: "Fechado", color: "bg-green-100 text-green-800" },
    { value: "perdido", label: "Perdido", color: "bg-red-100 text-red-800" }
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

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
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        status: "novo",
        fonte: "",
        interesse: "",
        observacoes: ""
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar lead",
        variant: "destructive"
      });
    }
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
              setFormData({
                nome: "",
                email: "",
                telefone: "",
                status: "novo",
                fonte: "",
                interesse: "",
                observacoes: ""
              });
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fonte">Fonte</Label>
                <Input
                  id="fonte"
                  value={formData.fonte}
                  onChange={(e) => setFormData(prev => ({ ...prev, fonte: e.target.value }))}
                  placeholder="Ex: Site, Indicação, Evento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interesse">Interesse</Label>
                <Input
                  id="interesse"
                  value={formData.interesse}
                  onChange={(e) => setFormData(prev => ({ ...prev, interesse: e.target.value }))}
                  placeholder="Ex: Saúde, Educação, Infraestrutura"
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
                  {editingLead ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <div className="text-2xl font-bold">{getLeadsByStatus("qualificado").length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Qualificados</p>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

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
              {searchTerm || statusFilter !== "todos" 
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
