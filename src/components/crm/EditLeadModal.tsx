
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';
import { TagManager } from '@/components/TagManager';
import { User, Phone, Mail, Calendar, MapPin, Target, FileText, Clock } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  status: string;
  fonte?: string;
  interesse?: string;
  observacoes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditLeadModal = ({ lead, isOpen, onClose }: EditLeadModalProps) => {
  const { updateLead } = useLeads();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo' as const,
    fonte: '',
    interesse: '',
    observacoes: '',
    tags: [] as string[]
  });

  React.useEffect(() => {
    if (lead) {
      setFormData({
        nome: lead.nome || '',
        email: lead.email || '',
        telefone: lead.telefone || '',
        status: lead.status as any,
        fonte: lead.fonte || '',
        interesse: lead.interesse || '',
        observacoes: lead.observacoes || '',
        tags: lead.tags || []
      });
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    try {
      await updateLead(lead.id, formData);
      toast.success('Lead atualizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar lead');
    }
  };

  if (!lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'contatado': return 'bg-yellow-100 text-yellow-800';
      case 'interesse': return 'bg-orange-100 text-orange-800';
      case 'proposta': return 'bg-purple-100 text-purple-800';
      case 'fechado': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {lead.nome}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informações Básicas */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="novo">Novo</SelectItem>
                              <SelectItem value="contatado">Contatado</SelectItem>
                              <SelectItem value="interesse">Interesse</SelectItem>
                              <SelectItem value="proposta">Proposta</SelectItem>
                              <SelectItem value="fechado">Fechado</SelectItem>
                              <SelectItem value="perdido">Perdido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fonte">Fonte</Label>
                          <Input
                            id="fonte"
                            value={formData.fonte}
                            onChange={(e) => setFormData({...formData, fonte: e.target.value})}
                            placeholder="Ex: Facebook, Indicação, Site"
                          />
                        </div>
                        <div>
                          <Label htmlFor="interesse">Interesse</Label>
                          <Input
                            id="interesse"
                            value={formData.interesse}
                            onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                            placeholder="Ex: Saúde, Educação, Infraestrutura"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={formData.observacoes}
                          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Tags</Label>
                        <TagManager
                          selectedTags={formData.tags}
                          onTagsChange={(tags) => setFormData({...formData, tags})}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo e Ações Rápidas */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{lead.email || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{lead.telefone || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span>{lead.interesse || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Criado em {new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Follow-up
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Criar Proposta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Interações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Lead criado</p>
                      <p className="text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {lead.updated_at !== lead.created_at && (
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Clock className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Última atualização</p>
                        <p className="text-sm text-gray-600">
                          {new Date(lead.updated_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="atividades">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Nenhuma atividade agendada
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle>Documentos e Anexos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Nenhum documento anexado
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
