
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  MessageCircle, 
  Instagram, 
  Send, 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Gift,
  User,
  Briefcase,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  nome: string;
  tipo: string;
  email: string;
  telefone: string;
  regiao: string;
  leadScore: number;
  engajamento: string;
  ultimaInteracao: string;
  origem: string;
  interesse: string;
  interacoes: number;
  // Campos adicionais
  whatsapp?: string;
  instagram?: string;
  endereco?: string;
  profissao?: string;
  empresa?: string;
  renda?: string;
  escolaridade?: string;
  estadoCivil?: string;
  filhos?: number;
  dataAniversario?: string;
  redeSocial?: string;
  observacoes?: string;
  tags?: string[];
  historicoInteracoes?: any[];
}

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailsModal = ({ lead, isOpen, onClose }: LeadDetailsModalProps) => {
  const [mensagem, setMensagem] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState<Date>();
  const [plataforma, setPlataforma] = useState("whatsapp");
  const [novaObservacao, setNovaObservacao] = useState("");
  const { toast } = useToast();

  if (!lead) return null;

  const enviarMensagem = () => {
    if (!mensagem.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem antes de enviar",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mensagem enviada!",
      description: `Mensagem enviada via ${plataforma === 'whatsapp' ? 'WhatsApp' : 'Instagram'} para ${lead.nome}`,
    });
    setMensagem("");
  };

  const agendarMensagem = () => {
    if (!mensagem.trim() || !dataAgendamento) {
      toast({
        title: "Erro",
        description: "Preencha a mensagem e a data de agendamento",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mensagem agendada!",
      description: `Mensagem agendada para ${format(dataAgendamento, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
    });
    setMensagem("");
    setDataAgendamento(undefined);
  };

  const adicionarObservacao = () => {
    if (!novaObservacao.trim()) return;
    
    toast({
      title: "Observação adicionada!",
      description: "Nova observação registrada no histórico do lead",
    });
    setNovaObservacao("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{lead.nome}</h2>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-800">{lead.tipo}</Badge>
                <Badge className="bg-green-100 text-green-800">Score: {lead.leadScore}</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>E-mail</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{lead.email}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{lead.telefone}</span>
                      </div>
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{lead.whatsapp || lead.telefone}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-sm">{lead.instagram || 'Não informado'}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Região</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{lead.regiao}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Aniversário</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Gift className="w-4 h-4 text-pink-500" />
                        <span className="text-sm">{lead.dataAniversario || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Profissionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Informações Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label>Profissão</Label>
                      <p className="text-sm text-gray-700">{lead.profissao || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label>Empresa</Label>
                      <p className="text-sm text-gray-700">{lead.empresa || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label>Interesse Principal</Label>
                      <p className="text-sm text-gray-700">{lead.interesse}</p>
                    </div>
                    <div>
                      <Label>Origem do Lead</Label>
                      <p className="text-sm text-gray-700">{lead.origem}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações e Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Adicionar nova observação..."
                      value={novaObservacao}
                      onChange={(e) => setNovaObservacao(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={adicionarObservacao} size="sm">
                      Adicionar
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {lead.observacoes || 'Nenhuma observação registrada ainda.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat WhatsApp */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg min-h-[200px]">
                    <p className="text-sm text-gray-600 text-center">
                      Histórico de conversas do WhatsApp aparecerá aqui
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={plataforma === 'whatsapp' ? mensagem : ''}
                      onChange={(e) => {
                        if (plataforma === 'whatsapp') setMensagem(e.target.value);
                      }}
                      onClick={() => setPlataforma('whatsapp')}
                    />
                    <Button 
                      onClick={enviarMensagem}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={plataforma !== 'whatsapp'}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar no WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Instagram */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-pink-50 p-4 rounded-lg min-h-[200px]">
                    <p className="text-sm text-gray-600 text-center">
                      Histórico de conversas do Instagram aparecerá aqui
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={plataforma === 'instagram' ? mensagem : ''}
                      onChange={(e) => {
                        if (plataforma === 'instagram') setMensagem(e.target.value);
                      }}
                      onClick={() => setPlataforma('instagram')}
                    />
                    <Button 
                      onClick={enviarMensagem}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      disabled={plataforma !== 'instagram'}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar no Instagram
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Agendar Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Plataforma</Label>
                    <Select value={plataforma} onValueChange={setPlataforma}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data e Hora</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {dataAgendamento ? format(dataAgendamento, "dd/MM/yyyy HH:mm", { locale: ptBR }) : "Selecionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataAgendamento}
                          onSelect={setDataAgendamento}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Digite a mensagem que será enviada..."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={agendarMensagem} className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Agendar Mensagem
                </Button>
              </CardContent>
            </Card>

            {/* Automação de Aniversário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  Automação de Aniversário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <div>
                      <p className="font-medium">Mensagem automática de aniversário</p>
                      <p className="text-sm text-gray-600">
                        {lead.dataAniversario ? `Configurada para ${lead.dataAniversario}` : 'Configure a data de aniversário no perfil'}
                      </p>
                    </div>
                  </div>
                  <Badge className={lead.dataAniversario ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                    {lead.dataAniversario ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Interações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { data: "27/05/2024", tipo: "WhatsApp", mensagem: "Primeira conversa sobre interesse em saúde pública" },
                    { data: "25/05/2024", tipo: "Instagram", mensagem: "Curtiu post sobre nova UBS" },
                    { data: "23/05/2024", tipo: "Evento", mensagem: "Participou da audiência pública sobre mobilidade" },
                  ].map((interacao, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{interacao.tipo}</p>
                          <p className="text-sm text-gray-600">{interacao.mensagem}</p>
                        </div>
                        <span className="text-xs text-gray-500">{interacao.data}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
