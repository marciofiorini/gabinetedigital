import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { X, Edit, Mail, Phone, MapPin, Calendar, User, Building2, MessageCircle, Heart } from "lucide-react";
import { useTagSync } from "@/hooks/useTagSync";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Contato {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  zona?: string;
  observacoes?: string;
  tags?: string[];
  data_nascimento?: string;
  created_at: string;
  updated_at?: string;
}

interface ContatoDetailsModalOriginalProps {
  contato: Contato | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contato: Contato) => void;
}

export const ContatoDetailsModalOriginal = ({ contato, isOpen, onClose, onEdit }: ContatoDetailsModalOriginalProps) => {
  const { tags } = useTagSync();
  const [activeTab, setActiveTab] = useState("perfil");
  const [mensagemWpp, setMensagemWpp] = useState("");
  const [mensagemInstagram, setMensagemInstagram] = useState("");

  if (!contato) return null;

  const calcularLeadScore = (contato: Contato): number => {
    let score = 0;
    if (contato.email) score += 30;
    if (contato.telefone) score += 25;
    if (contato.endereco) score += 15;
    if (contato.tags && contato.tags.length > 0) score += 20;
    if (contato.observacoes) score += 10;
    return Math.min(score, 100);
  };

  const leadScore = calcularLeadScore(contato);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{contato.nome}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Lead</Badge>
                <span className="text-sm text-gray-600">Score: {leadScore}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onEdit(contato)} className="bg-orange-500 hover:bg-orange-600">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="grid w-full grid-cols-6 bg-transparent">
              <TabsTrigger 
                value="perfil" 
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="tags"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Tags
              </TabsTrigger>
              <TabsTrigger 
                value="followup"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Follow Up
              </TabsTrigger>
              <TabsTrigger 
                value="chat"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="agendamentos"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Agendamentos
              </TabsTrigger>
              <TabsTrigger 
                value="historico"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
              >
                Histórico
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="perfil" className="mt-0">
              <div className="grid grid-cols-2 gap-8">
                {/* Informações Básicas */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    Informações Básicas
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          E-mail
                        </label>
                        <p className="font-medium">{contato.email || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Telefone
                        </label>
                        <p className="font-medium">{contato.telefone || 'Não informado'}</p>
                      </div>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          WhatsApp
                        </label>
                        <p className="font-medium text-green-600">{contato.telefone || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          📷 Instagram
                        </label>
                        <p className="font-medium text-pink-600">Não informado</p>
                      </div>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Região
                        </label>
                        <p className="font-medium">{contato.zona || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-pink-600" />
                          Aniversário
                        </label>
                        <p className="font-medium text-pink-600">
                          {contato.data_nascimento ? new Date(contato.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações Profissionais */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    Informações Profissionais
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Profissão</label>
                        <p className="font-medium">Não informado</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Empresa</label>
                        <p className="font-medium">Não informado</p>
                      </div>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Interesse Principal</label>
                        <p className="font-medium">Infraestrutura</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Origem do Lead</label>
                        <p className="font-medium">Evento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Observações e Notas</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Textarea 
                    placeholder="Adicionar nova observação..."
                    className="border-0 bg-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" className="bg-gray-800 hover:bg-gray-900">
                      Adicionar
                    </Button>
                  </div>
                </div>
                {contato.observacoes ? (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">{contato.observacoes}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-4">Nenhuma observação registrada ainda.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tags" className="mt-0">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  🏷️ Gerenciar Tags
                </h3>
                
                {/* Tags atuais do contato */}
                {contato.tags && contato.tags.length > 0 && (
                  <div className="mb-6">
                    <label className="text-sm text-gray-600 mb-2 block">Tags do Contato:</label>
                    <div className="flex flex-wrap gap-2">
                      {contato.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="default" 
                          className="bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <label className="text-sm text-gray-600 mb-2 block">Tags Disponíveis:</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    <Button size="sm" variant="outline" className="h-6 px-2">
                      + Nova Tag
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="followup" className="mt-0">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    📅 Follow Up
                  </h3>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    + Novo Follow Up
                  </Button>
                </div>
                <p className="text-gray-600">Acompanhamento e agendamento de contatos</p>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <div className="grid grid-cols-2 gap-6">
                {/* WhatsApp */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 h-64 mb-4">
                    <p className="text-center text-gray-600 py-20">
                      Histórico de conversas do WhatsApp aparecerá aqui
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Digite sua mensagem..."
                      value={mensagemWpp}
                      onChange={(e) => setMensagemWpp(e.target.value)}
                      rows={3}
                    />
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar no WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-600">
                    📷 Instagram
                  </h3>
                  <div className="bg-pink-50 rounded-lg p-4 h-64 mb-4">
                    <p className="text-center text-gray-600 py-20">
                      Histórico de conversas do Instagram aparecerá aqui
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Digite sua mensagem..."
                      value={mensagemInstagram}
                      onChange={(e) => setMensagemInstagram(e.target.value)}
                      rows={3}
                    />
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar no Instagram
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agendamentos" className="mt-0">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  ⏰ Agendar Mensagem
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Plataforma</label>
                    <Select defaultValue="whatsapp">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Data e Hora</label>
                    <Input type="datetime-local" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-2 block">Mensagem</label>
                  <Textarea 
                    placeholder="Digite a mensagem que será enviada..."
                    rows={4}
                  />
                </div>
                <Button className="bg-gray-800 hover:bg-gray-900">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Mensagem
                </Button>

                <Separator className="my-8" />

                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-pink-600">
                    <Heart className="w-4 h-4" />
                    Automação de Aniversário
                  </h4>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mensagem automática de aniversário</p>
                        <p className="text-sm text-gray-600">Configure a data de aniversário no perfil</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">Inativa</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historico" className="mt-0">
              <div>
                <h3 className="text-lg font-semibold mb-4">Histórico de Interações</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">WhatsApp</h4>
                        <p className="text-sm text-gray-600">Primeira conversa sobre interesse em saúde pública</p>
                      </div>
                      <span className="text-xs text-gray-500">27/05/2024</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="border-l-4 border-pink-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Instagram</h4>
                        <p className="text-sm text-gray-600">Curtiu post sobre nova UBS</p>
                      </div>
                      <span className="text-xs text-gray-500">25/05/2024</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Evento</h4>
                        <p className="text-sm text-gray-600">Participou da audiência pública sobre mobilidade</p>
                      </div>
                      <span className="text-xs text-gray-500">23/05/2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
