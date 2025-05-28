
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Phone, Mail, Edit, Trash2, User, Building } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lead {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  status: string;
  fonte: string | null;
  interesse: string | null;
  observacoes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const statusOptions = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { value: 'contato', label: 'Em Contato', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'qualificado', label: 'Qualificado', color: 'bg-purple-100 text-purple-800' },
  { value: 'proposta', label: 'Proposta', color: 'bg-orange-100 text-orange-800' },
  { value: 'fechado', label: 'Fechado', color: 'bg-green-100 text-green-800' },
  { value: 'perdido', label: 'Perdido', color: 'bg-red-100 text-red-800' }
];

interface SortableLeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function SortableLeadCard({ lead, onEdit, onDelete }: SortableLeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg border shadow-sm cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold truncate">{lead.nome}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lead);
            }}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead);
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        {lead.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.telefone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>{lead.telefone}</span>
          </div>
        )}
        {lead.fonte && (
          <div className="flex items-center gap-2">
            <Building className="w-3 h-3" />
            <span className="truncate">{lead.fonte}</span>
          </div>
        )}
        {lead.interesse && (
          <p className="text-xs bg-gray-50 p-2 rounded mt-2 truncate">
            {lead.interesse}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CrmCompleto() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo',
    fonte: '',
    interesse: '',
    observacoes: ''
  });

  const fetchLeads = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os leads.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingLead) {
        const { error } = await supabase
          .from('leads')
          .update({
            nome: formData.nome,
            email: formData.email || null,
            telefone: formData.telefone || null,
            status: formData.status,
            fonte: formData.fonte || null,
            interesse: formData.interesse || null,
            observacoes: formData.observacoes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLead.id);

        if (error) throw error;

        toast({
          title: 'Lead atualizado',
          description: 'O lead foi atualizado com sucesso.'
        });
      } else {
        const { error } = await supabase
          .from('leads')
          .insert({
            nome: formData.nome,
            email: formData.email || null,
            telefone: formData.telefone || null,
            status: formData.status,
            fonte: formData.fonte || null,
            interesse: formData.interesse || null,
            observacoes: formData.observacoes || null,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: 'Lead criado',
          description: 'O lead foi criado com sucesso.'
        });
      }

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
      setIsDialogOpen(false);
      fetchLeads();
    } catch (error: any) {
      console.error('Erro ao salvar lead:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o lead.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);

      if (error) throw error;

      toast({
        title: 'Lead excluído',
        description: 'O lead foi excluído com sucesso.'
      });

      fetchLeads();
    } catch (error: any) {
      console.error('Erro ao excluir lead:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o lead.',
        variant: 'destructive'
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as string;

    // Atualizar localmente primeiro para feedback visual imediato
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, updated_at: new Date().toISOString() }
          : lead
      )
    );

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: 'Status atualizado',
        description: 'O status do lead foi atualizado com sucesso.'
      });
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive'
      });
      // Reverter mudança local em caso de erro
      fetchLeads();
    }
  };

  const openEditDialog = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      nome: lead.nome,
      email: lead.email || '',
      telefone: lead.telefone || '',
      status: lead.status,
      fonte: lead.fonte || '',
      interesse: lead.interesse || '',
      observacoes: lead.observacoes || ''
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingLead(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      status: 'novo',
      fonte: '',
      interesse: '',
      observacoes: ''
    });
    setIsDialogOpen(true);
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CRM - Funil de Vendas</h1>
          <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </DialogTitle>
              <DialogDescription>
                {editingLead ? 'Atualize as informações do lead.' : 'Adicione um novo lead ao seu funil.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do lead"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
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
                    onChange={(e) => setFormData({ ...formData, fonte: e.target.value })}
                    placeholder="Instagram, Site, Indicação..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interesse">Interesse</Label>
                <Input
                  id="interesse"
                  value={formData.interesse}
                  onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                  placeholder="Produto/serviço de interesse"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Notas e observações sobre o lead"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLead ? 'Atualizar' : 'Criar'} Lead
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statusOptions.map((status) => {
            const statusLeads = getLeadsByStatus(status.value);
            return (
              <Card key={status.value} className="min-h-96">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {status.label}
                    </CardTitle>
                    <Badge className={status.color}>
                      {statusLeads.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <SortableContext 
                    items={statusLeads.map(lead => lead.id)} 
                    strategy={verticalListSortingStrategy}
                    id={status.value}
                  >
                    <div className="space-y-3">
                      {statusLeads.map((lead) => (
                        <SortableLeadCard
                          key={lead.id}
                          lead={lead}
                          onEdit={openEditDialog}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DndContext>

      {leads.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando seu primeiro lead ao funil de vendas.</p>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar primeiro lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
