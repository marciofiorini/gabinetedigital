import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageTemplates } from "@/components/MessageTemplates";
import { TemplateCustomizer } from "@/components/TemplateCustomizer";
import { Calendar as CalendarIcon, Plus, Phone, MessageCircle, Gift, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FollowUp {
  id: string;
  tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
  data_agendada: Date;
  descricao: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  observacoes?: string;
  assunto?: string;
  conteudo_mensagem?: string;
}

interface MessageTemplate {
  id: string;
  nome: string;
  tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
  assunto: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

interface FollowUpSectionProps {
  followUps: FollowUp[];
  onAddFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  onUpdateFollowUp: (id: string, followUp: Partial<FollowUp>) => void;
  leadData?: {
    nome?: string;
    email?: string;
    telefone?: string;
    zona?: string;
  };
}

export const FollowUpSection = ({ followUps, onAddFollowUp, onUpdateFollowUp, leadData }: FollowUpSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isTemplateCustomizerOpen, setIsTemplateCustomizerOpen] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState<{
    tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
    data_agendada: Date;
    descricao: string;
    status: 'pendente' | 'concluido' | 'cancelado';
    observacoes: string;
    assunto: string;
    conteudo_mensagem: string;
  }>({
    tipo: 'ligacao',
    data_agendada: new Date(),
    descricao: '',
    status: 'pendente',
    observacoes: '',
    assunto: '',
    conteudo_mensagem: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFollowUp(newFollowUp);
    setNewFollowUp({
      tipo: 'ligacao',
      data_agendada: new Date(),
      descricao: '',
      status: 'pendente',
      observacoes: '',
      assunto: '',
      conteudo_mensagem: ''
    });
    setIsAdding(false);
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateCustomizerOpen(true);
  };

  const handleSaveCustomizedMessage = (customizedMessage: {
    assunto: string;
    conteudo: string;
    variaveis: Record<string, string>;
  }) => {
    setNewFollowUp(prev => ({
      ...prev,
      tipo: selectedTemplate?.tipo || 'mensagem',
      descricao: customizedMessage.assunto,
      assunto: customizedMessage.assunto,
      conteudo_mensagem: customizedMessage.conteudo
    }));
    setSelectedTemplate(null);
    setIsTemplateCustomizerOpen(false);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return <Phone className="w-4 h-4" />;
      case 'mensagem': return <MessageCircle className="w-4 h-4" />;
      case 'aniversario': return <Gift className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return 'bg-blue-100 text-blue-800';
      case 'mensagem': return 'bg-green-100 text-green-800';
      case 'reuniao': return 'bg-purple-100 text-purple-800';
      case 'aniversario': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Follow Up
              </CardTitle>
              <CardDescription>
                Acompanhamento e agendamento de contatos
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsAdding(true)} 
              size="sm"
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Follow Up
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Follow Ups */}
          <div className="space-y-3">
            {followUps.map((followUp) => (
              <div key={followUp.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getTipoColor(followUp.tipo)}`}>
                    {getTipoIcon(followUp.tipo)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{followUp.descricao}</p>
                    <p className="text-sm text-gray-600">
                      {format(followUp.data_agendada, "dd/MM/yyyy")} às {format(followUp.data_agendada, "HH:mm")}
                    </p>
                    {followUp.conteudo_mensagem && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {followUp.conteudo_mensagem}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTipoColor(followUp.tipo)}>
                    {followUp.tipo}
                  </Badge>
                  <Badge className={getStatusColor(followUp.status)}>
                    {followUp.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Formulário de Novo Follow Up */}
          {isAdding && (
            <Card className="border-2 border-dashed border-indigo-300">
              <CardContent className="p-4">
                <Tabs defaultValue="manual" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="template">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Usar Template
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tipo">Tipo de Follow Up</Label>
                          <Select value={newFollowUp.tipo} onValueChange={(value: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario') => setNewFollowUp({...newFollowUp, tipo: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ligacao">Ligação</SelectItem>
                              <SelectItem value="mensagem">Mensagem</SelectItem>
                              <SelectItem value="reuniao">Reunião</SelectItem>
                              <SelectItem value="aniversario">Aniversário</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Data e Hora</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newFollowUp.data_agendada && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(newFollowUp.data_agendada, "dd/MM/yyyy HH:mm")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newFollowUp.data_agendada}
                                onSelect={(date) => date && setNewFollowUp({...newFollowUp, data_agendada: date})}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input
                          id="descricao"
                          value={newFollowUp.descricao}
                          onChange={(e) => setNewFollowUp({...newFollowUp, descricao: e.target.value})}
                          placeholder="Ex: Ligar para confirmar reunião"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={newFollowUp.observacoes}
                          onChange={(e) => setNewFollowUp({...newFollowUp, observacoes: e.target.value})}
                          placeholder="Observações adicionais..."
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          Salvar Follow Up
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="template">
                    <MessageTemplates onSelectTemplate={handleSelectTemplate} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Template Customizer Modal */}
      <TemplateCustomizer
        template={selectedTemplate}
        isOpen={isTemplateCustomizerOpen}
        onClose={() => {
          setIsTemplateCustomizerOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={handleSaveCustomizedMessage}
        leadData={leadData}
      />
    </div>
  );
};
