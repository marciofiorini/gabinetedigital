
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLeads, type Lead, type LeadStatus } from '@/hooks/useLeads';
import { Search, Plus, Phone, Mail, TrendingUp, Filter, Target } from 'lucide-react';
import { toast } from 'sonner';

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { value: 'contatado', label: 'Contatado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'interesse', label: 'Interesse', color: 'bg-orange-100 text-orange-800' },
  { value: 'proposta', label: 'Proposta', color: 'bg-purple-100 text-purple-800' },
  { value: 'fechado', label: 'Fechado', color: 'bg-green-100 text-green-800' },
  { value: 'perdido', label: 'Perdido', color: 'bg-red-100 text-red-800' }
];

export const LeadsPage = () => {
  const { leads, loading, createLead, updateLead, deleteLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo' as LeadStatus,
    fonte: '',
    interesse: '',
    observacoes: ''
  });

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.telefone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      if (editingLead) {
        await updateLead(editingLead.id, formData);
        toast.success('Lead atualizado com sucesso!');
      } else {
        await createLead(formData);
        toast.success('Lead criado com sucesso!');
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar lead');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      status: 'novo',
      fonte: '',
      interesse: '',
      observacoes: ''
    });
    setEditingLead(null);
  };

  const handleEdit = (lead: Lead) => {
    setFormData({
      nome: lead.nome,
      email: lead.email || '',
      telefone: lead.telefone || '',
      status: lead.status,
      fonte: lead.fonte || '',
      interesse: lead.interesse || '',
      observacoes: lead.observacoes || ''
    });
    setEditingLead(lead);
    setIsDialogOpen(true);
  };

  const getStatusInfo = (status: LeadStatus) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
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
            Leads
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus prospects e oportunidades
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </DialogTitle>
              <DialogDescription>
                {editingLead ? 'Atualize as informações do lead' : 'Adicione um novo lead ao seu funil'}
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: LeadStatus) => setFormData({...formData, status: value})}>
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
              <div>
                <Label htmlFor="fonte">Fonte</Label>
                <Input
                  id="fonte"
                  value={formData.fonte}
                  onChange={(e) => setFormData({...formData, fonte: e.target.value})}
                  placeholder="Instagram, WhatsApp, Indicação..."
                />
              </div>
              <div>
                <Label htmlFor="interesse">Interesse</Label>
                <Input
                  id="interesse"
                  value={formData.interesse}
                  onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                  placeholder="Área de interesse do lead"
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Anotações sobre o lead"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingLead ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total:</span>
              <Badge variant="secondary">{filteredLeads.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLeads.map((lead) => {
          const statusInfo = getStatusInfo(lead.status);
          return (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{lead.nome}</CardTitle>
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
                {lead.fonte && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fonte: {lead.fonte}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                {lead.telefone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-3 h-3" />
                    <span>{lead.telefone}</span>
                  </div>
                )}
                {lead.interesse && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    <span className="truncate">{lead.interesse}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(lead)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteLead(lead.id)}
                    className="flex-1"
                  >
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLeads.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum lead encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro lead'}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
